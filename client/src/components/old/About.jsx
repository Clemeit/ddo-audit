import React from "react";
import WhatIsCard from "./WhatIsCard";
import ExpandableCard from "./ExpandableCard";
import DevEvent from "../about/DevEvent";

const About = (props) => {
    return (
        <div>
            <WhatIsCard />
            <ExpandableCard smallHeight="200px" largeHeight="600px">
                <h4 className="header-bold">About This Project</h4>
                <p>
                    DDO Audit exists to keep the community and prospective
                    players informed on population distribution and player
                    trends. The initial project idea spawned from the frequently
                    asked question, "What server is the most populated?" Answers
                    were never consistent and often relied on anecdote.
                </p>
                <p>
                    The project scope quickly expanded to include player
                    demographics (e.g. race, gender, class, guild affiliation,
                    and content popularity), a live 'Grouping' panel, and a live
                    'Who' panel.
                </p>
            </ExpandableCard>
            <ExpandableCard smallHeight="200px" largeHeight="1700px">
                <h4 className="header-bold">Development Log</h4>
                <DevEvent
                    title="January 15, 2021 - Filters"
                    events={[
                        "Added: Content popularity can now be filtered by quests or raids",
                        "Added: Server demographics can now be filtered by Active/Inactive Players or End-game Players",
                    ]}
                />
                <DevEvent
                    title="November 5, 2020 - Stability"
                    events={["Changed: Complete overhaul of back-end systems"]}
                />
                <DevEvent
                    title="October 9, 2020 - Who's That?"
                    events={["Added: Live 'Who' panel"]}
                />
                <DevEvent
                    title="August 22, 2020 - Most Popular Content"
                    events={["Added: Content popularity by server"]}
                />
                <DevEvent
                    title="August 14, 2020 - Player API"
                    events={["Added: API for public player data"]}
                />
                <DevEvent
                    title="August 8, 2020 - API Updates"
                    events={[
                        "Changed: Major API changes to support additional keys",
                    ]}
                />
                <DevEvent
                    title="June 24, 2020 - Demographics"
                    events={[
                        "Added: Server population distribution by gender, race, and guild affiliation",
                    ]}
                />
                <DevEvent
                    title="June 4, 2020 - Classes and Levels"
                    events={[
                        "Added: Population distribution by class and level",
                    ]}
                />
                <DevEvent
                    title="May 2, 2020 - Social Hour"
                    events={["Added: Live LFM preview"]}
                />
                <DevEvent
                    title="April 15, 2020 - Going Dark"
                    events={["Added: Dark theme"]}
                />

                <DevEvent
                    title="April 5, 2020 - Wayfinder"
                    events={["Added: We're now tracking Wayfinder"]}
                />
                <DevEvent
                    title="March 30, 2020 - Accessibility"
                    events={[
                        "Added: You can now share the direct link to a specific server's page from your browser's URL",
                        "Added: Server summary options for 1 month or 1 week",
                        "Added: Choose between combined activity or server activity on the main page",
                    ]}
                />
                <DevEvent
                    title="March 26, 2020 - We See You Too"
                    events={["Added: Now tracking anonymous players"]}
                />
                <DevEvent
                    title="March 20, 2020 - Going Public"
                    events={[
                        "Released the website URL to the DDO Forums and related community boards",
                    ]}
                />
                <DevEvent
                    title="February 20, 2020 - We See You"
                    events={["Added: We're now tracking all servers"]}
                />
                <DevEvent
                    title="February 15, 2020 - Custom Reports"
                    events={[
                        "Added: The user can now generate reports based on a custom date range",
                    ]}
                />
                <DevEvent
                    title="February 2, 2020 - We're Online"
                    events={["Launched the website", "Added: Live graphs"]}
                />
                <DevEvent
                    title="January 1, 2020 - Release"
                    events={[
                        "Released the first month of data collection to the DDO Forums",
                    ]}
                />
                <DevEvent
                    title="December 1, 2019 - It's Alive"
                    events={[
                        "Began 24/7 data collection in preparation for publicizing data",
                    ]}
                />
                <DevEvent
                    title="November 27, 2019 - Automation"
                    events={[
                        "Implemented automatic polling on a designated machine",
                        "Added LFM data collection",
                    ]}
                />
                <DevEvent
                    title="November 18, 2019 - Project Inception"
                    events={[
                        "Designed the original method of collecting player data",
                        "Manual samples were taken randomly throughout the day",
                    ]}
                />
            </ExpandableCard>
        </div>
    );
};

export default About;
