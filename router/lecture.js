const router = require('express').Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validateId=require("../middleware/validationId");
const catchError=require("../utils/catchError");
const upload=require("../middleware/upload");

const {
    addLectureController,
    deleteLectureController,
    getAllLecturesController,
    getLectureController
    
} = require('../controller/lectureController');


    router
        .param('id', validateId);
    
router.route('/')
    .post(auth, admin,upload.single("sound"), catchError(addLectureController))
    .get(catchError(getAllLecturesController));
    

router.route("/:id")
    .get(catchError(getLectureController))
    .delete(auth,admin, catchError(deleteLectureController));


module.exports = router;
