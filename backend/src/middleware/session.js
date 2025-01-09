const MongoStore = require("connect-mongo");
const session = require("express-session");

const sessionOptions = {
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false, // Set true in production with HTTPS
  },
};
// Admin session middleware
const adminSession = session({
  ...sessionOptions,
  name: "connect.sid.admin",
  secret: process.env.ADMIN_SESSION_SECRET, // A separate secret for admins
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, // MongoDB connection string
    collectionName: "admin_sessions", // Separate collection for admin sessions
  }),
});

// User session middleware
const userSession = session({
  ...sessionOptions,
  name: "connect.sid.user",
  secret: process.env.SESSION_SECRET, // A separate secret for users
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, // MongoDB connection string
    collectionName: "user_sessions", // Separate collection for user sessions
  }),
});

// Use the appropriate session middleware based on role
app.use((req, res, next) => {
  if (req.path.startsWith("/admin")) {
    adminSession(req, res, next);
  } else {
    userSession(req, res, next);
  }
});
