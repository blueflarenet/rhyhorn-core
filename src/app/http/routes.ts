import {Router, Request, Response, NextFunction} from "express";
import {UserController} from "./controllers/user";

export default function(app: Router) {

    const userController = new UserController();

    app.get("/", (req: Request, res: Response, next?: NextFunction) => {
        res.send("Rhyhorn Core " + JSON.stringify(req.query));
    });

    app.get("/users", userController.index);
    app.post("/users", userController.store);
    app.get("/users/:id", userController.show);
    app.put("/users/:id", userController.update);
    app.delete("/users/:id", userController.destroy);

}
