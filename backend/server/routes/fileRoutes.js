const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getFiles, deleteFile } = require("../controllers/fileController");

const router = express.Router();

router.use(protect);

router.route("/").get(getFiles);
router.route("/:id").delete(deleteFile);

module.exports = router;