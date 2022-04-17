import model from "../util/model.js";
export default function (req,res) {
    try{
        let {
            id,
            page=1,
            perPage,
            search,
            categoryId,
        } = req.query

        let products = model.read("products")

        if(!perPage){
            perPage = products.length
        }
        if(id){
            let product = products.find(product => +product.id === +id)
            return res.json(product)
        }

        if(search || categoryId){
            products = products.filter(product=>{
                let categoryFilter = categoryId? +product.categoryId === +categoryId : true
                let nameFilter = search ? product.name.toLowerCase().includes(search?.toLowerCase()) : true
                return categoryFilter && nameFilter
            })
        }
        return res.json(products.slice(page*perPage-perPage,perPage*page))
    }catch (e) {
        res.json({
            status:400,
            message: e.message
        })
    }
}