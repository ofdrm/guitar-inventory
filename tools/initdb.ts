import dotenv from "dotenv";
import fs from "fs-extra";
import {Client} from "pg";

const init = async () => {
    dotenv.config();
    const client = new Client();

    try {
        await client.connect();
        const sql = await fs.readFile("./tools/initdb.pgsql", {"encoding": "UTF-8"});
        const statements = sql.split(/;\s*$/m);

        for (const statement of statements) {
            if (statement.length > 3) {
                await client.query(statement);
            }
        }
    } catch (error) {
        console.log("Error occurred!!");
        console.log(error);
        throw error;
    } finally {
        await client.end();
    }
};

init().then(() => {
    console.log("finished db script");
}).catch(() => {
    console.log("finished db script with errors");
})