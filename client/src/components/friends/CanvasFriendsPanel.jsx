import React from "react";
import PanelSprite from "../../assets/global/friends_panel.jpg";

const CanvasFriendsPanel = (props) => {
    const canvasRef = React.useRef(null);
    const spriteRef = React.useRef(null);
    const [canvasWidth, setCanvasWidth] = React.useState(0);
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    const PANEL_WIDTH = 706;
    const PLAYER_HEIGHT = 42;

    function computeInputHeight() {
        let mod = window.innerWidth <= 950 ? 2 : 1;
        return `${((24 * canvasWidth) / PANEL_WIDTH) * mod}px`;
    }

    function computeInputTop() {
        let mod =
            window.innerWidth <= 950 ? (24 * canvasWidth) / PANEL_WIDTH : 0;
        return `${(139 * canvasWidth) / PANEL_WIDTH + 36 - mod / 2}px`;
    }

    function computeInputTopPadding() {
        let mod = window.innerWidth <= 950 ? 2 : 1;
        return `${(((24 * canvasWidth) / PANEL_WIDTH) * mod) / 2}px`;
    }

    React.useEffect(() => {
        if (!isImageLoaded) {
            return;
        }
        // if (props.data === null) {
        //     return;
        // }

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
                ctx.drawImage(sprite, 242, 324, 16, 16, 28, 116, 16, 16);
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
                (props.data ? props.data.length : 4) * PLAYER_HEIGHT + 172,
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
            }
        }
    }, [props.data, isImageLoaded]);

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
                    left: `${(124 * canvasWidth) / PANEL_WIDTH}px`,
                    top: computeInputTop(),
                    width: `${(284 * canvasWidth) / PANEL_WIDTH}px`,
                    height: computeInputHeight(),
                    fontSize: `${(1.2 * canvasWidth) / PANEL_WIDTH}rem`,
                    padding: `${computeInputTopPadding()} ${
                        (7 * canvasWidth) / PANEL_WIDTH
                    }px`,
                }}
                value={props.playerInput}
                onChange={(e) => props.handlePlayerInput(e.target.value)}
            />
            <input
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
                    (props.data ? props.data.length : 4) * PLAYER_HEIGHT + 265
                }
            />
        </div>
    );
};

export default CanvasFriendsPanel;
