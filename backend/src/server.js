const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const routes = require("./routes/routes");
const adminRoutes = require("./routes/adminRoutes");
const connectionDatabase = require("./models/connection");

// connection database function call from file
connectionDatabase();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  message: "Too many requests, please try again after 15 minutes.",
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);

// helmet cross origin secure
app.use(helmet());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

// express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set a strong secret
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Default session expiry (1 day)
      httpOnly: true, // Helps prevent XSS
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);

// configuration
dotenv.config();
app.use(bodyparser.json());

// routes call
app.use("/api/auth", routes);
app.use("/api/adminauth", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// port listen
const port = process.env.PORT || 5120;
app.listen(port, () => {
  console.log(`Server Listenning at port ${port}`);
});
