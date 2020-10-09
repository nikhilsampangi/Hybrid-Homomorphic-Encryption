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

module.exports = router;
