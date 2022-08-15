const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const { route } = require("./jwtAuth");

// create task
router.post("/create", authorization, async (req, res) => {
  try {
    const { name, due_date, tags } = req.body;

    const user_id = req.user;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);

    if (user.rows[0]) {
      const newTask = await pool.query(
        "INSERT INTO tasks (name, user_id, due_date) VALUES ($1, $2, $3) RETURNING *",
        [name, user_id, due_date]
      );

      const taskData = newTask.rows[0];

      // tags = [tag1, tag2]

      tags.forEach((tag) => {
        // insert tag.name into tags table
        const newTags = pool
          // insert tag_id and task_id into task_tag table
          .query("INSERT INTO tags (name) VALUES ($1) RETURNING *", [tag])
          .then((response) =>
            response.rows.forEach((taskTag) => {
              const newTaskTag = pool
                .query(
                  "INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) RETURNING *",
                  [taskData.id, taskTag.id]
                )
                .then((response) => console.log(response));
            })
          );
      });

      const data = {
        id: taskData.id,
        name: taskData.name,
        due_date: taskData.due_date,
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
    const user_id = req.user;

    const allTasks = await pool.query(
      "SELECT id, due_date, completed, i.name AS name, t.tag_array FROM tasks i JOIN (SELECT it.task_id AS id, array_agg(t.name) AS tag_array FROM task_tags it JOIN tags t ON t.id = it.tag_id GROUP BY it.task_id) t USING (id) WHERE user_id = $1 ORDER BY due_date ASC",
      [user_id]
    );

    const data = allTasks.rows;

    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
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
