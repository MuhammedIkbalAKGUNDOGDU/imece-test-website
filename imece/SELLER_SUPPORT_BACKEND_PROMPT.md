# Satıcı Destek Sistemi - Django Backend Geliştirme Rehberi

## Genel Bakış
Satıcıların destek talebi oluşturabileceği, adminlerin bu talepleri görüntüleyip durumlarını değiştirebileceği basit bir Django REST Framework API endpoint'i oluşturulması gerekiyor. Bu sistem müşteri destek sistemine benzer ama daha basittir (görev atama yok).

## Proje Yapısı

### Django App Oluşturma
Eğer ayrı bir app istiyorsanız:
```bash
python manage.py startapp seller_support
```

Veya mevcut `support` app'ine ekleyebilirsiniz. Bu prompt ayrı app olarak devam ediyor.

### settings.py Ayarları
```python
INSTALLED_APPS = [
    # ... diğer app'ler
    'seller_support',  # veya 'support' içine eklenecekse bu satırı atlayın
    # ... rest_framework, admin vb.
]

# Media ayarları
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Satıcı destek ticket dosyaları için
SELLER_SUPPORT_TICKET_UPLOAD_DIR = 'seller_support_tickets/'
```

## Models (models.py)

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import FileExtensionValidator
import os

User = get_user_model()

class SellerSupportTicket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Beklemede'),
        ('in_progress', 'İşlemde'),
        ('resolved', 'Çözüldü'),
        ('closed', 'Kapatıldı'),
    ]
    
    SUBJECT_CHOICES = [
        ('Hesap Sorunu', 'Hesap Sorunu'),
        ('Ödeme Sorunu', 'Ödeme Sorunu'),
        ('Ürün Yönetimi', 'Ürün Yönetimi'),
        ('Sipariş Sorunu', 'Sipariş Sorunu'),
        ('Teknik Destek', 'Teknik Destek'),
        ('Diğer', 'Diğer'),
    ]
    
    ticket_number = models.CharField(
        max_length=20, 
        unique=True, 
        db_index=True,
        verbose_name="Ticket Numarası"
    )
    seller = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='seller_support_tickets',
        verbose_name="Satıcı",
        limit_choices_to={'rol': 'satici'}  # Sadece satıcılar
    )
    name = models.CharField(max_length=100, verbose_name="Ad Soyad")
    email = models.EmailField(verbose_name="E-posta")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefon")
    subject = models.CharField(
        max_length=100, 
        choices=SUBJECT_CHOICES,
        verbose_name="Konu"
    )
    message = models.TextField(verbose_name="Mesaj")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        db_index=True,
        verbose_name="Durum"
    )
    attachment = models.FileField(
        upload_to='seller_support_tickets/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
            )
        ],
        verbose_name="Ek Dosya"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Güncellenme Tarihi")
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name="Çözülme Tarihi")
    
    class Meta:
        verbose_name = "Satıcı Destek Talebi"
        verbose_name_plural = "Satıcı Destek Talepleri"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['seller', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = self.generate_ticket_number()
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        elif self.status != 'resolved':
            self.resolved_at = None
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_ticket_number():
        """Ticket numarası oluştur: SEL-YYYY-XXXXXX"""
        from django.db.models import Max
        current_year = timezone.now().year
        prefix = f"SEL-{current_year}-"
        
        # Aynı yıl içindeki son ticket numarasını bul
        last_ticket = SellerSupportTicket.objects.filter(
            ticket_number__startswith=prefix
        ).aggregate(Max('ticket_number'))
        
        if last_ticket['ticket_number__max']:
            last_number = int(last_ticket['ticket_number__max'].split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        return f"{prefix}{new_number:06d}"
    
    def get_attachment_filename(self):
        """Dosya adını döndür"""
        if self.attachment:
            return os.path.basename(self.attachment.name)
        return None
```

## Migrations

### Migration Dosyası Oluşturma
```bash
python manage.py makemigrations seller_support
python manage.py migrate seller_support
```

## Serializers (serializers.py)

```python
from rest_framework import serializers
from .models import SellerSupportTicket
from django.core.validators import validate_email
import re

class SellerSupportTicketSerializer(serializers.ModelSerializer):
    attachment = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = SellerSupportTicket
        fields = [
            'name', 'email', 'phone', 'subject', 
            'message', 'attachment'
        ]
        extra_kwargs = {
            'name': {
                'min_length': 2,
                'max_length': 100,
            },
            'message': {
                'min_length': 10,
                'max_length': 2000,
            },
        }
    
    def validate_name(self, value):
        """Ad soyad validasyonu"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Ad soyad en az 2 karakter olmalıdır.")
        if not re.match(r'^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$', value):
            raise serializers.ValidationError("Ad soyad sadece harf içerebilir.")
        return value.strip()
    
    def validate_email(self, value):
        """E-posta validasyonu"""
        try:
            validate_email(value)
        except:
            raise serializers.ValidationError("Geçerli bir e-posta adresi girin.")
        return value.lower().strip()
    
    def validate_phone(self, value):
        """Telefon validasyonu (opsiyonel)"""
        if value:
            cleaned = re.sub(r'[\s\+\-]', '', value)
            if not cleaned.isdigit() or len(cleaned) < 10:
                raise serializers.ValidationError("Geçerli bir telefon numarası girin.")
        return value
    
    def validate_message(self, value):
        """Mesaj validasyonu"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Mesaj en az 10 karakter olmalıdır.")
        if len(value) > 2000:
            raise serializers.ValidationError("Mesaj en fazla 2000 karakter olabilir.")
        return value.strip()
    
    def validate_attachment(self, value):
        """Dosya validasyonu"""
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Dosya boyutu 5MB'dan büyük olamaz.")
            
            allowed_types = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png',
            ]
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    "Sadece PDF, DOC, DOCX, JPG, JPEG, PNG dosyaları yüklenebilir."
                )
        return value

class SellerSupportTicketListSerializer(serializers.ModelSerializer):
    """Admin ve liste görünümleri için"""
    seller_email = serializers.EmailField(source='seller.email', read_only=True)
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)
    attachment_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SellerSupportTicket
        fields = [
            'id', 'ticket_number', 'name', 'email', 'phone',
            'subject', 'message', 'status', 'seller', 'seller_email',
            'seller_name', 'attachment', 'attachment_name',
            'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['ticket_number', 'created_at', 'updated_at']
    
    def get_attachment_name(self, obj):
        return obj.get_attachment_filename()
```

## Views (views.py)

```python
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import SellerSupportTicket
from .serializers import SellerSupportTicketSerializer, SellerSupportTicketListSerializer
from django.db.models import Q

class SellerSupportTicketViewSet(viewsets.ModelViewSet):
    """
    Satıcı destek ticket'ları için ViewSet
    - Satıcılar: Sadece kendi ticket'larını oluşturabilir ve görebilir
    - Adminler: Tüm ticket'ları görebilir ve durum değiştirebilir
    """
    queryset = SellerSupportTicket.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SellerSupportTicketListSerializer
        return SellerSupportTicketSerializer
    
    def get_permissions(self):
        """
        - POST (create): Sadece satıcılar (IsAuthenticated + rol kontrolü)
        - GET (list, retrieve): Satıcılar kendi ticket'larını, adminler tümünü
        - PATCH (update_status): Sadece adminler
        """
        if self.action == 'create':
            return [IsAuthenticated()]
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]
    
    def get_queryset(self):
        """
        Satıcılar sadece kendi ticket'larını görür
        Adminler tüm ticket'ları görür
        """
        user = self.request.user
        
        # Admin ise tüm ticket'ları göster
        if user.is_staff or user.is_superuser:
            queryset = SellerSupportTicket.objects.all()
        else:
            # Satıcı ise sadece kendi ticket'larını göster
            if hasattr(user, 'rol') and user.rol == 'satici':
                queryset = SellerSupportTicket.objects.filter(seller=user)
            else:
                # Satıcı değilse boş queryset
                queryset = SellerSupportTicket.objects.none()
        
        # Filtreleme
        status_filter = self.request.query_params.get('status', None)
        subject_filter = self.request.query_params.get('subject', None)
        search_term = self.request.query_params.get('search', None)
        
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        if subject_filter and subject_filter != 'all':
            queryset = queryset.filter(subject=subject_filter)
        
        if search_term:
            queryset = queryset.filter(
                Q(ticket_number__icontains=search_term) |
                Q(name__icontains=search_term) |
                Q(email__icontains=search_term) |
                Q(message__icontains=search_term)
            )
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Satıcılar yeni ticket oluşturabilir
        """
        user = request.user
        
        # Sadece satıcılar ticket oluşturabilir
        if not (hasattr(user, 'rol') and user.rol == 'satici'):
            return Response(
                {'error': 'Sadece satıcılar destek talebi oluşturabilir.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Seller'ı otomatik ata
        ticket = serializer.save(seller=user)
        
        # E-posta bildirimi (opsiyonel)
        try:
            send_mail(
                subject=f'Yeni Satıcı Destek Talebi: {ticket.ticket_number}',
                message=f'Satıcı {ticket.name} ({ticket.email}) yeni bir destek talebi oluşturdu.\n\nKonu: {ticket.subject}\nMesaj: {ticket.message}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL] if hasattr(settings, 'ADMIN_EMAIL') else [],
                fail_silently=True,
            )
        except Exception as e:
            print(f"E-posta gönderilemedi: {e}")
        
        return Response(
            {
                'status': 'success',
                'message': 'Destek talebi başarıyla oluşturuldu.',
                'ticket_number': ticket.ticket_number,
                'data': SellerSupportTicketListSerializer(ticket).data
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """
        Adminler ticket durumunu güncelleyebilir
        """
        ticket = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'status alanı gereklidir.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in dict(SellerSupportTicket.STATUS_CHOICES).keys():
            return Response(
                {'error': 'Geçersiz durum değeri.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.status = new_status
        ticket.save()
        
        # E-posta bildirimi (opsiyonel)
        try:
            send_mail(
                subject=f'Ticket Durumu Güncellendi: {ticket.ticket_number}',
                message=f'Ticket durumunuz "{dict(SellerSupportTicket.STATUS_CHOICES)[new_status]}" olarak güncellendi.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"E-posta gönderilemedi: {e}")
        
        return Response(
            {
                'status': 'success',
                'message': 'Ticket durumu güncellendi.',
                'data': SellerSupportTicketListSerializer(ticket).data
            },
            status=status.HTTP_200_OK
        )
    
    def update(self, request, *args, **kwargs):
        """
        Update işlemi sadece adminler için ve sadece status güncellemesi için
        """
        return Response(
            {'error': 'Bu işlem için update_status endpoint\'ini kullanın.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def destroy(self, request, *args, **kwargs):
        """
        Ticket silme işlemi yok
        """
        return Response(
            {'error': 'Ticket silme işlemi desteklenmiyor.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
```

## URLs (urls.py)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerSupportTicketViewSet

router = DefaultRouter()
router.register(r'tickets', SellerSupportTicketViewSet, basename='seller-support-ticket')

urlpatterns = [
    path('api/seller-support/', include(router.urls)),
]
```

## Admin Panel (admin.py)

```python
from django.contrib import admin
from .models import SellerSupportTicket

@admin.register(SellerSupportTicket)
class SellerSupportTicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_number', 'seller', 'name', 'email', 
        'subject', 'status', 'created_at', 'resolved_at'
    ]
    list_filter = ['status', 'subject', 'created_at']
    search_fields = [
        'ticket_number', 'name', 'email', 
        'seller__email', 'seller__username', 'message'
    ]
    readonly_fields = [
        'ticket_number', 'seller', 'created_at', 
        'updated_at', 'resolved_at'
    ]
    fieldsets = (
        ('Ticket Bilgileri', {
            'fields': ('ticket_number', 'seller', 'status')
        }),
        ('İletişim Bilgileri', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Talep Detayları', {
            'fields': ('subject', 'message', 'attachment')
        }),
        ('Tarih Bilgileri', {
            'fields': ('created_at', 'updated_at', 'resolved_at')
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('seller')
    
    actions = ['mark_as_resolved', 'mark_as_closed']
    
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='resolved', resolved_at=timezone.now())
        self.message_user(request, f'{updated} ticket çözüldü olarak işaretlendi.')
    mark_as_resolved.short_description = "Seçili ticket'ları çözüldü olarak işaretle"
    
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} ticket kapatıldı olarak işaretlendi.')
    mark_as_closed.short_description = "Seçili ticket'ları kapatıldı olarak işaretle"
```

## Güvenlik ve İzinler

### Permission Kontrolleri
1. **Ticket Oluşturma**: Sadece `rol='satici'` olan kullanıcılar
2. **Ticket Listeleme**: 
   - Satıcılar: Sadece kendi ticket'larını
   - Adminler: Tüm ticket'ları
3. **Durum Güncelleme**: Sadece adminler (`is_staff=True` veya `is_superuser=True`)

### API Key Kontrolü
Mevcut projenizde `X-API-Key` header kontrolü varsa, views.py'de middleware veya decorator ile kontrol edin.

## Test Senaryoları

### 1. Satıcı Ticket Oluşturma
```bash
POST /api/seller-support/tickets/
Headers:
  Content-Type: multipart/form-data
  X-API-Key: {api_key}
  Authorization: Bearer {seller_token}

Body:
  name: "Ahmet Yılmaz"
  email: "ahmet@example.com"
  phone: "05551234567"
  subject: "Hesap Sorunu"
  message: "Hesabımda bir sorun var"
  attachment: (file, optional)
```

### 2. Satıcı Kendi Ticket'larını Listeleme
```bash
GET /api/seller-support/tickets/
Headers:
  Content-Type: application/json
  X-API-Key: {api_key}
  Authorization: Bearer {seller_token}
```

### 3. Admin Tüm Ticket'ları Listeleme
```bash
GET /api/seller-support/tickets/
Headers:
  Content-Type: application/json
  X-API-Key: {api_key}
  Authorization: Bearer {admin_token}
```

### 4. Admin Durum Güncelleme
```bash
PATCH /api/seller-support/tickets/{id}/update_status/
Headers:
  X-API-Key: {api_key}
  Authorization: Bearer {admin_token}

Body (FormData):
  status: "in_progress"
```

### 5. Filtreleme ve Arama
```bash
GET /api/seller-support/tickets/?status=pending&subject=Hesap%20Sorunu&search=ahmet
```

## Önemli Notlar

1. **Rol Kontrolü**: User modelinde `rol` field'ı olmalı ve `'satici'` değerine sahip olmalı
2. **Dosya Yükleme**: `MEDIA_ROOT` ve `MEDIA_URL` ayarları yapılmalı
3. **E-posta Bildirimleri**: `settings.DEFAULT_FROM_EMAIL` ve `settings.ADMIN_EMAIL` ayarlanmalı (opsiyonel)
4. **API Key**: Mevcut projenizde API key kontrolü varsa, tüm endpoint'lere eklenmeli
5. **CORS**: Frontend'den erişim için CORS ayarları yapılmalı

## Veritabanı Şeması Önerisi

```sql
CREATE TABLE seller_support_ticket (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    seller_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    attachment VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    INDEX idx_status_created (status, created_at DESC),
    INDEX idx_seller_created (seller_id, created_at DESC)
);
```

