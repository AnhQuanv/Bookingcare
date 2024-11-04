import db from '../models/index'
import CRUDservice from '../services/CRUDservice';

module.exports = {
    getHomePage: async (req, res) => {
        try {
            let data = await db.User.findAll();
            return res.render('homePage.ejs', {
                data: JSON.stringify(data)
            })
        } catch (error) {
            console.log(error)
        }
    },

    getCRUD: async (req, res) => {
        return res.render('crud.ejs');
    },

    postCRUD: async (req, res) => {
        let mess = await CRUDservice.createNewUser(req.body);
        console.log(mess);
        return res.send('post crud');
    },
    displayGetCRUD: async (req, res) => {
        let data = await CRUDservice.getAllUser();
        console.log(data);
        return res.render('displayCRUD.ejs', {
            users: data
        })
    }
}

