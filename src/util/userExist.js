export default (existUser,user) => {
    let message = "Invalid User"
    if(user.username === existUser.username){
        message = "Username is already exist"
    }
    else if(user.email === existUser.email){
        message = "Email is already exist"
    }
    else if(user.contact === existUser.contact){
        message = "Contact is already exist"
    }
    return{
        status:400,
        message,
    }
}