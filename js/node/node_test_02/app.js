var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/test');

app.set('views', './views/pages');
app.set('view engine', 'jade');
// app.use(express.bodyParser());
app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'bower_components')));

app.listen(port);

console.log('started on port: ' + port);


//rounter 路由方法

app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'hello 首页',
            movies: movies
        });
    });

});

app.get('/movie/:id', function(req, res) {
    var id = res.params.id;
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: '这是详情页' + movie.title,
            movie: movie
        });
    });

});
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '这是列表页',
            movies: movies
        });
    });

});

//admin update

app.get('/admin/update/:id', function(req, res) {
    var id = res.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: '后台更新页面',
                movie: movie
            });
        });
    }
});

app.post('/admin/movie/new', function(req, res) {
    console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    if (id !== undefined) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
});

app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '这是后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});
