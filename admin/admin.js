import "../firebase.js";

/* ==========================
LOGOUT
========================== */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener(

"click",

function(){

localStorage.removeItem("user");

window.location.href =
"../index.html";

}

);

}

/* ==========================
LOAD STATS
========================== */

async function loadStats(){

try{

/* USERS */

const usersSnapshot =

await window.getDocs(

window.collection(
window.db,
"users"
)

);

document.getElementById(
"totalUsers"
).innerText =
usersSnapshot.size;

/* JOBS */

const jobsSnapshot =

await window.getDocs(

window.collection(
window.db,
"jobs"
)

);

document.getElementById(
"totalJobs"
).innerText =
jobsSnapshot.size;

/* TESTS */

const testsSnapshot =

await window.getDocs(

window.collection(
window.db,
"testResults"
)

);

document.getElementById(
"totalTests"
).innerText =
testsSnapshot.size;

/* AVG SCORE */

let totalScore = 0;

testsSnapshot.forEach(doc=>{

const data = doc.data();

totalScore +=
data.score || 0;

});

let average = 0;

if(testsSnapshot.size > 0){

average = Math.round(

totalScore /
testsSnapshot.size

);

}

document.getElementById(
"averageScore"
).innerText =
average + "%";

}

catch(error){

console.log(
"Stats Error:",
error
);

}

}

/* ==========================
RECENT USERS
========================== */

async function loadRecentUsers(){

try{

const container =

document.getElementById(
"recentUsers"
);

container.innerHTML = "";

const snapshot =

await window.getDocs(

window.collection(
window.db,
"users"
)

);

if(snapshot.empty){

container.innerHTML =
"No Users Found";

return;

}

snapshot.forEach(doc=>{

const user =
doc.data();

container.innerHTML += `

<div style="
padding:12px;
border-bottom:1px solid #eee;
">

<strong>

${user.userName || "Unknown"}

</strong>

<br>

<small>

${user.userEmail || ""}

</small>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

/* ==========================
RECENT JOBS
========================== */

async function loadRecentJobs(){

try{

const container =

document.getElementById(
"recentJobs"
);

container.innerHTML = "";

const snapshot =

await window.getDocs(

window.collection(
window.db,
"jobs"
)

);

if(snapshot.empty){

container.innerHTML =
"No Jobs Found";

return;

}

snapshot.forEach(doc=>{

const job =
doc.data();

container.innerHTML += `

<div style="
padding:12px;
border-bottom:1px solid #eee;
">

<strong>

${job.title || ""}

</strong>

<br>

<small>

${job.company || ""}

</small>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

/* ==========================
CHART
========================== */

const chartCanvas =

document.getElementById(
"analyticsChart"
);

if(chartCanvas){

new Chart(

chartCanvas,

{

type:"bar",

data:{

labels:[

"Users",
"Jobs",
"Tests"

],

datasets:[{

label:
"Platform Data",

data:[

10,
5,
15

]

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);

}

/* ==========================
START
========================== */

loadStats();

loadRecentUsers();

loadRecentJobs();

console.log(
"Admin Panel Loaded"
);



const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.querySelector(".sidebar");

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