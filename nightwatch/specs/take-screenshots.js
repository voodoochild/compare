module.exports = {
    waitTimeout: 30000,
    pauseTimeout: 1000,

    'Default views': function (browser) {
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
            .resizeWindow(1260, 1000)  // x-large-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/x-large-screen.png')
            .resizeWindow(960, 1000)  // large-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/large-screen.png')
            .resizeWindow(850, 1000)  // medium-large-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/medium-large-screen.png')
            .resizeWindow(750, 1000)  // medium-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/medium-screen.png')
            .resizeWindow(600, 1000)  // small-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/small-screen.png')
            .resizeWindow(320, 1000)  // x-small-screen
            .pause(this.pauseTimeout)
            .saveScreenshot('server/images/version/x-small-screen.png')
            .end();
    }
};
