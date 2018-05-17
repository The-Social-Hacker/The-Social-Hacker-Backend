/********************************
*        INDEX ROUTE
********************************/

module.exports = (app) => {

  app.get('/', (req,res) => {
    res.send("Index page goes here")
  });

  app.post('/', (req, res, next) => {
  // replace an HTTP posted body property with the sanitized string
  req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
  // send the response
  res.json({msg:'Your value was sanitized to: '},  req.body.sanitized);
  });
}
