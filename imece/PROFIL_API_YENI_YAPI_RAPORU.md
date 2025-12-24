# Profil API'leri - Yeni Yapı Uygulama Raporu

**Tarih:** 2024-12-19  
**Değişiklik:** `update_me` kaldırıldı, 2 endpoint ile yeni yapı oluşturuldu

---

## ✅ Yapılan Değişiklikler

### 1. `update_me` Endpoint'i Kaldırıldı
- ❌ Eski: `PATCH /api/users/kullanicilar/update_me/`
- ✅ Yeni: Kaldırıldı (artık kullanılmıyor)

### 2. `update_satici_profili` Geliştirildi
- ✅ Artık hem kullanıcı bilgileri hem satıcı bilgileri güncellenebiliyor
- ✅ Tek endpoint'ten tüm profil güncellemesi yapılabiliyor

### 3. `update_alici_profili` Geliştirildi
- ✅ Artık hem kullanıcı bilgileri hem alıcı bilgileri güncellenebiliyor
- ✅ Tek endpoint'ten tüm profil güncellemesi yapılabiliyor

---

## 📊 Yeni API Yapısı

### Endpoint'ler

| Endpoint | Method | Yetki | Açıklama |
|----------|--------|-------|----------|
| `/api/users/kullanicilar/me/` | GET | Auth | Kendi bilgilerini getir |
| `/api/users/kullanicilar/satici_profili/` | GET | Satıcı | Satıcı profilini getir |
| `/api/users/kullanicilar/alici_profili/` | GET | Alıcı | Alıcı profilini getir |
| `/api/users/kullanicilar/update_satici_profili/` | PATCH/PUT | Satıcı | **Satıcı profili güncelle (kullanıcı + satıcı)** |
| `/api/users/kullanicilar/update_alici_profili/` | PATCH/PUT | Alıcı | **Alıcı profili güncelle (kullanıcı + alıcı)** |

---

## 🔧 Kod Değişiklikleri

### `backend/Users/api/views.py`

#### Kaldırılan:
```python
@action(detail=False, methods=['patch', 'put'], permission_classes=[IsAuthenticated])
def update_me(self, request):
    # ... 60+ satır kod kaldırıldı
```

#### Güncellenen: `update_satici_profili`
```python
@action(detail=False, methods=['patch', 'put'], permission_classes=[IsAuthenticated])
def update_satici_profili(self, request):
    """
    Satıcı profilini günceller.
    Hem kullanıcı bilgileri (first_name, last_name, telno, profil_fotograf) 
    hem de satıcı bilgileri (magaza_adi, satici_vergi_numarasi, vb.) güncellenebilir.
    """
    # 1. Rol kontrolü
    # 2. Kullanıcı bilgilerini güncelle
    # 3. Satıcı bilgilerini güncelle
    # 4. Her ikisini de response'da döndür
```

**Yeni Özellikler:**
- ✅ Kullanıcı bilgileri güncellenebiliyor (`first_name`, `last_name`, `telno`, `profil_fotograf`, `is_online`)
- ✅ Satıcı bilgileri güncellenebiliyor
- ✅ Response'da hem kullanıcı hem satıcı bilgileri dönüyor

#### Güncellenen: `update_alici_profili`
```python
@action(detail=False, methods=['patch', 'put'], permission_classes=[IsAuthenticated])
def update_alici_profili(self, request):
    """
    Alıcı profilini günceller.
    Hem kullanıcı bilgileri (first_name, last_name, telno, profil_fotograf) 
    hem de alıcı bilgileri (cinsiyet, adres) güncellenebilir.
    """
    # 1. Rol kontrolü
    # 2. Kullanıcı bilgilerini güncelle
    # 3. Alıcı bilgilerini güncelle
    # 4. Her ikisini de response'da döndür
```

**Yeni Özellikler:**
- ✅ Kullanıcı bilgileri güncellenebiliyor (`first_name`, `last_name`, `telno`, `profil_fotograf`, `is_online`)
- ✅ Alıcı bilgileri güncellenebiliyor (`cinsiyet`, `adres`)
- ✅ Response'da hem kullanıcı hem alıcı bilgileri dönüyor

---

## 📝 Request/Response Örnekleri

### Satıcı Profili Güncelleme

**Request:**
```json
{
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "telno": "05551234567",
  "magaza_adi": "Yeni Mağaza",
  "satici_vergi_numarasi": "1234567890",
  "satici_iban": "TR330006100519786457841326"
}
```

**Response:**
```json
{
  "message": "Satıcı profili başarıyla güncellendi.",
  "data": {
    "kullanici": {
      "id": 1,
      "first_name": "Ahmet",
      "last_name": "Yılmaz",
      "telno": "05551234567",
      ...
    },
    "satici": {
      "id": 1,
      "magaza_adi": "Yeni Mağaza",
      "satici_vergi_numarasi": "1234567890",
      ...
    }
  }
}
```

### Alıcı Profili Güncelleme

**Request:**
```json
{
  "first_name": "Mehmet",
  "last_name": "Demir",
  "telno": "05559876543",
  "cinsiyet": "erkek",
  "adres": "İstanbul, Kadıköy"
}
```

**Response:**
```json
{
  "message": "Alıcı profili başarıyla güncellendi.",
  "data": {
    "kullanici": {
      "id": 2,
      "first_name": "Mehmet",
      "last_name": "Demir",
      "telno": "05559876543",
      ...
    },
    "alici": {
      "id": 1,
      "cinsiyet": "erkek",
      "adres": "İstanbul, Kadıköy",
      ...
    }
  }
}
```

---

## 🔒 Güvenlik Kontrolleri

### Değiştirilemeyen Alanlar (Her İki Endpoint İçin):
- ❌ `rol` - Kullanıcı rolü
- ❌ `bakiye` - Bakiye (sistem tarafından yönetilir)
- ❌ `blocked_bakiye` - Bloklu bakiye (sadece alıcı için, sistem tarafından yönetilir)
- ❌ `username` - Kullanıcı adı
- ❌ `email` - E-posta
- ❌ `password` - Şifre
- ❌ `id` - Kullanıcı ID
- ❌ `kullanici` - Kullanıcı ilişkisi

### Güncellenebilen Alanlar

#### Kullanıcı Bilgileri (Ortak):
- ✅ `first_name`
- ✅ `last_name`
- ✅ `telno`
- ✅ `profil_fotograf`
- ✅ `is_online`

#### Satıcı Bilgileri:
- ✅ `profil_banner`
- ✅ `profil_tanitim_yazisi`
- ✅ `magaza_adi`
- ✅ `satici_vergi_numarasi`
- ✅ `satici_iban`
- ✅ `profession`

#### Alıcı Bilgileri:
- ✅ `cinsiyet`
- ✅ `adres`

---

## 📚 Dokümantasyon

Detaylı kullanım dokümantasyonu: **`PROFIL_API_KULLANIM.md`**

İçerik:
- ✅ Tüm endpoint'lerin detaylı açıklamaları
- ✅ Request/Response örnekleri
- ✅ JavaScript, cURL, Python örnekleri
- ✅ Hata mesajları ve çözümleri
- ✅ Güvenlik notları

---

## 🎯 Avantajlar

### 1. Daha Temiz Mimari
- ✅ 2 endpoint yerine 3 endpoint (daha az karışıklık)
- ✅ Her rol için net bir endpoint
- ✅ Frontend'de hangi endpoint'i kullanacağı belli

### 2. Daha İyi Güvenlik
- ✅ Rol kontrolü endpoint seviyesinde
- ✅ Kritik alanlar korunuyor
- ✅ Yanlış endpoint'e istek atılamaz

### 3. Daha İyi UX
- ✅ Satıcılar: Tek endpoint'ten hem kullanıcı hem satıcı bilgileri
- ✅ Alıcılar: Tek endpoint'ten hem kullanıcı hem alıcı bilgileri
- ✅ Karışıklık yok

### 4. Daha Az Kod
- ✅ `update_me` içindeki nested profil mantığı kaldırıldı
- ✅ İki ayrı endpoint daha basit ve anlaşılır

---

## ⚠️ Breaking Changes

### Eski Kullanım (Artık Çalışmıyor):
```javascript
// ❌ Artık çalışmıyor
fetch('/api/users/kullanicilar/update_me/', {
  method: 'PATCH',
  body: JSON.stringify({ first_name: 'Ahmet' })
});
```

### Yeni Kullanım:
```javascript
// ✅ Satıcılar için
fetch('/api/users/kullanicilar/update_satici_profili/', {
  method: 'PATCH',
  body: JSON.stringify({ first_name: 'Ahmet', magaza_adi: 'Yeni Mağaza' })
});

// ✅ Alıcılar için
fetch('/api/users/kullanicilar/update_alici_profili/', {
  method: 'PATCH',
  body: JSON.stringify({ first_name: 'Mehmet', cinsiyet: 'erkek' })
});
```

---

## 🧪 Test Edilmesi Gerekenler

1. ✅ Satıcı profili güncelleme (kullanıcı + satıcı bilgileri)
2. ✅ Alıcı profili güncelleme (kullanıcı + alıcı bilgileri)
3. ✅ Sadece kullanıcı bilgileri güncelleme
4. ✅ Sadece satıcı/alıcı bilgileri güncelleme
5. ✅ Güvenlik kontrolleri (rol, bakiye, blocked_bakiye)
6. ✅ Validation hataları
7. ✅ File upload (profil_fotograf, profil_banner)
8. ✅ Response formatı

---

## 📊 İstatistikler

- **Kaldırılan Kod:** ~60 satır (`update_me`)
- **Eklenen/Güncellenen Kod:** ~80 satır
- **Yeni Endpoint:** 0 (mevcut endpoint'ler geliştirildi)
- **Kaldırılan Endpoint:** 1 (`update_me`)
- **Toplam Endpoint:** 5 (GET: 3, PATCH: 2)

---

## ✅ Sonuç

Yeni yapı başarıyla uygulandı:
- ✅ `update_me` kaldırıldı
- ✅ `update_satici_profili` geliştirildi (kullanıcı + satıcı bilgileri)
- ✅ `update_alici_profili` geliştirildi (kullanıcı + alıcı bilgileri)
- ✅ Güvenlik kontrolleri korundu
- ✅ Detaylı dokümantasyon hazırlandı

**Artık her rol için tek, net bir endpoint var!** 🎉

