export default {
    Query: {
        products: (_,{input:{id, page=1, perPage, search, categoryId}={}},{read}) => {
            let products = read("products")
            if(!perPage){
                perPage = products.length
            }
            if(id){
                let product = products.find(product => +product.id === +id)
                return product ? [product]:[]
            }
            if(search || categoryId){
                products = products.filter(product=>{
                    let categoryFilter = categoryId? +product.categoryId === +categoryId : true
                    let nameFilter =search ? product.name.toLowerCase().includes(search?.toLowerCase()) : true
                    return categoryFilter && nameFilter
                })
            }
            return products.slice(page*perPage-perPage,perPage*page)
        },
    },

}