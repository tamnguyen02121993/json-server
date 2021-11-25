const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const queryString = require('query-string');
const CryptoJS  = require('crypto-js');
const SECRECT_KEY = "secrect"
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);


// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

server.post('/api/login', (req, res) => {
    if(!req.body?.username || req.body?.username?.length < 6) {
        return res.status(400).json({
            message: "Username is not valid!"
        })
    }
    if(!req.body?.password || req.body?.password?.length < 6) {
        return res.status(400).json({
            message: "Password is not valid!"
        })
    }
    const access_token = CryptoJS.AES.encrypt(req.body.username, SECRECT_KEY).toString();
    return res.status(200).json({
        access_token,
        expiredDate: Date.now() + (24 * 60 * 60)
    })
});

server.get('/api/profile', (req, res) => {
    const headers = req.headers;
    const haveToken = Boolean(headers['authorization']);
    if(!haveToken) {
        return res.status(401).json({
            message: 'Unauthorized!'
        })
    }
    const token = headers['authorization'].replace('Bearer ', '');
    const bytes = CryptoJS.AES.decrypt(token, SECRECT_KEY);
    const username = bytes.toString(CryptoJS.enc.Utf8);
    return res.status(200).json({
        username,
        city: 'HCM',
        email: 'dummy@email.com'
    })
});

server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();
        req.body.updatedAt = Date.now();
    } else if (req.method === 'PATCH' || req.method === 'PUT') {
        req.body.updatedAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {
    const headers = res.getHeaders();
    const totalCountHeader = headers['x-total-count'];
    if (req.method === 'GET' && totalCountHeader) {
        const queryStringParams = queryString.parse(req._parsedUrl.query);
        return res.jsonp({
            data: res.locals.data,
            pagination: {
                _page: Number(queryStringParams._page) || 1,
                _limit: Number(queryStringParams._limit) || 10,
                _totalRows: totalCountHeader,
            }
        });
    }
    res.jsonp(res.locals.data);
};

// Use default router
server.use(router);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('JSON Server is running');
});
