function createMessage(subject,messageNotify,email) {
    const messageParts = [
        'From: UNQfy <enzounq@gmail.com>',
        `To: <${email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        `${messageNotify}`
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}


module.exports = createMessage;