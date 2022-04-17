export default (error, req, res, next) => {
    return res.status(400).json({
        status:400,
        message: error.message
    })
}