import React from "react";
import Endpoint from "./Endpoint";

const Endpoints = (props) => {
  const PlayerObject = (
    <ul>
      <li>
        A name, <span className="api-field">Name [string]</span>
      </li>
      <li>
        A gender, <span className="api-field">Gender [string]</span>
      </li>
      <li>
        A race, <span className="api-field">Race [string]</span>
      </li>
      <li>
        A total character level,{" "}
        <span className="api-field">TotalLevel [int]</span>
      </li>
      <li>
        An array of class objects,{" "}
        <span className="api-field">
          Classes [
          <span
            style={{
              color: "var(--green-text)",
            }}
          >
            Class
          </span>{" "}
          object array]
        </span>
      </li>
      <li>
        A location,{" "}
        <span className="api-field">
          Location [
          <span
            style={{
              color: "var(--green-text)",
            }}
          >
            Location
          </span>{" "}
          object]
        </span>
      </li>
      <li>
        A group id, <span className="api-field">GroupId [long]</span>
      </li>
      <li>
        A guild name, <span className="api-field">Guild [string]</span>
      </li>
      <li>
        Whether or not the character is in a party,{" "}
        <span className="api-field">InParty [boolean]</span>
      </li>
      <li>
        The server the character originated from,{" "}
        <span className="api-field">HomeServer [string]</span>
      </li>
    </ul>
  );

  const ClassObject = (
    <ul>
      <li>
        The class id, <span className="api-field">Id [int]</span>
      </li>
      <li>
        The class name, <span className="api-field">Name [string]</span>
      </li>
      <li>
        The number of levels the character has in that class,{" "}
        <span className="api-field">Level [int]</span>
      </li>
    </ul>
  );

  const LocationObject = (
    <ul>
      <li>
        The location id, <span className="api-field">Id [int]</span>
      </li>
      <li>
        The location name, <span className="api-field">Name [string]</span>
      </li>
      <li>
        Whether or not the location is a public space,{" "}
        <span className="api-field">IsPublicSpace [boolean]</span>
      </li>
      <li>
        The region name, <span className="api-field">Region [string]</span>
      </li>
    </ul>
  );

  const GroupDataDescription = (
    <div>
      <p style={{ marginBottom: "5px" }}>
        Returns a server object with{" "}
        <span className="api-field">Name [string]</span>,{" "}
        <span className="api-field">
          LastUpdateTime [string : %Y-%m-%dT%H:%M:%S.%LZ]
        </span>
        , <span className="api-field">GroupCount [int]</span>, and{" "}
        <span className="api-field">
          Groups [<span style={{ color: "var(--green-text)" }}>Group</span>{" "}
          object array]
        </span>
        .<br />
        The{" "}
        <span className="api-field">
          Groups [<span style={{ color: "var(--green-text)" }}>Group</span>{" "}
          object array]
        </span>{" "}
        is an array of <span style={{ color: "var(--green-text)" }}>Group</span>{" "}
        objects. Each <span style={{ color: "var(--green-text)" }}>Group</span>{" "}
        object contains the following data:
        <ul>
          <li>
            A group id, <span className="api-field">Id [long]</span>
          </li>
          <li>
            The group comment,{" "}
            <span className="api-field">Comment [string]</span>
          </li>
          <li>
            The selected quest,{" "}
            <span className="api-field">
              Quest [
              <span
                style={{
                  color: "var(--green-text)",
                }}
              >
                Quest
              </span>{" "}
              object]
            </span>
          </li>
          <li>
            An array of accepted classes{" "}
            <span className="api-field">AcceptedClasses [string array]</span>
          </li>
          <li>
            The number of accepted classes{" "}
            <span className="api-field">AcceptedCount [int]</span>
          </li>
          <li>
            The minimum accepted level,{" "}
            <span className="api-field">MinimumLevel [int]</span>
          </li>
          <li>
            The maximum accepted level,{" "}
            <span className="api-field">MaximumLevel [int]</span>
          </li>
          <li>
            The length (in minutes) the adventure has been active,{" "}
            <span className="api-field">AdventureActive [int]</span>
          </li>
          <li>
            The leader of the party,{" "}
            <span className="api-field">
              Leader [
              <span
                style={{
                  color: "var(--green-text)",
                }}
              >
                Player
              </span>{" "}
              object]
            </span>
          </li>
          <li>
            A list of group members,{" "}
            <span className="api-field">
              Members [
              <span
                style={{
                  color: "var(--green-text)",
                }}
              >
                Player
              </span>{" "}
              object array]
            </span>
          </li>
        </ul>
        The <span style={{ color: "var(--green-text)" }}>Quest</span> object has
        the following properties:
        <ul>
          <li>
            The internal area id,{" "}
            <span className="api-field">AreaId [int]</span>
          </li>
          <li>
            The name of the area,{" "}
            <span className="api-field">Name [string]</span>
          </li>
          <li>
            The heroic normal CR,{" "}
            <span className="api-field">HeroicNormalCr [int]</span>
          </li>
          <li>
            The epic normal CR,{" "}
            <span className="api-field">EpicNormalCr [int]</span>
          </li>

          <li>
            The heroic normal XP,{" "}
            <span className="api-field">HeroicNormalXp [int]</span>
          </li>
          <li>
            The heroic hard XP,{" "}
            <span className="api-field">HeroicHardXp [int]</span>
          </li>
          <li>
            The heroic elite XP,{" "}
            <span className="api-field">HeroicEliteXp [int]</span>
          </li>
          <li>
            The epic normal XP,{" "}
            <span className="api-field">EpicNormalXp [int]</span>
          </li>
          <li>
            The epic hard XP,{" "}
            <span className="api-field">EpicHardXp [int]</span>
          </li>
          <li>
            The epic elite XP,{" "}
            <span className="api-field">EpicEliteXp [int]</span>
          </li>
          <li>
            Whether or not the quest is free to VIPs,{" "}
            <span className="api-field">IsFreeToVip [boolean]</span>
          </li>
          <li>
            The required adventure pack,{" "}
            <span className="api-field">RequiredAdventurePack [string]</span>
          </li>
          <li>
            The area that the adventure takes place in,{" "}
            <span className="api-field">AdventureArea [string]</span>
          </li>
          <li>
            The journal group that the group belongs to,{" "}
            <span className="api-field">QuestJournalGroup [string]</span>
          </li>
          <li>
            The patron for the quest,{" "}
            <span className="api-field">Patron [string]</span>
          </li>
        </ul>
        All characters (leader and party members) are{" "}
        <span style={{ color: "var(--green-text)" }}>Player</span> objects, and
        have the following properties:
        {PlayerObject}
        The <span style={{ color: "var(--green-text)" }}>Class</span> object
        contains the following information:
        {ClassObject}
        The <span style={{ color: "var(--green-text)" }}>Location</span> object
        contains the following information:
        {LocationObject}
      </p>
    </div>
  );

  const PlayerDataDescription = (
    <div>
      <p style={{ marginBottom: "5px" }}>
        Returns a server object with{" "}
        <span className="api-field">Name [string]</span>,{" "}
        <span className="api-field">Population [int]</span>, and{" "}
        <span className="api-field">
          Players [<span style={{ color: "var(--green-text)" }}>Player</span>{" "}
          object array]
        </span>
        .<br />
        The{" "}
        <span className="api-field">
          Players [<span style={{ color: "var(--green-text)" }}>Player</span>{" "}
          object array]
        </span>{" "}
        is an array of{" "}
        <span style={{ color: "var(--green-text)" }}>Player</span> objects. Each{" "}
        <span style={{ color: "var(--green-text)" }}>Player</span> object
        contains the following data:
        {PlayerObject}
        The <span style={{ color: "var(--green-text)" }}>Class</span> object
        contains the following information:
        {ClassObject}
        The <span style={{ color: "var(--green-text)" }}>Location</span> object
        contains the following information:
        {LocationObject}
      </p>
    </div>
  );

  const [endpoints, setEndpoints] = React.useState([
    {
      name: "Population Data",
      path: "population/",
      description:
        "Population data can be obtained from various endpoints found under the /population subdirectory. Endpoints exist for daily, weekly, quarterly, and annual population data.",
      sub: [
        {
          endpoint: "day",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns the last 24 hours of population data. The data is
                returned as an array of{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                object has an <span className="api-field">id [string]</span>{" "}
                (the name of the server), a{" "}
                <span className="api-field">color [string]</span> (the color
                displayed on this website's graphs), and{" "}
                <span className="api-field">
                  data [<span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  object array]
                </span>
                .
              </p>
              <p>
                The{" "}
                <span className="api-field">
                  <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  [object array]
                </span>{" "}
                is an array of{" "}
                <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                objects, each with a date (
                <span className="api-field">
                  x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                </span>
                ) and a population count (
                <span className="api-field">y [int]</span>)
              </p>
            </div>
          ),
        },
        {
          endpoint: "week",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns the last 168 hours of population data. The data is
                returned as an array of{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                object has an <span className="api-field">id [string]</span>{" "}
                (the name of the server), a{" "}
                <span className="api-field">color [string]</span> (the color
                displayed on this website's graphs), and{" "}
                <span className="api-field">
                  data [<span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  object array]
                </span>
                .
              </p>
              <p>
                The{" "}
                <span className="api-field">
                  <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  [object array]
                </span>{" "}
                is an array of{" "}
                <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                objects, each with a date (
                <span className="api-field">
                  x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                </span>
                ) and an <b>hourly</b> population average (
                <span className="api-field">y [int]</span>)
              </p>
            </div>
          ),
        },
        {
          endpoint: "quarter",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns the last 92 days of population data. The data is
                returned as an array of{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                object has an <span className="api-field">id [string]</span>{" "}
                (the name of the server), a{" "}
                <span className="api-field">color [string]</span> (the color
                displayed on this website's graphs), and{" "}
                <span className="api-field">
                  data [<span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  object array]
                </span>
                .
              </p>
              <p>
                The{" "}
                <span className="api-field">
                  <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  [object array]
                </span>{" "}
                is an array of{" "}
                <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                objects, each with a date (
                <span className="api-field">
                  x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                </span>
                ) and a <b>daily</b> population average (
                <span className="api-field">y [int]</span>)
              </p>
            </div>
          ),
        },
        {
          endpoint: "year",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns the last 52 weeks of population data. The data is
                returned as an array of{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                object has an <span className="api-field">id [string]</span>{" "}
                (the name of the server), a{" "}
                <span className="api-field">color [string]</span> (the color
                displayed on this website's graphs), and{" "}
                <span className="api-field">
                  data [<span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  object array]
                </span>
                .
              </p>
              <p>
                The{" "}
                <span className="api-field">
                  <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                  [object array]
                </span>{" "}
                is an array of{" "}
                <span style={{ color: "var(--green-text)" }}>data</span>{" "}
                objects, each with a date (
                <span className="api-field">
                  x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                </span>
                ) and a <b>weekly</b> population average (
                <span className="api-field">y [int]</span>)
              </p>
            </div>
          ),
        },
      ],
    },
    {
      name: "Character Demographics",
      path: "demographics/",
      description:
        "Information about character demographics, including level, class, and race distribution.",
      sub: [
        {
          endpoint: "leveldistribution",
          description: (
            <div>
              <p>Level distribution over the past quarter (92 days).</p>
            </div>
          ),
        },
        {
          endpoint: "classdistribution",
          description: (
            <div>
              <p>Class distribution over the past quarter (92 days).</p>
            </div>
          ),
        },
        {
          endpoint: "racedistribution",
          description: (
            <div>
              <p>Race distribution over the past quarter (92 days).</p>
            </div>
          ),
        },
      ],
    },
    {
      name: "Group Data",
      path: "groups/",
      description:
        "Group (LFM) data can be obtained from server subdirectories under the /groups subdirectory. Each of these endpoints return the same object data structure. Server names should be lowercase.",
      sub: [
        {
          endpoint: "argonnessen",
          description: GroupDataDescription,
        },
        {
          endpoint: "cannith",
          description: GroupDataDescription,
        },
        {
          endpoint: "ghallanda",
          description: GroupDataDescription,
        },
        {
          endpoint: "hardcore",
          description: GroupDataDescription,
        },
        {
          endpoint: "khyber",
          description: GroupDataDescription,
        },
        {
          endpoint: "orien",
          description: GroupDataDescription,
        },
        {
          endpoint: "sarlona",
          description: GroupDataDescription,
        },
        {
          endpoint: "thelanis",
          description: GroupDataDescription,
        },
        {
          endpoint: "wayfinder",
          description: GroupDataDescription,
        },
      ],
    },
    {
      name: "Player Data",
      path: "players/",
      description:
        'Player data can be obtained from server subdirectories under the /players subdirectory. Each of these endpoints return the same object data structure. Server names should be lowercase. Anonymous players can be found in the data, but their names have been replaced with "Anonymous".',
      sub: [
        {
          endpoint: "argonnessen",
          description: PlayerDataDescription,
        },
        {
          endpoint: "cannith",
          description: PlayerDataDescription,
        },
        {
          endpoint: "ghallanda",
          description: PlayerDataDescription,
        },
        {
          endpoint: "hardcore",
          description: PlayerDataDescription,
        },
        {
          endpoint: "khyber",
          description: PlayerDataDescription,
        },
        {
          endpoint: "orien",
          description: PlayerDataDescription,
        },
        {
          endpoint: "sarlona",
          description: PlayerDataDescription,
        },
        {
          endpoint: "thelanis",
          description: PlayerDataDescription,
        },
        {
          endpoint: "wayfinder",
          description: PlayerDataDescription,
        },
      ],
    },
    {
      name: "Game Status",
      path: "gamestatus/",
      description:
        "Information about the current status of the game can be obtained from the /gamestatus subdirectory, including server status and current population/LFM count.",
      sub: [
        {
          endpoint: "populationoverview",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns the current population and LFM count of each server. The
                data is returned as an array of{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>Server</span>{" "}
                object has a name,{" "}
                <span className="api-field">ServerName [string]</span> , a
                player count{" "}
                <span className="api-field">PlayerCount [int]</span> , and an
                LFM count <span className="api-field">LfmCount [int]</span> .
              </p>
            </div>
          ),
        },
        {
          endpoint: "serverstatus",
          description: (
            <div>
              <p style={{ marginBottom: "5px" }}>
                Returns information about each server, including server status,
                launcher list order, and login queue data. The data is returned
                as an object with the last update time,{" "}
                <span className="api-field">LastUpdateTime [date string]</span>,
                and an array of{" "}
                <span style={{ color: "var(--green-text)" }}>World</span>{" "}
                objects. Each{" "}
                <span style={{ color: "var(--green-text)" }}>World</span> object
                contains the following data:{" "}
                <ul>
                  <li>
                    A name, <span className="api-field">Name [string]</span>
                  </li>
                  <li>
                    A list of billing roles specifying which type of user
                    account is permitted to log in,{" "}
                    <span className="api-field">
                      BillingRole [string array]
                    </span>
                  </li>
                  <li>
                    An order which specifies the order that worlds appear in the
                    launcher (the World with Order=0 is the current default
                    server), <span className="api-field">Order [int]</span>
                  </li>
                  <li>
                    The world status (0=offline, 1=online),{" "}
                    <span className="api-field">Status [int]</span>
                  </li>
                  <li>
                    An Id, <span className="api-field">Id [int]</span>
                  </li>
                  <li>
                    The last assigned queue number (the number assigned to the
                    last player to attempt to log in),{" "}
                    <span className="api-field">
                      LastAssignedQueueNumber [int]
                    </span>
                  </li>
                  <li>
                    The now serving number (the number that the queue is
                    currently accepting; when this number is significantly less
                    than the LastAssignedQueueNumber, there is a wait to
                    log-in),{" "}
                    <span className="api-field">
                      NowServingQueueNumber [int]
                    </span>
                  </li>
                </ul>
              </p>
            </div>
          ),
        },
      ],
    },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {endpoints.map((endpoint, i) => (
        <div
          onClick={() => {
            let teps = endpoints;
            teps.filter((tep) => tep.name == endpoint.name)[0].expanded =
              !endpoint.expanded;
            setEndpoints([...teps]);
          }}
          key={i}
        >
          <Endpoint
            data={endpoint}
            handleExpansion={(sub) => {
              let teps = endpoints;
              teps
                .filter((tep) => tep.name == endpoint.name)[0]
                .sub.filter((s) => s.endpoint == sub.endpoint)[0].expanded =
                !sub.expanded;
              setEndpoints([...teps]);
            }}
            expanded={endpoint.expanded}
          />
        </div>
      ))}
    </div>
  );
};

export default Endpoints;
