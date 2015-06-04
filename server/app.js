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
            commit: '29701c1257fed233d7fc65a2d917be06a0aa303b',
            screenshots: [
                '/server/images/29701c1257fed233d7fc65a2d917be06a0aa303b/desktop.png',
                '/server/images/29701c1257fed233d7fc65a2d917be06a0aa303b/mobile.png'
            ]
        },
        {
            commit: 'e058dbec0bfbd5c72301d54d3b5aa0779d897866',
            screenshots: [
                '/server/images/e058dbec0bfbd5c72301d54d3b5aa0779d897866/desktop.png',
                '/server/images/e058dbec0bfbd5c72301d54d3b5aa0779d897866/mobile.png'
            ]
        }
    ]);
});

app.listen(port);
console.info('Listening on port %s', port);
