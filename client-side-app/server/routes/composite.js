const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

// key generation
router.get("/generate_keys", key_gen);
// encryption
router.post("/encrypt", encrypt);

function key_gen(req, res) {
  var process = spawn("py", ["./python/keygen.py"]);
  process.stdout.on("data", (data) => {
    // console.log("type: ", data.toString().split(/(\r?\n)/g));
    var keys = data.toString().split(/(\r?\n)/g);
    res.send({ priv1: keys[0], pub1: keys[2], priv2: keys[4], pub2: keys[6] });
  });
  process.stderr.on("data", (data) => {
    console.log(`keygen spawn error:${data}`);
    res.status(400).send("key gen spawn error");
  });
}

function encrypt(req, res) {
  // console.log("ip check: ", req.body);
  var process = spawn("py", [
    "./python/encrypt.py",
    req.body.pub1,
    req.body.pub2,
    req.body.x,
  ]);
  process.stdout.on("data", (data) => {
    var cipher_str = data.toString().split(/(\r?\n)/g);
    res.send({ cipher1: cipher_str[0], cipher2: cipher_str[2] });
  });
  process.stderr.on("data", (data) => {
    console.log(`encrypt spawn error:${data}`);
    res.status(400).send("encrypt spawn error");
  });
}

module.exports = router;
