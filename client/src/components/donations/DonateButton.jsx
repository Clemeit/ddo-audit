import React from "react";
import { ReactComponent as GiftIcon } from "../../assets/global/gift.svg";
import { Log } from "../../services/CommunicationService";

const DonateButton = (props) => {
  const paypalLink =
    "https://www.paypal.com/donate/?hosted_button_id=YWG5SJPYLDQXY";

  const getClassName = () => {
    switch (props.variant) {
      case "Floating":
        return "donate-button-floating";
      case "Small":
        return "donate-button-small";
      case "Large":
        return "donate-button-large";
      default:
        return "donate-button-floating";
    }
  };

  return (
    <a
      className={getClassName()}
      {...props}
      onClick={() => Log("Clicked donate button")}
      href={paypalLink}
      rel="noreferrer"
      target="_blank"
    >
      <GiftIcon fill="var(--donate)" />
      <span>Donate</span>
    </a>
  );
};

const SmallDonateButton = () => {
  return <DonateButton variant="Small" />;
};

const LargeDonateButton = (props) => {
  return <DonateButton {...props} variant="Large" />;
};

const FloatingDonateButton = () => {
  return <DonateButton variant="Floating" />;
};

export { SmallDonateButton, LargeDonateButton, FloatingDonateButton };
