import * as fs from "fs";
import * as path from "path";
import * as decomment from "decomment";

function readAndParse(file: string) {
    return JSON.parse(decomment(
        fs.readFileSync(
            path.join(__dirname, file)
        ).toString()
    ));
}

export const application = readAndParse("config/app.json");
export const database = readAndParse("config/database.json");
