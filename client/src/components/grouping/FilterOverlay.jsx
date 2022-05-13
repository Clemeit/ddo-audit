import React from "react";

const FilterOverlay = () => {
    return (
        <div>
            <div
                className="filter-panel-overlay"
                style={{
                    display: filterPanelVisible ? "block" : "none",
                }}
                onClick={() => setFilterPanelVisible(false)}
            />
            <div
                className="filter-panel"
                style={{
                    display: filterPanelVisible ? "block" : "none",
                    padding: "10px",
                }}
            >
                <ContentCluster title="Filter Groups" smallBottomMargin>
                    <div style={{ padding: "15px" }}>
                        <LevelRangeSlider
                            handleChange={(e) => {
                                if (e.length) {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "minimum-level",
                                            e[0]
                                        );
                                        localStorage.setItem(
                                            "maximum-level",
                                            e[1]
                                        );
                                    }
                                    setMinimumLevel(e[0]);
                                    setMaximumLevel(e[1]);
                                }
                            }}
                            minimumLevel={minimumLevel}
                            maximumLevel={maximumLevel}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            flexDirection: "column",
                            alignItems: "start",
                        }}
                    >
                        <label
                            className="filter-panel-group-option"
                            style={{
                                marginBottom: "0px",
                            }}
                        >
                            <input
                                className="input-radio"
                                name="mylevel"
                                type="checkbox"
                                checked={filterBasedOnMyLevel}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "filter-by-my-level",
                                            !filterBasedOnMyLevel
                                        );
                                    }
                                    setFilterBasedOnMyLevel(
                                        !filterBasedOnMyLevel
                                    );
                                }}
                            />
                            Filter groups based on my current level{" "}
                            <span
                                className="new-tag small"
                                style={{ marginLeft: "7px" }}
                            >
                                NEW
                            </span>
                        </label>
                        {filterBasedOnMyLevel && (
                            <label
                                className="filter-panel-group-option"
                                style={{
                                    marginLeft: "40px",
                                    marginBottom: "0px",
                                }}
                            >
                                <input
                                    className="input-radio"
                                    name="showeligiblecharacters"
                                    type="checkbox"
                                    checked={showEligibleCharacters}
                                    onChange={() => {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "show-eligible-characters",
                                                !showEligibleCharacters
                                            );
                                        }
                                        setShowEligibleCharacters(
                                            !showEligibleCharacters
                                        );
                                    }}
                                />
                                Show my eligible characters
                            </label>
                        )}
                        <Link
                            to="/registration"
                            style={{
                                marginLeft: "40px",
                                fontSize: "1.1rem",
                            }}
                        >
                            Add characters
                        </Link>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="noteligible"
                                type="checkbox"
                                checked={showNotEligible}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "show-not-eligible",
                                            !showNotEligible
                                        );
                                    }
                                    setShowNotEligible(!showNotEligible);
                                }}
                            />
                            Show groups I am not eligible for
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="setsortorder"
                                type="checkbox"
                                checked={sortAscending}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "sort-order",
                                            !sortAscending
                                        );
                                    }
                                    setSortAscending(!sortAscending);
                                }}
                            />
                            Sort groups ascending
                        </label>
                    </div>
                </ContentCluster>
                <ContentCluster title="Accessibility" smallBottomMargin>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            flexDirection: "column",
                            alignItems: "start",
                        }}
                    >
                        <label className="filter-panel-group-option show-on-mobile">
                            <input
                                className="input-radio"
                                name="darktheme"
                                type="checkbox"
                                checked={theme === "dark-theme"}
                                onChange={() => {
                                    toggleTheme();
                                }}
                            />
                            Dark theme
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="classiclook"
                                type="checkbox"
                                checked={alternativeLook}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "alternative-lfm-look",
                                            !alternativeLook
                                        );
                                    }
                                    setAlternativeLook(!alternativeLook);
                                }}
                            />
                            Text-Based View
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="highvis"
                                type="checkbox"
                                checked={highVisibility}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "high-visibility",
                                            !highVisibility
                                        );
                                    }
                                    setHighVisibility(!highVisibility);
                                }}
                            />
                            High Contrast
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="largefont"
                                type="checkbox"
                                checked={fontModifier === 5}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "font-modifier",
                                            fontModifier === 0 ? 5 : 0
                                        );
                                    }
                                    setFontModifier(fontModifier === 0 ? 5 : 0);
                                }}
                            />
                            Large Font
                        </label>
                    </div>
                </ContentCluster>
                <ContentCluster title="Add-ons" smallBottomMargin>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            flexDirection: "column",
                            alignItems: "start",
                        }}
                    >
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="showepicclass"
                                type="checkbox"
                                checked={showEpicClass}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "show-epic-class",
                                            !showEpicClass
                                        );
                                    }
                                    Log(
                                        "Clicked Show Epic Class",
                                        !showEpicClass ? "true" : "false"
                                    );
                                    setShowEpicClass(!showEpicClass);
                                }}
                            />
                            Show Epic Class
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="completionpercentage"
                                type="checkbox"
                                checked={showCompletionPercentage}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "completion-percentage",
                                            !showCompletionPercentage
                                        );
                                    }
                                    Log(
                                        "Clicked Show Completion Percentage",
                                        !showCompletionPercentage
                                            ? "true"
                                            : "false"
                                    );
                                    setShowCompletionPercentage(
                                        !showCompletionPercentage
                                    );
                                }}
                            />
                            Show Completion Progress Bar
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="membercount"
                                type="checkbox"
                                checked={showMemberCount}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "member-count",
                                            !showMemberCount
                                        );
                                    }
                                    setShowMemberCount(!showMemberCount);
                                }}
                            />
                            Show Member Count
                        </label>
                        <label className="filter-panel-group-option">
                            <input
                                className="input-radio"
                                name="questguess"
                                type="checkbox"
                                checked={showQuestGuesses}
                                onChange={() => {
                                    if (!props.minimal) {
                                        localStorage.setItem(
                                            "quest-guess",
                                            !showQuestGuesses
                                        );
                                    }
                                    setShowQuestGuesses(!showQuestGuesses);
                                }}
                            />
                            Show Quest Guesses
                        </label>
                    </div>
                </ContentCluster>
            </div>
        </div>
    );
};

export default FilterOverlay;
