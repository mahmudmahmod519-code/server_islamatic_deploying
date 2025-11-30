const error=require("../middleware/error");
const home=require("../router/home");
const lecture=require("../router/lecture");
const saved_lecture=require("../router/saved_lecture");
const profile=require("../router/profile");
const category=require("../router/category");


module.exports=(app)=>{
    app.use("/",home);
    app.use("/lecture",lecture);
    app.use("/saved_lecture",saved_lecture);
    app.use("/profile",profile);
    app.use("/category",category);
    app.use(error);
}
