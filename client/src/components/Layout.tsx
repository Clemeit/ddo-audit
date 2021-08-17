import * as React from "react";
import Banner from "./global/Banner";
import NavMenu from "./global/NavMenu";
import NavPush from "./global/NavPush";

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        {/* <Banner /> */}
        <NavMenu />
        <div className="content">{props.children}</div>
        <NavPush />
    </React.Fragment>
);
