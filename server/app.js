var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var BASE_PATH = 'server/images';
var screenshots = {};

function storeFile (file) {
    var parts, page, version, filename;
    file = file.replace(BASE_PATH + path.sep, '');
    parts = file.split(path.sep);
    page = parts[0];
    version = parts[1];
    filename = parts[2];
    if (!screenshots.hasOwnProperty(page)) screenshots[page] = {};
    if (!screenshots[page].hasOwnProperty(version)) screenshots[page][version] = [];
    screenshots[page][version].push(filename);
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
            if (file.name === '.DS_Store') return;
            if (file.isDirectory) {
                listFiles(file.path);
            } else {
                storeFile(file.path);
            }
        });
}

function getFileUrl (page, version, filename) {
    return path.join(page, version, filename);
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/versions.json', function (req, res) {
    var json = {};
    var page, version, data;
    screenshots = {};
    listFiles(BASE_PATH);
    for (page in screenshots) {
        data = [];
        for (version in screenshots[page]) {
            data.push({
                version: version,
                screenshots: screenshots[page][version].map(getFileUrl.bind(null, page, version)).reverse()
            });
        }
        json[page] = data;
    }
    res.json(json);
});

app.listen(3000);
console.info('Listening on port %s', 3000);
