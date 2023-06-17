import React from "react";

const TransfersTable = (props) => {
  const FROZEN_DATA = [
    {
      server: "Argonnessen",
      activeTotal: 21347,
      activeTransfersFrom: 131,
      activeTransfersTo: 0,
      uniqueTotal: 68220,
      totalTransfersFrom: 1994,
      totalTransfersTo: 0,
    },
    {
      server: "Cannith",
      activeTotal: 11896,
      activeTransfersFrom: 419,
      activeTransfersTo: 0,
      uniqueTotal: 43260,
      totalTransfersFrom: 4123,
      totalTransfersTo: 0,
    },
    {
      server: "Ghallanda",
      activeTotal: 28168,
      activeTransfersFrom: 1143,
      activeTransfersTo: 0,
      uniqueTotal: 65831,
      totalTransfersFrom: 9793,
      totalTransfersTo: 0,
    },
    {
      server: "Khyber",
      activeTotal: 11595,
      activeTransfersFrom: 174,
      activeTransfersTo: 0,
      uniqueTotal: 48287,
      totalTransfersFrom: 2230,
      totalTransfersTo: 51,
    },

    {
      server: "Orien (FREE)",
      activeTotal: 32862,
      activeTransfersFrom: 5,
      activeTransfersTo: 2259,
      uniqueTotal: 101827,
      totalTransfersFrom: 571,
      totalTransfersTo: 20670,
    },
    {
      server: "Sarlona (FREE)",
      activeTotal: 11420,
      activeTransfersFrom: 73,
      activeTransfersTo: 335,
      uniqueTotal: 55074,
      totalTransfersFrom: 1243,
      totalTransfersTo: 5059,
    },
    {
      server: "Thelanis",
      activeTotal: 12913,
      activeTransfersFrom: 131,
      activeTransfersTo: 0,
      uniqueTotal: 52514,
      totalTransfersFrom: 2111,
      totalTransfersTo: 0,
    },
    {
      server: "Wayfinder",
      activeTotal: 8079,
      activeTransfersFrom: 126,
      activeTransfersTo: 0,
      uniqueTotal: 22002,
      totalTransfersFrom: 2055,
      totalTransfersTo: 0,
    },
  ];

  const [serverAggregateData, setServerAggregateData] = React.useState(null);
  React.useEffect(() => {
    let serverAggregate = [];
    FROZEN_DATA.forEach((server, i) => {
      if (server.Name !== "Hardcore") {
        serverAggregate.push({
          ...server,
        });
      }
    });
    setServerAggregateData(serverAggregate);
  }, []);

  const getCellText = (portion, total, deltaColor) => {
    return portion <= 0 || total <= 0 ? (
      <span style={{ color: "var(--text-faded)" }}>N/A</span>
    ) : (
      <span>
        {portion} {getTransferDelta(portion, total, deltaColor)}
      </span>
    );
  };

  const getTransferDelta = (portion, total, deltaColor) => {
    const percentage = Math.round((portion / total) * 1000) / 10;
    let className = "";
    if (percentage >= 1) {
      className = deltaColor;
    }
    return <span className={className}>({percentage}%)</span>;
  };

  return (
    <table className="content-table">
      <thead>
        <tr>
          <th>Server</th>
          <th>Active Characters</th>
          <th>Active Transfers From</th>
          <th>Active Transfers To</th>
          <th>Total Characters</th>
          <th>Total Transfers From</th>
          <th>Total Transfers To</th>
        </tr>
      </thead>
      <tbody>
        {serverAggregateData &&
          serverAggregateData.map(
            (
              {
                server,
                uniqueTotal,
                activeTotal,
                totalTransfersTo,
                activeTransfersTo,
                totalTransfersFrom,
                activeTransfersFrom,
              },
              i
            ) => (
              <tr key={i}>
                <td>
                  {server}
                  {server === "Orien" || server === "Sarlona" ? " (FREE)" : ""}
                </td>
                <td style={{ textAlign: "right" }}>{activeTotal}</td>
                <td style={{ textAlign: "right" }}>
                  {getCellText(activeTransfersFrom, activeTotal, "red-text")}
                </td>
                <td style={{ textAlign: "right" }}>
                  {getCellText(activeTransfersTo, activeTotal, "green-text")}
                </td>
                <td style={{ textAlign: "right" }}>{uniqueTotal}</td>
                <td style={{ textAlign: "right" }}>
                  {getCellText(totalTransfersFrom, uniqueTotal, "red-text")}
                </td>
                <td style={{ textAlign: "right" }}>
                  {getCellText(totalTransfersTo, uniqueTotal, "green-text")}
                </td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};

export default TransfersTable;
