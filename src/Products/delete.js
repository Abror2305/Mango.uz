import {checkToken, editProductSchema, isAdmin} from "../util/validation.js";
import model from "../util/model.js";

export default function (req, res,next) {
    try {
        const token = req.get("token")
        const userAgent = req.get("user-agent")
        const userId = checkToken(token, userAgent)

        if (!userId) {
            return next(new Error("Invalid token"))
        }

        if (!isAdmin(userId, model.read)) {
            return res.json({
                status: 405,
                message: "Not Allowed"
            })
        }

        const {id} = req.body

        const products = model.read("products")

        const productIndex = products.findIndex(product => product.id === id)

        if(productIndex === -1) {
            return res.json({
                status: 404,
                message: "Product not found"
            })
        }

        const product = products.splice(productIndex, 1)

        model.write("products", products)

        return res.json({
            status: 200,
            message: "Product deleted",
            data: product
        })
    } catch (e) {
        return next(e)
    }
}