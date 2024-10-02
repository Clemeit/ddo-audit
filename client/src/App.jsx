import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import NavMenu from "./components/global/NavMenu";
import NavPush from "./components/global/NavPush";
import Mail from "./components/global/Mail";

const CookieForm = () => {
  // TODO: Remove all of this logic
  const [value, setValue] = React.useState("");

  function setCookie() {
    localStorage.setItem("access-cookie", value.toLowerCase());
    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "10px 0px",
      }}
    >
      <span style={{ fontSize: "20px", color: "white" }}>
        Set access cookie
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        <label htmlFor="cookie-input">
          <input
            id="cookie-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setCookie();
              }
            }}
          />
        </label>
        <button onClick={setCookie}>Set</button>
      </div>
    </div>
  );
};

export default function App() {
  // TODO: Remove this blocker!
  const accessCookie = localStorage.getItem("access-cookie");
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.body.classList.add(theme);
  } else {
    document.body.classList.add("dark-theme");
  }

  return accessCookie === "clemeit" ? (
    <React.Fragment>
      <NavMenu />
      <Outlet />
      <NavPush />
      <Mail />
      <ScrollRestoration />
    </React.Fragment>
  ) : (
    <CookieForm />
  );
}
