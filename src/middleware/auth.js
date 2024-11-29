require("dotenv").config();
const jwt = require("jsonwebtoken")
const auth = (req, res, next) => {
    const white_list = ["/", "/register", "/login", "/create-new-user", "/delete-user", "/edit-user",
        "/get-crud", "/crud", "/post-crud"]
    console.log(req.originalUrl)
    // if (white_list.find(item => `/api${item}` === req.originalUrl)) {
    if (white_list.find(item => `${item}` === req.originalUrl)) {
        return next();
    }
    if (white_list.find(item => `/api${item}` === req.originalUrl)) {
        return next();
    }
    else {
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