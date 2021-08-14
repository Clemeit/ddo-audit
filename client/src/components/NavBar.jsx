import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavMenu.css";
import { ReactComponent as ExpandSVG } from "../assets/global/expand.svg";

const NavBar = (props) => {
    return (
        <div className="nav-bar" id="nav-bar">
            {props.children}
        </div>
    );
};

const NavItem = (props) => {
    const location = useLocation();

    return (
        <Link
            to={props.to}
            className={
                "nav-item " +
                props.className +
                " " +
                (props.to === "/"
                    ? location.pathname === props.to
                        ? "active"
                        : ""
                    : location.pathname.includes(props.to)
                    ? "active"
                    : "")
            }
        >
            {props.children}
        </Link>
    );
};

const NavDropdown = (props) => {
    const location = useLocation();

    return (
        <div className="nav-item" style={{ padding: "0px" }}>
            <Link
                to={props.to}
                className={
                    "nav-item " +
                    (props.to === "/"
                        ? location.pathname === props.to
                            ? "active"
                            : ""
                        : location.pathname.includes(props.to)
                        ? "active"
                        : "")
                }
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 15px 10px 15px",
                    cursor: "pointer",
                }}
            >
                {props.title}
                <ExpandSVG className="nav-icon-dropdown" />
            </Link>
            <div className="nav-dropdown">
                {props.children.map((child) => child)}
            </div>
        </div>
    );
};

const NavSubItem = (props) => {
    return (
        <Link to={props.to} className="nav-subitem">
            {props.children}
        </Link>
    );
};

const NavDivider = (props) => {
    return <div className="nav-divider" />;
};

export { NavBar, NavItem, NavDropdown, NavSubItem, NavDivider };
