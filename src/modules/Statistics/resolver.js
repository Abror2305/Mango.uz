import {checkToken, isAdmin} from "../../util/validation.js";
import {ForbiddenError} from "apollo-server-express";

export default {
    Query:{
        totalMonthlySales: (parent, { paid }, { read, token, userAgent }) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                if (!isAdmin(userId, read)) {
                    return new ForbiddenError("You are not authorized to perform this action")
                }
                const orders = read('orders')
                const products = read('products')
                if(!paid){
                    return orders.reduce((acc, order) => {
                        const dateCurr = new Date()
                        const dateOrder = new Date(order.date)
                        if(dateCurr.getMonth() === dateOrder.getMonth() && dateCurr.getFullYear() === dateOrder.getFullYear() && !order.isPaid){
                            const product = products.find(product => product.id === order.productId)
                            return acc + product.price
                        }
                        return acc
                    }, 0)
                }
                return orders.reduce((acc, order) => {
                    const dateCurr = new Date()
                    const dateOrder = new Date(order.date)
                    if(dateCurr.getMonth() === dateOrder.getMonth() && dateCurr.getFullYear() === dateOrder.getFullYear() && order.isPaid){
                        const product = products.find(product => product.id === order.productId)
                        return acc + product.price
                    }
                    return acc
                }, 0)

            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        }
    }
}