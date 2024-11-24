require('dotenv').config();
const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    handleUserLogin: async (email, password) => {
        try {

            let isExist = await checkUserEmail(email);
            let user = {};
            if (isExist) {
                let check = bcrypt.compareSync(password, isExist.password);
                if (check) {
                    user = await db.User.findOne({
                        where: { email: email },
                        attributes: ['email', 'roleId', 'password'],
                        raw: true,
                    });
                    delete user.password;
                    const payload = {
                        email,
                        roleId: user.roleId
                    }
                    const access_token = jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {
                            expiresIn: process.env.JWT_EXPIRE
                        }
                    )
                    return {
                        EC: 0,
                        message: "Login successful",
                        user: user,
                        access_token
                    }
                } else {
                    return {
                        EC: 1,
                        message: 'The password you entered is incorrect. Please try again.',
                        user: user
                    };

                }
            } else {
                return {
                    EC: 1,
                    message: `Email isn't exist in your system!`,
                    user: user
                };
            }
            resolve(userData)
        } catch (error) {
            console.error(error);
        }
    },

    getAllUser: async (id) => {
        try {
            let users = '';
            if (id === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if (id && id !== 'ALL') {
                users = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            return users;
        } catch (error) {
            console.error(error);

        }
    }
}

const checkUserEmail = async (userEmail) => {
    try {
        return await db.User.findOne({ where: { email: userEmail } });
    } catch (error) {
        console.log(error)
    }
}
