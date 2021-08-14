import React from "react";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import PopupMessage from "./global/PopupMessage";
import ServerSelectOption from "./ServerSelectOption";
import { Fetch, VerifyLfmData } from "./DataLoader";

const TITLE = "DDO Live LFM Viewer";

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

const noPlayersMessages = [
    "The apocalypse!",
    "Maybe they're all anonymous.",
    "Everyone got banned.",
];

const Who = (props) => {
    // Data
    var [playerData, set_playerData] = React.useState(null);
    var [playerCount, set_playerCount] = React.useState(null);

    React.useEffect(() => {
        function FetchPlayerData() {
            Fetch("https://www.playeraudit.com/api/playersoverview", 5000)
                .then((val) => {
                    if (val !== null && val.Timestamp !== undefined) {
                        set_playerData(val);
                    } else {
                        set_popupMessages([
                            ...popupMessages,
                            {
                                title: "Something went wrong",
                                message:
                                    "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                                icon: "warning",
                                fullscreen: false,
                                reportMessage:
                                    JSON.stringify(val) ||
                                    "Group data returned null",
                            },
                        ]);
                        set_playerData(null);
                    }
                })
                .catch(() => {
                    set_popupMessages([
                        ...popupMessages,
                        {
                            title: "We're stuck on a loading screen",
                            message:
                                "This is taking longer than usual. You can refresh the page or report the issue.",
                            icon: "warning",
                            fullscreen: false,
                            reportMessage:
                                "Could not fetch Day Population data. Timeout",
                        },
                    ]);
                });
        }
        FetchPlayerData();

        const refreshdata = setInterval(() => {
            FetchPlayerData();
        }, 60000);
        return () => clearInterval(refreshdata);
    }, []);

    React.useEffect(() => {
        if (playerData) {
            let total = 0;
            total += playerData.Argonnessen;
            total += playerData.Cannith;
            total += playerData.Ghallanda;
            total += playerData.Khyber;
            total += playerData.Orien;
            total += playerData.Sarlona;
            total += playerData.Thelanis;
            total += playerData.Wayfinder;
            total += playerData.Hardcore;
            set_playerCount(total);
        } else {
            set_playerCount(0);
        }
    }, [playerData]);

    // Report Form
    var [reportFormVisibility, setReportFormVisibility] =
        React.useState("none");
    var [reportFormReference, setReportFormReference] = React.useState(null);
    function showReportForm(reference) {
        // Grab relevant info from the tile element that's being reported
        let referenceInfo = {
            title: reference.title,
            type: reference.chartType,
            displayType: reference.displayType,
            trendType: reference.trendType,
            showActions: reference.showActions,
            //data: reference.chartData,
        };
        // Show the report form
        setReportFormReference(referenceInfo);
        setReportFormVisibility("block");
    }
    function hideReportForm() {
        setReportFormVisibility("none");
    }

    // Popup message
    var [popupMessages, set_popupMessages] = React.useState([]);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Browse players from any server with a live Who panel! Are your friends online? Is your guild forming up for a late-night raid? Now you know!"
                />
            </Helmet>
            <ReportIssueForm
                page="who"
                showLink={false}
                visibility={reportFormVisibility}
                componentReference={reportFormReference}
                hideReportForm={hideReportForm}
            />
            <PopupMessage
                page="who"
                messages={popupMessages}
                popMessage={() => {
                    if (popupMessages.length) {
                        let newMessages = [...popupMessages];
                        newMessages = newMessages.slice(1);
                        set_popupMessages(newMessages);
                    }
                }}
            />
            <Card
                pageName="who"
                showLink={false}
                title="Live Who Viewer"
                subtitle={
                    playerData ? (
                        <div>
                            <div className="grouping-subtitle">
                                There are currently{" "}
                                <span className="population-number">
                                    {playerCount}
                                </span>{" "}
                                players.{" "}
                                {playerCount
                                    ? "Are you one of them?"
                                    : noPlayersMessages[
                                          Math.floor(Math.random() * 3)
                                      ]}
                            </div>
                            <div
                                className="grouping-subtitle-mobile"
                                style={{ fontSize: "larger" }}
                            >
                                Select a server
                            </div>
                        </div>
                    ) : (
                        <div>Loading player data...</div>
                    )
                }
            >
                {playerData ? (
                    <div>
                        <div className="grouping-server-select-container">
                            <ServerSelectOption
                                destination="who"
                                server="Argonnessen"
                                number={playerData.Argonnessen}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Cannith"
                                number={playerData.Cannith}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Ghallanda"
                                number={playerData.Ghallanda}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Khyber"
                                number={playerData.Khyber}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Orien"
                                number={playerData.Orien}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Sarlona"
                                number={playerData.Sarlona}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Thelanis"
                                number={playerData.Thelanis}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Wayfinder"
                                number={playerData.Wayfinder}
                                word="player"
                            />
                            <ServerSelectOption
                                destination="who"
                                server="Hardcore"
                                number={playerData.Hardcore}
                                word="player"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grouping-server-select-container">
                        {serverNames.map((server, i) => (
                            <ServerSelectOption key={i} server={server} />
                        ))}
                    </div>
                )}
            </Card>
            <Card
                className="social-extra-info"
                pageName="grouping"
                showLink={false}
                title=""
                description=""
                tiles={[
                    {
                        title: "Live Who Viewer",
                        content: (
                            <div>
                                <p style={{ fontSize: "larger" }}>
                                    Every player on every server, all in one
                                    place. Live.
                                </p>
                                <h4>Accessible. Installable.</h4>
                                <p>Visited us on mobile yet? Try it out!</p>
                                <p>
                                    You can now install DDO Audit on your mobile
                                    device. Quickly browse online player, check
                                    if your friends are online, and experience a
                                    whole new way to view the Who panel!
                                </p>
                                <hr />
                                <h4>API</h4>
                                <p>
                                    Need the data for a project of your own?
                                    Visit the API page for more information!
                                </p>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Who;
