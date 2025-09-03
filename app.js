const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();


let tasks = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const sort = req.query.sort || "time";
    let sortedTasks = [...tasks];

    if (sort === "time") {
        const now = new Date();

        sortedTasks.sort((a, b) => {
            // Completed always at bottom
            if (a.done && !b.done) return 1;
            if (!a.done && b.done) return -1;

            const aDate = new Date(`${a.dueDate}T${a.dueTime}`);
            const bDate = new Date(`${b.dueDate}T${b.dueTime}`);

            // Overdue at top
            if (aDate < now && bDate >= now) return -1;
            if (bDate < now && aDate >= now) return 1;

            // Otherwise sort by nearest deadline
            return aDate - bDate;
        });
    }

    if (sort === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        sortedTasks.sort((a, b) => {
            if (a.done && !b.done) return 1;
            if (!a.done && b.done) return -1;
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    res.render("home", { taskList: sortedTasks, currentSort: sort });
});

app.get("/about", (req, res) => {
    res.send("About Page");
});
app.post("/", (req, res) => {
    const { taskName, dueDate, dueTime, priority } = req.body;
    tasks.push({ taskName, dueDate, dueTime, priority, done: false });
    const sort = req.query.sort || "time";
    res.redirect("/?sort=" + sort);
});
app.get("/delete/:id", (req, res) => {
    tasks.splice(req.params.id, 1);
    const sort = req.query.sort || "time";
    res.redirect("/?sort=" + sort);
});
app.post("/toggle-done/:id", (req, res) => {
    const id = req.params.id;
    tasks[id].done = !tasks[id].done;
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});
