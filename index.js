var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var ejs = require('ejs');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


// var task = ["buy bread", "Solve gfg ques", "todo project"];
// var complete = ["prep for ADI", "comp NALR"];


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

var task = new Array();
var complete = new Array();

app.post('/addtask', (req, res) => {
    var todo = req.body.newtask;
    task.push(todo);
    res.redirect("/");
    var sql = "INSERT INTO info (sl_no, task) VALUES ?";
    var values = [[, todo]];   
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        
    });
});
app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        con.query("DELETE FROM info WHERE task=?", completeTask, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
          });
        task.splice(task.indexOf(completeTask), 1);
    }
    res.redirect("/");
});


app.get("/", function (req, res) {
    res.render("index", { task: task, complete: complete });
});

app.listen(5000, function () {
    console.log("server is running on port 5000");
});