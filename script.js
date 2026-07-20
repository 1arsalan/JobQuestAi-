console.log("JS LOADED");

/* APPLY SAVED THEME ON ALL PAGES */

const savedTheme =

localStorage.getItem(
  "theme"
);

if(savedTheme === "dark"){

  document.body.classList.add(
    "dark-mode"
  );

}

/* ================= FINAL THEME SYSTEM ================= */

function setupThemeToggle(){

  const toggle =

  document.getElementById(
    "themeToggle"
  );

  const themeText =

  document.getElementById(
    "themeText"
  );

  if(!toggle || !themeText) return;

  /* INITIAL STATE */

  if(

    localStorage.getItem("theme")
    ===
    "dark"

  ){

    document.body.classList.add(
      "dark-mode"
    );

    toggle.checked = true;

    themeText.innerText =
    "🌙 Dark";

  }

  else{

    document.body.classList.remove(
      "dark-mode"
    );

    toggle.checked = false;

    themeText.innerText =
    "☀️ Light";

  }

  /* TOGGLE CHANGE */

  toggle.onchange = () => {

    if(toggle.checked){

      document.body.classList.add(
        "dark-mode"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

      themeText.innerText =
      "🌙 Dark";

    }

    else{

      document.body.classList.remove(
        "dark-mode"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

      themeText.innerText =
      "☀️ Light";

    }

  };

}

/* ================= FIRESTORE IMPORTS ================= */


function goToPage(page) {
  window.location.href = page;
}

/* JOB APPLY */
function applyJob(link) {
  window.open(link, '_blank');
}



/* ================= QUIZ SYSTEM ================= */

/* =====================================================
   PROFESSIONAL AI TEST SYSTEM
===================================================== */

let quiz = [];
let current = 0;
let score = 0;
let wrong = 0;
let selectedAnswer = null;
let answerHistory = [];

let mode = "practice";

let timer;
let questionTime = 45;
let timeLeft = 45;

/* ================= START TEST ================= */

window.startTest = async function() {

  try {

    // VALUES
    const exam =
      document.getElementById("exam").value;

    const subject =
      document.getElementById("subject").value;

    const difficulty =
      document.getElementById("difficulty").value;

    const count =
      document.getElementById("count").value;

    mode =
      document.getElementById("mode").value;

    questionTime =
      parseInt(
        document.getElementById("questionTime").value
      );

    // SUBJECT TITLE
    document.getElementById("quizSubject").innerText =
      exam + " - " + subject;

    // LOADING BUTTON
    const startBtn =
      document.querySelector(".start-test-btn");

    startBtn.innerText = "Generating AI Test...";
    startBtn.disabled = true;

    // API REQUEST
    const res = await fetch(
      "http://localhost:3000/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          topic: exam + " " + subject,
          difficulty,
          count
        })
      }
    );

    // SERVER ERROR
    if(!res.ok) {
      alert("Server Error");
      return;
    }

    const data = await res.json();
    console.log("FULL API RESPONSE:");
    console.log(data);

    console.log(data);

    // AI RESPONSE CHECK
    if(!data.choices) {
      alert("AI response failed");
      return;
    }

    let text =
      data.choices[0].message.content;

    // CLEAN JSON
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    // PARSE
    quiz = JSON.parse(text);

    // FILTER INVALID QUESTIONS
    quiz = quiz.filter(
      q => q.options && q.options.length === 4
    );

    // EMPTY CHECK
    if(quiz.length === 0) {
      alert("No valid questions generated");
      return;
    }

    // RESET VALUES
    current = 0;
    score = 0;
    wrong = 0;

    // HIDE SETUP
    document.getElementById("testSetup")
    .style.display = "none";

    // SHOW QUIZ
    document.getElementById("quizBox")
    .style.display = "block";

    // LOAD QUESTION
    loadQuestion();

  } catch(error) {

    console.log(error);

    startBtn.innerText =
    "Start AI Test";

    startBtn.disabled = false;

    alert("Something went wrong");

  }

}

/* ================= LOAD QUESTION ================= */

function loadQuestion() {

  // TEST COMPLETE
  if(current >= quiz.length) {
    showResult();
    return;
  }

  // RESET
  clearInterval(timer);

  selectedAnswer = null;

  // QUESTION
  const q = quiz[current];

  // QUESTION COUNT
  document.getElementById("questionCount")
  .innerText =
  `Question ${current + 1} / ${quiz.length}`;

  // QUESTION TEXT
  document.getElementById("question")
  .innerText = q.q;

  // PROGRESS BAR
  let progress =
    ((current + 1) / quiz.length) * 100;

  document.getElementById("progressFill")
  .style.width = progress + "%";

  // OPTIONS
  const optionsBox =
    document.getElementById("options");

  optionsBox.innerHTML = "";

  // NEXT BUTTON DISABLED
  document.querySelector(".next-btn")
  .disabled = true;

  // CREATE OPTIONS
  q.options.forEach(opt => {

    const btn =
      document.createElement("button");

    btn.className = "option-btn";

    btn.innerText = opt;

    btn.onclick = () => {

      // ANTI MULTI CLICK
      if(selectedAnswer) return;

      selectedAnswer = opt;
      
      /* ================= SAVE ANSWER ================= */

      answerHistory[current] = {

        question: q.q,

        selected: opt,

        correct: q.correct

      };

      // ACTIVE CLASS
      document
      .querySelectorAll(".option-btn")
      .forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      // ENABLE NEXT
      document.querySelector(".next-btn")
      .disabled = false;

      // PRACTICE MODE COLORS
      if(mode === "practice") {

        if(opt === q.correct) {

          btn.style.background = "#16a34a";
          btn.style.color = "white";

        } else {

          btn.style.background = "#dc2626";
          btn.style.color = "white";

          // SHOW CORRECT
          document
          .querySelectorAll(".option-btn")
          .forEach(b => {

            if(b.innerText === q.correct) {

              b.style.background = "#16a34a";
              b.style.color = "white";

            }

          });

        }

      }

    };

    optionsBox.appendChild(btn);

  });

  // START TIMER
  startQuestionTimer();

}

/* ================= QUESTION TIMER ================= */

function startQuestionTimer() {

  timeLeft = questionTime;

  updateTimerUI();

  timer = setInterval(() => {

    timeLeft--;

    updateTimerUI();

    // AUTO NEXT
    if(timeLeft <= 0) {

      clearInterval(timer);

      if(!selectedAnswer){

        wrong++;

      }

      current++;

      loadQuestion();

    }

  }, 1000);

}

/* ================= UPDATE TIMER ================= */

function updateTimerUI() {

  document.getElementById("timer")
  .innerText =
  `${timeLeft}s`;

}

/* ================= NEXT QUESTION ================= */

window.nextQuestion = function() {

  // NO SELECT
  if(!selectedAnswer) {

    alert("Please select an option");

    return;

  }

  // CORRECT
  if(
    selectedAnswer.trim().toLowerCase()
    ===
    quiz[current].correct.trim().toLowerCase()

  ) {

    score++;

  } else {

    wrong++;

  }

  current++;

  loadQuestion();

}

/* ================= SHOW RESULT ================= */

async function showResult() {

  clearInterval(timer);

  // HIDE QUIZ
  document.getElementById("quizBox")
  .style.display = "none";

  // SHOW RESULT
  document.getElementById("resultBox")
  .style.display = "block";

  // PERCENT
  let percent =
    Math.round((score / quiz.length) * 100);

  // PERFORMANCE MESSAGE
  let advice =
    "Keep practicing to improve.";

  if(percent >= 80) {

    advice =
    "Excellent performance. Your preparation level is strong.";

  } else if(percent >= 60) {

    advice =
    "Good work. Focus on weak areas for better ranking.";

  } else {

    advice =
    "You need more practice and revision.";

  }

  // RESULT UI
  document.getElementById("finalScore")
  .innerText =
  `${score}/${quiz.length}`;

  document.getElementById("finalPercent")
  .innerText =
  `${percent}%`;

  document.getElementById("finalCorrect")
  .innerText =
  score;

  document.getElementById("finalWrong")
  .innerText =
  wrong;

  document.getElementById("aiAdvice")
  .innerText =
  advice;
  
  /* ================= ANSWER REVIEW ================= */

const reviewContainer =
document.getElementById(
  "answerReviewContainer"
);

reviewContainer.innerHTML = "";

answerHistory.forEach((item, index) => {

  const isCorrect =
  item.selected === item.correct;

  reviewContainer.innerHTML += `

    <div
    class="history-item"
    style="
      margin-top:18px;
      border-left:6px solid
      ${isCorrect ? "#16a34a" : "#dc2626"};
    ">

      <div class="history-left">

        <h4>

          Q${index + 1}.
          ${item.question}

        </h4>

        <p>

          Your Answer:
          <strong
          style="
          color:
          ${isCorrect ? "#16a34a" : "#dc2626"};
          ">

            ${item.selected}

          </strong>

        </p>

        <p>

          Correct Answer:
          <strong
          style="color:#16a34a;">

            ${item.correct}

          </strong>

        </p>
        <p>

          Explanation:
          <strong
          style="color:#60a5fa;">

            ${quiz[index].explanation}

          </strong>

        </p>

      </div>

    </div>

  `;

});

  /* ================= SAVE HISTORY ================= */

  /* ================= FIREBASE HISTORY ================= */
const currentUser =

JSON.parse(
  localStorage.getItem("user")
);

let history = [];

try{

  const historyQuery =

  window.query(

    window.collection(
      window.db,
      "testResults"
    ),

    window.where(
      "userEmail",
      "==",
      currentUser.email
    )

  );

  const snapshot =

  await window.getDocs(
    historyQuery
  );

  snapshot.forEach(doc => {

    history.push(
      doc.data()
    );

  });

}

catch(error){

  console.log(
    "History Load Error",
    error
  );

}

  
  /* ================= SAVE TO FIRESTORE ================= */

await window.addDoc(

  window.collection(
    window.db,
    "testResults"
  ),

    {

      userEmail:
      currentUser.email,

      userName:
      currentUser.name,

      exam:
      document.getElementById("exam").value,

      subject:
      document.getElementById("subject").value,

      difficulty:
      document.getElementById("difficulty").value,

      score:
      score,

      total:
      quiz.length,

      percent:
      percent,

      correctAnswers:
      score,

      wrongAnswers:
      quiz.length - score,

      date:
      new Date().toLocaleDateString(),

      createdAt:
      Date.now()

    }

);

  history.push({

  percent: percent,

  subject:
  document.getElementById("subject").value,

  exam:
  document.getElementById("exam").value,

  difficulty:
  document.getElementById("difficulty").value,

  score: score,

  date:
  new Date().toLocaleDateString()

});

  
  await loadDashboard();

  await loadLeaderboard();

  /* ================= UPDATE USER STATS ================= */

const userRef =

window.doc(

  window.db,

  "users",

  currentUser.email

);

let totalTestsCount =
history.length;

let totalPercentValue = 0;

history.forEach(test => {

  totalPercentValue += test.percent;

});

let averagePercent = Math.round(

  totalPercentValue /
  totalTestsCount

);

let highestScore = 0;

history.forEach(test => {

  if(test.percent > highestScore) {

    highestScore =
    test.percent;

  }

});



await window.setDoc(

  userRef,

  {

    userName:
    currentUser.name,

    userEmail:
    currentUser.email,

    averageScore:
    averagePercent,

    bestScore:
    highestScore,

    totalTests:
    totalTestsCount,

    updatedAt:
    Date.now()

  }

);

}




/* =====================================================
   FINAL PROFESSIONAL DASHBOARD
===================================================== */

async function loadDashboard() {

  // CHECK PAGE
  if(!document.getElementById("historyContainer")) {
    return;
  }

  // USER
  let user =
    JSON.parse(localStorage.getItem("user"));

  // USER NAME
  if(user) {

    document.getElementById("dashboardWelcome")
    .innerText =
    `Welcome Back, ${user.name}`;

    document.getElementById("dashboardUserName")
    .innerText =
    user.name;

  }

  // HISTORY
  /* ================= CURRENT USER ================= */

const currentUser =
JSON.parse(localStorage.getItem("user"));

/* ================= USER HISTORY KEY ================= */

/* ================= FIREBASE HISTORY ================= */

let history = [];

try{

  const historyQuery =

  window.query(

    window.collection(
      window.db,
      "testResults"
    ),

    window.where(
      "userEmail",
      "==",
      currentUser.email
    )

  );

  const snapshot =

  await window.getDocs(
    historyQuery
  );

  snapshot.forEach(doc => {

    history.push(
      doc.data()
    );

  });

}

catch(error){

  console.log(
    "History Load Error",
    error
  );

}

  // EMPTY
  if(history.length === 0) {

    document.getElementById("historyContainer")
    .innerHTML = `

      <div class="history-item">

        <div class="history-left">

          <h4>
            No Tests Yet
          </h4>

          <p>
            Start your first AI test.
          </p>

        </div>

      </div>

    `;

  

  }

  /* ================= STATS ================= */

  let totalTests =
    history.length;

  let totalPercent = 0;

  let bestScore = 0;

  let weakSubject = "";

  let lowest = 101;

  history.forEach(test => {

    totalPercent += test.percent;

    // BEST
    if(test.percent > bestScore) {

      bestScore =
      test.percent;

    }

    // WEAK
    if(test.percent < lowest) {

      lowest =
      test.percent;

      weakSubject =
      test.subject;

    }

  });

  // AVERAGE
  let average =
    totalTests > 0
      ? Math.round(
          totalPercent / totalTests
        )
      : 0;

  // UPDATE UI
  document.getElementById("totalTests")
  .innerText =
  totalTests;

  document.getElementById("averageScore")
  .innerText =
  average + "%";

  document.getElementById("bestScore")
  .innerText =
  bestScore + "%";

  document.getElementById("weakSubject")
  .innerText =
  weakSubject;

  /* ================= STREAK ================= */



  /* ================= REAL RANK ================= */

document.getElementById(
  "overallRank"
).innerText =
"Updating...";


/* ================= STREAK SYSTEM ================= */

let streak = 1;

if(history.length > 1){

  history.sort(

    (a, b) =>

    new Date(a.date) -
    new Date(b.date)

  );

  streak = 1;

  for(

    let i = history.length - 1;

    i > 0;

    i--

  ){

    let currentDate =

    new Date(
      history[i].date
    );

    let prevDate =

    new Date(
      history[i - 1].date
    );

    let diff =

    Math.floor(

      (
        currentDate -
        prevDate
      )

      /

      (
        1000 * 60 * 60 * 24
      )

    );

    if(diff <= 1){

      streak++;

    }

    else{

      break;

    }

  }

}

document.getElementById(
  "streakCount"
).innerText = streak;

  /* ================= AI INSIGHTS ================= */

let insight = "";

if(average >= 85){

  insight =

  `Outstanding performance 🚀
  Your average score is ${average}%.
  You are performing better than most students.
  Maintain consistency for top national rankings.`;

}

else if(average >= 70){

  insight =

  `Strong preparation 💯
  Your average score is ${average}%.
  Focus more on ${weakSubject}
  to improve your overall ranking.`;

}

else if(average >= 50){

  insight =

  `Average performance 📚
  Your weak subject is ${weakSubject}.
  Daily practice and revision
  are recommended.`;

}

else{

  insight =

  `Your preparation needs improvement ⚠️
  Attempt more AI tests regularly
  and focus on concept building.`;

}

document.getElementById(
  "aiInsightText"
).innerText = insight;

/* ================= BADGES ================= */

const badgesContainer =

document.getElementById(
  "badgesContainer"
);

if(badgesContainer){

  badgesContainer.innerHTML = "";

  /* ELITE */

  if(average >= 90){

    badgesContainer.innerHTML += `

      <div class="badge-card elite-badge">

        🏆 Elite Genius

      </div>

    `;

  }

  else if(average >= 80){

    badgesContainer.innerHTML += `

      <div class="badge-card top-badge">

        🎯 Top Performer

      </div>

    `;

  }

  else if(average >= 70){

    badgesContainer.innerHTML += `

      <div class="badge-card fast-badge">

        ⚡ Fast Learner

      </div>

    `;

  }

  else if(average >= 60){

    badgesContainer.innerHTML += `

      <div class="badge-card improve-badge">

        📚 Improving Student

      </div>

    `;

  }

  else if(average >= 50){

    badgesContainer.innerHTML += `

      <div class="badge-card beginner-badge">

        🚀 Beginner Achiever

      </div>

    `;

  }

  else{

    badgesContainer.innerHTML += `

      <div class="badge-card practice-badge">

        🔥 Keep Practicing

      </div>

    `;

  }

  /* EXTRA */

  if(totalTests >= 10){

    badgesContainer.innerHTML += `

      <div class="badge-card active-badge">

        ⚡ Active Learner

      </div>

    `;

  }

  if(bestScore >= 95){

    badgesContainer.innerHTML += `

      <div class="badge-card master-badge">

        👑 Master Mind

      </div>

    `;

  }

}

/* ================= SUBJECT ANALYTICS ================= */

const subjectAnalytics =

document.getElementById(
  "subjectAnalytics"
);

if(subjectAnalytics){

  subjectAnalytics.innerHTML = "";

  let subjectMap = {};

  history.forEach(test => {

    if(!subjectMap[test.subject]){

      subjectMap[test.subject] = [];

    }

    subjectMap[test.subject]
    .push(test.percent);

  });

  for(let subject in subjectMap){

    let scores =
    subjectMap[subject];

    let total = 0;

    scores.forEach(score => {

      total += score;

    });

    let avg =
    Math.round(
      total / scores.length
    );

    let status = "";

    if(avg >= 80){

      status = "Excellent";

    }

    else if(avg >= 60){

      status = "Good";

    }

    else{

      status = "Weak";

    }

    subjectAnalytics.innerHTML += `

      <div class="subject-card">

        <div>

          <h4>

            ${subject}

          </h4>

          <p>

            ${scores.length}
            Tests Attempted

          </p>

        </div>

        <div class="subject-score">

          <h3>

            ${avg}%

          </h3>

          <span>

            ${status}

          </span>

        </div>

      </div>

    `;

  }

}

  /* ================= CHART ================= */

  const chart =
    document.getElementById("chartContainer");

  chart.innerHTML = "";

  let latestTests =
    [...history].slice(-6);

  latestTests.forEach((test, index) => {

    let performanceLabel = "";

if(test.percent >= 80) {

  performanceLabel = "Excellent";

}

else if(test.percent >= 60) {

  performanceLabel = "Good";

}

else {

  performanceLabel = "Weak";

}

chart.innerHTML += `

<div class="chart-card">

  <div class="chart-top">

    <span>

      ${test.percent}%

    </span>

  </div>

  <div class="chart-progress">

    <div
    class="chart-fill"
    style="
      height:${test.percent}%;
    ">

    </div>

  </div>

  <div class="chart-bottom">

    <small>

      ${test.subject}

    </small>

  </div>

</div>

`;
  });

  /* ================= HISTORY FILTER ================= */

    const historySearch =

    document.getElementById(
      "historySearch"
    );

    const historyDifficulty =

    document.getElementById(
      "historyDifficulty"
    );

    if(historySearch){

      historySearch.oninput = () => {

        loadDashboard();

      };

    }

    if(historyDifficulty){

      historyDifficulty.onchange = () => {

        loadDashboard();

      };

    }

  /* ================= HISTORY ================= */

  const historyContainer =
    document.getElementById("historyContainer");

  historyContainer.innerHTML = "";

  let reversed =
[...history].reverse();

/* SEARCH */

const searchValue =

document.getElementById(
  "historySearch"
)?.value
.toLowerCase() || "";

/* DIFFICULTY */

const difficultyValue =

document.getElementById(
  "historyDifficulty"
)?.value || "all";

/* FILTER */

reversed = reversed.filter(test => {

  let matchSearch =

    test.subject
    .toLowerCase()
    .includes(searchValue);

  let matchDifficulty =

    difficultyValue === "all"
    ||

    test.difficulty ===
    difficultyValue;

  return (
    matchSearch &&
    matchDifficulty
  );

});

  reversed.forEach(test => {

    historyContainer.innerHTML += `

      <div class="history-item">

        <div class="history-left">

          <h4>

            ${test.exam}
            -
            ${test.subject}

          </h4>

          <p>

            ${test.difficulty.toUpperCase()}
            •
            ${test.date}

          </p>

        </div>

        <div class="history-score">

          <h3>
            ${test.percent}%
          </h3>

          <span>

            ${test.score}
            Correct

          </span>

        </div>

      </div>

    `;

  });
}
  /* ================= REAL LEADERBOARD ================= */

async function loadLeaderboard() {

  const leaderboard =
  document.getElementById(
    "leaderboardContainer"
  );

  if(!leaderboard) return;

  leaderboard.innerHTML =
  "Loading leaderboard...";

  try {

    const snapshot =

    await window.getDocs(

      window.collection(
        window.db,
        "users"
      )

    );

    let users = [];

    snapshot.forEach((docItem) => {

      users.push(
        docItem.data()
      );

    });

    // SORT ALL USERS
    users.sort(

      (a, b) =>

      (b.averageScore || 0)
      -
      (a.averageScore || 0)

    );

    // SAVE FULL USERS
    const allUsers = [...users];

    // SHOW TOP 100
    users = users.slice(0, 100);

    leaderboard.innerHTML = "";

    let rank = 1;
    users.forEach((user) => {

  let medal = "";

  if(rank === 1) {

    medal = "🥇";

  }

  else if(rank === 2) {

    medal = "🥈";

  }

  else if(rank === 3) {

    medal = "🥉";

  }

  leaderboard.innerHTML += `

  <div class="leaderboard-row">

    <div class="leaderboard-left">

      <div class="rank-badge">

        ${medal || "#" + rank}

      </div>

      <div class="leaderboard-user">

        <h4>

          ${user.userName}

        </h4>

        <p>

          ${user.totalTests}
          Tests Attempted

        </p>

      </div>

    </div>

    <div class="leaderboard-score">

      ${user.averageScore}%

    </div>

  </div>

  `;

  rank++;

});

    /* ================= REAL OVERALL RANK ================= */

    const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

    let overallRank =

    allUsers.findIndex(

      u =>

      u?.userEmail
      &&
      currentUser?.email
      &&
      u.userEmail.toLowerCase()
      ===
      currentUser.email.toLowerCase()

    );

    if(overallRank !== -1) {

      document.getElementById(
        "overallRank"
      ).innerText =

      `#${overallRank + 1} out of ${allUsers.length}`;

    }

    else{

      document.getElementById(
        "overallRank"
      ).innerText =

      "Unranked";

    }

  }

  catch(error) {

    console.log(error);

    leaderboard.innerHTML =

    "Failed to load leaderboard";

  }

}

/* ================= PDF DOWNLOAD ================= */

/* ================= PROFESSIONAL PDF ================= */

const pdfBtn =

document.getElementById(
  "downloadPdfBtn"
);

if(pdfBtn){

  pdfBtn.onclick = async () => {

    const {
      jsPDF
    } = window.jspdf;

    const doc =
    new jsPDF();

    /* USER */

    const currentUser =

    JSON.parse(

      localStorage.getItem(
        "user"
      )

    );

    /* HISTORY */
    let history = [];

    const historyQuery =

    window.query(

      window.collection(
        window.db,
        "testResults"
      ),

      window.where(
        "userEmail",
        "==",
        currentUser.email
      )

    );

    const snapshot =

    await window.getDocs(
      historyQuery
    );

    snapshot.forEach(doc => {

      history.push(
        doc.data()
      );

    });

    /* STATS */

    let average = 0;

    let bestScore = 0;

    history.forEach(test => {

      average += test.percent;

      if(test.percent > bestScore){

        bestScore =
        test.percent;

      }

    });

    average =

    history.length

    ?

    Math.round(
      average / history.length
    )

    :

    0;

    /* ================= HEADER ================= */

    doc.setFillColor(
      37,
      99,
      235
    );

    doc.rect(
      0,
      0,
      210,
      35,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(24);

    doc.text(

      "JobQuestAI Report",

      20,

      22

    );

    /* RESET COLOR */

    doc.setTextColor(
      0,
      0,
      0
    );

    /* ================= USER INFO ================= */

    doc.setFontSize(16);

    doc.text(

      `Student: ${currentUser.name}`,

      20,

      50

    );

    doc.text(

      `Total Tests: ${history.length}`,

      20,

      62

    );

    doc.text(

      `Average Score: ${average}%`,

      20,

      74

    );

    doc.text(

      `Best Score: ${bestScore}%`,

      20,

      86

    );

    /* ================= TABLE HEADER ================= */

    doc.setFillColor(
      239,
      246,
      255
    );

    doc.rect(
      15,
      100,
      180,
      10,
      "F"
    );

    doc.setFontSize(13);

    doc.text(
      "Subject",
      20,
      107
    );

    doc.text(
      "Score",
      90,
      107
    );

    doc.text(
      "Difficulty",
      130,
      107
    );

    doc.text(
      "Date",
      165,
      107
    );

    /* ================= TEST ROWS ================= */

    let y = 120;

    history.forEach(test => {

      doc.setFontSize(11);

      doc.text(
        test.subject,
        20,
        y
      );

      doc.text(
        `${test.percent}%`,
        90,
        y
      );

      doc.text(
        test.difficulty,
        130,
        y
      );

      doc.text(
        test.date
        .split(",")[0],
        165,
        y
      );

      y += 10;

      /* NEW PAGE */

      if(y > 270){

        doc.addPage();

        y = 20;

      }

    });

    /* ================= FOOTER ================= */

    doc.setFontSize(10);

    doc.setTextColor(
      120
    );

    doc.text(

      "Generated by JobQuestAI",

      20,

      290

    );

    /* SAVE */

    doc.save(
      "JobQuestAI-Report.pdf"
    );

  };

}

/* ================= PROFILE MODAL ================= */

window.openProfileModal = async function(){

  const user =

  JSON.parse(
    localStorage.getItem("user")
  );

  /*const historyKey =

  `testHistory_${user.email}`; */

    let history = [];

  try{

    const historyQuery =

    window.query(

      window.collection(
        window.db,
        "testResults"
      ),

      window.where(
        "userEmail",
        "==",
        user.email
      )

    );

    const snapshot =

    await window.getDocs(
      historyQuery
    );

    snapshot.forEach(doc => {

      history.push(
        doc.data()
      );

    });

  }

  catch(error){

    console.log(error);

  }

  let average = 0;

  let best = 0;

  history.forEach(test => {

    average += test.percent;

    if(test.percent > best){

      best = test.percent;

    }

  });

  average =

  history.length

  ?

  Math.round(
    average / history.length
  )

  :

  0;

  /* USER */

  document.getElementById(
    "profileName"
  ).innerText =
  user.name;

  document.getElementById(
    "profileEmail"
  ).innerText =
  user.email;

  /* STATS */

  document.getElementById(
    "profileTests"
  ).innerText =
  history.length;

  document.getElementById(
    "profileAverage"
  ).innerText =
  average + "%";

  document.getElementById(
    "profileBest"
  ).innerText =
  best + "%";

  /* SHOW */

  document.getElementById(
    "profileModal"
  ).style.display =
  "flex";

}

window.closeProfileModal = function(){

  document.getElementById(
    "profileModal"
  ).style.display =
  "none";

}

/* ================= SIDEBAR NAVIGATION ================= */
window.scrollToOverview = function(){

  document.getElementById(
    "overviewSection"
  ).scrollIntoView({

    behavior:"smooth"

  });

}

window.scrollToAnalytics = function(){

  document.getElementById(
    "analyticsSection"
  ).scrollIntoView({

    behavior:"smooth"

  });

}

window.scrollToRankings = function(){

  document.getElementById(
    "rankingSection"
  ).scrollIntoView({

    behavior:"smooth"

  });

}

window.scrollToHistory = function(){

  document.getElementById(
    "historySection"
  ).scrollIntoView({

    behavior:"smooth"

  });

}

/* ================= LOAD ================= */

window.addEventListener("load", async () => {

  await loadDashboard();

  await loadLeaderboard();

});

/* =====================================================
   FIREBASE AUTH MODAL SYSTEM
===================================================== */

let isLogin = true;

/* ================= OPEN/CLOSE ================= */

function openAuth() {

  document.getElementById(
    "authModal"
  ).style.display = "flex";

  switchToLogin();

}

function closeAuth() {

  document.getElementById(
    "authModal"
  ).style.display = "none";

}

// reset password function 

async function forgotPassword() {

  const email =
  document.getElementById(
    "email"
  ).value.trim();

  if(!email){

    alert(
      "Please enter your email first."
    );

    return;

  }

  try{

    await window.sendPasswordResetEmail(

      window.auth,

      email

    );

    alert(

      "Password reset link has been sent to your email."

    );

  }

  catch(error){

    console.log(error);

    alert(error.message);

  }

}

/* ================= LOGIN TAB ================= */

function switchToLogin() {

  const switchIndicator =
    document.getElementById(
      "switchIndicator"
    );

  const nameField =
    document.getElementById(
      "nameField"
    );

  const authTitle =
    document.getElementById(
      "authTitle"
    );

  const authBtn =
    document.getElementById(
      "authBtn"
    );

  const loginTab =
    document.getElementById(
      "loginTab"
    );

  const registerTab =
    document.getElementById(
      "registerTab"
    );

  if (
    !switchIndicator ||
    !nameField ||
    !authTitle ||
    !authBtn ||
    !loginTab ||
    !registerTab
  ) {

    return;

  }

  isLogin = true;

  switchIndicator.style.left =
    "4px";

  nameField.style.display =
    "none";

  authTitle.textContent =
    "Login";

  authBtn.textContent =
    "Login";

  authBtn.onclick =
    loginUser;

  loginTab.classList.add(
    "active-auth-tab"
  );

  registerTab.classList.remove(
    "active-auth-tab"
  );

}
  



/* ================= SIGNUP TAB ================= */

function switchToSignup() {

  isLogin = false;

  document.getElementById(
    "switchIndicator"
  ).style.left = "50%";

  document.getElementById(
    "nameField"
  ).style.display = "block";

  document.getElementById(
    "authTitle"
  ).textContent = "Register";

  const authBtn =
  document.getElementById(
    "authBtn"
  );

  console.log(
  document.getElementById("authBtn")
  );

  authBtn.textContent = "Register";

  authBtn.onclick = function () {

    signupUser();

  };

  document.getElementById(
    "registerTab"
  ).classList.add(
    "active-auth-tab"
  );

  document.getElementById(
    "loginTab"
  ).classList.remove(
    "active-auth-tab"
  );


}



/* =====================================================
   SIGNUP
===================================================== */

async function signupUser() {

  const name =
    document.getElementById("name").value;

  const email =
    document.getElementById("email").value;
    /* ================= EMAIL FORMAT ================= */

const emailPattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailPattern.test(email)) {

  alert(
    "Please enter a valid email"
  );

  return;

}

  const password =
    document.getElementById("password").value;
    /* ================= PASSWORD ================= */

if(password.length < 6) {

  alert(
    "Password must be at least 6 characters"
  );

  return;

}

  if(
    !name ||
    !email ||
    !password
  ) {

    alert("Please fill all fields");

    return;

  }

  try {

    const userCredential =

    await window.createUserWithEmailAndPassword(

      window.auth,

      email,

      password

    );

    const user = userCredential.user;

    /* SAVE USER TO FIRESTORE */

    await window.setDoc(

      window.doc(
        window.db,
        "users",
        user.uid
      ),

      {
        userName: name,
        userEmail: email,
        createdAt:
        window.serverTimestamp()
      }

    );

    /* SAVE LOCAL USER */

    localStorage.setItem(

      "user",

      JSON.stringify({

        name,
        email

      })

    );


    alert(
      "Account Created Successfully"
    );

    closeAuth();

    window.location.reload();

  }

  catch(error) {

    console.log(error);

    alert(error.message);

  }

}

/* =====================================================
   LOGIN
===================================================== */

async function loginUser() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  if(!email || !password) {

    alert("Please fill all fields");

    return;

  }

  try {

    const userCredential =

    await window.signInWithEmailAndPassword(

      window.auth,

      email,

      password

    );

    const user =
      userCredential.user;

      await window.setDoc(

      window.doc(
        window.db,
        "users",
        user.uid
      ),

      {

        userName: name,

        userEmail: email,

        totalTests: 0,

        bestScore: 0,

        averageScore: 0,

        createdAt: Date.now()

      }

    );

    // SAVE USER
    localStorage.setItem(

      "user",

      JSON.stringify({

        name:

        user.displayName ||

        user.email.split("@")[0],

        email: user.email

      })

    );

    /* BUTTON LOADING */

    const authBtn =

    document.querySelector(
      ".auth-btn"
    );

    if(authBtn){

      authBtn.classList.add(
        "loading"
      );

      authBtn.innerHTML =

      "Please Wait...";

    }

    alert("Login Successful");

    closeAuth();

    if(authBtn){

      authBtn.classList.remove(
        "loading"
      );

      authBtn.innerHTML =

      "Login";

    }
    window.location.reload();

  }

  catch(error) {

    console.log(error);

    alert(error.message);

  }

}

/* =====================================================
   LOGOUT
===================================================== */

async function logoutUser() {

  try {

    await window.signOut(
      window.auth
    );

    localStorage.removeItem("user");

    alert("Logout Successful");

    window.location.href =
    "../index.html";

  }

  catch(error) {

    console.log(error);

  }

}



/* ================= GLOBAL ================= */

window.openAuth = openAuth;

window.closeAuth = closeAuth;

window.switchToLogin =
switchToLogin;

window.switchToSignup =
switchToSignup;

window.loginUser =
loginUser;

window.signupUser =
signupUser;

window.logoutUser =
logoutUser;

/* =====================================================
   NAVBAR USER SYSTEM
===================================================== */

function updateNavbar() {

  const navArea =
    document.getElementById("navAuthArea");

  if(!navArea) return;

  const user =
    JSON.parse(localStorage.getItem("user"));

  // USER LOGGED IN
  if(user) {

          
    navArea.innerHTML = `

      <div class="theme-toggle-wrapper">

        <span id="themeText">

          ${document.body.classList.contains("dark-mode")

            ? "🌙 Dark"

            : "☀️ Light"}

        </span>

        <label class="theme-switch">

          <input
          type="checkbox"
          id="themeToggle"

          ${document.body.classList.contains("dark-mode")

            ? "checked"

            : ""}

          >

          <span class="theme-slider"></span>

        </label>

      </div>

      <div class="user-nav">
        ${
          user.email ===
          "arsalanalisargana@gmail.com"

          ?

          `

          <a
          href="admin/admin.html"
          class="login-btn">

            <i class="bi bi-shield-lock-fill"></i>

            Admin Panel

          </a>

          `

          :

          ""

        }

        <div class="user-info">

          <div class="user-avatar">

            <i class="bi bi-person-fill"></i>

          </div>

          <span>

            ${user.name}

          </span>

        </div>

        <button
        class="logout-btn"
        onclick="logoutUser()">

          Logout

        </button>

      </div>

    `;

  }

  // USER NOT LOGGED IN
  else {

    navArea.innerHTML = `

      <button
      class="login-btn"
      onclick="openAuth()">

        <i class="bi bi-box-arrow-in-right"></i>

        Login / Register

      </button>

    `;

  }
  setupThemeToggle();

}

/* ================= LOAD NAVBAR ================= */

updateNavbar();

switchToLogin();
