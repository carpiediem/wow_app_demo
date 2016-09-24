var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

// Define user model schema
var VideoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    tags: {
      type: [String],
      required: false
    },
    transcoded: {
      type: Boolean,
      default: false
    }
});

// Send a verification token to this user
VideoSchema.methods.transcode = function(cb) {
  var self = this;

  // Transcode the video
  var uploadPath = self.getPath();
  ffmpeg(uploadPath)
    .videoCodec('libx264')
    .size('1280x720')  // bad solution for vertical video, but it will do for a demo
    .videoBitrate(1000)
    .on('error', function(err, stdout, stderr) {
      console.log('transcode error:', stdout, stderr);
    })
    .on('end', function() {

      // Modify the "ready" attribute in DB
      self.transcoded = true;
      self.save();

    })
    .save(uploadPath + '.mp4');

  // Execute callback
  if (cb) cb.call(self, err, response);
};

// Serve video as a web response
VideoSchema.methods.serve = function(cb) {
  var self = this;

  var filepath = self.getPath() + '.mp4';
  fs.readFile(filepath, cb.call);
};

// Return the path of the file in the uploads directory for this environment
VideoSchema.methods.getPath = function() {
  var self = this;
  console.log("getPath", module.parent.parent.filename, path.dirname(module.parent.parent.filename));
  var parentDirectory = path.dirname(module.parent.parent.filename);
  return path.join(parentDirectory, 'uploads', self.key);
};

// Export user model
module.exports = mongoose.model('Video', VideoSchema);
