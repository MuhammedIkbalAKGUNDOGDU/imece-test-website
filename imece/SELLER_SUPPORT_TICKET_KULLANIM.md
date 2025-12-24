# Seller Support Ticket API - Kullanım Dokümantasyonu

**Base URL:** `http://localhost:8000/api/support`

---

## 📋 Genel Bilgiler

### Açıklama
Satıcılar için özel destek talepleri API'si. Sadece satıcılar ticket oluşturabilir, adminler yönetebilir.

### Yetkilendirme
- **Oluşturma (POST):** Sadece Satıcılar (JWT token gerekli)
- **Listeleme/Görüntüleme (GET):** Sadece Admin
- **Güncelleme (PATCH/PUT):** Sadece Admin

---

## 🔵 1. Satıcı Destek Talebi Oluşturma

### Endpoint
```
POST /api/support/seller-tickets/
```

### Yetki
- ✅ Sadece Satıcılar (`rol == 'satici'`)
- ❌ Alıcılar erişemez
- ❌ Giriş yapmamış kullanıcılar erişemez

### Headers
```
Authorization: Bearer SELLER_JWT_TOKEN
Content-Type: application/json
```

### Request Body (JSON veya Form Data)

#### JSON Format:
```json
{
  "subject": "Sipariş Sorunu",
  "message": "Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum."
}
```

#### Form Data (Dosya ile):
```
subject: Sipariş Sorunu
message: Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum.
attachment: [file]
```

### Gerekli Alanlar

| Alan | Tip | Açıklama | Validasyon |
|------|-----|----------|------------|
| `subject` | string | Konu | Seçeneklerden biri |
| `message` | text | Mesaj | Min: 10 karakter |
| `attachment` | file | Ek dosya (opsiyonel) | PDF, DOC, DOCX, JPG, JPEG, PNG, Max: 5MB |

### Subject Seçenekleri
- `"Sipariş Sorunu"`
- `"Ürün Hakkında Soru"`
- `"Ödeme Sorunu"`
- `"Hesap Sorunu"`
- `"Teknik Destek"`
- `"İade/İptal"`
- `"Diğer"`

### Response (201 Created)
```json
{
  "status": "success",
  "ticket_number": "SEL-2024-000001"
}
```

### Hata Response'ları

#### 403 Forbidden (Satıcı değil):
```json
{
  "error": "Sadece satıcılar ticket oluşturabilir."
}
```

#### 401 Unauthorized (Token yok):
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### 400 Bad Request (Validation hatası):
```json
{
  "message": ["Mesaj en az 10 karakter olmalıdır."],
  "attachment": ["Dosya boyutu 5MB'dan büyük olamaz."]
}
```

---

## 📤 2. Satıcı Ticket'larını Listeleme (Admin)

### Endpoint
```
GET /api/support/seller-tickets/
```

### Yetki
- ✅ Sadece Admin

### Headers
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

### Query Parameters (Filtreleme)
- `status` - Durum filtresi (pending, in_progress, resolved, closed)
- `subject` - Konu filtresi
- `seller` - Satıcı ID filtresi
- `ordering` - Sıralama (-created_at, created_at, status)

### Response (200 OK)
```json
[
  {
    "id": 1,
    "ticket_number": "SEL-2024-000001",
    "seller": 5,
    "seller_username": "seller_user",
    "subject": "Sipariş Sorunu",
    "message": "Satıcı olarak bir sorunum var...",
    "status": "pending",
    "attachment": null,
    "notes": null,
    "created_at": "2024-12-19T15:00:00Z",
    "updated_at": "2024-12-19T15:00:00Z",
    "resolved_at": null
  },
  {
    "id": 2,
    "ticket_number": "SEL-2024-000002",
    "seller": 7,
    "seller_username": "another_seller",
    "subject": "Ödeme Sorunu",
    "message": "Ödeme işlemimde sorun var...",
    "status": "in_progress",
    "attachment": "/media/seller_support_tickets/20241219120000_file.pdf",
    "notes": "İnceleniyor...",
    "created_at": "2024-12-19T14:00:00Z",
    "updated_at": "2024-12-19T14:30:00Z",
    "resolved_at": null
  }
]
```

---

## 📤 3. Satıcı Ticket Detayı (Admin)

### Endpoint
```
GET /api/support/seller-tickets/{id}/
```

### Yetki
- ✅ Sadece Admin

### Response (200 OK)
```json
{
  "id": 1,
  "ticket_number": "SEL-2024-000001",
  "seller": 5,
  "seller_username": "seller_user",
  "subject": "Sipariş Sorunu",
  "message": "Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum.",
  "status": "pending",
  "attachment": null,
  "notes": null,
  "created_at": "2024-12-19T15:00:00Z",
  "updated_at": "2024-12-19T15:00:00Z",
  "resolved_at": null
}
```

---

## ✏️ 4. Satıcı Ticket Güncelleme (Admin)

### Endpoint
```
PATCH /api/support/seller-tickets/{id}/
PUT /api/support/seller-tickets/{id}/
```

### Yetki
- ✅ Sadece Admin

### Request Body
```json
{
  "status": "in_progress",
  "notes": "İnceleniyor. Stok güncelleme sorunu araştırılıyor."
}
```

### Güncellenebilen Alanlar
- `status` - Durum (pending, in_progress, resolved, closed)
- `notes` - İç notlar (kullanıcıya gösterilmez)

### Status Seçenekleri
- `"pending"` - Beklemede
- `"in_progress"` - İşlemde
- `"resolved"` - Çözüldü
- `"closed"` - Kapatıldı

### Response (200 OK)
```json
{
  "id": 1,
  "ticket_number": "SEL-2024-000001",
  "seller": 5,
  "seller_username": "seller_user",
  "subject": "Sipariş Sorunu",
  "message": "Satıcı olarak bir sorunum var...",
  "status": "in_progress",
  "attachment": null,
  "notes": "İnceleniyor. Stok güncelleme sorunu araştırılıyor.",
  "created_at": "2024-12-19T15:00:00Z",
  "updated_at": "2024-12-19T15:30:00Z",
  "resolved_at": null
}
```

### Özel Durum: Status = "resolved"
Eğer status `"resolved"` olarak güncellenirse, `resolved_at` alanı otomatik olarak doldurulur.

---

## 💻 Kullanım Örnekleri

### JavaScript (Fetch API)

#### Satıcı Ticket Oluşturma:
```javascript
const token = localStorage.getItem('sellerToken');

// JSON ile
fetch('http://localhost:8000/api/support/seller-tickets/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subject: 'Sipariş Sorunu',
    message: 'Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum.'
  })
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Ticket oluşturuldu:', data.ticket_number);
  } else {
    console.error('Hata:', data.error);
  }
})
.catch(error => console.error('Error:', error));

// Dosya ile (FormData)
const formData = new FormData();
formData.append('subject', 'Sipariş Sorunu');
formData.append('message', 'Satıcı olarak bir sorunum var.');
formData.append('attachment', fileInput.files[0]); // File input

fetch('http://localhost:8000/api/support/seller-tickets/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Content-Type header'ını eklemeyin, browser otomatik ekler
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Admin - Ticket Listeleme:
```javascript
const adminToken = localStorage.getItem('adminToken');

fetch('http://localhost:8000/api/support/seller-tickets/?status=pending', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
})
.then(response => response.json())
.then(tickets => {
  console.log('Bekleyen ticket sayısı:', tickets.length);
  tickets.forEach(ticket => {
    console.log(`${ticket.ticket_number} - ${ticket.subject} (${ticket.seller_username})`);
  });
})
.catch(error => console.error('Error:', error));
```

#### Admin - Ticket Güncelleme:
```javascript
const adminToken = localStorage.getItem('adminToken');

fetch('http://localhost:8000/api/support/seller-tickets/1/', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'in_progress',
    notes: 'İnceleniyor. Stok güncelleme sorunu araştırılıyor.'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Ticket güncellendi:', data);
})
.catch(error => console.error('Error:', error));
```

### cURL

#### Satıcı Ticket Oluşturma:
```bash
# JSON ile
curl -X POST http://localhost:8000/api/support/seller-tickets/ \
  -H "Authorization: Bearer SELLER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Sipariş Sorunu",
    "message": "Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum."
  }'

# Dosya ile
curl -X POST http://localhost:8000/api/support/seller-tickets/ \
  -H "Authorization: Bearer SELLER_JWT_TOKEN" \
  -F "subject=Sipariş Sorunu" \
  -F "message=Satıcı olarak bir sorunum var." \
  -F "attachment=@/path/to/file.pdf"
```

#### Admin - Ticket Listeleme:
```bash
curl -X GET "http://localhost:8000/api/support/seller-tickets/?status=pending" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### Admin - Ticket Güncelleme:
```bash
curl -X PATCH http://localhost:8000/api/support/seller-tickets/1/ \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "İnceleniyor. Stok güncelleme sorunu araştırılıyor."
  }'
```

### Python (requests)

```python
import requests

# Satıcı ticket oluşturma
token = "SELLER_JWT_TOKEN"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

data = {
    "subject": "Sipariş Sorunu",
    "message": "Satıcı olarak bir sorunum var. Ürün stoklarımı güncelleyemiyorum."
}

response = requests.post(
    "http://localhost:8000/api/support/seller-tickets/",
    headers=headers,
    json=data
)

if response.status_code == 201:
    ticket = response.json()
    print(f"Ticket oluşturuldu: {ticket['ticket_number']}")
else:
    print(f"Hata: {response.json()}")

# Dosya ile
files = {
    'attachment': ('file.pdf', open('file.pdf', 'rb'), 'application/pdf')
}
data = {
    "subject": "Sipariş Sorunu",
    "message": "Satıcı olarak bir sorunum var."
}

response = requests.post(
    "http://localhost:8000/api/support/seller-tickets/",
    headers={"Authorization": f"Bearer {token}"},
    data=data,
    files=files
)

# Admin - Ticket güncelleme
admin_token = "ADMIN_JWT_TOKEN"
admin_headers = {
    "Authorization": f"Bearer {admin_token}",
    "Content-Type": "application/json"
}

update_data = {
    "status": "in_progress",
    "notes": "İnceleniyor. Stok güncelleme sorunu araştırılıyor."
}

response = requests.patch(
    "http://localhost:8000/api/support/seller-tickets/1/",
    headers=admin_headers,
    json=update_data
)

if response.status_code == 200:
    print("Ticket güncellendi:", response.json())
```

---

## 📋 Özet Tablo

| Endpoint | Method | Yetki | Açıklama |
|----------|--------|-------|----------|
| `/api/support/seller-tickets/` | POST | Satıcı | Satıcı ticket oluştur |
| `/api/support/seller-tickets/` | GET | Admin | Ticket listesi |
| `/api/support/seller-tickets/{id}/` | GET | Admin | Ticket detayı |
| `/api/support/seller-tickets/{id}/` | PATCH/PUT | Admin | Ticket güncelle (status, notes) |

---

## ⚠️ Önemli Notlar

1. **Ticket Numarası:** Otomatik oluşturulur (`SEL-YYYY-XXXXXX` formatında).

2. **Satıcı Bilgisi:** Ticket oluşturulurken `seller` alanı otomatik olarak giriş yapmış satıcıya atanır.

3. **Dosya Yükleme:** 
   - Maksimum dosya boyutu: 5MB
   - İzin verilen formatlar: PDF, DOC, DOCX, JPG, JPEG, PNG

4. **Notes Alanı:** Sadece adminler görebilir ve güncelleyebilir. Kullanıcıya gösterilmez.

5. **Status Güncellemesi:**
   - `"resolved"` olarak güncellendiğinde `resolved_at` otomatik doldurulur
   - `"resolved"` dışı bir duruma geçildiğinde `resolved_at` temizlenir

6. **Validation:**
   - Mesaj: En az 10 karakter
   - Subject: Seçeneklerden biri olmalı

---

## 🔒 Güvenlik

- ✅ Sadece satıcılar ticket oluşturabilir (rol kontrolü)
- ✅ Admin endpoint'leri JWT token gerektirir
- ✅ Dosya validasyonu (boyut ve tip kontrolü)
- ✅ Input validation (XSS ve injection koruması)
- ✅ Notes alanı kullanıcıya gösterilmez

---

## 🔄 Genel Support vs Seller Support Farkları

| Özellik | Genel Support | Seller Support |
|---------|---------------|---------------|
| **Oluşturma Yetkisi** | Herkes (public) | Sadece Satıcılar |
| **Token Gereksinimi** | Hayır | Evet (POST için) |
| **Ticket Formatı** | SUP-YYYY-XXXXXX | SEL-YYYY-XXXXXX |
| **Kullanıcı Bilgileri** | name, email, phone | Otomatik (seller) |
| **Admin Yönetimi** | Evet | Evet |
| **Notes Alanı** | Evet | Evet |

---

## 📞 Destek

Sorularınız için:
- Ticket oluşturun: `/api/support/seller-tickets/`
- Admin panel: `/admin/support/sellerticket/`

