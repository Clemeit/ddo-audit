import { Fetch } from "./DataLoader";

export async function GetMessage(page) {
    Fetch("https://www.playeraudit.com/api/messageservice", 5000).then(
        (response) => {
            response.forEach((message) => {
                let affectedpages = message.Pages.split(",");
                if (
                    affectedpages.includes(page) ||
                    affectedpages.includes("all")
                ) {
                    let now = new Date();
                    if (
                        now >= new Date(message.Start) &&
                        now <= new Date(message.End)
                    ) {
                        return {
                            id: message.Id,
                            name: message.Name,
                            start: message.Start,
                            end: message.End,
                            message: message.Message,
                        };
                    }
                }
            });
        }
    );
}
