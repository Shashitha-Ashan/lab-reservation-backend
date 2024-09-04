const isLecturer = (req, res, next) => {
  if (req.user.role === "lecturer") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = isLecturer;
