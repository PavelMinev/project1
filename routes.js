const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Some greeting text</title></head>');
        res.write('<body><h1>Some greeting text</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>');
        res.write('</body></html>');
        return res.end();
    }
    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Dummy users</title></head>');
        res.write('<body><ul>');
        res.write('<li>User 1</li>');
        res.write('</ul></body></html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chank) => {
            body.push(chank);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
            // fs.writeFile('message.txt', message, (err) => {
            //     res.statusCode = 302;
            //     res.setHeader('Location', '/');
            //     return res.end();
            // });
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1>Hello from my Node.js server</h1></body>')
    res.write('</html>');
    res.end();
};

// To export
module.exports = requestHandler;