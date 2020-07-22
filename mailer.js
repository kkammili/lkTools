var nodemailer = require('nodemailer');
// module.exports = function(){

    var transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'kkrajus777@gmail.com',
            pass: 'Kkraju**4'
        }
    });

    var mailOptions = {
        from: 'kkrajus777@gmail.com',
        to: 'kittu.krishna.krishnamraju@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
// }