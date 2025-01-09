const checkUserStatus = (req, res, next) => {
  if (req.user && req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account is temporarily banned. Please contact support.",
      banDetails: req.user.banDetails,
    });
  }
  next();
};

// Use this middleware in routes that require user access
app.use("/user", checkUserStatus);
