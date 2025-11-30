const db=require("../module/db");
const bcrypt=require("bcrypt");
const deleteFile=require("../utils/deleteFile");
const {updateProfile}=require("../utils/validation");
const Joi = require("joi");

async function getMyprofile(req,res){
    const [result]=await db.query(`SELECT 
        id,
        first_name,
        last_name,
        email,
        phone_number,
        country,
        country_code,
        image_url
        FROM Users
        WHERE id=?`,[req.user.id]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result[0]);
}

async function getAllProfils(req,res){
    const {pagesize=12,page=1}=req.query;
    const limit=(page-1)*pagesize;

    const [result]=await db.query(`SELECT * FROM Users
        ORDER BY id
        LIMIT ? OFFSET ? `,[+pagesize,+limit]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result);
}

async function getSpcificProfile(req,res){
    const [result]=await db.query(`SELECT * FROM Users
        WHERE id=?`,[+req.params.id]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result[0]);
}

async function updateMyprofile(req,res){
    const{
        first_name,
        last_name,
        email,
        phone_number,
        country,
        country_code}=req.body
    
    
    const {error}=updateProfile(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});

    
    let [result]=await db.query(`
        SELECT * FROM Users
        WHERE (email=? OR phone_number=?) AND id<>?`,
        [email,phone_number,req.user.id]);
        
    if(result.length)return res.status(409).json({message:"not can update profile"});
    
    let image_url;

    [result]=await db.query(`
        SELECT * FROM Users
        WHERE id=?`,
        [req.user.id]);

    if(req.file){
        if(req.file.mimetype.split("/")[0].toLowerCase()!="image")return res.status(400).json({message:"please send image file"});
        
        image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;
        
        if(result[0].image_url)deleteFile(result[0].image_url.split("/upload")[1]);
    }else
        image_url=result[0].image_url;
    
        await db.execute(`
            UPDATE Users
            SET first_name=?,last_name=?, email=?,phone_number=?,country=?,country_code=?,image_url=?
            WHERE id=?`,[first_name,last_name,email,phone_number,country,country_code,image_url,req.user.id]);
    

    res.status(200).json({message:"done update profile"});
}

async function updatePermission(req,res){
    const {role}=req.body;
    
    if(!role)return res.status(400).send("send permission");
    if(!(role==="admin"||role==="user"))return res.status(400).send("send valid permission from (admin or user)");


    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[+req.params.id]);
    if(result.length===0)return res.status(404).json({message:"not found user"});
    
    await db.execute(`
        UPDATE Users 
        SET role=?
        WHERE id=?`,[role,+req.params.id]);

    res.status(200).json({message:"done update permission"});
}


async function updateProfileImage(req,res){

    if(!req.file)return res.status(400).send("please send file");
    if(req.file.mimetype.split("/")[0].toLowerCase()!="image")return res.status(400).json({message:"please send image file"});

    const image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;
    
    const [result]=await db.query(`
        SELECT * FROM Users WHERE id=?`,[req.user.id]);
    
    if(result.length===0)return res.status(400).send("not found profile");

    if(result[0].image_url)deleteFile(result[0].image_url.split("/upload")[1]);

    await db.execute(`
        UPDATE Users SET image_url=? WHERE id=?`,[image_url,req.user.id]);

    res.status(200).json({message:"update image successful"});
}

async function updatePassword(req,res){
    const {newpassword,oldPassword,confirmPassword}=req.body;
    const {error}=Joi.string()
  .min(8)
  .max(32)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/)
  .required()
  .messages({
    'string.empty': 'كلمة المرور مطلوبة',
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 8 حروف',
    'string.max': 'كلمة المرور لا يجب أن تتعدى 32 حرف',
    'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، صغير، رقم، ورمز خاص',
  }).validate(newpassword);
    
    if(error)return res.status(400).json({message:error.details[0].message});

    if(newpassword!==confirmPassword)return res.status(400).json({message:"enter confirm password"});
    
    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[req.user.id]);
    if(result.length===0)return res.status(404).json({message:"not found user"});

    const match=await bcrypt.compare(oldPassword,result[0].password);
    if(!match) return res.status(400).json({message:"enter good password"});
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(newpassword,salt);
    
    await db.execute(`
        UPDATE Users
        SET password=?
        WHERE id=?`,[hashedPassword,req.user.id]);

    res.status(200).json({message:"done changed password"});
}

async function deleteMyprofile(req,res){

    const [[MyProfile]]=await db.query(`SELECT * FROM Users WHERE id=?`,[req.user.id]);
    if(!MyProfile)return res.status(404).send("not found this user");
    
    if(MyProfile.image_url)
            deleteFile(MyProfile.image_url.split("/upload")[1]);

    await db.execute("DELETE FROM Users WHERE id=?",[req.user.id]);

    res.status(200).json({message:"delete user Successfuly"})
};

async function deleteSpcificProfile(req,res){
 
    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[+req.params.id]);
    const [[MyProfile]]=await db.query(`SELECT * FROM Users WHERE id=?`,[req.user.id]);
    if(result.length===0)return res.status(404).send("not found this user");
    
    if(MyProfile.id===result[0].id)return res.status(409).send("you can\'t delete yourself");
    if(result[0].image_url)
            deleteFile(result[0].image_url.split("/upload")[1]);

    await db.execute("DELETE FROM Users WHERE id=?",[+req.params.id]);

    res.status(200).json({message:"delete user Successfuly"})
};



module.exports={
    getAllProfils,
    getMyprofile,
    getSpcificProfile,
    updateMyprofile,
    updatePassword,
    updatePermission,
    updateProfileImage,
    deleteSpcificProfile,
    deleteMyprofile
}

