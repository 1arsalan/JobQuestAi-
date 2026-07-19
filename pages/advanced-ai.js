/* ====================================
   ADVANCED AI CAREER TOOLS JS
==================================== */

const adAnalyzerSection =
    document.getElementById("adAnalyzerSection");

const loadingSection =
    document.getElementById("loadingSection");

const resultSection =
    document.getElementById("resultSection");

const resultContainer =
    document.getElementById("resultContainer");

const analyzeAdBtn =
    document.getElementById("analyzeAdBtn");

const studyPlanSection =
    document.getElementById("studyPlanSection");

const generateStudyPlanBtn =
    document.getElementById("generateStudyPlanBtn");

const interviewSection =
    document.getElementById("interviewSection");

const generateInterviewBtn =
    document.getElementById("generateInterviewBtn");

const careerRoadmapSection =
    document.getElementById("careerRoadmapSection");

const generateCareerRoadmapBtn =
    document.getElementById("generateCareerRoadmapBtn");
/* ===============================
   SHOW AD ANALYZER
================================ */

function showAdAnalyzer() {

    adAnalyzerSection.style.display =
        "block";

    resultSection.style.display =
        "none";

    adAnalyzerSection.scrollIntoView({
        behavior: "smooth"
    });

}

function showStudyPlanSection() {

    studyPlanSection.style.display =
        "block";

    adAnalyzerSection.style.display =
        "none";

    resultSection.style.display =
        "none";

    studyPlanSection.scrollIntoView({
        behavior: "smooth"
    });

}

function showInterviewSection() {

    interviewSection.style.display =
        "block";

    adAnalyzerSection.style.display =
        "none";

    studyPlanSection.style.display =
        "none";

    resultSection.style.display =
        "none";

    interviewSection.scrollIntoView({
        behavior: "smooth"
    });

}
function showCareerRoadmapSection() {

    careerRoadmapSection.style.display =
        "block";

    adAnalyzerSection.style.display =
        "none";

    studyPlanSection.style.display =
        "none";

    interviewSection.style.display =
        "none";

    resultSection.style.display =
        "none";

    careerRoadmapSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ===============================
   ANALYZE ADVERTISEMENT
================================ */

if (analyzeAdBtn) {

    analyzeAdBtn.addEventListener(
        "click",
        async function () {

            const file =
                document.getElementById("adFile").files[0];

            if (!file) {

                alert(
                    "Please upload advertisement PDF first."
                );

                return;

            }

            const formData =
                new FormData();

            formData.append(
                "adFile",
                file
            );

            loadingSection.style.display =
                "block";

            resultSection.style.display =
                "none";

            try {

                const response =
                    await fetch(
                        "/analyze-advertisement",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                loadingSection.style.display =
                    "none";

                if (!response.ok) {

                    alert(
                        data.error ||
                        "Advertisement analysis failed"
                    );

                    return;

                }
                

                const availableJobs =
                    data.availableJobs?.length
                    ? data.availableJobs
                    : [];

                const requiredDocuments =
                    data.requiredDocuments?.length
                    ? data.requiredDocuments
                    : ["Not mentioned"];

                const applicationProcess =
                    data.applicationProcess?.length
                    ? data.applicationProcess
                    : ["Not mentioned"];

                const importantInstructions =
                    data.importantInstructions?.length
                    ? data.importantInstructions
                    : ["Not mentioned"];

                const testPattern =
                    data.testPattern?.length
                    ? data.testPattern
                    : ["Not mentioned"];

                resultContainer.innerHTML = `

                <div class="ad-report-card">

                    <div class="ad-report-header">
                        <h2>AI Advertisement Analysis Report</h2>
                        <p>Complete extracted details from uploaded advertisement</p>
                    </div>

                    <div class="ad-score-grid">
                        <div class="ad-score-card">
                            <h1>${data.relevanceScore || 0}%</h1>
                            <p>Relevance Score</p>
                        </div>

                        <div class="ad-score-card">
                            <h1>${data.difficultyLevel || "Medium"}</h1>
                            <p>Difficulty Level</p>
                        </div>
                    </div>

                    <div class="ad-grid-two">
                        <div class="ad-section-card">
                            <h3>Organization</h3>
                            <p>${data.organization || "Not mentioned"}</p>
                        </div>

                        <div class="ad-section-card">
                            <h3>Advertisement Title</h3>
                            <p>${data.advertisementTitle || "Not mentioned"}</p>
                        </div>
                    </div>

                    <div class="ad-grid-two">
                        <div class="ad-section-card">
                            <h3>Last Date</h3>
                            <p>${data.lastDate || "Not mentioned"}</p>
                        </div>

                        <div class="ad-section-card">
                            <h3>Application Fee</h3>
                            <p>${data.fee || "Not mentioned"}</p>
                        </div>
                    </div>

                    <div class="ad-grid-two">
                        <div class="ad-section-card">
                            <h3>Website</h3>
                            <p>${data.website || "Not mentioned"}</p>
                        </div>

                        <div class="ad-section-card">
                            <h3>Address</h3>
                            <p>${data.address || "Not mentioned"}</p>
                        </div>
                    </div>

                    <div class="ad-section-card">
                        <h3>Available Jobs</h3>

                        <div class="jobs-table-wrapper">
                            <table class="jobs-table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>BPS / Scale</th>
                                        <th>Posts</th>
                                        <th>Qualification</th>
                                        <th>Experience</th>
                                        <th>Age</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    ${
                                        availableJobs.length > 0
                                        ? availableJobs.map(job => `
                                            <tr>
                                                <td>${job.jobTitle || "Not mentioned"}</td>
                                                <td>${job.bpsScale || "Not mentioned"}</td>
                                                <td>${job.posts || "Not mentioned"}</td>
                                                <td>${job.qualification || "Not mentioned"}</td>
                                                <td>${job.experience || "Not mentioned"}</td>
                                                <td>${job.ageLimit || "Not mentioned"}</td>
                                            </tr>
                                        `).join("")
                                        : `
                                            <tr>
                                                <td colspan="6">No jobs extracted clearly</td>
                                            </tr>
                                        `
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="ad-section-card">
                        <h3>Required Documents</h3>
                        <ul>
                            ${requiredDocuments.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="ad-section-card">
                        <h3>Application Process</h3>
                        <ul>
                            ${applicationProcess.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="ad-section-card">
                        <h3>Important Instructions</h3>
                        <ul>
                            ${importantInstructions.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="ad-section-card">
                        <h3>Test Pattern / Selection Process</h3>
                        <ul>
                            ${testPattern.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="ad-section-card advice-card">
                        <h3>AI Career Advice</h3>
                        <p>${data.careerAdvice || "No advice generated."}</p>
                    </div>

                </div>

                `;

                resultSection.style.display =
                    "block";

                resultSection.scrollIntoView({
                    behavior: "smooth"
                });

            } catch (error) {

                console.log(error);

                loadingSection.style.display =
                    "none";

                alert(
                    "Something went wrong while analyzing advertisement."
                );

            }

        }
    );

}


/*AI Study Plan Generator*/

/* ===============================
   GENERATE STUDY PLAN
================================ */

if (generateStudyPlanBtn) {

    generateStudyPlanBtn.addEventListener(
        "click",
        async function () {

            const studyTarget =
                document.getElementById("studyTarget").value.trim();

            const studyDuration =
                document.getElementById("studyDuration").value;

            const dailyHours =
                document.getElementById("dailyHours").value;

            const prepLevel =
                document.getElementById("prepLevel").value;

            const weakTopics =
                document.getElementById("weakTopics").value.trim();

            if (!studyTarget) {

                alert(
                    "Please enter your target exam or job."
                );

                return;

            }

            loadingSection.style.display =
                "block";

            resultSection.style.display =
                "none";

            try {

                const response =
                    await fetch(
                        "/generate-study-plan",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                studyTarget,
                                studyDuration,
                                dailyHours,
                                prepLevel,
                                weakTopics
                            })
                        }
                    );

                const data =
                    await response.json();

                loadingSection.style.display =
                    "none";

                if (!response.ok) {

                    alert(
                        data.error ||
                        "Study plan generation failed"
                    );

                    return;

                }

                const weeklyPlan =
                    data.weeklyPlan?.length
                    ? data.weeklyPlan
                    : [];

                const dailyRoutine =
                    data.dailyRoutine?.length
                    ? data.dailyRoutine
                    : ["Not generated"];

                const recommendedResources =
                    data.recommendedResources?.length
                    ? data.recommendedResources
                    : ["Past papers", "Official syllabus"];

                const practiceTasks =
                    data.practiceTasks?.length
                    ? data.practiceTasks
                    : ["Solve MCQs daily"];

                const milestones =
                    data.milestones?.length
                    ? data.milestones
                    : ["Complete syllabus step by step"];

                const revisionStrategy =
                    data.revisionStrategy?.length
                    ? data.revisionStrategy
                    : ["Revise important topics weekly"];

                const mockTestPlan =
                    data.mockTestPlan?.length
                    ? data.mockTestPlan
                    : ["Take one mock test every week"];

                const weakTopicStrategy =
                    data.weakTopicStrategy?.length
                    ? data.weakTopicStrategy
                    : ["Give extra time to weak topics"];

                resultContainer.innerHTML = `

                <div class="study-report-card">

                    <div class="study-report-header">

                        <h2>
                            AI Personalized Study Plan
                        </h2>

                        <p>
                            ${data.summary || "Your personalized preparation roadmap is ready."}
                        </p>

                    </div>

                    <div class="study-score-grid">

                        <div class="study-score-card">

                            <h1>
                                ${data.difficultyLevel || "Medium"}
                            </h1>

                            <p>
                                Difficulty Level
                            </p>

                        </div>

                        <div class="study-score-card">

                            <h1>
                                ${data.successProbability || "70%"}
                            </h1>

                            <p>
                                Success Probability
                            </p>

                        </div>


                    </div>


                    <div class="study-section-card">

                        <h3>
                            Difficulty & Success Reason
                        </h3>

                        <p>
                            <strong>Difficulty Reason:</strong>
                            ${data.difficultyReason || "Difficulty estimated from exam type and preparation level."}
                        </p>

                        <p>
                            <strong>Success Probability Reason:</strong>
                            ${data.successReason || "Probability estimated from duration, daily hours and current level."}
                        </p>

                    </div>


                    <div class="study-section-card">

                        <h3>
                            Target Exam / Job
                        </h3>

                        <p>
                            ${data.target || studyTarget}
                        </p>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Daily Routine
                        </h3>

                        <ul>
                            ${dailyRoutine
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Weekly Study Plan
                        </h3>

                        <div class="week-grid">
                            ${
                                weeklyPlan.length > 0
                                ? weeklyPlan.map(week => `
                                    <div class="week-card">
                                        <h4>${week.week || "Week"}</h4>
                                        <p>${week.focus || "Study focus not mentioned"}</p>
                                        <ul>
                                            ${(week.tasks || [])
                                                .map(task => `<li>${task}</li>`)
                                                .join("")}
                                        </ul>
                                    </div>
                                `).join("")
                                : `<p>No weekly plan generated.</p>`
                            }
                        </div>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Recommended Resources
                        </h3>

                        <ul>
                            ${recommendedResources
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Practice Tasks
                        </h3>

                        <ul>
                            ${practiceTasks
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Milestones
                        </h3>

                        <ul>
                            ${milestones
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Revision Strategy
                        </h3>

                        <ul>
                            ${revisionStrategy
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Mock Test Plan
                        </h3>

                        <ul>
                            ${mockTestPlan
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card">

                        <h3>
                            Weak Topic Strategy
                        </h3>

                        <ul>
                            ${weakTopicStrategy
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="study-section-card advice-card">

                        <h3>
                            AI Preparation Advice
                        </h3>

                        <p>
                            ${data.advice || "Stay consistent, revise daily, and practice past papers."}
                        </p>

                    </div>

                </div>

                `;

                resultSection.style.display =
                    "block";

                resultSection.scrollIntoView({
                    behavior: "smooth"
                });

            } catch (error) {

                console.log(error);

                loadingSection.style.display =
                    "none";

                alert(
                    "Something went wrong while generating study plan."
                );

            }

        }
    );

}

/* ===============================
   GENERATE INTERVIEW PREPARATION
================================ */

if (generateInterviewBtn) {

    generateInterviewBtn.addEventListener(
        "click",
        async function () {

            const interviewRole =
                document.getElementById("interviewRole").value.trim();

            const interviewType =
                document.getElementById("interviewType").value;

            const interviewExperience =
                document.getElementById("interviewExperience").value;

            const interviewLanguage =
                document.getElementById("interviewLanguage").value;

            const candidateBackground =
                document.getElementById("candidateBackground").value.trim();

            if (!interviewRole) {

                alert(
                    "Please enter target job or role."
                );

                return;

            }

            loadingSection.style.display =
                "block";

            resultSection.style.display =
                "none";

            try {

                const response =
                    await fetch(
                        "/generate-interview-prep",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                interviewRole,
                                interviewType,
                                interviewExperience,
                                interviewLanguage,
                                candidateBackground
                            })
                        }
                    );

                const data =
                    await response.json();

                loadingSection.style.display =
                    "none";

                if (!response.ok) {

                    alert(
                        data.error ||
                        "Interview preparation failed"
                    );

                    return;

                }

                const questions =
                    data.questions?.length
                    ? data.questions
                    : [];

                const hrTips =
                    data.hrTips?.length
                    ? data.hrTips
                    : ["Be confident and answer clearly"];

                const commonMistakes =
                    data.commonMistakes?.length
                    ? data.commonMistakes
                    : ["Avoid unclear answers"];

                const documents =
                    data.documentsToCarry?.length
                    ? data.documentsToCarry
                    : ["CNIC", "CV", "Educational Documents"];

                const finalChecklist =
                    data.finalChecklist?.length
                    ? data.finalChecklist
                    : ["Revise your introduction", "Prepare documents", "Reach on time"];

                resultContainer.innerHTML = `

                <div class="interview-report-card">

                    <div class="interview-report-header">

                        <h2>
                            AI Interview Preparation Report
                        </h2>

                        <p>
                            ${data.summary || "Your personalized interview preparation guide is ready."}
                        </p>

                    </div>

                    <div class="interview-score-grid">

                        <div class="interview-score-card">

                            <h1>
                                ${data.confidenceScore || "75%"}
                            </h1>

                            <p>
                                Confidence Score
                            </p>

                        </div>

                        <div class="interview-score-card">

                            <h1>
                                ${data.difficultyLevel || "Medium"}
                            </h1>

                            <p>
                                Interview Difficulty
                            </p>

                        </div>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Target Role
                        </h3>

                        <p>
                            ${data.targetRole || interviewRole}
                        </p>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Interview Strategy
                        </h3>

                        <p>
                            ${data.strategy || "Focus on confidence, clarity, job knowledge and practical examples."}
                        </p>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Interview Questions & Best Answers
                        </h3>

                        <div class="question-list">

                            ${
                                questions.length > 0
                                ? questions.map((item, index) => `
                                    <div class="question-card">
                                        <h4>
                                            Q${index + 1}. ${item.question || "Question not generated"}
                                        </h4>

                                        <p>
                                            <strong>Best Answer:</strong>
                                            ${item.answer || "Answer not generated"}
                                        </p>

                                        <p>
                                            <strong>Follow-up:</strong>
                                            ${item.followUp || "Not mentioned"}
                                        </p>
                                    </div>
                                `).join("")
                                : `<p>No questions generated.</p>`
                            }

                        </div>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            HR / Interview Tips
                        </h3>

                        <ul>
                            ${hrTips
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Common Mistakes to Avoid
                        </h3>

                        <ul>
                            ${commonMistakes
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Documents to Carry
                        </h3>

                        <ul>
                            ${documents
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="interview-section-card">

                        <h3>
                            Final Checklist
                        </h3>

                        <ul>
                            ${finalChecklist
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="interview-section-card advice-card">

                        <h3>
                            Final AI Feedback
                        </h3>

                        <p>
                            ${data.finalFeedback || "Practice answers loudly, stay confident, and keep examples ready."}
                        </p>

                    </div>

                </div>

                `;

                resultSection.style.display =
                    "block";

                resultSection.scrollIntoView({
                    behavior: "smooth"
                });

            } catch (error) {

                console.log(error);

                loadingSection.style.display =
                    "none";

                alert(
                    "Something went wrong while generating interview preparation."
                );

            }

        }
    );

}


/* ===============================
   GENERATE CAREER ROADMAP
================================ */

if (generateCareerRoadmapBtn) {

    generateCareerRoadmapBtn.addEventListener(
        "click",
        async function () {

            const careerEducation =
                document.getElementById("careerEducation").value.trim();

            const careerField =
                document.getElementById("careerField").value.trim();

            const careerCgpa =
                document.getElementById("careerCgpa").value.trim();

            const careerExperience =
                document.getElementById("careerExperience").value;

            const careerSkills =
                document.getElementById("careerSkills").value.trim();

            const careerGoal =
                document.getElementById("careerGoal").value.trim();

            const careerCountry =
                document.getElementById("careerCountry").value.trim();

            const careerTimeline =
                document.getElementById("careerTimeline").value;

            const careerPreference =
                document.getElementById("careerPreference").value;

            if (!careerEducation || !careerGoal) {
                alert("Please enter education and career goal.");
                return;
            }

            loadingSection.style.display =
                "block";

            resultSection.style.display =
                "none";

            try {

                const response =
                    await fetch(
                        "/generate-career-roadmap",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                careerEducation,
                                careerField,
                                careerCgpa,
                                careerExperience,
                                careerSkills,
                                careerGoal,
                                careerCountry,
                                careerTimeline,
                                careerPreference
                            })
                        }
                    );

                const data =
                    await response.json();

                loadingSection.style.display =
                    "none";

                if (!response.ok) {
                    alert(
                        data.error ||
                        "Career roadmap generation failed"
                    );
                    return;
                }

                const strengths =
                    data.strengths?.length
                    ? data.strengths
                    : ["Good learning potential"];

                const weaknesses =
                    data.weaknesses?.length
                    ? data.weaknesses
                    : ["Need more practical experience"];

                const missingSkills =
                    data.missingSkills?.length
                    ? data.missingSkills
                    : ["Role-specific skills"];

                const certifications =
                    data.certifications?.length
                    ? data.certifications
                    : ["Relevant online certification"];

                const projects =
                    data.projects?.length
                    ? data.projects
                    : ["Portfolio project"];

                const roadmap =
                    data.roadmap?.length
                    ? data.roadmap
                    : [];

                const jobStrategy =
                    data.jobStrategy?.length
                    ? data.jobStrategy
                    : ["Build portfolio", "Apply consistently"];

                const weeklyActions =
                    data.weeklyActions?.length
                    ? data.weeklyActions
                    : ["Learn daily", "Build projects", "Apply for jobs"];

                resultContainer.innerHTML = `

                <div class="career-report-card">

                    <div class="career-header">

                        <h2>
                            AI Career Roadmap Report
                        </h2>

                        <p>
                            ${data.summary || "Your personalized career roadmap is ready."}
                        </p>

                    </div>

                    <div class="career-score-grid">

                        <div class="career-score-card">
                            <h1>${data.readinessScore || "65%"}</h1>
                            <p>Career Readiness</p>
                        </div>

                        <div class="career-score-card">
                            <h1>${data.marketDemand || "Medium"}</h1>
                            <p>Market Demand</p>
                        </div>

                        <div class="career-score-card">
                            <h1>${data.timelineDifficulty || "Medium"}</h1>
                            <p>Timeline Difficulty</p>
                        </div>

                    </div>

                    <div class="career-section">

                        <h3>Career Goal</h3>

                        <p>
                            ${data.careerGoal || careerGoal}
                        </p>

                    </div>

                    <div class="career-section">

                        <h3>Current Level Analysis</h3>

                        <p>
                            ${data.currentLevelAnalysis || "Analysis not generated."}
                        </p>

                    </div>

                    <div class="career-section">

                        <h3>Skill Gap Analysis</h3>

                        <div class="skill-grid">

                            <div class="skill-card">
                                <h4>Strengths</h4>
                                <ul>
                                    ${strengths
                                        .map(item => `<li>${item}</li>`)
                                        .join("")}
                                </ul>
                            </div>

                            <div class="skill-card">
                                <h4>Weaknesses</h4>
                                <ul>
                                    ${weaknesses
                                        .map(item => `<li>${item}</li>`)
                                        .join("")}
                                </ul>
                            </div>

                            <div class="skill-card">
                                <h4>Missing Skills</h4>
                                <ul>
                                    ${missingSkills
                                        .map(item => `<li>${item}</li>`)
                                        .join("")}
                                </ul>
                            </div>

                            <div class="skill-card">
                                <h4>Recommended Certifications</h4>
                                <ul>
                                    ${certifications
                                        .map(item => `<li>${item}</li>`)
                                        .join("")}
                                </ul>
                            </div>

                        </div>

                    </div>

                    <div class="career-section">

                        <h3>Personalized Roadmap</h3>

                        <div class="month-grid">

                            ${
                                roadmap.length > 0
                                ? roadmap.map(item => `
                                    <div class="month-card">
                                        <h4>${item.phase || "Phase"}</h4>
                                        <p>${item.focus || "Focus not mentioned"}</p>
                                        <ul>
                                            ${(item.tasks || [])
                                                .map(task => `<li>${task}</li>`)
                                                .join("")}
                                        </ul>
                                    </div>
                                `).join("")
                                : `<p>No roadmap generated.</p>`
                            }

                        </div>

                    </div>

                    <div class="career-section">

                        <h3>Recommended Projects</h3>

                        <ul>
                            ${projects
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="career-section">

                        <h3>Job Strategy</h3>

                        <ul>
                            ${jobStrategy
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>

                    <div class="salary-card">

                        <h2>
                            ${data.salaryEstimate || "Not estimated"}
                        </h2>

                        <p>
                            Estimated salary range for your target role and market.
                        </p>

                    </div>

                    <div class="career-section">

                        <h3>Weekly Action Plan</h3>

                        ${
                            weeklyActions
                                .map((item, index) => `
                                    <div class="action-card">
                                        <strong>Week ${index + 1}:</strong>
                                        ${item}
                                    </div>
                                `)
                                .join("")
                        }

                    </div>

                    <div class="career-section advice-card">

                        <h3>Final AI Career Advice</h3>

                        <p>
                            ${data.finalAdvice || "Stay consistent, build projects, improve skills and apply regularly."}
                        </p>

                    </div>

                </div>

                `;

                resultSection.style.display =
                    "block";

                resultSection.scrollIntoView({
                    behavior: "smooth"
                });

            } catch (error) {

                console.log(error);

                loadingSection.style.display =
                    "none";

                alert(
                    "Something went wrong while generating career roadmap."
                );

            }

        }
    );

}