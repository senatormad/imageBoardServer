## imageBoardServer
#### nodejs image board server

![image](https://user-images.githubusercontent.com/19698444/72934891-b6bbb400-3d64-11ea-893e-6b9b4311ccc0.png) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8400b46cec74afca9bc38cc38dfae9e)](https://app.codacy.com/manual/senator.mad/imageBoardServer?utm_source=github.com&utm_medium=referral&utm_content=senatormad/imageBoardServer&utm_campaign=Badge_Grade_Dashboard)

[Technologies](#licence) | [Prerequisites](#licence) | [How To Use](#licence) | [License](#licence)

### Technologies
___
 * [Node.js](https://nodejs.org/)
 * [Express](https://expressjs.com/)
 * [MongoDB](https://www.mongodb.com/)
 * [mongoose](https://mongoosejs.com/)
 * [Passport.js](http://www.passportjs.org/)
 * [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
 * [cors](https://github.com/expressjs/cors)
 * [multer](https://github.com/expressjs/multer)

### Prerequisites
___
To use or/and test this server, you have to install NodeJS and npm on your machine. On how to do that you can read [here](https://nodejs.org/en/download/package-manager/)

### How To Use
___

* Clone this repository
```javascript
$ git clone https://github.com/senatormad/imageBoardServer.git
```
* Go into the repository
```javascript
$ cd imageBoardServer/
```
* Install dependencies
```javascript
$ npm install
```
* Start server
```javascript
$ npm start
```

To test api routes you can use your favorite API client (eg. [Postman](https://www.getpostman.com/), [Insomnia REST](https://insomnia.rest/), [Postwoman](https://postwoman.io/))

Supported routes:

-   {hostUrl}/users/signup  
        POST Body: { "username": "yourUsername", "password": "yourPassword" }  
          
-   {hostUrl}/users/signin  
        POST Body: { "username": "yourUsername", "password": "yourPassword" }  
        Use JWT token from sign as authorization bearer in all registered user requests
          
-   {hostUrl}/users/  
        GET Only admin  
          
-   {hostUrl}/posts/  
        GET Everybody  
        POST Registered users  
        DELETE Only admin  
          
-   {hostUrl}/posts/:postId  
        GET Everybody  
        PUT User that created the post  
        DELETE User that created the post  
          
-   {hostUrl}/posts/:postId/comments
        GET Everybody  
        POST Registered users  
        DELETE Only admin  
          
-   {hostUrl}/posts/:postId/comments/:commentsId  
        GET Everybody  
        PUT User that created the comment  
        DELETE User that created the comment  
          
-   {hostUrl}/imageUpload/  
        POST Registered users



### License
___
[MIT License](https://github.com/senatormad/imageBoardServer/blob/master/LICENSE)