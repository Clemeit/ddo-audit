import React from "react";

const Group = (props) => {
  const classnames = [
    { Name: "Alchemist", Short: "Alc" },
    { Name: "Artificer", Short: "Art" },
    { Name: "Barbarian", Short: "Barb" },
    { Name: "Bard", Short: "Brd" },
    { Name: "Cleric", Short: "Clr" },
    { Name: "Druid", Short: "Drd" },
    { Name: "Favored Soul", Short: "FvS" },
    { Name: "Fighter", Short: "Ftr" },
    { Name: "Monk", Short: "Mnk" },
    { Name: "Paladin", Short: "Pal" },
    { Name: "Ranger", Short: "Rgr" },
    { Name: "Rogue", Short: "Rog" },
    { Name: "Sorcerer", Short: "Sorc" },
    { Name: "Warlock", Short: "Wlk" },
    { Name: "Wizard", Short: "Wiz" },
  ];

  function GetShortName(cls) {
    let shortname = "";
    classnames.forEach((obj) => {
      if (obj.Name === cls) shortname = obj.Short;
    });
    return shortname || cls;
  }

  return (
    <div className="group" onClick={props.handleClick}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
          {props.group.Leader.Name}
        </span>
        {props.group.MinimumLevel && props.group.MaximumLevel && (
          <span style={{ marginLeft: "auto", fontSize: "1.8rem" }}>
            {props.group.MinimumLevel} - {props.group.MaximumLevel}
          </span>
        )}
      </div>
      {props.group.Quest ? (
        <span
          style={{
            fontSize: "1.7rem",
            color: "var(--text-lfm-number)",
          }}
        >
          {props.group.Quest.Name} ({props.group.Difficulty})
        </span>
      ) : (
        <span></span>
      )}
      {props.group.Comment && (
        <span style={{ fontSize: "1.7rem" }}>"{props.group.Comment}"</span>
      )}
      {props.group.AdventureActive !== 0 &&
        props.group.AdventureActive !== undefined && (
          <span
            style={{
              fontSize: "1.4rem",
              color: "var(--blue-text)",
            }}
          >
            Adventure Active: {Math.round(props.group.AdventureActive / 60)}{" "}
            minute
            {Math.round(props.group.AdventureActive / 60) !== 1 ? "s" : ""}
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
                    {props.group.Leader.Name}
                  </td>
                  <td
                    style={{
                      color: "var(--text-faded)",
                      paddingRight: "20px",
                    }}
                  >
                    {props.group.Leader.Classes &&
                      props.group.Leader.Classes.map((cls, i) => (
                        <span key={i}>
                          {i !== 0 && " / "}
                          {GetShortName(cls.Name)} {cls.Level}
                        </span>
                      ))}
                  </td>
                  <td
                    style={{
                      color: "var(--text-faded)",
                      paddingRight: "20px",
                    }}
                  >
                    {props.group.Leader.Location &&
                      props.group.Leader.Location.Name}
                  </td>
                </tr>
                {props.group.Members &&
                  props.group.Members.map((member, i) => (
                    <tr key={i} className="social-member-entry">
                      <td
                        className="social-member-entry name"
                        style={{
                          paddingRight: "20px",
                        }}
                      >
                        {member.Name}
                      </td>
                      <td
                        style={{
                          color: "var(--text-faded)",
                          paddingRight: "20px",
                        }}
                      >
                        {member.Classes &&
                          member.Classes.map((cls, i) => (
                            <span key={i}>
                              {i !== 0 && " / "}
                              {GetShortName(cls.Name)} {cls.Level}
                            </span>
                          ))}
                      </td>
                      <td
                        style={{
                          color: "var(--text-faded)",
                          paddingRight: "20px",
                        }}
                      >
                        {member.Location.Name}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        props.group.Members.length > 0 && (
          <span
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "var(--text-faded)",
            }}
          >
            Click to view all {props.group.Members.length + 1} members
          </span>
        )
      )}
    </div>
  );
};

export default Group;
