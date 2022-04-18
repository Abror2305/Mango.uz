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
        },
        mostSoldProduct: (_,{ limit }, {read, token, userAgent }) => {
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
                const productIds = orders.reduce((acc, order) => {
                    if(!order.isPaid){
                        return acc
                    }
                    acc.push(order.productId)
                    return acc
                }, [])
                const productIdsCount = productIds.reduce((acc, productId) => {
                    if(acc[productId]){
                        acc[productId]++
                    } else {
                        acc[productId] = 1
                    }
                    return acc
                }, {})
                const productIdsCountArr = Object.keys(productIdsCount).map(key => {
                    return {
                        product: products.find(product => +product.id === +key),
                        count: productIdsCount[key]
                    }
                })
                productIdsCountArr.sort((a, b) => {
                    return b.count - a.count
                })
                if(limit){
                    console.log(productIdsCountArr.slice(0, limit))
                    return productIdsCountArr.slice(0, limit)
                }
                return productIdsCountArr
            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        },
        leastSoldProduct: (_,{limit},{read,token,userAgent}) => {
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
                const productIds = orders.reduce((acc, order) => {
                    if(!order.isPaid){
                        return acc
                    }
                    acc.push(order.productId)
                    return acc
                }, [])
                const productIdsCount = productIds.reduce((acc, productId) => {
                    if(acc[productId]){
                        acc[productId]++
                    } else {
                        acc[productId] = 1
                    }
                    return acc
                }, {})
                const productIdsCountArr = Object.keys(productIdsCount).map(key => {
                    return {
                        product: products.find(product => +product.id === +key),
                        count: productIdsCount[key]
                    }
                })
                productIdsCountArr.sort((a, b) => {
                    return a.count - b.count
                })
                if(limit){
                    return productIdsCountArr.slice(0, limit)
                }
                return productIdsCountArr
            } catch (error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
        },
    }
}