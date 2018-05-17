/*********************************
*     LOGIN ROUTE
*********************************/
var db = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const auth = require('../auth.js');

module.exports = (app) => {

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

};
