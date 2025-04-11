import React, { useState } from "react";
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
} from "./ProfileComponents.jsx";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("urunDegerlendirme");
  const [selectedCupons, setSelectedCupons] = useState("Tümü");
  const [selectedMenu, setSelectedMenu] = useState("Siparişlerim");
  const [selectedOrder, setSelectedOrder] = useState("Tümü");
  const menu = [
    "Siparişlerim",
    "Değerlendirmelerim",
    "İndirim Kuponlarım",
    "Takip Ettiklerim",
    "Adres Bilgilerim",
    "Kartlarım",
    "Favorilerim",
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
  const siparisGecmisi = [
    {
      alıcı: "admin",
      teslimTarihi: "10 Kasım 2024",
      siparişTarihi: "6 Kasım 2024 20:21",
      tutar: "259,79",
      ürünResimleri: ["imgUrl"],
      teslimatAdet: "1",
      kargoDurum: "Teslim Edildi",
    },
    {
      alıcı: "test",
      teslimTarihi: "15 Kasım 2024",
      siparişTarihi: "8 Kasım 2024 19:20",
      tutar: "155,88",
      ürünResimleri: ["imgUrl", "imgUrl"],
      teslimatAdet: "2",
      kargoDurum: "Ürün Kargoda",
    },
    {
      alıcı: "test2",
      teslimTarihi: "20 Kasım 2024",
      siparişTarihi: "10 Kasım 2024 17:59",
      tutar: "359,99",
      ürünResimleri: ["imgUrl", "imgUrl", "imgUrl"],
      teslimatAdet: "3",
      kargoDurum: "Sipariş Hazırlanıyor",
    },
  ];
  const marginRight = "7vw"; // ekrana sağdan margin
  const marginLeft = "7vw"; // ekrana soldan margin
  const marginTop = "4vw"; // ekrana yukarıdan margin

  const degerlendirmeler = [
    {
      satıcı: "Ahmet",
      ürünAçıklama: "testing",
      ürünRaiting: "5",
      teslimTarihi: "11.07.2022",
    },
    {
      satıcı: "Ahmet",
      ürünAçıklama: "testing",
      ürünRaiting: "5",
      teslimTarihi: "11.07.2022",
    },
    {
      satıcı: "Ahmet",
      ürünAçıklama: "testing",
      ürünRaiting: "5",
      teslimTarihi: "11.07.2022",
    },
    {
      satıcı: "Ahmet",
      ürünAçıklama: "testing",
      ürünRaiting: "5",
      teslimTarihi: "11.07.2022",
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "Siparişlerim":
        return (
          // Genel çerceve
          <div style={{ marginRight: marginRight }}>
            <Row style={{ justifyContent: "space-between" }}>
              <h2>Siparişlerim</h2>
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
                  key={index}
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
              ? ""
              : siparisGecmisi.map((item, index) => (
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
                ))}
          </div>
        );

      case "Değerlendirmelerim":
        return (
          <div
            style={{ marginRight: "7vw", maxwidth: "1200px", margin: "0 auto" }}
          >
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

            <Container style={{ border: "None", padding: "30px 0px 0px 0px" }}>
              {degerlendirmeler.map((item, index) => (
                <Container
                  key={index}
                  style={{
                    display: "flex",
                    gap: "15px",
                    padding: "16px",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                >
                  <Container
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#6c757d",
                      borderRadius: "4px",
                    }}
                  />
                  <Container style={{ display: "grid", border: "None" }}>
                    <p>
                      {item.satıcı} {item.ürünAçıklama}
                    </p>
                    <Row style={{ gap: "10px" }}>
                      <span>Puan: {item.ürünRaiting}</span>
                      <span>Teslim Tarihi: {item.teslimTarihi}</span>
                    </Row>
                    <Container
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        border: "None",
                      }}
                    >
                      <CustomButton>Ürünü Değerlendir</CustomButton>
                    </Container>
                  </Container>
                </Container>
              ))}
            </Container>
          </div>
        );

      // Diğer menü öğeleri için case ekleyebilirsiniz...
      case "İndirim Kuponlarım":
        return (
          // genel div
          <div style={{ marginRight: "7vw" }}>
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
              <CustomButton>Kupon Ekle</CustomButton>
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
              {/* Kuponlar Tab menü Butonları */}
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
                <CustomButton
                  style={{
                    border:
                      selectedCupons === "AvantajlıKupon"
                        ? "1px solid #00DE00"
                        : "1px solid #ccc",
                    color:
                      selectedCupons === "AvantajlıKupon"
                        ? greenColor
                        : "black",
                  }}
                  onClick={() => setSelectedCupons("AvantajlıKupon")}
                >
                  Avantajlı Kupon
                </CustomButton>
                <CustomButton
                  style={{
                    border:
                      selectedCupons === "SizeÖzel"
                        ? "1px solid #00DE00"
                        : "1px solid #ccc",
                    color: selectedCupons === "SizeÖzel" ? greenColor : "black",
                  }}
                  onClick={() => setSelectedCupons("SizeÖzel")}
                >
                  Size Özel
                </CustomButton>
              </Row>
              <hr></hr>
              {/* Kupon Cardı Modeli */}
              <CouponsCard
                brand=""
                price=""
                products=""
                title=""
                useNumber=""
                validityDate=""
                showProductClick=""
              />
            </Column>
          </div>
        );
      case "Takip Ettiklerim":
        return (
          <div style={{ marginRight: "7vw" }}>
            {/* Bilgi */}
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
            {/* Takip Ettiklerin Dış Container'ı */}
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
              {/* Takip Ettiklerin İtemları */}
              <Column
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "10px",
                  gap: "10px",
                  margin: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "150px",
                }}
              >
                <CircleAvatar></CircleAvatar>
                <Row>
                  {" "}
                  <HeadlineText text="Name" />{" "}
                  <Container
                    style={{ width: "5px", height: "5px" }}
                  ></Container>{" "}
                  <Container
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "3px",
                      padding: "2px",
                    }}
                  >
                    9.0
                  </Container>{" "}
                </Row>

                <SubtitleText text="Takipçi sayısı" />
                <div style={{ height: "10px" }}></div>
                <CustomButton style={{ width: "80px" }}>Profil</CustomButton>
              </Column>
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
              <AddressCard
                address="Adres"
                city="city"
                addressName="Adres Adı"
                province="Balıkesir / Burhaniye"
                local={"Mahalle Adı"}
                phone={"tel no"}
              />
            </Container>
          </div>
        );

      case "Kartlarım":
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
                <Card
                  style={{
                    backgroundColor: "grey",
                    with: "275px",
                    height: "150px",
                  }}
                >
                  Örnek Kredi Kartı Görünümü
                </Card>
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
      style={{
        marginLeft: marginLeft,
        display: "flex",
        minheight: "100vh",
        marginRight: marginRight,
        marginTop: marginTop,
      }}
    >
      <Column
        style={{
          backgroundColor: "white",
          margin: "3vw 0px 0px 0px",
          gap: "10px",
          borderRadius: "8px",
          width: "190px",
          borderRadius: "1px solid #dee2e6",
        }}
      >
        {menu.map((item, index) => (
          <CustomButton
            key={index}
            style={{
              color: selectedMenu === item ? greenColor : "black",
              border: "None",
              borderRadius: "0px",
              borderBottom:
                selectedMenu === item ? "2px solid #00DE00" : "None",
            }}
            onClick={() => setSelectedMenu(item)}
          >
            {item}
            <SizedBox></SizedBox>
          </CustomButton>
        ))}
      </Column>

      <div style={{ flex: "1", marginLeft: "4vw" }}>{renderContent()}</div>
    </div>
  );
}

export default App;
