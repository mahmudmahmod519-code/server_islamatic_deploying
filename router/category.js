const router=require("express").Router();
const {
    addCategory,
    deleteCategory,
    getCategory,
    getSpcificLecturessForCategory
}=require("../controller/categoryController");
const auth = require("../middleware/auth");
const admin= require("../middleware/admin");
const validateId= require("../middleware/validationId");
const catchError= require("../utils/catchError");


router.param("id",validateId);


router.route("/")
    .post(auth,admin,catchError(addCategory))
    .get(catchError(getCategory));

router.get("/:id/lectures",catchError(getSpcificLecturessForCategory));

router.delete("/:id",auth,admin,catchError(deleteCategory));

module.exports=router;