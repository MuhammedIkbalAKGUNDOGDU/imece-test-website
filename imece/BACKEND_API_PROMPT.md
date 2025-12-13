# Müşteri Hizmetleri Destek Formu - Django Backend Geliştirme Rehberi

## Genel Bakış
Kullanıcıların müşteri hizmetlerine destek talebi gönderebileceği bir Django REST Framework API endpoint'i oluşturulması gerekiyor. Bu API, form verilerini alacak, veritabanına kaydedecek, admin panelinden yönetilebilecek ve gerekirse e-posta bildirimi gönderecektir.

## Proje Yapısı

### Django App Oluşturma
```bash
python manage.py startapp support
```

### settings.py Ayarları
```python
INSTALLED_APPS = [
    # ... diğer app'ler
    'support',
    # ... rest_framework, admin vb.
]

# Media ayarları
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Support ticket dosyaları için
SUPPORT_TICKET_UPLOAD_DIR = 'support_tickets/'
```

## Models (models.py)

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import FileExtensionValidator
import os

User = get_user_model()

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Beklemede'),
        ('in_progress', 'İşlemde'),
        ('resolved', 'Çözüldü'),
        ('closed', 'Kapatıldı'),
    ]
    
    SUBJECT_CHOICES = [
        ('Sipariş Sorunu', 'Sipariş Sorunu'),
        ('Ürün Hakkında Soru', 'Ürün Hakkında Soru'),
        ('Ödeme Sorunu', 'Ödeme Sorunu'),
        ('Hesap Sorunu', 'Hesap Sorunu'),
        ('Teknik Destek', 'Teknik Destek'),
        ('İade/İptal', 'İade/İptal'),
        ('Diğer', 'Diğer'),
    ]
    
    ticket_number = models.CharField(
        max_length=20, 
        unique=True, 
        db_index=True,
        verbose_name="Ticket Numarası"
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='support_tickets',
        verbose_name="Kullanıcı"
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
        upload_to='support_tickets/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
            )
        ],
        verbose_name="Ek Dosya"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets',
        verbose_name="Atanan Personel"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="İç Notlar",
        help_text="Bu notlar kullanıcıya gösterilmez"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Güncellenme Tarihi")
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name="Çözülme Tarihi")
    
    class Meta:
        verbose_name = "Destek Talebi"
        verbose_name_plural = "Destek Talepleri"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['user', '-created_at']),
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
        """Ticket numarası oluştur: SUP-YYYY-XXXXXX"""
        from django.db.models import Max
        current_year = timezone.now().year
        prefix = f"SUP-{current_year}-"
        
        # Aynı yıl içindeki son ticket numarasını bul
        last_ticket = SupportTicket.objects.filter(
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
python manage.py makemigrations support
python manage.py migrate support
```

### İlk Migration (0001_initial.py) - Django otomatik oluşturacak
Migration dosyası Django tarafından otomatik oluşturulacak. Manuel müdahale gerekmez.

## Serializers (serializers.py)

```python
from rest_framework import serializers
from .models import SupportTicket
from django.core.validators import validate_email
import re

class SupportTicketSerializer(serializers.ModelSerializer):
    attachment = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = SupportTicket
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
        # Sadece harf, boşluk ve Türkçe karakterler
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
            # Sadece rakam, boşluk, + ve - karakterleri
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
            # Dosya boyutu kontrolü (5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Dosya boyutu 5MB'dan büyük olamaz.")
            
            # MIME type kontrolü
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

class SupportTicketListSerializer(serializers.ModelSerializer):
    """Admin ve liste görünümleri için"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    assigned_to_email = serializers.EmailField(
        source='assigned_to.email', 
        read_only=True,
        allow_null=True
    )
    attachment_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'name', 'email', 'phone',
            'subject', 'message', 'status', 'user', 'user_email',
            'assigned_to', 'assigned_to_email', 'attachment',
            'attachment_name', 'notes', 'created_at', 'updated_at',
            'resolved_at'
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
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import SupportTicket
from .serializers import SupportTicketSerializer, SupportTicketListSerializer
from django.db.models import Q

class SupportTicketViewSet(viewsets.ModelViewSet):
    """
    Destek talepleri için ViewSet
    """
    queryset = SupportTicket.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update']:
            return SupportTicketListSerializer
        return SupportTicketSerializer
    
    def get_permissions(self):
        """
        POST: Herkes (AllowAny)
        GET, PUT, PATCH, DELETE: Sadece admin (IsAdminUser)
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Admin: Tüm ticket'ları görebilir
        Kullanıcı: Sadece kendi ticket'larını görebilir (ileride eklenebilir)
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return SupportTicket.objects.all()
        elif user.is_authenticated:
            return SupportTicket.objects.filter(user=user)
        return SupportTicket.objects.none()
    
    def create(self, request, *args, **kwargs):
        """
        Yeni destek talebi oluştur
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Eğer kullanıcı giriş yapmışsa user_id'yi ekle
        if request.user.is_authenticated:
            serializer.save(user=request.user)
        else:
            serializer.save()
        
        ticket = serializer.instance
        
        # E-posta gönder (async olarak yapılabilir)
        self.send_confirmation_email(ticket)
        
        return Response({
            'status': 'success',
            'message': 'Destek talebiniz başarıyla oluşturuldu',
            'data': {
                'ticket_id': ticket.ticket_number,
                'ticket_number': ticket.ticket_number,
                'created_at': ticket.created_at.isoformat(),
                'estimated_response_time': '24 saat içinde'
            }
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """
        Ticket durumunu güncelle
        """
        ticket = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(SupportTicket.STATUS_CHOICES):
            return Response({
                'status': 'error',
                'message': 'Geçersiz durum'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        ticket.status = new_status
        ticket.save()
        
        serializer = self.get_serializer(ticket)
        return Response({
            'status': 'success',
            'message': 'Ticket durumu güncellendi',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def assign(self, request, pk=None):
        """
        Ticket'ı bir personele ata
        """
        ticket = self.get_object()
        user_id = request.data.get('assigned_to')
        
        if user_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(id=user_id)
                ticket.assigned_to = user
            except User.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Kullanıcı bulunamadı'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            ticket.assigned_to = None
        
        ticket.save()
        
        serializer = self.get_serializer(ticket)
        return Response({
            'status': 'success',
            'message': 'Ticket atandı',
            'data': serializer.data
        })
    
    def send_confirmation_email(self, ticket):
        """
        Kullanıcıya onay e-postası gönder
        """
        try:
            subject = f'Destek Talebiniz Alındı - {ticket.ticket_number}'
            message = f"""
            Sayın {ticket.name},
            
            Destek talebiniz başarıyla oluşturuldu.
            
            Ticket Numarası: {ticket.ticket_number}
            Konu: {ticket.subject}
            Durum: {ticket.get_status_display()}
            
            Tahmini yanıt süresi: 24 saat içinde
            
            İyi günler dileriz.
            İmeceHub Destek Ekibi
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [ticket.email],
                fail_silently=False,
            )
        except Exception as e:
            # E-posta gönderim hatası loglanabilir
            print(f"E-posta gönderim hatası: {e}")
```

## Admin Panel (admin.py)

```python
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import SupportTicket

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_number', 'subject', 'name', 'email', 
        'status_badge', 'assigned_to', 'created_at', 'actions'
    ]
    list_filter = ['status', 'subject', 'created_at', 'assigned_to']
    search_fields = [
        'ticket_number', 'name', 'email', 'phone', 
        'subject', 'message'
    ]
    readonly_fields = [
        'ticket_number', 'created_at', 'updated_at', 
        'resolved_at', 'attachment_preview'
    ]
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('ticket_number', 'user', 'name', 'email', 'phone')
        }),
        ('Talep Detayları', {
            'fields': ('subject', 'message', 'attachment', 'attachment_preview')
        }),
        ('Yönetim', {
            'fields': ('status', 'assigned_to', 'notes')
        }),
        ('Tarih Bilgileri', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Durum için renkli badge"""
        colors = {
            'pending': 'orange',
            'in_progress': 'blue',
            'resolved': 'green',
            'closed': 'gray',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Durum'
    
    def attachment_preview(self, obj):
        """Dosya önizleme"""
        if obj.attachment:
            url = obj.attachment.url
            filename = obj.get_attachment_filename()
            return format_html(
                '<a href="{}" target="_blank">{}</a>',
                url,
                filename
            )
        return "-"
    attachment_preview.short_description = "Ek Dosya"
    
    def actions(self, obj):
        """Hızlı aksiyonlar"""
        html = '<div style="display: flex; gap: 5px;">'
        
        # Durum güncelleme butonları
        if obj.status != 'in_progress':
            html += f'''
            <a href="/admin/support/supportticket/{obj.id}/change/?status=in_progress" 
               style="background: blue; color: white; padding: 3px 8px; text-decoration: none; border-radius: 3px; font-size: 11px;">
               İşleme Al
            </a>
            '''
        
        if obj.status != 'resolved':
            html += f'''
            <a href="/admin/support/supportticket/{obj.id}/change/?status=resolved" 
               style="background: green; color: white; padding: 3px 8px; text-decoration: none; border-radius: 3px; font-size: 11px;">
               Çözüldü
            </a>
            '''
        
        if obj.status != 'closed':
            html += f'''
            <a href="/admin/support/supportticket/{obj.id}/change/?status=closed" 
               style="background: gray; color: white; padding: 3px 8px; text-decoration: none; border-radius: 3px; font-size: 11px;">
               Kapat
            </a>
            '''
        
        html += '</div>'
        return format_html(html)
    actions.short_description = 'İşlemler'
    
    def get_queryset(self, request):
        """Optimize edilmiş queryset"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'assigned_to')
    
    def save_model(self, request, obj, form, change):
        """Model kaydedilirken özel işlemler"""
        if change and 'status' in form.changed_data:
            # Durum değişikliği loglanabilir
            pass
        super().save_model(request, obj, form, change)
    
    # Özel aksiyonlar
    actions_list = ['mark_as_resolved', 'mark_as_closed']
    
    @admin.action(description='Seçili ticketları çözüldü olarak işaretle')
    def mark_as_resolved(self, request, queryset):
        updated = queryset.update(status='resolved')
        self.message_user(
            request,
            f'{updated} ticket çözüldü olarak işaretlendi.'
        )
    
    @admin.action(description='Seçili ticketları kapat')
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(
            request,
            f'{updated} ticket kapatıldı.'
        )
```

## URLs (urls.py)

### support/urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupportTicketViewSet

router = DefaultRouter()
router.register(r'tickets', SupportTicketViewSet, basename='support-ticket')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Ana urls.py'ye ekleme
```python
# Ana proje urls.py
urlpatterns = [
    # ... diğer url'ler
    path('api/support/', include('support.urls')),
]
```

## API Endpoints

### POST `/api/support/tickets/`
Yeni destek talebi oluştur

**Request:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+90 555 123 45 67",
  "subject": "Sipariş Sorunu",
  "message": "Siparişim henüz gelmedi, durumunu kontrol edebilir misiniz?",
  "attachment": [file]
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Destek talebiniz başarıyla oluşturuldu",
  "data": {
    "ticket_id": "SUP-2024-001234",
    "ticket_number": "SUP-2024-001234",
    "created_at": "2024-01-15T10:30:00Z",
    "estimated_response_time": "24 saat içinde"
  }
}
```

### GET `/api/support/tickets/` (Admin only)
Tüm ticket'ları listele

### GET `/api/support/tickets/{id}/` (Admin only)
Ticket detayını göster

### PATCH `/api/support/tickets/{id}/update_status/` (Admin only)
Ticket durumunu güncelle
```json
{
  "status": "in_progress"
}
```

### PATCH `/api/support/tickets/{id}/assign/` (Admin only)
Ticket'ı personele ata
```json
{
  "assigned_to": 5
}
```

## Admin Panel Özellikleri

1. **Liste Görünümü:**
   - Ticket numarası, konu, isim, e-posta
   - Renkli durum badge'leri
   - Filtreleme (durum, konu, tarih, atanan personel)
   - Arama (ticket numarası, isim, e-posta, konu, mesaj)
   - Hızlı aksiyon butonları

2. **Detay Görünümü:**
   - Tüm ticket bilgileri
   - Dosya önizleme ve indirme
   - Durum güncelleme
   - Personel atama
   - İç notlar ekleme

3. **Toplu İşlemler:**
   - Seçili ticketları çözüldü olarak işaretle
   - Seçili ticketları kapat

## Güvenlik

1. **Rate Limiting:** `django-ratelimit` kullanılabilir
2. **File Upload Security:** Validators ile kontrol
3. **XSS Protection:** Django otomatik escape eder
4. **CSRF Protection:** DRF otomatik sağlar
5. **Permission Control:** ViewSet'te tanımlı

## Test Senaryoları

### 1. Ticket Oluşturma
```python
# tests.py
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class SupportTicketTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    def test_create_ticket(self):
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'subject': 'Sipariş Sorunu',
            'message': 'Test mesajı burada yer alıyor'
        }
        response = self.client.post('/api/support/tickets/', data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('ticket_number', response.data['data'])
```

## Migration Komutları

```bash
# Migration oluştur
python manage.py makemigrations support

# Migration'ı uygula
python manage.py migrate support

# Migration'ı geri al (gerekirse)
python manage.py migrate support zero
```

## Notlar

- Ticket numarası otomatik oluşturulur
- Dosyalar `media/support_tickets/` klasörüne kaydedilir
- E-posta gönderimi sync yapılıyor, production'da Celery kullanılabilir
- Admin panelinde filtreleme ve arama optimize edilmiştir
- Tüm tarih/saat değerleri Django'nun timezone ayarlarına göre saklanır
