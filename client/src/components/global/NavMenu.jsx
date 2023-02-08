import React from "react";
import { NavBar, NavItem, NavDropdown, NavSubItem, NavDivider } from "./NavBar";
import { ReactComponent as HomeSVG } from "../../assets/global/home.svg";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as TransferSVG } from "../../assets/global/transfer.svg";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../../assets/global/about.svg";
import { ReactComponent as MenuSVG } from "../../assets/global/menu.svg";
import ServerHook from "../../hooks/ServerHook";
import { SERVER_LIST } from "../../constants/Servers";
import FeatureFlagHook from "../../hooks/FeatureFlagHook";
import { Log } from "../../services/CommunicationService";

const NavMenu = () => {
  const SERVERS = ServerHook();
  const showTransferPage = FeatureFlagHook("transfers");

  return (
    <div id="main-nav" className="main-nav-menu">
      <NavBar>
        <div className="nav-pull">
          <MenuSVG className="nav-icon" />
        </div>
        <NavItem to="/">
          <div className="nav-icon-container">
            <HomeSVG className="nav-icon" />
          </div>
          <span className="nav-title">Home</span>
        </NavItem>
        <NavItem to="/live">
          <LiveSVG className="nav-icon" />
          <span className="nav-title">Live</span>
        </NavItem>
        <NavDropdown
          to="/servers"
          title={
            <div className="nav-title">
              <ServersSVG className="nav-icon" />
              <span className="nav-text">Servers</span>
            </div>
          }
          className="hide-on-small-screen"
        >
          <NavSubItem to={"/servers"}>Overview</NavSubItem>
          <NavDivider />
          {SERVER_LIST.map((server) => (
            <NavSubItem key={server} to={"/servers/" + server.toLowerCase()}>
              <span className="nav-text">{server}</span>
            </NavSubItem>
          ))}
        </NavDropdown>
        <NavDropdown
          to="/grouping"
          title={
            <div className="nav-title">
              <GroupingSVG className="nav-icon" />
              <span className="nav-text">Grouping</span>
            </div>
          }
        >
          <NavSubItem to={"/grouping"}>Overview</NavSubItem>
          <NavDivider />
          {SERVERS.map((server) => (
            <NavSubItem key={server} to={"/grouping/" + server.toLowerCase()}>
              <span className="nav-text">{server}</span>
            </NavSubItem>
          ))}
        </NavDropdown>
        <NavDropdown
          to="/who"
          title={
            <div className="nav-title">
              <WhoSVG className="nav-icon" />
              <span className="nav-text">Who</span>
            </div>
          }
        >
          <NavSubItem to={"/who"}>Overview</NavSubItem>
          <NavDivider />
          {SERVERS.map((server) => (
            <NavSubItem key={server} to={"/who/" + server.toLowerCase()}>
              <span className="nav-text">{server}</span>
            </NavSubItem>
          ))}
        </NavDropdown>
        {/* <NavItem to="/quests" className="hide-on-mobile">
                    <QuestsSVG className="nav-icon" />
                    <span className="nav-title">Quests</span>
                </NavItem> */}
        {showTransferPage && (
          <NavItem
            onClick={() => Log("Transfers page", "From NavMenu")}
            to="/transfers"
            className="hide-on-mobile"
          >
            <TransferSVG className="nav-icon" />
            <span className="nav-title">Transfers</span>
          </NavItem>
        )}
        <NavItem to="/trends" className="hide-on-mobile">
          <TrendsSVG className="nav-icon" />
          <span className="nav-title">Trends</span>
        </NavItem>
        <NavItem to="/about" className="hide-on-mobile">
          <AboutSVG className="nav-icon" />
          <span className="nav-title">About</span>
        </NavItem>
      </NavBar>
      <div className="nav-overlay" />
    </div>
  );
};

export default NavMenu;
