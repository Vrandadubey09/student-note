const prisma = require("../prisma/prisma");

const getNotes = async (req, res, next) => {
  try {
    const { subject } = req.query;

    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
        ...(subject ? { subjectId: subject } : {}),
      },
      include: { subject: true },
      orderBy: { updatedAt: "desc" },
    });

    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { subject: true },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, subjectId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!subjectId) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, userId: req.user.id },
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content || "",
        subjectId,
        userId: req.user.id,
      },
      include: { subject: true },
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, subjectId } = req.body;

    const existing = await prisma.note.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: subjectId, userId: req.user.id },
      });
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title: title && title.trim() ? title.trim() : existing.title,
        content: content !== undefined ? content : existing.content,
        subjectId: subjectId || existing.subjectId,
      },
      include: { subject: true },
    });

    res.json(note);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.note.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    await prisma.note.delete({ where: { id } });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
