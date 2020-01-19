const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const authenticate = require('../authenticate');

const Posts = require('../models/post');

const postRouter = express.Router();

postRouter.use(bodyParser.json());

postRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Posts.find({})
    .populate('author')
    .populate('comments.author')
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.author = req.user._id;
    Posts.create(req.body)
    .then((post) => {
        console.log('Post Created ', post);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Posts.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

postRouter.route('/:postId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Posts.findById(req.params.postId)
    .populate('author')
    .populate('comments.author')
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (!post.author.equals(req.user._id)) {
            var err = new Error("You are not authorized!");
            err.status = 403
            next(err);
        } else {
            (req.body.name) && (post.name = req.body.name);
            (req.body.description) && (post.description = req.body.description);
            (req.body.image) && (post.image = req.body.image);
            (req.body.tag) && (post.tag = req.body.tag);
            post.save()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null) {
            if (!post.author.equals(req.user._id)) {
                var err = new Error("You are not authorized!");
                err.status = 403
                next(err);
            } else {
                post.remove()
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
                }
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

postRouter.route('/:postId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Posts.findById(req.params.postId)
    .populate('comments.author')
    .then((post) => {
        if (post != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments);
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null) {
            req.body.author = req.user._id;
            post.comments.push(req.body);
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts/'
        + req.params.postId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null) {
            for (var i = (post.comments.length -1); i >= 0; i--) {
                post.comments.id(post.comments[i]._id).remove();
            }
            post.save()
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

postRouter.route('/:postId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Posts.findById(req.params.postId)
    .populate('comments.author')    
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments.id(req.params.commentId));
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            if (!post.comments.id(req.params.commentId).author.equals(req.user._id)) {
                var err = new Error("You are not authorized!");
                err.status = 403
                next(err);
            } else {
                (req.body.rating) && (post.comments.id(req.params.commentId).rating = req.body.rating);
                (req.body.comment) && (post.comments.id(req.params.commentId).comment = req.body.comment);
                post.save()
                .then((post) => {
                    Posts.findById(post._id)
                    .populate('comments.author')
                    .then((post) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(post);  
                    })              
                }, (err) => next(err));
            }
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            if (!post.comments.id(req.params.commentId).author.equals(req.user._id)) {
                var err = new Error("You are not authorized!");
                err.status = 403
                next(err);
            } else {

                post.comments.id(req.params.commentId).remove();
                post.save()
                .then((post) => {
                    Posts.findById(post._id)
                    .populate('comments.author')
                    .then((post) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(post);  
                    })               
                }, (err) => next(err));
            }
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = postRouter;