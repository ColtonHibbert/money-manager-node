
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const knex = require("knex");
const morgan = require("morgan");
const config = require("./config/config.js");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const session = require("express-session");
const sessions = require("client-sessions")


//won't break if .env is not present, won't overwrite default node_env or other env vars
require("dotenv").config();

const { handleSignUp } = require("./controllers/signUp");
const { handleLogin } = require("./controllers/login.js");

const redisClient = redis.createClient(process.env.REDIS_URI);

function DBEnvironment() {
    if (process.env.NODE_ENV === "development") {
        console.log("development")
        return(
            knex({
                client: "pg",
                connection: process.env.POSTGRES_URI
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

postgresDB.select("*").from("user_").then(data => console.log(data));

const app = express();

/*app.use(session({
    name: "mySession",
    secret: 'futuresecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true
    }
}))*/

app.use(sessions({
    cookieName: "session",
    secret: "secretkey",
    duration: 30 * 60
}))


app.use(cors());

app.use(morgan("combined"));

app.use(bodyparser.json());

app.get('/', (req, res) => res.send('money manager root get request'));

app.post("/signup", (req, res, next) => { handleSignUp(req, res, next, postgresDB, bcrypt, app ); });

app.post("/login", (req, res, next) => { handleLogin(req, res, next, postgresDB, bcrypt); });

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`))