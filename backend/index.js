const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const routes = require("./src/routes/routes");
const adminRoutes = require("./src/routes/route-admin");
const connectionDatabase = require("./src/models/connection");
const { sendEmail } = require("./src/utils/mail");

dotenv.config();

// connection database function call from file
connectionDatabase();

const _dirname = path.resolve();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  message: "Too many requests, please try again after 5 minutes.",
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);
// helmet cross origin secure
app.use(helmet());

// cors cnfiguration
const corsConfig = {
  origin: "http://localhost:5173/",
  credentials: true, // Allow sending credentials (cookies)
  methods: ["GET", "POST", "PUT", "PATCH"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

app.use(cookieParser());
app.use(bodyparser.json());

// frontend path resolve config
app.use(express.static(path.join(_dirname, "/frontend/dist")));

// express-session
// const isProduction = process.env.NODE_ENV === "production";
const sessionConfig = {
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: true, // Set to true in production with HTTPS
  },
  secret: process.env.SESSION_SECRET, // A common session secret for both user and admin
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions", // Common session collection
  }),
};
app.use(session(sessionConfig));

// routes call
app.use("/api/auth", routes);
app.use("/api/adminauth", adminRoutes);
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// contact support
app.post("/user/contact-support", async (req, res) => {
  try {
    const { email, message } = req.body;
    let subject = "Request of User";
    let text = message;
    sendEmail(email, subject, text);
    res.status(200).json({
      message:
        "Your request has been received. Support will contact you shortly.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error contacting support", error });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next(err);
});

// port listen
const port = process.env.PORT || 5120;
app.listen(port, () => {
  console.log(`Server Listenning at port ${port}`);
});