const prisma = require("../prisma/prisma");

const SUBJECT_ICONS = ["book", "flask", "calculator", "globe", "music", "paintbrush", "dumbbell", "landmark"];
const SUBJECT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const sanitizeSubject = (s) => ({
  id: s.id,
  name: s.name,
  color: SUBJECT_COLORS.includes(s.color) ? s.color : SUBJECT_COLORS[0],
  icon: SUBJECT_ICONS.includes(s.icon) ? s.icon : "book",
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
  noteCount: s._count ? s._count.notes : 0,
});

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { notes: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(subjects.map(sanitizeSubject));
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const existing = await prisma.subject.findFirst({
      where: { userId: req.user.id, name: name.trim() },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "A subject with this name already exists" });
    }

    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        color: SUBJECT_COLORS.includes(color) ? color : SUBJECT_COLORS[0],
        icon: SUBJECT_ICONS.includes(icon) ? icon : "book",
        userId: req.user.id,
      },
      include: { _count: { select: { notes: true } } },
    });

    res.status(201).json(sanitizeSubject(subject));
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const existing = await prisma.subject.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const duplicate = await prisma.subject.findFirst({
      where: {
        userId: req.user.id,
        id: { not: id },
        name: name && name.trim() ? name.trim() : existing.name,
      },
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "A subject with this name already exists" });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name: name && name.trim() ? name.trim() : existing.name,
        color: color ? color : existing.color,
        icon: icon ? icon : existing.icon,
      },
      include: { _count: { select: { notes: true } } },
    });

    res.json(sanitizeSubject(subject));
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.subject.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await prisma.subject.delete({ where: { id } });

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
