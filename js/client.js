import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'
import { getDatabase, ref, get, child, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js'

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
const db = getDatabase();
const dbref = ref(db, 'Users');
var searchBar = document.getElementById('SearchInput');
var searchBtn = document.getElementById('SearchBtn');
var category = document.getElementById('CategorySelected');
var body = document.getElementById('tableBody1');


onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("A user is currently signed in.");
  } else {
    window.location.href = "index.html";  
  }
});

const logout = async () => {

  await signOut(auth);
  window.location.href = "index.html";
}

btnLogout.addEventListener("click", logout);


function loadtables(){

  onValue(dbref, (snapshot) => {

    if(snapshot.exists()){

      removerows();
      snapshot.forEach((data) => {

        const value = data.val(); 
        var fullname = value.fullname;
        var platenumber = value.platenumber;
        var status = value.UserStatus;
        var speed = value.speed;
        var location = value.location;
        addtotable(fullname, platenumber, status, speed, location);
      });
    }
  });
}

function addtotable(fullname, platenumber, status, speed, location){

  var tbody = document.getElementById('tableBody1');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  td1.innerHTML = fullname;
  td2.innerHTML = platenumber;
  td3.innerHTML = status;
  td4.innerHTML = speed;
  td5.innerHTML = location;
  td1.classList +="nameField";
  td2.classList +="plateField";
  td3.classList +="statusField";
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  tbody.appendChild(trow);
}

function removerows(){

  var elmtTable = document.getElementById('dataTable');
  var rowCount = elmtTable.rows.length;

  for (var x=rowCount-1; x>0; x--) {
    elmtTable.deleteRow(x);
  }
}


function searchClient(Category){

  var filter = searchBar.value.toUpperCase();
  var tr = body.getElementsByTagName("tr");
  var found;

  for(let i = 0; i < tr.length; i++){
    
    var td = tr[i].getElementsByClassName(Category);

    for(let j = 0; j < td.length; j++){

      if(td[j].innerHTML.toUpperCase().indexOf(filter) > -1){

        found = true;
      }
    }

    if(found){

      tr[i].style.display = "";
      found = false;
    }

    else {

      tr[i].style.display="none";
    }
  }
}

function searchClientExact(Category){

  var filter = searchBar.value.toUpperCase();
  var tr = body.getElementsByTagName("tr");
  var found;

  for(let i = 0; i < tr.length; i++){
    
    var td = tr[i].getElementsByClassName(Category);

    for(let j = 0; j < td.length; j++){

      if(td[j].innerHTML.toUpperCase() == filter){

        found = true;
      }
    }

    if(found){

      tr[i].style.display = "";
      found = false;
    }

    else {

      tr[i].style.display="none";
    }
  }
}

category.addEventListener('change', function(e){

  if(category.value == 1 || 2 || 3){

    try{
      
      searchBar.value = '';
    }

    catch(err){

      console.log(err);
    }
  }
});

searchBtn.onclick = function(){

  if(searchBar.value == ""){

    loadtables();
  }

  else if(category.value == 1){
    searchClient("nameField");
  }

  else if(category.value == 2){
    searchClientExact("plateField");
  }

  else if(category.value == 3){
    searchClientExact("statusField");
  }
}

searchBar.addEventListener('input', function(e){

  searchBtn.click();

});

window.onload = loadtables;
