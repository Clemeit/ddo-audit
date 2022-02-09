import React from "react";
import { Fetch } from "../../services/DataLoader";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";

const BannerMessage = (props) => {
    const [messages, setMessages] = React.useState([]);
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
            Fetch("https://api.ddoaudit.com/messageservice", 5000).then(
                (response) => {
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
                }
            );
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
                        message.nodismiss == 1
                            ? ignoreThisMessage()
                            : ignoreThisMessage(message.id);
                    }}
                >
                    <p
                        className="banner-message"
                        style={{
                            cursor: message.nodismiss == 1 && "default",
                        }}
                    >
                        {message.message
                            .replace("{0}", message.start)
                            .replace("{1}", message.end)}
                    </p>
                    {message.nodismiss == 0 && <CloseSVG />}
                </div>
            ))}
        </div>
    );
};

export default BannerMessage;
