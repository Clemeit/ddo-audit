import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { lazy } from "react";
import "../src/default.css";

// Import common pages
import App from "./App";
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

// Import uncommon pages
const Transfers = lazy(() => import("./components/transfers/Transfers"));
const Quests = lazy(() => import("./components/quests/Quests"));
const Trends = lazy(() => import("./components/trends/Trends"));
const Suggestions = lazy(() => import("./components/global/Suggestions"));
const Community = lazy(() => import("./components/community/Community"));
const Api = lazy(() => import("./components/api/Api"));
const Timeline = lazy(() => import("./components/about/Timeline"));
const Friends = lazy(() => import("./components/friends/Friends"));
const Steps = lazy(() => import("./components/iot/Steps"));
const Timers = lazy(() => import("./components/timers/Timers"));
const DataClassification = lazy(() =>
  import("./components/dataClassification/DataClassification")
);
const CharacterRegistration = lazy(() =>
  import("./components/global/CharacterRegistration")
);
const DonateThankYou = lazy(() =>
  import("./components/donations/DonateThankYou")
);

// Set up the router
export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Directory />} />
      <Route path="live" element={<Live />} />
      <Route path="transfers" element={<Transfers />} />
      <Route path="servers" element={<Servers />} />
      <Route path="servers/:serverName" element={<ServersSpecific />} />
      <Route path="grouping" element={<Grouping />} />
      <Route path="grouping/:serverName" element={<GroupingSpecific />} />
      <Route path="who" element={<Who />} />
      <Route path="who/:serverName" element={<WhoSpecific />} />
      <Route path="quests" element={<Quests />} />
      <Route path="registration" element={<CharacterRegistration />} />
      <Route path="notifications" element={<NotificationForm />} />
      <Route path="timers" element={<Timers />} />
      <Route path="friends" element={<Friends />} />
      <Route path="trends" element={<Trends />} />
      <Route path="about" element={<About />} />
      <Route path="suggestions" element={<Suggestions />} />
      <Route path="api" element={<Api />} />
      <Route path="timeline" element={<Timeline />} />
      <Route path="data/:classification" element={<DataClassification />} />
      <Route path="donated" element={<DonateThankYou />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
