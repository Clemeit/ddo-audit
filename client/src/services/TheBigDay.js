export function IsTheBigDay() {
    return false;
    if (
        new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        }) !== "03/09/22"
    ) {
        return false;
    }
    if (localStorage.getItem("no-fool") === true) {
        return false;
    }
    return true;
}
