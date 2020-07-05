import * as express from "express";
import * as api from "./api";

export const register = (app: express.Application) => {
    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get( "/guitars", ( req: any, res ) => {
        res.render( "guitars" );
    } );

    api.register(app);
};
