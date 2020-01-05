import Amplify, { Auth, Storage } from 'aws-amplify';
import authConfig from './config'
import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';

const LoginButton = document.getElementById('LoginButton');
const GetUserButton = document.getElementById('buttonGetUser');
const GetSessionButton = document.getElementById('buttonGetSession');
const GetCredentialsButton = document.getElementById('buttonTestGetCredentials');
const LogoutButton = document.getElementById('LogoutButton');
const CloudFormationStacksListButton = document.getElementById('buttonCFMStackList');
const Output = document.getElementById('output');

console.log(JSON.stringify(authConfig));

Amplify.configure({
  Auth: authConfig
});

AWS.config.region = authConfig.region;


  
GetUserButton.addEventListener('click', async (evt) => {
  try {
    let user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });

      OutputWrite(user)
  }
  catch(err) {
    Output.innerHTML = JSON.stringify(err, null, 2);
    OutputWrite('Error: ' + err)
  }
});

GetSessionButton.addEventListener('click', async (evt) => {
  try {
    let session = await Auth.currentSession();
    Output.innerHTML = JSON.stringify(session, null, 2);
    OutputWrite(session)
  }
  catch(err){
    OutputWrite('Error: ' + err)
  }
})

LogoutButton.addEventListener('click', async (evt) => {
  try {
    let data = await Auth.signOut()
    OutputWrite(data)
  }
  catch(err)  {
    OutputWrite('Error: ' + err)
  }
});

LoginButton.addEventListener('click', async (evt) => {
  try {
    let user = await Auth.federatedSignIn({provider: 'Google'});
    OutputWrite(user);
  }
  catch(err) {
    OutputWrite('Error: ' + err)
  }
})


GetCredentialsButton.addEventListener('click', async (evt) => {
  try {
    let credentials = await Auth.currentCredentials();
    OutputWrite(credentials.data.Credentials);
  }
  catch(err) {
    OutputWrite('Error: ' + err)
  }
});

CloudFormationStacksListButton.addEventListener('click', async (evt) => {
  try {
    let currentCredentials = await Auth.currentCredentials();
    let credentials = currentCredentials.data.Credentials;

    AWS.config.update(
      {
        accessKeyId: credentials.AccessKeyId, 
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken
      });
      
    var cloudformation = new AWS.CloudFormation();
    var param ={
      StackStatusFilter: [
        'CREATE_IN_PROGRESS', 'CREATE_FAILED', 'CREATE_COMPLETE', 'ROLLBACK_IN_PROGRESS', 'ROLLBACK_FAILED',
        'ROLLBACK_COMPLETE', 'DELETE_IN_PROGRESS', 'DELETE_FAILED', 'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_IN_PROGRESS', 'UPDATE_ROLLBACK_FAILED', 'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_ROLLBACK_COMPLETE', 'REVIEW_IN_PROGRESS'
      ]
    };

    var stacks = await cloudformation.listStacks(param).promise();
    OutputWrite(stacks);    
  }
  catch(err) {
    OutputWrite('Error: ' + err)
  }
})

function OutputWrite(value){
  Output.innerHTML = JSON.stringify(value, null, 2);
  console.log('>>> ' + value)
  console.log(value)
}