const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const queryString = require('query-string');
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
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
    console.log(req);
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
server.listen(3000, () => {
    console.log('JSON Server is running');
});
