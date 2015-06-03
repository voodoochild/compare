/*
<figure>
<img class="screenshot" src="http://www.fillmurray.com/960/540" />
<figcaption>1.0 Bill Murray</figcaption>
</figure>

<option>7b4c7b30ab0f06616636dcd05cbcb171cdf1a39b</option>

1. Populate dropdowns
2. Enable dropdowns
3. Load HEAD and HEAD~1 by default
4. Generate image diffs
*/

(function () {
    var left = document.getElementById('left');
    var right = document.getElementById('right');
    var output = document.getElementById('output');
    var versions = [
        '29701c1257fed233d7fc65a2d917be06a0aa303b',
        'e058dbec0bfbd5c72301d54d3b5aa0779d897866',
        '752687d110b6863280a78ac7dc143e5bdb253154',
        '88a59bdcd4a48a641b01c64df78b01d1f3408c38',
        'fc349c17e9035e613f34ae1a8c4ddbd7a5195187'
    ];
    var images = {
        left: [
            '/images/desktop.png',
            '/images/mobile.png'
        ],
        right: [
            '/images/desktop-2.png',
            '/images/mobile-2.png'
        ]
    };

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

    function loadImages (side) {
        var screenshot;
        for (var i = 0; i < images[side.id].length; i++) {
            screenshot = makeScreenshot(images[side.id][i]);
            side.appendChild(screenshot);
        }
    }

    function imageWorkspace (src) {
        var image = new Image();
        image.classList.add('workspace');
        image.src = src;
        document.body.appendChild(image);
        return image;
    }

    function makeDiff (a, b) {
        var aa = imageWorkspace(a);
        var bb = imageWorkspace(b);

        // Load images into workspaces so that they are full size
        aa.src = a.src;
        bb.src = b.src;

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
        for (var i = 0; i < leftImages.length; i++) {
            makeDiff(leftImages[i], rightImages[i]);
        }
    }

    function init () {
        populateVersions();
        left.querySelector('select option:nth-child(2)').setAttribute('selected', 'selected');
        right.querySelector('select option:first-child').setAttribute('selected', 'selected');
        loadImages(left);
        loadImages(right);
        compare();
    }

    init();
})();
