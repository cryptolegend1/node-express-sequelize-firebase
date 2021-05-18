const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const { fileParser } = require('express-multipart-file-parser');
const cors = require('cors');

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileParser({
    rawBodyOptions: {
      limit: '15mb'
    },
    busboyOptions: {
      limits: {
        fields: 20
      }
    }
  })
);

require('./routes/blog.js')(app);
require('./routes/author.js')(app);
require('./routes/comment.js')(app);
require('./routes/tag.js')(app);
require('./routes/upload.js')(app);

exports.blogs = functions.https.onRequest(app);

// set port, listen for requests
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
