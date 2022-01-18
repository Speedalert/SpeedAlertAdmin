import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'
import { getDatabase, ref, get, child, onValue, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js'

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
const dbref = ref(db, 'Users');
const dB = getDatabase();
var currentUser = '';

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
        var driver = value.fullname;
        var contact = value.contactnumber;
        var email = value.emailaddress;
        var plate = value.platenumber;
        var login = value.LastLoginDateTime;
        var logout = value.LastLogoutDateTime;
        addtotable(driver, contact, email, plate, login, logout);
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

function addtotable(driver, contact, email, plate, login, logout){


  var tbody = document.getElementById('tableBody1');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  var td6 = document.createElement('td');
  td1.innerHTML = driver;
  td2.innerHTML = contact;
  td3.innerHTML = email;
  td4.innerHTML = plate;
  td5.innerHTML = login;
  td6.innerHTML = logout;
  td1.classList +="nameField";
  td4.classList +="plateField";
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  trow.appendChild(td6);
  tbody.appendChild(trow);

}

document.getElementById('dataTable').onclick = function(event){

  let dataTr = event.target.parentNode;
  let uname = dataTr.querySelectorAll("td")[2].innerText;
  currentUser = uname.split("@");
  loadinfo(currentUser[0]);
  
}

function loadinfo(uname){

  get(child(dbRef, `Users/${uname}`)).then((ss) => {

    if(ss.exists()){

      try{

        const vals = ss.val();
        var driver = vals.fullname;
        var contact = vals.contactnumber;
        var plate = vals.platenumber;
        var htmls = 
              '<input id="swal-input1" size="25" style="margin-left: 72px;" value=\"'+driver+'\" class="swal2-input">' +
              '<input id="swal-input2" size="25" style="margin-left: 72px;" value=\"'+contact+'\" class="swal2-input">' +
              '<input id="swal-input3" size="25" style="margin-left: 72px;" value=\"'+plate+'\" class="swal2-input">';

        (async () => {

          const {value: formValues} = await Swal.fire({

            icon: 'warning',
            title: '<strong>Edit Account Details</strong>',
            focusConfirm: false,
            position: 'center',
            showCancelButton: true,
              confirmButtonText: '<i class="fa fa-thumbs-up"></i> Submit!',
              confirmButtonAriaLabel: 'Thumbs up, great!',
            html: htmls,
            preConfirm: () => {
              
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value
              ]
            } 
          });

          if (formValues) {
            
            Swal.fire({
              title: '<strong>Proceed with the update?</strong>',
              html: "<p style='margin-left: 95px;'>You won't be able to revert this!<p>",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: '<strong>Proceed</strong>'
            }).then((result) => {
                if (result.isConfirmed) {
                  
                  update(ref(dB, `Users/${uname}`), {

                    fullname: formValues[0],
                    contactnumber: formValues[1],
                    platenumber: formValues[2]
                  }).then(() => {

                      Swal.fire({
                        title: '<strong>Updated!</strong>',
                        html: "<p style='margin-left: 50px;'>Account details has been successfully updated.</p>",
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                      });

                  }).catch((error) => {
                      
                      Swal.fire({
                        icon: 'error',
                        title: 'Update is unable to proceed!',
                        text: error,
                        position: 'center',
                        confirmButtonText: 'Close'
                      });
                  });
                }
            })
          }
        })()
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
          title: 'Error',
          text: 'No matching records found.',
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

function searchAccount(Category){

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

searchBtn.onclick = function(){

  if(searchBar.value == ""){

    loadtables();
  }

  else if(category.value == 1){
    searchAccount('nameField');
  }

  else if(category.value == 2){
    searchAccount('plateField');
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

category.addEventListener('change', function(e){

  if(category.value == 1 || 2 ){

    try{
      
      searchBar.value = '';
    }

    catch(err){

      console.log(err);
    }
  }
});

window.onload = loadtables;