import { useEffect, useState } from "react";
import AddressSection from "../components/shoppingCart/AddressSection";
import CartItem from "../components/shoppingCart/CartItem";
import Header from "../components/GenerealUse/Header";
import axios from "axios";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); // Sadece ürün verisi
  const [cartInfo, setCartInfo] = useState(null); // Sepet toplam fiyatı vb. bilgileri tutacak state
  const [paymentInfo, setPaymentInfo] = useState({
    // Kart bilgilerini tutacak state
    card_holder_name: "",
    card_number: "",
    expire_month: "",
    expire_year: "",
    cvc_number: "",
  });
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false); // Özel başarı modalı için state
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false); // Özel hata modalı için state
  const [paymentMessage, setPaymentMessage] = useState(""); // Ödeme modalları için mesaj
  const [selectedAddresses, setSelectedAddresses] = useState({
    teslimat_adres_id: null,
    fatura_adres_id: null,
  });

  const token = localStorage.getItem("accessToken");
  const accessToken = localStorage.getItem("accessToken");

  // alert() yerine özel bir modal gösterme fonksiyonu
  const showCustomModal = (message, type) => {
    setPaymentMessage(message);
    if (type === "success") {
      setShowPaymentSuccessModal(true);
    } else {
      setShowPaymentErrorModal(true);
    }
  };

  // Özel modalları kapatma fonksiyonu
  const closeCustomModal = () => {
    setShowPaymentSuccessModal(false);
    setShowPaymentErrorModal(false);
    setPaymentMessage("");
  };

  // Ürünü sepetten silme işlemi
  const handleDeleteFromCart = async (urun_id) => {
    try {
      await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: 0,
          urun_id: urun_id,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showCustomModal("Ürün sepetten silindi!", "success");
      fetchCartData(); // Sepet verilerini yeniden çek
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      showCustomModal("Bir hata oluştu, lütfen tekrar deneyin.", "error");
    }
  };

  // Sepet verilerini çekme fonksiyonu
  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://imecehub.com/api/payment/siparisitem/sepet-get/`,
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.sepet || []);

      // Sepet bilgileri (toplam fiyat vs.) için ayrı bir istek
      const infoResponse = await axios.get(
        `https://imecehub.com/api/payment/siparisitem/sepet-info/`,
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartInfo(infoResponse.data);
    } catch (err) {
      console.error("Sepet verileri alınamadı:", err);
      setError("Sepet verileri yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Siparişi onaylama fonksiyonu (ödeme öncesi çağrılır)
  const handleOrderConfirmation = async () => {
    try {
      console.log("=== SİPARİŞ ONAYLAMA BAŞLADI ===");
      console.log("API Key:", apiKey ? "Mevcut" : "Eksik");
      console.log("Token:", token ? "Mevcut" : "Eksik");

      // Adres bilgilerini state'den al
      const teslimat_adres_id = selectedAddresses.teslimat_adres_id;
      const fatura_adres_id = selectedAddresses.fatura_adres_id;

      console.log("Teslimat Adres ID:", teslimat_adres_id);
      console.log("Fatura Adres ID:", fatura_adres_id);

      // Adres seçimi kontrolü
      if (!teslimat_adres_id || !fatura_adres_id) {
        showCustomModal(
          "Lütfen teslimat ve fatura adreslerini seçin.",
          "error"
        );
        return false; // Başarısız
      }

      const orderResponse = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/siparisi-onayla/",
        {
          teslimat_adres_id: teslimat_adres_id,
          fatura_adres_id: fatura_adres_id,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 saniye timeout
        }
      );

      console.log("Sipariş Onaylama Yanıtı:", orderResponse.data);

      if (orderResponse.data.durum === "ONAYLANDI") {
        showCustomModal(
          `Siparişiniz başarıyla onaylandı! Sipariş ID: ${orderResponse.data.siparis_id}, Toplam Fiyat: ${orderResponse.data.toplam_fiyat} TL`,
          "success"
        );
        return true; // Başarılı
      } else if (orderResponse.data.durum === "STOK_YETERSIZ") {
        showCustomModal(
          "Stok yetersizliği: " +
            orderResponse.data.yetersiz_urunler
              .map((item) => item.urun_adi)
              .join(", "),
          "error"
        );
        return false; // Başarısız
      } else {
        showCustomModal(
          "Sipariş onaylama başarısız: " +
            (orderResponse.data.hata || "Bilinmeyen hata."),
          "error"
        );
        return false; // Başarısız
      }
    } catch (err) {
      console.error(
        "Sipariş onaylama hatası:",
        err.response ? err.response.data : err
      );
      showCustomModal(
        "Sipariş onaylanırken bir hata oluştu: " +
          (err.response?.data?.hata || err.message || "Bilinmeyen hata."),
        "error"
      );
      return false; // Başarısız
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCartData();
    }
  }, [accessToken]); // accessToken değiştiğinde veya sayfa yüklendiğinde çalıştır

  // Kart bilgileri inputlarını yönet
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;

    if (name === "card_number") {
      // Sadece rakamları al
      const rawValue = value.replace(/\D/g, "");
      // Her 4 hanede bir boşluk ekle
      const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ");
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: formattedValue,
      }));
    } else {
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  // Siparişi Onayla butonu tıklama işlemi
  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    // Basit doğrulama (daha detaylı doğrulama gerekebilir)
    if (
      !paymentInfo.card_holder_name ||
      !paymentInfo.card_number ||
      !paymentInfo.expire_month ||
      !paymentInfo.expire_year ||
      !paymentInfo.cvc_number
    ) {
      showCustomModal("Lütfen tüm kart bilgilerini eksiksiz girin.", "error");
      setLoading(false);
      return;
    }

    // Ensure cartInfo and total_tutar are available
    if (!cartInfo || !cartInfo.toplam_tutar) {
      showCustomModal(
        "Sepet toplam tutarı alınamadı. Lütfen sepeti kontrol edin.",
        "error"
      );
      setLoading(false);
      return;
    }

    // Ödeme payload'ını örnek JSON'a göre oluştur
    const paymentPayload = {
      PaymentDealerRequest: {
        CardHolderFullName: paymentInfo.card_holder_name,
        CardNumber: paymentInfo.card_number.replace(/\s/g, ""), // Boşlukları kaldırarak API'ye gönder
        ExpMonth: paymentInfo.expire_month,
        ExpYear: paymentInfo.expire_year,
        CvcNumber: paymentInfo.cvc_number,
        CardToken: "",
        Amount: parseFloat(cartInfo.toplam_tutar), // Sepet bilgisinden toplam tutarı kullan
        Currency: "TL",
        InstallmentNumber: 1,
        ClientIP: "192.168.1.101", // Örnekteki gibi statik IP
        OtherTrxCode: "",
        SubMerchantName: "",
        IsPoolPayment: 0,
        IsPreAuth: 0,
        IsTokenized: 0,
        IntegratorId: 0,
        Software: "Possimulation",
        Description: "Sepet Ödemesi", // Örnek açıklama
        ReturnHash: 1,
        RedirectUrl:
          "https://service.refmokaunited.com/PaymentDealerThreeD?MyTrxCode=000000000000000", // Örnekteki gibi statik URL
        RedirectType: 0,
        BuyerInformation: {
          BuyerFullName: "Ali Yılmaz", // Örnekteki gibi statik
          BuyerGsmNumber: "5551110022", // Örnekteki gibi statik
          BuyerEmail: "aliyilmaz@xyz.com", // Örnekteki gibi statik
          BuyerAddress: "Tasdelen / Çekmeköy", // Örnekteki gibi statik
        },
        CustomerInformation: {
          DealerCustomerId: "",
          CustomerCode: "1234", // Örnekteki gibi statik
          FirstName: "Ali", // Örnekteki gibi statik
          LastName: "Yılmaz", // Örnekteki gibi statik
          Gender: "1", // Örnekteki gibi statik
          BirthDate: "",
          GsmNumber: "",
          Email: "aliyilmaz@xyz.com", // Örnekteki gibi statik
          Address: "",
          CardName: "Maximum kartım", // Örnekteki gibi statik
        },
      },
    };

    try {
      // ÖNCE SİPARİŞİ ONAYLA
      console.log("Sipariş onaylanıyor...");
      const orderConfirmed = await handleOrderConfirmation();

      if (!orderConfirmed) {
        setLoading(false);
        return; // Sipariş onaylanamadıysa ödeme yapma
      }

      // Sipariş başarılıysa ödemeye geç
      console.log("Sipariş onaylandı, ödeme yapılıyor...");

      // Gerçek API isteği
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/trigger-payment/", // Belirtilen endpoint
        paymentPayload,
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Ödeme API Yanıtı:", response.data);

      // ResultCode'a göre yanıtı işleme
      if (response.data.ResultCode === "Success") {
        if (response.data.Data && response.data.Data.Url) {
          // Data objesi ve içindeki Url kontrolü
          showCustomModal("3D Secure yönlendiriliyor...", "success");
          window.location.href = response.data.Data.Url; // response.data.Data.Url kullanılıyor
        } else {
          showCustomModal("Siparişiniz başarıyla alındı!", "success");
          fetchCartData(); // Başarılı sipariş sonrası sepeti yeniden yükle
        }
      } else if (
        response.data.ResultCode ===
        "PaymentDealer.CheckCardInfo.InvalidCardInfo"
      ) {
        showCustomModal("Hatalı kart bilgisi.", "error");
      } else if (
        response.data.ResultCode ===
        "PaymentDealer.CheckPaymentDealerAuthentication.InvalidAccount"
      ) {
        showCustomModal(
          "Ödeme sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin veya farklı bir ödeme yöntemi kullanın.",
          "error"
        );
      } else if (response.data.durum === "STOK_YETERSIZ") {
        // 'durum' alanı hala kullanılıyorsa
        showCustomModal(
          "Stok yetersizliği: " +
            response.data.yetersiz_urunler
              .map((item) => item.urun_adi)
              .join(", "),
          "error"
        );
      } else {
        // Diğer hata durumları için genel mesaj
        showCustomModal(
          "Sipariş onaylama başarısız: " +
            (response.data.mesaj ||
              response.data.ResultCode ||
              "Bilinmeyen hata."),
          "error"
        );
      }
    } catch (err) {
      console.error(
        "Sipariş onaylama hatası:",
        err.response ? err.response.data : err
      );

      // Ağ hataları veya diğer HTTP hataları için hata mesajı
      let errorMessage = "Sipariş onaylanırken bir hata oluştu.";
      if (
        err.response?.data?.ResultCode ===
        "PaymentDealer.CheckCardInfo.InvalidCardInfo"
      ) {
        errorMessage = "Hatalı kart bilgisi.";
      } else if (
        err.response?.data?.ResultCode ===
        "PaymentDealer.CheckPaymentDealerAuthentication.InvalidAccount"
      ) {
        errorMessage =
          "Ödeme sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin veya farklı bir ödeme yöntemi kullanın.";
      } else if (err.response?.data?.mesaj) {
        errorMessage = err.response.data.mesaj;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showCustomModal(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <>
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <p className="text-lg font-semibold mb-4">
            Lütfen giriş yapın ya da kaydolun
          </p>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Giriş Yap
            </a>
            <a
              href="/register"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Kaydol
            </a>
          </div>
        </div>
      </>
    );
  }

  // Ay seçeneklerini oluştur
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  // Yıl seçeneklerini oluştur
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => String(currentYear + i)); // 2025'ten 2040'a kadar (16 yıl)

  return (
    <>
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="bg-white w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6 mt-12">
        <AddressSection
          onAddressSelect={setSelectedAddresses}
          selectedAddresses={selectedAddresses}
        />
        {/* Adres seçimi bölümü */}
        {loading && (
          <div className="text-center text-blue-500">Yükleniyor...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg my-2 md:my-4">
            <h2 className="text-xl font-bold mb-4">
              Sepetim ({cartItems.length} Ürün)
            </h2>
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.urun} // urun_id'yi key olarak kullanıyoruz
                  data={item}
                  onRemove={() => handleDeleteFromCart(item.urun)}
                />
              ))}
            </div>
            {cartInfo && cartInfo.durum === "SEPET_DOLU" && (
              <div className="mt-4 p-4 border-t border-gray-200 text-right">
                <p className="text-lg font-semibold">
                  Ürünler Toplamı: {cartInfo.urun_toplam_tutari} TL
                </p>
                <p className="text-lg font-semibold">
                  Taşıma Ücreti: {cartInfo.tasima_ucreti} TL
                </p>
                <p className="text-xl font-bold text-blue-600">
                  Genel Toplam: {cartInfo.toplam_tutar} TL
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tahmini Teslimat: {cartInfo.son_teslimat_tarihi}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg font-semibold mt-6">
            Sepetiniz boş.
          </div>
        )}
        {/* Ödeme Bölümü */}
        <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg my-2 md:my-4">
          <h2 className="text-xl font-bold mb-4">Ödeme Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="card_holder_name"
                className="block text-sm font-medium text-gray-700"
              >
                Kart Üzerindeki İsim
              </label>
              <input
                type="text"
                id="card_holder_name"
                name="card_holder_name"
                value={paymentInfo.card_holder_name}
                onChange={handlePaymentInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Ad Soyad"
                required
              />
            </div>
            <div>
              <label
                htmlFor="card_number"
                className="block text-sm font-medium text-gray-700"
              >
                Kart Numarası
              </label>
              <input
                type="text"
                id="card_number"
                name="card_number"
                value={paymentInfo.card_number}
                onChange={handlePaymentInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19" // Max 16 digits + 3 spaces = 19 characters
                required
              />
            </div>
            <div>
              <label
                htmlFor="expire_month"
                className="block text-sm font-medium text-gray-700"
              >
                Son Kullanma Ayı (MM)
              </label>
              <select
                id="expire_month"
                name="expire_month"
                value={paymentInfo.expire_month}
                onChange={handlePaymentInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Ay Seçin</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="expire_year"
                className="block text-sm font-medium text-gray-700"
              >
                Son Kullanma Yılı (YY)
              </label>
              <select
                id="expire_year"
                name="expire_year"
                value={paymentInfo.expire_year}
                onChange={handlePaymentInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Yıl Seçin</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year.slice(-2)} {/* Sadece son iki haneyi göster */}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              {" "}
              {/* CVC'yi tek başına bir satıra alabiliriz */}
              <label
                htmlFor="cvc_number"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <input
                type="text"
                id="cvc_number"
                name="cvc_number"
                value={paymentInfo.cvc_number}
                onChange={handlePaymentInfoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="XXX"
                maxLength="3"
                required
              />
            </div>
          </div>
          <button
            onClick={handleConfirmOrder}
            disabled={loading || cartItems.length === 0}
            className={`mt-6 w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 
              ${
                loading || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "İşlem Yapılıyor..." : "Siparişi Onayla ve Öde"}
          </button>
        </div>
      </div>

      {/* Özel Başarı Modalı */}
      {showPaymentSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-green-600 mb-4">Başarılı!</h3>
            <p className="mb-6">{paymentMessage}</p>
            <button
              onClick={closeCustomModal}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Özel Hata Modalı */}
      {showPaymentErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Hata!</h3>
            <p className="mb-6">{paymentMessage}</p>
            <button
              onClick={closeCustomModal}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
