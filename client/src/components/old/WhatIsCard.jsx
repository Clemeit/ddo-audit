import React from "react";
import ExpandableCard from "./ExpandableCard";

const WhatIsCard = (props) => {
    return (
        <ExpandableCard
            className={props.className}
            smallHeight="200px"
            largeHeight="1200px"
            style={{ paddingTop: "20px", position: "absolute" }}
            isExpandable={true}
        >
            <h4 style={{ fontWeight: "bold" }}>What is DDO Audit?</h4>
            <p>
                DDO Audit is a real-time player and LFM tracking project for{" "}
                <a
                    href="https://www.ddo.com/en"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Dungeons and Dragons Online
                </a>
                . We track the current player population and posted LFMs for
                each server and report that data in the form of interactable and
                easy to understand charts and graphs, and familiar tools like
                the Grouping and Who panels. Read more about the project on the
                About page.
            </p>
            <h4 style={{ fontWeight: "bold" }}>
                We want you to be informed and stay connected
            </h4>
            <ul>
                <li>
                    One of the most common questions we've witnessed new players
                    ask regards which server would be the most populated during
                    their active play-time. Luckily, we've taken all the
                    guesswork out of it! While ultimately your choice of server
                    should be based on a variety of factors (interactions you
                    have with other players, guilds with similar interests,
                    etc.), choosing the server that has the most traffic for
                    your given time zone is a great place to start.
                </li>
                <li>
                    There are a few server status tools around the web, but we
                    wanted everything easily accessible from one site. Check the
                    current server status at a glance from the Servers page to
                    see if your favorite server is currently online.
                </li>
                <li>
                    An offline (out of game) LFM panel has been something of
                    great interest to the DDO community, and we're proud to be
                    hosting the first ever implementation of it! The offline LFM
                    panel has been a great resource to help increase player
                    engagement and offer convenience to those with multiple
                    characters across multiple servers. Check the LFM panel
                    before you login to choose the appropriate character, or
                    setup notifications to never miss raid night again!
                </li>
            </ul>
            <h4 style={{ fontWeight: "bold" }}>Community-Oriented</h4>
            <p>
                We're dedicated to providing the DDO community with the most
                accurate and useful data possible. Most of the features on this
                website today were directly inspired or requested by community
                members on the DDO Forums, Discord server, Reddit, or YouTube
                channels. If you have any requests or suggestions, please reach
                out! You can find my contact information on the About page. See
                you in Eberron!
            </p>
            <center>
                <span style={{ fontSize: "larger" }}>Clemeit of Thelanis</span>
            </center>
        </ExpandableCard>
    );
};

export default WhatIsCard;
