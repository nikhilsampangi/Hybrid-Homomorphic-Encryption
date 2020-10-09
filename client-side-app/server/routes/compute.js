const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

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

function cipher_add(req, res) {
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
  });
  process.stderr.on("data", (data) => {
    console.log(`e_add spawn error:${data}`);
    res.status(400).send("e_add spawn error");
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
  });
  process.stderr.on("data", (data) => {
    console.log(`Cipher Multiplication spawn error:${data}`);
    res.status(400).send("Cipher Multiplication spawn error");
  });
}

module.exports = router;
