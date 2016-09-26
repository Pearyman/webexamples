var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'cim'
    });
});
router.get('/child_care_hot', function(req, res, next) {
    res.render('child_care_hot', {
        title: 'cim'
    });
});

module.exports = router;
