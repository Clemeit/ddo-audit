import React from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import { Submit } from "../../services/CommunicationService";
import Poll from "./Poll";
import ContentCluster from "./ContentCluster";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { Link } from "react-router-dom";

const Suggestions = (props) => {
  const TITLE = "DDO Audit | Make a Suggestion";

  const [message, setMessage] = React.useState("");
  const [contact, setContact] = React.useState("");

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [ticketNumber, setTicketNumber] = React.useState(null);
  const [acknowledge, setAcknowledge] = React.useState(true);
  const [disabled, setDisabled] = React.useState(true);

  let t;
  React.useEffect(() => {
    t = setTimeout(() => {
      setDisabled(false);
    }, 3000);

    let ack = localStorage.getItem("suggestions-acknowledgement");
    if (ack) {
      setAcknowledge(true);
    } else {
      setAcknowledge(false);
    }

    return () => clearTimeout(t);
  }, []);

  function SubmitMessage() {
    if (isSubmitted) return;
    if (message) {
      Submit(
        "Suggestion (ENH2)",
        message + (contact && ` (Contact: '${contact}')`)
      )
        .then((response) => {
          if (response && response.ticket) {
            let myTickets = JSON.parse(
              localStorage.getItem("my-tickets") || "[]"
            );
            myTickets.push(response.ticket);
            localStorage.setItem("my-tickets", JSON.stringify(myTickets));
            console.log("New ticket:", response.ticket);
            setTicketNumber(response.ticket);
            setIsSubmitted(true);
          } else {
            console.log(response);
            alert("Failed to submit feedback. Please try again later.");
          }
        })
        .catch(() => {
          alert("Failed to submit feedback. Please try again later.");
        });
    } else {
      alert("Did you forget to add a message?");
    }
  }

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Have a suggestion for DDO Audit? Submit it here!"
        />
        <meta
          property="og:image"
          content="/icons/logo-512px.png"
          data-react-helmet="true"
        />
        <meta
          property="twitter:image"
          content="/icons/logo-512px.png"
          data-react-helmet="true"
        />
      </Helmet>
      <Banner
        small={false}
        showTitle={true}
        showSubtitle={true}
        showButtons={true}
        hideSuggestions={true}
        hideOnMobile={true}
        hideVote={true}
        title="DDO Audit"
        subtitle="Real-time Player Concurrency Data and LFM Viewer"
      />
      <div className="content-container">
        <div className="top-content-padding shrink-on-mobile" />
        {!acknowledge && (
          <ContentCluster
            title={
              <span>
                This website is free to use.{" "}
                <span className="lfm-number">It is not free to maintain.</span>
              </span>
            }
            altTitle="This website is free to use. It's not free to maintain."
            noFade={true}
          >
            <p
              style={{
                fontSize: "1.5rem",
              }}
            >
              I'm providing this website because I want to give back to the
              community which has given so much to me. Hosting fees come out of
              my own pocket and development time is unpaid.
            </p>
            <p
              style={{
                fontSize: "1.5rem",
              }}
            >
              If you have a suggestion, request, or comment, I'd love to hear
              it! But please be civil.
            </p>
            <div
              className={`primary-button should-invert full-width-mobile ${
                disabled ? "disabled" : ""
              }`}
              onClick={() => {
                if (disabled) {
                } else {
                  setAcknowledge(true);
                  localStorage.setItem("suggestions-acknowledgement", true);
                }
              }}
            >
              Acknowledge
            </div>
          </ContentCluster>
        )}
        {acknowledge && (
          <>
            <ContentCluster
              title="Suggestions and Feedback"
              description={
                isSubmitted ? (
                  <span
                    style={{
                      color: "var(--text)",
                    }}
                  >
                    I got your message, thanks! I may respond to you directly
                    through DDO Audit's mail system. Responses will appear in a
                    popup on the website.
                    <br />
                    <br />
                    <span
                      style={{
                        color: "var(--text-faded)",
                      }}
                    >
                      Ticket #{ticketNumber || " (not applicable)"}
                    </span>
                  </span>
                ) : (
                  "Community feedback has made this project possible."
                )
              }
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div
                  style={{
                    display: isSubmitted ? "none" : "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor="message"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--text)",
                      marginRight: "10px",
                      marginBottom: "0px",
                    }}
                  >
                    Your message:
                  </label>
                  <textarea
                    disabled={isSubmitted}
                    id="message"
                    rows={4}
                    placeholder="What's on your mind?"
                    style={{
                      fontSize: "1.2rem",
                      width: "100%",
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <label
                    htmlFor="contact"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--text)",
                      marginRight: "10px",
                      marginBottom: "0px",
                    }}
                  >
                    Contact info (optional):
                  </label>
                  <input
                    disabled={isSubmitted}
                    id="contact"
                    placeholder="(e.g. Reddit username, forum name, email, etc.)"
                    style={{
                      fontSize: "1.2rem",
                      width: "100%",
                    }}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                {isSubmitted === false && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      className={
                        "primary-button full-width-mobile should-invert" +
                        (isSubmitted ? " disabled" : "")
                      }
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        minWidth: "150px",
                      }}
                      onClick={() => SubmitMessage()}
                    >
                      Submit
                    </div>
                  </div>
                )}
              </form>
            </ContentCluster>
            {!isSubmitted && (
              <ContentCluster
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      lineHeight: "30px",
                    }}
                  >
                    <WarningSVG
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    Please Note
                  </div>
                }
                altTitle="Please Note"
                noLink={true}
                description={
                  <span>
                    <p>
                      As a result of work and real life,{" "}
                      <span className="lfm-number">
                        I've had to significantly reduce the amount of
                        development time I spend on the website.
                      </span>{" "}
                      I still take note of all the feature requests that are
                      being submitted, and I'll do my best to get around to each
                      of them eventually! I'm currently prioritizing bug
                      reports. Thank you for your understanding.
                    </p>
                    <p>Clemeit of Thelanis</p>
                  </span>
                }
                noFade={true}
              />
            )}
            {isSubmitted && <Poll />}
            {!isSubmitted && (
              <ContentCluster
                title="Disclaimer"
                description={
                  <p
                    style={{
                      fontSize: "1.5rem",
                      lineHeight: "normal",
                      color: "var(--text)",
                      marginTop: "30px",
                    }}
                  >
                    This website is in no way affiliated with, or endorsed by,
                    Standing Stone Games or{" "}
                    <a
                      href="https://www.daybreakgames.com/home"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Daybreak Game Company
                    </a>
                    .{" "}
                    <span className="lfm-number">
                      Please do not submit personal information, login details,
                      or bug reports related to the game.
                    </span>
                  </p>
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
