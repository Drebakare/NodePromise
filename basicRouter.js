'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
    'GET': {
        '/': (req, res) => {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end('<h4>Hello routing works  well</h4>')
        },
        '/about' : (req,res) => {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end('<h4>This is about us  well</h4>')
        }

    },
    'POST' : {
        '/api/login' : (req, res) => {
            let body = "";
            req.on('data', data => {
                body += data;
            })
            req.on('end', () => {
                let params = qs.parse(body);
                console.log("username = " + params['username']);
                console.log('Password = ' + params['password']);
                res.end();
            })
        }

    },
    'NA': (req, res) => {
        res.writeHead(404);
        res.end('Not Found'); 
    }
}

function router(req, res) {
    let baseUrl = url.parse(req.url, true);
    let resolveUrl = routes[req.method][baseUrl.pathname];
    if (resolveUrl != undefined) {
        resolveUrl(req, res);
    }
    else{
        routes['NA'](req, res);
    }
}
http
   .createServer(router)
   .listen(3000, () => {
       console.log("Server is running on port 3000");
   });