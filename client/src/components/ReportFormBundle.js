// Report Form
var [reportFormVisibility, setReportFormVisibility] = React.useState("none");
var [reportFormReference, setReportFormReference] = React.useState(null);
export function showReportForm(reference) {
    // Grab relevant info from the tile element that's being reported
    let referenceInfo = {
        title: reference.title,
        type: reference.chartType,
        displayType: reference.displayType,
        trendType: reference.trendType,
        showActions: reference.showActions,
        //data: reference.chartData,
    };
    // Show the report form
    setReportFormReference(referenceInfo);
    setReportFormVisibility("block");
}
export function hideReportForm() {
    setReportFormVisibility("none");
}

export { reportFormVisibility, reportFormReference };
