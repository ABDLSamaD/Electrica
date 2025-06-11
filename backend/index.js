const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const os = require("os");
const cluster = require("cluster");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const http = require("http");
const socketIo = require("socket.io");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
// const path = require("path");
const routes = require("./src/routes/routes");
const adminRoutes = require("./src/routes/route-admin");
const connectionDatabase = require("./src/models/connection");
const controllerRoutes = require("./src/routes/controllerRoutes");

dotenv.config({ path: "../.env" });
const numCPUs = os.availableParallelism
  ? os.availableParallelism()
  : os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
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

  app.use(cookieParser());
  app.use(bodyparser.json());

  app.use(mongoSanitize());
  app.use(xss());

  // helmet cross origin secure
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "https://electricaapp.vercel.app"],
        },
      },
    })
  );
  // app.use(helmet());

  // cors cnfiguration
  const corsOptions = {
    origin: "https://electricaapp.vercel.app", // Ensure this is set correctly
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  };
  app.use(cors(corsOptions));

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
      secure: true, // Set to true in production with HTTPS
      sameSite: "None",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions", // Common session collection
      autoRemove: "native",
    }),
  };
  app.use(session(sessionConfig));

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  } // Trust the first proxy (for Vercel, Cloudflare, etc.)

  app.disable("x-powered-by");

  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: corsOptions,
  });

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

  // Attach `io` to `app` for use in controllers
  app.set("io", io);

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({ message: "Invalid JSON payload" });
    }
    next(err);
  });

  // To block API requests from other sources while allowing your frontend to work
  app.use("/api", (req, res, next) => {
    const allowedDomain = "https://electricaapp.vercel.app";
    const origin = req.headers.origin || req.headers.referer || "";

    // Allow requests without an origin (e.g., direct visits to frontend)
    if (!origin) return next();

    // Allow requests from your frontend only
    if (!origin.startsWith(allowedDomain)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Unauthorized API access" });
    }

    next();
  });

  // frontend path resolve config
  // const frontendPath = path.join(__dirname, "../frontend/dist");
  // app.use(express.static(frontendPath));

  // ✅ Default route for frontend (always at the end)
  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(frontendPath, "index.html"), (err) => {
  //     if (err) {
  //       res.status(404).send("Frontend Not found");
  //     }
  //   });
  //   ``;
  // });

  // Default catch-all route for Vercel
  app.all("*", (req, res) => {
    res.status(404).send("Not Found,");
  });

  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' https://electricaapp.vercel.app"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // ✅ Remove the early `next()` call
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // port listen
  const port = process.env.PORT || 5120;
  server.listen(port, () => {
    console.log(`Server Listenning at port ${port}`);
  });
}
