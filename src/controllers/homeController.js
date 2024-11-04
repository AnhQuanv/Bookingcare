import db from '../models/index'


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
    }
}

