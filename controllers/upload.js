const Video = require('../models/Video');
var fs = require('fs');
var path = require('path');

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
 * Add a record to the database and an MP4 to the file system
 */
exports.postUpload = (req, res) => {
  req.assert('title', 'Title cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/upload');
  }

  // console.log("req.body", req.body);
  // console.log("req.file", req.file);

  // Add a record to the database
  video = new Video({
    title: req.body.title,
    key: req.file.filename,
    description: req.body.description,
    tags: req.body.tags.split(',')
  });
  video.save();
  video.transcode();

  req.flash('It may take a few minutes to process your video, before it appears.');
  return res.redirect('/');
};


exports.getVideo = (req, res) => {

  var parentDirectory = path.dirname(module.parent.filename);
  var filepath = path.join(parentDirectory, 'uploads', req.params.fileName + '.mp4');
  fs.readFile(filepath, function (err, data) {
    if (err) {
      res.statusCode = 404;
      return res.end("Error : file not found");
    }

    res.type('video/mp4');
    res.end(data, "binary");
  });

}
