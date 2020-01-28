'use strict';

const jwt = require('jsonwebtoken');

//verify JWT and build a policy to allow Lambda access
exports.handler = (event, context, callback) => {
    let token = event.authorizationToken;

    try {
        if (token.includes('Bearer')) {
            token = token.split(" ")[1];
        }

        //in prod, the secret would be pulled into the code from AWS secret manager
        const decoded = jwt.verify(token, 'hiuh7f5cdfghytr');

        const user = decoded.user;

        //this policy is wide open which I would also not normally do
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
