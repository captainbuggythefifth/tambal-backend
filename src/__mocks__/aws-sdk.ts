// __mocks__/aws-sdk.js (Jest automocks this module if you follow this convention)
'use strict';

import AWS from 'aws-sdk';
// const AWS = require('AWS');


// Make your own modifications
AWS.config.update({ region: 'ap-southeast-1' });
AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: 'gau'
});


export default AWS