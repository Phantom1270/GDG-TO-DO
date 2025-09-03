const express= require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const app= express();


let tasks=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("home",{taskList:tasks});
});

app.get("/about",(req,res)=>{
    res.send("About Page");
});
app.post("/",(req,res)=>{
    const { taskName, dueDate ,dueTime} = req.body;
    tasks.push({ taskName, dueDate,dueTime ,done:false});
    res.redirect("/");
});
app.get("/delete/:id",(req,res)=>{
    tasks.splice(req.params.id,1);
    res.redirect("/");
});
app.post("/toggle-done/:id", (req, res) => {
  const id = req.params.id;
  tasks[id].done = !tasks[id].done; 
  res.sendStatus(200); 
});

app.listen(3000,()=>{
    console.log("Server started at port 3000");
});