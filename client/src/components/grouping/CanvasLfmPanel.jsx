import React from "react";
import PanelSprite from "../../assets/global/lfmsprite_v3.jpg";
import PumpkinSprite from "../../assets/global/pumpkins.png";
import CobwebSprite from "../../assets/global/cobweb.png";
import GhostSprite from "../../assets/global/ghosts.png";
import WallSprite from "../../assets/global/stone_wall.jpg";
import WallDarkSprite from "../../assets/global/stone_wall_dark.jpg";
import NAMES from "../../constants/ClemeitNames";

const CanvasLfmPanel = (props) => {
    // Assume that incoming props.data is already filtered according to user preferences
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);
    const MINIMUM_LFM_COUNT = 8;

    const EVENT_THEME = isSpookyTime();
    const pumpkinRef = React.useRef(null);
    const cobwebRef = React.useRef(null);
    const ghostRef = React.useRef(null);
    const wallRef = React.useRef(null);
    const wallDarkRef = React.useRef(null);

    const JOIN_REQUEST_MESSAGES = [
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
    // let [selectedlfmIndex, set_selectedlfmIndex] = React.useState(-1);
    // let [cursorPosition, set_cursorPosition] = React.useState([0, 0]);
    let [lfmSelection, setLfmSelection] = React.useState({
        lfmIndex: -1,
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

    const PANEL_WIDTH = 848;
    const LFM_HEIGHT = 90;
    const CLASS_COUNT = 15;
    let lastclickRef = React.useRef(0);

    function isSpookyTime() {
        let dt = new Date();
        if (dt.getMonth() === 9 && dt.getDate() >= 1) {
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
            setLfmSelection({ ...lfmSelection, lfmIndex: -1 });
            // drawPanel();
            return;
        }
        if (x < 30) {
            setLfmSelection({ ...lfmSelection, lfmIndex: -1 });
            // drawPanel();
            return;
        }

        let index = Math.floor((y - 72) / 90);
        // if (lfmSelection.lfmIndex === index) {
        //     if (x < 375 && lastSide === "left") return;
        //     else if (x > 375 && lastSide === "right") return;
        // }

        // Double click the quest
        if (e.type === "click" && x > 375 && x < 605) {
            if (
                e.timeStamp - lastclickRef.current.timeStamp < 500 &&
                Math.abs(e.clientY - lastclickRef.current.clientY) < 10
            ) {
                setLfmSelection({
                    lfmIndex: index,
                    cursorPosition: [x, y],
                    side: "right",
                    doubleClick: true,
                });
                return;
            }
            lastclickRef.current = e;
        }

        // Double click an lfm
        if (e.type === "click" && x > 30 && x < 375) {
            if (
                e.timeStamp - lastclickRef.current.timeStamp < 500 &&
                Math.abs(e.clientY - lastclickRef.current.clientY) < 10
            ) {
                let displayText =
                    JOIN_REQUEST_MESSAGES[
                        Math.floor(Math.random() * JOIN_REQUEST_MESSAGES.length)
                    ];
                setAttemptedJoin({
                    lfmIndex: index,
                    cursorPosition: [x, y],
                    timeStamp: e.timeStamp,
                    displayText: displayText,
                });
                return;
            }
            lastclickRef.current = e;
        }

        // Clear attempted join
        if (
            attemptedJoinRef.current !== null &&
            attemptedJoinRef.current.lfmIndex !== index
        ) {
            setAttemptedJoin(null);
        }

        let side = "";
        if (x < 375) side = "left";
        else if (x > 375) side = "right";

        setLfmSelection({
            lfmIndex: index,
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
        canvasRef.current.addEventListener("click", HandleMouseOnCanvas);
        canvasRef.current.addEventListener("mouseleave", () => {
            clearTimeout(overlayTimeout);
            setLfmSelection({ ...lfmSelection, lfmIndex: -1 });
            setAttemptedJoin(null);
        });
    }, [canvasRef]);

    function computePanelHeight(lfms) {
        let top = 0;

        if (lfms) {
            lfms.filter((group) => {
                return group.eligible || props.showNotEligible;
            }).forEach((group, index) => {
                let lfmheight = 0;
                if (props.expandedInfo) {
                    let commentlines = [];
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d", { alpha: false });

                    if (group.comment != null) {
                        let words = group.comment.split(" ");
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

                    if (group.members.length) {
                        lfmheight += group.members.length * 25 + 30;
                    }
                    if (group.comment) {
                        lfmheight += commentlines.length * 20 + 5;
                    }
                    if (group.adventure_active_time) {
                        lfmheight += 20;
                    }
                    if (lfmheight < LFM_HEIGHT) {
                        lfmheight = LFM_HEIGHT;
                    }
                } else {
                    lfmheight = LFM_HEIGHT;
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

        if (lfmSelection.doubleClick) {
            if (
                lfmSelection.lfmIndex !== -1 &&
                lfmSelection.lfmIndex < props.data.lfms.length
            ) {
                let lfm = props.data.lfms[lfmSelection.lfmIndex];
                if (lfm.quest != null) {
                    window.open(
                        "https://ddowiki.com/page/" +
                            lfm.quest.name.replace(/ /g, "_"),
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

        // Draws the header and the last_updated string
        function OpenPanel() {
            ctx.drawImage(sprite, 0, 0, 848, 72, 0, 0, 848, 72);
            if (props.data) {
                let last_updated = new Date(props.data.last_updated * 1000);
                let hour = last_updated.getHours() % 12;
                if (hour == 0) hour = 12;
                let timeText =
                    "Last updated " +
                    hour +
                    ":" +
                    ("0" + last_updated.getMinutes()).slice(-2) +
                    ":" +
                    ("0" + last_updated.getSeconds()).slice(-2) +
                    (Math.floor(last_updated.getHours() / 12) == 0
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
            if (props.sortAscending) {
                // 0, 259  |  30x10 DESC | 746, 55
                ctx.drawImage(sprite, 30, 259, 30, 10, 746, 55, 30, 10);
            } else {
                ctx.drawImage(sprite, 0, 259, 30, 10, 746, 55, 30, 10);
            }
        }

        // Draws the chin
        function ClosePanel() {
            let yPos = 72;
            if (props.data) {
                yPos += Math.max(
                    computePanelHeight(props.data.lfms),
                    MINIMUM_LFM_COUNT * LFM_HEIGHT
                );
            } else {
                yPos += MINIMUM_LFM_COUNT * LFM_HEIGHT;
            }

            ctx.drawImage(sprite, 0, 162, 848, 27, 0, yPos, 848, 27);
        }

        // Draws filler
        function DrawFiller() {
            for (
                let i = 0;
                i <
                (props.data
                    ? Math.max(props.data.lfms.length, MINIMUM_LFM_COUNT)
                    : MINIMUM_LFM_COUNT);
                i++
            ) {
                ctx.drawImage(
                    sprite,
                    0,
                    72,
                    848,
                    LFM_HEIGHT,
                    0,
                    72 + i * LFM_HEIGHT,
                    848,
                    LFM_HEIGHT
                );
            }
        }

        function DrawLfms() {
            if (props.data === null) {
                return;
            }
            if (props.data.lfm_count > 0 && props.data.lfms.length === 0) {
                ctx.font = `italic ${20 + props.fontModifier}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = props.highVisibility ? "white" : "#f6f1d3";
                let templateString =
                    "{0} group{1} been hidden by your filter settings";
                let string = templateString
                    .replace("{0}", props.data.lfm_count)
                    .replace(
                        "{1}",
                        props.data.lfm_count > 1 ? "s have" : " has"
                    );
                ctx.fillText(string, 424, 72 + 45);
                return;
            }
            let top = 72;
            props.data.lfms
                .filter((lfm) => {
                    return lfm.eligible || props.showNotEligible;
                })
                .forEach((lfm, index) => {
                    // Draw background and borders
                    let commentLines = wrapText(lfm.comment, 330);
                    let lfmHeight = 0;
                    if (props.expandedInfo) {
                        if (lfm.members.length) {
                            lfmHeight += lfm.members.length * 25 + 30;
                        }
                        if (lfm.comment) {
                            lfmHeight += commentLines.length * 20 + 5;
                        }
                        if (lfm.adventure_active_time) {
                            lfmHeight += 20;
                        }
                        if (lfmHeight < LFM_HEIGHT) {
                            lfmHeight = LFM_HEIGHT;
                        }
                    } else {
                        lfmHeight = LFM_HEIGHT;
                    }

                    if (EVENT_THEME === "revels") {
                        if (lfm.eligible) {
                            ctx.drawImage(wall, 26, top, 802, lfmHeight);
                        } else {
                            ctx.drawImage(wallDark, 26, top, 802, lfmHeight);
                        }

                        if (
                            SPOOKY_WORDS.filter((word) =>
                                lfm.comment.toLowerCase().includes(word)
                            ).length ||
                            SPOOKY_AREAS.filter((word) =>
                                lfm.quest?.adventure_area
                                    ?.toLowerCase()
                                    .includes(word)
                            ).length ||
                            SPOOKY_AREAS.filter((word) =>
                                lfm.leader.location?.name
                                    ?.toLowerCase()
                                    .includes(word)
                            ).length
                        ) {
                            ctx.globalAlpha = lfm.eligible ? 1 : 0.5;
                            if (lfm.leader.name.length % 2 === 0) {
                                ctx.drawImage(
                                    pumpkins,
                                    0,
                                    0,
                                    93,
                                    60,
                                    280,
                                    73 + LFM_HEIGHT * index + 28,
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
                                    73 + LFM_HEIGHT * index + 28,
                                    54,
                                    60
                                );
                            }
                        }

                        const COBWEB_VALUE =
                            lfm.leader.name.length + lfm.quest?.name?.length;

                        if (COBWEB_VALUE % 7 === 0) {
                            // Draw cobweb
                            ctx.globalAlpha = lfm.eligible
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
                                    45 + LFM_HEIGHT * index + 28,
                                    80,
                                    88
                                );
                            } else {
                                ctx.translate(
                                    525,
                                    45 + LFM_HEIGHT * index + 28
                                );
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
                                ctx.translate(
                                    -525,
                                    -(45 + LFM_HEIGHT * index + 28)
                                );
                            }
                        }

                        const GHOST_MOD = stringToInt(
                            lfm.leader.name + lfm.comment
                        );
                        const GHOST_TYPE = stringToInt(
                            lfm.quest?.name || "undef"
                        );

                        // Draw ghost
                        if (GHOST_MOD % 7 === 0) {
                            ctx.globalAlpha = lfm.eligible ? 0.7 : 0.5;
                            ctx.drawImage(
                                ghost,
                                GHOST_TYPE % 2 === 0 ? 90 : 0,
                                0,
                                90,
                                90,
                                (GHOST_MOD % 3) * 330 + 50,
                                45 + LFM_HEIGHT * index + 28,
                                90,
                                90
                            );
                        }

                        ctx.globalAlpha = 1;
                    } else {
                        if (isFeytwisted(lfm)) {
                            let gradient = ctx.createLinearGradient(
                                0,
                                top,
                                PANEL_WIDTH,
                                top + lfmHeight
                            );
                            gradient.addColorStop(0, "#a11d1d");
                            gradient.addColorStop(0.2, "#a1a11d");
                            gradient.addColorStop(0.4, "#1da11f");
                            gradient.addColorStop(0.6, "#1d9aa1");
                            gradient.addColorStop(0.8, "#1d1da1");
                            gradient.addColorStop(1, "#8f1da1");

                            ctx.fillStyle = gradient;
                            ctx.fillRect(26, top, 802, lfmHeight);

                            if (lfm.eligible) {
                                gradient = ctx.createLinearGradient(
                                    0,
                                    top,
                                    0,
                                    top + lfmHeight
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
                                ctx.fillRect(31, top + 5, 792, lfmHeight - 10);
                            } else {
                                ctx.fillStyle = "#150a06";
                                ctx.fillRect(31, top + 5, 792, lfmHeight - 10);
                            }
                        } else if (
                            lfm.quest?.group_size === "Raid" &&
                            highlightRaids
                        ) {
                            let gradient = ctx.createLinearGradient(
                                0,
                                top,
                                PANEL_WIDTH,
                                top + lfmHeight
                            );
                            gradient.addColorStop(0, "#1da1a1");
                            gradient.addColorStop(1, "#1d6ca1");

                            ctx.fillStyle = gradient;
                            ctx.fillRect(26, top, 802, lfmHeight);

                            if (lfm.eligible) {
                                gradient = ctx.createLinearGradient(
                                    0,
                                    top,
                                    0,
                                    top + lfmHeight
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

                            ctx.fillRect(31, top + 5, 792, lfmHeight - 10);
                        } else if (lfm.eligible) {
                            let gradient = ctx.createLinearGradient(
                                0,
                                top,
                                0,
                                top + lfmHeight
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
                            ctx.fillRect(26, top, 802, lfmHeight);
                        } else {
                            ctx.fillStyle = "#150a06";
                            ctx.fillRect(26, top, 802, lfmHeight);
                        }
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = "#8f8d74";
                    ctx.lineWidth = 1;
                    ctx.rect(26, top, 802, lfmHeight);
                    ctx.stroke();

                    ctx.moveTo(375, top);
                    ctx.lineTo(375, top + lfmHeight);
                    ctx.stroke();

                    ctx.moveTo(605, top);
                    ctx.lineTo(605, top + lfmHeight);
                    ctx.stroke();

                    ctx.moveTo(742, top);
                    ctx.lineTo(742, top + lfmHeight);
                    ctx.stroke();

                    // Draw party leader's name
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : lfm.eligible
                        ? "#f6f1d3"
                        : "#988f80";
                    ctx.textBaseline = "alphabetic";
                    ctx.font = `${18 + props.fontModifier}px 'Trebuchet MS'`;
                    ctx.textAlign = "left";
                    ctx.fillText(
                        lfm.leader.name,
                        49,
                        top + 18 + props.fontModifier / 2
                    );
                    let leaderWidth = ctx.measureText(lfm.leader.name).width;
                    if (
                        NAMES.some((name) => lfm.leader.name.startsWith(name))
                    ) {
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
                        lfm.eligible_characters &&
                        lfm.eligible_characters.length &&
                        props.showEligibleCharacters
                    ) {
                        ctx.font = `${15}px Arial`;
                        let visibleString =
                            lfm.eligible_characters[0] +
                            (lfm.eligible_characters.length > 1
                                ? `, +${lfm.eligible_characters.length - 1}`
                                : "");
                        ctx.strokeStyle = "#8fcf74";
                        ctx.fillStyle = "#8fcf74";
                        let characterWidth =
                            ctx.measureText(visibleString).width;
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
                            : lfm.eligible
                            ? "#f6f1d3"
                            : "#988f80";
                    } else {
                        ctx.font = `${15 + props.fontModifier}px Arial`;
                        ctx.textAlign = "center";
                        ctx.fillText(
                            lfm.leader.total_level ||
                                (lfm.leader.name === "DDO Audit" ? "99" : "0"),
                            360,
                            17 + top + props.fontModifier / 2
                        );
                    }

                    // Draw level range
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = `${16 + props.fontModifier}px Arial`;
                    ctx.fillText(
                        (lfm.minimum_level || "1") +
                            " - " +
                            (lfm.maximum_level || "30"),
                        786,
                        top + lfmHeight / 2
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
                        if (lfm.leader.classes != null)
                            for (
                                let c = 0;
                                c < lfm.leader.classes.length;
                                c++
                            ) {
                                // First pass for icons
                                let xp = x + 166 + 21 * c;
                                let yp = y - 15;

                                ctx.fillStyle = "#3e4641";
                                ctx.fillRect(xp - 1, yp - 1, 20, 20);

                                let classIconPosition = getClassIconPosition(
                                    lfm.leader.classes[c].name,
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
                        if (lfm.leader.classes != null)
                            for (
                                let c = 0;
                                c < lfm.leader.classes.length;
                                c++
                            ) {
                                // Second pass for levels
                                let xp = x + 166 + 21 * c;
                                let yp = y - 15;

                                ctx.fillStyle = "black";
                                ctx.fillText(
                                    lfm.leader.classes[c].level,
                                    xp + 22,
                                    yp + 18
                                );
                                ctx.fillStyle = "white";
                                ctx.fillText(
                                    lfm.leader.classes[c].level,
                                    xp + 21,
                                    yp + 17
                                );
                            }
                    } else {
                        if (lfm.members && props.showMemberCount) {
                            if (lfm.members.length > 0) {
                                ctx.fillStyle = props.highVisibility
                                    ? "white"
                                    : lfm.eligible
                                    ? "#b6b193"
                                    : "#95927e";
                                ctx.textAlign = "left";
                                ctx.fillText(
                                    "(" +
                                        (lfm.members.length + 1) +
                                        " members)",
                                    49 + leaderWidth + 4,
                                    top + 18 + props.fontModifier / 2
                                );
                            }
                        }
                    }

                    // Draw quest
                    if (
                        lfm.quest != null &&
                        (!lfm.is_quest_guess || props.showQuestGuesses)
                    ) {
                        const SHOW_QUEST_TIP =
                            lfm.quest.tip != null &&
                            props.showQuestTips !== false;
                        ctx.fillStyle = props.highVisibility
                            ? "white"
                            : lfm.eligible
                            ? lfm.is_quest_guess
                                ? "#d3f6f6"
                                : "#f6f1d3"
                            : "#988f80";
                        ctx.font = `${lfm.is_quest_guess ? "italic " : ""}${
                            18 + props.fontModifier
                        }px Arial`;
                        ctx.textAlign = "center";
                        let textLines = wrapText(lfm.quest.name, 220);

                        if (textLines.length > 1 && SHOW_QUEST_TIP) {
                            textLines = [textLines[0]];
                            textLines[0] = textLines[0] + "...";
                        } else if (
                            textLines.length > 2 &&
                            props.fontModifier > 0
                        ) {
                            textLines = textLines.slice(0, 2);
                            textLines[1] = textLines[1] + "...";
                        }

                        for (let i = 0; i < textLines.length; i++) {
                            ctx.fillText(
                                textLines[i],
                                489,
                                top -
                                    7 +
                                    lfmHeight / 2 -
                                    (textLines.length -
                                        1 +
                                        (lfm.difficulty.length > 3 ? 1 : 0) -
                                        1) *
                                        9 +
                                    i * (19 + props.fontModifier) -
                                    (SHOW_QUEST_TIP ? 8 : 0)
                            );
                        }

                        // Draw quest tip
                        if (SHOW_QUEST_TIP) {
                            const questTipLines = wrapText(lfm.quest.tip, 220);
                            if (questTipLines.length > 1) {
                                questTipLines[0] += "...";
                            }
                            ctx.fillStyle = props.highVisibility
                                ? "white"
                                : lfm.eligible
                                ? lfm.is_quest_guess
                                    ? "#d3f6f6"
                                    : "#f6f1d3"
                                : "#988f80";
                            ctx.font = `italic ${
                                14 + props.fontModifier
                            }px Arial`;
                            ctx.fillText(
                                questTipLines[0],
                                489,
                                top -
                                    7 +
                                    lfmHeight / 2 -
                                    (SHOW_QUEST_TIP ? 8 : 0) +
                                    20 +
                                    props.fontModifier / 2
                            );
                        }

                        if (lfm.characters_on_timer) {
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
                            : lfm.eligible
                            ? lfm.is_quest_guess
                                ? "#d3f6f6"
                                : "#b6b193"
                            : "#95927e";
                        ctx.fillText(
                            getGroupDifficulty(lfm),
                            489,
                            top -
                                4 +
                                lfmHeight / 2 -
                                (textLines.length -
                                    1 +
                                    (lfm.difficulty.length > 3 ? 1 : 0) -
                                    1) *
                                    9 +
                                textLines.length * 19 +
                                props.fontModifier +
                                (SHOW_QUEST_TIP ? 10 : 0)
                        );
                    }

                    // Draw quest completion percentage
                    if (
                        lfm.adventure_active_time &&
                        lfm.quest?.average_time &&
                        props.showCompletionPercentage
                    ) {
                        // Draw timeline
                        ctx.closePath();
                        ctx.strokeStyle = "#80b6cf"; //"#02adfb";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(489 - 100, top + lfmHeight - 10);
                        ctx.lineTo(489 + 100, top + lfmHeight - 10);
                        ctx.closePath();
                        ctx.stroke();

                        // Draw completion bar
                        ctx.closePath();
                        ctx.strokeStyle = "#4ba4cc"; //"#02adfb";
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.moveTo(394, top + lfmHeight - 10);
                        // prettier-ignore
                        ctx.lineTo(394 + Math.min(170 * (lfm.adventure_active_time / lfm.quest?.average_time ), 190),
                        top + lfmHeight - 10
                    );
                        ctx.closePath();
                        ctx.stroke();

                        // Draw average time marker
                        ctx.closePath();
                        ctx.strokeStyle = "#d48824"; //"#02adfb";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(564, top + lfmHeight - 10 - 5);
                        ctx.lineTo(564, top + lfmHeight - 10 + 5);
                        ctx.closePath();
                        ctx.stroke();
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
                    if (
                        !lfm.hasOwnProperty("accepted_classes") ||
                        lfm.accepted_classes === null
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
                        if (lfm.accepted_classes.length === CLASS_COUNT) {
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
                    ctx.fillStyle = props.highVisibility
                        ? "white"
                        : lfm.eligible
                        ? "#bfbfbf"
                        : "#7f7472";
                    ctx.font = `${15 + props.fontModifier}px Arial`;
                    ctx.textAlign = "left";
                    let textLines = wrapText(lfm.comment, 330);
                    if (
                        lfm.adventure_active_time !== 0 &&
                        lfm.adventure_active_time !== undefined
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
                                    ? lfm.members.length * 21
                                    : 0) +
                                props.fontModifier * 1.5
                        );
                    }

                    // Draw party members
                    if (props.expandedInfo && lfm.members.length) {
                        ctx.beginPath();
                        ctx.strokeStyle = "white";
                        ctx.moveTo(33, top + 20);
                        ctx.lineTo(33, top + lfm.members.length * 21 + 13);
                        ctx.stroke();
                        if (lfm.members.length) {
                            for (let i = 0; i < lfm.members.length; i++) {
                                ctx.fillStyle = props.highVisibility
                                    ? "white"
                                    : lfm.eligible
                                    ? "#f6f1d3"
                                    : "#988f80";
                                ctx.font = `${15 + props.fontModifier}px Arial`;
                                ctx.textAlign = "left";
                                let member = lfm.members[i];

                                let x = 40;
                                let y = top + 40 + i * 21;

                                ctx.beginPath();
                                ctx.strokeStyle = "white";
                                ctx.moveTo(33, top + 20 + i * 21 + 14);
                                ctx.lineTo(43, top + 20 + i * 21 + 14);
                                ctx.stroke();

                                // Race
                                let raceIconBounds = getRaceIconPosition(
                                    member.gender + " " + member.race,
                                    lfm.eligible
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
                                ctx.fillText(member.name, x + 20, y);

                                // Classes
                                ctx.font = "13px Arial";
                                ctx.textBaseline = "alphabetic";
                                ctx.textAlign = "right";
                                if (member.classes != null)
                                    for (
                                        let c = 0;
                                        c < member.classes.length;
                                        c++
                                    ) {
                                        // First pass for icons
                                        let xp = x + 166 + 21 * c;
                                        let yp = y - 15;

                                        ctx.fillStyle = "#3e4641";
                                        ctx.fillRect(xp - 1, yp - 1, 20, 20);

                                        let classIconPosition =
                                            getClassIconPosition(
                                                member.classes[c].name,
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
                                if (member.classes != null)
                                    for (
                                        let c = 0;
                                        c < member.classes.length;
                                        c++
                                    ) {
                                        // Second pass for levels
                                        let xp = x + 166 + 21 * c;
                                        let yp = y - 15;

                                        ctx.fillStyle = "black";
                                        ctx.fillText(
                                            member.classes[c].Level,
                                            xp + 22,
                                            yp + 18
                                        );
                                        ctx.fillStyle = "white";
                                        ctx.fillText(
                                            member.classes[c].Level,
                                            xp + 21,
                                            yp + 17
                                        );
                                    }
                            }
                        }
                    }

                    // Draw active time
                    if (
                        lfm.adventure_active_time != null &&
                        lfm.adventure_active_time !== 0
                    ) {
                        let modifiedaatime = Math.max(
                            lfm.adventure_active_time,
                            60
                        );
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
                            top + lfmHeight - 10
                        );
                    }
                    top += lfmHeight;
                });

            if (
                lfmSelection.lfmIndex !== -1 &&
                lfmSelection.lfmIndex < props.data.lfms.length
            ) {
                if (lfmSelection.cursorPosition[0] < 375) {
                    DrawPlayerOverlay(
                        props.data.lfms[lfmSelection.lfmIndex],
                        lfmSelection.cursorPosition
                    );
                } else {
                    DrawQuestOverlay(
                        props.data.lfms[lfmSelection.lfmIndex],
                        lfmSelection.cursorPosition
                    );
                }
                if (attemptedJoin !== null) {
                    DrawJoinRequestOverlay(
                        attemptedJoin.displayText,
                        attemptedJoin.cursorPosition
                    );
                }
            }
        }

        function DrawPlayerOverlay(lfm, cursorPosition) {
            const MAX_EVENTS = 10;
            const SHOW_ACTIVITY = props.showActivityHistory;
            const SHOW_GUILD_NAME = props.showGuildNames;
            const GUILD_NAME_HEIGHT = 15;

            if (lfm === null) return;

            let fontModifier = props.fontModifier === 0 ? 0 : 4;

            let activityHeight = 0;
            let activityCopy = lfm.activity.slice();
            let eventsFlat = [];
            activityCopy.forEach((activity) => {
                if (activity["events"] == null) return;
                activity["events"].forEach((event) => {
                    eventsFlat.push({
                        timestamp: activity["timestamp"],
                        ...event,
                    });
                });
            });

            // Remove all "No quest" entries
            eventsFlat = eventsFlat.filter((event) => {
                return !(event["tag"] == "quest" && event["data"] == null);
            });

            // If "No quest" is immediately followed by a quest selection, remove the "No quest" entry
            // eventsFlat = eventsFlat.filter((event, i) => {
            //   if (event["tag"] == "quest" && event["data"] == null) {
            //     if (
            //       i < eventsFlat.length - 1 &&
            //       eventsFlat[i + 1]["tag"] == "quest" &&
            //       eventsFlat[i + 1]["data"] != null
            //     ) {
            //       return false;
            //     }
            //   }
            //   return true;
            // });

            // Remove adjacent duplicate events
            eventsFlat = eventsFlat.filter((event, i) => {
                if (i < eventsFlat.length - 1) {
                    if (
                        event["tag"] == eventsFlat[i + 1]["tag"] &&
                        event["data"] == eventsFlat[i + 1]["data"]
                    ) {
                        return false;
                    }
                }
                return true;
            });

            if (eventsFlat.length > MAX_EVENTS) {
                eventsFlat = [
                    ...eventsFlat.slice(0, 1),
                    "placeholder",
                    ...eventsFlat.slice(2 - MAX_EVENTS),
                ];
            }

            let hasComment = lfm.comment != null && lfm.comment != "";

            if (SHOW_ACTIVITY) {
                if (eventsFlat.length > 0) {
                    eventsFlat.forEach((event, i) => {
                        if (event === "placeholder") {
                            activityHeight += 20;
                            return;
                        }
                        let eventText = "";
                        switch (event["tag"]) {
                            case "posted":
                                eventText = "Group posted";
                                break;
                            case "quest":
                                if (event["data"] != null) {
                                    eventText = event["data"];
                                } else {
                                    eventText = "No quest";
                                }
                                break;
                            case "comment":
                                if (
                                    event["data"] != null &&
                                    event["data"] !== ""
                                ) {
                                    eventText = `"${event["data"].trim()}"`;
                                } else {
                                    eventText = "No comment";
                                }
                                break;
                            case "member_joined":
                                eventText = `${event["data"]} joined`;
                                break;
                            case "member_left":
                                eventText = `${event["data"]} left`;
                                break;
                        }

                        let eventTextLines = wrapText(eventText, 190);
                        event["textLines"] = eventTextLines;
                        activityHeight += eventTextLines.length * 20; // + 5
                    });
                }
                activityHeight += 15;
            }

            let estimatedBottom =
                cursorPosition[1] +
                3 +
                (lfm.members.length + 1) *
                    (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
                26 +
                activityHeight +
                (wrapText(lfm.comment, 269).length - 1) *
                    (19 + (fontModifier < 0 ? -3 : 0));
            if (estimatedBottom > canvas.height) {
                cursorPosition[1] -= estimatedBottom - canvas.height;
            }

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
            let memberList = [lfm.leader, ...lfm.members];
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
                    if (member.gender == "Unknown") member.gender = "Male";
                    let raceIconPosition = getRaceIconPosition(
                        member.gender + " " + member.race,
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
                        member.name,
                        cursorPosition[0] + 26,
                        cursorPosition[1] +
                            3 +
                            (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) *
                                i +
                            10
                    );
                    let memberWidth = ctx.measureText(member.name).width;
                    if (NAMES.some((name) => member.name.startsWith(name))) {
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
                            member.guild === "" ? "italic " : ""
                        }15px 'Trebuchet MS'`;
                        ctx.textAlign = "left";
                        let wrappedGuildName = wrapText(member.guild_name, 200);
                        let truncatedGuildName = "";
                        if (wrappedGuildName) {
                            truncatedGuildName =
                                wrappedGuildName[0] +
                                (wrappedGuildName.length > 1 ? "..." : "");
                        }
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
                    if (member.location != null) {
                        let wrappedLocation = wrapText(
                            member.location.name,
                            230
                        );
                        ctx.font = 12 + "px 'Trebuchet MS'";
                        ctx.textAlign = "center";
                        ctx.fillText(
                            wrappedLocation[0] +
                                (wrappedLocation.length > 1 ? "..." : ""),
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
                        member.total_level,
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
                        member.classes !== null &&
                        member.classes !== undefined
                    ) {
                        for (let c = 0; c < member.classes.length; c++) {
                            if (
                                member.classes[c].name !== "Epic" &&
                                member.classes[c].name !== "Legendary"
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
                                    member.classes[c].name,
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
                        member.classes !== null &&
                        member.classes !== undefined
                    ) {
                        for (let c = 0; c < member.classes.length; c++) {
                            if (
                                member.classes[c].name !== "Epic" &&
                                member.classes[c].name !== "Legendary"
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
                                    member.classes[c].level,
                                    xp + 22,
                                    yp + 18
                                );
                                ctx.fillStyle = "white";
                                ctx.fillText(
                                    member.classes[c].level,
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
            let textLines = wrapText(lfm.comment, 269);

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
                    25
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

            let y_start =
                cursorPosition[1] +
                22 +
                memberList.length *
                    (41 + (SHOW_GUILD_NAME ? GUILD_NAME_HEIGHT : 0)) +
                textLines.length * (19 + (fontModifier < 0 ? -3 : 0)) +
                (fontModifier < 0 ? 4 : 3) -
                (hasComment ? 0 : 6);
            let y_offset = 0;
            // let y_modifier = hasComment ? 0 : -5;

            if (SHOW_ACTIVITY) {
                ctx.strokeStyle = "#bfbfbf";
                ctx.fillStyle = "#bfbfbf";
                ctx.globalAlpha = 1;
                ctx.drawImage(
                    sprite,
                    0,
                    232,
                    287,
                    23,
                    cursorPosition[0],
                    y_start - 18,
                    287,
                    23
                );
                let lastTimestamp = 0;

                eventsFlat.forEach((event, i) => {
                    if (event == "placeholder") {
                        ctx.drawImage(
                            sprite,
                            0,
                            232,
                            287,
                            23,
                            cursorPosition[0],
                            y_start + y_offset - 10,
                            287,
                            23
                        );
                        // ctx.fillText("...", cursorPosition[0] + 4, y_start + y_offset);
                        // ctx.fillText(
                        //   "...",
                        //   cursorPosition[0] + 4 + 100,
                        //   y_start + y_offset
                        // );
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.setLineDash([2, 2]);
                        ctx.moveTo(
                            cursorPosition[0] + 63,
                            y_start + y_offset - 10
                        );
                        ctx.lineTo(
                            cursorPosition[0] + 63,
                            y_start + y_offset + 10
                        );
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.lineWidth = 1;
                        y_offset += 20;
                    } else {
                        // Background
                        event["textLines"].forEach((line, i) => {
                            ctx.drawImage(
                                sprite,
                                0,
                                232,
                                287,
                                23,
                                cursorPosition[0],
                                y_start + y_offset - 10 + i * 20,
                                287,
                                23
                            );
                        });

                        // Time
                        let isDuplicateTime = false;
                        let thisEventTimestamp =
                            new Date(event["timestamp"]) * 1000;
                        let timeDiffInSeconds = Math.floor(
                            (new Date() - thisEventTimestamp) / 1000
                        );
                        let timeString = "";
                        if (timeDiffInSeconds < 60) {
                            timeString = "Now";
                        } else if (timeDiffInSeconds < 3600) {
                            timeString = `${Math.floor(
                                timeDiffInSeconds / 60
                            )} m`;
                        } else if (timeDiffInSeconds < 86400) {
                            timeString = `${Math.floor(
                                timeDiffInSeconds / 3600
                            )} h`;
                        }
                        if (
                            Math.abs(thisEventTimestamp - lastTimestamp) < 60000
                        ) {
                            isDuplicateTime = true;
                        }
                        if (!isDuplicateTime) {
                            ctx.textAlign = "right";
                            ctx.fillText(
                                timeString,
                                cursorPosition[0] + 45,
                                y_start + y_offset
                            );
                            ctx.textAlign = "left";
                            lastTimestamp = thisEventTimestamp;
                        }

                        // Graphics
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.moveTo(
                            cursorPosition[0] + 63,
                            y_start + y_offset - 10
                        );
                        ctx.lineTo(
                            cursorPosition[0] + 63,
                            y_start +
                                y_offset +
                                10 +
                                (event["textLines"].length - 1) * 20
                        );
                        ctx.stroke();
                        ctx.lineWidth = 1;
                        // if (!isDuplicateTime) {

                        switch (event["tag"]) {
                            // case "quest":
                            //   ctx.fillStyle = "#bfb299";
                            //   break;
                            case "posted":
                                ctx.fillStyle = "#4dacbf";
                                break;
                            case "member_joined":
                                ctx.fillStyle = "#99bf9f";
                                break;
                            case "member_left":
                                ctx.fillStyle = "#bf9999";
                                break;
                            case "comment":
                                // italics
                                ctx.font = `italic ${
                                    15 + fontModifier
                                }px Arial`;
                                break;
                            // case "quest":
                            //   ctx.fillStyle = "#bf9d73";
                            //   break;
                        }
                        ctx.beginPath();
                        ctx.arc(
                            cursorPosition[0] + 63,
                            y_start + y_offset,
                            4,
                            0,
                            2 * Math.PI
                        );
                        ctx.fill();
                        // }

                        // Event
                        // if (eventString.length > MAX_EVENT_STRING_LENGTH) {
                        //   eventString =
                        //     eventString.substring(0, MAX_EVENT_STRING_LENGTH - 10).trim() +
                        //     "..." +
                        //     eventString.substring(eventString.length - 7).trim();
                        // }
                        event["textLines"].forEach((line, i) => {
                            ctx.fillText(
                                line,
                                cursorPosition[0] + 4 + 75,
                                y_start + y_offset
                            );
                            y_offset += 20;
                        });
                        // ctx.fillText(
                        //   eventString,
                        //   cursorPosition[0] + 4 + 75,
                        //   y_start + y_offset
                        // );
                        ctx.fillStyle = "#bfbfbf";
                        ctx.font = `${15 + fontModifier}px Arial`;
                    }
                });

                if (hasComment) {
                    ctx.beginPath();
                    ctx.strokeStyle = "white";
                    ctx.moveTo(cursorPosition[0] + 3, y_start - 16);
                    ctx.lineTo(cursorPosition[0] + 275, y_start - 16);
                    ctx.stroke();
                }

                ctx.drawImage(
                    sprite,
                    0,
                    250,
                    287,
                    8,
                    cursorPosition[0],
                    y_start + y_offset - 10,
                    287,
                    8
                );
            }
        }

        function DrawQuestOverlay(lfm, cursorPosition) {
            if (lfm === null) return;
            if (lfm.quest == null) return;

            let estimatedBottom =
                cursorPosition[1] +
                3 +
                170 +
                26 +
                (lfm.characters_on_timer
                    ? lfm.characters_on_time.length * 20 + 15
                    : 0) +
                (lfm.is_quest_guess && props.showQuestGuesses ? 60 : 0);
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

            let quest = lfm.quest;
            let row = 1;

            // raid timers
            if (lfm.characters_on_timer && lfm.characters_on_timer.length > 0) {
                ctx.fillStyle = "#f6d3d3";
                drawOverlayBackground(row);
                drawOverlayTitle("Raid timers", row);
                lfm.characters_on_timer.forEach((character) => {
                    let wrapped = wrapText(
                        `${character.name} (${getTimeTillEnd(
                            character,
                            lfm.quest.name
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

            if (lfm.is_quest_guess && props.showQuestGuesses) {
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

            if (quest.name != null) {
                drawOverlayBackground(row);
                drawOverlayTitle("Quest", row); // 1-based index
                let wrapped = wrapText(quest.name, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            if (quest.adventure_area) {
                drawOverlayBackground(row);
                drawOverlayTitle("Takes place in", row);
                let wrapped = wrapText(quest.adventure_area, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            if (quest.quest_journal_group) {
                drawOverlayBackground(row);
                drawOverlayTitle("Nearest hub", row);
                let wrapped = wrapText(quest.quest_journal_group, 220);
                for (let i = 0; i < wrapped.length; i++) {
                    if (i > 0) drawOverlayBackground(row);
                    drawOverlayInfo(wrapped[i], row);
                    row++;
                }
            }

            drawOverlayBackground(row);
            drawOverlayTitle("Level", row);
            drawOverlayInfo(
                (quest.level.heroic_normal != null
                    ? quest.level.heroic_normal + " Heroic"
                    : "") +
                    (quest.level.heroic_normal != null &&
                    quest.level.epic_normal != null
                        ? ", "
                        : "") +
                    (quest.level.epic_normal != null
                        ? quest.level.epic_normal + " Epic"
                        : ""),
                row
            );
            row++;

            drawOverlayBackground(row);
            drawOverlayTitle("Adventure pack", row);
            let wrapped = wrapText(
                quest.required_adventure_pack || "Free to play",
                220
            );
            for (let i = 0; i < wrapped.length; i++) {
                if (i > 0) drawOverlayBackground(row);
                drawOverlayInfo(wrapped[i], row);
                row++;
            }

            if (quest.patron) {
                drawOverlayBackground(row);
                drawOverlayTitle("Patron", row);
                drawOverlayInfo(quest.patron ?? "", row);
                row++;
            }

            if (quest.average_time) {
                drawOverlayBackground(row);
                drawOverlayTitle("Average time", row);
                drawOverlayInfo(
                    `${Math.round(quest.average_time / 60)} minutes`,
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

        function DrawJoinRequestOverlay(displayText, cursorPosition) {
            ctx.font = `${18 + props.fontModifier}px 'Trebuchet MS'`;
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
            if (text == null || text.length === 0) {
                return text;
            }

            const words = text.split(/([^\w\s"'.!?()]|\s+)/); // Split on non-word characters except double quotes
            let currentLine = "";
            let lines = [];

            words.forEach((word) => {
                const testLine = currentLine + word;
                const testLineWidth = ctx.measureText(testLine).width;

                if (testLineWidth > maxWidth) {
                    if (currentLine) {
                        lines.push(currentLine.trim());
                    }
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });

            if (currentLine) {
                lines.push(currentLine.trim());
            }

            return lines;
        }

        // Helper function for getting group difficulty
        function getGroupDifficulty(lfm) {
            if (!lfm.is_quest_guess && lfm.difficulty != "Reaper") {
                return lfm.difficulty;
            }

            let sanitized = lfm.comment.toLowerCase();
            let normalpattern = /(\bln\b)(\ben\b)|(\bnormal\b)/;
            let hardpattern = /(\blh\b)(\beh\b)|(\bhard\b)/;
            let elitepattern = /(\ble\b)(\bee\b)|(\belite\b)/;
            let reaperpattern = /(\br\b)|(\breaper\b)/;

            if (lfm.is_quest_guess) {
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

            if (lfm.is_quest_guess) {
                if (reaperpattern.test(sanitized)) {
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
                lfm.quest?.required_adventure_pack
                    .toLowerCase()
                    .includes("feywild")
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
        lfmSelection.lfmIndex,
        lfmSelection.side,
        lfmSelection.doubleClick,
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
                width={PANEL_WIDTH}
                height={
                    (props.data
                        ? Math.max(
                              computePanelHeight(props.data.lfms),
                              MINIMUM_LFM_COUNT * LFM_HEIGHT
                          )
                        : MINIMUM_LFM_COUNT * LFM_HEIGHT) + 99
                }
            />
        </div>
    );
};

export default CanvasLfmPanel;
