const exams = [

{
name: "CSS",

category: "competitive",

icon: "bi bi-award-fill",

body: "Federal Public Service Commission",

eligibility: "Bachelor Degree",

age: "21-30 Years",

attempts: "3 Attempts",

subjects:
  "English Essay, Current Affairs, Pakistan Affairs, Islamiat",

pattern:
  "Written + Psychological Test + Interview",

website:
  "https://www.fpsc.gov.pk",

competition:
  "🔥 High Competition",

roadmap: [
  "Understand CSS Syllabus",
  "Read Standard Books",
  "Solve Past Papers",
  "Attempt AI Practice Tests",
  "Prepare For Interview"
],

tips: [
  "Read Dawn Daily",
  "Improve Essay Writing",
  "Practice MCQs Daily",
  "Follow Current Affairs"
]

},

{
name: "PPSC",
category: "competitive",

icon: "bi bi-file-earmark-text",

body: "Punjab Public Service Commission",

eligibility: "Bachelor Degree",

age: "18-35 Years",

attempts: "Unlimited",

subjects:
  "Job Specific MCQs",

pattern:
  "MCQs Test",

website:
  "https://www.ppsc.gop.pk",

competition:
  "⭐ Medium Competition",

roadmap: [
  "Read Advertisement",
  "Prepare Syllabus",
  "Practice MCQs",
  "Attempt Mock Tests"
],

tips: [
  "Focus On General Knowledge",
  "Solve Past Papers",
  "Practice Daily"
]


},

{
name: "FPSC",


category: "competitive",

icon: "bi bi-building",

body: "Federal Public Service Commission",

eligibility: "Bachelor Degree",

age: "18-35 Years",

attempts: "Depends On Post",

subjects:
  "Post Based Subjects",

pattern:
  "MCQs + Interview",

website:
  "https://www.fpsc.gov.pk",

competition:
  "🔥 High Competition",

roadmap: [
  "Check Advertisement",
  "Prepare Syllabus",
  "Practice MCQs",
  "Attempt Mock Tests"
],

tips: [
  "Read Daily News",
  "Practice Aptitude",
  "Revise Frequently"
]


},

{
name: "NTS",


category: "competitive",

icon: "bi bi-journal-check",

body: "National Testing Service",

eligibility: "Intermediate / Bachelor",

age: "Varies",

attempts: "Unlimited",

subjects:
  "Verbal, Quantitative, Analytical",

pattern:
  "MCQs",

website:
  "https://www.nts.org.pk",

competition:
  "⭐ Medium Competition",

roadmap: [
  "Study Concepts",
  "Practice MCQs",
  "Attempt Mock Tests"
],

tips: [
  "Manage Time",
  "Practice Daily",
  "Focus On Weak Areas"
]


},

{
name: "MDCAT",


category: "medical",

icon: "bi bi-heart-pulse-fill",

body: "Medical Entry Test",

eligibility: "FSc Pre-Medical",

age: "No Limit",

attempts: "Annual",

subjects:
  "Biology, Chemistry, Physics",

pattern:
  "MCQs",

website:
  "https://pmc.gov.pk",

competition:
  "🔥 High Competition",

roadmap: [
  "Complete Syllabus",
  "Practice MCQs",
  "Solve Past Papers"
],

tips: [
  "Focus Biology",
  "Revise Daily",
  "Practice Time Management"
]


}

];


const container =
document.getElementById(
"examContainer"
);

function loadExams(list) {

container.innerHTML = "";

list.forEach((exam) => {


container.innerHTML += `

  <div class="exam-item">

    <div class="d-flex justify-content-between align-items-center">

      <i class="${exam.icon} exam-icon"></i>

      <span class="badge bg-primary">

        ${exam.competition}

      </span>

    </div>

    <h3 class="mt-3">

      ${exam.name}

    </h3>

    <p>

      ${exam.body}

    </p>

    <hr>

    <p>

      <strong>Eligibility:</strong>

      ${exam.eligibility}

    </p>

    <p>

      <strong>Age:</strong>

      ${exam.age}

    </p>

    <div
      class="mt-3 d-flex gap-2 flex-wrap"
    >

      <button
        onclick="showExam('${exam.name}')"
        class="btn btn-primary"
      >

        View Details

      </button>

      <a
        href="test.html"
        class="btn btn-outline-primary"
      >

        AI Test

      </a>

    </div>

  </div>

`;

});

}

loadExams(exams);


function filterExam(category) {

if (category === "all") {


loadExams(exams);

return;


}

const filteredExams =
exams.filter((exam) => {


  return (
    exam.category === category
  );

});


loadExams(filteredExams);

}


const searchInput =
document.getElementById(
"examSearch"
);

searchInput.addEventListener(
"keyup",
() => {

const searchValue =
  searchInput.value
    .toLowerCase();

const filteredExams =
  exams.filter((exam) => {

    return (

      exam.name
        .toLowerCase()
        .includes(searchValue)

      ||

      exam.body
        .toLowerCase()
        .includes(searchValue)

    );

  });

loadExams(filteredExams);

}
);


function showExam(name) {

const exam =
exams.find((e) => {

  return e.name === name;

});


document.getElementById(
"examDetail"
).innerHTML = `

```
<h2>

  ${exam.name}

</h2>

<hr>

<p>

  <strong>Conducted By:</strong>

  ${exam.body}

</p>

<p>

  <strong>Eligibility:</strong>

  ${exam.eligibility}

</p>

<p>

  <strong>Age Limit:</strong>

  ${exam.age}

</p>

<p>

  <strong>Attempts:</strong>

  ${exam.attempts}

</p>

<p>

  <strong>Subjects:</strong>

  ${exam.subjects}

</p>

<p>

  <strong>Pattern:</strong>

  ${exam.pattern}

</p>

<p>

  <strong>Competition:</strong>

  ${exam.competition}

</p>

<hr>

<h4>

  Preparation Roadmap

</h4>

<ul>

  ${exam.roadmap
    .map(
      (step) =>

      `<li>${step}</li>`
    )
    .join("")}

</ul>

<hr>

<h4>

  Preparation Tips

</h4>

<ul>

  ${exam.tips
    .map(
      (tip) =>

      `<li>${tip}</li>`
    )
    .join("")}

</ul>

<hr>

<div
  class="d-flex flex-wrap gap-2 mt-4"
>

  <a
    href="${exam.website}"
    target="_blank"
    class="btn btn-primary"
  >

    Official Website

  </a>

  <a
    href="test.html"
    class="btn btn-success"
  >

    Start AI Test

  </a>

  <a
    href="#"
    class="btn btn-warning"
  >

    Download Syllabus

  </a>

  <a
    href="notes.html"
    class="btn btn-dark"
  >

    View Past Papers

  </a>

</div>

`;

document.getElementById(
"examModal"
).style.display = "flex";

}

function closeExamModal() {

document.getElementById(
"examModal"
).style.display = "none";

}

window.onclick = function (e) {

const modal =
document.getElementById(
"examModal"
);

if (e.target === modal) {


modal.style.display =
  "none";

}

};
