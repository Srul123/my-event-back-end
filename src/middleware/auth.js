const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    console.log("auth middleware")
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'json_web_token_my_event')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        console.log(token)

        if(!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'authorization problem'})
    }
}

module.exports = auth