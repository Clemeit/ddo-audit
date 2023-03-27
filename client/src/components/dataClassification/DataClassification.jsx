import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Banner from "../global/Banner";
import ContentCluster from "../global/ContentCluster";
import { ReactComponent as ArrowSVG } from "../../assets/global/arrow_right.svg";

const DataClassification = (props) => {
  const TITLE = "Data Classification";

  const location = useLocation()
    .pathname.substring(useLocation().pathname.lastIndexOf("/") + 1)
    ?.toLowerCase();

  const getTitle = (text, path) => {
    return (
      <div
        className={location === path ? "lfm-number" : ""}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {location === path && (
          <ArrowSVG
            className="nav-icon should-invert"
            style={{ width: "30px", height: "30px" }}
          />
        )}
        {text}
      </div>
    );
  };

  const content = [
    {
      name: "mixed",
      content: (
        <ContentCluster
          title={getTitle("Mixed Data", "mixed")}
          altTitle="Mixed Data"
        >
          <p>
            Pages with mixed data contain both observed data - data which is
            taken directly from the game - and inferred data - data which has
            resulted from subjective processing methods. Pages that contain
            mixed data include the Servers page, Quests page, and Transfers
            page.
          </p>
        </ContentCluster>
      ),
    },
    {
      name: "inferred",
      content: (
        <ContentCluster
          title={getTitle("Inferred Data", "inferred")}
          altTitle="Inferred Data"
        >
          <p>
            Inferred data is generated using algorithms and other subjective
            post-processing methods on data taken from the game. This data comes
            with increased usefulness at the expense of transparency. Some of
            this data may be extrapolated from other datasets or indirectly
            generated from in-game data. Examples include quest popularity,
            "active" character totals, and server transfer reports.
          </p>
        </ContentCluster>
      ),
    },
    {
      name: "observed",
      content: (
        <ContentCluster
          title={getTitle("Observed Data", "observed")}
          altTitle="Observed Data"
        >
          <p>
            Observed data is taken directly from the game and reported without
            any filtering or subjective processing. Examples include character
            data to generate the LFM Panel and Who List, live population
            statistics, and server status.
          </p>
        </ContentCluster>
      ),
    },
  ];

  const [renderedContent, setRenderedContent] = React.useState();
  React.useEffect(() => {
    setRenderedContent(
      content
        .sort(({ name }) => name === location)
        .reverse()
        .map(({ content }) => content)
    );
  }, []);

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="How we classify the data that we report."
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
        hideVote={true}
        title="DDO Audit"
        subtitle="Data Classification"
      />
      <div className="content-container">
        <div className="top-content-padding shrink-on-mobile" />
        {renderedContent && renderedContent}
      </div>
    </div>
  );
};

export default DataClassification;
