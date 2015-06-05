var fs = require('fs');
var express = require('express');
var app = express();

var port = 3000;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/versions.json', function (req, res) {
    res.json([
        {
            commit: 'version',
            screenshots: [
                '/server/images/version/x-large-screen.png',
                '/server/images/version/large-screen.png',
                '/server/images/version/medium-large-screen.png',
                '/server/images/version/medium-screen.png',
                '/server/images/version/small-screen.png',
                '/server/images/version/x-small-screen.png'
            ]
        },
        {
            commit: 'lololol',
            screenshots: [
                '/server/images/lololol/x-large-screen.png',
                '/server/images/lololol/large-screen.png',
                '/server/images/lololol/medium-large-screen.png',
                '/server/images/lololol/medium-screen.png',
                '/server/images/lololol/small-screen.png',
                '/server/images/lololol/x-small-screen.png'
            ]
        },
        {
            commit: '25198a7',
            screenshots: [
                '/server/images/25198a7/x-large-screen.png',
                '/server/images/25198a7/large-screen.png',
                '/server/images/25198a7/medium-large-screen.png',
                '/server/images/25198a7/medium-screen.png',
                '/server/images/25198a7/small-screen.png',
                '/server/images/25198a7/x-small-screen.png'
            ]
        }
    ]);
});

app.listen(port);
console.info('Listening on port %s', port);
