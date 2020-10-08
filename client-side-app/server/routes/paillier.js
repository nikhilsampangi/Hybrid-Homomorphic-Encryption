const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

//routes
// test function
// router.get("/test", testFunction);

// function testFunction(req, res) {
//   var process = spawn("py", ["./python/test.py", req.query.test]);
//   process.stdout.on("data", (data) => {
//     // console.log(`data:${data}`);
//     console.log("type: ", data.toString().split(" "));
//     res.send(data);
//   });
//   process.stderr.on("data", (data) => {
//     console.log(`error:${data}`);
//     res.status(400).send("spawn error: ", data);
//   });
// }

// 1.Algorithm realted

// decryption
router.post("/decrypt", decrypt);

function decrypt(req, res) {
  var process = spawn("py", [
    "./python/Paillierdecrypt.py",
    req.body.priv,
    req.body.pub,
    req.body.x,
  ]);
  process.stdout.on("data", (data) => {
    var pln_txt_str = data.toString().split(/(\r?\n)/g);
    res.send({ pln_txt: pln_txt_str[0] });
  });
  process.stderr.on("data", (data) => {
    console.log(`decrypt spawn error:${data}`);
    res.status(400).send("decrypt spawn error");
  });
}

// 2.Homomorphic properties

// adding two ciphers
router.post("/add_ciphers", cipher_add);
// adding constant to cipher
router.post("/add_constant", const_add);
// multiplying constant to cipher
router.post("/mult_const", const_mult);

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

module.exports = router;
