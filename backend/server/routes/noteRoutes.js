const express = require("express");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const { addFilesToNote } = require("../controllers/fileController");

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.post("/:id/files", upload.array("files"), addFilesToNote);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router;
