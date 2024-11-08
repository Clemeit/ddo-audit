import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Fetch } from "../../services/DataLoader";
import ContentCluster from "../global/ContentCluster";
import FAQ from "./FAQ";
import { SERVER_LIST_LOWERCASE } from "../../constants/Servers";

const News = (props) => {
    return (
        <ContentCluster title="Of Special Note">
            {props.news == null ? (
                <span
                    style={{
                        textAlign: "justify",
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text)",
                        marginBottom: "30px",
                    }}
                >
                    Loading news...
                </span>
            ) : props.news.length > 0 ? (
                <div
                    style={{
                        marginBottom: "30px",
                    }}
                >
                    {props.news.map((message, i) => (
                        <div key={i}>
                            <p
                                style={{
                                    textAlign: "justify",
                                    fontSize: "1.5rem",
                                    lineHeight: "normal",
                                    color: "var(--text)",
                                }}
                            >
                                <b>{message.date}:</b>{" "}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: message.description,
                                    }}
                                ></span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p
                    style={{
                        textAlign: "justify",
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text)",
                        marginBottom: "30px",
                    }}
                >
                    There's nothing going on in our neck of the woods!
                </p>
            )}
            {props.news != null && (
                <Link
                    to="/suggestions"
                    className="secondary-button should-invert full-width-mobile"
                    style={{
                        color: "var(--text)",
                        textDecoration: "none",
                    }}
                >
                    Make a suggestion
                </Link>
            )}
        </ContentCluster>
    );
};

export default News;
