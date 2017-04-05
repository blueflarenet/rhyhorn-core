import {Request, Response, NextFunction} from "express";
import * as bcrypt from "bcrypt";
import * as Promise from "bluebird";
import {User} from "../../user";

export class UserController {

    index = (req: Request, res: Response, next?: NextFunction) => {
        res.send("List all users");
    };

    // create = (req: Request, res: Response, next?: NextFunction) => {
    //     res.send("Show user creation form");
    // };

    store = (req: Request, res: Response, next?: NextFunction) => {

        const email: string = req.body.email;
        const password: string = req.body.password;
        let passwordHash: string;

        Promise.all([
            bcrypt.hash(password, 10).then((hash) => {
                passwordHash = hash;
            })
        ]).then(() => {

            res.json({
                email,
                hash: passwordHash
            });

        });

    };

    show = (req: Request, res: Response, next?: NextFunction) => {
        User.find(req.params.id).then((data) => {

            res.json(data);

        }, (error) => {

            res.json({error});

        });
    };

    // edit = (req: Request, res: Response, next?: NextFunction) => {
    //     res.send("Show user edit form");
    // };

    update = (req: Request, res: Response, next?: NextFunction) => {
        res.send("Update user on database");
    };

    destroy = (req: Request, res: Response, next?: NextFunction) => {
        res.send("Remove user " + req.params.id);
    };

}
