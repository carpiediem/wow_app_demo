var mongoose = require('mongoose');

// Create authenticated Authy and Twilio API clients
var authy = require('authy')(process.env.AUTHY_KEY);
var twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Define user model schema
var UserSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    authyId: String
});

// Send a verification token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
    var self = this;
    console.log("user is", self);
    if (!self.authyId) {
        // Register this user if it's a new user
        var fakeEmail = (new Date()).getTime()+"@random.net"; // unique emails are required by Authy API

        authy.register_user(fakeEmail, self.phone, self.countryCode,
          function(err, response) {

            if (err || !response.user) return cb.call(self, err);

            self.authyId = response.user.id;
            self.save(function(err, doc) {
                console.log("post save", err, doc);
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    var self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};

// Send a text message via twilio to this user
UserSchema.methods.sendMessage = function(message, cb) {
    var self = this;
    twilioClient.sendMessage({
        to: self.countryCode+self.phone,
        from: config.twilioNumber,
        body: message
    }, function(err, response) {
        cb.call(self, err);
    });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
