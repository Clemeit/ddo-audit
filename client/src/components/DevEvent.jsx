import React from "react";

const DevEvent = (props) => {
    return (
        <div>
            <h5 style={{ fontWeight: "bold" }}>{props.title}</h5>
            <ul>
                {props.events.map((event, i) => (
                    <li key={i}>{event}</li>
                ))}
            </ul>
        </div>
    );
};

export default DevEvent;
