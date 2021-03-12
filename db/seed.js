const db = require('./connection');
const users = db.get('users');
const bcrypt = require('bcrypt');

(async () => {
    
    try {
        await users.remove();
        const usr = await users.insert({
            name: 'MOHIELDIN AHMED',
            email: 'mohyaldeen0101ahmed@gmail.com',
            hashedPassword: bcrypt.hashSync('Mohi1928', parseInt(process.env.SALT_ROUNDS)),
            avatar: 'http://psce.pw/3dszed',
            phone: '+905357636771',
            bio: 'I craft code 💻'

        });
        console.log(usr);
        db.close();
    } catch (error) {
        console.log(error);
        db.close();
    }

})();