import React from "react";
import ChartGenderPie from "./ChartGenderPie";
import ChartRacePie from "./ChartRacePie";
import GuildAffiliationPie from "./ChartGuildAffiliationPie";
import ChartGuildAffiliationPie from "./ChartGuildAffiliationPie";
import ChartActivityPie from "./ChartActivityPie";

const ServerDemographicsContainer = (props) => {
    var [filteredGenderData, set_filteredGenderData] = React.useState(null);
    var [filteredGuildData, set_filteredGuildData] = React.useState(null);
    var [filteredActivityData, set_filteredActivityData] = React.useState(null);
    var [filteredRaceData, set_filteredRaceData] = React.useState(null);
    var [filteredClassData, set_filteredClassData] = React.useState(null);

    React.useEffect(() => {
        if (props.genderData) {
            let genderset;
            genderset = props.genderData.filter(
                (set) => set.ServerName === props.server
            );
            if (genderset) genderset = genderset[0];

            switch (props.filter) {
                case "All Players":
                    genderset = genderset.AllPlayers;
                    break;
                case "Active Players":
                    genderset = genderset.ActivePlayers;
                    break;
                case "Inactive Players":
                    genderset = genderset.InactivePlayers;
                    break;
                case "End-game Players":
                    genderset = genderset.EndgamePlayers;
                    break;
                default:
                    genderset = genderset.AllPlayers;
                    break;
            }

            set_filteredGenderData([
                {
                    id: "Male",
                    label: "Male",
                    value: genderset.Male,
                },
                {
                    id: "Female",
                    label: "Female",
                    value: genderset.Female,
                },
            ]);
        }

        if (props.activityData) {
            let activityset;
            activityset = props.activityData.filter(
                (set) => set.ServerName === props.server
            );
            if (activityset) activityset = activityset[0];

            set_filteredActivityData([
                {
                    id: "Active",
                    label: "Active",
                    value: activityset.Active,
                },
                {
                    id: "Inactive",
                    label: "Inactive",
                    value: activityset.Inactive,
                },
            ]);
        }

        if (props.raceData) {
            let raceset;
            raceset = props.raceData.filter(
                (set) => set.ServerName === props.server
            );
            if (raceset) raceset = raceset[0];

            switch (props.filter) {
                case "All Players":
                    raceset = raceset.AllPlayers;
                    break;
                case "Active Players":
                    raceset = raceset.ActivePlayers;
                    break;
                case "Inactive Players":
                    raceset = raceset.InactivePlayers;
                    break;
                case "End-game Players":
                    raceset = raceset.EndgamePlayers;
                    break;
                default:
                    raceset = raceset.AllPlayers;
                    break;
            }

            set_filteredRaceData([
                {
                    id: "Human",
                    label: "Human",
                    value: raceset.Human,
                },
                {
                    id: "Gnome",
                    label: "Gnome",
                    value: raceset.Gnome,
                },
                {
                    id: "Warforged",
                    label: "Warforged",
                    value: raceset.Warforged,
                },
                {
                    id: "Halfling",
                    label: "Halfling",
                    value: raceset.Halfling,
                },
                {
                    id: "Elf",
                    label: "Elf",
                    value: raceset.Elf,
                },
                {
                    id: "Dwarf",
                    label: "Dwarf",
                    value: raceset.Dwarf,
                },
                {
                    id: "Drow Elf",
                    label: "Drow Elf",
                    value: raceset.DrowElf,
                },
                {
                    id: "Tiefling",
                    label: "Tiefling",
                    value: raceset.Tiefling,
                },
                {
                    id: "Half Elf",
                    label: "Half Elf",
                    value: raceset.HalfElf,
                },
                {
                    id: "Half Orc",
                    label: "Half Orc",
                    value: raceset.HalfOrc,
                },
                {
                    id: "Bladeforged",
                    label: "Bladeforged",
                    value: raceset.Bladeforged,
                },
                {
                    id: "Shadar-kai",
                    label: "Shadar-kai",
                    value: raceset.Shadarkai,
                },
                {
                    id: "PDK",
                    label: "PDK",
                    value: raceset.PurpleDragonKnight,
                },
                {
                    id: "Sun Elf",
                    label: "Sun Elf",
                    value: raceset.SunElf,
                },
                {
                    id: "Deep Gnome",
                    label: "Deep Gnome",
                    value: raceset.DeepGnome,
                },
                {
                    id: "Dragonborn",
                    label: "Dragonborn",
                    value: raceset.Dragonborn,
                },
                {
                    id: "Aasimar",
                    label: "Aasimar",
                    value: raceset.Aasimar,
                },
                {
                    id: "Aasimar Scourge",
                    label: "Aasimar Scourge",
                    value: raceset.AasimarScourge,
                },
                {
                    id: "Wood Elf",
                    label: "Wood Elf",
                    value: raceset.WoodElf,
                },
                {
                    id: "Tiefling Scoundrel",
                    label: "Tiefling Scoundrel",
                    value: raceset.TieflingScoundrel,
                },
                {
                    id: "Shifter",
                    label: "Shifter",
                    value: raceset.Shifter,
                },
                {
                    id: "Razorclaw Shifter",
                    label: "Razorclaw Shifter",
                    value: raceset.RazorclawShifter,
                },
            ]);
        }

        if (props.classData) {
            let classset;
            classset = props.classData.filter(
                (set) => set.ServerName === props.server
            );
            if (classset) classset = classset[0];

            switch (props.filter) {
                case "All Players":
                    classset = classset.AllPlayers;
                    break;
                case "Active Players":
                    classset = classset.ActivePlayers;
                    break;
                case "Inactive Players":
                    classset = classset.InactivePlayers;
                    break;
                case "End-game Players":
                    classset = classset.EndgamePlayers;
                    break;
                default:
                    classset = classset.AllPlayers;
                    break;
            }

            set_filteredClassData([
                {
                    id: "Sorcerer",
                    label: "Sorcerer",
                    value: classset.Sorcerer,
                },
                {
                    id: "Wizard",
                    label: "Wizard",
                    value: classset.Wizard,
                },
                {
                    id: "Barbarian",
                    label: "Barbarian",
                    value: classset.Barbarian,
                },
                {
                    id: "Bard",
                    label: "Bard",
                    value: classset.Bard,
                },
                {
                    id: "Cleric",
                    label: "Cleric",
                    value: classset.Cleric,
                },
                {
                    id: "Fighter",
                    label: "Fighter",
                    value: classset.Fighter,
                },
                {
                    id: "Paladin",
                    label: "Paladin",
                    value: classset.Paladin,
                },
                {
                    id: "Ranger",
                    label: "Ranger",
                    value: classset.Ranger,
                },
                {
                    id: "Rogue",
                    label: "Rogue",
                    value: classset.Rogue,
                },
                {
                    id: "Monk",
                    label: "Monk",
                    value: classset.Monk,
                },
                {
                    id: "Favored Soul",
                    label: "Favored Soul",
                    value: classset.FavoredSoul,
                },
                {
                    id: "Warlock",
                    label: "Warlock",
                    value: classset.Warlock,
                },
                {
                    id: "Artificer",
                    label: "Artificer",
                    value: classset.Artificer,
                },
                {
                    id: "Druid",
                    label: "Druid",
                    value: classset.Druid,
                },
                {
                    id: "Alchemist",
                    label: "Alchemist",
                    value: classset.Alchemist,
                },
            ]);
        }

        if (props.guildData) {
            let guildset;
            guildset = props.guildData.filter(
                (set) => set.ServerName === props.server
            );
            if (guildset) guildset = guildset[0];

            switch (props.filter) {
                case "All Players":
                    guildset = guildset.AllPlayers;
                    break;
                case "Active Players":
                    guildset = guildset.ActivePlayers;
                    break;
                case "Inactive Players":
                    guildset = guildset.InactivePlayers;
                    break;
                case "End-game Players":
                    guildset = guildset.EndgamePlayers;
                    break;
                default:
                    guildset = guildset.AllPlayers;
                    break;
            }

            set_filteredGuildData([
                {
                    id: "Affiliated",
                    label: "Affiliated",
                    value: guildset.Affiliated,
                },
                {
                    id: "Unaffiliated",
                    label: "Unaffiliated",
                    value: guildset.Unaffiliated,
                },
            ]);
        }
    }, [
        props.genderData,
        props.guildData,
        props.raceData,
        props.classData,
        props.filter,
        props.server,
    ]);

    return (
        <div
            className={
                "server-demographic-container " +
                (props.filters ? "chart-filterable" : "")
            }
        >
            <div className="server-demographic-chart">
                <div className="server-demographic-header">
                    <h4
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                        }}
                    >
                        By Gender
                    </h4>
                    <p style={{ marginBottom: "0px" }}>
                        Gender on {props.server}
                    </p>
                </div>
                <ChartGenderPie data={filteredGenderData} />
            </div>
            <div className="server-demographic-chart">
                <div className="server-demographic-header">
                    <h4
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                        }}
                    >
                        By Guild Affiliation
                    </h4>
                    <p style={{ marginBottom: "0px" }}>
                        Guild Affiliation on {props.server}
                    </p>
                </div>
                <ChartGuildAffiliationPie data={filteredGuildData} />
            </div>
            <div className="server-demographic-chart">
                <div className="server-demographic-header">
                    <h4
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                        }}
                    >
                        By Activity
                    </h4>
                    <p style={{ marginBottom: "0px" }}>
                        Active Players on {props.server}
                    </p>
                </div>
                <ChartActivityPie data={filteredActivityData} />
            </div>
            <div className="server-demographic-chart">
                <div className="server-demographic-header">
                    <h4
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                        }}
                    >
                        By Race
                    </h4>
                    <p style={{ marginBottom: "0px" }}>
                        Race on {props.server}
                    </p>
                </div>
                <ChartRacePie data={filteredRaceData} />
            </div>
            <div className="server-demographic-chart">
                <div className="server-demographic-header">
                    <h4
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                        }}
                    >
                        By Class
                    </h4>
                    <p style={{ marginBottom: "0px" }}>
                        Class on {props.server}
                    </p>
                </div>
                <ChartRacePie data={filteredClassData} />
            </div>
        </div>
    );
};

export default ServerDemographicsContainer;
