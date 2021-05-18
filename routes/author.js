const authors = require('../controllers/author.js');

module.exports = function(app) {
  app.post('/api/authors/create', authors.create);
  app.get('/api/authors', authors.findAll);
  app.get('/api/authors/count', authors.count);
  app.get('/api/authors/approved', authors.findAllApproved);
  app.get('/api/authors/:id', authors.findById);
  app.put('/api/authors/:id', authors.update);
  app.delete('/api/authors/:id', authors.delete);
}