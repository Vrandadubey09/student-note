const bcrypt = require("bcryptjs");
const prisma = require("../prisma/prisma");
const { generateAuthToken } = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const { name, email, password, course, semester } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        course: course ? course.trim() : null,
        semester: semester ? semester.trim() : null,
      },
    });

    try {
      await prisma.subject.create({
        data: {
          name: "General Notes",
          color: "#6366f1",
          icon: "book",
          userId: user.id,
        },
      });
    } catch (subErr) {
      console.warn("Could not create default starter subject:", subErr.message);
    }

    const token = generateAuthToken(user.id);

    res.status(201).json({
      message: "Registration successful!",
      _id: user.id,
      name: user.name,
      email: user.email,
      course: user.course,
      semester: user.semester,
      examDate: user.examDate,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      course: user.course,
      semester: user.semester,
      examDate: user.examDate,
      token: generateAuthToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
