import React from "react";
import { ReactComponent as FilterSVG } from "../assets/global/filter.svg";
import { ReactComponent as ExpandSVG } from "../assets/global/expand.svg";
import Log from "../functions/LogThis";

const serverNames = [
    "Argonnessen",
    "Cannith",
    "Ghallanda",
    "Khyber",
    "Orien",
    "Sarlona",
    "Thelanis",
    "Wayfinder",
    "Hardcore",
];

const Filter = (props) => {
    var [filterIndices, set_filterIndices] = React.useState(null);

    var [serverFilter, set_serverFilter] = React.useState([
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
    ]);

    React.useEffect(() => {
        if (props.filters) {
            let initialFilters = [];
            props.filters.forEach((filter) => {
                initialFilters.push(filter.index);
            });
            set_filterIndices(initialFilters);
        }
    }, []);

    function handleServerFilter(index) {
        let newFilter = [...serverFilter];
        newFilter[index] = !newFilter[index];
        set_serverFilter(newFilter);
        props.serverFilterReference(newFilter);
        Log("Server Filter", serverNames[index]);
    }

    function handleFilter(filter, filterIndex, optionIndex) {
        filter.reference(filter.options[optionIndex]);

        let newFilterState = [...filterIndices];
        newFilterState[filterIndex] = optionIndex;

        set_filterIndices(newFilterState);
        Log("Generic Filter", filter.options[optionIndex]);
    }

    function renderServerFilters() {
        if (props.showServerFilters)
            return (
                <div className="chart-filter">
                    <div className="chart-filter-item">
                        <span style={{ fontWeight: "bold" }}>
                            Filter by Server{" "}
                        </span>
                        <ExpandSVG className="link-icon" />
                        <div className="filter-dropdown">
                            {serverNames.map((server, i) => (
                                <div key={server}>
                                    <label className="input-radio-label">
                                        <input
                                            className="input-radio"
                                            name={server}
                                            type="checkbox"
                                            checked={serverFilter[i]}
                                            onChange={() =>
                                                handleServerFilter(i)
                                            }
                                        />
                                        {server}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
    }

    return (
        <div className="chart-filter-banner">
            <FilterSVG className="link-icon" style={{ marginLeft: "10px" }} />
            {props.filters &&
                filterIndices &&
                props.filters.map((filter, filterIndex) => (
                    <div className="chart-filter" key={filterIndex}>
                        <div className="chart-filter-item">
                            <span style={{ fontWeight: "bold" }}>
                                {filter.name}{" "}
                            </span>
                            <span>
                                (
                                {filterIndices[filterIndex] !== null
                                    ? filter.options[filterIndices[filterIndex]]
                                    : ""}
                                )
                            </span>
                            <ExpandSVG className="link-icon" />
                            <div className="filter-dropdown">
                                {filter.options.map((option, optionIndex) => (
                                    <label
                                        className="input-radio-label"
                                        key={optionIndex}
                                    >
                                        <input
                                            className="input-radio"
                                            type="radio"
                                            name={
                                                filter.reference.name +
                                                filter.name
                                            }
                                            value={option}
                                            key={option}
                                            onChange={() =>
                                                handleFilter(
                                                    filter,
                                                    filterIndex,
                                                    optionIndex
                                                )
                                            }
                                            checked={
                                                optionIndex ===
                                                filterIndices[filterIndex]
                                            }
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            {renderServerFilters()}
        </div>
    );
};

export default Filter;
