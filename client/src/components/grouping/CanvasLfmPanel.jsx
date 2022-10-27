import React from "react";
import PanelSprite from "../../assets/global/lfmsprite_v3.jpg";
import PumpkinSprite from "../../assets/global/pumpkins.png";
import CobwebSprite from "../../assets/global/cobweb.png";
import GhostSprite from "../../assets/global/ghosts.png";
import WallSprite from "../../assets/global/stone_wall.jpg";
import WallDarkSprite from "../../assets/global/stone_wall_dark.jpg";
import {
    init,
    renderGroupingPanel,
    renderPanelFiller,
    renderPanelFooter,
    renderPanelHeader,
} from "./PanelRenderer";

const CanvasLfmPanel = (props) => {
    // Assume that incoming props.data is already filtered according to user preferences
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);
    const MINIMUM_LFM_COUNT = 6;

    const EVENT_THEME = isSpookyTime();
    const pumpkinRef = React.useRef(null);
    const cobwebRef = React.useRef(null);
    const ghostRef = React.useRef(null);
    const wallRef = React.useRef(null);
    const wallDarkRef = React.useRef(null);

    const JOIN_REQUEST_MESSAGES = [
        "You'll have to log in to join {0}",
        "This is not the group you are looking for",
        "This isn't the real LFM panel - it's better",
        "Log in to DDO to join this fabulous group",
        "Declined!",
        "Click me again, I dare you",
        "Well this is awkward",
        "nope.",
    ];

    const SPOOKY_WORDS = [
        "night",
        "revel",
        "mabar",
        "key",
        "delera",
        "spook",
        "grave",
    ];

    const SPOOKY_AREAS = ["graveyard", "spectral dragon", "the night revels"];

    let [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const [isPumpkinLoaded, setIsPumpkinLoaded] = React.useState(false);
    const [isCobwebLoaded, setIsCobwebLoaded] = React.useState(false);
    const [isGhostLoaded, setIsGhostLoaded] = React.useState(false);
    const [isWallLoaded, setIsWallLoaded] = React.useState(false);
    const [isWallDarkLoaded, setIsWallDarkLoaded] = React.useState(false);
    // let [selectedGroupIndex, set_selectedGroupIndex] = React.useState(-1);
    // let [cursorPosition, set_cursorPosition] = React.useState([0, 0]);
    let [groupSelection, setGroupSelection] = React.useState({
        groupIndex: -1,
        cursorPosition: [0, 0],
    });
    const [attemptedJoin, setAttemptedJoin] = React.useState(null);
    const attemptedJoinRef = React.useRef(attemptedJoin);
    attemptedJoinRef.current = attemptedJoin;

    const [highlightRaids, setHighlightRaids] = React.useState(false);
    React.useEffect(() => {
        if (window.location.search === "?highlight=raids") {
            setHighlightRaids(true);
        }
    }, [window.location.pathname]);

    const panelWidth = 848;
    const lfmHeight = 90;
    const CLASS_COUNT = 15;
    let lastclickRef = React.useRef(0);

    function isSpookyTime() {
        let dt = new Date();
        if (dt.getMonth() === 9 && dt.getDate() >= 5) {
            return "revels";
        }
        return "";
    }

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
            setGroupSelection({ ...groupSelection, groupIndex: -1 });
            // drawPanel();
            return;
        }
        if (x < 30) {
            setGroupSelection({ ...groupSelection, groupIndex: -1 });
            // drawPanel();
            return;
        }

        let index = Math.floor((y - 72) / 90);
        // if (groupSelection.groupIndex === index) {
        //     if (x < 375 && lastSide === "left") return;
        //     else if (x > 375 && lastSide === "right") return;
        // }

        // Double click the quest
        if (e.type === "click" && x > 375 && x < 605) {
            if (
                e.timeStamp - lastclickRef.current.timeStamp < 500 &&
                Math.abs(e.clientY - lastclickRef.current.clientY) < 10
            ) {
                setGroupSelection({
                    groupIndex: index,
                    cursorPosition: [x, y],
                    side,
                    doubleClick: true,
                });
                return;
            }
            lastclickRef.current = e;
        }

        // Double click a group
        if (e.type === "click" && x > 30 && x < 375) {
            if (
                e.timeStamp - lastclickRef.current.timeStamp < 500 &&
                Math.abs(e.clientY - lastclickRef.current.clientY) < 10
            ) {
                setAttemptedJoin({
                    groupIndex: index,
                    cursorPosition: [x, y],
                    timeStamp: e.timeStamp,
                });
                return;
            }
            lastclickRef.current = e;
        }

        // Clear attempted join
        if (
            attemptedJoinRef.current !== null &&
            attemptedJoinRef.current.groupIndex !== index
        ) {
            setAttemptedJoin(null);
        }

        let side = "";
        if (x < 375) side = "left";
        else if (x > 375) side = "right";

        setGroupSelection({
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
            setGroupSelection({ ...groupSelection, groupIndex: -1 });
            setAttemptedJoin(null);
        });
    }, [canvasRef]);

    function computePanelHeight(groups) {
        let top = 0;

        if (groups) {
            groups
                .filter((group) => {
                    return group.Eligible || props.showNotEligible;
                })
                .forEach((group, index) => {
                    let lfmheight = 0;
                    if (props.expandedInfo) {
                        let commentlines = [];
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext("2d", { alpha: false });

                        if (group.Comment != null) {
                            let words = group.Comment.split(" ");
                            let lines = [];
                            let currentLine = words[0];

                            for (let i = 1; i < words.length; i++) {
                                let word = words[i];
                                let width = ctx.measureText(
                                    currentLine + " " + word
                                ).width;
                                if (width < 330) {
                                    currentLine += " " + word;
                                } else {
                                    lines.push(currentLine);
                                    currentLine = word;
                                }
                            }
                            lines.push(currentLine);
                            commentlines = lines;
                        }

                        if (group.Members.length) {
                            lfmheight += group.Members.length * 25 + 30;
                        }
                        if (group.Comment) {
                            lfmheight += commentlines.length * 20 + 5;
                        }
                        if (group.AdventureActive) {
                            lfmheight += 20;
                        }
                        if (lfmheight < lfmHeight) {
                            lfmheight = lfmHeight;
                        }
                    } else {
                        lfmheight = lfmHeight;
                    }
                    top += lfmheight;
                });
        }

        return top;
    }

    React.useEffect(() => {
        if (!isImageLoaded) {
            return;
        }

        if (
            EVENT_THEME === "revels" &&
            (!isPumpkinLoaded ||
                !isWallLoaded ||
                !isWallDarkLoaded ||
                !isCobwebLoaded ||
                !isGhostLoaded)
        ) {
            return;
        }

        // Render canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });

        const sprite = spriteRef.current;
        const pumpkins = pumpkinRef.current;
        const cobweb = cobwebRef.current;
        const ghost = ghostRef.current;
        const wall = wallRef.current;
        const wallDark = wallDarkRef.current;

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

        init(ctx, sprite);

        // Draw the header
        renderPanelHeader();

        // Draw the chin
        renderPanelFooter(props.data.Groups);

        // Draw lfms
        renderPanelFiller();
        if (props.data !== null) renderGroupingPanel();

        // Draws filler
        function DrawFiller() {
            for (
                let i = 0;
                i <
                (props.data
                    ? Math.max(props.data.Groups.length, MINIMUM_LFM_COUNT)
                    : MINIMUM_LFM_COUNT);
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
                return;
            }
            let top = 72;
            props.data.Groups.filter((group) => {
                return group.Eligible || props.showNotEligible;
            }).forEach((group, index) => {
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
                    if (lfmheight < lfmHeight) {
                        lfmheight = lfmHeight;
                    }
                } else {
                    lfmheight = lfmHeight;
                }

                if (EVENT_THEME === "revels") {
                    if (group.Eligible) {
                        ctx.drawImage(wall, 26, top, 802, lfmheight);
                    } else {
                        ctx.drawImage(wallDark, 26, top, 802, lfmheight);
                    }

                    if (
                        SPOOKY_WORDS.filter((word) =>
                            group.Comment.toLowerCase().includes(word)
                        ).length ||
                        SPOOKY_AREAS.filter((word) =>
                            group.Quest?.AdventureArea?.toLowerCase().includes(
                                word
                            )
                        ).length ||
                        SPOOKY_AREAS.filter((word) =>
                            group.Leader.Location?.Name?.toLowerCase().includes(
                                word
                            )
                        ).length
                    ) {
                        ctx.globalAlpha = group.Eligible ? 1 : 0.5;
                        if (group.Leader.Name.length % 2 === 0) {
                            ctx.drawImage(
                                pumpkins,
                                0,
                                0,
                                93,
                                60,
                                280,
                                73 + lfmHeight * index + 28,
                                93,
                                60
                            );
                        } else {
                            ctx.drawImage(
                                pumpkins,
                                93,
                                0,
                                54,
                                60,
                                315,
                                73 + lfmHeight * index + 28,
                                54,
                                60
                            );
                        }
                    }

                    const COBWEB_VALUE =
                        group.Leader.Name.length + group.Quest?.Name?.length;

                    if (COBWEB_VALUE % 7 === 0) {
                        // Draw cobweb
                        ctx.globalAlpha = group.Eligible
                            ? COBWEB_VALUE % 5 === 0
                                ? 0.4
                                : 0.3
                            : 0.2;
                        if (COBWEB_VALUE % 4 === 0) {
                            ctx.drawImage(
                                cobweb,
                                0,
                                0,
                                80,
                                88,
                                525,
                                45 + lfmHeight * index + 28,
                                80,
                                88
                            );
                        } else {
                            ctx.translate(525, 45 + lfmHeight * index + 28);
                            ctx.rotate(-(90 * Math.PI) / 180);
                            ctx.drawImage(
                                cobweb,
                                0,
                                0,
                                80,
                                88,
                                -78,
                                -149,
                                80,
                                88
                            );
                            ctx.rotate((90 * Math.PI) / 180);
                            ctx.translate(-525, -(45 + lfmHeight * index + 28));
                        }
                    }

                    const GHOST_MOD = stringToInt(
                        group.Leader.Name + group.Comment
                    );
                    const GHOST_TYPE = stringToInt(
                        group.Quest?.Name || "undef"
                    );

                    // Draw ghost
                    if (GHOST_MOD % 7 === 0) {
                        ctx.globalAlpha = group.Eligible ? 0.7 : 0.5;
                        ctx.drawImage(
                            ghost,
                            GHOST_TYPE % 2 === 0 ? 90 : 0,
                            0,
                            90,
                            90,
                            (GHOST_MOD % 3) * 330 + 50,
                            45 + lfmHeight * index + 28,
                            90,
                            90
                        );
                    }

                    ctx.globalAlpha = 1;
                } else {
                    if (isFeytwisted(group)) {
                        let gradient = ctx.createLinearGradient(
                            0,
                            top,
                            panelWidth,
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

                        if (group.Eligible) {
                            gradient = ctx.createLinearGradient(
                                0,
                                top,
                                0,
                                top + lfmheight
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
                            ctx.fillRect(31, top + 5, 792, lfmheight - 10);
                        } else {
                            ctx.fillStyle = "#150a06";
                            ctx.fillRect(31, top + 5, 792, lfmheight - 10);
                        }
                    } else if (
                        group.Quest?.GroupSize === "Raid" &&
                        highlightRaids
                    ) {
                        let gradient = ctx.createLinearGradient(
                            0,
                            top,
                            panelWidth,
                            top + lfmheight
                        );
                        gradient.addColorStop(0, "#1da1a1");
                        gradient.addColorStop(1, "#1d6ca1");

                        ctx.fillStyle = gradient;
                        ctx.fillRect(26, top, 802, lfmheight);

                        if (group.Eligible) {
                            gradient = ctx.createLinearGradient(
                                0,
                                top,
                                0,
                                top + lfmheight
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

                        ctx.fillRect(31, top + 5, 792, lfmheight - 10);
                    } else if (group.Eligible) {
                        let gradient = ctx.createLinearGradient(
                            0,
                            top,
                            0,
                            top + lfmheight
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
                        ctx.fillRect(26, top, 802, lfmheight);
                    } else {
                        ctx.fillStyle = "#150a06";
                        ctx.fillRect(26, top, 802, lfmheight);
                    }
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
                    top + 18 + props.fontModifier / 2
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
                        top + 3,
                        18,
                        18
                    );
                }

                // Draw party leader's level or eligible characters
                if (
                    group.EligibleCharacters &&
                    group.EligibleCharacters.length &&
                    props.showEligibleCharacters
                ) {
                    ctx.font = `${15}px Arial`;
                    let visibleString =
                        group.EligibleCharacters[0] +
                        (group.EligibleCharacters.length > 1
                            ? `, +${group.EligibleCharacters.length - 1}`
                            : "");
                    ctx.strokeStyle = "#8fcf74";
                    ctx.fillStyle = "#8fcf74";
                    let characterWidth = ctx.measureText(visibleString).width;
                    ctx.textAlign = "right";
                    ctx.fillText(visibleString, 360, 20 + top);
                    ctx.beginPath();
                    ctx.rect(
                        360 - characterWidth - 10,
                        6 + top,
                        characterWidth + 20,
                        17
                    );
                    ctx.stroke();
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : group.Eligible
                        ? "#f6f1d3"
                        : "#988f80";
                } else {
                    ctx.font = `${15 + props.fontModifier}px Arial`;
                    ctx.textAlign = "center";
                    ctx.fillText(
                        group.Leader.TotalLevel ||
                            (group.Leader.Name === "DDO Audit" ? "99" : "0"),
                        360,
                        17 + top + props.fontModifier / 2
                    );
                }

                // Draw level range
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${16 + props.fontModifier}px Arial`;
                ctx.fillText(
                    (group.MinimumLevel || "1") +
                        " - " +
                        (group.MaximumLevel || "30"),
                    786,
                    top + lfmheight / 2
                );
                ctx.textBaseline = "alphabetic";

                // Draw member count
                if (props.expandedInfo) {
                    // Classes
                    let x = 40;
                    let y = top + 19;
                    ctx.font = "13px Arial";
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "right";
                    if (group.Leader.Classes != null)
                        for (let c = 0; c < group.Leader.Classes.length; c++) {
                            // First pass for icons
                            let xp = x + 166 + 21 * c;
                            let yp = y - 15;

                            ctx.fillStyle = "#3e4641";
                            ctx.fillRect(xp - 1, yp - 1, 20, 20);

                            let classIconPosition = getClassIconPosition(
                                group.Leader.Classes[c].Name,
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
                    if (group.Leader.Classes != null)
                        for (let c = 0; c < group.Leader.Classes.length; c++) {
                            // Second pass for levels
                            let xp = x + 166 + 21 * c;
                            let yp = y - 15;

                            ctx.fillStyle = "black";
                            ctx.fillText(
                                group.Leader.Classes[c].Level,
                                xp + 22,
                                yp + 18
                            );
                            ctx.fillStyle = "white";
                            ctx.fillText(
                                group.Leader.Classes[c].Level,
                                xp + 21,
                                yp + 17
                            );
                        }
                } else {
                    if (group.Members && props.showMemberCount) {
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
                                top + 18 + props.fontModifier / 2
                            );
                        }
                    }
                }

                // Draw quest
                if (
                    group.Quest != null &&
                    (!group.Guess || props.showQuestGuesses)
                ) {
                    const SHOW_QUEST_TIP =
                        group.Quest.Tip !== null &&
                        props.showQuestTips !== false;
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : group.Eligible
                        ? group.Guess
                            ? "#d3f6f6"
                            : "#f6f1d3"
                        : "#988f80";
                    ctx.font = `${group.Guess ? "italic " : ""}${
                        18 + props.fontModifier
                    }px Arial`;
                    ctx.textAlign = "center";
                    let textLines = wrapText(group.Quest.Name, 220);

                    if (textLines.length > 1 && SHOW_QUEST_TIP) {
                        textLines = [textLines[0]];
                        textLines[0] = textLines[0] + "...";
                    } else if (textLines.length > 2 && props.fontModifier > 0) {
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
                                i * (19 + props.fontModifier) -
                                (SHOW_QUEST_TIP ? 8 : 0)
                        );
                    }

                    // Draw quest tip
                    if (SHOW_QUEST_TIP) {
                        const questTipLines = wrapText(group.Quest.Tip, 220);
                        if (questTipLines.length > 1) {
                            questTipLines[0] += "...";
                        }
                        ctx.fillStyle = props.highVisibility
                            ? "white"
                            : group.Eligible
                            ? group.Guess
                                ? "#d3f6f6"
                                : "#f6f1d3"
                            : "#988f80";
                        ctx.font = `italic ${14 + props.fontModifier}px Arial`;
                        ctx.fillText(
                            questTipLines[0],
                            489,
                            top -
                                7 +
                                lfmheight / 2 -
                                (SHOW_QUEST_TIP ? 8 : 0) +
                                20 +
                                props.fontModifier / 2
                        );
                    }

                    if (group.CharactersOnTimer) {
                        // draw timer icon
                        ctx.drawImage(
                            sprite,
                            764,
                            189,
                            18,
                            18,
                            585,
                            top + 2,
                            18,
                            18
                        );
                    }

                    ctx.font = `${14 + props.fontModifier}px Arial`;
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : group.Eligible
                        ? group.Guess
                            ? "#d3f6f6"
                            : "#b6b193"
                        : "#95927e";
                    ctx.fillText(
                        getGroupDifficulty(group),
                        489,
                        top -
                            4 +
                            lfmheight / 2 -
                            (textLines.length -
                                1 +
                                (group.Difficulty.length > 3 ? 1 : 0) -
                                1) *
                                9 +
                            textLines.length * 19 +
                            props.fontModifier +
                            (SHOW_QUEST_TIP ? 10 : 0)
                    );
                }

                // Draw quest completion percentage
                if (
                    group.AdventureActive &&
                    group.Quest?.AverageTime &&
                    props.showCompletionPercentage
                ) {
                    // Draw timeline
                    ctx.closePath();
                    ctx.strokeStyle = "#80b6cf"; //"#02adfb";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(489 - 100, top + lfmheight - 10);
                    ctx.lineTo(489 + 100, top + lfmheight - 10);
                    ctx.closePath();
                    ctx.stroke();

                    // Draw completion bar
                    ctx.closePath();
                    ctx.strokeStyle = "#4ba4cc"; //"#02adfb";
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(394, top + lfmheight - 10);
                    // prettier-ignore
                    ctx.lineTo(394 + Math.min(170 * (group.AdventureActive / group.Quest?.AverageTime ), 190),
                        top + lfmheight - 10
                    );
                    ctx.closePath();
                    ctx.stroke();

                    // Draw average time marker
                    ctx.closePath();
                    ctx.strokeStyle = "#d48824"; //"#02adfb";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(564, top + lfmheight - 10 - 5);
                    ctx.lineTo(564, top + lfmheight - 10 + 5);
                    ctx.closePath();
                    ctx.stroke();
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
                        group.AcceptedClasses == null
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
                        37 +
                            top +
                            (props.expandedInfo ? 5 : 0) +
                            i * (19 + props.fontModifier) +
                            (props.expandedInfo
                                ? group.Members.length * 21
                                : 0) +
                            props.fontModifier * 1.5
                    );
                }

                // Draw party members
                if (props.expandedInfo && group.Members.length) {
                    ctx.beginPath();
                    ctx.strokeStyle = "white";
                    ctx.moveTo(33, top + 20);
                    ctx.lineTo(33, top + group.Members.length * 21 + 13);
                    ctx.stroke();
                    if (group.Members.length) {
                        for (let i = 0; i < group.Members.length; i++) {
                            ctx.fillStyle = props.highVisibility
                                ? "white"
                                : group.Eligible
                                ? "#f6f1d3"
                                : "#988f80";
                            ctx.font = `${15 + props.fontModifier}px Arial`;
                            ctx.textAlign = "left";
                            let member = group.Members[i];

                            let x = 40;
                            let y = top + 40 + i * 21;

                            ctx.beginPath();
                            ctx.strokeStyle = "white";
                            ctx.moveTo(33, top + 20 + i * 21 + 14);
                            ctx.lineTo(43, top + 20 + i * 21 + 14);
                            ctx.stroke();

                            // Race
                            let raceIconBounds = getRaceIconPosition(
                                member.Gender + " " + member.Race,
                                group.Eligible
                            );
                            ctx.drawImage(
                                sprite,
                                raceIconBounds[0],
                                raceIconBounds[1],
                                18,
                                18,
                                x,
                                y - 15,
                                18,
                                18
                            );

                            // Name
                            ctx.fillText(member.Name, x + 20, y);

                            // Classes
                            ctx.font = "13px Arial";
                            ctx.textBaseline = "alphabetic";
                            ctx.textAlign = "right";
                            if (member.Classes != null)
                                for (
                                    let c = 0;
                                    c < member.Classes.length;
                                    c++
                                ) {
                                    // First pass for icons
                                    let xp = x + 166 + 21 * c;
                                    let yp = y - 15;

                                    ctx.fillStyle = "#3e4641";
                                    ctx.fillRect(xp - 1, yp - 1, 20, 20);

                                    let classIconPosition =
                                        getClassIconPosition(
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
                            if (member.Classes != null)
                                for (
                                    let c = 0;
                                    c < member.Classes.length;
                                    c++
                                ) {
                                    // Second pass for levels
                                    let xp = x + 166 + 21 * c;
                                    let yp = y - 15;

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
                        }
                    }
                }

                // Draw active time
                if (
                    group.AdventureActive != null &&
                    group.AdventureActive !== 0
                ) {
                    let modifiedaatime = Math.max(group.AdventureActive, 60);
                    ctx.fillStyle = props.highVisibility
                        ? "#5fcafc"
                        : "#02adfb";
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
                if (attemptedJoin !== null) {
                    DrawJoinRequestOverlay(
                        props.data.Groups[groupSelection.groupIndex],
                        attemptedJoin.cursorPosition
                    );
                }
            }
        }

        function DrawPlayerOverlay(group, cursorPosition) {
            const SHOW_GUILD_NAME = props.showGuildNames;
            const GUILD_NAME_HEIGHT = 15;

            if (group === null) return;

            let estimatedBottom =
                cursorPosition[1] +
                3 +
                (group.Members.length + 1) *
                    (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
                26;
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

            // Each player in the party is 41px in height (+15 for guild name)
            let memberList = [group.Leader, ...group.Members];
            if (memberList !== null) {
                memberList.forEach((member, i) => {
                    ctx.drawImage(
                        sprite,
                        0,
                        191,
                        287,
                        41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0),
                        cursorPosition[0],
                        cursorPosition[1] +
                            2 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i,
                        287,
                        41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)
                    );
                    let grad = ctx.createLinearGradient(
                        0,
                        cursorPosition[1] +
                            2 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i,
                        0,
                        cursorPosition[1] +
                            2 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                (i + 1)
                    );
                    grad.addColorStop(0, "#404947");
                    grad.addColorStop(0.25, "#4d5955");
                    grad.addColorStop(0.75, "#4d5955");
                    grad.addColorStop(1, "#404947");
                    ctx.fillStyle = grad;
                    ctx.fillRect(
                        cursorPosition[0] + 4,
                        cursorPosition[1] +
                            3 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i,
                        269,
                        39 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)
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
                        cursorPosition[1] +
                            2 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i,
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
                        cursorPosition[1] +
                            3 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i +
                            10
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
                            cursorPosition[1] +
                                3 +
                                (41 +
                                    (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                    i,
                            17,
                            18
                        );
                    }

                    // Guild name
                    if (SHOW_GUILD_NAME) {
                        ctx.fillStyle = "#b6b193";
                        ctx.font = `${
                            member.Guild === "" ? "italic " : ""
                        }15px 'Trebuchet MS'`;
                        ctx.textAlign = "left";
                        let wrappedguildname = wrapText(member.Guild, 200);
                        const truncatedGuildName =
                            wrappedguildname[0] +
                            (wrappedguildname.length > 1 ? "..." : "");
                        ctx.fillText(
                            truncatedGuildName || "No guild",
                            cursorPosition[0] + 26,
                            cursorPosition[1] +
                                3 +
                                (41 +
                                    (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                    i +
                                28
                        );
                        ctx.fillStyle = "#f6f1d3";
                    }

                    // Location
                    if (member.Location != null) {
                        let wrappedlocation = wrapText(
                            member.Location.Name,
                            230
                        );
                        ctx.font = 12 + "px 'Trebuchet MS'";
                        ctx.textAlign = "center";
                        ctx.fillText(
                            wrappedlocation[0] +
                                (wrappedlocation.length > 1 ? "..." : ""),
                            cursorPosition[0] + 102,
                            cursorPosition[1] +
                                3 +
                                (41 +
                                    (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                    i +
                                30 +
                                (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)
                        );
                    }

                    // Level
                    ctx.textAlign = "center";
                    ctx.font = 17 + fontModifier + "px Arial"; // 15px
                    ctx.fillText(
                        member.TotalLevel,
                        cursorPosition[0] + 4 + 256,
                        cursorPosition[1] +
                            3 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i +
                            11
                    );

                    // Classes
                    ctx.font = "13px Arial";
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "right";
                    if (
                        member.Classes !== null &&
                        member.Classes !== undefined
                    ) {
                        for (let c = 0; c < member.Classes.length; c++) {
                            if (
                                member.Classes[c].Name !== "Epic" &&
                                member.Classes[c].Name !== "Legendary"
                            ) {
                                // First pass for icons
                                let xp = cursorPosition[0] + 166 + 21 * c;
                                let yp =
                                    cursorPosition[1] +
                                    4 +
                                    (41 +
                                        (SHOW_GUILD_NAME
                                            ? GUILD_NAME_HEIGHT
                                            : 0)) *
                                        i;

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
                        }
                    }
                    if (
                        member.Classes !== null &&
                        member.Classes !== undefined
                    ) {
                        for (let c = 0; c < member.Classes.length; c++) {
                            if (
                                member.Classes[c].Name !== "Epic" &&
                                member.Classes[c].Name !== "Legendary"
                            ) {
                                // Second pass for levels
                                let xp = cursorPosition[0] + 166 + 21 * c;
                                let yp =
                                    cursorPosition[1] +
                                    4 +
                                    (41 +
                                        (SHOW_GUILD_NAME
                                            ? GUILD_NAME_HEIGHT
                                            : 0)) *
                                        i;

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
                        }
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
                cursorPosition[1] +
                    2 +
                    memberList.length *
                        (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)),
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
                        memberList.length *
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
                        i * (19 + (fontModifier < 0 ? -3 : 0)),
                    287,
                    23
                );
                ctx.fillText(
                    textLines[i],
                    cursorPosition[0] + 4,
                    cursorPosition[1] +
                        memberList.length *
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
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
                    memberList.length *
                        (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
                    textLines.length * (19 + (fontModifier < 0 ? -3 : 0)) +
                    (fontModifier < 0 ? 4 : 3),
                287,
                3
            );
        }

        function DrawQuestOverlay(group, cursorPosition) {
            if (group === null) return;
            if (group.Quest == null) return;

            let estimatedBottom =
                cursorPosition[1] +
                3 +
                170 +
                26 +
                (group.CharactersOnTimer
                    ? group.CharactersOnTimer.length * 20 + 15
                    : 0) +
                (group.Guess && props.showQuestGuesses ? 60 : 0);
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

            // raid timers
            if (group.CharactersOnTimer && group.CharactersOnTimer.length > 0) {
                ctx.fillStyle = "#f6d3d3";
                drawOverlayBackground(row);
                drawOverlayTitle("Raid timers", row);
                group.CharactersOnTimer.forEach((character) => {
                    let wrapped = wrapText(
                        `${character.Name} (${getTimeTillEnd(
                            character,
                            group.Quest.Name
                        )})`,
                        220
                    );
                    for (let i = 0; i < wrapped.length; i++) {
                        if (i > 0) drawOverlayBackground(row);
                        drawOverlayInfo(wrapped[i], row);
                        row++;
                        drawOverlayBackground(row);
                    }
                });
                row++;
                ctx.fillStyle = "white";
            }

            if (group.Guess && props.showQuestGuesses) {
                ctx.fillStyle = "#d3f6f6";
                drawOverlayBackground(row);
                ctx.textAlign = "center";
                ctx.font = "italic 15px Arial";
                ctx.fillText(
                    "The leader has not selected a quest.",
                    cursorPosition[0] + 175,
                    cursorPosition[1] + 3 + 20 * row - 6
                );
                row++;

                drawOverlayBackground(row);
                ctx.fillText(
                    "This is the quest we think they're running",
                    cursorPosition[0] + 175,
                    cursorPosition[1] + 3 + 20 * row - 6
                );
                row++;
                drawOverlayBackground(row);
                ctx.fillText(
                    "based on their location and comment.",
                    cursorPosition[0] + 175,
                    cursorPosition[1] + 3 + 20 * row - 6
                );
                row++;
                ctx.fillStyle = "white";
            }

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

            if (quest.AdventureArea) {
                drawOverlayBackground(row);
                drawOverlayTitle("Takes place in", row);
                let wrapped = wrapText(quest.AdventureArea, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            if (quest.QuestJournalGroup) {
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
                quest.RequiredAdventurePack || "Free to play",
                220
            );
            for (let i = 0; i < wrapped.length; i++) {
                if (i > 0) drawOverlayBackground(row);
                drawOverlayInfo(wrapped[i], row);
                row++;
            }

            if (quest.Patron) {
                drawOverlayBackground(row);
                drawOverlayTitle("Patron", row);
                drawOverlayInfo(quest.Patron ?? "", row);
                row++;
            }

            if (quest.AverageTime) {
                drawOverlayBackground(row);
                drawOverlayTitle("Average time", row);
                drawOverlayInfo(
                    `${Math.round(quest.AverageTime / 60)} minutes`,
                    row
                );
                row++;
            }

            drawOverlayBackground(row);
            row++;
            drawOverlayBackground(row);
            ctx.textAlign = "center";
            ctx.font = "italic 15px Arial";
            ctx.fillText(
                "Double-click to open the Wiki page",
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

            function getTimeTillEnd(character, questName) {
                let raid = character.RaidActivity.filter((raid) =>
                    questName.toLowerCase().includes(raid.name.toLowerCase())
                );
                if (raid.length > 0) {
                    raid = raid[0];
                } else {
                    return "Unknown";
                }

                let remainingMinutes = raid.remaining;
                const timeInDays = Math.floor(
                    remainingMinutes / (60 * 60 * 24)
                );
                remainingMinutes = remainingMinutes % (60 * 60 * 24);
                const timeInHours = Math.floor(remainingMinutes / (60 * 60));
                remainingMinutes = remainingMinutes % (60 * 60);
                const timeInMinutes = Math.floor(remainingMinutes / 60);
                let returnStringArray = [];
                if (timeInDays != 0) {
                    returnStringArray.push(`${timeInDays}d`);
                }
                if (timeInHours != 0) {
                    returnStringArray.push(`${timeInHours}h`);
                }
                if (timeInMinutes != 0) {
                    returnStringArray.push(`${timeInMinutes}m`);
                }

                return returnStringArray.join(", ");
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

        function DrawJoinRequestOverlay(group, cursorPosition) {
            ctx.font = `${18 + props.fontModifier}px 'Trebuchet MS'`;
            let displayText = JOIN_REQUEST_MESSAGES[
                Math.floor(Math.random() * JOIN_REQUEST_MESSAGES.length)
            ].replace("{0}", group.Leader?.Name);
            let textWidth = ctx.measureText(displayText).width;
            let bounds = {
                x: Math.max(30, cursorPosition[0] - textWidth / 2),
                y: cursorPosition[1] - 20,
                w: textWidth + 20,
                h: 40,
            };
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "#000000";
            ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
            ctx.fillStyle = "#ffffff";
            ctx.lineWidth = "2";
            ctx.beginPath();
            ctx.rect(bounds.x, bounds.y, bounds.w, bounds.h);
            ctx.stroke();
            ctx.globalAlpha = 1;

            ctx.fillStyle = "#f9f3d7";
            ctx.textAlign = "center";
            ctx.fillText(
                displayText,
                bounds.x + bounds.w / 2,
                bounds.y + bounds.h / 2
            );
        }

        function stringToInt(string, mod = 1) {
            if (string == null) return 0;
            let total = 0;
            for (let i = 0; i < string.length; i++) {
                total += string.charCodeAt(i) * (i * mod);
            }
            return total;
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

            let skullpattern1 = /\br(\d+\+?)[\b]?/;
            let skullpattern2 = /reaper (\d+\+?)/;
            let skullpattern3 = /(\d+\+?) skull/;
            let skullpattern4 = /\b(r\+)[\b]?/;

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
                group.Quest?.RequiredAdventurePack.toLowerCase().includes(
                    "feywild"
                )
            )
                return true;
            return false;
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
                case "Legendary":
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
        props.showCompletionPercentage,
        props.showMemberCount,
        props.showQuestGuesses,
        props.showQuestTips,
        attemptedJoin,
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
                onLoad={() => setIsImageLoaded(true)}
                style={{ display: "none" }}
            />
            {EVENT_THEME === "revels" && (
                <img
                    ref={pumpkinRef}
                    src={PumpkinSprite}
                    onLoad={() => setIsPumpkinLoaded(true)}
                    style={{ display: "none" }}
                />
            )}
            {EVENT_THEME === "revels" && (
                <img
                    ref={cobwebRef}
                    src={CobwebSprite}
                    onLoad={() => setIsCobwebLoaded(true)}
                    style={{ display: "none" }}
                />
            )}
            {EVENT_THEME === "revels" && (
                <img
                    ref={ghostRef}
                    src={GhostSprite}
                    onLoad={() => setIsGhostLoaded(true)}
                    style={{ display: "none" }}
                />
            )}
            {EVENT_THEME === "revels" && (
                <img
                    ref={wallRef}
                    src={WallSprite}
                    onLoad={() => setIsWallLoaded(true)}
                    style={{ display: "none" }}
                />
            )}
            {EVENT_THEME === "revels" && (
                <img
                    ref={wallDarkRef}
                    src={WallDarkSprite}
                    onLoad={() => setIsWallDarkLoaded(true)}
                    style={{ display: "none" }}
                />
            )}
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
                    (props.data
                        ? Math.max(
                              computePanelHeight(props.data.Groups),
                              MINIMUM_LFM_COUNT * lfmHeight
                          )
                        : MINIMUM_LFM_COUNT * lfmHeight) + 99
                }
            />
        </div>
    );
};

export default CanvasLfmPanel;
