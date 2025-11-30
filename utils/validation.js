const joi=require("joi");


exports.signIn=(body)=>{
     return joi.object({
        email:joi.string().email().required().trim().min(8).max(25),
        password:joi.string()
  .min(8)
  .max(32)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/)
  .required()
  .messages({
    'string.empty': 'كلمة المرور مطلوبة',
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 8 حروف',
    'string.max': 'كلمة المرور لا يجب أن تتعدى 32 حرف',
    'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، صغير، رقم، ورمز خاص',
  }).trim()
    }).validate(body);
}


    

exports.signUp=(body)=>{
     return joi.object({
        first_name:joi.string().required().min(3).max(30).trim(),
        last_name:joi.string().required().min(3).max(30).trim(),
        email:joi.string().email().required().trim(),
        role:joi.string().valid("admin","user").default("user").optional(),
        phone_number:joi.string().min(8).max(15).required(),
        country:joi.string().required().min(3).max(20).trim(),
        country_code:joi.string().required().min(2).max(5).trim(),
        password:joi.string()
  .min(8)
  .max(32)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/)
  .required()
  .messages({
    'string.empty': 'كلمة المرور مطلوبة',
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 8 حروف',
    'string.max': 'كلمة المرور لا يجب أن تتعدى 32 حرف',
    'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، صغير، رقم، ورمز خاص',
  })
    })
    .validate(body);
}

exports.updateProfile=(body)=>{
      return joi.object({
        first_name:joi.string().required().min(3).max(30).trim(),
        last_name:joi.string().required().min(3).max(30).trim(),
        email:joi.string().email().required().trim(),
        phone_number:joi.string().min(8).max(15).required(),
        country:joi.string().required().min(3).max(20).trim(),
        country_code:joi.string().required().min(2).max(5).trim()
    })
    .validate(body);   
}
exports.updateThingInProfile=(body)=>{
      return joi.object({
        first_name:joi.string().optional().min(3).max(30).trim(),
        last_name:joi.string().optional().min(3).max(30).trim(),
        email:joi.string().email().optional().trim(),
        password:joi.string().string()
  .min(8)
  .max(32)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/)
  .required()
  .messages({
    'string.empty': 'كلمة المرور مطلوبة',
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 8 حروف',
    'string.max': 'كلمة المرور لا يجب أن تتعدى 32 حرف',
    'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، صغير، رقم، ورمز خاص',
  }),
        role:joi.string().valid("admin","user").default("user").optional(),
        phone_number:joi.string().min(8).max(15).optional(),
        country:joi.string().optional().min(3).max(20).trim(),
        country_code:joi.string().optional().min(2).max(5).trim()
    })
    .xor("first_name","last_name","email","password","role","phone_number","country","country_code")
    .validate(body);
}




exports.validationCategory=(body)=>{
    return joi.object({
        name:joi.string().required().min(5).max(30).trim(),
    }).validate(body);
}

exports.addLecture=(body)=>{
return joi.object({
  name : joi.string().required().min(5).max(30).trim(),
  description :joi.string().required().min(14).max(50).trim() 
    }).validate(body);
}

