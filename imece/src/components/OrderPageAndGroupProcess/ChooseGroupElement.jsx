import React from "react";
import "../../styles/GroupAndBuyProcess/groupCreate.css";
import { RiGroupLine } from "react-icons/ri";
import { CiLock } from "react-icons/ci";
import { TfiUnlock } from "react-icons/tfi";

const GroupCreateElement = () => {
  return (
    <div className="groupCreateElement">
      <p className="groupCreateElement-name">Name</p>
      <p className="groupCreateElement-price">KG: XTL</p>
      <div className="flex">
        <p className="groupCreateElement-member">y/x</p>
        <RiGroupLine style={{ fontSize: "20px", strokeWidth: "1" }} />
      </div>
      <div className="flex">
        <p className="groupCreateElement-groupType">Group Type(open/close)</p>
        <CiLock
          color="#FF7A00"
          style={{ fontSize: "24px", strokeWidth: "1.5" }}
        />
        <TfiUnlock
          color="#3DD13D"
          style={{ fontSize: "24px", strokeWidth: "1.5" }}
        />
      </div>
    </div>
  );
};

export default GroupCreateElement;
