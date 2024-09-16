const superAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};
module.exports = { superAdmin };
