const authConfig = 
{
    // REQUIRED - Amazon Cognito Region
    region: 'eu-central-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: '<UserPoolId>',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '<WebClientId>',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    clientMetadata: { myCustomKey: 'myCustomValue' },

        // OPTIONAL - Hosted UI configuration
    oauth: {
        domain: '<WebSiteName>',
        redirectSignIn: 'http://localhost:8080/',
        redirectSignOut: 'http://localhost:8080/',
        responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
};

export default authConfig;