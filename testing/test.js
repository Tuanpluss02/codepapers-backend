const fs = require('fs');

const query = require('../app/modules/user.query.js');

const jsonData = fs.readFileSync('E:\\CODE\\NodeJS\\codepapers\\testing\\data.json');
const dataMock = JSON.parse(jsonData);


dataMock.forEach((item) => async () => {
    try {
        const result = await query.createUser(item.name, item.email, item.password, item.avatar, item.dateofbirth.split('T')[0]);
        if (result) {
            console.log('inserted');
        }
        else {
            console.log('not inserted');
        }
    } catch (error) {
        console.error(error);
    }
});