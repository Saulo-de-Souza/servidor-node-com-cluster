"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const os_1 = require("os");
const cluster_1 = __importDefault(require("cluster"));
const console_log_enum_1 = require("./console-log.enum");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
process.on('uncaughtException', (e) => {
    console.log(`${console_log_enum_1.EConsoleLog.bgBlack}${console_log_enum_1.EConsoleLog.fgRed}Erro: ${console_log_enum_1.EConsoleLog.fgYellow}${e}${console_log_enum_1.EConsoleLog.reset}`);
});
process.on('unhandledRejection', () => {
    console.log(`${console_log_enum_1.EConsoleLog.bgBlack}${console_log_enum_1.EConsoleLog.fgRed}Erro${console_log_enum_1.EConsoleLog.reset}`);
});
const cpusLenght = (0, os_1.cpus)().length;
if (cluster_1.default.isPrimary) {
    console.log(`${console_log_enum_1.EConsoleLog.fgBlack}${console_log_enum_1.EConsoleLog.bgWhite}Master process ${process.pid} is running${console_log_enum_1.EConsoleLog.reset}`);
    for (let x = 0; x < cpusLenght * 2; x++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', () => {
        console.log(`${console_log_enum_1.EConsoleLog.fgBlue}Worker ${process.pid} died${console_log_enum_1.EConsoleLog.reset}`);
        console.log(`${console_log_enum_1.EConsoleLog.fgBlue}Starting a new cluster${console_log_enum_1.EConsoleLog.reset}`);
        cluster_1.default.fork();
    });
}
else {
    const server = http_1.default
        .createServer((req, res) => {
        var _a, _b, _c, _d;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        if (req.url === '/') {
            fs_1.default.readFile(path_1.default.join(__dirname, '../public/index.html'), (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'content-type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.match(/.css$/)) {
            fs_1.default.readFile(path_1.default.join(__dirname, '../public/', req.url), (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'content-type': 'text/css' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.match(/.js$/)) {
            console.log(req.url);
            fs_1.default.readFile(path_1.default.join(__dirname, '../public', req.url), (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'content-type': 'text/javascript' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else if ((_c = req.url) === null || _c === void 0 ? void 0 : _c.match(/.png$/)) {
            console.log(req.url);
            fs_1.default.readFile(path_1.default.join(__dirname, '../public', req.url), (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'content-type': 'image/png' });
                    res.end(content, 'utf-8');
                }
            });
        }
        if (req.method === 'POST' && ((_d = req.url) === null || _d === void 0 ? void 0 : _d.match(/products/))) {
            const urlString = new url_1.URL(`http://${req.headers.host}${req.url}`);
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                console.log(JSON.parse(body));
                // console.log(querystring.parse(body));
            });
            res.end('sauuloooooooooooooooooooo');
        }
    })
        .listen(3000)
        .on('listening', () => {
        console.log(`${console_log_enum_1.EConsoleLog.fgGreen}Worker process start with ${console_log_enum_1.EConsoleLog.fgCyan}${process.pid}${console_log_enum_1.EConsoleLog.reset}`);
    });
}
