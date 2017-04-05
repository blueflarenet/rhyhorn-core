import * as http from "http";
import * as os from "os";
import * as path from "path";
import * as express from "express";
import * as logger from "morgan";
import * as config from "./config";
import {kernel} from "../app/http/kernel";
import router from "../app/http/routes";

export class App {

    protected app: express.Express;

    env: string = process.env.NODE_ENV || "development";
    port: number = parseInt(process.env.PORT) || 3000;
    workers: number = config.application.workers || os.cpus().length;

    constructor() {
        this.app = express();
    }

    protected setMiddleware() {

        // set application-level middleware
        for (const middleware of kernel.middleware)
            this.app.use(middleware);

        // serve static files
        if (config.application.publicPath)
            this.app.use(express.static(path.join(__dirname, config.application.publicPath)));

        // "dev" is just the output style (see https://www.npmjs.com/package/morgan)
        if (config.application.logging)
            this.app.use(logger("dev"));

    }

    protected setRoutes() {

        // route middleware must be placed before setting routes
        for (const middleware of kernel.routeMiddleware) {
            if (middleware.route) this.app.use(middleware.route, middleware.handler);
            else this.app.use(middleware.handler);
        }

        // setup routes (must be placed before error handler)
        router(this.app);

    }

    protected setHandlerMiddleware() {
        for (const middleware of kernel.handlerMiddleware)
            this.app.use(middleware);
    }

    setup() {
        this.setMiddleware();
        this.setRoutes();
        this.setHandlerMiddleware();
    }

    listen(): http.Server {
        return this.app.listen(this.port);
    }

}
