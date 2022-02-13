import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerAndLfmOverview } from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import BannerMessage from "../global/BannerMessage";
import PopupMessage from "../global/PopupMessage";
import ContentCluster from "../global/ContentCluster";
import Character from "./Character";

const CharacterSelect = () => {
    const TITLE = "DDO Live LFM Viewer";
    const SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        // "Hardcore",
    ];

    const [trackedCharacters, setTrackedCharacters] = React.useState([123]);

    React.useEffect(() => {}, []);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Select characters to be automatically tracked for the LFM panel."
                />
                <meta property="og:image" content="/icons/grouping-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta
                    property="twitter:image"
                    content="/icons/grouping-512px.png"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Grouping"
                subtitle="Character Selection"
            />
            <div className="content-container">
                <BannerMessage page="grouping" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title="Character Selection"
                    description="You can add your characters here and we'll automatically filter the LFM panel based on your characters' current levels."
                    noFade={true}
                />
                <ContentCluster title="Characters">
                    {trackedCharacters.map((character, i) => (
                        <Character key={i} id={character.id} />
                    ))}
                </ContentCluster>
            </div>
        </div>
    );
};

export default CharacterSelect;
