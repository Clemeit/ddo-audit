import React from "react";
import { Link } from "react-router-dom";
import PanelSprite from "../../assets/global/lfmsprite_v3.jpg";
import { Log } from "../../services/CommunicationService";

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
    const CLASS_COUNT = 16;

    let canvas;
    let ctx;
    const sprite = spriteRef.current;

    let [isImageLoaded, setIsImageLoaded] = React.useState(false);

    React.useEffect(() => {
        drawRaidsToPanels();
    }, [props.data, isImageLoaded]);

    function serverRaidCount(server) {
        let result = 0;
        server.Groups.forEach((group) => {
            if (group.Quest?.GroupSize === "Raid") {
                result += 1;
            }
        });
        return result;
    }

    function gameRaidCount() {
        if (props.data && props.data.length) {
            let result = 0;
            props.data.forEach((server) => {
                server.Groups.forEach((group) => {
                    if (group.Quest?.GroupSize === "Raid") {
                        result += 1;
                    }
                });
            });
            return result;
        } else {
            return 0;
        }
    }

    function drawRaidsToPanels() {
        if (!props.data) return;
        if (!isImageLoaded) return;

        props.data.forEach((server, i) => {
            if (serverRaidCount(server) > 0) {
                let yOffset = 0;
                canvas = CANVAS_REFS[i].current;
                ctx = canvas.getContext("2d", { alpha: false });
                server.Groups.forEach((group) => {
                    group.Eligible = true;
                    if (group.Quest?.GroupSize === "Raid") {
                        DrawRaid(group, yOffset);
                        yOffset += LFM_HEIGHT;
                    }
                });
            }
        });
    }

    function DrawRaid(group, yOffset) {
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
        let commentlines = wrapText(group.Comment, 330);
        let lfmheight = 0;
        if (props.expandedInfo) {
            if (group.Members.length) {
                lfmheight += group.Members.length * 25 + 30;
            }
            if (group.Comment) {
                lfmheight += commentlines.length * 20 + 5;
            }
            if (group.AdventureActive) {
                lfmheight += 20;
            }
            if (lfmheight < LFM_HEIGHT) {
                lfmheight = LFM_HEIGHT;
            }
        } else {
            lfmheight = LFM_HEIGHT;
        }

        if (isFeytwisted(group)) {
            let gradient = ctx.createLinearGradient(
                0,
                top,
                PANEL_WIDTH,
                top + lfmheight
            );
            gradient.addColorStop(0, "#a11d1d");
            gradient.addColorStop(0.2, "#a1a11d");
            gradient.addColorStop(0.4, "#1da11f");
            gradient.addColorStop(0.6, "#1d9aa1");
            gradient.addColorStop(0.8, "#1d1da1");
            gradient.addColorStop(1, "#8f1da1");

            ctx.fillStyle = gradient;
            ctx.fillRect(26, top, 802, lfmheight);

            gradient = ctx.createLinearGradient(0, top, 0, top + lfmheight);
            gradient.addColorStop(0, "#3b3b25");
            gradient.addColorStop(0.25, "#4c4a31");
            gradient.addColorStop(0.75, "#4c4a31");
            gradient.addColorStop(1, "#3b3b25");

            ctx.fillStyle = gradient;
            ctx.fillRect(31, top + 5, 792, lfmheight - 10);
        } else if (group.Eligible) {
            let gradient = ctx.createLinearGradient(0, top, 0, top + lfmheight);
            gradient.addColorStop(0, "#3b3b25");
            gradient.addColorStop(0.25, "#4c4a31");
            gradient.addColorStop(0.75, "#4c4a31");
            gradient.addColorStop(1, "#3b3b25");

            ctx.fillStyle = gradient;
            ctx.fillRect(26, top, 802, lfmheight);
        } else {
            ctx.fillStyle = "#150a06";
            ctx.fillRect(26, top, 802, lfmheight);
        }

        ctx.beginPath();
        ctx.strokeStyle = "#8f8d74";
        ctx.lineWidth = 1;
        ctx.rect(26, top, 802, lfmheight);
        ctx.stroke();

        ctx.moveTo(375, top);
        ctx.lineTo(375, top + lfmheight);
        ctx.stroke();

        ctx.moveTo(605, top);
        ctx.lineTo(605, top + lfmheight);
        ctx.stroke();

        ctx.moveTo(742, top);
        ctx.lineTo(742, top + lfmheight);
        ctx.stroke();

        // Draw party leader's name
        ctx.fillStyle = group.Eligible ? "#f6f1d3" : "#988f80";
        ctx.textBaseline = "alphabetic";
        ctx.font = `18px 'Trebuchet MS'`;
        ctx.textAlign = "left";
        ctx.fillText(group.Leader.Name, 49, top + 18);
        let leaderWidth = ctx.measureText(group.Leader.Name).width;
        if (group.Leader.Name.startsWith("Clemei")) {
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
            group.Leader.TotalLevel ||
                (group.Leader.Name === "DDO Audit" ? "99" : "0"),
            360,
            17 + top
        );

        // Draw level range
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `16px Arial`;
        ctx.fillText(
            (group.MinimumLevel || "1") + " - " + (group.MaximumLevel || "30"),
            786,
            top + lfmheight / 2
        );
        ctx.textBaseline = "alphabetic";

        // Draw member count
        if (group.Members) {
            if (group.Members.length > 0) {
                ctx.fillStyle = group.Eligible ? "#b6b193" : "#95927e";
                ctx.textAlign = "left";
                ctx.fillText(
                    "(" + (group.Members.length + 1) + " members)",
                    49 + leaderWidth + 4,
                    top + 18
                );
            }
        }

        // Draw quest
        if (group.Quest != null) {
            ctx.fillStyle = group.Eligible
                ? group.Guess
                    ? "#d3f6f6"
                    : "#f6f1d3"
                : "#988f80";
            ctx.font = `${group.Guess ? "italic " : ""}18px Arial`;
            ctx.textAlign = "center";
            let textLines = wrapText(group.Quest.Name, 220);
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
                        lfmheight / 2 -
                        (textLines.length -
                            1 +
                            (group.Difficulty.length > 3 ? 1 : 0) -
                            1) *
                            9 +
                        i * 19
                );
            }

            if (group.CharactersOnTimer) {
                // draw timer icon
                ctx.drawImage(sprite, 764, 189, 18, 18, 585, top + 2, 18, 18);
            }

            ctx.font = `14px Arial`;
            ctx.fillStyle = group.Eligible
                ? group.Guess
                    ? "#d3f6f6"
                    : "#b6b193"
                : "#95927e";
            ctx.fillText(
                "(" + getGroupDifficulty(group) + ")",
                489,
                top -
                    4 +
                    lfmheight / 2 -
                    (textLines.length -
                        1 +
                        (group.Difficulty.length > 3 ? 1 : 0) -
                        1) *
                        9 +
                    textLines.length * 19
            );
        }

        // Draw race icon
        let raceIconBounds = getRaceIconPosition(
            group.Leader.Gender + " " + group.Leader.Race,
            group.Eligible
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
        if (!group.hasOwnProperty("AcceptedCount")) {
            ctx.drawImage(
                sprite,
                group.Eligible ? 287 : 390,
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
                group.AcceptedCount === CLASS_COUNT ||
                group.AcceptedClasses == null ||
                group.AcceptedClasses.length === 0
            ) {
                ctx.drawImage(
                    sprite,
                    group.Eligible ? 287 : 390,
                    189,
                    102,
                    60,
                    608,
                    4 + top,
                    102,
                    60
                );
            } else {
                group.AcceptedClasses.forEach((playerclass, i) => {
                    let classIconPosition = getClassIconPosition(
                        playerclass,
                        group.Eligible
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
        ctx.fillStyle = group.Eligible ? "#bfbfbf" : "#7f7472";
        ctx.font = `15px Arial`;
        ctx.textAlign = "left";
        let textLines = wrapText(group.Comment, 330);
        if (
            group.AdventureActive !== 0 &&
            group.AdventureActive !== undefined
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
        if (group.AdventureActive != null && group.AdventureActive !== 0) {
            let modifiedaatime = Math.max(group.AdventureActive, 60);
            ctx.fillStyle = "#02adfb";
            ctx.textAlign = "center";
            ctx.fillText(
                "Adventure Active: " +
                    Math.round(modifiedaatime / 60) +
                    (Math.round(modifiedaatime / 60) === 1
                        ? " minute"
                        : " minutes"),
                200,
                top + lfmheight - 10
            );
        }
        top += lfmheight;
        // });
    }

    // Helper function for getting group difficulty
    function getGroupDifficulty(group) {
        if (!group.Guess && group.Difficulty != "Reaper") {
            return group.Difficulty;
        }

        let sanitized = group.Comment.toLowerCase();
        let normalpattern = /(\bln\b)(\ben\b)|(\bnormal\b)/;
        let hardpattern = /(\blh\b)(\beh\b)|(\bhard\b)/;
        let elitepattern = /(\ble\b)(\bee\b)|(\belite\b)/;
        let reaperpattern = /(\br\b)|(\breaper\b)/;

        if (group.Guess) {
            if (normalpattern.test(sanitized)) {
                return "Normal";
            }
            if (hardpattern.test(sanitized)) {
                return "Hard";
            }
            if (elitepattern.test(sanitized)) {
                return "Elite";
            }
        }

        let skullpattern1 = /r(\d+\+?)/;
        let skullpattern2 = /reaper (\d+\+?)/;
        let skullpattern3 = /(\d+\+?) skull/;
        let skullpattern4 = /(r\+)/;

        let skullcount = 0;
        if (skullpattern1.test(sanitized)) {
            let num = skullpattern1.exec(sanitized);
            skullcount = num[1];
        }

        if (skullpattern2.test(sanitized)) {
            let num = skullpattern2.exec(sanitized);
            skullcount = num[1];
        }

        if (skullpattern3.test(sanitized)) {
            let num = skullpattern3.exec(sanitized);
            skullcount = num[1];
        }

        if (skullpattern4.test(sanitized)) {
            let num = skullpattern4.exec(sanitized);
            skullcount = "1+";
        }

        if (+skullcount !== 0) {
            if (+skullcount > 10) {
                skullcount = 9001;
            }
            return `Reaper ${skullcount}`;
        }

        if (group.Guess) {
            if (reaperpattern.test(sanitized)) {
                return "Reaper";
            }
            return "Normal";
        }
        return "Reaper";
    }

    function isFeytwisted(group) {
        if (
            group.Comment.toLowerCase().includes("feytwisted") &&
            group.Quest?.RequiredAdventurePack.toLowerCase().includes("feywild")
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
            {gameRaidCount() === 0 && (
                <span style={{ color: "var(--text-faded)" }}>
                    When a raid group is posted on any server, it'll show up
                    here.
                </span>
            )}
            {props.data &&
                props.data.map(
                    (server, i) =>
                        serverRaidCount(server) > 0 && (
                            <Link
                                to={`/grouping/${server.Name.toLowerCase()}?highlight=raids`}
                                key={i}
                                className="nav-box shrinkable no-padding-mobile"
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
                                    <h2 className="content-option-title">
                                        {server.Name}
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
                                        LFM_HEIGHT * serverRaidCount(server)
                                    }
                                />
                            </Link>
                        )
                )}
        </div>
    );
};

export default RaidGroupCluster;
