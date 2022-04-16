import JWT from "jsonwebtoken"
import crypto from "crypto"

const secretKey = 'AbrorAlisherov'

export function sign (payload){
    return JWT.sign(payload, secretKey)
}

export function verify (token) {
    return JWT.verify(token, secretKey)
}

const createHash = crypto.createHash;

export function sha256(txt) {
    return createHash('sha256')
        .update(txt)
        .digest('hex')
}