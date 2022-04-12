import React from "react";
import Banner from "../global/Banner";
import ContentCluster from "../global/ContentCluster";
import ChartLine from "../global/ChartLine";
import { Fetch, Post } from "../../services/DataLoader";

const Steps = (props) => {
    const [hours, setHours] = React.useState(24);
    const hoursRef = React.useRef(hours);
    hoursRef.current = hours;
    const [summaryData, setSummaryData] = React.useState(null);
    let mostRecentIndex = 0;

    function summarize(data) {
        let frequencydata = [];
        let intensitydata = [];
        const TIME_INTERVAL = 240; // seconds

        let now = new Date(data[0].datetime);
        while (
            now.getTime() < new Date(data[data.length - 1].datetime).getTime()
        ) {
            let { count, intensity } = getRecentEnvironment(
                data,
                now,
                TIME_INTERVAL
            );
            frequencydata.push({
                x: convertToTimeString(now),
                y: count,
            });
            intensitydata.push({
                x: convertToTimeString(now),
                y: intensity,
            });
            now = new Date(now.getTime() + TIME_INTERVAL * 1000);
        }

        let frequencychartdata = [
            {
                id: "Steps",
                color: "hsl(200, 100%, 50%)",
                data: frequencydata,
            },
        ];
        let intensitychartdata = [
            {
                id: "Intensity",
                color: "hsl(30, 100%, 50%)",
                data: intensitydata,
            },
        ];

        setSummaryData({
            frequency: frequencychartdata,
            intensity: intensitychartdata,
        });
    }

    function convertToTimeString(time) {
        return `${time.getUTCFullYear()}-${(time.getUTCMonth() + 1)
            .toString()
            .padStart(2, "0")}-${time
            .getUTCDate()
            .toString()
            .padStart(2, "0")}T${time
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${time
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}:${time
            .getUTCSeconds()
            .toString()
            .padStart(2, "0")}.000Z`;
    }

    function getRecentEnvironment(data, time, seconds) {
        let count = 0;
        let intensity = 0;
        let current = time.getTime();
        let checking;

        for (let i = 0; i < data.length; i++) {
            checking = new Date(data[i].datetime).getTime();
            if (Math.abs(current - checking) <= seconds * 1000) {
                count++;
            }
            if (Math.abs(current - checking) <= seconds * 500) {
                intensity = Math.max(intensity, data[i].intensity);
            }
        }

        return { count, intensity };
    }

    function refreshStepData() {
        Post(
            `https://api.ddoaudit.com/iot/steps`,
            { hours: hoursRef.current },
            5000
        )
            .then((val) => {
                summarize(val);
            })
            .catch((err) => {});
    }

    React.useEffect(() => {
        refreshStepData();
        const interval = setInterval(() => refreshStepData(), 30000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Steps"
                subtitle="Step Detector"
            />
            <div className="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <label
                        htmlFor="hours-value"
                        style={{
                            fontSize: "1.2rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                            marginBottom: "0px",
                        }}
                    >
                        Report Hours:
                        <input
                            id="hours-value"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            style={{
                                marginLeft: "10px",
                                marginRight: "20px",
                                width: "60px",
                                textAlign: "center",
                            }}
                        />
                    </label>
                    <button
                        onClick={() => refreshStepData()}
                        style={{ width: "70px" }}
                    >
                        Apply
                    </button>
                </div>
                <ContentCluster title="Step Detector">
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        The frequency of steps occurring over time.
                    </p>
                    <ChartLine
                        data={summaryData && summaryData.frequency}
                        showActions={false}
                        trendType="day"
                        curve="linear"
                        reportReference={null}
                        marginBottom={0}
                        height="460px"
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        The intensity of steps occurring over time.
                    </p>
                    <ChartLine
                        data={summaryData && summaryData.intensity}
                        showActions={false}
                        trendType="day"
                        curve="linear"
                        reportReference={null}
                        marginBottom={0}
                        height="460px"
                    />
                </ContentCluster>
            </div>
        </div>
    );
};

export default Steps;
