exports.someProtectedController = (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user });
};
