import 'reflect-metadata';

import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as http from 'http';
import * as os from 'os';
import * as hbs from 'express-hbs';
import * as path from 'path';
import * as BluebirdPromise from 'bluebird';
import * as session from 'express-session';
import * as moment from 'moment';
import { Types } from './types/Types';
import { container } from './inversify.config';
import { Routes } from './interfaces/Routes';

BluebirdPromise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: false,
    monitoring: false,
});

global.Promise = BluebirdPromise;

const app = express();

app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        saveUninitialized: true,
        resave: true,
    }),
);

const viewsDir: string = path.join(__dirname, '../views');
app.engine('hbs', hbs.express4({ partialsDir: viewsDir }));
app.use(express.static(viewsDir));

hbs.registerHelper('times', (n, block) => {
    let accum = '';
    for (let i = 0; i < n; i += 1) accum += block.fn(i);
    return accum;
});

hbs.registerHelper('formatDate', (date) => {
    return moment(date).format('MMM Do YY');
});

const port = process.env.PORT || '3000';
app.set('port', port);

http.createServer(app).listen(port, () => {
    console.log(
        `Add-on server (${
            process.env.NODE_ENV
        }) running at http://${os.hostname()}:${port}`,
    );
});

const routes: Routes = container.get<Routes>(Types.Routes);
routes.init(app);
