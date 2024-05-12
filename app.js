require('dotenv').config();
const express=require("express");
const path=require("path");
const app=express();
const sendmailrouter=require("./routes/sendmailrouter.js");


//setting the path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/", sendmailrouter);

const port = 8080;
app.listen(port, ()=>{
    console.log("app is listening on port 8080");
})

