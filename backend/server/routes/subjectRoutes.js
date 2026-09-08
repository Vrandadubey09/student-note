const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const router = express.Router();

router.use(protect);

router.route("/").get(getSubjects).post(createSubject);
router.route("/:id").put(updateSubject).delete(deleteSubject);

module.exports = router;
