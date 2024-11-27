import React from "react";
import { Link } from "react-router-dom";
import PanelSprite from "../../assets/global/lfmsprite_v3.jpg";
import { Log } from "../../services/CommunicationService";
import { ToSentenceCase } from "../../utils/StringUtils";

const RaidGroupCluster = (props) => {
    const CANVAS_REFS = [
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
    ];
    const spriteRef = React.useRef(null);
    const PANEL_WIDTH = 848;
    const LFM_HEIGHT = 90;
    const CLASS_COUNT = 15;

    let canvas;
    let ctx;
    const sprite = spriteRef.current;

    let [isImageLoaded, setIsImageLoaded] = React.useState(false);

    React.useEffect(() => {
        DrawRaidsToPanels();
    }, [props.data, isImageLoaded]);

    function CountRaidGroups(server_data) {
        let result = 0;
        Object.values(server_data.lfms).forEach((lfm) => {
            if (lfm.quest?.group_size === "Raid") {
                result += 1;
            }
        });
        return result;
    }

    function GameRaidCount() {
        if (props.data) {
            let result = 0;
            Object.values(props.data.data).forEach((server_data) => {
                Object.values(server_data.lfms).forEach((lfm) => {
                    if (lfm.quest?.group_size === "Raid") {
                        result += 1;
                    }
                });
            });
            return result;
        } else {
            return 0;
        }
    }

    function DrawRaidsToPanels() {
        if (!props.data) return;
        if (!isImageLoaded) return;

        Object.values(props.data.data).forEach((server_data, i) => {
            if (CountRaidGroups(server_data) > 0) {
                let yOffset = 0;
                canvas = CANVAS_REFS[i].current;
                ctx = canvas.getContext("2d", { alpha: false });
                Object.values(server_data.lfms).forEach((lfm) => {
                    lfm.eligible = true;
                    if (lfm.quest?.group_size === "Raid") {
                        DrawRaid(lfm, yOffset);
                        yOffset += LFM_HEIGHT;
                    }
                });
            }
        });
    }

    function DrawRaid(lfm, yOffset) {
        ctx.drawImage(
            sprite,
            0,
            72,
            848,
            LFM_HEIGHT,
            0,
            yOffset,
            848,
            LFM_HEIGHT
        );

        let top = yOffset;
        // props.data.Groups.filter((group) => {
        //     return group.Eligible || props.showNotEligible;
        // }).forEach((group, index) => {
        // Draw background and borders
        // const COMMENT_LINES = wrapText(lfm.comment, 330);
        // const LFM_HEIGHT = 0;
        // if (props.expandedInfo) {
        //     if (lfm.members.length) {
        //         LFM_HEIGHT += lfm.members.length * 25 + 30;
        //     }
        //     if (lfm.comment) {
        //         LFM_HEIGHT += COMMENT_LINES.length * 20 + 5;
        //     }
        //     if (lfm.adventure_active_time) {
        //         LFM_HEIGHT += 20;
        //     }
        //     if (LFM_HEIGHT < LFM_HEIGHT) {
        //         LFM_HEIGHT = LFM_HEIGHT;
        //     }
        // } else {
        //     LFM_HEIGHT = LFM_HEIGHT;
        // }

        if (isFeytwisted(lfm)) {
            let gradient = ctx.createLinearGradient(
                0,
                top,
                PANEL_WIDTH,
                top + LFM_HEIGHT
            );
            gradient.addColorStop(0, "#a11d1d");
            gradient.addColorStop(0.2, "#a1a11d");
            gradient.addColorStop(0.4, "#1da11f");
            gradient.addColorStop(0.6, "#1d9aa1");
            gradient.addColorStop(0.8, "#1d1da1");
            gradient.addColorStop(1, "#8f1da1");

            ctx.fillStyle = gradient;
            ctx.fillRect(26, top, 802, LFM_HEIGHT);

            gradient = ctx.createLinearGradient(0, top, 0, top + LFM_HEIGHT);
            gradient.addColorStop(0, "#3b3b25");
            gradient.addColorStop(0.25, "#4c4a31");
            gradient.addColorStop(0.75, "#4c4a31");
            gradient.addColorStop(1, "#3b3b25");

            ctx.fillStyle = gradient;
            ctx.fillRect(31, top + 5, 792, LFM_HEIGHT - 10);
        } else if (lfm.eligible) {
            let gradient = ctx.createLinearGradient(
                0,
                top,
                0,
                top + LFM_HEIGHT
            );
            gradient.addColorStop(0, "#3b3b25");
            gradient.addColorStop(0.25, "#4c4a31");
            gradient.addColorStop(0.75, "#4c4a31");
            gradient.addColorStop(1, "#3b3b25");

            ctx.fillStyle = gradient;
            ctx.fillRect(26, top, 802, LFM_HEIGHT);
        } else {
            ctx.fillStyle = "#150a06";
            ctx.fillRect(26, top, 802, LFM_HEIGHT);
        }

        ctx.beginPath();
        ctx.strokeStyle = "#8f8d74";
        ctx.lineWidth = 1;
        ctx.rect(26, top, 802, LFM_HEIGHT);
        ctx.stroke();

        ctx.moveTo(375, top);
        ctx.lineTo(375, top + LFM_HEIGHT);
        ctx.stroke();

        ctx.moveTo(605, top);
        ctx.lineTo(605, top + LFM_HEIGHT);
        ctx.stroke();

        ctx.moveTo(742, top);
        ctx.lineTo(742, top + LFM_HEIGHT);
        ctx.stroke();

        // Draw party leader's name
        ctx.fillStyle = lfm.eligible ? "#f6f1d3" : "#988f80";
        ctx.textBaseline = "alphabetic";
        ctx.font = `18px 'Trebuchet MS'`;
        ctx.textAlign = "left";
        ctx.fillText(lfm.leader.name, 49, top + 18);
        let leaderWidth = ctx.measureText(lfm.leader.name).width;
        if (lfm.leader.name.startsWith("Clemei")) {
            leaderWidth += 22;
            ctx.drawImage(
                sprite,
                728,
                189,
                18,
                18,
                49 + leaderWidth - 20,
                top + 3,
                18,
                18
            );
        }

        // Draw party leader's level
        ctx.font = `15px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(
            lfm.leader.total_level ||
                (lfm.leader.name === "DDO Audit" ? "99" : "0"),
            360,
            17 + top
        );

        // Draw level range
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `16px Arial`;
        ctx.fillText(
            (lfm.minimum_level || "1") + " - " + (lfm.maximum_level || "30"),
            786,
            top + LFM_HEIGHT / 2
        );
        ctx.textBaseline = "alphabetic";

        // Draw member count
        if (lfm.members) {
            if (lfm.members.length > 0) {
                ctx.fillStyle = lfm.eligible ? "#b6b193" : "#95927e";
                ctx.textAlign = "left";
                ctx.fillText(
                    "(" + (lfm.members.length + 1) + " members)",
                    49 + leaderWidth + 4,
                    top + 18
                );
            }
        }

        // Draw quest
        if (lfm.quest != null) {
            ctx.fillStyle = lfm.eligible
                ? lfm.is_quest_guess
                    ? "#d3f6f6"
                    : "#f6f1d3"
                : "#988f80";
            ctx.font = `${lfm.is_quest_guess ? "italic " : ""}18px Arial`;
            ctx.textAlign = "center";
            let textLines = wrapText(lfm.quest.name, 220);
            if (textLines.length > 2) {
                textLines = textLines.slice(0, 2);
                textLines[1] = textLines[1] + "...";
            }
            for (let i = 0; i < textLines.length; i++) {
                ctx.fillText(
                    textLines[i],
                    489,
                    top -
                        7 +
                        LFM_HEIGHT / 2 -
                        (textLines.length -
                            1 +
                            (lfm.difficulty.length > 3 ? 1 : 0) -
                            1) *
                            9 +
                        i * 19
                );
            }

            if (lfm.characters_on_timer) {
                // draw timer icon
                ctx.drawImage(sprite, 764, 189, 18, 18, 585, top + 2, 18, 18);
            }

            ctx.font = `14px Arial`;
            ctx.fillStyle = lfm.eligible
                ? lfm.is_quest_guess
                    ? "#d3f6f6"
                    : "#b6b193"
                : "#95927e";
            ctx.fillText(
                "(" + getLfmDifficulty(lfm) + ")",
                489,
                top -
                    4 +
                    LFM_HEIGHT / 2 -
                    (textLines.length -
                        1 +
                        (lfm.difficulty.length > 3 ? 1 : 0) -
                        1) *
                        9 +
                    textLines.length * 19
            );
        }

        // Draw race icon
        let raceIconBounds = getRaceIconPosition(
            lfm.leader.gender + " " + lfm.leader.race,
            lfm.eligible
        );
        ctx.drawImage(
            sprite,
            raceIconBounds[0],
            raceIconBounds[1],
            18,
            18,
            28,
            top + 3,
            18,
            18
        );

        // Draw class array
        if (!lfm.hasOwnProperty("accepted_count")) {
            ctx.drawImage(
                sprite,
                lfm.eligible ? 287 : 390,
                189,
                102,
                60,
                608,
                4 + top,
                102,
                60
            );
        } else {
            if (
                lfm.accepted_count === CLASS_COUNT ||
                lfm.accepted_classes == null
            ) {
                ctx.drawImage(
                    sprite,
                    lfm.eligible ? 287 : 390,
                    189,
                    102,
                    60,
                    608,
                    4 + top,
                    102,
                    60
                );
            } else {
                lfm.accepted_classes.forEach((playerclass, i) => {
                    let classIconPosition = getClassIconPosition(
                        playerclass,
                        lfm.eligible
                    );
                    ctx.drawImage(
                        sprite,
                        classIconPosition[0],
                        classIconPosition[1],
                        18,
                        18,
                        608 + (i % 5) * 21,
                        4 + top + Math.floor(i / 5) * 21,
                        18,
                        18
                    );
                });
            }
        }

        // Draw comment
        ctx.fillStyle = lfm.eligible ? "#bfbfbf" : "#7f7472";
        ctx.font = `15px Arial`;
        ctx.textAlign = "left";
        let textLines = wrapText(lfm.comment, 330);
        if (
            lfm.adventure_active_time !== 0 &&
            lfm.adventure_active_time !== undefined
        ) {
            if (textLines.length > 2 || textLines.length > 1) {
                textLines = textLines.slice(0, 1);
                textLines[textLines.length - 1] =
                    textLines[textLines.length - 1] + "...";
            }
        } else {
            if (textLines.length > 2) {
                textLines = textLines.slice(0, 2);
                textLines[textLines.length - 1] =
                    textLines[textLines.length - 1] + "...";
            } else if (textLines.length > 3) {
                textLines = textLines.slice(0, 2);
                textLines[textLines.length - 1] =
                    textLines[textLines.length - 1] + "...";
            }
        }
        for (let i = 0; i < Math.min(textLines.length, 3); i++) {
            ctx.fillText(textLines[i], 31, 37 + top + +i * 19);
        }

        // Draw active time
        if (
            lfm.adventure_active_time != null &&
            lfm.adventure_active_time !== 0
        ) {
            let modifiedAdventureActiveTime = Math.max(
                lfm.adventure_active_time,
                60
            );
            ctx.fillStyle = "#02adfb";
            ctx.textAlign = "center";
            ctx.fillText(
                "Adventure Active: " +
                    Math.round(modifiedAdventureActiveTime / 60) +
                    (Math.round(modifiedAdventureActiveTime / 60) === 1
                        ? " minute"
                        : " minutes"),
                200,
                top + LFM_HEIGHT - 10
            );
        }
        top += LFM_HEIGHT;
        // });
    }

    // Helper function for getting group difficulty
    function getLfmDifficulty(lfm) {
        if (!lfm.is_quest_guess && lfm.difficulty != "Reaper") {
            return lfm.difficulty;
        }

        const sanitized = lfm.comment.toLowerCase();
        const NORMAL_PATTERN = /(\bln\b)(\ben\b)|(\bnormal\b)/;
        const HARD_PATTERN = /(\blh\b)(\beh\b)|(\bhard\b)/;
        const ELITE_PATTERN = /(\ble\b)(\bee\b)|(\belite\b)/;
        const REAPER_PATTERN = /(\br\b)|(\breaper\b)/;

        if (lfm.is_quest_guess) {
            if (NORMAL_PATTERN.test(sanitized)) {
                return "Normal";
            }
            if (HARD_PATTERN.test(sanitized)) {
                return "Hard";
            }
            if (ELITE_PATTERN.test(sanitized)) {
                return "Elite";
            }
        }

        const SKULL_PATTERN_1 = /r(\d+\+?)/;
        const SKULL_PATTERN_2 = /reaper (\d+\+?)/;
        const SKULL_PATTERN_3 = /(\d+\+?) skull/;
        const SKULL_PATTERN_4 = /(r\+)/;

        let skullCount = 0;
        if (SKULL_PATTERN_1.test(sanitized)) {
            let num = SKULL_PATTERN_1.exec(sanitized);
            skullCount = num[1];
        }

        if (SKULL_PATTERN_2.test(sanitized)) {
            let num = SKULL_PATTERN_2.exec(sanitized);
            skullCount = num[1];
        }

        if (SKULL_PATTERN_3.test(sanitized)) {
            let num = SKULL_PATTERN_3.exec(sanitized);
            skullCount = num[1];
        }

        if (SKULL_PATTERN_4.test(sanitized)) {
            let num = SKULL_PATTERN_4.exec(sanitized);
            skullCount = "1+";
        }

        if (+skullCount !== 0) {
            if (+skullCount > 10) {
                skullCount = 9001;
            }
            return `Reaper ${skullCount}`;
        }

        if (lfm.is_quest_guess) {
            if (REAPER_PATTERN.test(sanitized)) {
                return "Reaper";
            }
            return "Normal";
        }
        return "Reaper";
    }

    function isFeytwisted(lfm) {
        if (
            (lfm.comment.toLowerCase().includes("feytwisted") ||
                lfm.comment.toLowerCase().includes("fey chest")) &&
            lfm.quest?.required_adventure_pack.toLowerCase().includes("feywild")
        )
            return true;
        return false;
    }

    // Helper function for wrapping text
    function wrapText(text, maxWidth) {
        if (text === null) return "";
        let words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Helper function for getting race icon position
    function getRaceIconPosition(race, eligible) {
        let xsrc = 0;
        let ysrc = 0;
        switch (race) {
            case "Female Aasimar":
            case "Female Aasimar Scourge":
                xsrc = 0;
                ysrc = 0;
                break;
            case "Female Dragonborn":
                xsrc = 18;
                ysrc = 0;
                break;
            case "Female Drow Elf":
                xsrc = 36;
                ysrc = 0;
                break;
            case "Female Dwarf":
                xsrc = 54;
                ysrc = 0;
                break;
            case "Female Elf":
            case "Female Sun Elf":
            case "Female Wood Elf":
                xsrc = 72;
                ysrc = 0;
                break;
            case "Female Gnome":
            case "Female Deep Gnome":
                xsrc = 0;
                ysrc = 18;
                break;
            case "Female Half Elf":
                xsrc = 18;
                ysrc = 18;
                break;
            case "Female Halfling":
                xsrc = 36;
                ysrc = 18;
                break;
            case "Female Half Orc":
                xsrc = 54;
                ysrc = 18;
                break;
            case "Female Human":
            case "Female Shadar-kai":
            case "Female Purple Dragon Knight":
                xsrc = 72;
                ysrc = 18;
                break;
            case "Female Shifter":
            case "Female Razorclaw Shifter":
                xsrc = 90;
                ysrc = 18;
                break;
            case "Female Tiefling":
            case "Female Tiefling Scoundrel":
                xsrc = 0;
                ysrc = 36;
                break;
            case "Female Warforged":
            case "Female Bladeforged":
                xsrc = 18;
                ysrc = 36;
                break;
            case "Male Aasimar":
            case "Male Aasimar Scourge":
                xsrc = 36;
                ysrc = 36;
                break;
            case "Male Dragonborn":
                xsrc = 54;
                ysrc = 36;
                break;
            case "Male Drow Elf":
                xsrc = 72;
                ysrc = 36;
                break;
            case "Male Dwarf":
                xsrc = 0;
                ysrc = 54;
                break;
            case "Male Elf":
            case "Male Sun Elf":
            case "Male Wood Elf":
                xsrc = 18;
                ysrc = 54;
                break;
            case "Male Gnome":
            case "Male Deep Gnome":
                xsrc = 36;
                ysrc = 54;
                break;
            case "Male Half Elf":
                xsrc = 54;
                ysrc = 54;
                break;
            case "Male Halfling":
                xsrc = 72;
                ysrc = 54;
                break;
            case "Male Half Orc":
                xsrc = 0;
                ysrc = 72;
                break;
            case "Male Human":
            case "Male Shadar-kai":
            case "Male Purple Dragon Knight":
                xsrc = 18;
                ysrc = 72;
                break;
            case "Male Shifter":
            case "Male Razorclaw Shifter":
                xsrc = 90;
                ysrc = 0;
                break;
            case "Male Tiefling":
            case "Male Tiefling Scoundrel":
                xsrc = 36;
                ysrc = 72;
                break;
            case "Male Warforged":
            case "Male Bladeforged":
                xsrc = 54;
                ysrc = 72;
                break;
            case "Male Tabaxi":
            case "Female Tabaxi":
            case "Male Tabaxi Trailblazer":
            case "Female Tabaxi Trailblazer":
                xsrc = 90;
                ysrc = 36;
                break;
            default:
                xsrc = 72;
                ysrc = 72;
                break;
        }
        return [xsrc + (eligible ? 493 : 601), ysrc + 189];
    }

    // Helper function for getting race icon position
    function getClassIconPosition(classname, eligible) {
        let xsrc = 0;
        let ysrc = 0;
        switch (classname) {
            case "Alchemist": // 70032AFE
                xsrc = 21;
                ysrc = 0;
                break;
            case "Artificer": // 700148CE
                xsrc = 42;
                ysrc = 42;
                break;
            case "Barbarian": // 7000006B
                xsrc = 84;
                ysrc = 0;
                break;
            case "Bard": // 7000006C
                xsrc = 0;
                ysrc = 42;
                break;
            case "Cleric": // 7000006D
                xsrc = 42;
                ysrc = 21;
                break;
            case "Druid": // 70016ADB
                xsrc = 63;
                ysrc = 42;
                break;
            case "Favored Soul": // 7000C5CE
                xsrc = 63;
                ysrc = 0;
                break;
            case "Fighter": // 7000006E
                xsrc = 0;
                ysrc = 0;
                break;
            case "Monk": // 70006BF5
                xsrc = 21;
                ysrc = 42;
                break;
            case "Paladin": // 7000006F
                xsrc = 42;
                ysrc = 0;
                break;
            case "Ranger": // 70000070
                xsrc = 21;
                ysrc = 21;
                break;
            case "Rogue": // 70000071
                xsrc = 0;
                ysrc = 21;
                break;
            case "Sorcerer": // 7000000B
                xsrc = 84;
                ysrc = 21;
                break;
            case "Warlock": // 7000C5DA
                xsrc = 84;
                ysrc = 42;
                break;
            case "Wizard": // 7000000E
                xsrc = 63;
                ysrc = 21;
                break;
            case "Epic": // 7001B1A3
                xsrc = 423 - (eligible ? 0 : 103);
                ysrc = 0;
                break;
        }
        return [xsrc + 287 + (eligible ? 0 : 103), ysrc + 189];
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
                fontSize: "1.5rem",
            }}
        >
            <img
                ref={spriteRef}
                src={PanelSprite}
                onLoad={() => setIsImageLoaded(true)}
                style={{ display: "none" }}
            />
            {GameRaidCount() === 0 && (
                <span style={{ color: "var(--text-faded)" }}>
                    When a raid LFM is posted on any server, it'll show up here.
                </span>
            )}
            {props.data &&
                Object.entries(props.data.data).map(
                    ([server_name, serer_data], i) =>
                        CountRaidGroups(serer_data) > 0 && (
                            <Link
                                to={`/grouping/${server_name.toLowerCase()}?highlight=raids`}
                                key={i}
                                className="nav-box shrinkable raid-box"
                                style={{
                                    width: "100%",
                                    maxHeight: "unset",
                                    height: "unset",
                                }}
                                onClick={() => {
                                    Log(
                                        "Clicked raid group link",
                                        "Raid group cluster"
                                    );
                                }}
                            >
                                <div className="nav-box-title">
                                    <h2 className="raid-server-title">
                                        {ToSentenceCase(server_name)}
                                    </h2>
                                </div>
                                <canvas
                                    className="lfm-canvas"
                                    ref={CANVAS_REFS[i]}
                                    style={{
                                        backgroundColor: "black",
                                        maxWidth: PANEL_WIDTH * 1.3,
                                        width: "100%",
                                    }}
                                    width={PANEL_WIDTH}
                                    height={
                                        LFM_HEIGHT * CountRaidGroups(serer_data)
                                    }
                                />
                            </Link>
                        )
                )}
        </div>
    );
};

export default RaidGroupCluster;
