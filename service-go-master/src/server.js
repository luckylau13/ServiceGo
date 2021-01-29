import express from 'express';
import exphbs from 'express-handlebars';
import { join } from 'path';
import sassMiddleware from 'node-sass-middleware';
import url from 'url';
import bodyParser from 'body-parser';
import session from 'express-session';

import { globalMiddleware } from './middlewares';
import { connect } from './db';
import { router } from './routes';

// app is top level application declared from express
const app = express();
app.use(session({ secret: 'pramish', saveUninitialized: true, resave: true }));

// Setup all middlwares
globalMiddleware(app);

// Connect to the database
connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// using sass instead of css
app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: false,
    outputStyle: 'compressed'
  })
);

// Set view engine
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers')
  })
);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

//public
app.use(express.static(join(__dirname, 'public')));

// Flash Locals
app.use((req, res, next) => {
  res.locals.messages = res.locals.getMessages();
  res.locals.user = req.user || null;
  res.locals.page = url.parse(req.url).pathname;
  next();
});

// Routing
app.use('/', router);

// catch all
app.all('*', (req, res) => {
  res.json({ success: true });
});

export default app;
