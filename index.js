
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const knex = require("knex");
const morgan = require("morgan");
const config = require("./config/config.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const session = require("express-session");
const csrf = require("csurf");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
let RedisStore = require("connect-redis")(session);

//won't break if .env is not present, won't overwrite default node_env or other env vars
require("dotenv").config();

const { handleSignUp } = require("./controllers/signUp");
const { handleLogin } = require("./controllers/login.js");
const { handleForgotPassword } = require("./controllers/forgotPassword.js");
const { handleAccounts } = require("./controllers/accounts.js");
const { handleTransactions } = require("./controllers/transactions.js");
const { handleLoadUser } = require("./controllers/loadUser.js");
const { handleCSRF } = require("./controllers/csrf.js");
const { handleLogout } = require("./controllers/logout.js");
const { handlePasswordReset } = require("./controllers/passwordReset.js");
const { handleLoadInitialData } = require("./controllers/loadInitialData.js");
const { handleProfileEdit }  = require("./controllers/profileEdit.js");
const { handleEmailEdit } = require("./controllers/emailEdit.js");
const { handlePasswordEdit } = require("./controllers/passwordEdit.js");
const { handleEditIndividualAccount } = require("./controllers/editIndividualAccount.js");
const { handleAddTransaction } = require("./controllers/addTransaction.js"); 
const { handleEditIndividualTransaction } = require("./controllers/editIndividualTransaction.js");
const { handleDeleteIndividualTransaction } = require("./controllers/deleteIndividualTransaction.js");
const { handleDeleteIndividualAccount } = require("./controllers/deleteIndividualAccount.js");
const { handleAddIndividualAccount }  = require("./controllers/addIndividualAccount.js");

function DBEnvironment() {
    if (process.env.NODE_ENV === "development") {
        console.log("development");
        return(
            knex({
                client: "pg",
                connection: process.env.POSTGRES_URI
            })
        )
    }
    if (process.env.NODE_ENV === "production") {
        console.log("production");
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

app.use(helmet());

// middleware 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
 }));

app.use(bodyparser.json());

if (process.env.NODE_ENV === "development" ) {
    app.use(session({
        name: "mySession",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60000 * 60 * 24 * 30
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
            maxAge: 60000 * 30
        },
        store: new RedisStore({ client: redisClient })
    }))
}


const sessionChecker = (req, res, next) => {
    console.log("sessionChecker session id", req.session.id);
    console.log("sessionChecker user id ", req.session.userId);
    if (req.session.userId) {
        next();
    }
    if(!req.session.userId) {
        return res.status(200).json({error: "No valid session."});
    }
}
 
app.use(csrf());

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  
    res.status(403);
    res.send({ error: "Invalid token, please refresh browser and try again." })
  })

app.use(morgan("combined"));
//end of middleware

app.get("/csrf", (req, res, next) => { handleCSRF(req, res, next )} );

app.post("/signup", (req, res, next) => { handleSignUp(req, res, next, postgresDB, bcrypt ); });

app.post("/login", (req, res, next) => { handleLogin(req, res, next, postgresDB, bcrypt); });

app.post("/forgotpassword", (req, res, next) => { handleForgotPassword(req, res, next, postgresDB, nodemailer, crypto ) });

app.post("/passwordreset", (req, res, next) => { handlePasswordReset(req, res, next, postgresDB, bcrypt, nodemailer )});

// protected routes
app.get("/loadinitialdata", sessionChecker, (req, res, next) => {handleLoadInitialData(req, res, next, postgresDB )});

//app.get(/loadinitialownerormemberdata, sessionChecker, )

app.post("/editindividualaccount", sessionChecker, (req, res, next) => {handleEditIndividualAccount(req, res, next, postgresDB)});

app.post("/deleteindividualaccount",sessionChecker, (req, res, next ) => { handleDeleteIndividualAccount(req, res, next, postgresDB)});

app.post("/addindividualaccount", sessionChecker, (req, res, next) =>  { handleAddIndividualAccount(req, res, next, postgresDB )});

app.post("/addtransaction", sessionChecker, (req, res, next) => {handleAddTransaction(req, res, next, postgresDB)});

app.post("/editindividualtransaction", sessionChecker, (req, res, next) => {handleEditIndividualTransaction(req, res, next, postgresDB )});

app.post("/deleteindividualtransaction", sessionChecker, (req, res, next) => {handleDeleteIndividualTransaction(req, res, next, postgresDB )});

app.get("/loaduser", sessionChecker, (req, res, next) => { handleLoadUser(req, res, next) });

app.post("/profileedit", sessionChecker, (req,res,next) => { handleProfileEdit(req, res, next, postgresDB )});

app.post("/emailedit", sessionChecker, (req, res, next) => { handleEmailEdit(req, res, next ,postgresDB)});

app.post("/passwordedit", sessionChecker, (req, res, next) => { handlePasswordEdit(req, res, next, postgresDB, bcrypt)});

app.get("/accounts", sessionChecker, (req, res, next) => { handleAccounts(req, res, next, postgresDB )});

app.get("/transactions", sessionChecker, (req, res, next) => { handleTransactions(req, res, next, postgresDB )});

app.post("/logout", sessionChecker, (req, res, next) => { handleLogout(req, res, next, postgresDB )});

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`));

