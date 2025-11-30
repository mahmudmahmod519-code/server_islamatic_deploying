const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth");
const validationId=require("../middleware/validationId");
const {
    deleteLectureSaved,
    getLectureSaved,
    savedLecture
}=require("../controller/saved_lectureController");

router.param("id",validationId);
router.use(auth);

router.route("/")
.post(catchError(savedLecture))
.get(catchError(getLectureSaved));

router.delete('/:id',catchError(deleteLectureSaved));


module.exports=router;