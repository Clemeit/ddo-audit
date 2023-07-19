import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";

const DonateThankYou = () => {
  const TITLE = "Thank You!";
  const [showEmail, setShowEmail] = React.useState(false);

  useEffect(() => {
    Log("Viewed Donate Thank You page");
  }, []);

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Thank you for your donation to DDO Audit!"
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
        hideOnMobile={false}
        hideVote={true}
        title="DDO Audit"
        subtitle="Real-time Player Concurrency Data and LFM Viewer"
      />
      <div className="content-container">
        <div className="top-content-padding shrink-on-mobile" />
        <ContentCluster title="Thank you for donating!">
          <p>
            I fell in love with DDO back in 2009, and I have been looking for
            ways to give back to the community ever since. That desire
            eventually came to fruition in the form of DDO Audit. I never
            imagined that it would grow to be as popular as it is today, and I
            am so thankful for all of the support I have received over the
            years.
          </p>
          <p>
            Your generous donation will ensure that DDO Audit can continue to be
            provided to thousands of other DDO players for free. I am very
            grateful for your support!
          </p>
          <p> - Clemeit of Thelanis</p>
          <br />
          <br />
          <p style={{ fontStyle: "italic" }}>
            If you need to contact me regarding your donation, please email me:{" "}
            {showEmail ? (
              <a href="mailto:ddoaudit@fastmail.com">ddoaudit@fastmail.com</a>
            ) : (
              <span className="faux-link" onClick={() => setShowEmail(true)}>
                [click to show email]
              </span>
            )}
          </p>
        </ContentCluster>
      </div>
    </div>
  );
};

export default DonateThankYou;
