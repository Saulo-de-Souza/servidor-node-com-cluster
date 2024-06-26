"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const os_1 = require("os");
const cluster_1 = __importDefault(require("cluster"));
const console_log_enum_1 = require("./console-log.enum");
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
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        console.log(req.url);
        res.end(`Hello World from Worker ${process.pid}\n`);
    })
        .listen(3000)
        .on('listening', () => {
        console.log(`${console_log_enum_1.EConsoleLog.fgGreen}Worker process start with ${console_log_enum_1.EConsoleLog.fgCyan}${process.pid}${console_log_enum_1.EConsoleLog.reset}`);
    });
}
