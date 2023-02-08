import React from "react";
import NavMenu from "./global/NavMenu";
import NavPush from "./global/NavPush";

export default (props) => (
  <React.Fragment>
    <NavMenu />
    <div className="content">{props.children}</div>
    <NavPush />
  </React.Fragment>
);
