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
import { Fetch } from "./DataLoader";
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
    const [levelFilter, set_levelFilter] = React.useState("");
    const [sortStyle, set_sortStyle] = React.useState("name");
    const [isRunning, set_isRunning] = React.useState(false);
    const [tableSize, set_tableSize] = React.useState(null);
    const [ellapsedTime, set_ellapsedTime] = React.useState(0);
    const [startTime, set_startTime] = React.useState(null);

    const PAGE_SIZE = 20;

    // Fetch the data on page load
    let updateTime;
    function runAudit() {
        let starttime = new Date();
        set_startTime(new Date());
        updateTime = setInterval(() => {
            set_ellapsedTime(new Date() - starttime);
        }, 1000);
        set_isRunning(true);

        let questlist = [];
        Fetch("https://www.playeraudit.com/api/activity?c=true", 5000)
            .then((val) => {
                set_tableSize(val.Count);
                Fetch(
                    "https://www.playeraudit.com/api/activity?type=heroic",
                    10000
                )
                    .then((val) => {
                        questlist = val;
                        Fetch(
                            "https://www.playeraudit.com/api/activity?type=epic",
                            10000
                        )
                            .then((val) => {
                                let epics = val;
                                epics.forEach((quest) => {
                                    quest.QuestName =
                                        quest.QuestName + " (Epic)";
                                    quest.IsEpic = true;
                                });
                                Array.prototype.push.apply(questlist, epics);
                                clearTimeout(updateTime);
                                set_ellapsedTime(new Date() - starttime);
                                set_isRunning(false);
                                set_questList(questlist);
                            })
                            .catch(() => {
                                clearTimeout(updateTime);
                                set_ellapsedTime(new Date() - starttime);
                                set_isRunning(false);
                                set_popupMessages([
                                    {
                                        title: "Failed to run audit",
                                        message:
                                            "The report timed out. You can refresh the page or report the issue.",
                                        icon: "warning",
                                        fullscreen: false,
                                        reportMessage:
                                            "Activity report timed out",
                                    },
                                ]);
                            });
                    })
                    .catch(() => {
                        clearTimeout(updateTime);
                        set_ellapsedTime(new Date() - starttime);
                        set_isRunning(false);
                        set_popupMessages([
                            {
                                title: "Failed to run audit",
                                message:
                                    "The report timed out. You can refresh the page or report the issue.",
                                icon: "warning",
                                fullscreen: false,
                                reportMessage: "Activity report timed out",
                            },
                        ]);
                    });
            })
            .catch(() => {
                clearTimeout(updateTime);
                set_ellapsedTime(new Date() - starttime);
                set_isRunning(false);
                set_popupMessages([
                    {
                        title: "Failed to connect to database",
                        message:
                            "We couldn't reach the database. You can refresh the page or report the issue.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage: "Could not fetch Activity data. Timeout",
                    },
                ]);
            });
    }

    React.useEffect(() => {
        if (questList === null) {
            set_filteredQuestList(null);
            return;
        }
        let levelFilters = levelFilter.split(",");
        set_filteredQuestList(
            questList
                .filter((entry) =>
                    entry.QuestName.toLowerCase().includes(
                        questNameFilter.toLowerCase()
                    )
                )
                .filter((entry) => {
                    if (levelFilter === "") return true;
                    let valid = false;
                    levelFilters.forEach((f) => {
                        if (!isNaN(f)) {
                            if (
                                entry.HeroicCr === parseInt(f) ||
                                entry.EpicCr === parseInt(f)
                            ) {
                                valid = true;
                            }
                        } else {
                            if (f.split("-").length !== 2) {
                                valid = false;
                                return;
                            }
                            let lower = f.split("-")[0];
                            let upper = f.split("-")[1];
                            if (
                                (entry.HeroicCr <= parseInt(upper) &&
                                    entry.HeroicCr >= parseInt(lower)) ||
                                (entry.EpicCr <= parseInt(upper) &&
                                    entry.EpicCr >= parseInt(lower))
                            ) {
                                valid = true;
                            }
                        }
                    });
                    return valid;
                })
                .sort(function (a, b) {
                    if (sortStyle === "duration") {
                        return b.AverageTime - a.AverageTime;
                    } else if (sortStyle === "name") {
                        return a.QuestName.localeCompare(b.QuestName);
                    } else if (sortStyle === "level") {
                        let alevel = a.HeroicCr || a.EpicCr;
                        let blevel = b.HeroicCr || b.EpicCr;
                        return alevel - blevel;
                    } else if (sortStyle === "adventure pack") {
                        let aadventurepack = a.AdventurePack || "";
                        let badventurepack = b.AdventurePack || "";
                        return aadventurepack.localeCompare(badventurepack);
                    } else if (sortStyle === "xp") {
                        let axp = 0;
                        if (a.IsEpic) {
                            axp = a.EpicEliteXp / a.AverageTime;
                        } else {
                            axp = a.HeroicEliteXp / a.AverageTime;
                        }
                        let bxp = 0;
                        if (b.IsEpic) {
                            bxp = b.EpicEliteXp / b.AverageTime;
                        } else {
                            bxp = b.HeroicEliteXp / b.AverageTime;
                        }
                        return a.IsEpic && !b.IsEpic
                            ? true
                            : !a.IsEpic && b.IsEpic
                            ? false
                            : bxp - axp;
                    } else {
                        return b.Count - a.Count;
                    }
                })
        );
        set_pageNumber(0);
    }, [questList, questNameFilter, levelFilter, sortStyle]);

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
        let low = quest.IsEpic ? 20 : 1;
        let high = quest.IsEpic ? 30 : 20;

        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://www.playeraudit.com/api/activity?quest=" +
                quest.Id +
                "&low=" +
                low +
                "&high=" +
                high,
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
            let ave = Math.round(total / values.length / 60);

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
            set_average(Math.round(ave * 10) / 10);
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

    let levelfiltertimeout;
    function HandleLevelFilter() {
        clearTimeout(levelfiltertimeout);
        levelfiltertimeout = setTimeout(() => {
            let levelfilter = document.getElementById("levelfilter").value;
            set_levelFilter(levelfilter);
        }, 500);
    }

    const [minLevel, set_minLevel] = React.useState(1);
    function HandleMinimumLevelFilter() {
        let minlevel = document.getElementById("minlevel").value;
        if (!isNaN(minlevel)) {
            set_minLevel(minlevel);
        }
    }

    const [maxLevel, set_maxLevel] = React.useState(30);
    function HandleMaximumLevelFilter() {
        let maxlevel = document.getElementById("maxlevel").value;
        if (!isNaN(maxlevel)) {
            set_maxLevel(maxlevel);
        }
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
            {!questList && (
                <Card
                    pageName="quests"
                    showLink={false}
                    title=""
                    subtitle=""
                    tiles={[
                        {
                            title: "",
                            description: "",
                            content: (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        paddingBottom: "20px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "xx-large",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Run a new quest activity audit
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "larger",
                                            marginTop: "0px",
                                        }}
                                    >
                                        The report may take up to 20 seconds to
                                        run
                                    </p>
                                    <button
                                        disabled={isRunning}
                                        onClick={() => runAudit()}
                                        style={{ fontSize: "larger" }}
                                    >
                                        {isRunning
                                            ? "Please wait"
                                            : "Run Audit"}
                                    </button>
                                    {isRunning &&
                                        (tableSize ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                    gap: "5px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: "10px 0px 0px 0px",
                                                    }}
                                                >
                                                    Summarizing{" "}
                                                    <span className="lfm-number">
                                                        {tableSize}
                                                    </span>{" "}
                                                    unique data points
                                                </p>
                                                <p style={{ margin: "0px" }}>
                                                    Ellapsed time:{" "}
                                                    <span className="lfm-number">
                                                        {Math.round(
                                                            ellapsedTime / 1000
                                                        )}
                                                    </span>{" "}
                                                    second
                                                    {Math.round(
                                                        ellapsedTime / 1000
                                                    ) === 1
                                                        ? ""
                                                        : "s"}
                                                </p>
                                            </div>
                                        ) : (
                                            <p style={{ marginTop: "10px" }}>
                                                Connecting...
                                            </p>
                                        ))}
                                </div>
                            ),
                        },
                    ]}
                />
            )}
            {questList && (
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
                                    Select a quest from the table below to show
                                    stats.
                                </p>
                            ),
                            content: (
                                <div>
                                    <div
                                        className="player-filter-input"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: "10px",
                                        }}
                                    >
                                        <label
                                            htmlFor="questname"
                                            style={{
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            Filter by quest name
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
                                            onChange={() =>
                                                HandleQuestNameFilter()
                                            }
                                        />
                                        <label
                                            htmlFor="levelfilter"
                                            style={{
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            or level (e.g. "1,3,5-9")
                                        </label>
                                        <input
                                            style={{
                                                maxWidth: "100px",
                                                width: "100%",
                                                height: "max-content",
                                                marginLeft: "7px",
                                            }}
                                            type="text"
                                            id="levelfilter"
                                            name="levelfilter"
                                            onChange={() => HandleLevelFilter()}
                                        />
                                    </div>
                                    <div className="audit-report-time">
                                        <p style={{ fontSize: "medium" }}>
                                            Audit performed{" "}
                                            {startTime.toString()} ran for{" "}
                                            {ellapsedTime / 1000}s
                                        </p>
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
                                        handleSort={(style) =>
                                            set_sortStyle(style)
                                        }
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
                                                    className={
                                                        pageNumber === i
                                                            ? "paginationPage active"
                                                            : "paginationPage"
                                                    }
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
                                        loadingMessage="Click on a quest to view data"
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
            )}
        </div>
    );
};

export default Quests;
