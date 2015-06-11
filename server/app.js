var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var BASE_PATH = 'server/images';
var screenshots = {};

function storeFile (file) {
    var parts, version, filename;
    file = file.replace(BASE_PATH + path.sep, '');
    parts = file.split(path.sep);
    version = parts[0];
    filename = parts[1];
    if (!screenshots.hasOwnProperty(version)) screenshots[version] = [];
    screenshots[version].push(filename);
}

function listFiles (directory) {
    var files = fs.readdirSync(directory)
        .map(function (v) {
            var filePath = path.join(directory, v);
            var stats = fs.statSync(filePath);
            return {
                name: v,
                time: stats.mtime.getTime(),
                path: filePath,
                isDirectory: stats.isDirectory()
            };
        })
        .sort(function (a, b) { return a.time - b.time; })
        .reverse()
        .forEach(function (file) {
            if (file.name === '.DS_Store' || file.name === 'hi.txt') return;
            if (file.isDirectory) {
                listFiles(file.path);
            } else {
                storeFile(file.path);
            }
        });
}

function getFileUrl (version, filename) {
    return path.join(BASE_PATH, version, filename);
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/versions.json', function (req, res) {
    var data = [];
    screenshots = {};
    listFiles(BASE_PATH);
    for (var version in screenshots) {
        data.push({
            commit: version,
            screenshots: screenshots[version].map(getFileUrl.bind(null, version)).reverse()
        });
    }
    res.json(data);
});

app.listen(3000);
console.info('Listening on port %s', 3000);
