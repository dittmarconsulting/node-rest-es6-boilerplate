Express & ES6 REST API Boilerplate
==================================


This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- **ES6** support -> [babel](https://babeljs.io)
- **REST** resources as middleware -> [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- **CORS** support -> [cors](https://github.com/troygoode/node-cors)
- **body parsing** ->  [body-parser](https://github.com/expressjs/body-parser)
- **nconf** -> [nconf](https://github.com/indexzero/nconf)
- **winston** logger -> [winston](https://github.com/winstonjs/winston)
- **express-winston** logger middleware for express -> [express-winston](https://github.com/bithavoc/express-winston)
- **winston-mail** send logs to mail -> [winston-mail](https://github.com/wavded/winston-mail)
- **jest** unit testing framework -> [jest](https://facebook.github.io/jest/)
- **supertest** Super-agent driven library for testing node.js HTTP servers using a fluent API -> [supertest](https://github.com/visionmedia/supertest)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).

Getting Started
---------------

```sh
# Install dependencies
npm install

# Setup nconfig
go to index.js & config.json and setup the vars

# Start development live-reload server
npm run dev

# Start production server:
npm start
```
Docker Support
------
```sh
cd advanced-express

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

Docker Demo
-------------------------
It's supposed to be pretty easy to take your Docker to your favourite cloud service, here's a demo of what's our Dockerized bolierplate is like: [https://docker-deployment-yudfxfiaja.now.sh/api](https://docker-deployment-yudfxfiaja.now.sh/api)

License
-------

MIT
