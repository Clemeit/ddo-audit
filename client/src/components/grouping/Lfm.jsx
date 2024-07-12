import React from "react";

const Lfm = (props) => {
  const classnames = [
    { name: "Alchemist", short: "Alc" },
    { name: "Artificer", short: "Art" },
    { name: "Barbarian", short: "Barb" },
    { name: "Bard", short: "Brd" },
    { name: "Cleric", short: "Clr" },
    { name: "Druid", short: "Drd" },
    { name: "Favored Soul", short: "FvS" },
    { name: "Fighter", short: "Ftr" },
    { name: "Monk", short: "Mnk" },
    { name: "Paladin", short: "Pal" },
    { name: "Ranger", short: "Rgr" },
    { name: "Rogue", short: "Rog" },
    { name: "Sorcerer", short: "Sorc" },
    { name: "Warlock", short: "Wlk" },
    { name: "Wizard", short: "Wiz" },
  ];

  function getShortName(cls) {
    let shortName = "";
    classnames.forEach((obj) => {
      if (obj.name === cls) shortName = obj.short;
    });
    return shortName || cls;
  }

  return (
    <div className="group" onClick={props.handleClick}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
          {props.lfm.leader.name}
        </span>
        {props.lfm.minimum_level && props.lfm.maximum_level && (
          <span style={{ marginLeft: "auto", fontSize: "1.8rem" }}>
            {props.lfm.minimum_level} - {props.lfm.maximum_level}
          </span>
        )}
      </div>
      {props.lfm.quest ? (
        <span
          style={{
            fontSize: "1.7rem",
            color: "var(--text-lfm-number)",
          }}
        >
          {props.lfm.quest.name} ({props.lfm.difficulty})
        </span>
      ) : (
        <span></span>
      )}
      {props.lfm.comment && (
        <span style={{ fontSize: "1.7rem" }}>"{props.lfm.comment}"</span>
      )}
      {props.lfm.adventure_active !== 0 &&
        props.lfm.adventure_active !== undefined && (
          <span
            style={{
              fontSize: "1.4rem",
              color: "var(--blue-text)",
            }}
          >
            Adventure Active: {Math.round(props.lfm.adventure_active / 60)}{" "}
            minute
            {Math.round(props.lfm.adventure_active / 60) !== 1 ? "s" : ""}
          </span>
        )}
      {props.expanded ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            marginTop: "5px",
          }}
        >
          <div className="social-member">
            <table>
              <tbody>
                <tr className="social-member-entry">
                  <td
                    className="social-member-entry name"
                    style={{
                      paddingRight: "20px",
                    }}
                  >
                    {props.lfm.leader.name}
                  </td>
                  <td
                    style={{
                      color: "var(--text-faded)",
                      paddingRight: "20px",
                    }}
                  >
                    {props.lfm.leader.classes &&
                      props.lfm.leader.classes.map((cls, i) => (
                        <span key={i}>
                          {i !== 0 && " / "}
                          {getShortName(cls.name)} {cls.level}
                        </span>
                      ))}
                  </td>
                  <td
                    style={{
                      color: "var(--text-faded)",
                      paddingRight: "20px",
                    }}
                  >
                    {props.lfm.leader.location &&
                      props.lfm.leader.location.name}
                  </td>
                </tr>
                {props.lfm.members &&
                  props.lfm.members.map((member, i) => (
                    <tr key={i} className="social-member-entry">
                      <td
                        className="social-member-entry name"
                        style={{
                          paddingRight: "20px",
                        }}
                      >
                        {member.name}
                      </td>
                      <td
                        style={{
                          color: "var(--text-faded)",
                          paddingRight: "20px",
                        }}
                      >
                        {member.classes &&
                          member.classes.map((cls, i) => (
                            <span key={i}>
                              {i !== 0 && " / "}
                              {getShortName(cls.name)} {cls.level}
                            </span>
                          ))}
                      </td>
                      <td
                        style={{
                          color: "var(--text-faded)",
                          paddingRight: "20px",
                        }}
                      >
                        {member.location.name}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        props.lfm.members.length > 0 && (
          <span
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "var(--text-faded)",
            }}
          >
            Click to view all {props.lfm.members.length + 1} members
          </span>
        )
      )}
    </div>
  );
};

export default Lfm;
