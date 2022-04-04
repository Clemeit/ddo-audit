import React from "react";
import PanelSprite from "../../assets/global/friends_panel.jpg";

const CanvasFriendsPanel = (props) => {
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);
    const [canvasWidth, setCanvasWidth] = React.useState(0);
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    const PANEL_WIDTH = 706;
    const PLAYER_HEIGHT = 42;

    function HandleMouseOnCanvas(e) {
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) * (PANEL_WIDTH / rect.width); //x position within the element.
        var y = (e.clientY - rect.top) * (PANEL_WIDTH / rect.width); //y position within the element.

        if (x > 28 && x < 175 && y > 116 && y < 131) {
            props.handleHideOfflineFriends();
        }

        if (x >= 28 && x < 48 && y >= 147 && y < 171) {
            props.handleSort("inparty");
        }

        if (x >= 48 && x < 68 && y >= 147 && y < 171) {
            props.handleSort("online");
        }

        if (x >= 68 && x < 301 && y >= 147 && y < 171) {
            props.handleSort("name");
        }

        if (x >= 301 && x < 419 && y >= 147 && y < 171) {
            props.handleSort("class");
        }

        if (x >= 419 && x < 471 && y >= 147 && y < 171) {
            props.handleSort("level");
        }

        if (x >= 471 && x < 668 && y >= 147 && y < 171) {
            props.handleSort("guild");
        }
    }

    function handleCanvasResize() {
        let rect = canvasRef.current.getBoundingClientRect();
        setCanvasWidth(rect.width);
    }

    function computeInputHeight() {
        let mod = window.innerWidth <= 950 ? 2 : 1;
        return `${((24 * canvasWidth) / PANEL_WIDTH) * mod}px`;
    }

    function computeInputTop() {
        let mod =
            window.innerWidth <= 950 ? (24 * canvasWidth) / PANEL_WIDTH : 0;
        return `${(73 * canvasWidth) / PANEL_WIDTH - mod / 2}px`;
    }

    function computeInputTopPadding() {
        let mod = window.innerWidth <= 950 ? 2 : 1;
        return `${(((24 * canvasWidth) / PANEL_WIDTH) * mod) / 2}px`;
    }

    React.useEffect(() => {
        // TODO: Remove listeners
        canvasRef.current.addEventListener("click", (e) => {
            HandleMouseOnCanvas(e);
        });
        window.addEventListener("resize", (e) => {
            // setCanvasWidth(canvasRef.current.getBoundingClientRect().width);
            handleCanvasResize();
        });
        handleCanvasResize();
    }, [canvasRef]);

    React.useEffect(() => {
        if (!isImageLoaded) {
            return;
        }
        if (props.data === null) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });

        const sprite = spriteRef.current;

        // Draw the header
        OpenPanel();

        // Draw the chin
        ClosePanel();

        // Draw filler
        DrawFiller();

        // Draw friends
        if (props.data != null) DrawFriends();

        function OpenPanel() {
            ctx.drawImage(sprite, 0, 0, 706, 174, 0, 0, 706, 174);

            if (props.hideOfflineFriends)
                ctx.drawImage(sprite, 258, 324, 16, 16, 28, 116, 16, 16);
            else ctx.drawImage(sprite, 242, 324, 16, 16, 28, 116, 16, 16);
        }

        function ClosePanel() {
            ctx.drawImage(
                sprite,
                0,
                231,
                706,
                93,
                0,
                (props.data ? Math.max(props.data.length, 4) : 4) *
                    PLAYER_HEIGHT +
                    172,
                706,
                93
            );
        }

        function DrawFiller() {
            if (props.data == null || props.data.length < 4) {
                for (let i = 0; i < 4; i++) {
                    let y = 174 + i * PLAYER_HEIGHT;
                    ctx.drawImage(
                        sprite,
                        0,
                        172,
                        706,
                        PLAYER_HEIGHT,
                        0,
                        y,
                        706,
                        PLAYER_HEIGHT
                    );
                }
            }
        }

        function DrawFriends() {
            for (let i = 0; i < props.data.length; i++) {
                let y = 174 + i * PLAYER_HEIGHT;
                let x = 28;
                var width = 639;
                var height = 42;
                let player = props.data[i];

                ctx.drawImage(
                    sprite,
                    0,
                    172,
                    706,
                    PLAYER_HEIGHT,
                    0,
                    y,
                    706,
                    PLAYER_HEIGHT
                );

                // Draw background gradient:
                var grad = ctx.createLinearGradient(x, y, x, y + height);
                grad.addColorStop(0, "#3b3b25");
                grad.addColorStop(0.25, "#4c4a31");
                grad.addColorStop(0.75, "#4c4a31");
                grad.addColorStop(1, "#3b3b25");
                ctx.fillStyle = grad;
                ctx.fillRect(x, y, width, height);

                // Draw border:
                ctx.beginPath();
                ctx.strokeStyle = "#898c77";
                ctx.lineWidth = 1;
                ctx.rect(x, y, width, height);
                ctx.stroke();

                // Draw dividers:
                ctx.beginPath();
                ctx.moveTo(x + 21, y);
                ctx.lineTo(x + 21, y + PLAYER_HEIGHT - 2);
                ctx.moveTo(x + 41, y);
                ctx.lineTo(x + 41, y + PLAYER_HEIGHT - 2);
                ctx.moveTo(x + 273, y);
                ctx.lineTo(x + 273, y + PLAYER_HEIGHT - 2);
                ctx.moveTo(x + 391, y);
                ctx.lineTo(x + 391, y + PLAYER_HEIGHT - 2);
                ctx.moveTo(x + 443, y);
                ctx.lineTo(x + 443, y + PLAYER_HEIGHT - 2);
                ctx.stroke();

                // Draw group status:
                ctx.drawImage(
                    sprite,
                    274 + (player.Online == 0 ? 12 : 0),
                    324,
                    12,
                    12,
                    x + 25,
                    y + 13,
                    12,
                    12
                );

                // Draw group status:
                if (player.GroupId != 0 && player.Online) {
                    ctx.drawImage(
                        sprite,
                        211,
                        324,
                        16,
                        20,
                        x + 2,
                        y + 10,
                        16,
                        20
                    );
                }

                // Draw race icon:
                let raceIconPosition = getRaceIconPosition(
                    player.Gender + " " + player.Race,
                    true
                );
                ctx.drawImage(
                    sprite,
                    raceIconPosition[0],
                    raceIconPosition[1],
                    18,
                    18,
                    x + 45,
                    y + 10,
                    18,
                    18
                );

                // Draw name
                ctx.fillStyle = "#f6f1d3";
                ctx.font = 18 + "px 'Trebuchet MS'"; // 18px
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(player.Name, x + 68, y + 21);

                // Draw classes:
                ctx.font = "13px Arial";
                ctx.textAlign = "right";
                for (var j = 0; j < player.Classes.length; j++) {
                    if (player.Classes[j].Name == null) continue;

                    let classIconPosition = getClassIconPosition(
                        player.Classes[j].Name,
                        true
                    );
                    ctx.drawImage(
                        sprite,
                        classIconPosition[0],
                        classIconPosition[1],
                        18,
                        18,
                        x + 279 + 21 * j,
                        y + 10,
                        18,
                        18
                    );

                    ctx.fillStyle = "black";
                    ctx.fillText(
                        player.Classes[j].Level,
                        x + 279 + 21 * j + 22,
                        y + 20 + 5
                    );
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        player.Classes[j].Level,
                        x + 279 + 21 * j + 21,
                        y + 20 + 4
                    );
                }

                // Draw level:
                ctx.fillStyle = "#f6f1d3";
                ctx.textAlign = "center";
                ctx.font = 17 + "px Arial"; // 15px
                ctx.fillText(player.TotalLevel, x + 416, y + 21);

                // Guild name:
                ctx.font = "15px 'Trebuchet MS'";
                if (player.Name == "Anonymous") {
                    ctx.fillText("Noneya Business", x + 542, y + 22);
                } else {
                    let guildname = wrapText(player.Guild, 230);
                    if (guildname.length > 1) {
                        ctx.fillText(guildname[0] + "...", x + 542, y + 22);
                    } else if (guildname.length === 1) {
                        ctx.fillText(guildname[0], x + 542, y + 22);
                    }
                }
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

        // Helper function for getting class icon position
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
            return [xsrc, ysrc + 324];
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
                    xsrc = 0;
                    ysrc = 60;
                    break;
            }
            return [xsrc + 108, ysrc + 324];
        }
    }, [props.data, isImageLoaded, props.hideOfflineFriends]);

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
            <input
                id="player-input"
                className="who-filter-input"
                style={{
                    left: `${(80 * canvasWidth) / PANEL_WIDTH}px`,
                    top: computeInputTop(),
                    width: `${(517 * canvasWidth) / PANEL_WIDTH}px`,
                    height: computeInputHeight(),
                    fontSize: `${(1.2 * canvasWidth) / PANEL_WIDTH}rem`,
                    padding: `${computeInputTopPadding()} ${
                        (7 * canvasWidth) / PANEL_WIDTH
                    }px`,
                }}
                value={props.playerInput}
                onChange={(e) => props.handlePlayerInput(e.target.value)}
            />
            {/* <input
                id="comment-input"
                className="who-filter-input"
                style={{
                    left: `${(428 * canvasWidth) / PANEL_WIDTH}px`,
                    top: computeInputTop(),
                    width: `${(30 * canvasWidth) / PANEL_WIDTH}px`,
                    height: computeInputHeight(),
                    textAlign: "center",
                    padding: "0px",
                    fontSize: `${(1.2 * canvasWidth) / PANEL_WIDTH}rem`,
                }}
                value={props.commentInput}
                onChange={(e) => {
                    props.handleCommentInput(e.target.value);
                }}
            /> */}
            {props.children}
            <canvas
                className="who-canvas"
                id="who-canvas"
                ref={canvasRef}
                style={{
                    backgroundColor: "black",
                    width: "100%",
                }}
                width={PANEL_WIDTH}
                height={
                    (props.data ? Math.max(props.data.length, 4) : 4) *
                        PLAYER_HEIGHT +
                    265
                }
            />
        </div>
    );
};

export default CanvasFriendsPanel;
