const tags = require('../controllers/tag.js');

module.exports = function(app) {
  app.post('/api/tags/create', tags.create);
  app.get('/api/tags', tags.findAll);
  app.get('/api/tags/:id', tags.findById);
  app.put('/api/tags/:id', tags.update);
  app.delete('/api/tags/:id', tags.delete);
}