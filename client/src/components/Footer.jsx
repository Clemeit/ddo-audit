import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <center>
                    <p
                        style={{
                            fontStyle: "italic",
                            marginBottom: "0px",
                            lineHeight: "20px",
                        }}
                    >
                        Brought to you by Clemeit of Thelanis.
                        <br />
                        This free utility generates no revenue and is subject to
                        change without notice.
                    </p>
                </center>
            </div>
        );
    }
}
