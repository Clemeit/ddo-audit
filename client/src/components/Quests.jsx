import * as React from "react";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import ChartServerDistributionPie from "./ChartServerDistributionPie";
import ChartTimeOfDay from "./ChartTimeOfDay";
import ChartDayOfWeek from "./ChartDayOfWeek";
import ChartClassDistribution from "./ChartClassDistribution";
import ChartLevelDistribution from "./ChartLevelDistribution";
import ServerStatusDisplay from "./ServerStatusDisplay";
import QuestTable from "./QuestTable";
import PopupMessage from "./PopupMessage";
import ChartQuestActivity from "./ChartQuestActivity";
import { range } from "mathjs";
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from "constants";
const math = require("mathjs");

const TITLE = "DDO Quest Activity";

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

const Quests = (props) => {
    const [questList, set_questList] = React.useState(null);
    const [filteredQuestList, set_filteredQuestList] = React.useState(null);
    const [paginatedQuestList, set_paginatedQuestList] = React.useState(null);
    const [pageNumber, set_pageNumber] = React.useState(-1);
    // const [questData, set_questData] = React.useState(null);
    const [durationData, set_durationData] = React.useState(null);
    const [totalTime, set_totalTime] = React.useState(null);
    const [totalDataPoints, set_totalDataPoints] = React.useState(null);
    const [serverDistData, set_serverDistData] = React.useState(null);
    const [standardDeviation, set_standardDeviation] = React.useState(null);
    const [datetimeData, set_datetimeData] = React.useState(null);
    const [todData, set_todData] = React.useState(null);
    const [average, set_average] = React.useState(null);
    const [outlierCount, set_outlierCount] = React.useState(null);
    const [questName, set_questName] = React.useState(null);
    const [questNameFilter, set_questNameFilter] = React.useState("");
    const [sortStyle, set_sortStyle] = React.useState("name");

    const PAGE_SIZE = 20;

    // Fetch the data on page load
    React.useEffect(() => {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://www.playeraudit.com/api/activity",
            "json"
        ).then((val) => {
            set_questList(val);
        });
    }, []);

    React.useEffect(() => {
        if (questList === null) {
            set_filteredQuestList(null);
            return;
        }
        set_filteredQuestList(
            questList
                .filter((entry) =>
                    entry.QuestName.toLowerCase().includes(
                        questNameFilter.toLowerCase()
                    )
                )
                .sort(function (a, b) {
                    if (sortStyle === "duration") {
                        return b.AverageTime - a.AverageTime;
                    } else if (sortStyle === "name") {
                        return a.QuestName.localeCompare(b.QuestName);
                    } else {
                        return b.Count - a.Count;
                    }
                })
        );
        set_pageNumber(0);
    }, [questList, questNameFilter, sortStyle]);

    React.useEffect(() => {
        if (filteredQuestList === null) return;
        set_paginatedQuestList(
            filteredQuestList.slice(
                Math.max(0, pageNumber * PAGE_SIZE),
                Math.min(
                    pageNumber * PAGE_SIZE + PAGE_SIZE,
                    filteredQuestList.length
                )
            )
        );
    }, [pageNumber, filteredQuestList]);

    function loadQuest(quest) {
        if (questName === quest.QuestName) return;

        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://www.playeraudit.com/api/activity?quest=" + quest.Id,
            "json"
        ).then((val) => {
            const HOUR_BIN_WIDTH = 1;
            const MAX_DURATION_LIMIT = 3 * 60 * 60;
            let max = 0;
            let bincount = 30;
            let values = [];
            let total = 0;
            let outlierCount = 0;
            let servercounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            val.forEach((entry) => {
                if (entry.Duration > MAX_DURATION_LIMIT) {
                    outlierCount++;
                } else {
                    if (entry.Duration > max) max = entry.Duration;
                    values.push(entry.Duration);
                    total += entry.Duration;
                    servercounts[serverNames.indexOf(entry.Server)]++;
                }
            });

            let std = Math.round(math.std(values) / 60);
            let ave = Math.round(quest.AverageTime / 60);

            bincount = max / 60;
            let bins = [];
            let freq = [];
            let binstep = Math.round(max / bincount);
            for (let i = 0; i < Math.min(bincount, ave + std * 2); i++) {
                bins.push(i * binstep);
                freq.push(0);
            }
            val.forEach((entry) => {
                bins.forEach((bin, index) => {
                    if (
                        entry.Duration >= bin &&
                        entry.Duration < bin + binstep
                    ) {
                        freq[index]++;
                    }
                });
            });

            let durationdata = [];
            for (
                let i = 0;
                i < Math.min(bincount, ave + Math.min(20, std) * 2);
                i++
            ) {
                durationdata.push({
                    Duration: Math.round((bins[i] + binstep / 2) / 60),
                    Frequency: freq[i],
                });
            }
            set_durationData(
                durationdata.slice(Math.max(0, ave - Math.min(20, std) * 2))
            );
            set_questName(quest.QuestName);
            set_standardDeviation(std > 20 ? ">20" : std);
            set_average(Math.round((quest.AverageTime / 60) * 10) / 10);
            set_outlierCount(outlierCount);
            set_totalTime(Math.round(total / 60));
            set_totalDataPoints(val.length);

            let serverdistrdata = [];
            for (let i = 0; i < serverNames.length; i++) {
                serverdistrdata.push({
                    id: serverNames[i],
                    label: serverNames[i],
                    value: servercounts[i],
                });
            }
            set_serverDistData(serverdistrdata);

            let days = [[], [], [], [], [], [], []];
            let instances = [[], [], [], [], [], [], []];
            let tod = [];
            let tod_instances = [];
            for (let i = 0; i < days.length; i++) {
                for (let hour = 0; hour < 24; hour += HOUR_BIN_WIDTH) {
                    days[i].push(hour);
                    instances[i].push(0);
                    if (i === 0) {
                        tod.push(hour);
                        tod_instances.push(0);
                    }
                }
            }
            val.forEach((entry) => {
                let dow = new Date(entry.Start).getDay();
                let hour = new Date(entry.Start).getHours();
                instances[dow][Math.floor(hour / HOUR_BIN_WIDTH)]++;
                tod_instances[Math.floor(hour / HOUR_BIN_WIDTH)]++;
            });
            let datetimedata = [];
            for (let d = 0; d < 7; d++) {
                for (let h = 0; h < 24; h += HOUR_BIN_WIDTH) {
                    datetimedata.push({
                        Time: d * 24 + h,
                        Instances: instances[d][Math.floor(h / HOUR_BIN_WIDTH)],
                    });
                }
            }

            let tod_data = [];
            for (let h = 0; h < 24; h += HOUR_BIN_WIDTH) {
                tod_data.push({
                    Time: h,
                    Instances: tod_instances[Math.floor(h / HOUR_BIN_WIDTH)],
                });
            }

            set_todData(tod_data);
            set_datetimeData(datetimedata);
        });
    }

    // Download quest data
    function download(data) {
        let output = JSON.stringify(data, null, 4);

        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState({ fileDownloadUrl: fileDownloadUrl }, () => {
            this.dofileDownload.click();
            URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
            this.setState({ fileDownloadUrl: "" });
        });
    }

    let questnamefiltertimeout;
    function HandleQuestNameFilter() {
        clearTimeout(questnamefiltertimeout);
        questnamefiltertimeout = setTimeout(() => {
            let questname = document.getElementById("questname").value;
            set_questNameFilter(questname);
        }, 500);
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
                    content="Check quest activity, duration, and popularity."
                />
            </Helmet>
            <ReportIssueForm
                page="quests"
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
                pageName="quests"
                showLink={true}
                title="Quest Activity"
                subtitle=""
                tiles={[
                    {
                        title: "Quest Selection",
                        description: (
                            <p>
                                Select a quest or slayer area from the table
                                below to show stats.
                            </p>
                        ),
                        content: (
                            <div>
                                <div
                                    className="player-filter-input"
                                    style={{ flexDirection: "row" }}
                                >
                                    <label
                                        htmlFor="questname"
                                        style={{
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        Filter by quest name:
                                    </label>
                                    <input
                                        style={{
                                            maxWidth: "250px",
                                            width: "100%",
                                            height: "max-content",
                                            marginLeft: "7px",
                                        }}
                                        type="text"
                                        id="questname"
                                        name="questname"
                                        onChange={() => HandleQuestNameFilter()}
                                    />
                                </div>
                                <QuestTable
                                    data={paginatedQuestList}
                                    showLastUpdated={false}
                                    reportReference={showReportForm}
                                    handleSelection={(quest) =>
                                        loadQuest(quest)
                                    }
                                    collapsed={false}
                                    pageNumber={pageNumber}
                                    pageSize={PAGE_SIZE}
                                    handleSort={(style) => set_sortStyle(style)}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "5px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {filteredQuestList &&
                                        [
                                            ...Array(
                                                Math.ceil(
                                                    filteredQuestList.length /
                                                        PAGE_SIZE
                                                )
                                            ),
                                        ].map((o, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: "7px",
                                                    width: "40px",
                                                    cursor: "pointer",
                                                    color:
                                                        i === pageNumber
                                                            ? "var(--text)"
                                                            : "var(--text-xfaded)",
                                                    border:
                                                        i === pageNumber
                                                            ? "1px solid var(--text)"
                                                            : "1px solid var(--text-xfaded)",
                                                    borderRadius: "6px",
                                                }}
                                                onClick={() => {
                                                    set_pageNumber(i);
                                                }}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                </div>
                                <hr />
                                <h4>{questName || "No quest selected"}</h4>
                                <p
                                    style={{
                                        fontSize: "large",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Average duration:{" "}
                                    <span className="lfm-number">
                                        {average !== null
                                            ? `${average} minutes`
                                            : "N/A"}
                                    </span>{" "}
                                    | Standard deviation:{" "}
                                    <span className="lfm-number">
                                        {standardDeviation !== null
                                            ? `${standardDeviation} minutes`
                                            : "N/A"}
                                    </span>{" "}
                                    | Outliers excluded:{" "}
                                    <span className="lfm-number">
                                        {outlierCount !== null
                                            ? `${outlierCount}`
                                            : "N/A"}
                                    </span>
                                </p>
                                <p
                                    style={{
                                        fontSize: "large",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Total time recorded:{" "}
                                    <span className="lfm-number">
                                        {totalTime !== null
                                            ? `${totalTime} minutes`
                                            : "N/A"}
                                    </span>{" "}
                                    | Total data points:{" "}
                                    <span className="lfm-number">
                                        {totalDataPoints !== null
                                            ? `${totalDataPoints}`
                                            : "N/A"}
                                    </span>
                                </p>
                                <span
                                    className="blue-link"
                                    style={{ paddingLeft: "0px" }}
                                >
                                    Download quest data
                                </span>
                                <ChartQuestActivity
                                    keys={["Frequency"]}
                                    indexBy={"Duration"}
                                    legendBottom={"Duration (miuntes)"}
                                    legendLeft={"Frequency"}
                                    data={durationData}
                                />
                                <hr />
                                <h4>{questName || "No quest selected"}</h4>
                                <p
                                    style={{
                                        fontSize: "large",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Popularity per server.
                                </p>
                                <span
                                    className="blue-link"
                                    style={{ paddingLeft: "0px" }}
                                >
                                    Download quest data
                                </span>
                                <ChartServerDistributionPie
                                    data={serverDistData}
                                />
                                <hr />
                                <h4>{questName || "No quest selected"}</h4>
                                <p
                                    style={{
                                        fontSize: "large",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Popularity throughout the week.
                                </p>
                                <span
                                    className="blue-link"
                                    style={{ paddingLeft: "0px" }}
                                >
                                    Download quest data
                                </span>
                                <ChartQuestActivity
                                    keys={["Instances"]}
                                    indexBy={"Time"}
                                    legendBottom={
                                        "Time of Week (Hours, offset from Sunday 00:00)"
                                    }
                                    legendLeft={"Instances"}
                                    data={datetimeData}
                                />
                                <hr />
                                <h4>{questName || "No quest selected"}</h4>
                                <p
                                    style={{
                                        fontSize: "large",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Popularity throughout the day.
                                </p>
                                <span
                                    className="blue-link"
                                    style={{ paddingLeft: "0px" }}
                                >
                                    Download quest data
                                </span>
                                <ChartQuestActivity
                                    keys={["Instances"]}
                                    indexBy={"Time"}
                                    legendBottom={
                                        "Time of Day (24-hour format)"
                                    }
                                    legendLeft={"Instances"}
                                    data={todData}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Quests;
