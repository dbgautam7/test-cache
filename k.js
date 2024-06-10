/* eslint-disable @typescript-eslint/no-var-requires */

/*
  Run this file by node  (eg: node wb-main.js )
*/

const fs = require("fs");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

//-----CONNECTION -------
const redisConnectionUrl = "redis://localhost:6379";
const mongoDB = {
    // adminUser: "",
    // adminPassword: "",
    // host: "",
    connectionUrl: "mongodb://localhost:27017/db"
};
//----- CONNECTION ENDS -------

const pythonFilePath = __dirname + "/write-behind.py";

const runWriteBehindRecipe = async () => {
    const requirements = ["rgsync", "pymongo==3.12.0"];
    const writeBehindCode = fs
        .readFileSync(pythonFilePath)
        .toString()
        // .replace("ADMIN_USER", mongoDB.adminUser)
        // .replace("ADMIN_PASSWORD", mongoDB.adminPassword)
        // .replace("ADMIN_HOST", mongoDB.host)
        .replace("MONGODB_CONNECTION_URL", mongoDB.connectionUrl);

    const client = redis.createClient({ url: redisConnectionUrl });
    client.on('connect', () => {
        console.log('Connected to Redis');
    });
    if (client) {
        await client.connect();
        const params = ["RG.PYEXECUTE", writeBehindCode,
            "REQUIREMENTS", ...requirements];
        try {
            await client.sendCommand(params);
        }
        catch (err) {
            console.error("RedisGears WriteBehind setup failed !");
            console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 4));
        }
        await client.disconnect();
        console.log("RedisGears WriteBehind set up completed.");

        //process.exit();

    }

};


runWriteBehindRecipe();



