const router=require("express").Router();
const passport=require("passport");
const {
    SignIN,
    SignUp,
    forgetPassword,
    logout,
    verification
}=require("../controller/homeController");
const catchError= require("../utils/catchError");


router.post("/sign-in",catchError(SignIN));
router.post("/sign-up",catchError(SignUp));
router.patch("/logout",catchError(logout));
router.post("/forget-password",catchError(forgetPassword));
router.post("/varification",catchError(verification));

router.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signin" }),
  (req, res) => {
    const { token, user } = req.user;

    res.json({
      message: "Login successful",
      token,
      user
    });
  }
);


module.exports=router;