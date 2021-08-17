import React from "react";

const Card = (props) => {
    return (
        <div className="card">
            {props.title && <h2 className="card-title">{props.title}</h2>}
            {props.subtitle && props.subtitle}
        </div>
    );
};

export default Card;
