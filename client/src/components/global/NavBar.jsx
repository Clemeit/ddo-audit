import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as ExpandSVG } from "../../assets/global/expand.svg";
import $ from "jquery";

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

    let isDroppedDown = false;
    $(document).on("mouseenter", `#nav-item-to-${props.to.slice(1)}`, () => {
        if (isDroppedDown === false) {
            isDroppedDown = true;
            $(`#nav-dropdown-to-${props.to.slice(1)}`).slideDown(
                "fast",
                () => (isDroppedDown = true)
            );
        }
    });
    $(document).on("mouseleave", `#nav-item-to-${props.to.slice(1)}`, () => {
        if (isDroppedDown === true) {
            $(`#nav-dropdown-to-${props.to.slice(1)}`).slideUp(
                "fast",
                () => (isDroppedDown = false)
            );
        }
    });

    return (
        <div
            id={`nav-item-to-${props.to.slice(1)}`}
            className="nav-item"
            style={{ padding: "0px" }}
        >
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
            >
                {props.title}
                <ExpandSVG className="nav-icon-dropdown" />
            </Link>
            <div
                id={`nav-dropdown-to-${props.to.slice(1)}`}
                className="nav-dropdown"
            >
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
