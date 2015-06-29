# Compare

- Run the front end: `grunt`
- Run the server: `node server/app.js`
- Create screenshots: `nightwatch`

## Deploying

- `git clone` onto your server
- `npm install && bower install` to pull down all dependencies
- `DUP_VERSION=<version> nightwatch` whenever you want to take screenshots
- `node server/app.js` to run the backend server at *http://localhost:3000*
- configure the frontend by editing `dist-config.js`
- `grunt build` to create the static frontend in `dist/`
- serve `dist/` with a server, i.e. `cd dist; python -m SimpleHTTPServer 8081` for non–production
