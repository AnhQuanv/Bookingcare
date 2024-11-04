import crypto from 'crypto';
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


}

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            const salt = crypto.randomBytes(16).toString('hex');  // Tạo salt ngẫu nhiên
            const derivedKey = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');  // Hash mật khẩu
            resolve(derivedKey.toString('hex'));  // Trả về chuỗi hash
        } catch (error) {
            reject(error);
        }
    });
}