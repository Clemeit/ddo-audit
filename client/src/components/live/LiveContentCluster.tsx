import React, { useEffect } from "react";
import ChartLine from "../global/ChartLine";
import ToggleButton from "../global/ToggleButton";
import {
    getServerNameTitleCase,
    getServerColorByName,
} from "../../constants/Servers";
import ContentCluster from "../global/ContentCluster";
import CharacterAndLfmSubtitle from "./CharacterAndLfmSubtitle";
import { GameStatusModel, ServerStatusModel } from "models/GameModel";

type ServerData = {
    index: number;
    is_online: boolean;
    lfm_count: number;
    queue_number: number;
    character_count: number;
    last_data_fetch: number;
    last_status_check: number;
};

type GameData = {
    timestamp: number;
    data: { [serverName: string]: ServerData };
};

type LineChartData = {
    id: string;
    color: string;
    data: { x: string; y: number }[];
};

interface LiveContentClusterProps {
    gameStatusData: GameStatusModel;
    game24HourData: GameData[] | undefined;
}

const LiveContentCluster: React.FC<LiveContentClusterProps> = ({
    gameStatusData,
    game24HourData,
}) => {
    const [lineChartDataCharacters, setLineChartDataCharacters] =
        React.useState<LineChartData[] | undefined>(undefined);
    const [lineChartDataLfms, setLineChartDataLfms] = React.useState<
        LineChartData[] | undefined
    >(undefined);
    const [population24HoursType, setPopulation24HoursType] =
        React.useState("population");
    const [currentCounts, setCurrentCounts] = React.useState<
        | {
              characters: number;
              lfms: number;
          }
        | undefined
    >(undefined);

    function getChartData() {
        if (population24HoursType === "population") {
            return lineChartDataCharacters;
        } else {
            return lineChartDataLfms;
        }
    }

    useEffect(() => {
        // Get total character and lfm count
        if (gameStatusData) {
            let totalCharacters = 0;
            let totalLfms = 0;
            Object.entries(gameStatusData.servers).forEach(
                ([serverName, serverData]: [string, ServerStatusModel]) => {
                    if (serverData) {
                        totalCharacters += serverData.character_count;
                        totalLfms += serverData.lfm_count;
                    }
                }
            );
            setCurrentCounts({
                characters: totalCharacters,
                lfms: totalLfms,
            });
        }
    }, [gameStatusData]);

    useEffect(() => {
        // Get line chart data
        if (game24HourData) {
            let lineChartDataCharacters: LineChartData[] = [];
            let lineChartDataLfms: LineChartData[] = [];
            game24HourData.forEach((gameData) => {
                Object.entries(gameData.data).forEach(
                    ([serverName, serverData]) => {
                        const serverNameTitleCase =
                            getServerNameTitleCase(serverName);

                        // Characters
                        if (
                            !lineChartDataCharacters.find(
                                (d) => d.id === serverNameTitleCase
                            )
                        ) {
                            lineChartDataCharacters.push({
                                id: serverNameTitleCase,
                                color: getServerColorByName(serverName),
                                data: [],
                            });
                        }
                        if (serverData.character_count != null) {
                            lineChartDataCharacters
                                .find((d) => d.id === serverNameTitleCase)
                                ?.data.push({
                                    x: new Date(
                                        gameData.timestamp * 1000
                                    ).toISOString(),
                                    y: serverData.character_count,
                                });
                        }

                        // LFMs
                        if (
                            !lineChartDataLfms.find(
                                (d) => d.id === serverNameTitleCase
                            )
                        ) {
                            lineChartDataLfms.push({
                                id: serverNameTitleCase,
                                color: getServerColorByName(serverName),
                                data: [],
                            });
                        }
                        if (serverData.lfm_count != null) {
                            lineChartDataLfms
                                .find((d) => d.id === serverNameTitleCase)
                                ?.data.push({
                                    x: new Date(
                                        gameData.timestamp * 1000
                                    ).toISOString(),
                                    y: serverData.lfm_count,
                                });
                        }
                    }
                );
            });
            lineChartDataCharacters = lineChartDataCharacters.sort((a, b) =>
                b.id?.localeCompare(a.id)
            );
            lineChartDataLfms = lineChartDataLfms.sort((a, b) =>
                b.id?.localeCompare(a.id)
            );
            setLineChartDataCharacters(lineChartDataCharacters);
            setLineChartDataLfms(lineChartDataLfms);
        }
    }, [game24HourData]);

    return (
        <ContentCluster
            title={`Live ${
                population24HoursType === "population"
                    ? "Population"
                    : "LFM Count"
            }`}
            altTitle="Live Data"
            description={
                <span>
                    <CharacterAndLfmSubtitle currentCounts={currentCounts} />
                </span>
            }
        >
            <ToggleButton
                textA="Population data"
                textB="LFM data"
                isA={population24HoursType === "population"}
                isB={population24HoursType === "groups"}
                doA={() => {
                    setPopulation24HoursType("population");
                }}
                doB={() => {
                    setPopulation24HoursType("groups");
                }}
            />
            <ChartLine
                data={getChartData()}
                trendType="day"
                activeFilter="Server Activity"
                showActions={false}
                showLastUpdated={true}
                reportReference={null}
                forceHardcore={true}
            />
        </ContentCluster>
    );
};

export default LiveContentCluster;
