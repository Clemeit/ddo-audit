import React from "react";

const DevEvent = (props) => {
    return (
        <div>
            <h5
                className="dev-event-title"
                style={{ color: props.color || "" }}
            >
                {props.title}
            </h5>
            <ul className="dev-event-content">
                {props.events.map((event, i) => (
                    <li key={i}>{event}</li>
                ))}
            </ul>
        </div>
    );
};

export default DevEvent;
