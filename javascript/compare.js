(function () {
    var pages = document.getElementById('pages');
    var comparison = document.getElementById('comparison');
    var left = document.getElementById('left');
    var right = document.getElementById('right');
    var output = document.getElementById('output');
    var versions = {};
    var images = {};
    var currentPage;

    function getVersions () {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', window.config.VERSIONS_URL, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        var data = JSON.parse(xmlhttp.responseText);
                        var page, i, version;
                        for (page in data) {
                            if (!versions.hasOwnProperty(page)) versions[page] = [];
                            if (!images.hasOwnProperty(page)) images[page] = {};
                            for (i = 0; i < data[page].length; i++) {
                                version = data[page][i].version;
                                versions[page].push(version);
                                images[page][version] = data[page][i].screenshots;
                            }
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

        // Remove any existing versions
        while (leftSelect.firstChild) {
            leftSelect.removeChild(leftSelect.firstChild);
        }
        while (rightSelect.firstChild) {
            rightSelect.removeChild(rightSelect.firstChild);
        }

        // Populate with new versions
        for (var i = 0; i < versions[currentPage].length; i++) {
            option = document.createElement('option');
            option.text = versions[currentPage][i];
            leftSelect.appendChild(option);
            option = document.createElement('option');
            option.text = versions[currentPage][i];
            rightSelect.appendChild(option);
        }
        leftSelect.removeAttribute('disabled');
        rightSelect.removeAttribute('disabled');

        // Auto–select the previous version in the left column
        var child = left.querySelector('select option:nth-child(2)');
        if (child) child.selected = 'selected';
    }

    function makeScreenshot (src, diff) {
        var baseUrl = window.config.IMAGE_BASE_URL || '';
        var f = document.createElement('figure');
        var a = document.createElement('a');
        var i = new Image();
        f.classList.add('screenshot');
        a.href = baseUrl + src;
        a.setAttribute('target', '_blank');
        diff = diff === true;
        i.src = diff ? src : baseUrl + src;
        a.appendChild(i);
        f.appendChild(a);
        return f;
    }

    function getCommit (side) {
        var select = side.querySelector('select');
        return select.options[select.selectedIndex].value;
    }

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
            var i, select, version, screenshot;
            for (i = 0; i < existing.length; i++) {
                side.removeChild(existing[i]);
            }
            select = side.querySelector('select');
            version = select.options[select.selectedIndex].value;
            for (i = 0; i < images[currentPage][version].length; i++) {
                screenshot = makeScreenshot(images[currentPage][version][i]);
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
        var placeholder;

        function difference () {
            var img, diff, canvas, context, screenshot, parent;

            if (!aa.complete || !bb.complete) {
                setTimeout(difference, 10);
            } else {
                diff = imagediff.diff(aa, bb);
                canvas = imagediff.createCanvas(diff.width, diff.height);
                context = canvas.getContext('2d');
                context.putImageData(diff, 0, 0);
                screenshot = makeScreenshot(canvas.toDataURL('image/png'), true);
                parent = placeholder.parentNode;
                parent.replaceChild(screenshot, placeholder);
                document.body.removeChild(aa);
                document.body.removeChild(bb);
            }
        }

        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        output.appendChild(placeholder);
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
        left.querySelector('select').addEventListener('change', loadImages.bind(this));
        right.querySelector('select').addEventListener('change', loadImages.bind(this));

        pages.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                currentPage = event.target.textContent.toLowerCase();
                var currentActive = pages.querySelector('.active');
                if (currentActive) currentActive.classList.remove('active');
                event.target.classList.add('active');
                comparison.classList.remove('hidden');
                populateVersions();
                loadImages();
            }
        });

        pages.classList.remove('disabled');
    }

    function init () {
        getVersions().then(function () {
            bindEventHandlers();
        });
    }

    init();
})();
