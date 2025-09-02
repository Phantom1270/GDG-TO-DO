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
    const form_input=req.body;
    tasks.push(form_input);
    console.log(form_input);
    res.redirect("/");
    console.log(tasks);
});
app.get("/delete/:id",(req,res)=>{
    tasks.splice(req.params.id,1);
    res.redirect("/");
});




//ejs-- embeded java script 






app.listen(3000,()=>{
    console.log("Server started at port 3000");
});