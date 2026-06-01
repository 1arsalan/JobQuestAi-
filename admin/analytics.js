import {

db,
collection,
getDocs

}

from "../firebase.js";

/* =========================
ELEMENTS
========================= */

const totalUsers =
document.getElementById("totalUsers");

const totalJobs =
document.getElementById("totalJobs");

const totalTests =
document.getElementById("totalTests");

const totalAttempts =
document.getElementById("totalAttempts");

const activityList =
document.getElementById("activityList");

/* =========================
LOAD ANALYTICS
========================= */

async function loadAnalytics(){

try{

/* USERS */

const usersSnapshot =
await getDocs(
collection(db,"users")
);

totalUsers.textContent =
usersSnapshot.size;

/* JOBS */

const jobsSnapshot =
await getDocs(
collection(db,"jobs")
);

totalJobs.textContent =
jobsSnapshot.size;

/* TESTS */

const testsSnapshot =
await getDocs(
collection(db,"tests")
);

totalTests.textContent =
testsSnapshot.size;

/* TEST RESULTS */

const resultsSnapshot =
await getDocs(
collection(db,"results")
);

totalAttempts.textContent =
resultsSnapshot.size;

/* =========================
RECENT ACTIVITY
========================= */

activityList.innerHTML = "";

/* JOB ACTIVITY */

jobsSnapshot.forEach((doc)=>{

const job =
doc.data();

activityList.innerHTML += `

<div class="activity-item">

<h4>
💼 New Job Added
</h4>

<p>

${job.title || "Untitled Job"}

</p>

</div>

`;

});

/* TEST ACTIVITY */

testsSnapshot.forEach((doc)=>{

const test =
doc.data();

activityList.innerHTML += `

<div class="activity-item">

<h4>
📝 Test Published
</h4>

<p>

${test.title || "Untitled Test"}

</p>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadAnalytics();
