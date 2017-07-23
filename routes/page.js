let express = require('express');
let router = express.Router();
let fs = require('fs');

router.get('/', function (request, response) {
    fs.readFile('./public/view/index.html', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        response.send(data);
    })
});

module.exports = router;