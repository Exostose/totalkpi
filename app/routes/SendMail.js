exports.sendMail = function (corps, dest) {

    var nodemailer = require('nodemailer');

    // Assumes HTTP/S proxy (eg. Squid) running on port 3128
    // NB! The proxy must allow CONNECT tunnels to SMTP ports

    // Create a SMTP transporter object
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'test.serveur.totem@gmail.com',
            pass: 'AzertyuioP123'
        },
        logger: true, // log to console
        debug: true, // include SMTP traffic in the logs

        // define proxy configuration
       proxy: 'http://fr-proxy.groupinfra.com:3128'
    });

    console.log('SMTP Configured');

    var destinataire = '"Receiver Name" <'+dest+">";
    console.log(destinataire);

    var message = {
        from: 'Total bot <test.serveur.totem@gmail.com>',
        to: destinataire,
        subject: 'Ticket Detail', //
        text: 'Hello to myself!',
        html: '<p>' + corps + '</p>'
    };

    console.log('Sending Mail');
    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
    });
};