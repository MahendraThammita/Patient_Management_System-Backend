module.exports = function (receiver, message){

    const mailMessage = {
        from: 'The PMS',
        to: receiver,
        subject: 'Appointment Details',
        text: message
    };

    const processMail = () => {
        return mailMessage;
    }
}

