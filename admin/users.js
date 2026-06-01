import "../firebase.js";

/* =========================
LOGOUT
========================= */

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.addEventListener(

"click",

()=>{

localStorage.removeItem(
"user"
);

window.location.href =
"../index.html";

}

);

}

/* =========================
LOAD USERS
========================= */

let allUsers = [];

async function loadUsers(){

try{

const snapshot =

await window.getDocs(

window.collection(
window.db,
"users"
)

);

allUsers = [];

snapshot.forEach(doc=>{

allUsers.push({

id:doc.id,

...doc.data()

});

});

document.getElementById(
"usersCount"
).innerText =
allUsers.length;

renderUsers(
allUsers
);

}

catch(error){

console.log(
"Users Error:",
error
);

}

}

/* =========================
RENDER USERS
========================= */

function renderUsers(users){

const tbody =
document.getElementById(
"usersTableBody"
);

if(users.length === 0){

tbody.innerHTML =

`

<tr>

<td colspan="3">

No Users Found

</td>

</tr>
`;

return;

}

tbody.innerHTML = "";

users.forEach(user=>{

tbody.innerHTML +=

`

<tr>

<td>

${user.userName || "Unknown"}

</td>

<td>

<span class="user-email">

${user.userEmail || ""}

</span>

</td>

<td>

<button
class="delete-btn"
onclick="deleteUser('${user.id}')">

Delete

</button>

</td>

</tr>
`;

});

}

/* =========================
SEARCH
========================= */

const searchInput =

document.getElementById(
"searchUser"
);

if(searchInput){

searchInput.addEventListener(

"input",

function(){

const value =

this.value
.toLowerCase();

const filteredUsers =

allUsers.filter(user=>{

const name =

(
user.userName ||
""
)
.toLowerCase();

const email =

(
user.userEmail ||
""
)
.toLowerCase();

return (

name.includes(value) ||

email.includes(value)

);

});

renderUsers(
filteredUsers
);

}

);

}

/* =========================
DELETE USER
========================= */

async function deleteUser(id){

const confirmDelete =

confirm(

"Delete this user?"

);

if(!confirmDelete)
return;

try{

await window.deleteDoc(

window.doc(
window.db,
"users",
id
)

);

loadUsers();

}

catch(error){

console.error(
"DELETE ERROR:",
error
);

alert(
error.message
);

}

}

window.deleteUser =
deleteUser;

/* =========================
START
========================= */

loadUsers();

console.log(
"Users Page Loaded"
);


/* MOBILE SIDEBAR */

const menuBtn =
document.getElementById(
"menuBtn"
);

const sidebar =
document.querySelector(
".sidebar"
);

if(menuBtn){

menuBtn.addEventListener(

"click",

()=>{

sidebar.classList.toggle(
"show"
);

}

);

}

const closeSidebar =
document.getElementById(
"closeSidebar"
);

if(closeSidebar){

closeSidebar.addEventListener(

"click",

()=>{

sidebar.classList.remove(
"show"
);

}

);

}