const upload = require('../controllers/upload.js');

module.exports = function(app) {
  app.post('/api/upload', upload.index);
}