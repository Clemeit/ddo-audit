import React, { useEffect, useState } from "react";
import { GameStatusModel } from "models/GameModel";

interface CharacterAndLfmSubtitleProps {
    gameStatusData: GameStatusModel;
}

const CharacterAndLfmSubtitle: React.FC<CharacterAndLfmSubtitleProps> = ({
    gameStatusData,
}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [totalLfms, setTotalLfms] = useState<number>(0);
    const [totalCharacters, setTotalCharacters] = useState<number>(0);

    useEffect(() => {
        if (gameStatusData && gameStatusData.servers) {
            const servers = gameStatusData.servers;
            let totalLfms = 0;
            let totalCharacters = 0;
            Object.entries(servers).forEach(([_, serverData]) => {
                totalLfms += serverData.lfm_count;
                totalCharacters += serverData.character_count;
            });
            setTotalLfms(totalLfms);
            setTotalCharacters(totalCharacters);
            setIsLoaded(true);
        }
    }, [gameStatusData]);

    function FormatWithCommas(number_string: string) {
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
                        ? FormatWithCommas(totalCharacters.toString())
                        : "(Loading...)"}
                </span>{" "}
                players online and{" "}
                <span className="lfm-number">
                    {isLoaded ? totalLfms : "(Loading...)"}
                </span>{" "}
                LFMs posted.{" "}
                {isLoaded &&
                    (totalCharacters
                        ? "Are you one of them?"
                        : "Maybe everyone's anonymous.")}
            </p>
        </div>
    );
};

export default CharacterAndLfmSubtitle;
