import React, { Suspense, lazy } from "react";
import { Route } from "react-router";
import ScrollToTop from "./components/global/ScrollToTop";
import Layout from "./components/Layout";
import "./default.css";

// Most visited pages. Don't lazy-load
import Grouping from "./components/grouping/Grouping";
import GroupingSpecific from "./components/grouping/GroupingSpecific";

const Directory = lazy(() => import("./components/directory/Directory"));
const NotificationForm = lazy(() =>
    import("./components/grouping/NotificationForm")
);

// const Home = lazy(() => import("./components/Home"));
const Servers = lazy(() => import("./components/servers/Servers"));
// const ServerSpecific = lazy(() => import("./components/ServerSpecific"));
//const Grouping = lazy(() => import("./components/Grouping"));
//const GroupingSpecific = lazy(() => import("./components/GroupingSpecific"));
// const Who = lazy(() => import("./components/Who"));
// const WhoSpecific = lazy(() => import("./components/WhoSpecific"));
// const About = lazy(() => import("./components/About"));
const Quests = lazy(() => import("./components/quests/Quests"));
const Live = lazy(() => import("./components/live/Live"));
const About = lazy(() => import("./components/about/About"));

// import Servers from "./components/Servers";
// import ServerSpecific from "./components/ServerSpecific";
// import Grouping from "./components/Grouping";
// import GroupingSpecific from "./components/GroupingSpecific";
// import Who from "./components/Who";
// import About from "./components/About";

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
                {/* <Route exact path="/who" component={Who} /> */}
                {/* <Route path="/who/:serverName" component={WhoSpecific} /> */}
                <Route path="/about" component={About} />
            </Layout>
        </Suspense>
    );
};
