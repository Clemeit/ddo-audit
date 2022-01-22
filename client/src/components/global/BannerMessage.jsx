import React from "react";
import { Fetch } from "../../services/DataLoader";
import { GetMessage } from "../../services/MessageService";
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
            Fetch("https://www.playeraudit.com/api/messageservice", 5000).then(
                (response) => {
                    let allmessages = [];
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
                    className={"banner-message-container"}
                    style={{
                        backgroundColor: message.Color,
                    }}
                    onClick={() => {
                        message.NoDismiss == 1
                            ? ignoreThisMessage()
                            : ignoreThisMessage(message.Id);
                    }}
                >
                    <p
                        className="banner-message"
                        style={{
                            cursor: message.NoDismiss == 1 && "default",
                        }}
                    >
                        {message.Message.replace("{0}", message.Start).replace(
                            "{1}",
                            message.End
                        )}
                    </p>
                    {message.NoDismiss == 0 && <CloseSVG />}
                </div>
            ))}
        </div>
    );
};

export default BannerMessage;
