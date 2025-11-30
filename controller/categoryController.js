const db=require("../module/db");
const {validationCategory}=require("../utils/validation");


async function getCategory(req,res){
    const {sorting=true,page=1,pagesize=12,search}=req.query;
    const limit=(page-1)*pagesize;
    let sort='DESC';
    if(sorting)
        sort='ASC';

    let category;

const newsearch=`%${search}%`;

if(search) {
    [category]=await db.query(`
    SELECT id,name FROM Category
    WHERE name LIKE ?
    ORDER BY id ${sort}
    LIMIT ? OFFSET ?;
    `,[newsearch,+pagesize,limit]);
}else {
    [category]=await db.query(`
    SELECT id,name FROM Category
    ORDER BY id ${sort}
    LIMIT ? OFFSET ?;
    `,[+pagesize,limit]);
}

    if(!category.length)return res.status(404).json({message:"not found category"});

    res.status(200).json(category);
}

async function getSpcificLecturessForCategory(req,res){

    const [lecture]=await db.query(`SELECT 
        id,
        name,
        description,
        sound_url
        FROM Lecture
        WHERE category_id=?
        `,[+req.params.id]);

    if(!lecture.length)return res.status(404).json({message:"not found lectures"});

    res.status(200).json(lecture);
}

async function deleteCategory(req,res){
        const [lecture]=await db.query(`SELECT * FROM Lecture
        WHERE category_id=?
        `,[+req.params.id]);

    if(lecture.length)return res.status(404).json({message:"not can delete the category"});

    const [isfoundCategory]=await db.query(`SELECT * FROM Category WHERE id=?`,[+req.params.id]);
    if(!isfoundCategory.length)return res.status(404).json({message:"not found this category"});

    await db.execute(`
        DELETE FROM Category
        WHERE id=?`,[+req.params.id]);

    res.status(200).json({message:"the category deleted"});
}

async function addCategory(req,res){
    const {error}=validationCategory(req.body);   
    if(error)return res.status(400).json({message:error.details[0].message});

    const [isFountTheSameName]=await db.query(`SELECT * FROM Category WHERE name=?`,[req.body.name]);
    if(isFountTheSameName.length)return res.status(400).json({message:"enter good name"});

    await db.execute(`INSERT INTO Category(name)
        VALUES (?)`,[req.body.name]);

        res.status(201).json({message:"the category created"});
}



module.exports={
    getCategory,
    getSpcificLecturessForCategory,
    deleteCategory,
    addCategory
}