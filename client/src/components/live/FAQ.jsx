import React from "react";
import ContentCluster from "../global/ContentCluster";

const FAQ = (props) => {
  return (
    <ContentCluster title="Frequently Asked Questions">
      <section id="faq-section">
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          What is DDO's most populated server?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          {props.mostPopulatedServer} is DDO's most populated server.
        </p>
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          What is DDO's default server?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          {props.defaultServer} is currently DDO's default server and will have
          the most new players.
        </p>
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          How many players does DDO have?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          There have been{" "}
          <span className="population-number">{props.uniquePlayerCount}</span>{" "}
          unique characters on DDO in the last 90 days.
        </p>
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          What is DDO's best server?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          The best server for you will depend on the number of players online
          during your preferred play time (check our "Servers" page for more
          information). If you're new to DDO, start on {props.defaultServer}{" "}
          which is currently DDO's default server.
        </p>
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          Is DDO down?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          Server status can be checked on our "Live" page. The data is updated
          every minute.
        </p>
        <h4
          className="lfm-number"
          style={{
            marginBottom: "0",
            textDecoration: "underline",
          }}
        >
          Is DDO still active in {new Date().getFullYear()}?
        </h4>
        <p style={{ fontSize: "1.4rem" }}>
          Yes, DDO is still active and receives periodic updates and content
          releases. There have been{" "}
          <span className="population-number">{props.uniquePlayerCount}</span>{" "}
          unique characters and{" "}
          <span className="lfm-number">{props.uniqueGuildCount}</span> unique
          guilds on DDO in the last 90 days.
        </p>
      </section>
    </ContentCluster>
  );
};

export default FAQ;
