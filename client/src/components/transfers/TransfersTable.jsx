import React from "react";

const TransfersTable = (props) => {
  const [serverAggregateData, setServerAggregateData] = React.useState(null);
  React.useEffect(() => {
    const {
      transfersToData,
      transfersActiveToData,
      transfersFromData,
      transfersActiveFromData,
    } = props;
    let serverAggregate = [];
    props.uniqueData.forEach((server, i) => {
      if (server.Name !== "Hardcore") {
        serverAggregate.push({
          server: server.Name,
          uniqueTotal: server.TotalCharacters,
          activeTotal: server.ActiveCharacters,
          totalTransfersTo: transfersToData[i].delta,
          activeTransfersTo: transfersActiveToData[i].delta,
          totalTransfersFrom: transfersFromData[i].delta,
          activeTransfersFrom: transfersActiveFromData[i].delta,
        });
      }
    });
    setServerAggregateData(serverAggregate);
  }, []);

  const getCellText = (portion, total, deltaColor) => {
    return portion < 0 || total <= 0 ? (
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
          <th>Active Population</th>
          <th>Active Transfers From</th>
          <th>Active Transfers To</th>
          <th>Total Population</th>
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
