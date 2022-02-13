import React from "react";

const Character = (props) => {
    function inputMode() {
        return (
            <div className="character-input">
                <div className="labeled-input">
                    <label htmlFor="character-name-field">Character name</label>
                    <input id="character-name-field" />
                </div>
                <div className="primary-button" style={{ marginLeft: "auto" }}>
                    Lookup
                </div>
            </div>
        );
    }

    return <div>{!props.id && inputMode()}</div>;
};

export default Character;
