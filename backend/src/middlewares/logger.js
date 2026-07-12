 export default function logger(req, res, next) {
    console.log(`route: ${req.method} ${req.url}\nAt ${new Date().toLocaleTimeString()}\n`);
    next();
}