require("dotenv").config();
const express=require("express");
const logger=require("./startup/logging");
const path = require("path");
const cors=require("cors");
const passport = require('passport');
require('./startup/AouthConfig');


const port=process.env.PORT||3000;
const app=express();

app.use("/upload",express.static('upload'));
app.use(passport.initialize());

app.use(cors({
    origin:[process.env.DOMAIN_NAME,'app://'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']

}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));


require("./startup/router")(app);

app.listen(port,()=>{
    logger.info("run on port");
});
