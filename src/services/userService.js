require('dotenv').config();
const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

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
        } catch (error) {
            console.error(error);
            return {
                EC: 2, // Mã lỗi hệ thống
                message: 'Internal server error in handleUserLogin.',
                user: null
            };
        }
    },
    getAllUser: async (id) => {
        try {
            let users = [];

            // Nếu id là 'ALL' hoặc không có id
            if (!id || id === 'ALL') {
                // Lấy tất cả người dùng
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            } else {
                // Lấy người dùng theo ID
                users = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            // Kiểm tra nếu không tìm thấy người dùng với id
            if (!users) {
                return {
                    EC: 1,
                    message: `User with ID ${id} not found!`,
                    users: []
                };
            }

            // Trả về danh sách người dùng hoặc người dùng theo ID
            return {
                EC: 0,
                message: 'OK',
                users
            };

        } catch (error) {
            console.error(error);
            return {
                EC: 2,
                message: 'Internal server error in getAllUser.',
                users: []
            };
        }
    },
    createNewUser: async (data) => {
        try {
            let check = await checkUserEmail(data.email);
            if (!data.email || !data.password || !data.firstName || !data.lastName) {
                return {
                    EC: 1,
                    message: 'Missing required fields: email, password, firstName, or lastName.',
                };
            }
            if (check) {
                return ({
                    EC: 1,
                    message: 'Email already exists. Please use a different email.',
                })
            } else {
                let hashPass = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPass,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
                return {
                    EC: 0,
                    message: 'User created successfully',
                };
            }


        } catch (error) {
            console.log(error);
            return {
                EC: 2,
                message: 'Internal server error in createNewUser.',
            };
        }
    },

    deleteUser: async (id) => {
        try {
            let user = await db.User.findOne({
                where: { id }
            });
            if (!user) {
                return ({
                    EC: 1,
                    message: "The user doesn't exist"
                })
            }
            await db.User.destroy({
                where: { id }
            })

            return ({
                EC: 0,
                message: "The user has been deleted successfully"
            })

        } catch (error) {
            console.error(error);
            return ({
                EC: 2,
                message: 'Internal server error in deleteUser.',
            });
        }
    },

    editUser: async (data) => {
        try {
            if (!data.id) {
                return ({
                    EC: 1,
                    message: "Missing required parameters"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {

                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                return ({
                    EC: 0,
                    message: "Update user successful"
                })
            } else {
                return ({
                    EC: 1,
                    message: "User not found"
                })
            }
        } catch (error) {
            console.log(error);
            return {
                EC: 2,
                message: "Internal server error in editUser"
            };
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

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        const saltRounds = 10; // Số lượng rounds để tạo salt

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                return reject(err);
            }
            resolve(hash); // Trả về chuỗi hash
        });
    });
};
