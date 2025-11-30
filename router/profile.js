const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth")
const admin=require("../middleware/admin")
const upload=require("../middleware/upload")
const validationId=require("../middleware/validationId")

const {
    getAllProfils,
    getMyprofile,
    getSpcificProfile,
    updateMyprofile,
    updatePassword,
    updatePermission,
    updateProfileImage,
    deleteSpcificProfile,
    deleteMyprofile
}=require("../controller/profileController");

router.use(auth);
router.param("id",validationId);


router.route("/")
.get(admin,catchError(getAllProfils))
.put(upload.single("image"),catchError(updateMyprofile))
.delete(catchError(deleteMyprofile));

router.get("/myProfile",catchError(getMyprofile));
router.patch("/uploadImage",upload.single("image"),catchError(updateProfileImage));
router.patch("/resetPassword",catchError(updatePassword));



router.route("/:id")
.get(admin,catchError(getSpcificProfile))
.patch(admin,catchError(updatePermission))
.delete(admin,catchError(deleteSpcificProfile));




module.exports=router;