import React, { useEffect, useState } from "react";

interface CharacterAndLfmSubtitleProps {
    currentCounts:
        | {
              characters: number;
              lfms: number;
          }
        | undefined;
}

const CharacterAndLfmSubtitle: React.FC<CharacterAndLfmSubtitleProps> = ({
    currentCounts,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (currentCounts) {
            setIsLoaded(true);
        }
    }, [currentCounts]);

    function FormatWithCommas(number_string?: string) {
        if (!number_string) {
            return "";
        }
        return number_string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            <p
                style={{
                    textAlign: "justify",
                    fontSize: "1.5rem",
                    lineHeight: "normal",
                    color: "var(--text)",
                    marginBottom: "0px",
                }}
            >
                There are currently{" "}
                <span className="population-number">
                    {isLoaded
                        ? FormatWithCommas(currentCounts?.characters.toString())
                        : "(Loading...)"}
                </span>{" "}
                characters online and{" "}
                <span className="lfm-number">
                    {isLoaded ? currentCounts?.lfms : "(Loading...)"}
                </span>{" "}
                LFMs posted.{" "}
                {isLoaded &&
                    (currentCounts?.characters
                        ? "Are you one of them?"
                        : "Maybe everyone's anonymous.")}
            </p>
        </div>
    );
};

export default CharacterAndLfmSubtitle;
