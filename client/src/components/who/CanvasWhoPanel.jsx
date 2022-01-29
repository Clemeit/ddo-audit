import React from "react";
import PanelSprite from "../../assets/global/whoSprite.jpg";

const CanvasWhoPanel = (props) => {
    // Assume that incoming props.data is already filtered according to user preferences
    // TODO: Remove ExactMatch and LocationRegion from the sprite
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);

    const [isImageLoaded, set_isImageLoaded] = React.useState(false);
    const classFilterBounds = [
        [119, 83, 30, 30],
        [152, 83, 30, 30],
        [185, 83, 30, 30],
        [218, 83, 30, 30],
        [251, 83, 30, 30],
        [284, 83, 30, 30],
        [317, 83, 30, 30],
        [350, 83, 30, 30],
        [383, 83, 30, 30],
        [416, 83, 30, 30],
        [449, 83, 30, 30],
        [482, 83, 30, 30],
        [515, 83, 30, 30],
        [548, 83, 30, 30],
        [581, 83, 30, 30],
    ];

    function isEveryClassChecked() {
        let result = true;
        props.classFilterStates.forEach((state) => {
            if (!state) result = false;
        });
        return result;
    }

    const PANEL_WIDTH = 706;
    const playerHeight = 42;
    const classCount = 15;
    const MAXIMUM_RESULTS = 200;

    function HandleMouseOnCanvas(e) {
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) * (PANEL_WIDTH / rect.width); //x position within the element.
        var y = (e.clientY - rect.top) * (PANEL_WIDTH / rect.width); //y position within the element.

        for (let i = 0; i < classFilterBounds.length; i++) {
            if (
                x > classFilterBounds[i][0] &&
                x < classFilterBounds[i][0] + classFilterBounds[i][2] &&
                y > classFilterBounds[i][1] &&
                y < classFilterBounds[i][1] + classFilterBounds[i][3]
            ) {
                props.handleClassFilter(i);
            }
        }

        if (x > 429 && x < 429 + 47 && y > 63 && y < 63 + 16) {
            props.handleAnyClass();
        }

        if (x > 177 && x < 177 + 184 && y > 171 && y < 171 + 16) {
            props.handleIncludeRegion();
        }

        if (x > 401 && x < 401 + 110 && y > 171 && y < 171 + 16) {
            props.handleExactMatch();
        }

        if (x > 125 && x < 125 + 282 && y > 142 && y < 142 + 22) {
            props.handleOpenSettings();
        }

        if (x > 429 && x < 429 + 28 && y > 142 && y < 142 + 20) {
            props.handleOpenSettings();
        }

        if (x > 480 && x < 480 + 28 && y > 142 && y < 142 + 20) {
            props.handleOpenSettings();
        }
    }

    React.useEffect(() => {
        // TODO: Remove listeners
        canvasRef.current.addEventListener("click", (e) => {
            HandleMouseOnCanvas(e);
        });
    }, [canvasRef]);

    function getNameFilter() {
        if (!props.filters) return "";
        let result = "";
        props.filters.forEach((filter) => {
            if (filter.type === "Name") {
                result = filter.value;
            }
        });
        return result.toString();
    }

    function getLowLevelFilter() {
        if (!props.filters) return 1;
        let result = 1;
        props.filters.forEach((filter) => {
            if (filter.type === "Min Level") {
                result = filter.value;
            }
        });
        return result.toString();
    }

    function getHighLevelFilter() {
        if (!props.filters) return 30;
        let result = 30;
        props.filters.forEach((filter) => {
            if (filter.type === "Max Level") {
                result = filter.value;
            }
        });
        return result.toString();
    }

    React.useEffect(() => {
        if (!isImageLoaded) {
            //console.log("Waiting on resources");
            return;
        }
        if (props.data === null) {
            //console.log("Waiting on data");
            return;
        }
        // Render canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });

        const sprite = spriteRef.current;

        // Draw the header
        OpenPanel();

        // Draw the chin
        ClosePanel();

        // Draw lfms
        // DrawFiller();
        if (props.data !== null) DrawPlayers();

        // Draws the header and the lastUpdateTime string
        function OpenPanel() {
            ctx.drawImage(sprite, 0, 0, 706, 235, 0, 0, 706, 235);

            // Draw anyClass checkbox
            // 429, 63, 16, 16
            if (isEveryClassChecked())
                ctx.drawImage(sprite, 467, 315, 16, 16, 429, 63, 16, 16);
            else ctx.drawImage(sprite, 450, 315, 16, 16, 429, 63, 16, 16);

            if (props.includeRegion)
                ctx.drawImage(sprite, 467, 315, 16, 16, 177, 171, 16, 16);
            else ctx.drawImage(sprite, 450, 315, 16, 16, 177, 171, 16, 16);

            if (props.exactMatch)
                ctx.drawImage(sprite, 467, 315, 16, 16, 401, 171, 16, 16);
            else ctx.drawImage(sprite, 450, 315, 16, 16, 401, 171, 16, 16);

            // Draw class toggles
            for (var i = 0; i < 15; i++) {
                drawClassFilter(
                    i,
                    props.classFilterStates[i],
                    classFilterBounds[i][0],
                    classFilterBounds[i][1]
                );
            }

            // Name box: 125, 140, 282, 22
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.strokeStyle = "#111111";
            ctx.lineWidth = 1;
            ctx.fillRect(125, 140, 282, 22); // name
            ctx.fillRect(429, 142, 28, 20); // lower
            ctx.fillRect(480, 142, 28, 20); // upper
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = "#b2b090";
            ctx.lineWidth = 1;
            ctx.rect(125, 140, 282, 22); // name
            ctx.rect(429, 142, 28, 20); // lower
            ctx.rect(480, 142, 28, 20); // upper
            ctx.stroke();

            ctx.fillStyle = "#f6f1d3";
            ctx.font = "15px 'Trebuchet MS'"; // 18px
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(getNameFilter(), 130, 151);

            ctx.textAlign = "center";
            ctx.fillText(getLowLevelFilter(), 443, 152);
            ctx.fillText(getHighLevelFilter(), 494, 152);

            // Last updated
            let lastUpdateTime = new Date();
            var hour = lastUpdateTime.getHours() % 12;
            if (hour == 0) hour = 12;
            var timeText =
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
            ctx.fillText(timeText, 193, 17);
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
        }

        // Draws the chin
        function ClosePanel() {
            ctx.drawImage(
                sprite,
                0,
                290,
                706,
                25,
                0,
                (props.data
                    ? Math.min(props.data.length, MAXIMUM_RESULTS)
                    : 4) *
                    playerHeight +
                    234,
                706,
                25
            );
        }

        // Draws filler
        function DrawFiller() {}

        function DrawPlayers() {
            if (props.data === null) {
                //console.log("Waiting on data");
                return;
            }

            for (let i = 0; i < props.data.length; i++) {
                let player = props.data[i];
                let x = 24;
                let y = 229 + i * 42;
                // Bounds: 660, 42
                var width = 660;
                var height = 42;

                // Draw background panel
                ctx.drawImage(sprite, 0, 234, 706, 47, 0, y, 706, 47);

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
                ctx.moveTo(x + 20, y);
                ctx.lineTo(x + 20, y + 40);
                ctx.stroke();
                ctx.moveTo(x + 248, y);
                ctx.lineTo(x + 248, y + 40);
                ctx.stroke();
                ctx.moveTo(x + 365, y);
                ctx.lineTo(x + 365, y + 40);
                ctx.stroke();
                ctx.moveTo(x + 432, y);
                ctx.lineTo(x + 432, y + 40);
                ctx.stroke();

                // Draw group status:
                if (player.GroupId != 0)
                    ctx.drawImage(
                        sprite,
                        211,
                        376,
                        16,
                        20,
                        x + 2,
                        y + 10,
                        16,
                        20
                    );

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
                    x + 23,
                    y + 3,
                    18,
                    18
                );

                // Draw name:
                ctx.fillStyle = "#f6f1d3";
                ctx.font = 18 + "px 'Trebuchet MS'"; // 18px
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(player.Name, x + 44, y + 14);

                // Draw location: 30, 26
                ctx.font = "12px 'Trebuchet MS'";
                if (player.Name == "Anonymous") {
                    ctx.fillText("The Island of Noneya", x + 30, y + 33);
                } else {
                    let baseString;
                    if (player.Location.Name === null) {
                        baseString = "Somewhere in the Aether";
                    } else {
                        baseString = player.Location.Name;
                    }
                    let textLines = wrapText(baseString, 200);
                    if (textLines.length > 1) {
                        var newLines = [];
                        newLines[0] = textLines[0] + "...";
                        textLines = newLines;
                    }
                    ctx.fillText(textLines[0], x + 30, y + 33);
                }

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
                        x + 269 + 21 * j,
                        y + 13,
                        18,
                        18
                    );

                    ctx.fillStyle = "black";
                    ctx.fillText(
                        player.Classes[j].Level,
                        x + 269 + 21 * j + 22,
                        y + 20 + 8
                    );
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        player.Classes[j].Level,
                        x + 269 + 21 * j + 21,
                        y + 20 + 7
                    );
                }

                // Draw level:
                ctx.fillStyle = "#f6f1d3";
                ctx.textAlign = "center";
                ctx.font = 17 + "px Arial"; // 15px
                ctx.fillText(player.TotalLevel, x + 400, y + 22);

                // Guild name:
                ctx.font = "15px 'Trebuchet MS'";
                if (player.Name == "Anonymous") {
                    ctx.fillText("Noneya Business", x + 548, y + 22);
                } else {
                    let guildname = wrapText(player.Guild, 230);
                    if (guildname.length > 1) {
                        ctx.fillText(guildname[0] + "...", x + 548, y + 22);
                    } else if (guildname.length === 1) {
                        ctx.fillText(guildname[0], x + 548, y + 22);
                    }
                }

                // Draw text if too many players
                if (i >= MAXIMUM_RESULTS - 1) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.fillRect(
                        canvas.width / 2 - 160,
                        canvas.height - 80,
                        320,
                        30
                    );

                    ctx.fillStyle = "white";
                    ctx.font = "18px 'Trebuchet MS'"; // 18px
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(
                        "Showing the first " +
                            MAXIMUM_RESULTS +
                            " of " +
                            props.data.length +
                            " matches",
                        canvas.width / 2,
                        canvas.height - 65
                    );
                    break;
                }
            }
        }

        function DrawPlayerOverlay(player, cursorPosition) {}

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
        function drawClassFilter(index, state, x, y) {
            var xsrc = 0;
            var ysrc = 0;
            switch (index) {
                case 0:
                    xsrc = 0;
                    ysrc = 0;
                    break;
                case 1:
                    xsrc = 30;
                    ysrc = 0;
                    break;
                case 2:
                    xsrc = 60;
                    ysrc = 0;
                    break;
                case 3:
                    xsrc = 90;
                    ysrc = 0;
                    break;
                case 4:
                    xsrc = 120;
                    ysrc = 0;
                    break;
                case 5:
                    xsrc = 150;
                    ysrc = 0;
                    break;
                case 6:
                    xsrc = 180;
                    ysrc = 0;
                    break;
                case 7:
                    xsrc = 210;
                    ysrc = 0;
                    break;
                case 8:
                    xsrc = 240;
                    ysrc = 0;
                    break;
                case 9:
                    xsrc = 270;
                    ysrc = 0;
                    break;
                case 10:
                    xsrc = 300;
                    ysrc = 0;
                    break;
                case 11:
                    xsrc = 330;
                    ysrc = 0;
                    break;
                case 12:
                    xsrc = 360;
                    ysrc = 0;
                    break;
                case 13:
                    xsrc = 390;
                    ysrc = 0;
                    break;
                case 14:
                    xsrc = 420;
                    ysrc = 0;
                    break;
            }
            ctx.drawImage(
                sprite,
                xsrc,
                316 + ysrc + state * 30,
                30,
                30,
                x,
                y,
                30,
                30
            );
        }

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
            return [xsrc, ysrc + 376];
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
            return [xsrc + 108, ysrc + 376];
        }
    }, [
        props.data,
        isImageLoaded,
        props.filters,
        props.classFilterStates,
        props.includeRegion,
        props.exactMatch,
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
                className="who-canvas"
                id="who-canvas"
                ref={canvasRef}
                style={{
                    backgroundColor: "black",
                    width: "100%",
                }}
                width={PANEL_WIDTH}
                height={
                    (props.data
                        ? Math.min(props.data.length, MAXIMUM_RESULTS)
                        : 4) *
                        playerHeight +
                    260
                }
            />
        </div>
    );
};

export default CanvasWhoPanel;
