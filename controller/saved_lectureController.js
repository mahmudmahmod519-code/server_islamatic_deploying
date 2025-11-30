const db=require("../module/db");
const joi=require("joi");

async function savedLecture(req,res){
    
    const {error}=joi.number().integer().required().validate(req.body.lectureId);
    if(error)return res.status(400).send(error.details[0].message);

    const [isFound]=await db.query(`SELECT * FROM Lecture WHERE id=?`,[req.body.lectureId]);
    if(!isFound.length)return res.status(404).json({message:"not found this Lecture"});

    const [result]=await db.query(`SELECT * FROM Save_lecture
        WHERE user_id=? AND lecture_id=?`,[req.user.id,req.body.lectureId]);

    if(result.length)return res.status(400).json({message:"thid Lecture is added it already"});
    
    await db.execute(`INSERT INTO Save_Lecture(user_id,lecture_id)
        VALUES (?,?);`,[req.user.id,req.body.lectureId]);

    res.status(201).json({message:"successful saved it"});
}

async function getLectureSaved(req,res){
    const [result]=await db.query(`
        SELECT 
        l.id,
        l.name,
        l.description,
        l.sound_url
         FROM Save_lecture sl
        JOIN Lecture l ON sl.lecture_id=l.id
        WHERE sl.user_id=?;
        `,[req.user.id]);
    
        if(result.length===0)return res.status(404).json({message:"not found Lectures"});
        
        res.status(200).json(result);
} 

async function deleteLectureSaved(req,res){

    const [result]=await db.query(`SELECT * FROM Save_lecture
    WHERE user_id=? AND id=?;`,[req.user.id,+req.params.id]);
    
    if(result.length===0)return res.status(404).json({message:"not found Lecture"});
        
    await db.query(`DELETE FROM Save_lecture 
        WHERE id=?`,[+req.params.id]);
    
    res.status(200).json({message:"deleted it"});
}



module.exports={
    savedLecture,
    getLectureSaved,
    deleteLectureSaved
}

