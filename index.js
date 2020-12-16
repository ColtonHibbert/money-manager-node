
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const knex = require("knex");
const morgan = require("morgan");
const config = require("./config/config.js");
//won't break if .env is not present, won't overwrite default node_env or other env vars
require("dotenv").config();

function DBEnvironment() {
    if (process.env.NODE_ENV === "development") {
        console.log("development")
        //below for local db
        /*return (
            knex({
                client: "pg",
                connection: {
                    host: "127.0.0.1",
                    user: config.DBUser,
                    password: config.DBPassword,
                    database: config.DBLocal
                }
            })
        )*/
        //Docker DB
        /*
        return(
            knex({
                client: "pg",
                connection: {
                    host: process.env.POSTGRES_HOST,
                    user: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB
                }
            })
        )
        */
        //Docker DB uri
        return(
            knex({
                client: "pg",
                connection: process.env.DATABASE_URI
            })
        )
    }
    if (process.env.NODE_ENV === "production") {
        console.log("production")
        return (
            knex({
                client: "pg",
                connection: {
                    connectionString: process.env.DATABASE_URL,
                    ssl: true
            }})
        )
    }
}

const postgresDB = DBEnvironment();

const app = express();

app.use(morgan("combined"));

app.get('/', (req, res) => res.send('money manager root get request'));

console.log("volumes change 9");

//const data = postgresDB.select("*").from("user_").then(data => console.log(data));

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`))