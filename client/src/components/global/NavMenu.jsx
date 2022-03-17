import React from "react";
import { NavBar, NavItem, NavDropdown, NavSubItem, NavDivider } from "./NavBar";
import { ReactComponent as HomeSVG } from "../../assets/global/home.svg";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import { ReactComponent as QuestsSVG } from "../../assets/global/quests.svg";
//import { ReactComponent as GeographySVG } from "../assets/global/geography.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../../assets/global/about.svg";
import { ReactComponent as MenuSVG } from "../../assets/global/menu.svg";
import { IsTheBigDay } from "../../services/TheBigDay";

let serverNames = [
    "Argonnessen",
    "Cannith",
    "Ghallanda",
    "Khyber",
    "Orien",
    "Sarlona",
    "Thelanis",
    "Wayfinder",
    // "Hardcore",
];

if (IsTheBigDay()) {
    serverNames = ["Eberron Mega-Server"];
}

const NavMenu = (props) => {
    return (
        <div id="main-nav" className="main-nav-menu">
            <NavBar>
                <div className="nav-pull">
                    <MenuSVG className="nav-icon" />
                </div>
                {/* <NavItem className="show-on-mobile" to="/">
                    <center
                        style={{
                            fontSize: "x-large",
                            fontWeight: "bold",
                            textDecoration: "none",
                        }}
                    >
                        <span>DDO Audit</span>
                    </center>
                </NavItem> */}
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
                >
                    <NavSubItem to={"/servers"}>Overview</NavSubItem>
                    <NavDivider />
                    {serverNames.map((server) => (
                        <NavSubItem
                            key={server}
                            to={"/servers/" + server.toLowerCase()}
                        >
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
                    {serverNames.map((server) => (
                        <NavSubItem
                            key={server}
                            to={"/grouping/" + server.toLowerCase()}
                        >
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
                    {serverNames.map((server) => (
                        <NavSubItem
                            key={server}
                            to={"/who/" + server.toLowerCase()}
                        >
                            <span className="nav-text">{server}</span>
                        </NavSubItem>
                    ))}
                </NavDropdown>
                {/* <NavItem to="/quests" className="hide-on-mobile">
                    <QuestsSVG className="nav-icon" />
                    <span className="nav-title">Quests</span>
                </NavItem> */}
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
