const prisma = require("../prisma/prisma");

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, course: true, semester: true, examDate: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, course, semester, examDate } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        course: course !== undefined ? course.trim() : undefined,
        semester: semester !== undefined ? semester.trim() : undefined,
        examDate: examDate !== undefined && examDate ? new Date(examDate) : null,
      },
      select: { id: true, name: true, email: true, course: true, semester: true, examDate: true },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalNotes, subjectsCount, notesThisWeek, user] = await Promise.all([
      prisma.note.count({ where: { userId } }),
      prisma.subject.count({ where: { userId } }),
      prisma.note.count({ where: { userId, createdAt: { gte: weekAgo } } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { examDate: true },
      }),
    ]);

    let daysUntilExam = null;
    if (user && user.examDate) {
      const exam = new Date(user.examDate);
      const ms = exam.getTime() - now.getTime();
      daysUntilExam = Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
    }

    res.json({
      totalNotes,
      subjectsCount,
      notesThisWeek,
      daysUntilExam,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getStats };
