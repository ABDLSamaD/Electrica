const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");
const socketIo = require("socket.io");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const routes = require("./src/routes/routes");
const adminRoutes = require("./src/routes/route-admin");
const connectionDatabase = require("./src/models/connection");
const controllerRoutes = require("./src/routes/controllerRoutes");

dotenv.config({path: "../.env"});

// connection database function call from file
connectionDatabase();

// directory name vith resolve
const _dirname = path.resolve();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 200 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  message: "Too many requests, please try again after 5 minutes.",
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);
// helmet cross origin secure
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:"],
        imgSrc: ["'self'", "data:", "https://electricaapp.vercel.app"],
        connectSrc: ["'self'", "https://electricaapp.vercel.app"], // ✅ Allow API calls
        frameSrc: ["'self'"],
      },
    },
  })
);

// cors cnfiguration
const corsOptions = {
  // origin: process.env.FRONTEND_URL, // Ensure this is set correctly
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// To block API requests from other sources while allowing your frontend to work
app.use((req,res,next)=>{
  const allowedDomain = "https://electricaapp.vercel.app";
  const origin = req.headers.origin || req.headers.referer || "";
  // ✅ Allow requests without an origin (e.g., direct browser visits)
  if (!origin) return next();

  // ✅ Allow your frontend but block other domains
  if (!origin.startsWith(allowedDomain)) {
    return res.status(403).json({ message: "Forbidden: Unauthorized access" });
  }
  next();
})  

// Content Security Policy (CSP) to Restrict Requests
app.use((req,res,next)=>{
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://electricaapp.vercel.app"
  );
  next()
})

const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions,
});

app.use(cookieParser());
app.use(bodyparser.json());

// frontend path resolve config
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err)=>{
    if(err){
      res.status(404).send("Frontend Not found")
    }
  });``
});

// express-session
const sessionConfig = {
  name: "electrica",
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET, // A common session secret for both user and admin
  proxy: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions", // Common session collection
    autoRemove: "native",
  }),
};
app.use(session(sessionConfig));

app.set("trust proxy", 1); // Trust the first proxy (for Vercel, Cloudflare, etc.)

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// routes call
app.use("/api/auth", routes);
app.use("/api/adminauth", adminRoutes);
app.use("/api/reviews", controllerRoutes);
// app.get("/", (req, res) => {
//   res.send("Server electrica");
// });

// Attach `io` to `app` for use in controllers
app.set("io", io);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next(err);
});
// Default catch-all route for Vercel
app.all("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// port listen
const port = process.env.PORT || 5120;
server.listen(port, () => {
  console.log(`Server Listenning at port ${port}`);
});
