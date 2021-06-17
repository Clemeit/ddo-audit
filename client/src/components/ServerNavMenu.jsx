import React from "react";

const ServerNavMenu = (props) => {
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

    return (
        <div
            className="server-nav-bar"
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            <div key="overview" className="server-nav-item active">
                Overview
            </div>
            {serverNames.map((server) => (
                <div key={server} className="server-nav-item">
                    {server}
                </div>
            ))}
        </div>
    );
};

export default ServerNavMenu;
