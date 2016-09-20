var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// mongoose.connect('mongodb://127.0.0.1/test');
// var conn = mongoose.connection;
//
// var fs = require('fs');
//
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;

/**
 * GET /contact
 * Contact form page.
 */
exports.getUpload = (req, res) => {
  res.render('upload', {
    title: 'Upload'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postUpload = (req, res) => {
  req.assert('title', 'Title cannot be blank').notEmpty();
  //req.assert('file', 'File is not valid').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/upload');
  }

  // console.log("req.body", req.body);
  // console.log("req.file", req.file);

  console.log("running ffmpeg");
  var command = ffmpeg(req.file.path)
    .videoCodec('libx264')
    .on('error', function(err, stdout, stderr) {
      console.log('an error happened: ' + err.message, stdout, stderr);
    })
    .on('end', function() {
      console.log('Finished processing');
    })
    .save('D:\\nodejs\\wow_app_demo\\uploads\\output.mp4');

  return res.redirect('/');
};


exports.getVideo = (req, res) => {

  var filepath = path.join(path.dirname(module.parent.filename), 'uploads', req.params.fileName);
  fs.readFile(filepath, function (err, data) {
    if (err) {
      res.statusCode = 404;
      res.end("Error : file not found");
    }

    res.type('video/mp4');
    res.end(data, "binary");
  });

}
