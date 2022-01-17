import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'
import { getDatabase, ref, get, child } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js'

const firebaseApp = initializeApp({

  apiKey: "AIzaSyD95dDNTKdS-4qoZtl6AR9-7Ng6uCfK2uc",

  authDomain: "speedalert-4d95b.firebaseapp.com",

  databaseURL: "https://speedalert-4d95b.firebaseio.com",

  projectId: "speedalert-4d95b",

  storageBucket: "speedalert-4d95b.appspot.com",

  messagingSenderId: "784059688481",

  appId: "1:784059688481:web:2c700eef099caa34cca560",

  measurementId: "G-5KLN31LWD7"

});


const auth = getAuth(firebaseApp);
const dbref = ref(getDatabase());
var uname = " ";
var emails = " ";
const delay = ms => new Promise(res => setTimeout(res, ms));

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    window.location.href = "client.html";
  } else {
    console.log('No user is currently signed in.');
  }
});

const loginEmailPassword = async () => {

  const email = loginusername.value;
  const pass = loginpassword.value;
  emails = email;
  getEmail();

 await delay(1000);

  if(!email){

    document.getElementById("alert").innerHTML = "Please enter a valid username."
    document.getElementById("alertbox").style.display = "block";
    
    if(document.getElementById("alertbox").style.display === "block"){

      setTimeout(function(){
        document.getElementById("alertbox").style.display = "none";
      },3000);
    };

    document.getElementById("loginpassword").value = "";
    document.getElementById("loginpassword").placeholder = "Password";
  }

  else if(!pass){

    document.getElementById("alert").innerHTML = "Please enter a valid password."
    document.getElementById("alertbox").style.display = "block";
    
    if(document.getElementById("alertbox").style.display === "block"){

      setTimeout(function(){
        document.getElementById("alertbox").style.display = "none";
      },3000);
    };
  }

  else {

    try{

      const userCredential = await signInWithEmailAndPassword(auth, uname, pass);
      window.location.href = "client.html"
    }

    catch(error){

      document.getElementById("alert").innerHTML = error.message;
      document.getElementById("alertbox").style.display = "block";

      if(document.getElementById("alertbox").style.display === "block"){

        setTimeout(function(){
          document.getElementById("alertbox").style.display = "none";
        },3000);
      };
    }
  }
} 

btnLogin.addEventListener("click", loginEmailPassword);

loginpassword.addEventListener("keypress", function(e){

  var key = e.which || e.keyCode || e.key || 0;

  if(key === 13){

    loginEmailPassword();
  }
});

loginusername.addEventListener("keypress", function(e){

  var key = e.which || e.keyCode || e.key || 0;

  if(key === 13){

    loginEmailPassword();
  }
});

function getEmail(){

    get(child(dbref, `Emails/${emails}`)).then((snapshot) => {

      if(snapshot.exists()){

        uname = snapshot.val();
        console.log("On success getEmail(Login): "+snapshot.val());
      }

      else {

        console.log("On failed getEmail(Login): No Data Available");
      }
    }).catch((error) =>{

      document.getElementById("alert").innerHTML = 'User email does not exist: '+error;
      document.getElementById("alertbox").style.display = "block";

        if(document.getElementById("alertbox").style.display === "block"){

          setTimeout(function(){
            document.getElementById("alertbox").style.display = "none";
          },3000);
        };
      });
}



window.onLoad = function(){

  document.getElementById("loginusername").value = "";
  document.getElementById("loginusername").placeholder = "Username";
  document.getElementById("loginpassword").value = "";
  document.getElementById("loginpassword").placeholder = "Password";
}

