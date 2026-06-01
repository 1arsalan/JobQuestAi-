const exams = [

{
name:"CSS",
category:"css",
icon:"bi bi-award-fill",

body:"Federal Public Service Commission",

syllabus:"English Essay, Current Affairs, Pakistan Affairs, Islamiat",

pattern:"MCQs + Written Exam + Interview",

website:"https://www.fpsc.gov.pk"
},

{
name:"PMS",
category:"ppsc",
icon:"bi bi-bank",

body:"Provincial Management Service",

syllabus:"GK, English, Optional Subjects",

pattern:"Written + Interview",

website:"https://www.ppsc.gop.pk"
},

{
name:"PPSC",
category:"ppsc",
icon:"bi bi-file-earmark-text",

body:"Punjab Public Service Commission",

syllabus:"Job Based",

pattern:"MCQs Test",

website:"https://www.ppsc.gop.pk"
},

{
name:"FPSC",
category:"fpsc",
icon:"bi bi-building",

body:"Federal Public Service Commission",

syllabus:"Post Based",

pattern:"MCQs + Interview",

website:"https://www.fpsc.gov.pk"
},

{
name:"NTS",
category:"nts",
icon:"bi bi-journal-check",

body:"National Testing Service",

syllabus:"Verbal, Quantitative, Analytical",

pattern:"MCQs",

website:"https://www.nts.org.pk"
},

{
name:"MDCAT",
category:"medical",
icon:"bi bi-heart-pulse-fill",

body:"Medical Entry Test",

syllabus:"Biology, Chemistry, Physics",

pattern:"MCQs",

website:"https://pmc.gov.pk"
}

];

const container =
document.getElementById("examContainer");

function loadExams(list){

container.innerHTML="";

list.forEach(exam=>{

container.innerHTML += `

<div class="exam-item"
onclick="showExam('${exam.name}')">

<i class="${exam.icon} exam-icon"></i>

<h3>${exam.name}</h3>

<p>${exam.body}</p>

</div>

`;

});

}

loadExams(exams);

function filterExam(category){

if(category==="all"){

loadExams(exams);

return;

}

const filtered =
exams.filter(
e=>e.category===category
);

loadExams(filtered);

}

function showExam(name){

const exam =
exams.find(
e=>e.name===name
);

document.getElementById(
"examDetail"
).innerHTML = `

<h2>${exam.name}</h2>

<hr>

<h4>Syllabus</h4>

<p>${exam.syllabus}</p>

<h4>Test Pattern</h4>

<p>${exam.pattern}</p>

<h4>Official Website</h4>

<a href="${exam.website}"
target="_blank">

Visit Website

</a>

`;

document.getElementById(
"examModal"
).style.display="flex";

}

function closeExamModal(){

document.getElementById(
"examModal"
).style.display="none";

}