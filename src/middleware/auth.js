require("dotenv").config();
const jwt = require("jsonwebtoken")
const auth = (req, res, next) => {


    const white_list = ["/", "register", "/login"]
    if (white_list.find(item => '/v1/api' + item === req.originalURL)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token is missing or has expired."
                })
            }

        } else {
            return res.status(401).json({
                message: "Token is missing or has expired."
            })
        }
    }

}

module.exports = auth;