import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Servers from "./components/Servers";
import ServerSpecific from "./components/ServerSpecific";
import Grouping from "./components/Grouping";
import GroupingSpecific from "./components/GroupingSpecific";
import Who from "./components/Who";
import About from "./components/About";

import "./custom.css";

export default () => {
    const theme = localStorage.getItem("theme");
    if (theme) {
        document.body.classList.add(theme);
    } else {
        document.body.classList.add("dark-theme");
    }

    return (
        <Layout>
            <Route exact path="/" component={Home} />
            <Route exact path="/servers" component={Servers} />
            <Route path="/servers/:serverName" component={ServerSpecific} />
            <Route exact path="/grouping" component={Grouping} />
            <Route
                exact
                path="/grouping/:serverName"
                component={GroupingSpecific}
            />
            <Route path="/who" component={Who} />
            <Route path="/about" component={About} />
        </Layout>
    );
};
