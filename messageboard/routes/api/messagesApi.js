const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const verifyToken = require("../../middleware/jwtVerify");

//取得所有留言
router.get("/message", verifyToken, async(req, res) => {
    //const dataList = await Message.find().sort({ createdAt: -1 });

    Message.find().sort({ createdAt: -1 })
    .then(data =>{
        res.json({ code : "0000", msg : "讀取成功", data : data });
    }).catch(error => {
        res.json({ code : "1000", msg : "讀取失敗", data : null });
    });
});

//留言刪除
router.put("/delete", verifyToken, async(req, res) => {
    let id = req.body.id;
    
    Message.findByIdAndDelete(id)
    .then(data => {
        res.json({ code : "0000", msg : "刪除成功" });
    })
    .catch(error => {
        res.json({ code : "1000", msg : "刪除失敗" });
    })
});

//新增留言
router.post("/store", verifyToken, async(req, res) => {
    let nickname = req.body.nickname;
    let title = req.body.title;
    let content = req.body.content;

    Message.create({ nickname : nickname, title : title, content : content })
    .then(data => {
        res.json({ code : "0000", msg : "新增成功" });
    })
    .catch(error => {
        res.json({ code : "1000", msg : "新增失敗" });
    });
});

//取得單筆資料
router.post("/data", verifyToken, async(req, res) => {
    let messageId = req.body.messageId;
    
    Message.findById(messageId)
    .then(data =>{
        res.json({ code : "0000", msg : "讀取成功", data : data });
    }).catch(error => {
        res.json({ code : "1000", msg : "讀取失敗", data : null });
    });
});

//編輯留言儲存
router.put("/update", verifyToken, async(req, res) => {
    let nickname = req.body.nickname;
    let title = req.body.title;
    let content = req.body.content;
    let messageId = req.body.messageId;

    Message.findByIdAndUpdate(messageId, { nickname : nickname, title : title, content : content })
    .then(data => {
        res.json({ code : "0000", msg : "修改成功" });
    })
    .catch(error => {
        res.json({ code : "1000", msg : "修改失敗" });
    });
})

module.exports = router;