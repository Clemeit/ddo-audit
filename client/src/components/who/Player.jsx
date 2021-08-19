import React from "react";
import { ReactComponent as StarOutlineSVG } from "../../assets/global/star_outline.svg";
import { ReactComponent as StarFilledSVG } from "../../assets/global/star_filled.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as PinSVG } from "../../assets/global/pin.svg";

const Player = (props) => {
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
        <div className="player">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    color: "var(--text)",
                }}
                onClick={props.handleClick}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                    }}
                >
                    {props.starred ? (
                        <PinSVG
                            className="link-icon pinned"
                            onClick={(e) => {
                                props.handleStarred();
                                e.stopPropagation();
                            }}
                        />
                    ) : (
                        <PinSVG
                            className="link-icon pin"
                            onClick={(e) => {
                                props.handleStarred();
                                e.stopPropagation();
                            }}
                        />
                    )}
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        {props.player.Name}
                    </span>
                    <span
                        style={{
                            fontWeight: "",
                            fontSize: "1.5rem",
                            color: "var(--text-faded)",
                            marginLeft: "auto",
                        }}
                    >
                        Level {props.player.TotalLevel}
                    </span>
                </div>
                {!props.expanded && (
                    <span
                        style={{
                            fontWeight: "",
                            fontSize: "1.35rem",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        {props.player.InParty === 1 && (
                            <GroupingSVG
                                className="link-icon in-group-icon"
                                onClick={(e) => {
                                    props.handleAddFilter("Group");
                                    e.stopPropagation();
                                }}
                                style={{
                                    marginRight: "3px",
                                }}
                            />
                        )}
                        <span
                            className="in-group-icon"
                            onClick={(e) => {
                                props.handleAddFilter("Location");
                                e.stopPropagation();
                            }}
                        >
                            {props.player.Location.Name}
                        </span>
                    </span>
                )}
            </div>
            {props.expanded ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        marginTop: "5px",
                        fontSize: "1.4rem",
                        cursor: "default",
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
                                        Classes
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.Classes &&
                                            props.player.Classes.map(
                                                (cls, i) =>
                                                    cls.Name !== null && (
                                                        <span key={i}>
                                                            {i !== 0 && " / "}
                                                            {GetShortName(
                                                                cls.Name
                                                            )}{" "}
                                                            {cls.Level}
                                                        </span>
                                                    )
                                            )}
                                    </td>
                                </tr>
                                <tr className="social-member-entry">
                                    <td
                                        className="social-member-entry name"
                                        style={{
                                            paddingRight: "20px",
                                        }}
                                    >
                                        Guild
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.Guild}
                                    </td>
                                    {props.player.Guild && (
                                        <td
                                            className="blue-link"
                                            onClick={() =>
                                                props.handleAddFilter("Guild")
                                            }
                                        >
                                            Filter by this guild
                                        </td>
                                    )}
                                </tr>
                                <tr className="social-member-entry">
                                    <td
                                        className="social-member-entry name"
                                        style={{
                                            paddingRight: "20px",
                                        }}
                                    >
                                        Location
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.Location &&
                                            props.player.Location.Name}
                                    </td>
                                    <td
                                        className="blue-link"
                                        onClick={() =>
                                            props.handleAddFilter("Location")
                                        }
                                    >
                                        Filter by this location
                                    </td>
                                </tr>
                                <tr className="social-member-entry">
                                    <td
                                        className="social-member-entry name"
                                        style={{
                                            paddingRight: "20px",
                                        }}
                                    >
                                        In party
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.InParty ? "Yes" : "No"}
                                    </td>
                                    {props.player.InParty === 1 && (
                                        <td
                                            className="blue-link"
                                            onClick={() =>
                                                props.handleAddFilter("Group")
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            Filter by this group
                                        </td>
                                    )}
                                </tr>
                                <tr className="social-member-entry">
                                    <td
                                        className="social-member-entry name"
                                        style={{
                                            paddingRight: "20px",
                                        }}
                                    >
                                        Race
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.Race}
                                    </td>
                                </tr>
                                <tr className="social-member-entry">
                                    <td
                                        className="social-member-entry name"
                                        style={{
                                            paddingRight: "20px",
                                        }}
                                    >
                                        Gender
                                    </td>
                                    <td
                                        style={{
                                            color: "var(--text-faded)",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {props.player.Gender}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // props.index === 0 && (
                //     <span
                //         style={{
                //             textAlign: "center",
                //             fontSize: "1.2rem",
                //             color: "var(--text-faded)",
                //             cursor: "pointer",
                //         }}
                //         onClick={props.handleClick}
                //     >
                //         Click for more information
                //     </span>
                // )
                <></>
            )}
        </div>
    );
};

export default Player;
