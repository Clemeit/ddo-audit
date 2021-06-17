import * as React from "react";
import Banner from "./Banner";
import NavMenu from "./NavMenu";
import Footer from "./Footer";
import NavPush from "./NavPush";

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Banner />
        <NavMenu />
        <div className="content">{props.children}</div>
        <Footer />
        <NavPush />
    </React.Fragment>
);
