const prisma = require("../prisma/prisma");

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
      return res.status(404).json({ message: "Note not found" });
    }

    const records = req.files.map((f) => {
      const mime = f.mimetype || "application/octet-stream";
      // Convert in-memory buffer to base64 Data URI for serverless compatibility
      const dataUri = `data:${mime};base64,${f.buffer.toString("base64")}`;

      return prisma.file.create({
        data: {
          noteId: id,
          userId: req.user.id,
          name: f.originalname,
          path: dataUri,
          mimeType: mime,
          size: f.size,
        },
      });
    });

    const created = await Promise.all(records);

    res.status(201).json(created);
  } catch (error) {
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

    await prisma.file.delete({ where: { id: file.id } });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFiles, addFilesToNote, deleteFile };