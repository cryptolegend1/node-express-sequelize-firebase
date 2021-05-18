const blogs = require('../controllers/blog.js');

module.exports = function(app) {
  app.post('/api/blogs/create', blogs.create);
  app.get('/api/blogs', blogs.findAll);
  app.get('/api/blogs/count-waiting', blogs.countWaiting);
  app.get('/api/blogs/approved', blogs.findAllApproved);
  app.get('/api/blogs/:id', blogs.findById);
  app.put('/api/blogs/:id', blogs.update);
  app.delete('/api/blogs/:id', blogs.delete);
}