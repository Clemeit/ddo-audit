import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as MailSVG } from "../../assets/global/mail.svg";
import { Log } from "../../services/CommunicationService";
import { Post } from "../../services/DataLoader";

const Mail = () => {
    const [mail, setMail] = React.useState(null);
    const [dismissed, setDismissed] = React.useState(false);
    const [dismissEnabled, setDismissEnabled] = React.useState(false);
    const mailRef = React.useRef(mail);
    mailRef.current = mail;

    function newMail(title, subtitle, ticket, body, datetime) {
        setMail({
            title,
            subtitle,
            ticket,
            body,
            datetime,
        });
    }

    function dismissMail() {
        let myTickets = JSON.parse(localStorage.getItem("my-tickets") || "[]");
        let originalLength = myTickets.length;
        myTickets = myTickets.filter(
            (ticket) => ticket != mailRef.current.ticket
        );
        let finalLength = myTickets.length;
        if (finalLength === originalLength) {
            localStorage.setItem("my-tickets", JSON.stringify([]));
            Log("Dismissed mail HARD", mailRef.current.ticket);
        } else {
            localStorage.setItem("my-tickets", JSON.stringify(myTickets));
            Log("Dismissed mail", mailRef.current.ticket);
        }

        setDismissed(true);
    }

    React.useEffect(() => {
        const checkForMail = setTimeout(() => {
            let myTickets = JSON.parse(
                localStorage.getItem("my-tickets") || "[]"
            );
            if (myTickets && myTickets.length) {
                let ignoredList = JSON.parse(
                    localStorage.getItem("dismissed-mail") || "[]"
                );

                Post(
                    "https://api.ddoaudit.com/retrieveresponse",
                    { tickets: myTickets },
                    10000
                ).then((response) => {
                    if (response.length) {
                        if (!ignoredList.includes(response[0].datetime)) {
                            newMail(
                                "Feedback Response",
                                `re: ${response[0].comment}`,
                                response[0].ticket,
                                response[0].response,
                                response[0].datetime
                            );
                            setTimeout(() => {
                                setDismissEnabled(true);
                            }, 1500);
                        }
                    }
                });
            }
        }, 1500);

        return () => clearTimeout(checkForMail);
    }, []);

    return (
        <div
            className="mail-container"
            style={{
                transform:
                    mail && !dismissed ? "translateX(0%)" : "translateX(120%)",
            }}
        >
            <CloseSVG
                className="link-icon should-invert"
                style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    cursor: "pointer",
                }}
                onClick={() => dismissMail()}
            />
            <div
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <h3 className="mail-title">
                    <MailSVG
                        className="nav-icon should-invert"
                        style={{ marginRight: "10px" }}
                    />
                    {mail?.title}
                </h3>
                <h4 className="mail-subtitle" style={{ marginBottom: "0px" }}>
                    {mail?.subtitle}
                </h4>
                <h4 className="mail-subtitle">Ticket #{mail?.ticket}</h4>
                <hr
                    style={{
                        backgroundColor: "var(--text)",
                        opacity: 0.2,
                        margin: "0px 0px 10px 0px",
                    }}
                />
                <p className="mail-body">{mail?.body}</p>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "auto",
                    }}
                >
                    <button
                        className={
                            "secondary-button should-invert full-width-mobile" +
                            (!dismissEnabled ? " disabled" : "")
                        }
                        onClick={() => {
                            if (dismissEnabled) {
                                dismissMail();
                            }
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mail;
