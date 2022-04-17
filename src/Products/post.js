import {checkToken, isAdmin, productSchema} from "../util/validation.js";
import model from "../util/model.js";

export default function (req, res,next) {
    try {
        const token = req.get("token")
        const userAgent = req.get("user-agent")
        const userId = checkToken(token, userAgent)

        console.log(req.body)
        if (!userId) {
            return next(new Error("Invalid token"))
        }

        if (!isAdmin(userId, model.read)) {
            return res.json({
                status: 405,
                message: "Not Allowed"
            })
        }
        if (!req.file) {
            return next(new Error("Image is required"))
        }

        let {
            categoryId,
            name,
            price,
            shortDesc,
            longDesc,
        } = req.body

        name = name.trim()

        const categories = model.read("categories")

        let category = categories.find(category => +category.id === +categoryId)

        if (!category) {
            return next(new Error("Category not found!"))
        }

        const {error} = productSchema.validate({categoryId, name, price, shortDesc, longDesc})

        if (error) {
            return next(new Error(error.message))
        }

        let products = model.read("products")

        let newProduct = {
            id: products.at(-1)?.id + 1 || 1,
            name,
            categoryId,
            price,
            shortDesc,
            longDesc,
            picture: "/img/" + req.file.filename
        }

        products.push(newProduct)
        model.write("products", products)

        return res.json({
            status: 201,
            message: "Product successfully added",
            data: newProduct
        })
    }catch (e) {
        return next(e)
    }
}