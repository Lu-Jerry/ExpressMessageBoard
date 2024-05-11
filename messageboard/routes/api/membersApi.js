const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { route } = require('../users');
const router = express.Router();
const Members = require("../../models/members");

const key = "jwtexercise";

//註冊
router.post("/signup", async(req, res) => {
    let account = req.body.account;
    let userName = req.body.userName;
    let password = req.body.password;

    let checkAccount = await Members.find({ account : account });

    //驗證帳號是否存在
    if(checkAccount[0]){
      return res.json({ code : "1000", msg : "帳號已存在，不能重複新增" });
    }

   //密碼加密
    const hashPassowrd = await bcrypt.hash(password, 10); //密碼加密

    Members.create({ account : account, name : userName, password : hashPassowrd })
    .then(data => {
        res.json({ code : "0000", msg : "註冊成功" });
    })
    .catch(error => {
        res.json({ code : "1000", msg : "註冊失敗" });
    });        
});

//登入
router.post("/login", async(req, res) => {
    let account = req.body.account;
    let password = req.body.password;

    let checkAccount = await Members.find({ account : account });

    //驗證帳號是否存在
    if(!checkAccount[0]){
        return res.json({ code : "1000", msg : "帳號不存在" });
    }

    //密碼驗證
    if(!await bcrypt.compare(password, checkAccount[0].password)){
        return res.json({ code : "1000", msg  : "登入錯誤" });
    }

    //JWT簽章 paylog,key
    const token = jwt.sign({
        account,
        username:checkAccount[0].name
    }, key);

    res.setHeader("Authorization", token);
    res.json({ code : "0000", msg : "登入成功", token });
});

module.exports = router;