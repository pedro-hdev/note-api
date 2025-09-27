require('dotenv').config()
const secret = process.env.JWT_TOKEN

const jwt = require("jsonwebtoken")

let User = require("../models/user")

const WithAuth = (req, res, next) => {
    const token = req.headers['x-acces-token'];
    if (!token) {
        res.status(401).json({ erro: "Unauthorized: no token provided" })
    } else {
        jwt.verify(token, secret, (err, decode) => {
            if (err) {
                res.status(401).json({ erro: "Unauthorized: token invalid " })
            } else {
                req.email = decode.email
                User.findOne({ email: decode.email })
                    .then((user) => {
                        req.user = user;
                        next();
                    })
                    .catch((err) => {
                        res.status(401).json({ err: err })
                    })
            }
        })
    }
}
module.exports = WithAuth