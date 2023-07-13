const express = require('express');
const route = express.Router();
const parser = require('body-parser');
const db = require('../src/controllers/db');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit')



var urlencodedParser = parser.urlencoded({
    extended: false
});

route.get('/', (req, res) => {
    res.render('index');
});


route.get('/login', (req, res) => {
    res.render('login');
});

//login post route
route.post('/login', (req, res) => {
    //get the user input
    const {
        email,
        password
    } = req.body;
    //check if the user is in the database
    db.User.findOne({
        where: {
            email: email,
            password: password
        }
    }).then(user => {
        //if user is found
        if (user) {
            //set the session
            req.session.user = user;
            //redirect to home page
            res.redirect('/home');
        } else {
            //if user is not found
            res.render('login', {
                error: 'Invalid email or password'
            });
        }
    });
});

//get route to get pastebin by id
route.get('/:id', (req, res) => {
    //get the id from the url
    const id = req.params.id;
    //find the pastebin by id
    db.Pastebin.findOne({
        where: {
            uuid: id
        }
    }).then(paste => {
        //if pastebin is found
        if (paste) {
            //render the pastebin
            res.render('paste', {
                paste: paste
            });
        } else {
            //if pastebin is not found
            res.send('Paste not found');
        }
    });
});


//get route to get RAW pastebin by id
route.get('/:id/raw', (req, res) => {
    //get the id from the url
    const id = req.params.id;
    //find the pastebin by id
    db.Pastebin.findOne({
        where: {
            uuid: id
        }
    }).then(paste => {
        //if pastebin is found
        if (paste) {
            //render the pastebin
            res.send(paste.content);
        } else {
            //if pastebin is not found
            res.send('Paste not found');
        }
    });
});


const pasteapilimiter = rateLimit({
	windowMs: 1 * 15 * 1000, // 15 seconds
	max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: 'Too many requests, please try again after 15 seconds'
})

route.post('/pastebin', pasteapilimiter, urlencodedParser, (req, res) => {

    //Check the expiry date
     function expiredate(){ if (req.body.expiredate == '1day') {
        var expire = new Date();
        expire.setDate(expire.getDate() + 1);
        let date = expire.getFullYear + '-' + expire.getMonth + '-' + expire.getDate;
        return expire;
    } else if (req.body.expiredate == '1week') {
        var expire = new Date();
        expire.setDate(expire.getDate() + 7);
        let date = expire.getFullYear + '-' + expire.getMonth + '-' + expire.getDate;
        return expire;
    } else if (req.body.expiredate == '1month') {
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 1);
        let date = expire.getFullYear + '-' + expire.getMonth + '-' + expire.getDate;
        return expire;
    } else if (req.body.expiredate == 'burnafterread') {
        var expire = 'burnafterread';
        return expire;
    } else if (req.body.expiredate == 'never') {
        var expire = 'never';
        return expire;
    };
};
if (expiredate() == 'burnafterread') {
    var expiredate1 = null;
} else if (expiredate() == 'never') {
    var expiredate1 = null;
} else {
    var expiredate1 = expiredate()
}

      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      //generate a UUID using the uuid module
      var id = crypto.randomBytes(4).toString('hex');
      //create a new pastebin including the UUID, title, content, and IP.
      db.Pastebin.create({
        uuid: id,
        title: req.body.title,
        content: req.body.body2,
        ipaddr: ip,
        expires: expiredate1,
      }).then(paste => {
        //after that, we redirect the user to the pastebin page by identifying the pastebin by the UUID.
        res.redirect('/' + paste.uuid);
      });
    }
);

//regular expression that selects all characters before the fourth whitespace


module.exports = route;