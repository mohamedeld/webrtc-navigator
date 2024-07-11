const express =require('express');
const path = require('path')
const {createServer} = require('http');


const app = express();
app.use(express.static(path.join(__dirname)))
const server = createServer(app);

server.listen(9000,()=>{
  console.log(`server is running on port ${9000}`)
})