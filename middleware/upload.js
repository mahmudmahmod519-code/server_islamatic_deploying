const multer=require("multer");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{    
    if(file.mimetype.split("/")[0]==="image")cb(null,'./upload/image')
    else if(file.mimetype.split("/")[0]==="audio")cb(null,'./upload/voices')
    else cb(new Error("this file not valid"));

},filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`);
}})


module.exports=multer({storage
    ,limits:{fileSize:1024*1024*1024*2}
    ,fileFilter:(req,file,cb)=>{
        const regexfile=/image|audio/i
        
        if(!regexfile.test(file.mimetype.split("/")[0].toLowerCase())||!regexfile.test(file.mimetype.split("/")[0].toLowerCase()))return cb(new Error("this file is not valid"))
            
            cb(null,true);
}});