const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

module.exports = router;

// decryption
router.post("/decrypt", decrypt);

function decrypt(req, res) {
  var process = spawn("py", [
    "./python/RSAdecrypt.py",
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