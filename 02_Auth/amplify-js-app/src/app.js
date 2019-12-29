import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { onCreateTodo } from './graphql/subscriptions'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

API.configure(awsconfig);
PubSub.configure(awsconfig);
//Amplify.configure(awsconfig);



async function createNewTodo() {
  const todo = { name: "Use AppSync" , description: "Realtime and Offline"}
  return await API.graphql(graphqlOperation(createTodo, { input: todo }))
}

async function getData() {
    QueryResult.innerHTML = `QUERY RESULTS`;
    API.graphql(graphqlOperation(listTodos)).then((evt) => {
      evt.data.listTodos.items.map((todo, i) => 
      QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
      );
    })
  }

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');
const QueryResult = document.getElementById('QueryResult');
const SubscriptionResult = document.getElementById('SubscriptionResult');
const LoginButton = document.getElementById('LoginButton');
const CheckLoginButton = document.getElementById('CheckLoginButton');
const LogoutButton = document.getElementById('LogoutButton');

API.graphql(graphqlOperation(onCreateTodo)).subscribe({
    next: (evt) =>{
      SubscriptionResult.innerHTML = `SUBSCRIPTION RESULTS`
      const todo = evt.value.data.onCreateTodo;
      SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
    }
  });
  
MutationButton.addEventListener('click', (evt) => {
  MutationResult.innerHTML = `MUTATION RESULTS:`;
  createNewTodo().then( (evt) => {
    MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`
    getData();
  })
});

CheckLoginButton.addEventListener('click', (evt) => {

  Auth.currentAuthenticatedUser({
    bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log(user))
   .catch(err => console.log(err));


   Auth.currentSession()
    .then(data => console.log(data))
    .catch(err => console.log(err));
});

LogoutButton.addEventListener('click', (evt) => {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err))
});




// You can get the current config object
const currentConfig = Auth.configure();


LoginButton.addEventListener('click', async (evt) => {

  try {
    let user = await Auth.federatedSignIn({provider: 'Google'});
    console.log(user);
  }
  catch(err) {
    console.log(err)
  }
})
