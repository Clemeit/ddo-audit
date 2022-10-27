/** Context object used for drawing. This should be set by calling canvas.getContext(). */
let context = null;
/** Panel sprite used for common images. */
let sprite = null;
const PANEL_WIDTH = 848;
const MINIMUM_LFM_COUNT = 6;
const GROUP_HEIGHT = 90;
const CLASS_COUNT = 15;

/**
 * TODO: Probably best to pass in all CanvasLfmPanel props to this.
 */

/**
 * Initialize the renderer with the canvas context.
 * @param {*} _context Canvas context
 */
function init(_context, _sprite) {
    context = _context;
    sprite = _sprite;
}

/**
 * This function renders the grouping panel header.
 */
function renderPanelHeader() {
    context.drawImage(sprite, 0, 0, PANEL_WIDTH, 72, 0, 0, PANEL_WIDTH, 72);
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
            (Math.floor(lastUpdateTime.getHours() / 12) == 0 ? " AM" : " PM");
        context.font = "18px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";
        context.fillText(timeText, 212, 19);
        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }
    if (props.sortAscending) {
        context.drawImage(sprite, 30, 259, 30, 10, 746, 55, 30, 10);
    } else {
        context.drawImage(sprite, 0, 259, 30, 10, 746, 55, 30, 10);
    }
}

/**
 * This function renders the grouping panel footer.
 */
function renderPanelFooter(groupsData) {
    context.drawImage(
        sprite,
        0,
        162,
        PANEL_WIDTH,
        27,
        0,
        72 +
            (props.data
                ? Math.max(
                      computePanelHeight(groupsData),
                      MINIMUM_LFM_COUNT * GROUP_HEIGHT
                  )
                : MINIMUM_LFM_COUNT * GROUP_HEIGHT),
        PANEL_WIDTH,
        27
    );
}

/**
 * This function renders the grouping panel filler.
 */
function renderPanelFiller() {}

/**
 * This function renders a single group from a group object.
 * @param {*} groupData A single group object
 */
function renderSingleGroup(groupData) {}

/**
 * This function renders the entire grouping panel from a list of group objects.
 * @param {*} groupsData A list of group objects
 */
function renderGroupingPanel(groupsData) {}

/**
 * This function renders the quest overlay from a quest object.
 * @param {*} questData A single quest object
 */
function renderQuestOverlay(questData) {}

/**
 * This function renders the member overlay from a group object.
 * @param {*} groupData A single group object
 */
function renderMemberOverlay(groupData) {}

function computePanelHeight(groupsData) {
    let top = 0;

    if (groupsData) {
        groupsData
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

export {
    init,
    renderPanelHeader,
    renderPanelFooter,
    renderPanelFiller,
    renderSingleGroup,
    renderGroupingPanel,
};
