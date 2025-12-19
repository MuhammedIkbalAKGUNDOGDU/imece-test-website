# Satıcı Destek API Endpoints

## 1. Yeni Satıcı Destek Talebi Oluştur

**Method:** POST  
**URL:** `https://imecehub.com/api/seller-support/tickets/`  
**Headers:**
```
Content-Type: multipart/form-data
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {seller_token}
```

**Body (FormData):**
```
name: string (required)
email: string (required)
phone: string (optional)
subject: string (required) - Hesap Sorunu, Ödeme Sorunu, Ürün Yönetimi, Sipariş Sorunu, Teknik Destek, Diğer
message: string (required)
attachment: File (optional)
```

**Not:** Sadece `rol='satici'` olan kullanıcılar ticket oluşturabilir.

---

## 2. Ticket Listesi (Satıcı - Kendi Ticket'ları)

**Method:** GET  
**URL:** `https://imecehub.com/api/seller-support/tickets/`  
**Query Parameters:**
```
status: string (optional) - pending, in_progress, resolved, closed
subject: string (optional)
search: string (optional)
```

**Headers:**
```
Content-Type: application/json
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {seller_token}
```

**Not:** Satıcılar sadece kendi ticket'larını görür.

---

## 3. Ticket Listesi (Admin - Tüm Ticket'lar)

**Method:** GET  
**URL:** `https://imecehub.com/api/seller-support/tickets/`  
**Query Parameters:**
```
status: string (optional) - pending, in_progress, resolved, closed
subject: string (optional)
search: string (optional)
```

**Headers:**
```
Content-Type: application/json
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {admin_token}
```

**Not:** Adminler tüm satıcı ticket'larını görür.

---

## 4. Ticket Detayı

**Method:** GET  
**URL:** `https://imecehub.com/api/seller-support/tickets/{ticketId}/`  
**Headers:**
```
Content-Type: application/json
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {token}
```

**Not:** Satıcılar sadece kendi ticket'larını, adminler tüm ticket'ları görebilir.

---

## 5. Ticket Durumunu Güncelle (Admin)

**Method:** PATCH  
**URL:** `https://imecehub.com/api/seller-support/tickets/{ticketId}/update_status/`  
**Headers:**
```
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {admin_token}
```

**Body (FormData):**
```
status: string - pending, in_progress, resolved, closed
```

**Not:** Sadece adminler durum güncelleyebilir.

---

## 6. Toplu Durum Güncelleme (Admin)

**Method:** PATCH  
**URL:** `https://imecehub.com/api/seller-support/tickets/{ticketId}/update_status/`  
**Headers:**
```
X-API-Key: WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY
Authorization: Bearer {admin_token}
```

**Body (FormData):**
```
status: string - resolved veya closed
```

**Not:** Birden fazla ticket için aynı endpoint'e paralel istekler gönderilir.

