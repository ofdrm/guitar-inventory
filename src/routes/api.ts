import * as express from "express";
import pgPromise from "pg-promise";

export const register = (app: express.Application) => {
    const port = parseInt(process.env.PGPORT || "5432", 10);
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp(config);
    const userId = "drm";

    app.get("/api/guitars/all", async (req: any, res) => {
        try {
            const guitars = await db.any(`
                SELECT id, brand, model, year, color
                FROM guitars
                WHERE user_id = $[userId]
                ORDER BY year, brand, model`, {userId}
            );
            return res.json(guitars);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error);
            return res.json({error: error.message || error});
        }
    });

    app.post("/api/guitars/add", async (req: any, res) => {
        try {
            const id = await db.one(`
                INSERT INTO guitars(user_id, brand, model, year, color)
                VALUES ($[userId], $[brand], $[model], $[year], $[color])
                RETURNING id;`,
                {userId, ...req.body}
            );
            return res.json({id});
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error);
            return res.json({error: error.message || error});
        }
    });

    app.post( `/api/guitars/update`, async ( req: any, res ) => {
        try {
            const id = await db.one( `
                UPDATE guitars
                SET brand = $[brand]
                    , model = $[model]
                    , year = $[year]
                    , color = $[color]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.delete( `/api/guitars/remove/:id`, async ( req: any, res ) => {
        try {
            const id = await db.result( `
                DELETE
                FROM    guitars
                WHERE   user_id = $[userId]
                AND     id = $[id]`,
                { userId, id: req.params.id  }, ( r ) => r.rowCount );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/guitars/find/:search`, async ( req: any, res ) => {
        try {
            const guitars = await db.any( `
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    guitars
                WHERE   user_id = $[userId]
                AND   ( brand ILIKE $[search] OR model ILIKE $[search] )`,
                { userId, search: `%${ req.params.search }%` } );
            return res.json( guitars );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/guitars/total`, async ( req: any, res ) => {
        try {
            const total = await db.one( `
            SELECT  count(*) AS total
            FROM    guitars
            WHERE   user_id = $[userId]`, { userId }, ( data: { total: number } ) => {
                return {
                    total: +data.total
                };
            } );
            return res.json( total );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

};
