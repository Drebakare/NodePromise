'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs'); 
const path = require('path');

let mimes = {
    '.htm' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript',
    '.gif' : 'image/gif',
    '.jpg' : 'image.jpeg',
    '.png' : 'image/png'
}

function fileAccess (file_path){
    return new Promise((resolve, reject) => {
        fs.access(file_path, fs.F_OK, error =>{
            if (!error) {
                resolve(file_path);
            }
            else{
                reject();
            }
        });
    });
}

function readAccess(file_path){
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, (error, content) => {
            if (!error) {
                resolve(content);
            }
            else{
                reject(error);
            }
        });
    });
}
function webServer(req, res) {
    // resolve route
    let baseUrl = url.parse(req.url);
    let file_path = __dirname + (baseUrl.pathname === '/' ? '/index.htm' : baseUrl.pathname );
    let content_type = mimes[path.extname(file_path)];
 
    fileAccess(file_path)
    .then(readAccess)
    .then(content => {
        res.writeHead(200, {'content-type': content_type});
        res.end(content, 'utf-8');
    })
    .catch(error => {
        res.writeHead(404);
        res.end(JSON.stringify(error));
    });
} 

http.createServer(webServer).listen(3000, ()=> {
    console.log('webserver is running on port 3000');
}); 
