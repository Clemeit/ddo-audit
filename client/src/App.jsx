import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "react-router-dom";
import ScrollToTop from "./components/global/ScrollToTop";
import Layout from "./components/Layout";
import "./default.css";
import history from "./history";

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
import ServersSpecific from "./components/servers/ServersSpecific";
import Grouping from "./components/grouping/Grouping";
import GroupingSpecific from "./components/grouping/GroupingSpecific";
import NotificationForm from "./components/grouping/NotificationForm";
import Who from "./components/who/Who";
import WhoSpecific from "./components/who/WhoSpecific";
import Live from "./components/live/Live";
import About from "./components/about/About";
import NotFound from "./components/directory/NotFound";
import Mail from "./components/global/Mail";
// import ActivityTesting from "./components/dev/ActivityTesting";

// Lazy loads (uncommon pages)
// const ServerSpecific = lazy(() => import("./components/ServerSpecific"));
const Transfers = lazy(() => import("./components/transfers/Transfers"));
const Quests = lazy(() => import("./components/quests/Quests"));
const Trends = lazy(() => import("./components/trends/Trends"));
const Suggestions = lazy(() => import("./components/global/Suggestions"));
const Community = lazy(() => import("./components/community/Community"));
// const Guilds = lazy(() => import("./components/guilds/Guilds"));
const Api = lazy(() => import("./components/api/Api"));
const Timeline = lazy(() => import("./components/about/Timeline"));
const Friends = lazy(() => import("./components/friends/Friends"));
const Steps = lazy(() => import("./components/iot/Steps"));
const Timers = lazy(() => import("./components/timers/Timers"));
const CharacterRegistration = lazy(() =>
  import("./components/global/CharacterRegistration")
);

export default () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.body.classList.add(theme);
  } else {
    document.body.classList.add("dark-theme");
  }

  return (
    <Suspense fallback={<div></div>}>
      <Router history={history}>
        <Layout>
          <Mail />
          <ScrollToTop />
          <Switch>
            <Route exact path="/">
              <Directory />
            </Route>
            <Route exact path="/live">
              <Live />
            </Route>
            <Route exact path="/transfers">
              <Transfers />
            </Route>
            <Route exact path="/servers">
              <Servers />
            </Route>
            <Route exact path="/servers/:serverName">
              <ServersSpecific />
            </Route>
            <Route exact path="/quests">
              <Quests />
            </Route>
            {/* <Route exact path="/guilds">
                            <Guilds />
                        </Route> */}
            <Route exact path="/grouping">
              <Grouping />
            </Route>
            <Route exact path="/registration">
              <CharacterRegistration />
            </Route>
            <Route exact path="/grouping/:serverName">
              <GroupingSpecific />
            </Route>
            <Route exact path="/notifications">
              <NotificationForm />
            </Route>
            <Route exact path="/timers">
              <Timers />
            </Route>
            <Route exact path="/who">
              <Who />
            </Route>
            <Route exact path="/friends">
              <Friends />
            </Route>
            <Route exact path="/trends">
              <Trends />
            </Route>
            <Route exact path="/who/:serverName">
              <WhoSpecific />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/suggestions">
              <Suggestions />
            </Route>
            {/* <Route exact path="/community">
                            <Community />
                        </Route> */}
            <Route exact path="/api">
              <Api />
            </Route>
            <Route exact path="/timeline">
              <Timeline />
            </Route>
            {/* <Route exact path="/steps">
                            <Steps />
                        </Route> */}
            {/* <Route exact path="/dev">
                            <ActivityTesting />
                        </Route> */}
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </Suspense>
  );
};
