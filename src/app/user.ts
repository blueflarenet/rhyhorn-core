import {db} from "../bootstrap/database";

export class User {

    public static find(id: number) {
        return db("users").where("id", id);
    }

}
