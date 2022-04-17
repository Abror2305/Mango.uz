import {checkToken, isAdmin} from "../../util/validation.js";

export default {
    Query:{
        categories: (_,__,{read}) => read("categories")
    },
    Mutation: {
        addCategory: (_,{name},{read,write,userAgent,token}) => {
            try{
                const id = checkToken(token,userAgent)

                if(!id){
                    return {
                        status: 200,
                        message: "Invalid token"
                    }
                }

                const categories = read("categories")

                if(!isAdmin(id,read)){
                    return {
                        status: 405,
                        message: "Not Allowed"
                    }
                }

                let isExists = categories.find(category => category.name.toLowerCase() === name.toLowerCase())

                if(isExists){
                    return {
                        status: 409,
                        message: "Category already exists"
                    }
                }
                const newCategory = {
                    id: categories.at(-1).id+1||1,
                    name,
                }

                categories.push(newCategory)
                write("categories",categories)
                return {
                    status:200,
                    message: newCategory.name+" successfully added",
                    data: newCategory
                }

            }
            catch (e){
                return {
                    status:400,
                    message: e.message
                }
            }

        },
        editCategory:(_,{id,name},{read,write,token,userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return {
                        status: 200,
                        message: "Invalid token"
                    }
                }

                const categories = read("categories")

                if (!isAdmin(userId, read)) {
                    return {
                        status: 405,
                        message: "Not Allowed"
                    }
                }

                let category = categories.find(category => +category.id === +id)

                if (!category) {
                    return {
                        status: 400,
                        message: "No category equal to id " + id + " was found"
                    }
                }

                let isExists = categories.find(category => category.name.toLowerCase() === name.toLowerCase())

                if (isExists) {
                    return {
                        status: 409,
                        message: "Category already exists"
                    }
                }

                category.name = name
                write("categories", categories)

                return {
                    status: 200,
                    message: "Category updated",
                    data: category
                }
            }
            catch (e) {
                return {
                    status: 400,
                    message: e.message
                }
            }
        },
        deleteCategory: (_,{id},{read,write,token,userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return {
                        status: 200,
                        message: "Invalid token"
                    }
                }

                if (!isAdmin(userId, read)) {
                    return {
                        status: 405,
                        message: "Not Allowed"
                    }
                }


                const categories = read("categories")
                let categoryIndex = categories.findIndex(category => +category.id === +id)

                if (categoryIndex === -1) {
                    return {status: 404, message: "Category not found"}
                }

                let [deletedCategory] = categories.splice(categoryIndex,1)

                let products = read("products")
                products = products.filter(product => +product.categoryId !== +id)

                write("categories", categories)
                write("products", products)

                return {
                    status: 200,
                    message: "Category deleted",
                    data: deletedCategory
                }
            }
            catch (e) {
                return {
                    status: 400,
                    message: e.message
                }
            }
        }
    }
}