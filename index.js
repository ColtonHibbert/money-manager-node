
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const knex = require("knex");
const morgan = require("morgan");
const config = require("./config/config.js");
//won't break if .env is not present, won't overwrite default node_env or other env vars
require("dotenv").config();

const login = require('./controllers/login.js');

function DBEnvironment() {
    if (process.env.NODE_ENV === "development") {
        console.log("development")
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

//const data = postgresDB.select("*").from("user_").then(data => console.log(data));

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`))