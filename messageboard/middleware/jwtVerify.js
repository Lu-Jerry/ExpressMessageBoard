const express = require("express");
const jwt = require("jsonwebtoken");
const key = "jwtexercise";

const verifyToken = (req, res, next) =>{
    const token = req.headers["authorization"];

    if(!token) {
        return res.json({ code : "1000", msg : "未登入" });
    }

    jwt.verify(token, key, (err, user) => {
        if(err){
            return res.json({ code : "1000", msg : "驗證碼錯誤" });
        }
        
        next();
    });
}

module.exports = verifyToken;