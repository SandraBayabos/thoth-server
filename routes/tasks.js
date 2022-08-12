const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const { route } = require("./jwtAuth");

// create task
router.post("/create", authorization, async (req, res) => {
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

      const taskData = newTask.rows[0];

      const data = {
        id: taskData.id,
        name: taskData.name,
        dueDate: taskData.due_date,
      };

      res.status(201).json({ task: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get all tasks belonging to user
router.get("/", authorization, async (req, res) => {
  try {
    const { user_id } = req.body;

    const allTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [user_id]
    );

    const data = allTasks.rows;

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update status of task
router.put("/update/:id", authorization, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { completed } = req.body;

    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

    if (task.rows[0]) {
      const updatedTask = await pool.query(
        "UPDATE tasks SET completed = $1 WHERE id = $2",
        [completed, id]
      );

      const data = {
        id: id,
        completed: completed,
        name: task.rows[0].name,
      };

      res.status(200).json({ message: "Successfully updated", data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
