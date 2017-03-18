const env = process.env;
const client = require('twilio')(env.twilioAccountSid, env.twilioAuthToken);

function send(message) {
  console.log(message);
  client.messages.create({
    to: env.mobile,
    from: env.twilioAssignedPhoneNumber,
    body: message,
  }, (err, responseData) => {
    console.log(responseData.sid);
  });
}

module.exports.send = send;
