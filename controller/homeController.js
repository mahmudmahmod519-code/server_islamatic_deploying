const db=require("../module/db.js");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const message= require("../utils/statuscode.js");
const {signIn,signUp} = require("../utils/validation.js");
const Joi = require("joi");
const sendmail = require("../utils/sendEmail.js");
const generateOtp=require("../utils/generateOtp.js");

async function SignIN(req,res){
    const {email,password}=req.body;
    
    const {error}=signIn(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    
    const [rows,fields]=await db.execute(`
        SELECT * FROM Users WHERE email=?;
    `,[email]);
    
    if(rows.length===0||rows[0].provider==="google") return res.status(404).json({message:"please create your account or change password"});

    const user=rows[0];
  
    const isValidPassword=await bcrypt.compare(password,user.password);
    if(!isValidPassword) return res.status(401).json({message:message(401)});
    
    const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.status(200).json({
        message:message(200),
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        }
    });
}

async function SignUp(req,res){
const{
    first_name,
last_name,
email,
password,
phone_number,
country,
country_code}=req.body

    const {error}=signUp(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    

    let permission="user";
    if(email==="ahg30405060@gmail.com")permission="admin";
    
    const [rows,fields]=await db.execute(`
        SELECT * FROM Users WHERE email=? OR (phone_number=? AND phone_number IS NOT NULL);
    `,[email,phone_number]);
    
    if(rows.length>0) return res.status(409).json({message:message(409)});
    
    const hashedPassword=await bcrypt.hash(password,10);
   
const [result]=await db.query(`
    INSERT INTO Users (first_name,last_name,email,password,role,phone_number,country,country_code,provider) VALUES (?,?,?,?,?,?,?,?,'local');
    SELECT max(id) "id" FROM Users;
    `,[first_name,last_name,email,hashedPassword,permission,phone_number,country,country_code]);

    
        const id=result[1][0].id;

        
    const token=jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.status(201).json({message:message(201),userId:id,token});
}

function logout(req,res){
    res.status(200).json({message:"done delete account"});
}


async function forgetPassword(req,res){
    const {email}=req.body;
    
    const {error}=Joi.string().email().required().validate(email);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    
    let [result]=await db.query(`SELECT * FROM Users WHERE email=? ;`,[email])

    if(result.length===0)return res.status(404).send("not found the user");

    const otp=generateOtp();

    await db.execute(`UPDATE Users SET otp_code=? WHERE email=?`,[otp,result[0].email]);

    sendmail(email,otp);

    res.status(201).json({
        message:"افحص الايميل الخاص بيك لجلب الرمز",
        moveTo:"/varification",
        email,
    });
}

async function verification(req,res){
    const {email,newpassword,confirmpassword,otp}=req.body;
        
    const [result]=await db.query("SELECT * FROM Users WHERE email= ? ",[email]);
    
    if(result.length===0)return res.status(404).json({message:"not found user"});
    
    if(newpassword!==confirmpassword)return res.status(400).json({message:"confirm password not equal password"});

    if(result[0].otp_code!==otp)return res.status(400).send("wrong otp code");
    
    const hashed = await bcrypt.hash(newpassword, 10);
    await db.execute(`UPDATE Users SET password=?, otp_code=NULL WHERE email=?`, [hashed, email]);

    const token=jwt.sign({id:result[0].id},process.env.JWT_SECRET,{expiresIn:"1d"});
    
    res.status(200).json({message:"done varife",token});
}

module.exports={
    SignIN,
    SignUp,
    forgetPassword,
    logout,
    verification
}




