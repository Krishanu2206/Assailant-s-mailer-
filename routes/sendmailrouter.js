const express=require("express");
const router=express.Router();
const {rendersendmailform, postsendmail}=require("../controllers/sendmail");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

router.get("/sendmail", rendersendmailform)
router.post("/sendmail", upload.array("email[attachments]", 20), postsendmail);

module.exports=router;