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
const routes = require("./routes/routes");
const adminRoutes = require("./routes/route-admin");
const connectionDatabase = require("./models/connection");
const { sendEmail } = require("./utils/mail");

// connection database function call from file
connectionDatabase();

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

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

app.use(cookieParser());

// express-session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.USER_SESSION_SECRET || "user_secret",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "user_sessions",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Secure against XSS
      secure: false, // Set true in production with HTTPS
    },
  })
);

// configuration
dotenv.config();
app.use(bodyparser.json());

// routes call
app.use("/api/auth", routes);
app.use("/api/adminauth", adminRoutes);

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
  res.status(500).send({ error: "Something broke!", type: err.stack });
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
