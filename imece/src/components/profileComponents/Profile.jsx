import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Column,
  HeadlineText,
  SubtitleText,
  CustomButton,
  Container,
  Card,
  CircleAvatar,
  textIconButton,
  SizedBox,
  AddressCard,
  Divider,
  CouponsCard,
  OrderCard,
  KrediKart,
  FollowCard,
  YorumCard,
  AddressModal,
} from "./ProfileComponents";
import { useNavigate } from "react-router-dom";
import { div } from "framer-motion/client";

function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("urunDegerlendirme");
  const [selectedCupons, setSelectedCupons] = useState("Tümü");
  const [selectedMenu, setSelectedMenu] = useState("Siparişlerim");
  const [selectedOrder, setSelectedOrder] = useState("Tümü");
  const magazaYorumApiUrl = "https://imecehub.com/api/users/magaza-yorumlari/";
  const kuponApiUrl = "https://imecehub.com/api/users/indirim-kuponu/";
  const adresApiUrl = "https://imecehub.com/api/users/kullanici-adresler/";
  const takipcilerApiUrl = "https://imecehub.com/api/users/takipciler/";
  const urunYorumApiUrl = "https://imecehub.com/api/users/urunyorum/";
  const [magazaDegerlendirmeler, setMagazaDegerlendirmeler] = useState([]);
  const [urunDegerlendirmeler, setUrunDegerlendirmeler] = useState([]);
  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";
  const menu = [
    "Siparişlerim",
    "Değerlendirmelerim",
    "İndirim Kuponlarım",
    "Takip Ettiklerim",
    "Adres Bilgilerim",
    "Kartlarım",
  ];

  const orderTabMenu = ["Tümü", "Devam Eden Siparişler", "İadeler", "İptaller"];

  const greenColor = "#00DE00";
  const yataycenter = {
    display: "flex",
    alignItems: "center",
  };
  const dikeycenter = {
    display: "flex",
    justifyContent: "center",
  };
  const MevcutKrediKarti = true;
  const fovirlerim = true;
  const krediKartlarim = [
    {
      kartNo: "0000 0000 0000 0000",
      sonKullanimTarihi: "12/25",
      cvv: "123",
      kartSahibi: "Ali Veli",
      kartAdi: "Ali Kartı",
      kartTipi: "Visa",
    },
    {
      kartNo: "1111 1111 1111 1111",
      sonKullanimTarihi: "05/23",
      cvv: "132",
      kartSahibi: "Ahmet Mehmet",
      kartAdi: "Ahmet Kartı 2",
      kartTipi: "MasterCard",
    },
  ];
  const takipEdilenler = [
    {
      adi: "Name",
      puan: "9.0",
      takipci: "1.950",
    },
    {
      adi: "Test",
      puan: "4.0",
      takipci: "1.212.950",
    },
  ];
  const siparisGecmisi = [
    {
      alıcı: "admin",
      teslimTarihi: "10 Kasım 2024",
      siparişTarihi: "6 Kasım 2024 20:21",
      tutar: "259,79",
      ürünResimleri: ["imgUrl"],
      teslimatAdet: "1",
      kargoDurum: "Teslim Edildi",
      kargoSonuc: "teslim",
    },
    {
      alıcı: "test",
      teslimTarihi: "15 Kasım 2024",
      siparişTarihi: "8 Kasım 2024 19:20",
      tutar: "155,88",
      ürünResimleri: ["imgUrl", "imgUrl"],
      teslimatAdet: "2",
      kargoDurum: "Ürün Kargoda",
      kargoSonuc: "Devam Eden Siparişler",
    },
    {
      alıcı: "test2",
      teslimTarihi: "20 Kasım 2024",
      siparişTarihi: "10 Kasım 2024 17:59",
      tutar: "359,99",
      ürünResimleri: ["imgUrl", "imgUrl", "imgUrl"],
      teslimatAdet: "3",
      kargoDurum: "Sipariş Hazırlanıyor",
      kargoSonuc: "Devam Eden Siparişler",
    },
    {
      alıcı: "test2",
      teslimTarihi: "20 Kasım 2024",
      siparişTarihi: "10 Kasım 2024 17:59",
      tutar: "359,99",
      ürünResimleri: ["imgUrl", "imgUrl", "imgUrl"],
      teslimatAdet: "3",
      kargoDurum: "İptal Edildi",
      kargoSonuc: "İptaller",
    },
    {
      alıcı: "test2",
      teslimTarihi: "20 Kasım 2024",
      siparişTarihi: "10 Kasım 2024 17:59",
      tutar: "359,99",
      ürünResimleri: ["imgUrl", "imgUrl", "imgUrl"],
      teslimatAdet: "3",
      kargoDurum: "İade Edildi",
      kargoSonuc: "İadeler",
    },
  ];
  const marginRight = "7vw"; // ekrana sağdan margin
  const marginLeft = "7vw"; // ekrana soldan margin
  const marginTop = "4vw"; // ekrana yukarıdan margin

  const [kuponlar, setKuponlar] = useState([]);
  const [adresler, setAdresler] = useState([]);
  const [takipciler, setTakipciler] = useState([]);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [addressType, setAddressType] = useState("");
  const [address, setAddress] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);

  useEffect(() => {
    // Mağaza Yorumları Api Sorgusu
    axios
      .get(magazaYorumApiUrl, {
        headers: {
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMagazaDegerlendirmeler(response.data);
        console.log("data : ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Mağaza Yorum Data:", error);
      });
  });

  useEffect(() => {
    // Ürün Yorumları Api Sorgusu
    axios
      .get(urunYorumApiUrl, {
        headers: {
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUrunDegerlendirmeler(response.data);
        console.log("data : ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Ürün Yorum Data:", error);
      });
  });

  useEffect(() => {
    // Kuponlar Api Sorgusu
    axios
      .get(kuponApiUrl, {
        headers: {
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setKuponlar(Array.isArray(response.data) ? response.data : []);
        console.log("Kuponlar: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Kupon Data:", error);
      });
  }, []);

  useEffect(() => {
    // Adresler Api Sorgusu
    axios
      .get(adresApiUrl, {
        headers: {
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAdresler(response.data);
        console.log("Adresler: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Adres Data:", error);
      });
  }, []);

  useEffect(() => {
    // Takip Edilenler Api Sorgusu
    axios
      .get(takipcilerApiUrl, {
        headers: {
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTakipciler(response.data);
        console.log("Takipciler: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Takipciler Data:", error);
      });
  }, []);

  const handleUnfollowClick = () => {
    // Takipten çıkma işlemi burada yapılabilir
    setShowUnfollowModal(true);
  };

  const handleCancelUnfollow = () => {
    // Takipten çıkma işlemi burada yapılabilir
    setShowUnfollowModal(false);
  };

  const handleConfirmUnfollow = () => {
    // Takipten çıkma işlemi burada yapılabilir
    setShowUnfollowModal(false);
  };

  const handleEditAddressClick = (adres) => {
    // Adres düzenleme işlemi burada yapılabilir
    setAddressName(adres.adresAdi || "Adres Adı");
    setAddressType(adres.adresTipi || "ev");
    setAddress(adres.adres || "Adres Bilgisi Bulunamadı");
    setIsDefaultAddress(adres.varsayilan || false);
    setShowEditAddressModal(true);
  };

  const handleSaveAddress = () => {
    // Adres kaydetme işlemi burada yapılabilir
    setShowEditAddressModal(false);
  };

  const handleCancelEditAddress = () => {
    // Adres düzenleme işlemi burada yapılabilir
    setShowEditAddressModal(false);
  };

  const handleConfirmDeleteAddress = () => {
    // Adres silme işlemi burada yapılabilir
    setShowDeleteAddressModal(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Siparişlerim":
        return (
          // Genel çerceve

          <div style={{ marginRight: marginRight }}>
            <Row style={{ justifyContent: "space-between" }}>
              <HeadlineText text="Siparişlerim" />

              <div style={{ gap: "15px", display: "flex", height: "25px" }}>
                <input
                  type="text"
                  placeholder="Ara"
                  style={{
                    border: "1px solid #00DE00",
                    width: "10vw",
                    height: "25px",
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                />
                <select
                  style={{
                    border: "1px solid #00DE00",
                    width: "10vw",
                    padding: "5px",
                    height: "35px",
                    borderRadius: "4px",
                  }}
                >
                  <option>Tüm Siparişler</option>
                  <option>Son 1 Ay</option>
                  <option>Son 3 Ay</option>
                  <option>Sadece Bu Yıl</option>
                  <option>Önceki Yıl</option>
                </select>
              </div>
            </Row>

            <Row>
              {orderTabMenu.map((item, index) => (
                <CustomButton
                  style={{
                    color: selectedOrder === item ? greenColor : "black",
                    padding: "12px 20px",
                    border:
                      selectedOrder === item ? "1px solid #00DE00" : "None",
                    margin: "20px 0px",
                  }}
                  onClick={() => setSelectedOrder(item)}
                >
                  {item}
                </CustomButton>
              ))}
            </Row>

            {siparisGecmisi.length === 0
              ? null
              : siparisGecmisi
                  .filter(
                    (item) =>
                      // selectedOrder "tümü" ise tümünü, değilse eşleşeni göster
                      selectedOrder === "Tümü" ||
                      item.kargoSonuc === selectedOrder
                  ) // 1. filtre uygula
                  .map(
                    (
                      item,
                      index // 2. kalanları OrderCard olarak render et
                    ) => (
                      <OrderCard
                        key={index}
                        buyer={item.alıcı}
                        deliveryDate={item.teslimTarihi}
                        orderDate={item.siparişTarihi}
                        price={item.tutar}
                        products={item.ürünResimleri}
                        teslimat={item.teslimatAdet}
                        orderStatus={item.kargoDurum}
                      />
                    )
                  )}
          </div>
        );

      case "Değerlendirmelerim":
        return (
          <div
            style={{ marginRight: "7vw", maxwidth: "1200px", margin: "0 auto" }}
          >
            {/* Sekme butonları */}
            <Row>
              <Column>
                <CustomButton
                  style={{
                    borderBottom:
                      activeTab === "urunDegerlendirme"
                        ? "2px solid #00DE00"
                        : "None",
                    border: "None",
                    borderRadius: "0px",
                    color:
                      activeTab === "urunDegerlendirme" ? greenColor : "black",
                  }}
                  onClick={() => setActiveTab("urunDegerlendirme")}
                >
                  {" "}
                  Ürün Değerlendirmelerim
                </CustomButton>
              </Column>
              <Column>
                <CustomButton
                  style={{
                    borderBottom:
                      activeTab === "magazaDegerlendirme"
                        ? "2px solid #00DE00"
                        : "None",
                    borderRadius: "0px",
                    border: "None",
                    color:
                      activeTab === "magazaDegerlendirme"
                        ? greenColor
                        : "black",
                  }}
                  onClick={() => setActiveTab("magazaDegerlendirme")}
                >
                  {" "}
                  Mağaza Değerlendirmelerim
                </CustomButton>
              </Column>
            </Row>

            {/* Yorum İtemleri */}
            <Container style={{ border: "none", padding: "30px 0 0 0" }}>
              {activeTab === "magazaDegerlendirme" ? (
                // Mağaza Değerlendirmeler Sekmesi
                magazaDegerlendirmeler?.isEmpty > 0 ? (
                  magazaDegerlendirmeler?.map((item, index) => (
                    <YorumCard
                      paun={item.puan}
                      olusturulmaTarihi={item.olusturma_tarihi}
                      kullanici={item.kullanici}
                      yorum={item.yorum}
                    />
                  ))
                ) : (
                  <HeadlineText text="Henüz mağaza değerlendirmeniz yok." />
                )
              ) : activeTab === "urunDegerlendirme" ? (
                // Ürün Değerlendirmeler Sekmesi
                urunDegerlendirmeler?.isEmpty > 0 ? (
                  urunDegerlendirmeler?.map((item, index) => (
                    <YorumCard
                      paun={item.puan}
                      olusturulmaTarihi={item.olusturma_tarihi}
                      kullanici={item.kullanici}
                      yorum={item.yorum}
                    />
                  ))
                ) : (
                  <HeadlineText text="Henüz ürün değerlendirmeniz yok." />
                )
              ) : null}
            </Container>
          </div>
        );

      // Diğer menü öğeleri için case ekleyebilirsiniz...
      case "İndirim Kuponlarım":
        return (
          <div style={{ marginRight: "7vw" }}>
            {/* Kuponlarım Bilgi */}
            <Container
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <Column style={{ gap: "10px" }}>
                <HeadlineText text="İndirim Kuponlarım" />
                <SubtitleText text="Kullanmak istediğiniz indirim kuponunu sepet sayfasında seçebilirsiniz." />
              </Column>
              <CustomButton>Kupon Ekle</CustomButton>{" "}
              {/* Kupon Ekleme Butonu */}
            </Container>
            <Column
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
              }}
            >
              <Row style={{ gap: "10px" }}>
                <CustomButton
                  style={{
                    border:
                      selectedCupons === "Tümü"
                        ? "1px solid #00DE00"
                        : "1px solid #ccc",
                    color: selectedCupons === "Tümü" ? greenColor : "black",
                  }}
                  onClick={() => setSelectedCupons("Tümü")}
                >
                  Tümü
                </CustomButton>
                {/* Diğer filter butonları kaldırıldı. Şu anlık ihtiyaç yok */}
              </Row>
              <hr></hr>
              {/* Kuponlarım Cardları */}
              {kuponlar.length > 0 ? (
                kuponlar.map((kupon, index) => (
                  <CouponsCard
                    key={index}
                    brand={kupon.brand} // Marka
                    price={kupon.price} // Fiyat
                    products={kupon.products} // Ürünler
                    title={kupon.title} // Başlık
                    useNumber={kupon.useNumber} // Kullanım Sayısı
                    validityDate={kupon.validityDate} // Geçerlilik Tarihi
                    showProductClick={kupon.showProductClick} // Ürün Seçme Butonu
                  />
                ))
              ) : (
                // Kupon yoksa
                <HeadlineText text="Mevcutta bir kupon yok." />
              )}
            </Column>
          </div>
        );
      case "Takip Ettiklerim":
        return (
          <div style={{ marginRight: "7vw" }}>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
              }}
            >
              <HeadlineText text="Takip Ettiklerim" />
            </div>
            <Container
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
                alignItems: "center",
              }}
            >
              {takipciler.length > 0 ? (
                takipciler.map((item, index) => (
                  // Takipçi Cardları
                  <FollowCard
                    key={index}
                    name={item.adi} // Adı
                    score={item.puan} // Puan
                    follow={item.takipci} // Takipci
                    profilClick={() => {}} // Profil Seçme Butonu
                  />
                ))
              ) : (
                // Takipçi yoksa
                <HeadlineText text="Mevcutta takipçi yok." />
              )}
            </Container>
          </div>
        );

      case "Adres Bilgilerim":
        return (
          <div style={{ marginRight: "7vw" }}>
            {/* Bilgi */}
            <Row
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <HeadlineText text="Adres Bilgilerim" />
              <CustomButton
                style={{
                  border: "None",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  color: greenColor,
                }}
                onClick={() => setShowEditAddressModal(true)} // Yeni adres ekleme işlemi burada yapılabilir
              >
                + Yeni Adres Ekle
              </CustomButton>
            </Row>
            {/* Dış Alanı */}
            <Container
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                gap: "10px",
                margin: "10px",
              }}
            >
              {/* Adres Cardları */}
              {adresler.length > 0 ? (
                adresler.map((adres, index) => (
                  // Adres Cardları
                  <AddressCard
                    key={index}
                    addressName={adres.adresAdi || "Adres Adı"} // Adres Adı
                    local={adres.mahalle || "Mahalle Adı"} // Mahalle Adı
                    address={adres.adres || "Adres Bilgisi Bulunamadı"} // Adres Bilgisi
                    province={adres.ilce || "İlçe"} // İlçe
                    phone={adres.telefon || "Telefon"} // Telefon
                    editOnClick={handleEditAddressClick} // Adres Düzenleme Butonu
                    deleteOnClick={() => setShowDeleteAddressModal(true)} // Adres Silme Butonu
                  />
                ))
              ) : (
                // Adres yoksa
                <HeadlineText text="Adres Bilgisi Bulunamadı" />
              )}
            </Container>
          </div>
        );

      case "Kartlarım":
        // Görünen Kartlar için Hazır Componentlerden çekilip kullanılabilir !!!
        // Kartlarım Bilgi
        if (MevcutKrediKarti) {
          return (
            <div style={{ marginRight: "7vw" }}>
              {/* Bilgi */}
              <Row
                style={{
                  justifyContent: "space-between",
                  margin: "0px 15px 0px 15px",
                }}
              >
                <HeadlineText
                  style={{ fontWeight: "500", fontSize: "24px" }}
                  text="Kartlarım"
                />
                <CustomButton
                  onClick={() => navigate("/add-card")}
                  style={{
                    border: "None",
                    color: greenColor,
                    fontSize: "18px",
                  }}
                >
                  + Kart Ekle
                </CustomButton>
              </Row>
              <Divider /> {/* Divider (Düz çizgi) */}
              <Container style={{ padding: "15px", margin: "15px" }}>
                {/* Mevcut Kartlar dönecek */}
                {krediKartlarim.map((item, index) => (
                  <KrediKart
                    kartNo={item.kartNo}
                    sonKullanimTarihi={item.sonKullanimTarihi}
                    cvv={item.cvv}
                    kartSahibi={item.kartSahibi}
                    kartAdi={item.kartAdi}
                    kartTipi={item.kartTipi}
                    deleteOnClick={() => setShowDeleteCardModal(true)} // Kart Silme Butonu
                  />
                ))}
              </Container>
            </div>
          );
        } else {
          return (
            <div style={{ marginRight: "7vw" }}>
              {/* Bilgi */}

              <HeadlineText
                style={{ fontWeight: "500", fontSize: "24px" }}
                text="Kartlarım"
              />

              {/* Kart Ekleme */}
              <Column
                style={{
                  alignItems: "center",
                  ...yataycenter,
                  ...dikeycenter,
                  margin: "50px",
                }}
              >
                <img
                  alt="icon"
                  style={{
                    marginRight: "2px",
                    width: "50px",
                    height: "50px",
                  }}
                  src="https://cdns.iconmonstr.com/wp-content/releases/preview/2018/240/iconmonstr-credit-card-thin.png"
                ></img>
                <HeadlineText text="Hesabınıza kayıtlı kart bulunmamaktadır." />
                <SubtitleText text="Kart kaydetme işlemi sadece alışveriş yaptıktan sonra karşınıza gelen onaylama ekranından yapılabilmektedir." />
                <SizedBox style={{ height: "20px" }} />
                <CustomButton
                  style={{
                    backgroundColor: greenColor,
                    color: "white",
                    border: "None",
                    width: "300px",
                  }}
                >
                  Alışverişe Devam Et
                </CustomButton>
              </Column>
            </div>
          );
        }
      case "Favorilerim":
        // Favori Ürünler Header'da olduğundan dolayı burada yapılması gereken işlem yoktur. Silebiliriz..
        if (fovirlerim) {
          return (
            // Bilgi
            <div style={{ marginRight: "7vw" }}>
              <HeadlineText
                style={{ fontSize: "24px", marginLeft: "15px" }}
                text="Favori Ürünlerim"
              />
              <Divider style={{ margin: "10px 0px 0px 0px" }} />
              <Container
                style={{
                  padding: "15px",
                  border: "None",
                  margin: " 20px 0px 0px 0px",
                }}
              >
                {/* Burada Favori Ürünlerin Cardları dönecek */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
                <Card
                  style={{
                    backgroundColor: "grey",
                    width: "200px",
                    height: "275px",
                  }}
                >
                  Örnek Ürün Cardları Alanı
                </Card>{" "}
                {/* Örnek Ürünlerin görünümü */}
              </Container>
            </div>
          );
        } else {
          return (
            // Bilgi
            <div style={{ marginRight: "7vw" }}>
              <Column
                style={{
                  ...yataycenter,
                  ...dikeycenter,
                  height: "45vw",
                  width: "60vw",
                }}
              >
                <HeadlineText text="Herhangi bir favori ürün yok" />
                <SizedBox style={{ height: "15px" }} />
                <CustomButton
                  style={{
                    border: "None",
                    backgroundColor: greenColor,
                    color: "white",
                    fontWeight: "600",
                    fontSize: "18px",
                    width: "250px",
                  }}
                >
                  Sepete Ürün Ekle
                </CustomButton>
              </Column>
            </div>
          );
        }
    }
  };

  return (
    <div
      // Profile Sayfasının Ana Container'ı
      style={{
        marginLeft: marginLeft,
        display: "flex",
        minheight: "100vh",
        marginRight: marginRight,
        marginTop: marginTop,
      }}
    >
      {/* Sol Taraf */}
      <Column
        style={{
          backgroundColor: "white",
          margin: "3vw 0px 0px 0px",
          gap: "10px",
          width: "190px",
          borderRadius: "1px solid#dee2e6",
        }}
      >
        {/* Menü Butonları */}
        {menu.map((item, index) => (
          <CustomButton
            style={{
              color: selectedMenu === item ? greenColor : "black",
              border: "None",
              borderRadius: "0px",
              borderBottom:
                selectedMenu === item ? "2px solid #00DE00" : "None",
            }}
            onClick={() => setSelectedMenu(item)} // Menü Butonlarının Seçilmesi
          >
            {item}
            <SizedBox></SizedBox>
          </CustomButton>
        ))}
      </Column>

      {/* Sağ Taraf */}
      <div style={{ flex: "1", marginLeft: "4vw" }}>{renderContent()}</div>

      {/* Adres Düzenleme Modal */}
      {showEditAddressModal && (
        <AddressModal
          addressName={addressName}
          setAddressName={setAddressName}
          addressType={addressType}
          setAddressType={setAddressType}
          address={address}
          setAddress={setAddress}
          isDefaultAddress={isDefaultAddress}
          setIsDefaultAddress={setIsDefaultAddress}
          onCancel={handleCancelEditAddress}
          onSave={handleSaveAddress}
        />
      )}

      {/* Adres Silme Modal */}
      {showDeleteAddressModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000, // Ensure the modal is on top
          }}
        >
          <HeadlineText text="Bu Adresi Silmek İstediğine Emin Misin?" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <CustomButton onClick={() => setShowDeleteAddressModal(false)}>
              İptal
            </CustomButton>
            <CustomButton onClick={handleConfirmDeleteAddress}>
              Onayla
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
