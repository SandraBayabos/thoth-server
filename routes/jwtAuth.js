const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

// registration
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User with this email already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    const token = jwtGenerator(newUser.rows[0].id);

    const userData = newUser.rows[0];

    const data = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };
    console.log(data);

    res.status(201).json({ token: token, user: data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Can't find email");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Password is incorrect");
    }

    const token = jwtGenerator(user.rows[0].id);

    const userData = user.rows[0];

    const data = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };

    res.json({ token: token, user: data });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// auto login
router.get("/auto_login", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
