
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
let RedisStore = require("connect-redis")(session);


//won't break if .env is not present, won't overwrite default node_env or other env vars
require("dotenv").config();

const { handleSignUp } = require("./controllers/signUp");
const { handleLogin } = require("./controllers/login.js");
const { handleAccounts } = require("./controllers/accounts.js");
const { handleTransactions } = require("./controllers/accounts.js");

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

let redisClient = redis.createClient(process.env.REDIS_URI);

const app = express();

if (process.env.NODE_ENV === "development" ) {
    app.use(session({
        name: "mySession",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60000 * 2
        },
        store: new RedisStore({ client: redisClient })
    }))
}
if (process.env.NODE_ENV !== "development" ) {
    app.use(session({
        name: "mySession",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 60000 * 2
        },
        store: new RedisStore({ client: redisClient })
    }))
}


const sessionChecker = (req, res, next) => {
    console.log(req.session.id);

    //res.redirect("/login");
}

app.use(cors());

app.use(morgan("combined"));

app.use(bodyparser.json());

app.use(session({secret: "Shh, its a secret!"}));

app.get('/', function(req, res){
   
});


app.post("/signup", (req, res, next) => { handleSignUp(req, res, next, postgresDB, bcrypt ); });

app.post("/login", (req, res, next) => { handleLogin(req, res, next, postgresDB, bcrypt); });

app.get("/accounts", (req, res, next) => { handleAccounts(req, res, next, postgresDB )});

app.get("/transactions", (req, res, next) => { handleTransactions(req, res, next, postgresDB )});

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`))

