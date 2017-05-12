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
    var app = require('./getApps.js');
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




router.post('/getData', function (req, res, next) {
    console.log(req.body);
    console.log(req.body.table);
    console.log(req.body.libcourt);
    console.log(req.body.liblong);
    console.log(req.body.essai);

    var app = require('./getApps.js');
    app.sendLibCourt(req.body, function (index) {
        console.log(index);
        res.send(JSON.stringify(index));
    });
});




router.post('/mailing', function (req, res, next) {
    
    var test = require('./SendMail.js');
    test.sendMail(req.body.text,"bertrand.combes9@gmail.com");
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
module.exports = router;

