import React from "react";
import "../../styles/GroupAndBuyProcess/groupCreate.css";
import GroupCreateElement from "./GroupCreateElement";
const GroupCreate = () => {
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
        <div className="createGroup-Button-create">Grup Oluştur</div>
      </div>
      <div className="groupCreateContainer-2">
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
