import {Request, Response, NextFunction} from "express";

export default {
    route: "/admin",
    handler: (req: Request, res: Response, next?: NextFunction) => {
        res.end("This is an example route middleware, please edit your kernel file");
    }
};
