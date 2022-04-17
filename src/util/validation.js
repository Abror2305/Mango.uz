import Joi from "joi"
import {verify} from "./hashing.js";

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/),
    repeat_password: Joi.ref("password"),
    email: Joi.string().email({minDomainSegments:2,tlds:{allow:["com","net","ru","uz"]}}),
    contact: Joi.string().pattern(/^998[389][012345789][0-9]{7}$/)
})

/**
 *
 * @param token{string}
 * @param userAgent{string}
 * @returns {number}
 */
export function checkToken(token,userAgent){
    try {
        const {id, userAgent: userAgentToken} = verify(token)

        if (userAgentToken !== userAgent) return 0

        return id
    }catch {
        return 0
    }
}

/**
 *
 * @param id{number}
 * @param read{function}
 * @returns {boolean}
 */
export function isAdmin(id,read){
    const users = read("users")
    const isAdmin = users.find(user => id === user.id && user.isAdmin)
    return !!isAdmin
}