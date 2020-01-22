## imageBoardServer

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8400b46cec74afca9bc38cc38dfae9e)](https://app.codacy.com/manual/senator.mad/imageBoardServer?utm_source=github.com&utm_medium=referral&utm_content=senatormad/imageBoardServer&utm_campaign=Badge_Grade_Dashboard)

nodejs image board server

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