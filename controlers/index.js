/********************************
*        INDEX ROUTE
********************************/

module.exports = function(app) {

  app.get('/', (req,res) => {
    res.send("Index page goes here")
  });
}
