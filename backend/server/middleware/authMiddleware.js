const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, course: true, semester: true, examDate: true },
    });

    if (!user) {
      console.error("[Auth] User not found for decoded id:", decoded.id);
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth] Token verification failed:", error.message);
    return res
      .status(401)
      .json({ message: "Not authorized, token invalid or expired" });
  }
};

module.exports = protect;
