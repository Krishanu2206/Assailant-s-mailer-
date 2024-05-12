const {cloudinary, uploadtocloudinary}=require("../cloudconfig");
const nodemailer= require("nodemailer");
const {google} = require("googleapis");
const ejs=require("ejs");
const path=require("path");

const rendersendmailform=async(req,res)=>{
    res.render("emailform.ejs");
};

//declaring environmental variables
const CLIENT_ID=process.env.CLIENT_ID
const CLIENT_SECRET=process.env.CLIENT_SECRET
const REDIRECT_URI=process.env.REDIRECT_URI
const REFRESH_TOKEN=process.env.REFRESH_TOKEN
const SERVICE= process.env.SERVICE
const USER=process.env.USER

const oAuth2Client=new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const postsendmail=async(req, res)=>{
    const receivers=req.body.email.receivers;
    const attachments=[];
    const fileurls=[];
    for(let i=0; i<req.files.length; i++){
        const cloudinaryresult = await uploadtocloudinary(req.files[i].path);
        console.log(`For file${i} --- ${cloudinaryresult.message}`);
        const fileurl=cloudinaryresult.result.url;
        fileurls.push(fileurl);
        console.log("FILE URL", fileurl);
        const attachment = {
            filename:req.files[i].originalname,
            path:fileurl
        }
        attachments.push(attachment);
    }
    const email=req.body.email;
    const templatepath = path.join(__dirname, "../views", "emailContent.ejs");
    ejs.renderFile(templatepath, {email}, function(err, template){
        if(err){
            console.log(err);
        } else {
            const sendMail=async()=>{
                try{
                    const accessToken=await oAuth2Client.getAccessToken(); //generating an access token each time we send email
            
                    const transport = nodemailer.createTransport({
                        service:SERVICE,
                        auth:{
                            type:'OAuth2',
                            user:USER,
                            clientId: CLIENT_ID,
                            clientSecret: CLIENT_SECRET,
                            refreshToken: REFRESH_TOKEN,
                            accessToken: accessToken,
                        }
                    })
            
                    const mailOptions={
                        from:`${email.sender}`,
                        to:receivers,
                        subject:`${email.subject}`,
                        html:template,
                        attachments:attachments
                    }
            
                    const result = await transport.sendMail(mailOptions);
                    res.redirect("/sendmail");
                    return result;
                }catch(err){
                    return err;
                }
            };
        sendMail()
        .then((result)=>console.log("Email sent successfully"))
        .catch((error)=>console.log(error.message));
        }
    })
}


module.exports={rendersendmailform, postsendmail};