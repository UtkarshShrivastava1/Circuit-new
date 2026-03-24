const router = require("express").Router();

const { registerCompany, login,logout } =
require("../controllers/auth.controller");

router.post("/register-company", registerCompany);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;