
const User = require('../../models/userModel')

const getUserZap = async  function (userIds){
 const users = await User.find({ _id: { $in: userIds } })
 const zaps=[]
 for (const user of users){
    zaps.push({name:user.username , whatsapp:user.phone})
 }
 return zaps

}

module.exports = {getUserZap}