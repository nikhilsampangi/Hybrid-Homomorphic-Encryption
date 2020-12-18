const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

const fs = require('fs')
var ejs = require('ejs');

var compute_history = ["Node server successfully running on port 4000", "this is the next msg","hallo"]

// adding two ciphers
router.post("/add_ciphers", cipher_add);
// subtracting two ciphers
router.post("/subtract_ciphers", cipher_sub);
// adding constant to cipher
router.post("/add_constant", const_add);
// multiplying constant to cipher
router.post("/mult_const", const_mult);
// multiplying two ciphers
router.post("/mult_cipher", cipher_mult);
// show node computations output 
router.get("/output", disp_op)

function cipher_add(req, res) {
  var today = new Date()
  var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
  compute_history = [...compute_history, time+"Performing addition between "+req.body.x+" and "+req.body.y]
  var process = spawn("py", [
    "./python/compute.py",
    "1",
    req.body.pub,
    req.body.x,
    req.body.y,
  ]);
  process.stdout.on("data", (data) => {
    var sol_str = data.toString().split(/(\r?\n)/g);
    res.send({ soln: sol_str[0] });
    var today2 = new Date()
    var time2 = "[" + today2.getHours() + ':' + today2.getMinutes() + ':' + today2.getSeconds() + "] "  
    compute_history = [...compute_history, time2+"Addition operation completed, result: "+sol_str[0]]
  });
  process.stderr.on("data", (data) => {
    console.log(`e_add spawn error:${data}`);
    res.status(400).send("e_add spawn error");
    today = new Date()
    time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "  
    compute_history = [...compute_history, time+"Cipher addition error"]
  });
}

function cipher_sub(req, res) {
  var process = spawn("py", [
    "./python/compute.py",
    "4",
    req.body.pub,
    req.body.x,
    req.body.y,
  ]);
  process.stdout.on("data", (data) => {
    var sol_str = data.toString().split(/(\r?\n)/g);
    res.send({ soln: sol_str[0] });
  });
  process.stderr.on("data", (data) => {
    console.log(`e_add spawn error:${data}`);
    res.status(400).send("e_add spawn error");
  });
}

function const_add(req, res) {
  var process = spawn("py", [
    "./python/compute.py",
    "2",
    req.body.pub,
    req.body.x,
    req.body.const,
  ]);
  process.stdout.on("data", (data) => {
    var sol_str = data.toString().split(/(\r?\n)/g);
    res.send({ soln: sol_str[0] });
  });
  process.stderr.on("data", (data) => {
    console.log(`add spawn error:${data}`);
    res.status(400).send("add spawn error");
  });
}

function const_mult(req, res) {
  var process = spawn("py", [
    "./python/compute.py",
    "3",
    req.body.pub,
    req.body.x,
    req.body.const,
  ]);
  process.stdout.on("data", (data) => {
    var sol_str = data.toString().split(/(\r?\n)/g);
    res.send({ soln: sol_str[0] });
  });
  process.stderr.on("data", (data) => {
    console.log(`mult spawn error:${data}`);
    res.status(400).send("mult spawn error");
  });
}

function cipher_mult(req, res) {
  var today = new Date()
  var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
  compute_history = [...compute_history, time+"Performing multiplication between "+req.body.x+" and "+req.body.y]
  var process = spawn("py", [
    "./python/compute.py",
    "5",
    req.body.pub,
    req.body.x,
    req.body.y,
  ]);
  process.stdout.on("data", (data) => {
    var sol_str = data.toString().split(/(\r?\n)/g);
    res.send({ soln: sol_str[0] });
    var today2 = new Date()
    var time2 = "[" + today2.getHours() + ':' + today2.getMinutes() + ':' + today2.getSeconds() + "] "  
    compute_history = [...compute_history, time2+"Multiplication operation completed, result: "+sol_str[0]]
  });
  process.stderr.on("data", (data) => {
    console.log(`Cipher Multiplication spawn error:${data}`);
    res.status(400).send("Cipher Multiplication spawn error");
    today = new Date()
    time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "  
    compute_history = [...compute_history, time+"Cipher multiplication error"]
  });
}

function disp_op(req,res){
  res.writeHead(200, { 'content-type': 'text/html' })
  // fs.createReadStream('../html/index.html').pipe(res)
  fs.readFile('./html/index.html', 'utf-8', function(err, content) {
    if (err) {
      res.end('html render error occurred'+err);
      return;
    }
    var renderedHtml = ejs.render(content, {op: compute_history});  //get redered HTML code
    res.end(renderedHtml);
  });
}

module.exports = router;
