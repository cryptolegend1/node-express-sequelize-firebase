const uuid = require('uuid');
const admin = require('firebase-admin');
const storage = admin.storage();
const bucket = storage.bucket('dev-skael-website.appspot.com');

exports.index = async (req, res) => {
  let file = req.files[0];
  if (file) {
    uploadImageToStorage(file)
      .then(url => {
        return res.status(200).send({
          url: url
        });
      })
      .catch(error => {
        console.log(error);
        return res.status(200).send({
          url: ''
        });
      });
  } else {
    return res.status(400).send();
  }
};

const uploadImageToStorage = file => {
  return new Promise((resolve, reject) => {
    let newFileName = `uploads/${Date.now()}_${file.originalname}}`;

    let fileUpload = bucket.file(newFileName);
    let downloadToken = uuid.v4();

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: downloadToken
      }
    });

    blobStream.on('error', error => {
      reject(error);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(
        fileUpload.name
      )}?alt=media&token=${downloadToken}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};
