/*********************************
*     USER ROUTE
*********************************/
var db = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const auth = require('../auth.js');

module.exports = (app) => {

/**************************************
*             SIGNUP
**************************************/

  //INDEX
  app.get('/signup', (req, res) => {
    res.send('SIGNUP PAGE')
  });

  //SHOW
  app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findById(userId).then((user) => {
      res.json(user);
    });
  });

  //CREATE
  app.post('signup', (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        console.log("hash >>" + hash);
        var newUser = {
          username: req.body.username,
          password: hash
        };
        models.User.create(newUser, {w: 1}).then((savedUser) => {
          //console.log("saved", savedUser.first)
          auth.setUserIDCookie(savedUser, res);
          return res.status(200).send({ message: 'Created user' });
        }).catch((err) => {
          if (err) => {
            res.json(err);
          }
        });
      });
    });
  });

  //UPDATE
  app.put('/user/:id/edit', (req, res) => {
    const userId = req.body.params;
    db.User.update(userId).then((user) => {
      res.json(200);
      res.json({msg: 'successfully updated', user});
    }).catch((err) => {
      if(err) {
        res.json(err)
      };
    });
  });

  //DESTROY
  app.delete('users/:id', (req, res) => {
    const userId = req.body.params;
    db.User.destroy(userId).then((user) => {
      res.status(200);
      res.json({msg: 'successfully deleted', user});
    }).catch((err) => {
      if(err) {
        res.json(err);
      };
    });
  });

/************************************
*             LOGIN
************************************/

  //INDEX
  app.get('/login', (req, res) => {
    res.send('THIS IS THE LOGIN PAGE')
  });

  // Comparing the password given matches
  // the one in the database
  app.post('/login', (req, res) => {
    console.log("username", req.body.username)
    models.User.findOne({where: {username: req.body.username}}).then(data) => {
      bcrypt.compare(req.body.password, data.password,(err, result) => {
        if(err) {
          res.status.(400)
          res.json({msg: 'ERROR: password did not match'}, err)
        }
        if(result){
          //Set authentication cookie
          res.json({msg: 'resulting all results'}, result)
          auth.setUserIDCookie(data, res);
          res.redirect('/')
        } else {
          res.json({msg: 'wrong username or password'})
        };
      });
    };
  });

  /************************************
  *         LOGOUT ROUTE
  ************************************/
  app.get('/logout', (req, res) => {
    res.clearCookie('jwtToken');
    res.redirect('/')
  });
};
