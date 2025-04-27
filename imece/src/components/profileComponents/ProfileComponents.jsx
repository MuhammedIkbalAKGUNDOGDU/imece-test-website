// MyComponents.js
import React from 'react';

export const Row = ({ children, style = {}, ...props }) => {
  const combinedStyle = {
    display: 'flex',
    flexDirection: 'row',
    border: '0px solid #ccc', 
    padding: '0px', 
    borderRadius: '0px',
    gap: '0px',
    ...style,
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};

export const Column = ({ children, style = {}, ...props }) => {
  const combinedStyle = {
    display: 'flex',
    flexDirection: 'column',
    border: '0px solid #ccc', 
    padding: '0px', 
    borderRadius: '0px',
    gap: '0px',
    ...style,
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};

export const HeadlineText = ({ text, style = {}, ...props }) => {
  const combinedStyle = {
    fontSize: '18px',
    fontWeight: '500',
    ...style,
  };

  return (
    <span style={combinedStyle} {...props}>
      {text}
    </span>
  );
};

export const SubtitleText = ({ text, style = {}, ...props }) => {
  const combinedStyle = {
    fontSize: '12px',
    fontWeight: 'normal',
    ...style,
  };

  return (
    <span style={combinedStyle} {...props}>
      {text}
    </span>
  );
};

export const CustomButton = ({ clicked, style = {}, children, ...props }) => {
  const combinedStyle = {
    padding: '10px',
    border: '1px solid #00DE00',
    backgroundColor: 'white',
    color: '#00DE00',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    ...style,
  };

  return (
    <button style={combinedStyle} {...props}>
      {children}
    </button>
  );
};

export const textIconButton = ({ iconUrl, children, style = {}, ...props }) => {
  // text ve iconlu buton compenenti
  const combinedStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    ...style,
  };

  const iconStyle = {
    marginRight: '8px',
    width: '20px',
    height: '20px',
  };

  return (
    <button style={combinedStyle} {...props}>
      {iconUrl && <img src={iconUrl} alt="icon" style={iconStyle} />}
      {children}
    </button>
  );
};


export const Container = ({ children, style = {}, ...props }) => {
  // Genel Container compenent i
  const combinedStyle = {
    display: 'flex',
    borderRadius:'10px',
    border:'1px solid #ccc',
    flexWrap: 'wrap', // Öğeler sığmadığında alt satıra geçer
    gap: '16px', // Öğeler arasındaki boşluk
    ...style, // Dışarıdan gelen stil özelliklerini ekler
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};

export const Card = ({ children, style = {}, ...props }) => {
  // Genel Card compenent i
  const combinedStyle = {
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius:'6px',
    padding: '16px',
    backgroundColor: '#fff',
    ...style, // Dışarıdan gelen stil özelliklerini ekler
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};

export const CircleAvatar = ({ style = {}, ...props }) => {
  // profil resmi, mağaza resimleri için, Takip edilenler ekranı
  const defaultStyle = {
    width: '60px',
    height: '60px',
    border: '1px solid #ccc',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <div style={combinedStyle} {...props}>
      {/* İçerik buraya gelecek */}
    </div>
  );
};


export const SizedBox = ({ height,children, style = {}, ...props }) => {
  // alan boluğu yaratmak için
  const combinedStyle = {
    height:'10px',
    width:'10px',
    ...style, // Dışarıdan gelen stil özelliklerini ekler
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};


export const AddressCard = ({ addressName, local, address, province, phone, deleteOnClick , editOnClick }) => {
  return (
    <div style={styles.card}>
      <HeadlineText text={addressName} />
      <SubtitleText text={local}/>
      <SubtitleText text={address}/>
      <SubtitleText text={province}/>
      <SubtitleText text={phone}/>
      <Row style={{justifyContent: 'space-between'}}>
        <CustomButton onClick={deleteOnClick} style={{border:'None',padding:'0px', color:'red'}}> {/* Sil butonu öncesi icon eklenebilir */} Sil</CustomButton>
        <CustomButton onClick={editOnClick}>Adresi Düzenle</CustomButton>
      </Row>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    padding: '10px',
    width: '250px',
  },
};

export const CouponsCard = ({ price, brand, products, useNumber, validityDate, showProductClick }) => {
  return (
    <Column style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', gap: '10px', margin: '10px' }}>
      <HeadlineText text={brand === undefined ? 'Marka': brand === '' ? 'Marka': brand} />

      {/* Kuponlar */}
      <Row style={{ gap: '25px', justifyContent: 'space-around', alignItems: 'center' }}>
        {/* Kupon geçerli ürün fotoğrafları */}
        <Row style={{ gap: '5px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'grey', color: 'white', borderRadius: '6px' }}>Ürün</div>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'grey', color: 'white', borderRadius: '6px' }}>Ürün</div>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'grey', color: 'white', borderRadius: '6px' }}>Ürün</div>
        </Row>
                
        {/* Kupon bilgisi */}
        <SubtitleText 
          text={`Bu kupon; ${brand === undefined ? '{Marka}' : brand === '' ? '{Marka}' : brand} markasından yapılacak alışverişlerde geçerlidir. Kupon kullanımı ilk 
          ${useNumber === undefined ? '{kullanımSayısı}': useNumber === '' ? '{kullanımSayısı}': useNumber} adet ile sınırlıdır.`}
        />

        {/* Kuponun indirim miktarı */}
        <HeadlineText style={{ width: '125px' }} text={`${price === undefined  ? "00" : price === ''? '00':price} TL`} />

        {/* Kuponun geçerli olduğu ürünler listesi */}
        <CustomButton onClick={showProductClick} style={{ width: '150px' }}>
          Ürünleri Gör
        </CustomButton>
      </Row>

      <SubtitleText text={`Geçerlilik tarihi: ${validityDate === undefined ? '00-00-0000' : validityDate === '' ? '00-00-0000' : validityDate}`} style={{ color: 'grey' }} />
    </Column>
  );
};


export const OrderCard = ({orderDate, deliveryDate, buyer, price, orderStatus, products,teslimat ,onClick}) => {

  orderStatus = orderStatus === undefined ? 'None' : orderStatus === undefined ? 'None' : orderStatus
  return (
    // Genel Card
    <Card  style={{border: '1px solid #dee2e6',  borderRadius: '8px',  marginBottom: '10px',padding:'0px'}}>
      {/* Sipariş Card başlıkları ve bilgileri */}
      <Row style={{display: 'flex',  justifyContent: 'space-between',alignItems: 'center',  padding: '16px',  background: '#f8f9fa', gap:'0px'}}>
        <Column>
          <HeadlineText style={{fontWeight:'750',fontSize:'16px'}} text='Sipariş Tarihi'/>
          <p>{`${orderDate === undefined ? '8 Kasım 2024 - 11:53' : orderDate === '' ? '8 Kasım 2024 - 11:53' : orderDate}`}</p>
        </Column>
        <Column>
          <HeadlineText style={{fontWeight:'750',fontSize:'16px'}}  text='Sipariş Özeti' />
          <p>{teslimat === undefined ? '1' : teslimat === '' ? '1' : teslimat} Teslimat,  
              {products === undefined ? ' 1': products === '' ? ' 1': products.length} Ürün </p>
        </Column>
        <Column style={{gap:'0px' ,margin:'0px', padding:'0px'}}>
          <HeadlineText style={{fontWeight:'750',fontSize:'16px'}} text='Alıcı' />
          <p>{buyer === undefined ? 'Kullanıcının adı' : buyer === '' ? 'Kullanıcının adı' : buyer}</p>
        </Column>
        <Column>
          <HeadlineText style={{fontWeight:'750',fontSize:'16px'}} text='Tutar' />
          <p>{price === undefined ? '0' : price === '' ? '0' : price} TL</p>
        </Column>
        <CustomButton style={{backgroundColor:'#00DE00', color:'white', fontWeight:'500'}} onClick= {onClick}>Sipariş Detayı</CustomButton>
      </Row>
      {/* Sipariş Cardı bilgiler alanın bitiş çizgisi */}
      <Container></Container>
      {/* Teslim ürünleri ve bilgileri */}
      <Container style={{margin:'15px',padding:'15px'}}>
        {/* Kargo durumu ve teslim bilgisi */}
        <Column>
          <HeadlineText style={{color: orderStatus === 'İptal Edildi' ?'red' :orderStatus === 'Teslim Edildi' ?'#00DE00' :orderStatus === 'Sipariş Hazırlanıyor' ?'orange' :orderStatus === 'Ürün Kargoda' ?'blue' : 'grey',fontWeight:'600'}} text={orderStatus}></HeadlineText>
          <p>{products === undefined ? ' 1': products === '' ? ' 1': products.length} ürün<span> </span>
          { deliveryDate === undefined ? ' 13 Temmuz': deliveryDate === '' ? ' 13 Temmuz': deliveryDate}'da teslim edilecek</p>
        </Column>
        {/* Sipariş ürünlerin kapak resimleri Adet sayısı kadar */}
        <Row style={{gap: '10px',  marginLeft: 'auto'}}> 
          {
          products === undefined ? (''):
          (products.map((item, index) => (
          
          <Container 
            key={index}  // Her render edilen öğe için benzersiz bir key eklemek performans açısından önemlidir.
            style={{
              width: '60px',
              height: '75px',
              backgroundColor: 'grey',
              borderRadius: '4px',
              border: '1px solid rgba(0, 0, 0, 0.6)',
              flexShrink:  '0',
            }}
          />
          )))}
        </Row>
      </Container>
    </Card>
  );

};



export const Divider = ({ children, style = {}, ...props }) => {
  const combinedStyle = {
    display: 'flex',
    border:'1px solid #ccc',
    flexWrap: 'wrap', // Öğeler sığmadığında alt satıra geçer
    ...style, // Dışarıdan gelen stil özelliklerini ekler
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
};

export const KrediKart =({kartNo, sonKullanimTarihi, cvv, kartSahibi, kartAdi, kartTipi , deleteOnClick}) => {

  return (
    <Card style={{
      position: 'relative',      // 1. Referans kapsayıcı
      width: '325px',
      overflow: 'hidden',
      backgroundColor: '#20a3d8',
      padding: '24px',
    }}>
      <button
      aria-label="Kapat"
      onClick={deleteOnClick}
      style={{
        position: 'absolute',
        top: '-4px',
        color: 'red',
        right: '4px',
        border: 'none',
        background: 'transparent',
        fontSize: '28px',
        cursor: 'pointer',
      }}
    >
      &times;
    </button>
    <Column style={{justifyContent: "space-around", gap: "10px"}}>
      <Row style={{justifyContent: "space-between"}}> 
        <SubtitleText style={{color:'white', fontWeight:'600'}} text={kartAdi} />
        <SubtitleText style={{color:'white', fontWeight:'600', fontSize:'18px'}} text={kartTipi} />
      </Row>
      
      <HeadlineText style={{color:'white', fontWeight:'600', fontSize:'22px'}} text={kartNo} />

      <HeadlineText style={{color:'white', fontWeight:'600', fontSize:'22px'}} text={kartSahibi} />

      <Row style={{justifyContent: "space-between"}}>
        <Column>
          <SubtitleText style={{color:'white', fontWeight:'600'}} text="Geçerlilik Tarihi" />
          <HeadlineText style={{color:'white', fontWeight:'600', fontSize:'22px'}} text={sonKullanimTarihi} />
        </Column>
        <Column>
        <SubtitleText style={{color:'white', fontWeight:'600'}} text="CVV" />
        <HeadlineText style={{color:'white', fontWeight:'600', fontSize:'22px'}} text={cvv} />
        </Column>
        
      </Row>
      
    </Column>
    </Card>
  );
};


export const FollowCard = ({name, score, follow, image, profilClick}) => {
  return (
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
      position: 'relative',      // 1. Referans kapsayıcı
      overflow: 'hidden',
      }}
      >
      <button
      aria-label="Kapat"
      onAbort={profilClick}
      style={{
      position: 'absolute',
      top: '-4px',
      color: 'red',
      right: '4px',
      border: 'none',
      background: 'transparent',
      fontSize: '28px',
      cursor: 'pointer',
      }}
      >
      &times;
      </button>
      <CircleAvatar></CircleAvatar>
      <Row>
        {" "}
        <HeadlineText text={name} />{" "}
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
        {score}
        </Container>{" "}
      </Row>
    
      <SubtitleText text= {`${follow} Takipçi`} />
      <div style={{ height: "10px" }}></div>
      <CustomButton style={{ width: "80px" }}>Profil</CustomButton>
    </Column>
  );
}


export const YorumCard = ({paun, olusturulmaTarihi, yorum, kullanici,onClick}) => {
  return (
    <Container
      style={{
      display: "flex",
      gap: "15px",
      padding: "16px",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      margin: "10px"
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
        <HeadlineText text={kullanici} />{" "}
        <Container style={{ width: "5px", height: "5px" }}></Container>{" "}
        <SubtitleText text={yorum} />
      </p>
      <Row style={{ gap: "10px" }}>
        <span>Puan: {paun}</span>
        <span>Yorum Tarihi: {olusturulmaTarihi}</span>
      </Row>
      <Container
        style={{
        display: "flex",
        justifyContent: "flex-end",
        border: "None",
        }}
      >
      <CustomButton  onClick={() => onClick}>Ürünü Değerlendir</CustomButton>
      </Container>
    </Container>
  </Container>
  );
}

export const AddressModal = ({
  addressName,
  setAddressName,
  addressType,
  setAddressType,
  address,
  setAddress,
  isDefaultAddress,
  setIsDefaultAddress,
  onCancel,
  onSave
}) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000 // Ensure the modal is on top
  }}>
    <HeadlineText text="Adres Düzenle" />
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
      <input
        type="text"
        placeholder="Adres Adı"
        value={addressName}
        onChange={(e) => setAddressName(e.target.value)}
        style={{
          border: "1px solid #00DE00",
          width: '300px',
          height: "35px",
          borderRadius: "4px",
          padding: "5px",
          marginBottom: '10px'
        }}
      />
      <select
        value={addressType}
        onChange={(e) => setAddressType(e.target.value)}
        style={{
          border: "1px solid #00DE00",
          width: '50%',
          height: "35px",
          borderRadius: "4px",
          padding: "5px",
          marginBottom: '10px'
        }}
      >
        <option value="ev">Ev</option>
        <option value="iş">İş</option>
        <option value="ofis">Ofis</option>
        <option value="diğer">Diğer</option>
      </select>
      <textarea
        placeholder="Adres"
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{
          border: "1px solid #00DE00",
          width: "300px",
          height: "100px",
          borderRadius: "4px",
          padding: "5px",
          marginBottom: "10px",
          overflow: "auto",
          resize: "vertical",
          transition: "border-color 0.2s ease"
        }}
      />
      <label style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={isDefaultAddress}
          onChange={(e) => setIsDefaultAddress(e.target.checked)}
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #00DE00',
            borderRadius: '4px',
            marginRight: '10px',
            accentColor: '#00DE00'
          }}
        />
        Varsayılan Adres
      </label>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <CustomButton onClick={onCancel}>İptal</CustomButton>
      <CustomButton onClick={onSave}>Kaydet</CustomButton>
    </div>
  </div>
);