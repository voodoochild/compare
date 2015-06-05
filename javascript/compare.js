(function () {
    var VERSIONS_URL = 'http://localhost:3000/versions.json';

    var left = document.getElementById('left');
    var right = document.getElementById('right');
    var output = document.getElementById('output');
    var versions = [];
    var images = {};

    function getVersions () {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', VERSIONS_URL, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        var data = JSON.parse(xmlhttp.responseText);
                        var commit;
                        for (var i = 0; i < data.length; i++) {
                            commit = data[i].commit;
                            versions.push(commit);
                            images[commit] = data[i].screenshots;
                        }
                        resolve();
                     }
                }
            };
            xmlhttp.send(null);
        });
    }

    function populateVersions () {
        var leftSelect = left.querySelector('select');
        var rightSelect = right.querySelector('select');
        var option;
        for (var i = 0; i < versions.length; i++) {
            option = document.createElement('option');
            option.text = versions[i];
            leftSelect.appendChild(option);
            option = document.createElement('option');
            option.text = versions[i];
            rightSelect.appendChild(option);
        }
        leftSelect.removeAttribute('disabled');
        rightSelect.removeAttribute('disabled');
    }

    function makeScreenshot (src) {
        var f = document.createElement('figure');
        var a = document.createElement('a');
        var i = new Image();
        a.href = src;
        a.setAttribute('target', '_blank');
        i.classList.add('screenshot');
        i.src = src;
        a.appendChild(i);
        f.appendChild(a);
        return f;
    }

    function getCommit (side) {
        var select = side.querySelector('select');
        return select.options[select.selectedIndex].value;
    }

    // function updateState () {
    //     var leftCommit = getCommit(left);
    //     var rightCommit = getCommit(right);
    //     var url = '/' + leftCommit + '/' + rightCommit;
    //     var title = 'Compare: ' + leftCommit + ' -> ' + rightCommit;
    //     history.replaceState({}, title, url);
    // }

    function loadImages () {
        var side;

        if (this === window) {
            // Called manually, load screenshots for both sides
            side = left;
            createScreenshots();
            side = right;
            createScreenshots();
        } else {
            // Triggered by changing a dropdown, load screenshots for just that side
            side = this.parentNode;
            createScreenshots();
        }

        function createScreenshots () {
            var existing = side.querySelectorAll('figure');
            var i, select, commit, screenshot;
            for (i = 0; i < existing.length; i++) {
                side.removeChild(existing[i]);
            }
            select = side.querySelector('select');
            commit = select.options[select.selectedIndex].value;
            for (i = 0; i < images[commit].length; i++) {
                screenshot = makeScreenshot(images[commit][i]);
                side.appendChild(screenshot);
            }
        }

        compare();
    }

    function imageWorkspace (src) {
        var image = new Image();
        image.classList.add('workspace');
        image.src = src;
        document.body.appendChild(image);
        return image;
    }

    function makeDiff (a, b) {
        if (!a || !b) return;

        var aa = imageWorkspace(a.src);
        var bb = imageWorkspace(b.src);

        function difference () {
            var img, diff, canvas, context, screenshot;
            if (!aa.complete || !bb.complete) {
                setTimeout(difference, 10);
            } else {
                diff = imagediff.diff(aa, bb);
                canvas = imagediff.createCanvas(diff.width, diff.height);
                context = canvas.getContext('2d');
                context.putImageData(diff, 0, 0);
                screenshot = makeScreenshot(canvas.toDataURL('image/png'));
                output.appendChild(screenshot);
                document.body.removeChild(aa);
                document.body.removeChild(bb);
            }
        }

        difference();
    }

    function compare () {
        var leftImages = left.querySelectorAll('img');
        var rightImages = right.querySelectorAll('img');
        var existing = output.querySelectorAll('figure');
        var i;
        for (i = 0; i < existing.length; i++) {
            output.removeChild(existing[i]);
        }
        for (i = 0; i < leftImages.length; i++) {
            makeDiff(leftImages[i], rightImages[i]);
        }
    }

    function bindEventHandlers () {
        left.querySelector('select').addEventListener('change', handle.bind(this));
        right.querySelector('select').addEventListener('change', handle.bind(this));

        function handle () {
            // updateState();
            loadImages.call(this);
        }
    }

    function init () {
        getVersions().then(function () {
            populateVersions();
            bindEventHandlers();

            // Set default commits, HEAD and HEAD~1
            left.querySelector('select option:nth-child(2)').selected = 'selected';
            right.querySelector('select option:first-child').selected = 'selected';

            loadImages();
        });
    }

    init();
})();
