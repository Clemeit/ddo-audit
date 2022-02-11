import React from "react";
import PanelSprite from "../../assets/global/lfmsprite.jpg";

const CanvasLfmPanel = (props) => {
    // Assume that incoming props.data is already filtered according to user preferences
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);

    let [isImageLoaded, set_isImageLoaded] = React.useState(false);
    // let [selectedGroupIndex, set_selectedGroupIndex] = React.useState(-1);
    // let [cursorPosition, set_cursorPosition] = React.useState([0, 0]);
    let [groupSelection, set_groupSelection] = React.useState({
        groupIndex: -1,
        cursorPosition: [0, 0],
    });

    const panelWidth = 848;
    const lfmHeight = 90;
    const classCount = 15;
    let lastclickRef = React.useRef(0);

    function HandleMouseOnCanvas(e) {
        let rect = e.target.getBoundingClientRect();
        let x = (e.clientX - rect.left) * (848 / rect.width); //x position within the element.
        let y = (e.clientY - rect.top) * (848 / rect.width); //y position within the element.

        if (e.type === "click" && x > 743 && x < 826 && y > 51 && y < 71) {
            // Sort by level
            props.handleSort("level");
            return;
        }

        if (x > 605) {
            // 375 border between group and quest
            set_groupSelection({ ...groupSelection, groupIndex: -1 });
            // drawPanel();
            return;
        }
        if (x < 30) {
            set_groupSelection({ ...groupSelection, groupIndex: -1 });
            // drawPanel();
            return;
        }

        let index = Math.floor((y - 72) / 90);
        // if (groupSelection.groupIndex === index) {
        //     if (x < 375 && lastSide === "left") return;
        //     else if (x > 375 && lastSide === "right") return;
        // }

        if (e.type === "click" && x > 375 && x < 605) {
            if (
                e.timeStamp - lastclickRef.current.timeStamp < 500 &&
                Math.abs(e.clientY - lastclickRef.current.clientY) < 10
            ) {
                set_groupSelection({
                    groupIndex: index,
                    cursorPosition: [x, y],
                    side,
                    doubleClick: true,
                });
                return;
            }
            lastclickRef.current = e;
        }

        let side = "";
        if (x < 375) side = "left";
        else if (x > 375) side = "right";

        set_groupSelection({
            groupIndex: index,
            cursorPosition: [x, y],
            side,
        });
    }

    React.useEffect(() => {
        // TODO: Remove listeners
        let overlayTimeout;
        canvasRef.current.addEventListener("mousemove", (e) => {
            clearTimeout(overlayTimeout);
            overlayTimeout = setTimeout(() => {
                HandleMouseOnCanvas(e);
            }, 300);
        });
        canvasRef.current.addEventListener("click", (e) => {
            HandleMouseOnCanvas(e);
        });
        canvasRef.current.addEventListener("mouseleave", () => {
            clearTimeout(overlayTimeout);
            set_groupSelection({ ...groupSelection, groupIndex: -1 });
        });
    }, [canvasRef]);

    React.useEffect(() => {
        if (!isImageLoaded) {
            //console.log("Waiting on resources");
            return;
        }
        // Render canvas
        // console.log("render");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });

        const sprite = spriteRef.current;

        if (groupSelection.doubleClick) {
            if (
                groupSelection.groupIndex !== -1 &&
                groupSelection.groupIndex < props.data.Groups.length
            ) {
                let g = props.data.Groups[groupSelection.groupIndex];
                if (g.Quest != null) {
                    window.open(
                        "https://ddowiki.com/page/" +
                            g.Quest.Name.replace(/ /g, "_"),
                        "_blank"
                    );
                    return;
                }
            }
        }

        // Draw the header
        OpenPanel();

        // Draw the chin
        ClosePanel();

        // Draw lfms
        DrawFiller();
        if (props.data !== null) DrawLfms();

        // Draws the header and the lastUpdateTime string
        function OpenPanel() {
            ctx.drawImage(sprite, 0, 0, 848, 72, 0, 0, 848, 72);
            if (props.data) {
                let lastUpdateTime = new Date(props.data.LastUpdateTime);
                let hour = lastUpdateTime.getHours() % 12;
                if (hour == 0) hour = 12;
                let timeText =
                    "Last updated " +
                    hour +
                    ":" +
                    ("0" + lastUpdateTime.getMinutes()).slice(-2) +
                    ":" +
                    ("0" + lastUpdateTime.getSeconds()).slice(-2) +
                    (Math.floor(lastUpdateTime.getHours() / 12) == 0
                        ? " AM"
                        : " PM");
                ctx.font = "18px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.fillText(timeText, 212, 19);
                ctx.textAlign = "left";
                ctx.textBaseline = "alphabetic";
            }
        }

        // Draws the chin
        function ClosePanel() {
            ctx.drawImage(
                sprite,
                0,
                162,
                848,
                27,
                0,
                72 +
                    (props.data ? Math.max(props.data.Groups.length, 4) : 4) *
                        lfmHeight,
                848,
                27
            );
        }

        // Draws filler
        function DrawFiller() {
            for (
                let i = 0;
                i < (props.data ? Math.max(props.data.Groups.length, 4) : 4);
                i++
            ) {
                ctx.drawImage(
                    sprite,
                    0,
                    72,
                    848,
                    lfmHeight,
                    0,
                    72 + i * lfmHeight,
                    848,
                    lfmHeight
                );
            }
        }

        function DrawLfms() {
            if (props.data === null) {
                //console.log("Waiting on data");
                return;
            }
            props.data.Groups.filter((group) => {
                return group.Eligible || props.showNotEligible;
            }).forEach((group, index) => {
                // Draw background and borders
                if (group.Eligible) {
                    let gradient = ctx.createLinearGradient(
                        0,
                        72 + index * lfmHeight,
                        0,
                        72 + (index + 1) * lfmHeight
                    );
                    gradient.addColorStop(
                        0,
                        props.highVisibility ? "#30301e" : "#3b3b25"
                    );
                    gradient.addColorStop(
                        0.25,
                        props.highVisibility ? "#42402a" : "#4c4a31"
                    );
                    gradient.addColorStop(
                        0.75,
                        props.highVisibility ? "#42402a" : "#4c4a31"
                    );
                    gradient.addColorStop(
                        1,
                        props.highVisibility ? "#30301e" : "#3b3b25"
                    );

                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = "#150a06";
                }
                ctx.fillRect(26, 73 + lfmHeight * index, 802, lfmHeight);

                ctx.beginPath();
                ctx.strokeStyle = "#8f8d74";
                ctx.lineWidth = 1;
                ctx.rect(26, 73 + lfmHeight * index, 802, lfmHeight);
                ctx.stroke();

                ctx.moveTo(375, 73 + lfmHeight * index);
                ctx.lineTo(375, 73 + lfmHeight * index + lfmHeight);
                ctx.stroke();

                ctx.moveTo(605, 73 + lfmHeight * index);
                ctx.lineTo(605, 73 + lfmHeight * index + lfmHeight);
                ctx.stroke();

                ctx.moveTo(742, 73 + lfmHeight * index);
                ctx.lineTo(742, 73 + lfmHeight * index + lfmHeight);
                ctx.stroke();

                // Draw party leader's name
                ctx.fillStyle = props.highVisibility
                    ? "white"
                    : group.Eligible
                    ? "#f6f1d3"
                    : "#988f80";
                ctx.textBaseline = "alphabetic";
                ctx.font = `${18 + props.fontModifier}px 'Trebuchet MS'`;
                ctx.textAlign = "left";
                ctx.fillText(
                    group.Leader.Name,
                    49,
                    73 + lfmHeight * index + 18 + props.fontModifier / 2
                );
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
                        58 + lfmHeight * index + 18,
                        18,
                        18
                    );
                }

                // Draw party leader's level
                ctx.textAlign = "center";
                ctx.font = `${15 + props.fontModifier}px Arial`;
                ctx.fillText(
                    group.Leader.TotalLevel ||
                        (group.Leader.Name === "DDO Audit" ? "99" : "0"),
                    360,
                    90 + lfmHeight * index + props.fontModifier / 2
                );

                // Draw level range
                ctx.textBaseline = "middle";
                ctx.font = `${16 + props.fontModifier}px Arial`;
                ctx.fillText(
                    (group.MinimumLevel || "1") +
                        " - " +
                        (group.MaximumLevel || "30"),
                    786,
                    117 + lfmHeight * index
                );
                ctx.textBaseline = "alphabetic";

                // Draw member count
                if (group.Members) {
                    if (group.Members.length > 0) {
                        ctx.fillStyle = props.highVisibility
                            ? "white"
                            : group.Eligible
                            ? "#b6b193"
                            : "#95927e";
                        ctx.textAlign = "left";
                        ctx.fillText(
                            "(" + (group.Members.length + 1) + " members)",
                            49 + leaderWidth + 4,
                            73 + lfmHeight * index + 18 + props.fontModifier / 2
                        );
                    }
                }

                // Draw quest
                if (group.Quest != null) {
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : group.Eligible
                        ? "#f6f1d3"
                        : "#988f80";
                    ctx.font = `${18 + props.fontModifier}px Arial`;
                    ctx.textAlign = "center";
                    let textLines = wrapText(group.Quest.Name, 220);
                    if (textLines.length > 2 && props.fontModifier > 0) {
                        textLines = textLines.slice(0, 2);
                        textLines[1] = textLines[1] + "...";
                    }
                    for (let i = 0; i < textLines.length; i++) {
                        ctx.fillText(
                            textLines[i],
                            489,
                            120 +
                                lfmHeight * index -
                                (textLines.length -
                                    1 +
                                    (group.Difficulty.length > 3 ? 1 : 0)) *
                                    9 +
                                i * (19 + props.fontModifier)
                        );
                    }
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : group.Eligible
                        ? "#b6b193"
                        : "#95927e";
                    ctx.font = `${14 + props.fontModifier}px Arial`;
                    ctx.fillText(
                        "(" + group.Difficulty + ")",
                        489,
                        123 +
                            lfmHeight * index -
                            (textLines.length -
                                1 +
                                (group.Difficulty.length > 3 ? 1 : 0)) *
                                9 +
                            textLines.length * 19 +
                            props.fontModifier
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
                    73 + lfmHeight * index + 3,
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
                        77 + index * lfmHeight,
                        102,
                        60
                    );
                } else {
                    if (group.AcceptedCount === classCount) {
                        ctx.drawImage(
                            sprite,
                            group.Eligible ? 287 : 390,
                            189,
                            102,
                            60,
                            608,
                            77 + index * lfmHeight,
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
                                77 + index * lfmHeight + Math.floor(i / 5) * 21,
                                18,
                                18
                            );
                        });
                    }
                }

                // Draw comment
                ctx.fillStyle = props.highVisibility
                    ? "white"
                    : group.Eligible
                    ? "#bfbfbf"
                    : "#7f7472";
                ctx.font = `${15 + props.fontModifier}px Arial`;
                ctx.textAlign = "left";
                let textLines = wrapText(group.Comment, 330);
                if (
                    group.AdventureActive !== 0 &&
                    group.AdventureActive !== undefined
                ) {
                    if (
                        textLines.length > 2 ||
                        (textLines.length > 1 && props.fontModifier > 0)
                    ) {
                        textLines = textLines.slice(0, 1);
                        textLines[textLines.length - 1] =
                            textLines[textLines.length - 1] + "...";
                    }
                } else {
                    if (textLines.length > 2 && props.fontModifier > 0) {
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
                    ctx.fillText(
                        textLines[i],
                        31,
                        110 +
                            lfmHeight * index +
                            i * (19 + props.fontModifier) +
                            props.fontModifier * 1.5
                    );
                }

                // Draw active time
                if (
                    group.AdventureActive !== 0 &&
                    group.AdventureActive !== undefined
                ) {
                    ctx.fillStyle = props.highVisibility
                        ? "#5fcafc"
                        : "#02adfb";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "Adventure Active: " +
                            group.AdventureActive +
                            (group.AdventureActive === 1
                                ? " minute"
                                : " minutes"),
                        200,
                        148 + lfmHeight * index
                    );
                }
            });

            if (
                groupSelection.groupIndex !== -1 &&
                groupSelection.groupIndex < props.data.Groups.length
            ) {
                if (groupSelection.cursorPosition[0] < 375) {
                    DrawPlayerOverlay(
                        props.data.Groups[groupSelection.groupIndex],
                        groupSelection.cursorPosition
                    );
                } else {
                    DrawQuestOverlay(
                        props.data.Groups[groupSelection.groupIndex],
                        groupSelection.cursorPosition
                    );
                }
            }
        }

        function DrawPlayerOverlay(group, cursorPosition) {
            if (group === null) return;

            let estimatedBottom =
                cursorPosition[1] + 3 + (group.Members.length + 1) * 41 + 26;
            if (estimatedBottom > canvas.height) {
                cursorPosition[1] -= estimatedBottom - canvas.height;
            }

            let fontModifier = props.fontModifier === 0 ? 0 : 4;

            ctx.drawImage(
                sprite,
                0,
                189,
                287,
                2,
                cursorPosition[0],
                cursorPosition[1],
                287,
                2
            );

            // Each player in the party is 41px in height
            let memberList = [group.Leader, ...group.Members];
            if (memberList !== null) {
                memberList.forEach((member, i) => {
                    ctx.drawImage(
                        sprite,
                        0,
                        191,
                        287,
                        41,
                        cursorPosition[0],
                        cursorPosition[1] + 2 + 41 * i,
                        287,
                        41
                    );
                    let grad = ctx.createLinearGradient(
                        0,
                        cursorPosition[1] + 2 + 41 * i,
                        0,
                        cursorPosition[1] + 2 + 41 * (i + 1)
                    );
                    grad.addColorStop(0, "#404947");
                    grad.addColorStop(0.25, "#4d5955");
                    grad.addColorStop(0.75, "#4d5955");
                    grad.addColorStop(1, "#404947");
                    ctx.fillStyle = grad;
                    ctx.fillRect(
                        cursorPosition[0] + 4,
                        cursorPosition[1] + 3 + 41 * i,
                        269,
                        39
                    );

                    // Race
                    if (member.Gender == "Unknown") member.Gender = "Male";
                    let raceIconPosition = getRaceIconPosition(
                        member.Gender + " " + member.Race,
                        true
                    );
                    ctx.drawImage(
                        sprite,
                        raceIconPosition[0],
                        raceIconPosition[1],
                        18,
                        18,
                        cursorPosition[0] + 4,
                        cursorPosition[1] + 2 + 41 * i,
                        18,
                        18
                    );

                    // Name
                    ctx.fillStyle = "#f6f1d3";
                    ctx.textBaseline = "middle";
                    ctx.font = 18 + fontModifier + "px 'Trebuchet MS'"; // 18px
                    ctx.textAlign = "left";
                    ctx.fillText(
                        member.Name,
                        cursorPosition[0] + 26,
                        cursorPosition[1] + 3 + 41 * i + 10
                    );
                    let memberWidth = ctx.measureText(member.Name).width;
                    if (member.Name.startsWith("Clemei")) {
                        memberWidth += 22;
                        ctx.drawImage(
                            sprite,
                            746,
                            189,
                            17,
                            18,
                            cursorPosition[0] + 8 + memberWidth,
                            cursorPosition[1] + 3 + 41 * i,
                            17,
                            18
                        );
                    }

                    // Location
                    if (member.Location != null) {
                        ctx.font = 12 + "px 'Trebuchet MS'";
                        ctx.textAlign = "center";
                        ctx.fillText(
                            member.Location.Name,
                            cursorPosition[0] + 102,
                            cursorPosition[1] + 3 + 41 * i + 30
                        );
                    }

                    // Level
                    ctx.textAlign = "center";
                    ctx.font = 17 + fontModifier + "px Arial"; // 15px
                    ctx.fillText(
                        member.TotalLevel,
                        cursorPosition[0] + 4 + 256,
                        cursorPosition[1] + 3 + 41 * i + 11
                    );

                    // Classes
                    ctx.font = "13px Arial";
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "right";
                    if (member.Classes !== null && member.Classes !== undefined)
                        for (let c = 0; c < member.Classes.length; c++) {
                            // First pass for icons
                            let xp = cursorPosition[0] + 166 + 21 * c;
                            let yp = cursorPosition[1] + 4 + 41 * i;

                            ctx.fillStyle = "#3e4641";
                            ctx.fillRect(xp - 1, yp - 1, 20, 20);

                            let classIconPosition = getClassIconPosition(
                                member.Classes[c].Name,
                                true
                            );
                            ctx.drawImage(
                                sprite,
                                classIconPosition[0],
                                classIconPosition[1],
                                18,
                                18,
                                xp,
                                yp,
                                18,
                                18
                            );
                        }
                    if (member.Classes !== null && member.Classes !== undefined)
                        for (let c = 0; c < member.Classes.length; c++) {
                            // Second pass for levels
                            let xp = cursorPosition[0] + 166 + 21 * c;
                            let yp = cursorPosition[1] + 4 + 41 * i;

                            ctx.fillStyle = "black";
                            ctx.fillText(
                                member.Classes[c].Level,
                                xp + 22,
                                yp + 18
                            );
                            ctx.fillStyle = "white";
                            ctx.fillText(
                                member.Classes[c].Level,
                                xp + 21,
                                yp + 17
                            );
                        }
                });
            }

            ctx.drawImage(
                sprite,
                0,
                232,
                287,
                26,
                cursorPosition[0],
                cursorPosition[1] + 2 + memberList.length * 41,
                287,
                26
            );

            // Comment
            ctx.textBaseline = "middle";
            ctx.fillStyle = fontModifier > 0 ? "white" : "#bfbfbf";
            ctx.font = 15 + fontModifier + "px Arial"; // 15px
            ctx.textAlign = "left";
            let textLines = wrapText(group.Comment, 269);

            for (let i = 0; i < textLines.length; i++) {
                ctx.drawImage(
                    sprite,
                    0,
                    232,
                    287,
                    23,
                    cursorPosition[0],
                    cursorPosition[1] +
                        2 +
                        memberList.length * 41 +
                        i * (19 + (fontModifier < 0 ? -3 : 0)),
                    287,
                    23
                );
                ctx.fillText(
                    textLines[i],
                    cursorPosition[0] + 4,
                    cursorPosition[1] +
                        memberList.length * 41 +
                        13 +
                        i * (19 + (fontModifier < 0 ? -3 : 0))
                );
            }

            ctx.drawImage(
                sprite,
                0,
                255,
                287,
                3,
                cursorPosition[0],
                cursorPosition[1] +
                    2 +
                    memberList.length * 41 +
                    textLines.length * (19 + (fontModifier < 0 ? -3 : 0)) +
                    (fontModifier < 0 ? 4 : 3),
                287,
                3
            );
        }

        function DrawQuestOverlay(group, cursorPosition) {
            if (group === null) return;
            if (group.Quest == null) return;

            let estimatedBottom = cursorPosition[1] + 3 + 170 + 26;
            if (estimatedBottom > canvas.height) {
                cursorPosition[1] -= estimatedBottom - canvas.height;
            }
            let estimatedRight = cursorPosition[0] + 350;
            if (estimatedRight > canvas.width) {
                cursorPosition[0] -= estimatedRight - canvas.width;
            }

            let fontModifier = props.fontModifier === 0 ? 0 : 4;

            ctx.globalAlpha = 0.8;
            ctx.drawImage(
                sprite,
                0,
                189,
                287,
                2,
                cursorPosition[0],
                cursorPosition[1],
                350,
                2
            );
            ctx.drawImage(
                sprite,
                0,
                191,
                287,
                10,
                cursorPosition[0],
                cursorPosition[1] + 2,
                350,
                10
            );
            ctx.globalAlpha = 1;

            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";

            let quest = group.Quest;
            let row = 1;

            if (quest.Name != null) {
                drawOverlayBackground(row);
                drawOverlayTitle("Quest", row); // 1-based index
                let wrapped = wrapText(quest.Name, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            if (quest.AdventureArea != null) {
                drawOverlayBackground(row);
                drawOverlayTitle("Takes place in", row);
                let wrapped = wrapText(quest.AdventureArea, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            if (quest.QuestJournalGroup != null) {
                drawOverlayBackground(row);
                drawOverlayTitle("Nearest hub", row);
                let wrapped = wrapText(quest.QuestJournalGroup, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            drawOverlayBackground(row);
            drawOverlayTitle("Level", row);
            drawOverlayInfo(
                (quest.HeroicNormalCR != null
                    ? quest.HeroicNormalCR + " Heroic"
                    : "") +
                    (quest.HeroicNormalCR != null && quest.EpicNormalCR != null
                        ? ", "
                        : "") +
                    (quest.EpicNormalCR != null
                        ? quest.EpicNormalCR + " Epic"
                        : ""),
                row
            );
            row++;

            drawOverlayBackground(row);
            drawOverlayTitle("Adventure pack", row);
            let wrapped = wrapText(
                quest.RequiredAdventurePack ?? "Free to play",
                220
            );
            for (let i = 0; i < wrapped.length; i++) {
                if (i > 0) drawOverlayBackground(row);
                drawOverlayInfo(wrapped[i], row);
                row++;
            }

            if (quest.Patron != null) {
                drawOverlayBackground(row);
                drawOverlayTitle("Patron", row);
                drawOverlayInfo(quest.Patron ?? "", row);
                row++;
            }

            drawOverlayBackground(row);
            row++;
            drawOverlayBackground(row);
            ctx.textAlign = "center";
            ctx.font = "italic 15px Arial";
            ctx.fillText(
                "Double-Click to open the Wiki page",
                cursorPosition[0] + 175,
                cursorPosition[1] + 3 + 20 * row - 10
            );

            ctx.drawImage(
                sprite,
                0,
                255,
                287,
                3,
                cursorPosition[0],
                cursorPosition[1] + 2 + 10 + row * 20,
                350,
                3
            ); // Close

            // Helper function for drawing part of the quest overlay
            function drawOverlayBackground(line) {
                ctx.globalAlpha = 0.8;
                ctx.drawImage(
                    sprite,
                    0,
                    191,
                    287,
                    20,
                    cursorPosition[0],
                    cursorPosition[1] + 2 + 20 * line - 10,
                    350,
                    20
                ); // Background
                ctx.globalAlpha = 1;
            }

            // Helper function for drawing the title of a quest info field
            function drawOverlayTitle(text, line) {
                if (text == null) return;
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "right";
                ctx.fillText(
                    text + ":",
                    cursorPosition[0] + 140,
                    cursorPosition[1] + 3 + 20 * line
                );
            }

            // Helper function for drawing the content of a quest info field
            function drawOverlayInfo(text, line) {
                if (text == null) return;
                ctx.textAlign = "left";
                ctx.font = "15px Arial";
                ctx.fillText(
                    text,
                    cursorPosition[0] + 150,
                    cursorPosition[1] + 3 + 20 * line
                );
            }
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
    }, [
        props.data,
        props.fontModifier,
        props.highVisibility,
        isImageLoaded,
        groupSelection.groupIndex,
        groupSelection.side,
        groupSelection.doubleClick,
    ]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <img
                ref={spriteRef}
                src={PanelSprite}
                onLoad={() => set_isImageLoaded(true)}
                style={{ display: "none" }}
            />
            {props.children}
            <canvas
                className="lfm-canvas"
                id="lfm-canvas"
                ref={canvasRef}
                style={{
                    backgroundColor: "black",
                    width: "100%",
                }}
                width={panelWidth}
                height={
                    (props.data ? Math.max(props.data.Groups.length, 4) : 4) *
                        lfmHeight +
                    99
                }
            />
        </div>
    );
};

export default CanvasLfmPanel;
