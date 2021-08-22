import React from "react";
import { Fetch } from "../../services/DataLoader";
import { GetMessage } from "../../services/MessageService";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";

const BannerMessage = (props) => {
    const [message, setMessage] = React.useState(null);
    const [update, setUpdate] = React.useState(null);

    let recheck;
    React.useEffect(() => {
        recheck = setInterval(() => {
            setUpdate(new Date());
        }, 3600000);

        return function cleanup() {
            clearInterval(recheck);
        };
    }, []);

    React.useEffect(() => {
        async function getM() {
            let ignorelist = localStorage.getItem("ignored-messages");
            if (ignorelist) {
                ignorelist = ignorelist.split(",");
            } else {
                ignorelist = [];
            }
            Fetch("https://www.playeraudit.com/api/messageservice", 5000).then(
                (response) => {
                    let wasMessage = false;
                    response.forEach((message) => {
                        let affectedpages = message.Pages.split(",");
                        if (
                            (affectedpages.includes(props.page) ||
                                affectedpages.includes("all")) &&
                            !ignorelist.includes(message.Id.toString())
                        ) {
                            let now = new Date();
                            if (
                                now >= new Date(message.Start) &&
                                now <= new Date(message.End)
                            ) {
                                wasMessage = true;
                                setMessage({
                                    id: message.Id,
                                    name: message.Name,
                                    start: message.Start,
                                    end: message.End,
                                    message: message.Message,
                                    color: message.Color,
                                });
                            }
                        }
                    });
                    if (!wasMessage) {
                        setMessage(null);
                    }
                }
            );
        }
        getM();
    }, [update]);

    function isBannerVisible() {
        if (message === null || message === undefined) return "none";
        return "flex";
    }

    function getBannerText() {
        if (message !== null && message !== undefined) {
            return `${message.message} from ${message.start} through ${message.end}`;
        }
        return "";
    }

    function getBannerColor() {
        if (message !== null && message !== undefined) {
            return message.color;
        }
        return "";
    }

    function ignoreThisMessage() {
        let before = localStorage.getItem("ignored-messages");
        localStorage.setItem(
            "ignored-messages",
            before ? before + "," + message.id : message.id
        );
        setUpdate(new Date());
    }

    return (
        <div
            className={"banner-message " + (props.className && props.className)}
            style={{
                display: isBannerVisible(),
                backgroundColor: getBannerColor(),
            }}
            onClick={() => ignoreThisMessage()}
        >
            <p
                style={{
                    width: "100%",
                    textAlign: "center",
                    whiteSpace: "break-spaces",
                    margin: "3px 10px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "white",
                    padding: "0px 15px",
                }}
            >
                {getBannerText()}
            </p>
            <CloseSVG style={{ position: "absolute", right: "10px" }} />
        </div>
    );
};

export default BannerMessage;
