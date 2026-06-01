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
LOAD JOBS
========================= */

let allJobs = [];

async function loadJobs(){

try{

const snapshot =

await window.getDocs(

window.collection(
window.db,
"jobs"
)

);

allJobs = [];

snapshot.forEach(doc=>{

allJobs.push({

id:doc.id,

...doc.data()

});

});

document.getElementById(
"jobsCount"
).innerText =
allJobs.length;

renderJobs(
allJobs
);

}

catch(error){

console.log(
"Jobs Error:",
error
);

}

}

/* =========================
RENDER JOBS
========================= */

function renderJobs(jobs){

const tbody =
document.getElementById(
"jobsTableBody"
);

if(jobs.length === 0){

tbody.innerHTML =

`

<tr>

<td colspan="4">

No Jobs Found

</td>

</tr>
`;

return;

}

tbody.innerHTML = "";

jobs.forEach(job=>{

tbody.innerHTML +=

`

<tr>

<td>

${job.title || ""}

</td>

<td>

${job.company || ""}

</td>

<td>

${job.location || ""}

</td>

<td>

<button
class="delete-job-btn"
onclick="deleteJob('${job.id}')">

Delete

</button>

</td>

</tr>
`;

});

}

/* =========================
SEARCH JOB
========================= */

const searchInput =
document.getElementById(
"searchJob"
);

if(searchInput){

searchInput.addEventListener(

"input",

function(){

const value =
this.value.toLowerCase();

const filteredJobs =

allJobs.filter(job=>{

const title =
(job.title || "")
.toLowerCase();

const company =
(job.company || "")
.toLowerCase();

return(

title.includes(value) ||

company.includes(value)

);

});

renderJobs(
filteredJobs
);

}

);

}

/* =========================
ADD JOB
========================= */

const jobForm =
document.getElementById(
"jobForm"
);

if(jobForm){

jobForm.addEventListener(

"submit",

async function(e){

e.preventDefault();

try{

const jobData = {



title:
document.getElementById(
"jobTitle"
).value,

company:
document.getElementById(
"jobCompany"
).value,

location:
document.getElementById(
"jobLocation"
).value,

salary:
document.getElementById(
"jobSalary"
).value,

category:
document.getElementById(
"jobCategory"
).value,

badge:
document.getElementById(
"jobBadge"
).value,

applyLink:
document.getElementById(
"jobApplyLink"
).value,

description:
document.getElementById(
"jobDescription"
).value,

createdAt:
window.serverTimestamp()

};

await window.addDoc(

window.collection(
window.db,
"jobs"
),

jobData

);

alert(
"Job Published Successfully"
);

jobForm.reset();

loadJobs();

}

catch(error){

console.log(error);

alert(
"Failed To Publish Job"
);

}

}

);

}

/* =========================
DELETE JOB
========================= */

async function deleteJob(id){

const confirmDelete =

confirm(
"Delete this job?"
);

if(!confirmDelete)
return;

try{

await window.deleteDoc(

window.doc(
window.db,
"jobs",
id
)

);

loadJobs();

}

catch(error){

console.log(error);

alert(
"Delete Failed"
);

}

}

window.deleteJob =
deleteJob;

/* =========================
MOBILE SIDEBAR
========================= */

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

/* =========================
START
========================= */

loadJobs();

console.log(
"Jobs Page Loaded"
);
