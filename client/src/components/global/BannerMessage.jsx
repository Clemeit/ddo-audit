import React from "react";
import { Fetch } from "../../services/DataLoader";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import $ from "jquery";

const BannerMessage = (props) => {
    const [messages, setMessages] = React.useState([]);
    const [update, setUpdate] = React.useState(null);

    let recheck;
    let shiftBanner;
    React.useEffect(() => {
        recheck = setInterval(() => {
            setUpdate(new Date());
        }, 3600000);
        shiftBanner = setInterval(() => {
            if (window.innerWidth < 900) {
                $(".banner-message-container").css(
                    "transform",
                    `translateY(0%)`
                );
                $(".banner-message-container").css(
                    "filter",
                    `drop-shadow(0px 0px 7px black)`
                );
            }
        }, 1000);

        return function cleanup() {
            clearInterval(recheck);
            clearInterval(shiftBanner);
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
            Fetch("https://api.ddoaudit.com/messageservice", 10000)
                .then((response) => {
                    let allmessages = [];
                    response.forEach((message) => {
                        let affectedpages = message.pages.split(",");
                        if (
                            (affectedpages.includes(props.page) ||
                                affectedpages.includes("all")) &&
                            !ignorelist.includes(message.id.toString())
                        ) {
                            let now = new Date();
                            if (
                                now >= new Date(message.start) &&
                                now <= new Date(message.end)
                            ) {
                                allmessages.push(message);
                            }
                        }
                    });

                    setMessages(allmessages);
                })
                .catch((err) => {
                    if (window.navigator.onLine == false) {
                        setMessages([
                            {
                                id: 999,
                                name: "Offline",
                                pages: "all",
                                start: new Date(),
                                end: new Date(),
                                message: "No internet connection.",
                                color: "#AA0000",
                                nodismiss: 1,
                            },
                        ]);
                    }
                });
        }
        getM();
    }, [update]);

    function ignoreThisMessage(id) {
        if (id == null) return;
        let before = localStorage.getItem("ignored-messages");
        localStorage.setItem(
            "ignored-messages",
            before ? before + "," + id : id
        );
        setUpdate(new Date());
    }

    function mayDismiss(message) {
        // If on mobile, always allow dismissal
        if (window.innerWidth <= 900) {
            return true;
        }

        if (message.nodismiss === 0) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {messages.map((message, i) => (
                <div
                    key={i}
                    className={
                        "banner-message-container" +
                        (props.className ? ` ${props.className}` : "")
                    }
                    style={{
                        backgroundColor: message.color,
                    }}
                    onClick={() => {
                        mayDismiss(message)
                            ? ignoreThisMessage(message.id)
                            : ignoreThisMessage();
                    }}
                >
                    <p
                        className="banner-message"
                        style={{
                            cursor: !mayDismiss(message) && "default",
                        }}
                    >
                        {message.message
                            .replace("{0}", message.start)
                            .replace("{1}", message.end)}
                    </p>
                    {mayDismiss(message) && <CloseSVG />}
                </div>
            ))}
        </div>
    );
};

export default BannerMessage;
