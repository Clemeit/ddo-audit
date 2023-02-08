import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { Submit } from "../../services/CommunicationService";

// Browser check
// Opera 8.0+
const isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== "undefined";

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
const isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

const ReportIssueForm = (props) => {
  // Set comment
  React.useEffect(() => {
    if (props.componentReference === null) return;
    if (props.componentReference.precomment !== null) {
      set_usercomment(props.componentReference.precomment);
    }
  }, [props]);

  var [emptyset, set_emptyset] = React.useState(false);
  var [badset, set_badset] = React.useState(false);
  var [badload, set_badload] = React.useState(false);
  var [usercomment, set_usercomment] = React.useState("");
  var [submitted, set_submitted] = React.useState(false);

  function handleEmptySet(event) {
    set_emptyset(event.target.checked);
  }
  function handleBadSet(event) {
    set_badset(event.target.checked);
  }
  function handleBadLoad(event) {
    set_badload(event.target.checked);
  }
  function handleUserComment(event) {
    set_usercomment(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (usercomment === "") {
      alert("Please enter a brief description.");
      return;
    }

    if (submitted) return;
    set_submitted(true);

    let browser;
    if (isChrome) browser = "chrome";
    else if (isFirefox) browser = "firefox";
    else if (isIE) browser = "ie";
    else if (isEdge) browser = "edge";
    else if (isOpera) browser = "opera";
    else browser = "unknown";

    let options = {
      emptyset: emptyset,
      badset: badset,
      badload: badload,
    };

    Submit(
      "User reported issue from " + props.page,
      JSON.stringify(props.componentReference) +
        " || " +
        usercomment +
        " || " +
        JSON.stringify(options)
    );

    setTimeout(props.hideReportForm, 2000);

    setTimeout(() => {
      set_emptyset(false);
      set_badset(false);
      set_badload(false);
      set_usercomment("");
      set_submitted(false);
    }, 2000);
  }

  return (
    <div style={{ display: props.visibility }}>
      <div className="overlay" onClick={props.hideReportForm} />
      <div className="report-issue-form card">
        <CloseSVG
          className="nav-icon"
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            props.hideReportForm();
          }}
        />
        <h3 style={{ fontWeight: "bold" }}>Report an issue</h3>
        <p>
          Use this form to report an issue with the website or the data it
          provides. If your issue requires a two-way conversation or you'd like
          to request a change or addition to the site, you should contact me on
          the DDO Forums, Reddit, or Discord.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <p style={{ marginBottom: "0px" }}>Check all that apply:</p>
          <label className="large-label">
            <input
              name="emptyset"
              type="checkbox"
              style={{
                marginRight: "7px",
                marginLeft: "7px",
              }}
              checked={emptyset}
              onChange={handleEmptySet}
            />
            The graph is empty
          </label>
          <label className="large-label">
            <input
              name="badset"
              type="checkbox"
              style={{
                marginRight: "7px",
                marginLeft: "7px",
              }}
              checked={badset}
              onChange={handleBadSet}
            />
            The graph displays the wrong data
          </label>
          <label className="large-label">
            <input
              name="badload"
              type="checkbox"
              style={{
                marginRight: "7px",
                marginLeft: "7px",
              }}
              checked={badload}
              onChange={handleBadLoad}
            />
            The graph didn't render properly
          </label>
          <label className="large-label">Comment:</label>
          <textarea
            className="form-control"
            placeholder="A brief description"
            name="comment"
            style={{ marginBottom: "5px" }}
            value={usercomment}
            onChange={handleUserComment}
          />
          <label>
            Element: "
            {props.componentReference && props.componentReference.title}"
          </label>
          <input
            className={submitted ? "btn btn-success" : "btn btn-primary"}
            type="submit"
            value={submitted ? "We got your report. Thanks!" : "Submit"}
          />
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
