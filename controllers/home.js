const Video = require('../models/Video');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

  // Query mongodb for uploaded videos
  var videos = Video.find({}, displayVideos).sort('-_id').limit(12);

  function displayVideos(err, videos) {
    if (err) { return done(err); }

    var renderable = videos.map(function(v, i) {
      v.url = '/video/' + v.key;
      v.autoplay = i==0;
      return v;
    });

    res.render('home', {
      title: 'Home',
      videos: renderable
    });

  }

};
