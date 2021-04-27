require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "secret";
const MONGO_URL = process.env.MONGO_URL;
//const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("express-flash");
//const MongoDbStore = require('connect-mongodb-session');
const passport = require("passport");
const Emitter = require("events");
const mongoose = require("./app/database/connection");
const connect = require("connect-mongodb-session")(session);

// Database connection
// mongoose.connect(process.env.MONGO_CONNECTION_URL, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: true,
// });

// Session store
// let mongoStore = new MongoDbStore({
//   //mongooseConnection: connection,
//   collection: 'sessions',
// });

// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

//body parsererror

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config

var store = new connect({
  uri: MONGO_URL,
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: SECRET,
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: store,
  })
);

// Passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);
app.use((req, res) => {
  res.status(404).render("errors/404");
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
