import { useState, useEffect } from "react";
import axios from "axios";
import { apiKey } from "../../config";

export default function AddressSection({ onAddressSelect, selectedAddresses }) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  // Adresleri API'den çek
  const fetchAddresses = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
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

      // API'den gelen veriyi kontrol et ve array'e çevir
      let addressesData = response.data;

      // Eğer string ise JSON parse et
      if (typeof response.data === "string") {
        try {
          addressesData = JSON.parse(response.data);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          setError("Veri formatı hatalı");
          return;
        }
      }

      // Eğer object ise ve addresses property'si varsa onu al
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

      // Array değilse boş array yap
      if (!Array.isArray(addressesData)) {
        console.warn("Addresses data is not an array:", addressesData);
        addressesData = [];
      }

      setAddresses(addressesData);

      // Eğer hiç adres seçilmemişse, ilk adresi varsayılan olarak seç
      if (addressesData.length > 0 && !selectedAddresses.teslimat_adres_id) {
        const defaultAddress =
          addressesData.find((addr) => addr.varsayilan_adres) ||
          addressesData[0];
        onAddressSelect({
          teslimat_adres_id: defaultAddress.id,
          fatura_adres_id: defaultAddress.id,
        });
      }
    } catch (err) {
      console.error("Adres verileri alınırken hata:", err);
      setError("Adres bilgileri alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken]);

  const handleAddressSelect = (addressId, type) => {
    onAddressSelect((prev) => ({
      ...prev,
      [type]: addressId,
    }));
    setShowAddressModal(false);
  };

  const handleLocationUpdate = () => {
    setShowAddressModal(true);
  };

  const getSelectedAddress = (type) => {
    if (!selectedAddresses || !selectedAddresses[type]) {
      return addresses[0]; // İlk adresi varsayılan olarak döndür
    }
    const addressId = selectedAddresses[type];
    return addresses.find((addr) => addr.id === addressId) || addresses[0];
  };

  const teslimatAddress = getSelectedAddress("teslimat_adres_id");
  const faturaAddress = getSelectedAddress("fatura_adres_id");

  // Adres formatını oluştur
  const formatAddress = (address) => {
    if (!address) return "Adres bulunamadı";

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

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg">
        <div className="text-center text-blue-500">Adresler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg">
        <div className="text-center text-red-500">{error}</div>
        <button
          onClick={fetchAddresses}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg">
        <div className="text-center text-gray-500">
          <p className="mb-2">Henüz adres eklenmemiş</p>
          <p className="text-sm">Profil sayfasından adres ekleyebilirsiniz</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full sm:w-32 h-24 sm:h-32 bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500 text-sm sm:text-base">
              Map Image
            </span>
          </div>
          <div className="border-r-0 md:border-r-2 border-gray-300 p-2 sm:p-4 md:p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Teslimat Adresi:
              </h3>
              <h2 className="text-base sm:text-lg font-bold text-black">
                {teslimatAddress
                  ? `${teslimatAddress.ulke || "Türkiye"} / ${
                      teslimatAddress.il || "İstanbul"
                    }`
                  : "Adres seçin"}
              </h2>
              <p className="text-gray-800 font-light text-xs sm:text-sm">
                {teslimatAddress
                  ? formatAddress(teslimatAddress)
                  : "Teslimat adresi seçilmedi"}
              </p>
              {teslimatAddress && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {teslimatAddress.adres_tipi === "ev"
                    ? "Ev"
                    : teslimatAddress.adres_tipi === "is"
                    ? "İş"
                    : "Diğer"}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Fatura Adresi:
              </h3>
              <h2 className="text-base sm:text-lg font-bold text-black">
                {faturaAddress
                  ? `${faturaAddress.ulke || "Türkiye"} / ${
                      faturaAddress.il || "İstanbul"
                    }`
                  : "Adres seçin"}
              </h2>
              <p className="text-gray-800 font-light text-xs sm:text-sm">
                {faturaAddress
                  ? formatAddress(faturaAddress)
                  : "Fatura adresi seçilmedi"}
              </p>
              {faturaAddress && (
                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {faturaAddress.adres_tipi === "ev"
                    ? "Ev"
                    : faturaAddress.adres_tipi === "is"
                    ? "İş"
                    : "Diğer"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
          <p className="text-black text-sm sm:text-base">
            Tahmini teslimat tarihi
          </p>
          <p className="green font-bold text-base sm:text-lg">
            09 / 01 / 2025{" "}
            <span className="font-medium text-xs sm:text-sm text-gray-600">
              (2 gün sonra)
            </span>
          </p>
          <button
            onClick={handleLocationUpdate}
            className="mt-2 px-3 sm:px-4 py-1 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base rounded-md w-full md:w-auto transition-colors"
          >
            Adres Bilgilerini Güncelle
          </button>
        </div>
      </div>

      {/* Adres Seçim Modalı */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Adres Seçimi</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teslimat Adresi */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-600">
                  Teslimat Adresi
                </h4>
                {addresses.map((address) => (
                  <div
                    key={`teslimat-${address.id}`}
                    className={`border rounded-lg p-3 mb-2 cursor-pointer transition-colors ${
                      selectedAddresses.teslimat_adres_id === address.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      handleAddressSelect(address.id, "teslimat_adres_id")
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">
                        {address.baslik || "Adres"}
                      </h5>
                      {address.varsayilan_adres && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatAddress(address)}
                    </p>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {address.adres_tipi === "ev"
                        ? "Ev"
                        : address.adres_tipi === "is"
                        ? "İş"
                        : "Diğer"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fatura Adresi */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-600">
                  Fatura Adresi
                </h4>
                {addresses.map((address) => (
                  <div
                    key={`fatura-${address.id}`}
                    className={`border rounded-lg p-3 mb-2 cursor-pointer transition-colors ${
                      selectedAddresses.fatura_adres_id === address.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      handleAddressSelect(address.id, "fatura_adres_id")
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">
                        {address.baslik || "Adres"}
                      </h5>
                      {address.varsayilan_adres && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatAddress(address)}
                    </p>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {address.adres_tipi === "ev"
                        ? "Ev"
                        : address.adres_tipi === "is"
                        ? "İş"
                        : "Diğer"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
