const comments = require('../controllers/comment.js');

module.exports = function(app) {
  app.post('/api/comments/create', comments.create);
  app.get('/api/comments', comments.findAll);
  app.get('/api/comments/count-waiting', comments.countWaiting);
  app.get('/api/comments/approved', comments.findAllApproved);
  app.get('/api/comments/:id', comments.findById);
  app.put('/api/comments/:id', comments.update);
  app.delete('/api/comments/:id', comments.delete);
}