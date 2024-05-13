const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const verifyToken = require("../../middleware/jwtVerify");
const { check, validationResult } = require("express-validator");

//取得所有留言
router.get("/message", verifyToken, (req, res) => {
    //const dataList = await Message.find().sort({ createdAt: -1 });

    Message.find().sort({ createdAt: -1 })
    .then(data =>{
        res.json({ code : "0000", msg : "讀取成功", data : data });
    }).catch(error => {
        res.json({ code : "1000", msg : "讀取失敗", data : null });
    });
});

//留言刪除
router.put("/delete", verifyToken, check("id").notEmpty().withMessage("資料不正確"), (req, res) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        let id = req.body.id;
    
        Message.findByIdAndDelete(id)
        .then(data => {
            res.json({ code : "0000", msg : "刪除成功" });
        })
        .catch(error => {
            res.json({ code : "1000", msg : "刪除失敗" });
        });
    }else{
        let resultMessages = createResultMessages(errors.array());

        res.json({ code : "1000", msg : resultMessages });
    }
});

//新增留言
router.post("/store", verifyToken, check("nickname").notEmpty().withMessage("請輸入姓名"), 
check("title").notEmpty().withMessage("請輸入標題"),
check("content").notEmpty().withMessage("請輸入留言內容"),
(req, res) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
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
    }else{
        let resultMessages = createResultMessages(errors.array());

        res.json({ code : "1000", msg : resultMessages });
    }   
});

//取得單筆資料
router.post("/data", verifyToken, verifyToken, check("messageId").notEmpty().withMessage("留言資料不正確"), 
(req, res) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        let messageId = req.body.messageId;
    
        Message.findById(messageId)
        .then(data =>{
            res.json({ code : "0000", msg : "讀取成功", data : data });
        }).catch(error => {
            res.json({ code : "1000", msg : "讀取失敗", data : null });
        });
    }else{
        let resultMessages = createResultMessages(errors.array());

        res.json({ code : "1000", msg : resultMessages });
    }    
});

//編輯留言儲存
router.put("/update", verifyToken, 
check("nickname").notEmpty().withMessage("請輸入姓名"), 
check("title").notEmpty().withMessage("請輸入標題"),
check("content").notEmpty().withMessage("請輸入留言內容"),
check("messageId").notEmpty().withMessage("留言資料不正確"),
 (req, res) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
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
    }else{
        let resultMessages = createResultMessages(errors.array());

        res.json({ code : "1000", msg : resultMessages });
    }    

   
})

//將驗證錯訊息席轉換成字串
function createResultMessages(errorsArray){
    let resultMessages = [];

    for(let iKey in errorsArray){
        let tempMessage = errorsArray[iKey].msg;           
        resultMessages.push(tempMessage);
    }
    
    return resultMessages.toString();
}

module.exports = router;