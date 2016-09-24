Wow App Demo
=======================



**Live Demo**: http://wow.rslc.us

A demo app for a job application.


Spec
--------

- A Login Screen requiring a mobile number where once a user inputs their mobile number, they will receive an SMS in order to continue to login. Total Fields: Mobile Number, SMS Verification Code. How to secure user login state? And please design a database structure for this, and store the login information into the database. Database can be MySQL / MongoDB / Firebase.
- After Logged in, a Video List Screen, Listing all uploaded videos. There are no videos just yet. Add a button for user(s) to upload a video.
- Video Upload Screen: Allows user(s) to input title, description, file upload field for video, tags. Please store those data into the database. Please design.
- Video format transcode: require H.264 MP4 Format, 720p. Please transcode the video locally / on the server side.
- Back to the Video List Screen, there would be the video just uploaded, and play the video. The video will replay automatically after finished.
- Make a program to scrape the app features of the WOW App on WOW Website, Titles, Sub Titles and Images for each app feature, clean up HTML formats, just keep the text and image url, output as JSON format.

Libraries
-------------

- [MongoDB](https://www.mongodb.org/downloads) (using [Mongo Lab](https://mlab.com/) for the live demo)
- [Node.js 6.0+](http://nodejs.org) (using Heroku for deployment)
- [Twilio]() and [Authy]() for logging in with SMS verification
- [ffmpeg](https://ffmpeg.org/) for video transcoding, including [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) and [a Heroku buildpack](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest)


Getting Started
---------------

TBD

License for Project Starter
-------

The MIT License (MIT)

Copyright (c) 2014-2016 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
