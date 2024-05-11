const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const key = "jwtexercise";

const users = {
  "aaa@gmail.com" :{
    "username" : "Alex",
    "password" : "$2b$10$xbBGxFBnMp45r846q1yk3ujarj8iaXycCv3FaHCbdQsp4yaLx3jx6"
  }
}; //模擬使用者資料庫

//註冊
router.post("/signup", async(req, res) => {
  const { email, password, username } = req.body;

  if(users[email]){
    return res.status(400).send({ msg:"用戶已存在" });
  }

  //密碼加密
  const hashPassowrd = await bcrypt.hash(password, 10); //密碼加密

  //資料儲存
  users[email] = {
    password : hashPassowrd,
    username //為何此段不需要寫成 username : username
  }

  res.status(201).send({ msg : "註冊成功" });
});

//登入
router.post("/login", async(req, res) => {
  const { email, password } = req.body;

  //驗證用戶是否存在
  const user = users[email];

  if(!user){
    return res.status(401).send({ msg  : "查無此用戶" });
  }

  //密碼驗證
  if(!await bcrypt.compare(password, user.password)){
    return res.status(401).send({ msg  : "登入錯誤" });
  }

  //JWT簽章 paylog,key
  const token = jwt.sign({
    email,
    username:user.username
  }, key);

  //回應
  res.send({ msg : "成功", token });
});

router.get("/profile", (req, res) => {
  const token = req.headers["authorization"];

  //驗證有接收到token
  if(!token){
    return res.status(401).send({ msg : "未登入" });
  }

  //驗證token，user為儲存在jwt payload中的資料
  jwt.verify(token, key, (err, user) => {
    if(err){
      return res.status(403).send({ msg : "token錯誤" });
    }

    res.send({ msg : "登入成功", user });
  });
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
