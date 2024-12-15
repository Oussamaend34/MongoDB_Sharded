
const path = require("path");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


app.use(express.static(path.join(__dirname, './public')));


app.use("/",  (req, res) => {
    const index = path.join(__dirname, './public/index.html');
    res.sendFile(index);
    // res.statusCode(200).json({message: "Hello World"});
});


server.listen(5173, () => {
    console.log(' App runn on port: ' + 5173);
});
