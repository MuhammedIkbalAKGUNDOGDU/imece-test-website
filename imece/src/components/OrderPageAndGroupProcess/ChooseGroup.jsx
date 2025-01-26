import React from "react";
import "../../styles/GroupAndBuyProcess/groupCreate.css";
import GroupCreateElement from "./ChooseGroupElement";
import { useNavigate } from "react-router-dom"; // useNavigate import edildi

const GroupCreate = () => {
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıldı

  return (
    <div className="groupCreateContainer">
      <div className="groupCreateContainer-1">
        <div>
          <p className="createGroupSatici">Ahmet Yoran</p>
          <div className="createGroup-1-1">
            <p className="createGroup-1-1-1">Grup Oluşturabilirsin</p>{" "}
            <p className="createGroup-1-1-2 pointer">Bilgi Almak İçin Tıkla</p>
          </div>
          <p className="createGroup-1-2">
            Grubuna Yeni kişiler kat ve daha ucuza al
          </p>
        </div>
        <div
          onClick={() => navigate("/order-page/create-group")}
          className="createGroup-Button-create pointer clickable"
        >
          Grup Oluştur
        </div>
      </div>
      <div className="groupCreateContainer-2 scrollbar-hide">
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
        <GroupCreateElement />
      </div>
    </div>
  );
};

export default GroupCreate;
