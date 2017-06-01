var express = require('express');
var router = express.Router();
var logger = require('./winstonConf.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    logger.info("page d'accueil")
    res.render('accueil');
});

router.get('/getContratData', function (req, res, next) {
    var test = require('./testData.js');
    res.send(test.data);
});

router.get('/getApp', function (req, res, next) {
    var app = require('./sqlRequest.js');
    app.sendAPP(function (index) {
        res.send(JSON.stringify(index));
    });
});

router.post('/getFav', function (req, res, next) {
    var Fav = require('./sqlRequest.js');
    Fav.getFavo(function (index) {
        res.send(JSON.stringify(index));
    });
});


router.post('/ToggleFav', function (req, res, next) {
    var essai = require('./sqlRequest.js');
    essai.switchFav(req.body, function (index) {
        res.send("OKALM");
    });
});


router.post('/mailing', function (req, res, next) {

    var test = require('./SendMail.js');
    test.sendMail(req.body.text, "bertrand.combes9@gmail.com");
});

router.post('/request', function (req, res, next) {

    /*if ((/^\d+$/.test(req.body.id)) || (req.body.id == null) || (req.body.id == "")) {*/
    var essai = require('./sqlRequest.js');
    essai.sendSQL(req.body, function (index) {
        res.send(JSON.stringify(index));
    });
    /*
        } else {
            res.status(400).body("Wrong id type");
        }*/
});


/* CONNECTION*/

router.post('/connect', function (req, res, next) {
    var app = require('./sqlRequest.js');
    app.connect(req.body, function (index) {
        if (!(index === ""))
            res.send(JSON.stringify(index));
        else
            res.send("error");
    });
});


/*ADMIN PAGES PART*/

router.post('/getData', function (req, res, next) {
    var app = require('./adminData.js');
    app.sendSelection(req.body, function (index) {
        if (!(index === ""))
            res.send(JSON.stringify(index));
        else
            res.send("error");
    });
});

router.post('/getResult', function (req, res, next) {
    var essai = require('./adminData.js');
    essai.sendResult(req.body, function (index) {
        res.send(JSON.stringify(index));
    });
});

router.post('/insertData', function (req, res, next) {
    var essai = require('./adminData.js');
    essai.insertData(req.body, function (index) {
        console.log(index);
        res.send(JSON.stringify(index));
    });
});

router.post('/removeData', function (req, res, next) {
    var essai = require('./adminData.js');
    essai.removeData(req.body, function (index) {
        res.send(JSON.stringify(index));
    });
});

router.post('/updateData', function (req, res, next) {
    var essai = require('./adminData.js');
    essai.updateData(req.body, function (index) {
        res.send(JSON.stringify(index));
    });
});

module.exports = router;
