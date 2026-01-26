import { useEffect, useState } from "react";
import AddressSection from "../components/shoppingCart/AddressSection";
import CartItem from "../components/shoppingCart/CartItem";
import Header from "../components/GenerealUse/Header";
import axios from "axios";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre
import { getCookie, setCookie, deleteCookie } from "../utils/cookieManager";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); // Sadece ürün verisi
  const [cartInfo, setCartInfo] = useState(null); // Sepet toplam fiyatı vb. bilgileri tutacak state
  const [userData, setUserData] = useState(null); // Kullanıcı bilgileri
  const [addresses, setAddresses] = useState([]); // Adres listesi
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
  const [show3DSecureModal, setShow3DSecureModal] = useState(false); // 3D Secure modal
  const [threeDSecureHtml, setThreeDSecureHtml] = useState(null); // 3D Secure HTML
  const [, setThreeDSecureUrl] = useState(null); // 3D Secure URL (şu an UI'da kullanılmıyor)
  const [currentPaymentId, setCurrentPaymentId] = useState(null); // Mevcut ödeme ID

  const token = getCookie("accessToken");
  const accessToken = getCookie("accessToken");

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
      const userId = getCookie("userId");
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
      
      // 401 Unauthorized hatası kontrolü
      if (err.response?.status === 401) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        // Token'ları temizle
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userId");
      } else {
        setError("Sepet verileri yüklenirken bir sorun oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };


  // Kullanıcı bilgilerini çek
  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/me/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      }
    };

    fetchUserData();
  }, [accessToken]);

  // Adresleri çek
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(
          "https://imecehub.com/users/list-addresses/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        let addressesData = response.data;
        if (typeof response.data === "string") {
          try {
            addressesData = JSON.parse(response.data);
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return;
          }
        }

        if (
          addressesData &&
          typeof addressesData === "object" &&
          !Array.isArray(addressesData)
        ) {
          if (addressesData.adresler) {
            addressesData = addressesData.adresler;
          } else if (addressesData.addresses) {
            addressesData = addressesData.addresses;
          } else if (addressesData.results) {
            addressesData = addressesData.results;
          } else if (addressesData.data) {
            addressesData = addressesData.data;
          }
        }

        if (!Array.isArray(addressesData)) {
          addressesData = [];
        }

        setAddresses(addressesData);
      } catch (err) {
        console.error("Adres verileri alınırken hata:", err);
      }
    };

    fetchAddresses();
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchCartData();
    }
  }, [accessToken]); // accessToken değiştiğinde veya sayfa yüklendiğinde çalıştır

  // 3D Secure callback'i dinle (URL parametrelerinden)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get("transaction_id");
    const resultCode = urlParams.get("result_code");
    const resultMessage = urlParams.get("result_message");
    const odemeId = urlParams.get("odeme_id");

    // Eğer callback parametreleri varsa işle
    if (transactionId || resultCode) {
      const callbackData = {
        ResultCode: resultCode || "0000",
        ResultMessage: resultMessage || "İşlem tamamlandı",
        TransactionId: transactionId,
        success: resultCode === "0000" || resultCode === "Success",
      };

      if (odemeId) {
        handlePaymentCallback(parseInt(odemeId, 10), callbackData);
      } else if (currentPaymentId) {
        handlePaymentCallback(currentPaymentId, callbackData);
      }

      // URL'yi temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Sadece sayfa yüklendiğinde bir kez çalıştır

  // 3D Secure form submit listener
  useEffect(() => {
    if (show3DSecureModal && threeDSecureHtml) {
      // Form submit edildiğinde callback'i dinle
      const handleFormSubmit = () => {
        // Form submit edildiğinde, callback endpoint'ini çağır
        // Bu genellikle backend'den otomatik olarak yapılır,
        // ama frontend'de de kontrol edebiliriz
        setTimeout(() => {
          if (currentPaymentId) {
            // Ödeme durumunu kontrol et
            handlePaymentCallback(currentPaymentId, {
              ResultCode: "0000",
              ResultMessage: "3D Secure doğrulaması tamamlandı",
              success: true,
            });
          }
        }, 2000);
      };

      // Form elementlerini bul ve listener ekle
      const form = document.querySelector('form[action*="3d"]');
      if (form) {
        form.addEventListener("submit", handleFormSubmit);
        return () => {
          form.removeEventListener("submit", handleFormSubmit);
        };
      }
    }
  }, [show3DSecureModal, threeDSecureHtml, currentPaymentId]);

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
    } else if (name === "expire_month" || name === "expire_year") {
      // Sadece rakam + max 2 hane (MM / YY)
      const digitsOnly = value.replace(/\D/g, "").slice(0, 2);
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: digitsOnly,
      }));
    } else if (name === "cvc_number") {
      // Sadece rakam + max 3 hane
      const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: digitsOnly,
      }));
    } else {
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  // Adres formatını oluştur
  const formatAddress = (address) => {
    if (!address) return "";
    const parts = [];
    if (address.adres_satiri_1) parts.push(address.adres_satiri_1);
    if (address.adres_satiri_2) parts.push(address.adres_satiri_2);
    if (address.mahalle) parts.push(address.mahalle);
    if (address.ilce) parts.push(address.ilce);
    if (address.il) parts.push(address.il);
    if (address.posta_kodu) parts.push(address.posta_kodu);
    if (address.ulke) parts.push(address.ulke);
    return parts.join(", ");
  };

  // Ödeme callback işlemi
  const handlePaymentCallback = async (odemeId, callbackData = null) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/payment-callback/",
        {
          odeme_id: odemeId,
          transaction_id: callbackData?.TransactionId || null,
          callback_data: callbackData,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Callback Yanıtı:", response.data);

      if (response.data.durum === "BASARILI") {
        showCustomModal(
          "Siparişiniz başarıyla tamamlandı! Sipariş ID: " +
            response.data.siparis_id,
          "success"
        );
        // Sepeti temizle
        setTimeout(() => {
          fetchCartData();
          // Sipariş detay sayfasına yönlendir (isteğe bağlı)
          // window.location.href = `/siparis/${response.data.siparis_id}`;
        }, 2000);
      } else {
        showCustomModal(
          response.data.mesaj || "Ödeme işlemi başarısız oldu.",
          "error"
        );
      }
    } catch (err) {
      console.error("Callback hatası:", err);
      showCustomModal(
        err.response?.data?.mesaj ||
          "Ödeme kontrolü sırasında bir hata oluştu.",
        "error"
      );
    } finally {
      setLoading(false);
      setShow3DSecureModal(false);
      setThreeDSecureHtml(null);
      setThreeDSecureUrl(null);
    }
  };

  // 3D Secure form göster
  const show3DSecureForm = (htmlContent, odemeId) => {
    setThreeDSecureHtml(htmlContent);
    setCurrentPaymentId(odemeId);
    setShow3DSecureModal(true);
  };

  // Siparişi Onayla butonu tıklama işlemi
  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    // Basit doğrulama
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

    // MM doğrulama (01-12)
    const expMonthNum = parseInt(paymentInfo.expire_month, 10);
    if (
      Number.isNaN(expMonthNum) ||
      paymentInfo.expire_month.length !== 2 ||
      expMonthNum < 1 ||
      expMonthNum > 12
    ) {
      showCustomModal("Son kullanma ayı 01-12 arasında olmalıdır (MM).", "error");
      setLoading(false);
      return;
    }

    // YY doğrulama (2 hane)
    if (!/^\d{2}$/.test(paymentInfo.expire_year)) {
      showCustomModal("Son kullanma yılı 2 hane olmalıdır (YY).", "error");
      setLoading(false);
      return;
    }

    // Sepet kontrolü
    if (!cartInfo || !cartInfo.toplam_tutar) {
      showCustomModal(
        "Sepet toplam tutarı alınamadı. Lütfen sepeti kontrol edin.",
        "error"
      );
      setLoading(false);
      return;
    }

    // Adres kontrolü
    if (!selectedAddresses.teslimat_adres_id || !selectedAddresses.fatura_adres_id) {
      showCustomModal(
        "Lütfen teslimat ve fatura adreslerini seçin.",
        "error"
      );
      setLoading(false);
      return;
    }

    // Kullanıcı bilgileri kontrolü
    if (!userData) {
      showCustomModal(
        "Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.",
        "error"
      );
      setLoading(false);
      return;
    }

    // Seçili adresleri bul
    const teslimatAddress = addresses.find(
      (addr) => addr.id === selectedAddresses.teslimat_adres_id
    );
    const faturaAddress = addresses.find(
      (addr) => addr.id === selectedAddresses.fatura_adres_id
    );

    if (!teslimatAddress || !faturaAddress) {
      showCustomModal("Adres bilgileri bulunamadı.", "error");
      setLoading(false);
      return;
    }

    // Kart numarasından boşlukları temizle
    const cardNumber = paymentInfo.card_number.replace(/\s/g, "");

    // Yıl formatını düzelt (YYYY formatına çevir)
    let expYear = paymentInfo.expire_year;
    if (expYear.length === 2) {
      const currentYear = new Date().getFullYear();
      const currentCentury = Math.floor(currentYear / 100) * 100;
      const yearNum = parseInt(expYear, 10);
      expYear = String(currentCentury + yearNum);
    }

    // Ödeme payload'ını yeni API formatına göre oluştur
    const paymentPayload = {
      teslimat_adres_id: selectedAddresses.teslimat_adres_id,
      fatura_adres_id: selectedAddresses.fatura_adres_id,
      PaymentDealerRequest: {
        CardHolderFullName: paymentInfo.card_holder_name,
        CardNumber: cardNumber,
        ExpMonth: paymentInfo.expire_month.padStart(2, "0"),
        ExpYear: expYear,
        CvcNumber: paymentInfo.cvc_number,
        Amount: parseFloat(cartInfo.toplam_tutar).toFixed(2),
        Currency: "TL",
        InstallmentNumber: "1",
        MerchantOrderId: `ORDER-${Date.now()}`, // Benzersiz sipariş ID
        Description: "Sepet Ödemesi",
        BuyerInformation: {
          BuyerFullName: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          BuyerGsmNumber: userData.telno || "",
          BuyerEmail: userData.email || "",
          BuyerAddress: formatAddress(teslimatAddress),
          BuyerCity: teslimatAddress.il || "",
          BuyerCountry: teslimatAddress.ulke || "TR",
        },
      },
    };

    try {
      console.log("Sipariş tamamlanıyor...", paymentPayload);

      // Yeni API endpoint'ine istek gönder
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/siparisi-tamamla/",
        paymentPayload,
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Sipariş Tamamlama Yanıtı:", response.data);

      // Response durumuna göre işle
      if (response.data.durum === "BASARILI") {
        const odemeId = response.data.odeme_id;
        setCurrentPaymentId(odemeId);

        // 3D Secure HTML varsa göster
        if (response.data["3d_secure_html"]) {
          show3DSecureForm(response.data["3d_secure_html"], odemeId);
        }
        // 3D Secure URL varsa yönlendir
        else if (response.data["3d_secure_url"]) {
          setThreeDSecureUrl(response.data["3d_secure_url"]);
          setCurrentPaymentId(odemeId);
          // URL'ye yönlendir
          window.location.href = response.data["3d_secure_url"];
        } else {
          // 3D Secure gerekmiyorsa direkt callback yap
          showCustomModal("Siparişiniz başarıyla oluşturuldu!", "success");
          fetchCartData();
        }
      } else if (response.data.durum === "BOS_SEPET") {
        showCustomModal(response.data.mesaj || "Sepetiniz boş.", "error");
      } else if (response.data.durum === "STOK_YETERSIZ") {
        const yetersizUrunler = response.data.yetersiz_urunler || [];
        const urunAdlari = yetersizUrunler
          .map((item) => item.urun_adi)
          .join(", ");
        showCustomModal(
          `Stok yetersizliği: ${urunAdlari}`,
          "error"
        );
      } else {
        showCustomModal(
          response.data.mesaj || "Sipariş tamamlanırken bir hata oluştu.",
          "error"
        );
      }
    } catch (err) {
      console.error("Sipariş tamamlama hatası:", err.response?.data || err);

      let errorMessage = "Sipariş tamamlanırken bir hata oluştu.";
      if (err.response?.data?.mesaj) {
        errorMessage = err.response.data.mesaj;
      } else if (err.response?.data?.durum === "HATA") {
        errorMessage = err.response.data.mesaj || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showCustomModal(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userId");
    window.location.href = "/login";
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

  // 401 hatası için özel UI
  if (error && error.includes("Oturum süreniz dolmuş")) {
    return (
      <>
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oturum Süresi Doldu
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToLogin}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Ay seçeneklerini oluştur (Türkçe ay isimleri ile)
  // Son kullanma ay/yıl alanları artık manuel giriliyor (MM / YY)

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
          <form
            autoComplete="on"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmOrder();
            }}
          >
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
                  autoComplete="cc-name"
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
                  autoComplete="cc-number"
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
                <input
                  type="text"
                  id="expire_month"
                  name="expire_month"
                  value={paymentInfo.expire_month}
                  onChange={handlePaymentInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="MM (örn: 12)"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={2}
                  autoComplete="cc-exp-month"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="expire_year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Son Kullanma Yılı (YY)
                </label>
                <input
                  type="text"
                  id="expire_year"
                  name="expire_year"
                  value={paymentInfo.expire_year}
                  onChange={handlePaymentInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="YY (örn: 25)"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={2}
                  autoComplete="cc-exp-year"
                  required
                />
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
                  autoComplete="cc-csc"
                  required
                />
              </div>
            </div>
          <button
            type="submit"
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
          </form>
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

      {/* 3D Secure Modal */}
      {show3DSecureModal && threeDSecureHtml && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-600">
                3D Secure Doğrulama
              </h3>
              <button
                onClick={() => {
                  setShow3DSecureModal(false);
                  setThreeDSecureHtml(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: threeDSecureHtml }}
            />
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                3D Secure doğrulaması tamamlandıktan sonra işlem otomatik olarak
                devam edecektir.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
