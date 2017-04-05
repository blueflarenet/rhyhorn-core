import * as cluster from "cluster";
import * as os from "os";
import {stdout} from "process";
import {App} from "./bootstrap/app";

// ---------------------------------------------------------------------------------------------------------------------

// To be able to debug correctly some special settings must be used
// tsconfig.json must have ("sourceMap": true)
// webpack.config must contain (output.devtoolModuleFilenameTemplate: "[absolute-resource-path]")

// ---------------------------------------------------------------------------------------------------------------------

// Some useful guidelines
// https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines
// https://expressjs.com/en/advanced/best-practice-performance.html

// ---------------------------------------------------------------------------------------------------------------------

function onError(error) {
    if (error.syscall != "listen") {
        throw error;
    }

    const bind = typeof app.port == "string"
        ? "Pipe " + app.port
        : "Port " + app.port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;

        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;

        default:
            throw error;
    }
}

function onListening(addr: { port: number, family: string, address: string }) {
    const bind = typeof addr == "string"
        ? "pipe " + addr
        : "port " + addr.port;

    // use stdout.write instead console.log to prevent tslint warnings
    stdout.write("Listening on " + bind + "\n");
}

// ---------------------------------------------------------------------------------------------------------------------

const app = new App();
app.setup();

// if on development environment, ignore cluster options and listen with extra handlers
if (app.env == "development") {
    const server = app.listen();
    server.on("error", onError);
    server.on("listening", () => onListening(server.address()));
}

// if not on development environment and there is just one worker, disable cluster
else if (app.workers == 1) {
    app.listen();
}

// only enable cluster if not on development mode and workers != 1
else {

    if (cluster.isMaster) {
        if (app.workers == 0) app.workers = os.cpus().length;
        for (let i = 0; i < app.workers; i++) cluster.fork();
    }
    else {
        app.listen();
    }

}

export = app;
