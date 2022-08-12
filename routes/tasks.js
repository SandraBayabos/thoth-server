const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const { route } = require("./jwtAuth");

// create task
router.post("/create", async (req, res) => {
  try {
    const { name, user_id, due_date } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);

    if (user.rows[0]) {
      const newTask = await pool.query(
        "INSERT INTO tasks (name, user_id, due_date) VALUES ($1, $2, $3) RETURNING *",
        [name, user_id, due_date]
      );

      const taskData = newTask.rows[0]

      const data = {
        id: taskData.id,
        name: taskData.name,
        dueDate: taskData.due_date,
      };

      res.status(201).json({ task: data });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

// get all tasks belonging to user
// router.get("/", async (req, res) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
