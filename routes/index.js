const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    apiList: [
      '{heroku url}/users/signup',
      '{heroku url}/users/signin',
      '{heroku url}/users/',
      '{heroku url}/posts/',
      '{heroku url}/posts/:postId',
      '{heroku url}/posts/:postId/comments',
      '{heroku url}/posts/:postId/comments/:commentsId',
      '{heroku url}/imageUpload/',
    ],
  });
});

module.exports = router;
