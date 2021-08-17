import React from "react";
import LinkHere from "./LinkHere";
import Tile from "./Tile";

const Card = (props) => {
    function CardId() {
        return props.title.replace(/[^A-Z0-9\s]+/gi, "").replace(/[\s]+/g, "_");
    }

    return (
        <div
            id={CardId()}
            className={"card" + (props.className ? " " + props.className : "")}
        >
            {props.showLink && (
                <LinkHere link={props.pageName + "#" + CardId()} />
            )}
            <center>
                {props.title && (
                    <h1
                        className={
                            props.hideTitleOnMobile ? "mobile-title" : ""
                        }
                        style={{
                            textDecoration: "underline",
                            fontWeight: "bold",
                            fontSize: "xx-large",
                        }}
                    >
                        {props.title}
                    </h1>
                )}
                <h5 style={{ fontWeight: "bold" }}>{props.subtitle}</h5>
            </center>
            {props.children}
            {props.tiles &&
                props.tiles.map((tile, i) => (
                    <div key={tile.title}>
                        {i !== 0 ? <hr /> : <div></div>}
                        <Tile
                            title={tile.title}
                            description={tile.description}
                            content={tile.content}
                            serverName={props.serverName}
                        />
                    </div>
                ))}
        </div>
    );
};

export default Card;
