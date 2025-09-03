const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const { v4: uuidv4 } = require("uuid");

let users = [];
let tasks = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/register", (req, res) => {
    res.render("register"); // register.ejs
});

app.post("/register", (req, res) => {
    const { userId, password } = req.body;
    if (users.find(u => u.userId === userId)) {
        return res.send("User ID already exists!");
    }
    users.push({ userId, password });
    res.redirect("/");
});
app.get("/logout", (req, res) => {
  // Just redirect to login for now
  res.redirect("/");
});


app.get("/", (req, res) => {
    res.render("login"); // login.ejs
});

app.post("/login", (req, res) => {
    const { userId, password } = req.body;
    const user = users.find(u => u.userId === userId && u.password === password);
    if (!user) return res.send("Wrong User ID or password");

    // Redirect to home with userId as param
    res.redirect(`/user/${userId}`);
});


app.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    if (!users.find(u => u.userId === userId)) return res.redirect("/login");

    const sort = req.query.sort || "time";
    let userTasks = tasks.filter(task => task.userId === userId);

    // Sorting logic
    if (sort === "time") {
        const now = new Date();
        userTasks.sort((a, b) => {
            if (a.done && !b.done) return 1;
            if (!a.done && b.done) return -1;

            const aDate = new Date(`${a.dueDate}T${a.dueTime}`);
            const bDate = new Date(`${b.dueDate}T${b.dueTime}`);

            if (aDate < now && bDate >= now) return -1;
            if (bDate < now && aDate >= now) return 1;

            return aDate - bDate;
        });
    } else if (sort === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        userTasks.sort((a, b) => {
            if (a.done && !b.done) return 1;
            if (!a.done && b.done) return -1;
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    res.render("home", { taskList: userTasks, currentSort: sort, userId });
});

app.post("/user/:userId/add", (req, res) => {
    const { userId } = req.params;
    const { taskName, dueDate, dueTime, priority } = req.body;

    if (!users.find(u => u.userId === userId)) return res.redirect("/login");

    tasks.push({
        taskId: uuidv4(),   // generates unique ID
        userId,
        taskName,
        dueDate,
        dueTime,
        priority,
        done: false
    });

    res.redirect(`/user/${userId}?sort=${req.query.sort || "time"}`);
});

app.get("/user/:userId/delete/:taskId", (req, res) => {
    const { userId, taskId } = req.params;

    // Keep only tasks that don't match this userId + taskId
    tasks = tasks.filter(task => !(task.userId === userId && task.taskId === taskId));

    res.redirect(`/user/${userId}?sort=${req.query.sort || "time"}`);
});


app.post("/user/:userId/toggle-done/:taskId", (req, res) => {
    const { userId, taskId } = req.params;

    const task = tasks.find(task => task.userId === userId && task.taskId === taskId);
    if (task) task.done = !task.done;

    res.sendStatus(200);
});


// Use Render-provided port or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
