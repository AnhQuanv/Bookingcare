import db from '../models/index'
import bcrypt from 'bcryptjs';

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
                    delete user.password
                    return {
                        EC: 0,
                        message: "Login successful",
                        user: user
                    }
                } else {
                    return { EC: 1, message: 'The password you entered is incorrect. Please try again.', user: user };

                }
            } else {
                return { EC: 1, message: `Email isn't exist in your system!`, user: user };
            }
            resolve(userData)
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
