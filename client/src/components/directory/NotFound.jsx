import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import Footer from "./Footer";
import ContentCluster from "../global/ContentCluster";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";

const NotFound = () => {
  const TITLE = "DDO Audit | 404 Page Not Found";

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
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
        <meta
          name="description"
          content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, check to see if your friends are online, and decide what server is best for you!"
        />
      </Helmet>
      <Banner
        small={false}
        showTitle={true}
        showSubtitle={true}
        showButtons={true}
        title="DDO Audit"
        subtitle="Real-time Player Concurrency Data and LFM Viewer"
      />
      <div className="content-container">
        <div className="top-content-padding" />
        <ContentCluster
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: "5px",
              }}
            >
              <WarningSVG
                style={{
                  marginRight: "10px",
                  width: "30px",
                  height: "30px",
                }}
              />
              404 Page Not Found
            </div>
          }
          altTitle="404 Page Not Found"
          description={
            <div>
              <p>Ooops, that page doesn't exist!</p>
              <ul>
                <li style={{ marginBottom: "10px" }}>
                  If you clicked a bookmark with the "playeraudit" domain, you
                  may need to update your bookmark.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  If you clicked on an old link, that link may be directing you
                  to a page that no longer exists.
                </li>
              </ul>
              <p>
                Please use the navigation buttons to find the page you were
                looking for, or return to the <Link to="/">Directory</Link>.
              </p>
              <p>
                If you believe this to be an error,{" "}
                <Link to="/suggestions">please let me know</Link>.
              </p>
            </div>
          }
          noFade={true}
        ></ContentCluster>
      </div>
    </div>
  );
};

export default NotFound;
