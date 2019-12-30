import Amplify, { Auth } from 'aws-amplify';
import authConfig from './config'

const LoginButton = document.getElementById('LoginButton');
const GetUserButton = document.getElementById('buttonGetUser');
const GetSessionButton = document.getElementById('buttonGetSession');
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

      Output.innerHTML = JSON.stringify(user, null, 2);
      console.log(user)
  }
  catch(err) {
    Output.innerHTML = JSON.stringify(err, null, 2);
    console.log('Error: ' + err)
  }
});

GetSessionButton.addEventListener('click', async (evt) => {
  try {
    let session = await Auth.currentSession();
    Output.innerHTML = JSON.stringify(session, null, 2);
    console.log(session)
  }
  catch(err){
    Output.innerHTML = JSON.stringify(err, null, 2);
    console.log('Error: ' + err)
  }
})

LogoutButton.addEventListener('click', async (evt) => {
  try {
    let data = await Auth.signOut()
    Output.innerHTML = JSON.stringify(data, null, 2);
    console.log(data)
  }
  catch(err)  {
    err => console.log(err)
    console.log('Error: ' + err)
  }
});

LoginButton.addEventListener('click', async (evt) => {
  try {
    let user = await Auth.federatedSignIn({provider: 'Google'});
    Output.innerHTML = JSON.stringify(user, null, 2);
    console.log(user);
  }
  catch(err) {
    console.log('Error: ' + err)
    console.log(err)
  }
})
