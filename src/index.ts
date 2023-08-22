import Koa from 'koa';
import Router from '@koa/router';
import render from 'koa-ejs';
import path from 'path';
import Debug from 'debug';
import dotenv from 'dotenv';
import Breeze from './breeze';
import cors from '@koa/cors';
import enforceHttps from 'koa-sslify';
import serve from 'koa-static';

dotenv.config();
const debug = Debug('CLC-back:index');

const corsOptions= {
    origin: JSON.parse(process.env.AllowUrl || '{}').urls,
    credentials: true,
    optionsSuccessStatus: 200,
};

const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV === 'production' && process.env.BUILD_BRANCH === 'master') app.use(enforceHttps({ port: 4444 })) //unsure
app.use(serve(path.normalize(path.join(__dirname, '../CollegeLutheran/dist')))); //TODO
app.use(cors(corsOptions));

render(app, {
    root: path.join(__dirname, '../CLC-back/dist'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
})

router.get('/members', async (ctx) => {
    try {
        const subDomain = (process.env.SUB_DOMAIN || '');
        const breezeKey = (process.env.API_KEY || '');
        const breeze = new Breeze(subDomain, breezeKey);
        const people = await breeze.people.list({ limit: 5 });
        ctx.body = people;
        ctx.status = 200;
    } catch (error:any) {
        ctx.status = error.res ? error.res.status : 500;
        ctx.body = { error: 'An error occured' };
    }
})

app.use(router.routes())
.use(router.allowedMethods());

const port = process.env.PORT || 4444;
app.listen(port, async () => {
    debug('running in debug mode');
    console.log(`Magic is happening on port ${port}`);
})


