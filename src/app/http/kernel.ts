import {Request, Response, NextFunction} from "express";
import {RequestHandler, ErrorRequestHandler} from "express";
import * as bodyParser from "body-parser";
import adminMiddleware from "./middleware/admin";

interface RouteMiddleware {
    route: string;
    handler: RequestHandler | ErrorRequestHandler;
}

interface Kernel {
    middleware: Array<RequestHandler | ErrorRequestHandler>;
    routeMiddleware: RouteMiddleware[];
    handlerMiddleware: Array<RequestHandler | ErrorRequestHandler>;
}

export const kernel: Kernel = {

    // application middleware
    middleware: [

        // parses application/json and application/x-www-form-urlencoded
        bodyParser.json(),
        bodyParser.urlencoded({extended: true})

    ],

    // route middleware (executed after application middleware, before routes)
    routeMiddleware: [
        adminMiddleware
    ],

    // handler middleware (executed after routes)
    handlerMiddleware: [

        // https://expressjs.com/en/starter/faq.html
        (req: Request, res: Response, next?: NextFunction) => {
            const error: any = new Error("Not Found");
            error.status = 404;
            console.error(error.stack);
            res.status(error.status).json({error: error.message});
        },

        (error: Error, req: Request, res: Response, next?: NextFunction) => {
            console.error(error.stack);
            res.status(500).send({error: "Internal Server Error"})
        }

    ],

};
