import bcrypt from 'bcryptjs';
import db from '../models/index'


module.exports = {
    createNewUser: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
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
                resolve('Create a new user succeed!');
            } catch (error) {
                reject(error);
            }
        })
    },
    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let users = db.User.findAll({ raw: true });
                resolve(users);
            } catch (error) {
                reject(error)
            }
        })
    },
    getUserInfoById: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id: userId },
                    raw: true,
                })
                if (user) {
                    resolve(user);
                } else {
                    resolve({});
                }
            } catch (error) {
                reject(error)
            }
        })
    },
    updateUserData: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                    },
                    {
                        where: { id: data.id }
                    }
                );
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } catch (error) {
                reject(error);
            }
        })
    },
    deleteUserById: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.destroy({ where: { id: userId } });
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } catch (error) {
                reject(error);
            }
        })
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