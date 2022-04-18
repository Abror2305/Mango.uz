import {ForbiddenError,ValidationError} from "apollo-server-express"
import {checkToken, isAdmin} from "../../util/validation.js";

export default {
    Query:{
        orders: (_, {}, {read, token, userAgent}) => {
            try {

                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                if (!isAdmin(userId, read)) {
                    return new ForbiddenError("You are not authorized to perform this action")
                }
                return read('orders')

            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        },
        myOrders: (_, {}, {read, token, userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                const orders = read('orders')
                const userOrder = orders.filter(order => order.userId === userId)
                return {orders:userOrder}

            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        }

    },

    Mutation: {
        createOrder: (_, {productId},{read, write, token, userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                const products = read('products')
                productId = parseInt(productId)
                const product = products.find(product => +product.id === productId)

                if (!product) {
                    return new ValidationError("Product not found")
                }

                const orders = read('orders')
                const newOrder = {
                    id: orders.at(-1)?.id + 1 || 1,
                    userId,
                    productId,
                    isPaid: false,
                    date: new Date
                }

                orders.push(newOrder)
                write('orders', orders)

                return newOrder


            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        },
        deleteOrder: (_, {id}, {read, write, token, userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                const orders = read('orders')
                const order = orders.find(order => +order.id === +id)

                if (!order) {
                    return new ValidationError("Order not found")
                }

                if (order.userId !== userId) {
                    return new ForbiddenError("You are not authorized to perform this action")
                }

                const index = orders.findIndex(order => order.id === id)
                let [deleted] = orders.splice(index, 1)
                write('orders', orders)

                return deleted

            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        },
        payOrders: (_,{},{read, write, token, userAgent}) => {
            try {
                const userId = checkToken(token, userAgent)

                if (!userId) {
                    return new ForbiddenError("Invalid token")
                }

                const orders = read('orders')
                const paidOrders = orders.filter(order => order.userId === userId && !order.isPaid)

                if (paidOrders.length === 0) {
                    return new ForbiddenError("You have no unpaid orders")
                }

                paidOrders.forEach(order => {
                    order.isPaid = true
                })

                write('orders', orders)

                return {
                    status: 200,
                    message: "Orders paid"
                }

            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        }
    },

    Order:{
        user: (parent, _, {read}) => {
            const users = read('users')
            return users.find(user => user.id === parent.userId)
        },
        products: (parent, _, {read}) => {
            const products = read('products')
            return products.find(product => +product.id === +parent.productId)
        },
    },
    Orders:{
        total: (parent, _, {read}) => {
            console.log(parent)
            const products = read('products')
            let paid=0,unpaid=0;
            for (let parentElement of parent.orders) {
                let product = products.find(product => product.id === parentElement.productId)
                if (parentElement.isPaid) {
                    paid += product.price
                } else {
                    unpaid += product.price
                }
            }
            return {
                paid,
                unpaid
            }
        }
    }
}