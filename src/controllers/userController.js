import userService from '../services/userService';



module.exports = {
    handleLogin: async (req, res) => {
        let { email, password } = req.body;
        let userData = {}
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({
                EC: 1,
                message: 'Missing or invalid inputs! Email and password are required.',
                user: userData
            })
        } else {
            try {
                userData = await userService.handleUserLogin(email, password);
                console.log(userData);
                if (userData.EC === 0) {
                    return res.status(200).json(userData); // Thành công
                } else {
                    return res.status(401).json(userData); // Unauthorized
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    EC: 1,
                    message: 'Internal server error',
                    user: userData
                });
            }
        }


    },
    handleGetAllUser: async (req, res) => {
        let id = req.body.id;
        let users = await userService.getAllUser(id);
        console.log(users);
        if (!id) {
            return res.status(200).json({
                EC: 1,
                message: "Missing required parameters",
                users: []
            })
        }
        return res.status(200).json({
            EC: 0,
            message: "OK",
            users
        })
    }
}