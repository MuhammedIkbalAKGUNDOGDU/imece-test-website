export const chats = {
  people: [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      message: '100kg domates için grup alımı başlattım',
      hasRead: true,
      messages: [
        { id: 1, sender: 'other', text: 'Selamlar, 100kg domates için grup alımı başlattım. Kg fiyatı 15TL, minimum 10kg alım yapılabilir.', time: '10:25', read: true },
        { id: 2, sender: 'me', text: '20kg almak istiyorum, kaç kişi daha var?', time: '10:26', read: true },
        { id: 3, sender: 'other', text: 'Şu an 3 kişi var, toplam 45kg alım var. 55kg daha lazım', time: '10:28', read: true },
        { id: 4, sender: 'me', text: 'Anladım, ben de gruba katılıyorum. Ne zaman tamamlanır?', time: '10:30', read: true },
        { id: 5, sender: 'other', text: '2 gün içinde tamamlanır, size haber vereceğim', time: '10:31', read: true }
      ]
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      message: 'Fiyat teklifiniz uygun görünüyor, detayları konuşalım',
      hasRead: true,
      messages: [
        { id: 1, sender: 'other', text: 'Selamlar, zeytinyağları hazır', time: '09:15', read: true },
        { id: 2, sender: 'me', text: 'Süper, 5 litre alacaktım', time: '09:20', read: true },
        { id: 3, sender: 'other', text: 'Tabi, litresi 120TL', time: '09:22', read: true },
        { id: 4, sender: 'me', text: 'Tamam, yarın gelip alabilirim', time: '09:25', read: true }
      ]
    },
    {
      id: 3,
      name: 'Zeynep Kaya',
      message: 'Organik domatesler hazır, gelip alabilirsiniz',
      hasRead: true,
      messages: [
        { id: 1, sender: 'other', text: 'Merhaba, organik domatesler hazır', time: '13:40', read: true },
        { id: 2, sender: 'me', text: 'Harika! Kaç kasa var?', time: '13:45', read: true },
        { id: 3, sender: 'other', text: '10 kasa mevcut, tanesi 150TL', time: '13:47', read: true },
        { id: 4, sender: 'me', text: 'Tamamını alıyorum', time: '13:50', read: true }
      ]
    },
    {
      id: 4,
      name: 'Elif Yıldız',
      message: 'Organik bal için sipariş verebilir miyim?',
      hasRead: true,
      messages: [
        { id: 1, sender: 'other', text: 'Merhaba, organik çiçek balı var elimde', time: '16:20', read: true },
        { id: 2, sender: 'me', text: 'Kaç kg mevcut?', time: '16:22', read: true },
        { id: 3, sender: 'other', text: '5kg kavanozlar halinde toplam 50kg var', time: '16:25', read: true },
        { id: 4, sender: 'me', text: 'Kg fiyatı nedir?', time: '16:26', read: true },
        { id: 5, sender: 'other', text: '400TL, toplu alımda indirim yapabilirim', time: '16:28', read: true }
      ]
    },
    {
      id: 5,
      name: 'Mustafa Demir',
      message: 'Sera kurulumu için geliyorum',
      hasRead: false,
      messages: [
        { id: 1, sender: 'other', text: 'Yarın sera kurulumu için gelebilirim', time: '13:15', read: true },
        { id: 2, sender: 'me', text: 'Harika, saat kaçta uygun olursunuz?', time: '13:20', read: true },
        { id: 3, sender: 'other', text: 'Sabah 9 gibi başlayabiliriz', time: '13:22', read: true },
        { id: 4, sender: 'me', text: 'Tamam, bekliyor olacağım', time: '13:25', read: false }
      ]
    },
    {
      id: 6,
      name: 'Ayşe Yaman',
      message: 'Haftalık sebze siparişi verildi',
      hasRead: true,
      messages: [
        { id: 1, sender: 'me', text: 'Bu haftaki organik sebze listesi hazır mı?', time: '11:30', read: true },
        { id: 2, sender: 'other', text: 'Evet, domates, salatalık, biber ve patlıcan var', time: '11:32', read: true },
        { id: 3, sender: 'other', text: 'Ayrıca taze fasulye de geldi', time: '11:33', read: true },
        { id: 4, sender: 'me', text: 'Harika, hepsinden 2şer kilo alayım', time: '11:35', read: true }
      ]
    }
  ],
  groups: [
    {
      id: 4,
      name: 'Zeytinyağı Grubu',
      description: 'Toplu Alım Grubu - Min. 50Lt',
      message: 'Ali: 40 litre daha katılım gerekiyor',
      hasRead: false,
      messages: [
        { id: 1, sender: 'other', name: 'Ali Yıldız', text: 'Arkadaşlar 200 litre için grup alımı başlattık. Litresi 180TL', time: '11:00', read: true },
        { id: 2, sender: 'other', name: 'Mehmet Demir', text: 'Ben 20 litre alacağım', time: '11:05', read: true },
        { id: 3, sender: 'me', text: '30 litre benden', time: '11:07', read: true },
        { id: 4, sender: 'other', name: 'Zeynep Kaya', text: '10 litre de ben katılıyorum', time: '11:10', read: true },
        { id: 5, sender: 'other', name: 'Ali Yıldız', text: '40 litre daha katılım olursa grubu tamamlayacağız', time: '11:12', read: true }
      ]
    },
    {
      id: 5,
      name: 'Tarım Kooperatifi',
      description: 'Bölgesel Tarım Kooperatifi',
      message: 'Ali: Yeni hasat zamanı yaklaşıyor',
      hasRead: false,
      messages: [
        { id: 1, sender: 'other', name: 'Ali Yıldız', text: 'Arkadaşlar hasat zamanı yaklaşıyor', time: '15:00', read: true },
        { id: 2, sender: 'other', name: 'Fatma Şahin', text: 'Ürün tahminlerini paylaşalım', time: '15:05', read: true },
        { id: 3, sender: 'me', text: 'Benim 1 ton kadar ürünüm olacak', time: '15:10', read: true },
        { id: 4, sender: 'other', name: 'Can Öztürk', text: 'Depolama için hazırlık yapalım', time: '15:15', read: true }
      ]
    },
    {
      id: 6,
      name: 'Organik Üreticiler',
      description: 'Organik Tarım Üreticileri Grubu',
      message: 'Murat: Yeni sertifikasyon süreci başladı',
      hasRead: true,
      messages: [
        { id: 1, sender: 'other', name: 'Murat Kaya', text: 'Organik tarım sertifikası yenileme zamanı geldi', time: '14:00', read: true },
        { id: 2, sender: 'other', name: 'Sema Demir', text: 'Başvuru için gerekli belgeler neler?', time: '14:05', read: true },
        { id: 3, sender: 'me', text: 'Ben geçen seneki belgeleri paylaşabilirim', time: '14:07', read: true },
        { id: 4, sender: 'other', name: 'Ali Yılmaz', text: 'Toplu başvuru yaparsak indirim olur mu?', time: '14:10', read: true }
      ]
    },
    {
      id: 7,
      name: 'Sera Teknolojileri',
      description: 'Modern Sera Sistemleri Grubu',
      message: 'Kemal: Akıllı sulama sistemi kuruldu',
      hasRead: false,
      messages: [
        { id: 1, sender: 'other', name: 'Kemal Öztürk', text: 'Yeni sulama sistemini test ettik', time: '09:00', read: true },
        { id: 2, sender: 'me', text: 'Sonuçlar nasıl?', time: '09:05', read: true },
        { id: 3, sender: 'other', name: 'Kemal Öztürk', text: 'Çok verimli, su tüketimi %40 azaldı', time: '09:07', read: true },
        { id: 4, sender: 'other', name: 'Hande Yıldız', text: 'Bizim serada da uygulayabilir miyiz?', time: '09:10', read: false }
      ]
    }
  ]
};
