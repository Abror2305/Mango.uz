import {checkToken, editProductSchema, isAdmin} from "../util/validation.js";
import model from "../util/model.js";

export default function (req, res,next) {
    try{
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

        let {
            id,
            categoryId,
            name,
            price,
            shortDesc,
            longDesc,
        } = req.body

        if(categoryId){
            categoryId = parseInt(categoryId)
            const categories = model.read("categories")
            let category = categories.find(category => +category.id === categoryId)

            if (!category) {
                return next(new Error("Category not found!"))
            }
        }
        const {error} = editProductSchema.validate({id,categoryId, name, price, shortDesc, longDesc})

        if (error) {
            return next(new Error(error.message))
        }

        let products = model.read("products")
        let product = products.find(product => +product.id === +id)

        if (!product) {
            return next(new Error("Product not found!"))
        }

        product.categoryId = categoryId? categoryId: product.categoryId
        product.name = name ? name : product.name
        product.price = price ? price : product.price
        product.shortDesc = shortDesc ? shortDesc : product.shortDesc
        product.longDesc = longDesc ? longDesc : product.longDesc
        product.picture = req.file ? req.file.filename : product.picture

        model.write("products", products)

        return res.json({
            status: 200,
            message: "Product edited successfully",
            data: product
        })

    }catch (e) {
        return next(e)
    }
}