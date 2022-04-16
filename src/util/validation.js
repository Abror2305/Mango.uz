import Joi from "joi"

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/),
    repeat_password: Joi.ref("password"),
    email: Joi.string().email({minDomainSegments:2,tlds:{allow:["com","net","ru","uz"]}}),
    contact: Joi.string().pattern(/^998[389][012345789][0-9]{7}$/)
})

