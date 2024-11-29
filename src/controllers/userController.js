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
        let { id } = req.query;

        if (!id) {
            return res.status(400).json({
                EC: 1,
                message: "Missing required parameter: id",
                users: []
            });
        }

        try {
            // Gọi service để lấy danh sách người dùng
            let usersData = await userService.getAllUser(id);

            // Kiểm tra mã lỗi từ service và trả về kết quả phù hợp
            if (usersData.EC !== 0) {
                return res.status(400).json(usersData);
            }

            // Nếu không có người dùng (trường hợp danh sách rỗng)
            if (!usersData.users || usersData.users.length === 0) {
                return res.status(404).json({
                    EC: 1,
                    message: `No users found with id: ${id}`,
                    users: []
                });
            }

            // Nếu thành công, trả về danh sách người dùng
            return res.status(200).json({
                EC: 0,
                message: "List of users retrieved successfully",
                users: usersData.users
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                EC: 2,
                message: "Internal server error",
                users: []
            });
        }
    },

    handleCreateNewUser: async (req, res) => {
        try {
            let message = await userService.createNewUser(req.body);
            return res.status(200).json(message);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 2,
                message: "Internal server error",
            });
        }
    },
    handleEditUser: async (req, res) => {
        try {
            let data = req.body;
            let message = await userService.editUser(data);
            return res.status(200).json(message);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 2,
                message: "Internal server error",
            });
        }
    },
    handleDeleteUser: async (req, res) => {
        try {
            if (!req.body.id) {
                return res.status(400).json({
                    EC: 1,
                    message: "Missing required parameter: id",
                });
            }
            let message = await userService.deleteUser(req.body.id);
            return res.status(200).json(message);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 2,
                message: "Internal server error",
            });
        }
    }

}