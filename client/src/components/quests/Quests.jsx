import * as React from "react";
import { Helmet } from "react-helmet";
// import Card from "../old_Card";
// import ReportIssueForm from "../ReportIssueForm";
import ChartPie from "../global/ChartPie";
import Banner from "../global/Banner";
// import ChartTimeOfDay from "../ChartTimeOfDay";
// import ChartDayOfWeek from "../ChartDayOfWeek";
// import ChartClassDistribution from "../ChartClassDistribution";
// import ChartLevelDistribution from "../ChartLevelDistribution";
// import ServerStatusDisplay from "./ServerStatusDisplay";
import ChartLine from "../global/ChartLine";
import QuestTable from "./QuestTable";
import PopupMessage from "../global/PopupMessage";
import ChartBar from "../global/ChartBar";
import { Fetch } from "../../services/DataLoader";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import NoMobileOptimization from "../global/NoMobileOptimization";
import BannerMessage from "../global/BannerMessage";
import LoadingOverlay from "./LoadingOverlay";
import ContentCluster from "../global/ContentCluster";
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
    const [isLoading, setIsLoading] = React.useState(false);
    const [questList, set_questList] = React.useState(null);
    const [filteredQuestList, set_filteredQuestList] = React.useState(null);
    const [paginatedQuestList, set_paginatedQuestList] = React.useState(null);
    const [pageNumber, set_pageNumber] = React.useState(-1);
    // const [questData, set_questData] = React.useState(null);
    const [durationData, set_durationData] = React.useState(null);
    const [popularityOverTimeData, set_popularityOverTimeData] =
        React.useState(null);
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
        if (isRunning) return;
        let starttime = new Date();
        set_startTime(new Date());
        updateTime = setInterval(() => {
            set_ellapsedTime(new Date() - starttime);
        }, 1000);
        set_isRunning(true);

        let questlist = [];

        Fetch("https://www.playeraudit.com/api/activity?type=heroic", 30000)
            .then((val) => {
                questlist = val;
                Fetch(
                    "https://www.playeraudit.com/api/activity?type=epic",
                    30000
                )
                    .then((val) => {
                        let epics = val;
                        epics.forEach((quest) => {
                            quest.QuestName = quest.QuestName + " (Epic)";
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
                        title: "Failed to run audit",
                        message:
                            "The report timed out. You can refresh the page or report the issue.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage: "Activity report timed out",
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

    function dateToDateString(dt) {
        return `${dt.getFullYear().toString()}-${(dt.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
    }

    function dateToTimeString(dt) {
        return `${dt.getFullYear().toString()}-${(dt.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt
            .getHours()
            .toString()
            .padStart(2, "0")}:${dt
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
    }

    function loadQuest(quest) {
        setIsLoading(true);

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
            console.log(val);

            const HOUR_BIN_WIDTH = 2;
            const MAX_DURATION_LIMIT = 3 * 60 * 60;
            let max = 0;
            let bincount = 30;
            let values = [];
            let total = 0;
            let outlierCount = 0;
            let servercounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            val.forEach((entry) => {
                entry.Start = new Date(
                    new Date(entry.Start).getTime() - 5 * 60 * 60 * 1000
                );
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
                let dow = entry.Start.getDay();
                let hour = entry.Start.getHours();
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

            // popularity over time
            let sorted = val.sort((a, b) => a.Start > b.Start);
            let dailypopularity = [];
            let dailyaverageduration = [];
            let thiscount = 0;
            let thistotalduration;
            let thisday = "";

            let scalefactor = 1;
            let maxdaily;
            let mindaily;

            for (let ent = 0; ent < val.length; ent++) {
                let entry = val[ent];
                let entryday = entry.Start.getDate();
                if (entryday !== thisday) {
                    if (thisday !== "") {
                        let datestring = dateToDateString(entry.Start);
                        if (datestring !== "2022-01-07") {
                            dailypopularity.push({
                                x: dateToDateString(entry.Start),
                                y: thiscount,
                            });
                            dailyaverageduration.push({
                                x: dateToDateString(entry.Start),
                                y: Math.round(
                                    thistotalduration / thiscount / 60
                                ),
                            });
                        }
                    }
                    thistotalduration = 0;
                    thiscount = 0;
                    thisday = entryday;
                }
                thistotalduration += entry.Duration;
                thiscount++;
            }

            console.log(dailypopularity);

            let linedata = [
                {
                    id: "Popularity",
                    color: "hsl(180, 70%, 50%)",
                    data: dailypopularity,
                },
            ];
            set_popularityOverTimeData(linedata);

            setIsLoading(false);
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
                    content="Check quest activity, duration, and popularity. See how long each quest takes to run, quest popularity over time, and XP per minute estimations!"
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
            {isLoading && <LoadingOverlay />}
            {/* <ReportIssueForm
                page="quests"
                showLink={false}
                visibility={reportFormVisibility}
                componentReference={reportFormReference}
                hideReportForm={hideReportForm}
            /> */}
            {/* <PopupMessage
                messages={popupMessages}
                popMessage={() => {
                    if (popupMessages.length) {
                        let newMessages = [...popupMessages];
                        newMessages = newMessages.slice(1);
                        set_popupMessages(newMessages);
                    }
                }}
            /> */}
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Quests"
                subtitle="Quest popularity, average completion times, and XP/min"
            />
            <div className="content-container">
                <BannerMessage page="quests" />
                <div className="top-content-padding shrink-on-mobile" />
                <NoMobileOptimization />
                {!questList && (
                    <ContentCluster
                        title="Quest Activity Audit"
                        description="Run a new Quest Activity Audit by pressing the
                    button below."
                    >
                        <div
                            className={
                                "primary-button should-invert full-width-mobile" +
                                (isRunning && " disabled")
                            }
                            onClick={() => runAudit()}
                            disabled={isRunning}
                        >
                            {isRunning ? "Please wait..." : "Run Audit"}
                        </div>
                        {isRunning && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "5px",
                                }}
                            >
                                {tableSize ? (
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
                                                fontSize: "1.5rem",
                                                lineHeight: "normal",
                                                color: "var(--text-faded)",
                                            }}
                                        >
                                            Summarizing{" "}
                                            <span className="lfm-number">
                                                {tableSize}
                                            </span>{" "}
                                            unique data points
                                        </p>
                                        <p
                                            style={{
                                                margin: "0px",
                                                fontSize: "1.5rem",
                                                lineHeight: "normal",
                                                color: "var(--text-faded)",
                                            }}
                                        >
                                            Ellapsed time:{" "}
                                            <span className="lfm-number">
                                                {Math.round(
                                                    ellapsedTime / 1000
                                                )}
                                            </span>{" "}
                                            second
                                            {Math.round(ellapsedTime / 1000) ===
                                            1
                                                ? ""
                                                : "s"}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                fontSize: "1.5rem",
                                                lineHeight: "normal",
                                                color: "var(--text-faded)",
                                            }}
                                        >
                                            Connecting...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </ContentCluster>
                )}
                {questList && (
                    <ContentCluster title="Audit Results">
                        <div
                            className="player-filter-input column-on-mobile small-gap-on-mobile"
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: "10px",
                                paddingBottom: "10px",
                            }}
                        >
                            <label
                                htmlFor="questname"
                                style={{
                                    fontSize: "1.2rem",
                                    marginBottom: "0px",
                                }}
                            >
                                Filter by quest name
                            </label>
                            <input
                                style={{
                                    maxWidth: "250px",
                                    width: "100%",
                                    height: "max-content",
                                }}
                                type="text"
                                id="questname"
                                name="questname"
                                className="full-width-mobile"
                                onChange={() => HandleQuestNameFilter()}
                            />
                            <label
                                htmlFor="levelfilter"
                                style={{
                                    fontSize: "1.2rem",
                                    marginBottom: "0px",
                                }}
                            >
                                or level (e.g. "1,3,5-9")
                            </label>
                            <input
                                style={{
                                    maxWidth: "100px",
                                    width: "100%",
                                    height: "max-content",
                                }}
                                type="text"
                                id="levelfilter"
                                name="levelfilter"
                                className="full-width-mobile"
                                onChange={() => HandleLevelFilter()}
                            />
                            <div className="audit-report-time">
                                <p style={{ fontSize: "medium" }}>
                                    Audit performed {startTime.toString()} ran
                                    for {ellapsedTime / 1000}s (cached)
                                </p>
                            </div>
                        </div>
                        <QuestTable
                            data={paginatedQuestList}
                            showLastUpdated={false}
                            reportReference={showReportForm}
                            handleSelection={(quest) => loadQuest(quest)}
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
                                            filteredQuestList.length / PAGE_SIZE
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
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
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
                        <ChartBar
                            keys={["Frequency"]}
                            indexBy="Duration"
                            legendBottom="Duration (miuntes)"
                            legendLeft="Frequency"
                            data={durationData}
                            loadingMessage="Click on a quest to view data"
                            noAnim={true}
                        />
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
                        <h4>{questName || "No quest selected"}</h4>
                        <p
                            style={{
                                fontSize: "large",
                                marginBottom: "0px",
                            }}
                        >
                            Popularity over time.
                        </p>
                        <ChartLine
                            keys={["Instances"]}
                            indexBy="Time"
                            legendBottom="Date"
                            legendLeft="Instances"
                            data={popularityOverTimeData}
                            loadingMessage="Click on a quest to view data"
                            noAnim={true}
                            title="Popularity over time"
                            marginBottom={100}
                            // tickValues="every 1 day"
                            // trendType="week"
                        />
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
                        <h4>{questName || "No quest selected"}</h4>
                        <p
                            style={{
                                fontSize: "large",
                                marginBottom: "0px",
                            }}
                        >
                            Popularity throughout the week.
                        </p>
                        <ChartBar
                            keys={["Instances"]}
                            indexBy="Time"
                            legendBottom="Time of Week (Hours, offset from Sunday 00:00)"
                            legendLeft="Instances"
                            data={datetimeData}
                            loadingMessage="Click on a quest to view data"
                            noAnim={true}
                            days={true}
                        />
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
                        <h4>{questName || "No quest selected"}</h4>
                        <p
                            style={{
                                fontSize: "large",
                                marginBottom: "0px",
                            }}
                        >
                            Popularity throughout the day.
                        </p>
                        <ChartBar
                            keys={["Instances"]}
                            indexBy="Time"
                            legendBottom="Time of Day (24-hour format)"
                            legendLeft="Instances"
                            data={todData}
                            loadingMessage="Click on a quest to view data"
                            noAnim={true}
                        />
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
                        <h4>{questName || "No quest selected"}</h4>
                        <p
                            style={{
                                fontSize: "large",
                                marginBottom: "0px",
                            }}
                        >
                            Popularity per server.
                        </p>
                        <ChartPie
                            data={serverDistData}
                            loadingMessage="Click on a quest to view data"
                            noAnim={true}
                        />
                    </ContentCluster>
                )}
            </div>
        </div>
    );
};

export default Quests;
