const fs = require("fs");
const path = require("path");
const prisma = require("../prisma/prisma");
const { uploadDir } = require("../middleware/upload");

const getFiles = async (req, res, next) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      include: { note: { include: { subject: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(files);
  } catch (error) {
    next(error);
  }
};

const addFilesToNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const note = await prisma.note.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      req.files.forEach((f) => fs.unlinkSync(path.join(uploadDir, f.filename)));
      return res.status(404).json({ message: "Note not found" });
    }

    const records = req.files.map((f) =>
      prisma.file.create({
        data: {
          noteId: id,
          userId: req.user.id,
          name: f.originalname,
          path: `/uploads/${f.filename}`,
          mimeType: f.mimetype || "application/octet-stream",
          size: f.size,
        },
      })
    );

    const created = await Promise.all(records);

    res.status(201).json(created);
  } catch (error) {
    if (req.files) {
      req.files.forEach((f) => fs.unlinkSync(path.join(uploadDir, f.filename)));
    }
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const file = await prisma.file.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const absPath = path.join(uploadDir, path.basename(file.path));
    if (fs.existsSync(absPath)) {
      fs.unlinkSync(absPath);
    }

    await prisma.file.delete({ where: { id: file.id } });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFiles, addFilesToNote, deleteFile };