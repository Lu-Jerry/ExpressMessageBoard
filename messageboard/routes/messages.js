const express = require("express");
const router = express.Router();
const Message = require("../models/message");

//留言板首頁
router.get("/", async(req, res) => {
    try{
        let status = req.query.status;
        let msg = "";

        if(status == 1){
            msg = "儲存成功";
        }else if(status == 2){
            msg = "儲存失敗";
        }else if(status == 3){
            msg = "發生錯誤";
        }else if(status == 4){
            msg = "刪除成功";
        }

        const dataList = await Message.find().sort({ createdAt: -1 });
        res.render("./message/message", { dataList : dataList, msg : msg });
    }catch(err){
        res.status(500).json({ message : err.Message });
    }
});

//新增留言
router.get("/create", (req, res) => {
    res.render("./message/createMessage");
});

router.get("/signup", (req, res) => {
    res.render("./message/signup");
});

router.get("/login", (req, res) => {
    res.render("./message/login");
});

//新增留言儲存
router.post("/create", async(req, res) => {
    let nickname = req.body.nickname;
    let title = req.body.title;
    let content = req.body.content;

    try{
        const data = new Message({ nickname : nickname, title : title, content : content });
        await data.save();
        res.redirect("/message?status=1");
    }catch(err){
        res.redirect("/message?status=3");
    }
});

//編輯留言
router.get("/:id", async(req, res) => {
    let id = req.params.id;

    try{
        const data = await Message.findById(id);

        if(!data){
            res.redirect("/message?status=2");
        }
        res.render("./message/editMessage", { data : data});
    }catch(err){
        res.redirect("/message?status=3");
    }
});

//編輯留言儲存
router.put("/edit/:id", async(req, res) => {
    let id = req.params.id;
    let nickname = req.body.nickname;
    let title = req.body.title;
    let content = req.body.content;

    try{
        const updateData = await Message.findByIdAndUpdate(id, { nickname : nickname, title : title, content : content });
        
        if(!updateData){
            res.redirect("/message?status=2");
        }

        res.redirect("/message?status=1");
    }catch(err){
        res.redirect("/message?status=3");
    }
});

//刪除留言
router.delete("/delete/:id", async(req, res) => {
    let id = req.params.id;

    try{
        await Message.findByIdAndDelete(id);
        res.redirect("/message?status=4");
    }catch(err){
        res.redirect("/message?status=3");
    }
});





module.exports = router;