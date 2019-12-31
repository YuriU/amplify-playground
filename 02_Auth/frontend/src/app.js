import Amplify, { Auth } from 'aws-amplify';
import authConfig from './config'

const LoginButton = document.getElementById('LoginButton');
const GetUserButton = document.getElementById('buttonGetUser');
const GetSessionButton = document.getElementById('buttonGetSession');
const TestEndpointButton = document.getElementById('buttonTestEndpoint');
const LogoutButton = document.getElementById('LogoutButton');
const Output = document.getElementById('output');

console.log(JSON.stringify(authConfig));

Amplify.configure({
  Auth: authConfig
});
  
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


TestEndpointButton.addEventListener('click', async (evt) => {
  try {
    let accessToken = await (await Auth.currentSession()).getIdToken().getJwtToken();
    
    let response = await fetch(`https://la73dsw507.execute-api.eu-central-1.amazonaws.com/dev/test`, {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': accessToken
      })
    });

    if(response.status === 200)
    {
      OutputWrite(await response.json())
    }
  }
  catch(err)  {
    OutputWrite('Error: ' + err)
  }
});

function OutputWrite(value){
  Output.innerHTML = JSON.stringify(value, null, 2);
  console.log('>>> ' + value)
  console.log(value)
}