var path = require('path');

module.exports = {
    waitTimeout: 30000,
    pauseTimeout: 1000,
    version: process.env.DUP_VERSION || 'latest',
    breakpoints: {
        'xlarge': 1260,
        'large': 960,
        'mediumlarge': 850,
        'medium': 750,
        'small': 600,
        'xsmall': 320
    },

    'SRP – breakpoints': function (browser) {
        browser
            .deleteCookies()
            .url('http://ci-dionysus.hcom/sha/searchresults?override=results,filters')
            .waitForElementVisible('.hotel', this.waitTimeout)
            .execute(function () {
                document.querySelector('#listings .countdown-timer').style.visibility = 'hidden';
                document.querySelector('.widget-urgency').style.visibility = 'hidden';
                document.querySelector('.teaser-disneyland').style.backgroundImage = 'none';
                document.querySelector('.teaser-disneyland').style.backgroundColor = '#ccc';
            })
            .resizeWindow(this.breakpoints.xlarge, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/x-large-screen.png')
            .resizeWindow(this.breakpoints.large, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/large-screen.png')
            .resizeWindow(this.breakpoints.mediumlarge, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/medium-large-screen.png')
            .resizeWindow(this.breakpoints.medium, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/medium-screen.png')
            .resizeWindow(this.breakpoints.small, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/small-screen.png')
            .resizeWindow(this.breakpoints.xsmall, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/srp/' + this.version + '/x-small-screen.png')
            .end();
    },

    'PDP – breakpoints': function (browser) {
        browser
            .deleteCookies()
            .url('http://ci-dionysus.hcom/pda/property_details')
            .waitForElementVisible('#hotel-description', this.waitTimeout)
            .execute(function () {
                document.querySelector('.widget-urgency').style.visibility = 'hidden';
            })
            .resizeWindow(this.breakpoints.xlarge, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/x-large-screen.png')
            .resizeWindow(this.breakpoints.large, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/large-screen.png')
            .resizeWindow(this.breakpoints.mediumlarge, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/medium-large-screen.png')
            .resizeWindow(this.breakpoints.medium, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/medium-screen.png')
            .resizeWindow(this.breakpoints.small, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/small-screen.png')
            .resizeWindow(this.breakpoints.xsmall, 1000)
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/pdp/' + this.version + '/x-small-screen.png')
            .end();
    }
};
