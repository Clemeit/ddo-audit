import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import BannerMessage from "../global/BannerMessage";
import NoMobileOptimization from "../global/NoMobileOptimization";
import ChartLine from "../global/ChartLine";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";
import PopupMessage from "../global/PopupMessage";
import DataClassification from "../global/DataClassification";

const Trends = (props) => {
  const TITLE = "DDO Population Data Trends";

  const DAY_ONLY = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [population1Year, setPopulation1Year] = React.useState(null);
  const [permanentVsHardcore1Year, setPermanentVsHardcore1Year] =
    React.useState(null);
  const [minsAndMaxes1Year, setMinsAndMaxes1Year] = React.useState(null);
  const [minsAndMaxesQuarter, setMinsAndMaxesQuarter] = React.useState(null);
  const [quarterDelta, setQuarterDelta] = React.useState(null);

  const [markedEvents, setMarkedEvents] = React.useState(null);

  const [quarterDeltaType, setQuarterDeltaType] = React.useState("population");

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/quarter${
        quarterDeltaType === "population" ? "" : "_groups"
      }_delta`,
      5000
    )
      .then((val) => {
        setQuarterDelta(val);
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [quarterDeltaType]);

  React.useEffect(() => {
    Fetch("https://api.ddoaudit.com/population/year", 5000).then((val) => {
      setPopulation1Year(
        val.filter(
          (series) =>
            series.id !== "Total" &&
            series.id !== "Permanent" &&
            series.id !== "Minimum" &&
            series.id !== "Maximum"
        )
      );
      setPermanentVsHardcore1Year(
        val.filter(
          (series) =>
            series.id === "Permanent" ||
            series.id === "Hardcore" ||
            series.id === "Total"
        )
      );
      setMinsAndMaxes1Year(
        val.filter(
          (series) =>
            series.id === "Total" ||
            series.id === "Minimum" ||
            series.id === "Maximum"
        )
      );
    });

    Fetch("https://api.ddoaudit.com/population/quarter", 5000).then((val) => {
      setMinsAndMaxesQuarter(
        val.filter(
          (series) =>
            series.id === "Total" ||
            series.id === "Minimum" ||
            series.id === "Maximum"
        )
      );
    });

    Fetch("https://api.ddoaudit.com/markedevents", 5000).then((val) => {
      setMarkedEvents(val);
    });

    Fetch("https://api.ddoaudit.com/population/quarter_delta", 5000).then(
      (val) => {
        setQuarterDelta(val);
      }
    );
  }, []);

  function readAbout(r, callback) {
    switch (r) {
      case "ignoring downtimes":
        Log("Read about downtimes", "Trends");
        setPopupMessage({
          title: "Dowtimes",
          message: (
            <span>
              We attempt to filter out downtimes from this report by doing the
              following:
              <ul>
                <li>Ignoring times with zero population</li>
                <li>Ignoring data for one hour after a known downtime</li>
              </ul>
              <p>
                It's not a science. There's still obviously a lot of volatility
                in the data and this may be improved upon in the future.
              </p>
            </span>
          ),
          icon: "info",
          fullscreen: true,
        });
        break;
    }
  }

  var [popupMessage, setPopupMessage] = React.useState(null);

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="DDO's population trends over the last year. View permanent servers' and Hardcore League's population over time. See how each update has effected the population."
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
        small={true}
        showTitle={true}
        showSubtitle={true}
        showButtons={false}
        hideOnMobile={true}
        title="Trends"
        subtitle="Long-term Population Trends"
      />
      <PopupMessage
        page="trends"
        message={popupMessage}
        popMessage={() => {
          setPopupMessage(null);
        }}
      />
      <div className="content-container">
        <BannerMessage page="trends" />
        <DataClassification classification="mixed" />
        <div className="top-content-padding-small shrink-on-mobile" />
        <NoMobileOptimization />
        <ContentCluster
          title="Server Population Trends"
          description="Data for each server displayed as weekly averages. All server downtimes are ignored."
        >
          <ChartLine
            data={population1Year}
            trendType="annual"
            activeFilter="Server Activity"
            showActions={false}
            showLastUpdated={true}
            reportReference={null}
            marginBottom={120}
            height="460px"
            forceHardcore={true}
            markedEvents={markedEvents}
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title="Permanent Servers vs. Hardcore League"
          description="Data displayed as a total of all servers, total of the permanent servers, and Hardcore League server only. All server downtimes are ignored."
        >
          <ChartLine
            data={permanentVsHardcore1Year}
            trendType="annual"
            activeFilter="Server Activity"
            showActions={false}
            showLastUpdated={true}
            reportReference={null}
            marginBottom={120}
            height="460px"
            showArea={true}
            areaOpacity={0.1}
            forceHardcore={true}
            markedEvents={markedEvents}
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title="Weekly Minimum and Maximum Population"
          description={
            <span>
              Data displayed as weekly minimums, maximums, and averages.
              Downtimes are mostly ignored{" "}
              <span
                className="faux-link"
                onClick={() => readAbout("ignoring downtimes")}
              >
                (read more)
              </span>
              .
            </span>
          }
        >
          <ChartLine
            data={minsAndMaxes1Year}
            trendType="annual"
            activeFilter="Server Activity"
            showActions={false}
            showLastUpdated={true}
            reportReference={null}
            marginBottom={120}
            height="460px"
            showArea={false}
            areaOpacity={0.1}
            forceHardcore={true}
            markedEvents={markedEvents}
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title={`Server ${
            quarterDeltaType === "population" ? "Population" : "LFM Count"
          } Delta`}
          altTitle="Server Delta"
          description={
            <span>
              <span>
                The last quater of{" "}
                {quarterDeltaType === "population" ? "population" : "LFM count"}{" "}
                delta. Weekly percent changes are shown.
              </span>
              <br />
              <span
                className="faux-link"
                onClick={() => {
                  setQuarterDeltaType(
                    quarterDeltaType === "population" ? "groups" : "population"
                  );
                  Log("Switched between population/LFMs", "Trends delta chart");
                }}
              >
                Click here to switch to{" "}
                {quarterDeltaType === "population" ? "LFM" : "population"} data
              </span>
            </span>
          }
        >
          <ChartLine
            data={quarterDelta}
            trendType="quarter"
            activeFilter="Server Activity"
            showActions={false}
            showLastUpdated={true}
            reportReference={null}
            marginBottom={120}
            height="460px"
            markedEvents={markedEvents}
            showArea={true}
            yMin={"auto"}
            curve="linear"
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title="Daily Minimum and Maximum Population"
          description="The last quarter of trend data displayed as daily minimums, maximums, and averages."
        >
          <ChartLine
            data={minsAndMaxesQuarter}
            trendType="quarter"
            activeFilter="Server Activity"
            showActions={false}
            showLastUpdated={true}
            reportReference={null}
            marginBottom={120}
            height="460px"
            showArea={false}
            areaOpacity={0.1}
            forceHardcore={true}
            markedEvents={markedEvents}
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
      </div>
    </div>
  );
};

export default Trends;
