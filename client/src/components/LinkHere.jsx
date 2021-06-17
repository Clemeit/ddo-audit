import React from "react";
import { ReactComponent as LinkSVG } from "../assets/global/link.svg";
import Log from "../functions/LogThis";

const LinkHere = (props) => {
    var [displayText, set_displayText] = React.useState("Link here");

    function UpdateClipboard() {
        navigator.clipboard
            .writeText("https://www.playeraudit.com/" + props.link)
            .then(
                function () {
                    /* clipboard successfully set */
                    Log("Link Here", props.link);
                },
                function () {
                    /* clipboard write failed */
                    Log("Link Here FAILED", props.link);
                }
            );
    }

    return (
        <div
            className="card-link"
            onClick={(element) => {
                UpdateClipboard();
                set_displayText("Copied to clipboard!");
                setTimeout(() => {
                    set_displayText("Link here");
                }, 2000);
            }}
        >
            <LinkSVG style={{ paddingRight: "5px" }} className="link-icon" />{" "}
            {displayText}
        </div>
    );
};

export default LinkHere;
