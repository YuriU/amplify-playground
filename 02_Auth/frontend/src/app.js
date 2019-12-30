import Amplify, { Auth } from 'aws-amplify';
import authConfig from './config'

const LoginButton = document.getElementById('LoginButton');
const CheckLoginButton = document.getElementById('CheckLoginButton');
const LogoutButton = document.getElementById('LogoutButton');

console.log(JSON.stringify(authConfig));

Amplify.configure({
  Auth: authConfig
});
  
CheckLoginButton.addEventListener('click', async (evt) => {

  try {
    let user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });
      console.log(user)
  }
  catch(err) {
    console.log('Error: ' + err)
  }

  try {
    let session = await Auth.currentSession();
    console.log(session)
  }
  catch(err){
    console.log('Error: ' + err)
  }
});

LogoutButton.addEventListener('click', async (evt) => {
  try {
    let data = await Auth.signOut()
    console.log(data)
  }
  catch(err)  {
    err => console.log(err)
  }
});

LoginButton.addEventListener('click', async (evt) => {
  try {
    let user = await Auth.federatedSignIn({provider: 'Google'});
    console.log(user);
  }
  catch(err) {
    console.log(err)
  }
})
