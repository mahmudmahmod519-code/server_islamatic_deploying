const db=require('../module/db.js');
const code= require('../utils/statuscode.js');
const deleteFile= require('../utils/deleteFile.js');

const {addLecture} = require('../utils/validation.js');


async function addLectureController(req, res) {

    const { error } = addLecture({
        name:req.body.name,
        description:req.body.description
    });

    if (error) return res.status(400).json({ message: error.details[0].message });


    let [result]=await db.query(`SELECT * FROM Lecture WHERE name=?`,[req.body.name]);
    if(result.length)return res.status(400).json({message:"this name already exist"});


    [result]=await db.execute(`
        SELECT * FROM Category WHERE name = ?;
    `, [req.body.Categoryname]);

    if(result.length === 0) return res.status(404).json({ message: code(404) });

    if(!req.file)return res.status(400).json({message:"please send lecture"});

    if(req.file.mimetype.split("/")[0].toLowerCase()!='audio')return res.status(400).json({messag:"please send lecture as audio file"});

    const sound_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;

    [result] = await db.execute(`
        INSERT INTO Lecture (name, description,category_id, sound_url)
        VALUES (?, ?, ?, ?);
    `, [req.body.name, req.body.description, result[0].id, sound_url]);

    if (result.affectedRows === 0) return res.status(500).json({ message: code(500) });

    res.status(201).json({ message: code(201)});

}

async function getAllLecturesController(req, res) {
    const {sorting=true,page=1,pagesize=12,search}=req.query;
    const limit=(page-1)*pagesize;
    let sort='DESC';
    if(sorting)
        sort='ASC';

    let result;

const newsearch=`%${search}%`;

if(search) {
    [result]=await db.query(`
    SELECT * FROM Lecture
    WHERE (name LIKE ?
    OR description LIKE ?)
    ORDER BY id ${sort}
    LIMIT ? OFFSET ?;
    `,[newsearch,newsearch,+pagesize,limit]);
} else {
    [result]=await db.query(`
    SELECT * FROM Lecture
    ORDER BY id ${sort}
    LIMIT ? OFFSET ?;
    `,[+pagesize,limit]);
}


    if(result.length===0)return res.status(404).json({message:"not found there Lectures"});
    

    return res.status(200).json(result);
}


async function getLectureController(req, res) {
    
        const [result]=await db.execute(`
            SELECT
            Lecture.id,
            Lecture.name as title,
            Lecture.description,
            Lecture.sound_url,
            Category.name as category
            FROM 
            Lecture JOIN Category ON Lecture.category_id=Category.id
            WHERE Lecture.id = ?`,[+req.params.id]);

        if(result.length===0)return res.status(404).json({message:"not found this Lecture"})

        return res.status(200).json(result[0]);
}


async function deleteLectureController(req, res) {

    let [result]=await db.query("SELECT * FROM Lecture WHERE id=?",[+req.params.id]);
    
    if(result.length===0)return res.status(404).json({message:"not can delete this Lecture is not here"});
    deleteFile(result[0].sound_url.split("/upload")[1]);
    
    [result]=await db.query("DELETE FROM Lecture WHERE id = ? ",[+req.params.id]);

    if(result.affectedRows===0)return res.status(500).json({message:code(500)});

    res.status(200).json({message:"Lecture deleted"});
}



module.exports = {
    addLectureController,
    getAllLecturesController,
    getLectureController,
    deleteLectureController,
};


