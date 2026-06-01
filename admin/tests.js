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
LOAD TESTS
========================= */

let allTests = [];

async function loadTests(){

try{

const snapshot =

await window.getDocs(

window.collection(
window.db,
"tests"
)

);

allTests = [];

snapshot.forEach(doc=>{

allTests.push({

id:doc.id,

...doc.data()

});

});

document.getElementById(
"testsCount"
).innerText =
allTests.length;

renderTests(
allTests
);

}

catch(error){

console.log(
"Tests Error:",
error
);

}

}

/* =========================
RENDER TESTS
========================= */

function renderTests(tests){

const tbody =
document.getElementById(
"testsTableBody"
);

if(tests.length === 0){

tbody.innerHTML =

`

<tr>

<td colspan="5">

No Tests Found

</td>

</tr>
`;

return;

}

tbody.innerHTML = "";

tests.forEach(test=>{

tbody.innerHTML +=

`

<tr>

<td>

${test.title || ""}

</td>

<td>

${test.category || ""}

</td>

<td>

${test.questions || ""}

</td>

<td>

${test.difficulty || ""}

</td>

<td>

<button
class="delete-test-btn"
onclick="deleteTest('${test.id}')">

Delete

</button>

</td>

</tr>
`;

});

}

/* =========================
SEARCH TEST
========================= */

const searchInput =
document.getElementById(
"searchTest"
);

if(searchInput){

searchInput.addEventListener(

"input",

function(){

const value =
this.value.toLowerCase();

const filteredTests =

allTests.filter(test=>{

const title =
(test.title || "")
.toLowerCase();

const category =
(test.category || "")
.toLowerCase();

return(

title.includes(value)

||

category.includes(value)

);

});

renderTests(
filteredTests
);

}

);

}

/* =========================
ADD TEST
========================= */

const testForm =
document.getElementById(
"testForm"
);

if(testForm){

testForm.addEventListener(

"submit",

async function(e){

e.preventDefault();

try{

const testData = {

title:
document.getElementById(
"testTitle"
).value,

category:
document.getElementById(
"testCategory"
).value,

questions:
document.getElementById(
"totalQuestions"
).value,

timeLimit:
document.getElementById(
"timeLimit"
).value,

difficulty:
document.getElementById(
"difficulty"
).value,

createdAt:
window.serverTimestamp()

};

await window.addDoc(

window.collection(
window.db,
"tests"
),

testData

);

alert(
"Test Published Successfully"
);

testForm.reset();

loadTests();

}

catch(error){

console.log(error);

alert(
"Failed To Publish Test"
);

}

}

);

}

/* =========================
DELETE TEST
========================= */

async function deleteTest(id){

const confirmDelete =

confirm(
"Delete this test?"
);

if(!confirmDelete)
return;

try{

await window.deleteDoc(

window.doc(
window.db,
"tests",
id
)

);

loadTests();

}

catch(error){

console.log(error);

alert(
"Delete Failed"
);

}

}

window.deleteTest =
deleteTest;

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

loadTests();

console.log(
"Tests Page Loaded"
);
