const router = require("express").Router();

const { registerCompany, login } =
require("../controllers/auth.controller");

router.post("/register-company", registerCompany);

router.post("/login", login);

module.exports = router;