import {registerSchema} from "../../util/validation.js";
import userExists from "../../util/userExist.js";
import {sign,sha256} from "../../util/hashing.js";


export default {
    Mutation:{
        register: (_, {input:{username, password, repeat_password, contact, email}},{read,write,userAgent}) => {

            username = username?.trim()
            password = password?.trim()
            repeat_password = repeat_password?.trim()

            if (contact.includes("+")) {
                contact = contact.slice(1)
            }

            const {error} = registerSchema.validate({
                username,
                password,
                repeat_password,
                contact,
                email
            })

            if (error) {
                return {
                    status: 400,
                    message: error.message,
                }
            }

            const users = read('users')
            const userExist = users.find(user =>
                user.username === username ||
                user.email === email ||
                user.contact === contact
            )

            if (userExist) {
                return userExists(userExist, {
                    username, password, repeat_password, contact, email
                })
            }
            const id = users.at(-1)?.id + 1 || 1
            const isAdmin = false
            const token = sign({id, userAgent})

            password = sha256(password)

            const newUser = {
                id,
                username,
                password,
                contact,
                email,
                isAdmin
            }

            users.push(newUser)

            write("users", users)

            return {
                status: 200,
                message: "You are successfully registered",
                token
            }
        },
        login:(_,{input:{username,password}},{read,userAgent}) =>{
            username = username?.trim()
            password = sha256(password?.trim())

            const users = read("users")

            const user = users.find(user => user.username === username && user.password === password)

            if(!user){
                return {
                    status: 403,
                    message: "Invalid username or password"
                }
            }

            const token = sign({id: user.id, isUser: user.isUser, userAgent})

            return {
                status: 200,
                message: "You are successfully logged in",
                token
            }
        }
    }
}