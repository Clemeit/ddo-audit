import React from "react";
import CharacterSelectModal from "./CharacterSelectModal";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";
import { Post } from "../../services/DataLoader";
import $ from "jquery";
import { Link } from "react-router-dom";
import PageMessage from "./PageMessage";

const RegistrationList = (props) => {
  const CHARACTER_LIMIT = 15;

  const [characterIds, setCharacterIds] = React.useState(null);
  const [characters, setCharacters] = React.useState([]);
  const [characterSelectModalShown, setCharacterSelectModalShown] =
    React.useState(false);
  const [lastServer, setLastServer] = React.useState("Argonnessen");
  const [characterExists, setCharacterExists] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingNewCharacter, setLoadingNewCharacter] = React.useState(false);
  const [showFailedToFetchError, setShowFailedToFetchError] =
    React.useState(false);

  function addCharacter(characterId) {
    setLoadingNewCharacter(true);
    if (characterIds != null && characterIds.includes(characterId)) {
      setCharacterExists(true);
      return;
    }
    setCharacterExists(false);
    setCharacterIds((characterIds) => [...(characterIds || []), characterId]);
    setCharacterSelectModalShown(false);
  }

  function removeCharacter(index) {
    setLoadingNewCharacter(true);
    setCharacterIds((characterIds) =>
      characterIds.filter((_, i) => i != index)
    );
  }

  function clearRegisteredCharacters() {
    setCharacterIds([]);
    localStorage.setItem("registered-characters", "[]");
    window.location.reload();
  }

  React.useEffect(() => {
    let registeredCharacters = JSON.parse(
      localStorage.getItem("registered-characters") || "[]"
    );
    if (registeredCharacters.length) {
      setCharacterIds(registeredCharacters);
    }
  }, []);

  const refreshButtonAngleRef = React.useRef(null);
  function refreshButtonHandler() {
    refreshButtonAngleRef.current += 360;
    $(`.character-refresh-button`).css({
      transform: `rotate(${refreshButtonAngleRef.current}deg)`,
    });
  }

  function refreshCharacters() {
    // lookup each character by ID and populate 'characters' list
    setLoading(true);
    localStorage.setItem("registered-characters", JSON.stringify(characterIds));

    Post(
      "https://api.ddoaudit.com/players/lookup",
      { playerids: characterIds },
      10000
    )
      .then((response) => {
        if (response.error) {
          setCharacters([]);
        } else {
          let sortedCharacters = [];
          if (characterIds != null) {
            characterIds.forEach((characterId) => {
              sortedCharacters.push(
                response.filter(
                  (character) => character.PlayerId === characterId
                )?.[0]
              );
            });
          }
          setCharacters(sortedCharacters);
        }
      })
      .catch(() => setShowFailedToFetchError(true))
      .finally(() => {
        setLoading(false);
        setLoadingNewCharacter(false);
      });
  }

  React.useEffect(() => {
    if (characterIds) {
      if (characterIds.length) {
        setLoading(true);
        refreshCharacters();
      } else {
        localStorage.setItem("registered-characters", "[]");
        setCharacters([]);
        setLoading(false);
        setLoadingNewCharacter(false);
      }
    } else {
      setLoading(false);
      setLoadingNewCharacter(false);
    }
  }, [characterIds]);

  function getClassString(character) {
    let classes = [];
    character?.Classes?.forEach((cls) => {
      if (cls.Name != null && cls.Name != "Epic" && cls.Name != "Legendary") {
        classes.push(`${cls.Name} ${cls.Level}`);
      }
    });
    return classes.join(", ");
  }

  function getStatusIndicatorColor(character) {
    if (!character) return "blue";
    if (character.Anonymous) {
      return "blue";
    } else {
      return character.Online ? "green" : "red";
    }
  }

  function atCharacterLimit() {
    if (characterIds == null) return false;
    return characterIds.length >= CHARACTER_LIMIT;
  }

  function hasCharacters() {
    return characters && characters.length > 0;
  }

  return (
    <div>
      {showFailedToFetchError && (
        <PageMessage
          type="error"
          title="Failed to fetch character data"
          message={
            <>
              Please try again later. If the error persists, try clearing your
              browser cookies or let me know of the problem via the{" "}
              <Link to="/suggestions">Suggestions page</Link>.
            </>
          }
          submessage="Reason: the server took too long to respond"
          fontSize={1.3}
          pushBottom={true}
        />
      )}
      {characterSelectModalShown && (
        <CharacterSelectModal
          lastServer={lastServer}
          submit={(characterId, serverName) => {
            addCharacter(characterId);
            setLastServer(serverName);
          }}
          close={() => setCharacterSelectModalShown(false)}
          characterExists={characterExists}
        />
      )}
      <div>
        {characters &&
          characters.length > 0 &&
          characters.map((character, i) => (
            <div key={i}>
              {character && (
                <div style={{ padding: "10px 0px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getStatusIndicatorColor(character),
                        width: "13px",
                        height: "13px",
                        borderRadius: "100%",
                        marginRight: "7px",
                      }}
                    />
                    <h4
                      style={{
                        marginBottom: "0px",
                        marginRight: "10px",
                      }}
                    >
                      {character.Name}
                    </h4>
                    <DeleteSVG
                      className="nav-icon should-invert"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeCharacter(i)}
                    />
                    <RefreshSVG
                      className="nav-icon should-invert character-refresh-button"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        refreshCharacters(i);
                        refreshButtonHandler();
                      }}
                    />
                  </div>
                  <table
                    className="character-table"
                    style={{
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          color: "var(--text-faded)",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          lineHeight: "15px",
                        }}
                      >
                        <th
                          style={{
                            width: "10%",
                          }}
                        >
                          Server
                        </th>
                        <th
                          style={{
                            width: "10%",
                          }}
                        >
                          Level
                        </th>
                        <th
                          style={{
                            width: "20%",
                          }}
                        >
                          Guild
                        </th>
                        <th
                          style={{
                            width: "30%",
                          }}
                        >
                          Classes
                        </th>
                        <th
                          style={{
                            width: "30%",
                          }}
                        >
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        style={{
                          fontSize: "1.4rem",
                        }}
                      >
                        <td
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          {character.Server}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          {character.TotalLevel}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          {character.Guild}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          {getClassString(character)}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          {character.Location?.Name ||
                            "Somewhere in the Aether"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <hr
                style={{
                  backgroundColor: "var(--text)",
                  opacity: 0.2,
                  margin: "5px 3px",
                }}
              />
              {i == characters.length - 1 && <div style={{ height: "20px" }} />}
            </div>
          ))}
        {loading && (!hasCharacters() || loadingNewCharacter) && (
          <div
            style={{
              minHeight: "150px",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ textAlign: "center", fontSize: "1.5rem" }}>
              Loading...
            </span>
          </div>
        )}
      </div>
      <div>
        {!atCharacterLimit() && (
          <div
            className="primary-button should-invert"
            onClick={() => {
              setCharacterSelectModalShown(true);
              setCharacterExists(false);
            }}
          >
            Add Character
          </div>
        )}
        {atCharacterLimit() && (
          <span
            style={{
              fontSize: "1.3rem",
              color: "var(--text-faded)",
            }}
          >
            Character limit reached. You may have up to {CHARACTER_LIMIT}{" "}
            registered characters.
          </span>
        )}
      </div>
    </div>
  );
};

export default RegistrationList;
