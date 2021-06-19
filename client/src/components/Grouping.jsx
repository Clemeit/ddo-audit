import React from "react";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import PopupMessage from "./PopupMessage";
import MiniGroup from "./MiniGroup";
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

const noGroupsMessages = [
    "Everyone is so shy today.",
    "A travesty!",
    "Well, you could always go solo...",
];

const Grouping = (props) => {
    // Data
    var [groupData, set_groupData] = React.useState(null);
    var [groupCount, set_groupCount] = React.useState(null);

    React.useEffect(() => {
        function FetchLfmData() {
            Fetch("https://www.playeraudit.com/api/groups", 5000)
                .then((val) => {
                    if (VerifyLfmData(val)) {
                        set_popupMessages([]);
                        set_groupData(val);
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
                                    val || "Group data returned null",
                            },
                        ]);
                        set_groupData(null);
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
                                "Could not fetch Group data. Timeout",
                        },
                    ]);
                });
        }
        FetchLfmData();

        const refreshdata = setInterval(() => {
            FetchLfmData();
        }, 60000);
        return () => clearInterval(refreshdata);
    }, []);

    React.useEffect(() => {
        if (groupData) {
            let total = 0;
            groupData.forEach((server) => {
                total += server.GroupCount;
            });
            set_groupCount(total);
        } else {
            set_groupCount(0);
        }
    }, [groupData]);

    function GetRaidGroups() {
        if (groupData === null) return [];
        let raidgroups = [];
        groupData.forEach((server) => {
            let ServerName = server.Name;
            server.Groups.forEach((group) => {
                if (group.Quest !== null && group.Quest.GroupSize === "Raid") {
                    raidgroups.push({ ...group, ServerName });
                }
            });
        });

        return raidgroups;
    }

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
                    content="Browse LFMs from any server with a live LFM panel! Check the LFM panel before you login, or setup notifications and never miss raid night again!"
                />
            </Helmet>
            <ReportIssueForm
                page="servers"
                showLink={false}
                visibility={reportFormVisibility}
                componentReference={reportFormReference}
                hideReportForm={hideReportForm}
            />
            <PopupMessage
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
                pageName="grouping"
                showLink={false}
                title="Live LFM Viewer"
                subtitle={
                    groupData ? (
                        <div>
                            <div className="grouping-subtitle">
                                There are currently{" "}
                                <span className="lfm-number">{groupCount}</span>{" "}
                                groups posted.{" "}
                                {groupCount
                                    ? "If you're not in one, you're missing out!"
                                    : noGroupsMessages[
                                          Math.floor(Math.random() * 4)
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
                        <div>Loading group data...</div>
                    )
                }
            >
                {groupData ? (
                    <div>
                        <div className="grouping-raid-group-container">
                            {GetRaidGroups().map((group, i) => (
                                <MiniGroup
                                    key={i}
                                    server={group.ServerName}
                                    questName={group.Quest.Name}
                                    leaderName={group.Leader.Name}
                                    memberCount={group.Members.length}
                                />
                            ))}
                        </div>
                        <div className="grouping-server-select-container">
                            {groupData.map((server, i) => (
                                <ServerSelectOption
                                    key={i}
                                    server={server.Name}
                                    number={server.GroupCount}
                                    word="group"
                                />
                            ))}
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
                className="grouping-extra-info"
                pageName="grouping"
                showLink={false}
                title=""
                description=""
                tiles={[
                    {
                        title: "Live LFM Viewer",
                        content: (
                            <div>
                                <p style={{ fontSize: "larger" }}>
                                    Every LFM on every server, all in one place.
                                </p>
                                <p>
                                    The Live LFM Viewer updates every 15
                                    seconds.
                                </p>
                                <hr />
                                <h4>API</h4>
                                <p>
                                    Need the data for a project of your own?
                                    Visit the API page for more information!
                                </p>
                                <h4>Contributions</h4>
                                <p>
                                    A special thanks to the incredible people
                                    over at Vault of Kundarak for their
                                    invaluable contributions to the Live LFM
                                    Viewer project. This tool would not have
                                    been possible without their knowledge and
                                    data.
                                </p>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Grouping;
