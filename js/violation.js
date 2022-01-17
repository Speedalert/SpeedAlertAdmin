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
const dbRef = ref(getDatabase());
const dbref = ref(db, 'Violations');

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
        var ids = value.violationID;
        var dateTime = value.dateTime;
        var driver = value.driver;
        var plate = value.plate;
        var violation = value.violation;
        addtotable(ids, dateTime, driver, plate, violation);
      });
    }
  });
}

function removerows(){

  var elmtTable = document.getElementById('dataTable');
  var rowCount = elmtTable.rows.length;

  for (var x=rowCount-1; x>0; x--) {
    elmtTable.deleteRow(x);
  }
}

function addtotable(violationID, dateTime, driver, plate, violation){


  var tbody = document.getElementById('tableBody1');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  td1.innerHTML = violationID;
  td2.innerHTML = dateTime;
  td3.innerHTML = driver;
  td4.innerHTML = plate;
  td5.innerHTML = violation;
  td1.classList +="idField";
  td2.classList +="dateTimeField";
  td3.classList +="nameField";
  td4.classList +="plateField";
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  tbody.appendChild(trow);

}

document.getElementById('dataTable').onclick = function(event){

  let dataTr = event.target.parentNode;
  let vid = dataTr.querySelectorAll("td")[0].innerText;
  loadinfo(vid);
  
}


function loadinfo(vid){

  get(child(dbRef, `Violations/${vid}`)).then((ss) => {

    if(ss.exists()){
      
      try{

        const vals = ss.val();
        var drivers = vals.driver;
        var datesTimes = vals.dateTime;
        var plates = vals.plate;
        var zones = vals.zone;
        var addresss = vals.address;
        var violations = vals.violation;
        var tit = "<strong>Violation Record:</strong> "+vid;
        var message = "<b>Date & Time:</b> "+datesTimes+"<br>"+
                      "<b>Driver's Name:</b> "+drivers+"<br>"+
                      "<b>Plate Number:</b> "+plates+"<br>"+
                      "<b>Zone:</b> "+zones+"<br>"+
                      "<b>Address:</b> "+addresss+"<br>"+
                      "<b>Violation:</b> "+violations;
        Swal.fire({

          icon: 'info',
          title: tit,
          html: message,
          position: 'center',
          confirmButtonText: 'Close'

        });
      }

      catch(error){

        Swal.fire({

          icon: 'error',
          title: 'Cannot assign values',
          text: error,
          position: 'center',
          confirmButtonText: 'Close'
        });
      }
    }

    else {
        
        Swal.fire({

          icon: 'error',
          title: 'No records found',
          text: 'No matching records found on specified Violation ID.',
          position: 'center',
          confirmButtonText: 'Close'
        });
    }
  });
}

var searchBar = document.getElementById('SearchInput');
var searchBtn = document.getElementById('SearchBtn');
var category = document.getElementById('CategorySelected');
var body = document.getElementById('tableBody1');

function searchViolation(Category){

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

function searchViolationExact(Category){

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

function searchViolationDate(Category){

  var filter = searchBar.value;
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

category.addEventListener('change', function(e){

  if(category.value == 1){

    try{
      
      searchBar.value = '';
      $('#SearchInput').data("DateTimePicker").destroy();
    }

    catch(err){

      console.log(err);
    }
  }

  else if(category.value == 2){
    
    try{
    
      searchBar.value = '';
      $('#SearchInput').datetimepicker({

        format: 'MM/DD/yyyy hh:mm A'
      });
    }

    catch(err){

      console.log(err);
    }
  }

  else if(category.value == 3){
    try{

      searchBar.value = '';
      $('#SearchInput').data("DateTimePicker").destroy();
    }

    catch(err){

      console.log(err);
    }
  }

  else if(category.value == 4){
    try{

      searchBar.value = '';
      $('#SearchInput').data("DateTimePicker").destroy();
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
    searchViolationExact('idField');
  }

  else if(category.value == 2){
    searchViolationDate('dateTimeField');
  }

  else if(category.value == 3){
    searchViolation('nameField');
  }

  else if(category.value == 4){
    searchViolation('plateField');
  }
}

searchBar.addEventListener('input', function(e){

  searchBtn.click();

});

searchBar.addEventListener("keypress", function(e){

  var key = e.which || e.keyCode || e.key || 0;

  if(key === 13){

    searchBtn.click();
  }
});


window.onload = loadtables;