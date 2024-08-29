import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import NavMenu from "./components/global/NavMenu";
import NavPush from "./components/global/NavPush";
import Mail from "./components/global/Mail";

export default function App() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.body.classList.add(theme);
  } else {
    document.body.classList.add("dark-theme");
  }

  return (
    <React.Fragment>
      <NavMenu />
      <Outlet />
      <NavPush />
      <Mail />
      <ScrollRestoration />
    </React.Fragment>
  );
}
