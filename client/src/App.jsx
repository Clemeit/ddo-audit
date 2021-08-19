import React, { Suspense, lazy } from "react";
import { Route } from "react-router";
import ScrollToTop from "./components/global/ScrollToTop";
import Layout from "./components/Layout";
import "./default.css";

// Most visited pages. Don't lazy-load
// import Grouping from "./components/grouping/Grouping";
// import GroupingSpecific from "./components/grouping/GroupingSpecific";

// const Directory = lazy(() => import("./components/directory/Directory"));
// const Servers = lazy(() => import("./components/servers/Servers"));
// // const ServerSpecific = lazy(() => import("./components/ServerSpecific"));
// const Grouping = lazy(() => import("./components/grouping/Grouping"));
// const GroupingSpecific = lazy(() =>
//     import("./components/grouping/GroupingSpecific")
// );
// const NotificationForm = lazy(() =>
//     import("./components/grouping/NotificationForm")
// );
// const Who = lazy(() => import("./components/who/Who"));
// const WhoSpecific = lazy(() => import("./components/who/WhoSpecific"));
// const Quests = lazy(() => import("./components/quests/Quests"));
// const Live = lazy(() => import("./components/live/Live"));
// const About = lazy(() => import("./components/about/About"));

// Imports (included in package)
import Directory from "./components/directory/Directory";
import Servers from "./components/servers/Servers";
import Grouping from "./components/grouping/Grouping";
import GroupingSpecific from "./components/grouping/GroupingSpecific";
import NotificationForm from "./components/grouping/NotificationForm";
import Who from "./components/who/Who";
import WhoSpecific from "./components/who/WhoSpecific";
import Live from "./components/live/Live";
import About from "./components/about/About";

// Lazy loads (uncommon pages)
// const ServerSpecific = lazy(() => import("./components/ServerSpecific"));
const Quests = lazy(() => import("./components/quests/Quests"));

export default () => {
    const theme = localStorage.getItem("theme");
    if (theme) {
        document.body.classList.add(theme);
    } else {
        document.body.classList.add("dark-theme");
    }

    return (
        <Suspense fallback={<div></div>}>
            <Layout>
                <ScrollToTop />
                <Route exact path="/" component={Directory} />
                <Route exact path="/live" component={Live} />
                <Route exact path="/servers" component={Servers} />
                {/* <Route path="/servers/:serverName" component={ServerSpecific} /> */}
                <Route exact path="/quests" component={Quests} />
                <Route exact path="/grouping" component={Grouping} />
                <Route
                    exact
                    path="/grouping/:serverName"
                    component={GroupingSpecific}
                />
                <Route
                    exact
                    path="/notifications"
                    component={NotificationForm}
                />
                <Route exact path="/who" component={Who} />
                <Route path="/who/:serverName" component={WhoSpecific} />
                <Route path="/about" component={About} />
            </Layout>
        </Suspense>
    );
};
