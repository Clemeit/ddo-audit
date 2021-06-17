import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { ReactComponent as HomeSVG } from "../assets/global/home.svg";
import { ReactComponent as ServersSVG } from "../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../assets/global/who.svg";
import { ReactComponent as GeographySVG } from "../assets/global/geography.svg";
import { ReactComponent as TrendsSVG } from "../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../assets/global/about.svg";

const serverNames = [
    "Argonnessen",
    "Cannith",
    "Ghallanda",
    "Khyber",
    "Orien",
    "Sarlona",
    "Thelanis",
    "Wayfinder",
    "Hardcore",
];

const NavMenu = (props) => {
    return (
        <Navbar variant="dark" expand="sm" style={{ padding: "0px" }}>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" label="Menu" />
            <Navbar.Collapse>
                <Nav>
                    <Link className="nav-item" to="/">
                        <HomeSVG className="nav-icon" />
                        Home
                    </Link>
                    <NavDropdown
                        title={
                            <span
                                style={{
                                    display: "inline-block",
                                    height: "auto",
                                    padding: "0px",
                                }}
                                className="nav-item"
                            >
                                <ServersSVG className="nav-icon" />
                                Servers
                            </span>
                        }
                    >
                        <Link
                            role="button"
                            className="dropdown-item"
                            to="/servers"
                        >
                            Overview
                        </Link>

                        <NavDropdown.Divider />

                        {serverNames.map((server) => (
                            <Link
                                role="button"
                                key={server}
                                className="dropdown-item"
                                to={"/servers/" + server.toLowerCase()}
                            >
                                {server}
                            </Link>
                        ))}
                    </NavDropdown>
                    <Link className="nav-item" to="/grouping">
                        <GroupingSVG className="nav-icon" />
                        Grouping
                    </Link>
                    <Link className="nav-item" to="/who">
                        <WhoSVG className="nav-icon" />
                        Who
                    </Link>
                    <Link className="nav-item" to="/trends">
                        <TrendsSVG className="nav-icon" />
                        Trends
                    </Link>
                    <Link className="nav-item" to="/about">
                        <AboutSVG className="nav-icon" />
                        About
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavMenu;
