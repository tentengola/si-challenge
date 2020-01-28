'use strict';

const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
    let token = event.authorizationToken;

    try {
        if (token.includes('Bearer')) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, 'hiuh7f5cdfghytr');

        const user = decoded.user;

        const policy = {
            principalId: user,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }],
            },
            context: {
                user: user
            }
        };

        callback(null, policy);
    }
    catch (err) {
        callback('Unauthorized');
    }
};
