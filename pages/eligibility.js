
/* ===================================
   SECTION TOGGLE
=================================== */
console.log("ELIGIBILITY JS UPDATED 123");

const eligibilitySection =
    document.getElementById("eligibilitySection");


/* =========================
   JOB DROPDOWN
========================= */

const jobs = [

    "CSS",

    "Assistant Director FIA",
    "Inspector FIA",
    "Sub Inspector FIA",
    "ASI FIA",

    "ASF Inspector",
    "ASF Sub Inspector",
    "ASF ASI",

    "Punjab Police Constable",
    "Punjab Police Driver",
    "Punjab Police ASI",
    "Punjab Police Sub Inspector",

    "Islamabad Police Constable",
    "Islamabad Police ASI",
    "Islamabad Police Sub Inspector",

    "Sindh Police Constable",
    "Sindh Police ASI",
    "Sindh Police Sub Inspector",

    "KPK Police Constable",
    "KPK Police ASI",
    "KPK Police Sub Inspector",

    "Balochistan Police Constable",
    "Balochistan Police ASI",
    "Balochistan Police Sub Inspector",

    "AJK Police Constable",
    "AJK Police ASI",
    "AJK Police Sub Inspector",

    "GB Police Constable",
    "GB Police ASI",
    "GB Police Sub Inspector",

    "PPSC General",
    "FPSC General",
    "KPPSC General",
    "SPSC General",
    "GBPSC General",
    "AJKPSC General",

    "Army Soldier",
    "Army Clerk",
    "Army Driver",
    "Army Cook",

    "PMA Long Course",
    "PMA Graduate Course",

    "AFNS",
    "ISSB",

    "Pakistan Navy Sailor",
    "Pakistan Navy PN Cadet",

    "PAF Airman",
    "GDP Pilot",

    "Pakistan Rangers Sepoy",
    "Pakistan Rangers Sub Inspector",

    "Frontier Corps Soldier",
    "Frontier Corps SI",

    "ANF Constable",
    "ANF ASI",
    "ANF Sub Inspector",

    "IB GD",

    "NAB Assistant Director",

    "NADRA Junior Executive",

    "WAPDA Assistant",

    "Railway Assistant",

    "Lecturer",

    "Medical Officer",

    "Bank Officer"

];

const targetJobSelect =
    document.getElementById("targetJob");

jobs.forEach(job => {

    const option =
        document.createElement("option");

    option.value = job;

    option.textContent = job;

    targetJobSelect.appendChild(
        option
    );

});


const cvSection =
    document.getElementById("cvSection");


const loadingSection =
    document.getElementById("loadingSection");

const resultSection =
    document.getElementById("resultSection");

const resultContainer =
    document.getElementById("resultContainer");


function showEligibilitySection() {

    eligibilitySection.style.display = "block";

    cvSection.style.display = "none";

    resultSection.style.display = "none";

    eligibilitySection.scrollIntoView({
        behavior: "smooth"
    });

}

let latestCvReport = null;
let latestCoverLetter = "";
let latestImprovedResume = "";
let latestCvReportDocId = null;

function showCvSection() {
    console.log("showCvSection CALLED");

    cvSection.style.display = "block";

    eligibilitySection.style.display = "none";

    resultSection.style.display = "none";

    cvSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ===================================
   ELIGIBILITY CHECKER
=================================== */

document
    .getElementById("eligibilityForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullName =
            document.getElementById("fullName").value;

        const age =
            parseInt(
                document.getElementById("age").value
            );

        const qualification =
            document.getElementById("qualification").value;

        const targetJob =
            document.getElementById("targetJob").value;

        if (!fullName || !age || !targetJob) {

            alert(
                "Please fill all required fields."
            );

            return;
        }

        loadingSection.style.display = "block";

        resultSection.style.display = "none";

        try {

            const response = await fetch(
                "/eligibility",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        fullName,
                        age,

                        gender:
                        document.getElementById("gender").value,

                        province:
                        document.getElementById("province").value,

                        height:
                        document.getElementById("height").value,

                        qualification,

                        degree:
                        document.getElementById("degree").value,

                        percentage:
                        document.getElementById("percentage").value,

                        experience:
                        document.getElementById("experience").value,

                        computerSkills:
                        document.getElementById("computerSkills").value,

                        drivingLicense:
                        document.getElementById("drivingLicense").value,

                        targetJob

                    })

                }
            );

            const data =
                await response.json();

            loadingSection.style.display =
                "none";

            const cleanResult =
                data.result
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            const ai =
                JSON.parse(cleanResult);

            resultContainer.innerHTML = `

            <div class="eligibility-report-card">

                <div class="eligibility-header">

                    <h2>
                        Professional Eligibility Report
                    </h2>

                    <p>
                        AI-powered career eligibility assessment
                    </p>

                </div>

                <div class="eligibility-score-grid">

                    <div class="eligibility-score-card">

                        <h1>
                            ${ai.score}%
                        </h1>

                        <p>
                            Eligibility Score
                        </p>

                    </div>

                    <div class="eligibility-status-card">

                        <h2>
                            ${ai.status}
                        </h2>

                        <p>
                            ${ai.eligibilityLevel}
                        </p>

                    </div>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Analysis
                    </h3>

                    <p>
                        ${ai.analysis}
                    </p>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Eligibility Breakdown
                    </h3>

                    <ul>
                        ${(ai.eligibilityBreakdown || [])
                            .map(item => `
                                <li>
                                    <strong>${item.title}</strong>
                                    -
                                    ${item.status}
                                </li>
                            `)
                            .join("")}
                    </ul>

                </div>

                ${
                    ai.missingRequirements.length > 0
                    ? `
                    <div class="eligibility-section-card danger-card">

                        <h3>
                            Missing Requirements
                        </h3>

                        <ul>
                            ${ai.missingRequirements
                                .map(item => `<li>${item}</li>`)
                                .join("")}
                        </ul>

                    </div>
                    `
                    : ""
                }

                <div class="eligibility-section-card">

                    <h3>
                        Required Documents
                    </h3>

                    <ul>
                        ${ai.documents
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Recommended Jobs
                    </h3>

                    <ul>
                        ${ai.recommendedJobs
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Preparation Roadmap
                    </h3>

                    <ul>
                        ${(ai.preparationRoadmap || [])
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Application Steps
                    </h3>

                    <ul>
                        ${(ai.applicationSteps || [])
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="eligibility-section-card advice-card">

                    <h3>
                        Important Tips
                    </h3>

                    <ul>
                        ${(ai.importantTips || [])
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="eligibility-section-card">

                    <h3>
                        Career Guidance
                    </h3>

                    <p>
                        ${ai.careerGuidance}
                    </p>

                </div>

            </div>

            `;

            resultSection.style.display =
                "block";

                
            resultSection.scrollIntoView({
                behavior: "smooth"
            });

        }

        catch(error){

            console.log(error);

            alert(
                "Eligibility analysis failed"
            );

        }

    });



/* ===================================
   CV ANALYZER
=================================== */

const analyzeCvBtn =
    document.getElementById(
        "analyzeCvBtn"
    );

if (analyzeCvBtn) {

    analyzeCvBtn.addEventListener("click", async function (e) {
         e.preventDefault();
         e.stopPropagation();
    const file = document.getElementById("cvFile").files[0];

    if (!file) {
        alert("Please upload a CV.");
        return;
    }

    loadingSection.style.display = "block";
    resultSection.style.display = "none";

    try {
        const formData = new FormData();
        formData.append("cv", file);
        
        formData.append(
            "targetRole",
            document.getElementById("targetRole").value
        );

        const response = await fetch("/analyze-cv", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        latestCvReport = data;

        console.log("CV DATA RECEIVED:");
        console.log(data);

        if (!response.ok) {
            throw new Error(data.error || "CV analysis failed");
        }

        loadingSection.style.display = "none";

        const atsScore = data.atsScore || 70;
        const strengths = data.strengths || ["CV uploaded and analyzed successfully"];
        const weaknesses = data.weaknesses || ["Add more projects and job-specific keywords"];
        const skills = data.skills || ["HTML", "CSS", "JavaScript"];
        const careerAdvice =
            data.careerAdvice ||
            "Improve your CV by adding projects, GitHub links, internship experience and job-specific keywords.";

        resultContainer.innerHTML = `

        <div class="cv-report-card">

            <div class="cv-report-header">

                <h2>
                    AI CV Analysis Report
                </h2>

                <p>
                    Professional ATS based resume evaluation
                </p>

            </div>

            <div class="cv-score-grid">

                <div class="cv-score-card">

                    <h1>
                        ${data.atsScore || 0}%
                    </h1>

                    <p>
                        ATS Score
                    </p>

                </div>

                <div class="cv-score-card">

                    <h1>
                        ${data.jobMatchScore || 0}%
                    </h1>

                    <p>
                        Job Match Score
                    </p>

                </div>

            </div>

            <div class="cv-section-card">

                <h3>
                    Professional Summary
                </h3>

                <p>
                    ${data.summary || "No summary generated."}
                </p>

            </div>

            <div class="cv-section-card">

                <h3>
                    Job Match Analysis
                </h3>

                <p>
                    ${data.jobMatch || "No job match analysis generated."}
                </p>

            </div>

            <div class="cv-grid-two">

                <div class="cv-section-card">

                    <h3>
                        Strengths
                    </h3>

                    <ul>
                        ${(data.strengths || [])
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

                <div class="cv-section-card">

                    <h3>
                        Weaknesses
                    </h3>

                    <ul>
                        ${(data.weaknesses || [])
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                </div>

            </div>

            <div class="cv-grid-two">

                <div class="cv-section-card">

                    <h3>
                        Skills Found
                    </h3>

                    <div class="tag-box">
                        ${(data.skills || [])
                            .map(item => `<span>${item}</span>`)
                            .join("")}
                    </div>

                </div>

                <div class="cv-section-card">

                    <h3>
                        Missing Skills
                    </h3>

                    <div class="tag-box warning-tags">
                        ${(data.missingSkills || [])
                            .map(item => `<span>${item}</span>`)
                            .join("")}
                    </div>

                </div>

            </div>

            <div class="cv-section-card">

                <h3>
                    Recommended ATS Keywords
                </h3>

                <div class="tag-box keyword-tags">
                    ${(data.recommendedKeywords || [])
                        .map(item => `<span>${item}</span>`)
                        .join("")}
                </div>

            </div>

            <div class="cv-section-card">

                <h3>
                    Recommended Jobs
                </h3>

                <ul>
                    ${(data.recommendedJobs || [])
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>

            <div class="cv-section-card">

                <h3>
                    Section Scores
                </h3>

                <div class="progress-item">
                    <p>Education <span>${data.sectionScores?.education || 0}%</span></p>
                    <div class="progress-bar">
                        <div style="width:${data.sectionScores?.education || 0}%"></div>
                    </div>
                </div>

                <div class="progress-item">
                    <p>Skills <span>${data.sectionScores?.skills || 0}%</span></p>
                    <div class="progress-bar">
                        <div style="width:${data.sectionScores?.skills || 0}%"></div>
                    </div>
                </div>

                <div class="progress-item">
                    <p>Experience <span>${data.sectionScores?.experience || 0}%</span></p>
                    <div class="progress-bar">
                        <div style="width:${data.sectionScores?.experience || 0}%"></div>
                    </div>
                </div>

                <div class="progress-item">
                    <p>Projects <span>${data.sectionScores?.projects || 0}%</span></p>
                    <div class="progress-bar">
                        <div style="width:${data.sectionScores?.projects || 0}%"></div>
                    </div>
                </div>

                <div class="progress-item">
                    <p>Formatting <span>${data.sectionScores?.formatting || 0}%</span></p>
                    <div class="progress-bar">
                        <div style="width:${data.sectionScores?.formatting || 0}%"></div>
                    </div>
                </div>

            </div>

            <div class="cv-section-card advice-card">

                <h3>
                    Career Advice
                </h3>

                <p>
                    ${data.careerAdvice || "No career advice generated."}
                </p>

            </div>
            <button
                type="button"
                class="action-btn"
                onclick="downloadCvReport()">
                Download Report PDF
            </button>
            <button
                type="button"
                class="action-btn"
                onclick="generateCoverLetter()">
                Generate Cover Letter
            </button>
            <button
                type="button"
                class="action-btn"
                onclick="rewriteResume()">
                Improve My Resume
            </button>

        </div>



        `;

        cvSection.style.display = "block";
        resultSection.style.display = "block";
        await saveCvReport(data);
        await loadCvReports();
        console.log("RESULT SHOWN");

        resultSection.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.log("CV FRONTEND ERROR:");
        console.error(error);

        loadingSection.style.display = "none";
        alert(error.message);
    }
});

}

function downloadCvReport() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    let y = 20;

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("JobQuestAI CV Analysis Report", 20, 18);

    doc.setTextColor(0, 0, 0);

    function addSection(title, content) {

        if (y > 260) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(15);
        doc.setTextColor(30, 58, 138);
        doc.text(title, 20, y);

        y += 8;

        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);

        const lines =
            doc.splitTextToSize(content, 170);

        doc.text(lines, 20, y);

        y += lines.length * 7 + 8;
    }

    function listToText(title, selectorIndex) {

        const sections =
            document.querySelectorAll(".cv-section-card");

        const section =
            sections[selectorIndex];

        if (!section) return;

        addSection(
            title,
            section.innerText.replace(title, "").trim()
        );
    }

    const scores =
        document.querySelectorAll(".cv-score-card");

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);

    y = 45;

    if (scores[0]) {

        const atsScore =
            scores[0].querySelector("h1").innerText;

        doc.text(
            "ATS Score: " + atsScore,
            20,
            y
        );

        y += 10;
    }

    if (scores[1]) {

        const jobMatchScore =
            scores[1].querySelector("h1").innerText;

        doc.text(
            "Job Match Score: " + jobMatchScore,
            20,
            y
        );

        y += 15;
    }

    listToText("Professional Summary", 0);
    listToText("Job Match Analysis", 1);
    listToText("Strengths", 2);
    listToText("Weaknesses", 3);
    listToText("Skills Found", 4);
    listToText("Missing Skills", 5);
    listToText("Recommended ATS Keywords", 6);
    listToText("Recommended Jobs", 7);
    listToText("Section Scores", 8);
    listToText("Career Advice", 9);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);

    doc.text(
        "Generated by JobQuestAI",
        20,
        285
    );

    doc.save(
        "JobQuestAI-CV-Analysis-Report.pdf"
    );

}

async function saveCvReport(report) {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        if (!user) {
            console.log("User not logged in. CV report not saved.");
            return;
        }

        const targetRole =
            document.getElementById("targetRole").value ||
            "General Role";

        const docRef = await window.addDoc(
            window.collection(
                window.db,
                "cvReports"
            ),
            {
                userEmail: user.email,
                userName: user.name,
                targetRole: targetRole,

                atsScore: report.atsScore || 0,
                jobMatchScore: report.jobMatchScore || 0,

                summary: report.summary || "",
                jobMatch: report.jobMatch || "",
                strengths: report.strengths || [],
                weaknesses: report.weaknesses || [],
                skills: report.skills || [],
                missingSkills: report.missingSkills || [],
                recommendedKeywords: report.recommendedKeywords || [],
                recommendedJobs: report.recommendedJobs || [],
                sectionScores: report.sectionScores || {},
                careerAdvice: report.careerAdvice || "",
                coverLetter: latestCoverLetter,
                improvedResume: latestImprovedResume,

                createdAt: Date.now(),
                date: new Date().toLocaleDateString()
            }
        );
        latestCvReportDocId = docRef.id;

        console.log("CV report saved successfully");

    } catch (error) {

        console.log("CV Report Save Error:");
        console.log(error);

    }

}

async function loadCvReports() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const container = document.getElementById("cvHistoryContainer");

    if (!container) return;

    container.innerHTML = "Loading reports...";

    const q = window.query(
        window.collection(window.db, "cvReports"),
        window.where("userEmail", "==", user.email)
    );

    const snapshot = await window.getDocs(q);

    container.innerHTML = "";

    snapshot.forEach(doc => {
        const report = doc.data();

        container.innerHTML += `
            <div class="cv-section-card">
                <h3>${report.targetRole}</h3>
                <p>ATS Score: ${report.atsScore}%</p>
                <p>Job Match: ${report.jobMatchScore}%</p>
                <p>Date: ${report.date}</p>
            </div>
        `;
    });
}

window.addEventListener("load", () => {
    loadCvReports();
});

async function generateCoverLetter() {
    if (!latestCvReport) {
        alert("Please analyze CV first.");
        return;
    }

    const targetRole =
        document.getElementById("targetRole").value ||
        "Target Role";

    loadingSection.style.display = "block";

    const response = await fetch(
        "/generate-cover-letter",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                targetRole: targetRole,
                report: latestCvReport
            })
        }
    );

    const data = await response.json();

    loadingSection.style.display = "none";

    if (!response.ok) {
        alert(data.error || "Cover letter failed");
        return;
    }
    latestCoverLetter = data.coverLetter;

    await updateCurrentCvReport({
        coverLetter: latestCoverLetter
    });

    resultContainer.innerHTML += `
        <div class="cv-section-card advice-card cover-letter-box">
            <h3>AI Generated Cover Letter</h3>

            <p style="white-space: pre-line;">
                ${data.coverLetter}
            </p>

            <div style="text-align:center; margin-top:20px;">
                <button
                    type="button"
                    class="action-btn"
                    onclick="downloadCoverLetter()">
                    Download Cover Letter PDF
                </button>
            </div>
        </div>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}


function downloadCoverLetter() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    const coverBox =
        document.querySelector(
            ".cover-letter-box"
        );

    if (!coverBox) {
        alert("Please generate cover letter first.");
        return;
    }

    const coverText =
        coverBox.innerText
            .replace("Download Cover Letter PDF", "")
            .trim();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);

    doc.text(
        "JobQuestAI Cover Letter",
        20,
        18
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    const lines =
        doc.splitTextToSize(
            coverText,
            170
        );

    doc.text(
        lines,
        20,
        40
    );

    doc.save(
        "JobQuestAI-Cover-Letter.pdf"
    );

}


async function rewriteResume() {
    if (!latestCvReport) {
        alert("Please analyze CV first.");
        return;
    }

    const targetRole =
        document.getElementById("targetRole").value ||
        "Target Role";

    loadingSection.style.display = "block";

    const response = await fetch(
        "/rewrite-resume",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                targetRole,
                report: latestCvReport
            })
        }
    );

    const data = await response.json();

    loadingSection.style.display = "none";

    if (!response.ok) {
        alert(data.error || "Resume rewrite failed");
        return;
    }
    latestImprovedResume = data.improvedResume;

    await updateCurrentCvReport({
        improvedResume: latestImprovedResume
    });

    resultContainer.innerHTML += `
        <div class="cv-section-card advice-card improved-resume-box">
            <h3>AI Improved Resume Draft</h3>

            <p style="white-space: pre-line;">
                ${data.improvedResume}
            </p>

            <div style="text-align:center; margin-top:20px;">
                <button
                    type="button"
                    class="action-btn"
                    onclick="downloadImprovedResume()">
                    Download Improved Resume PDF
                </button>
            </div>
        </div>
    `;

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}

function downloadImprovedResume() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    const resumeBox =
        document.querySelector(
            ".improved-resume-box"
        );

    if (!resumeBox) {
        alert("Please generate improved resume first.");
        return;
    }

    const resumeText =
        resumeBox.innerText
            .replace("Download Improved Resume PDF", "")
            .trim();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);

    doc.text(
        "JobQuestAI Improved Resume",
        20,
        18
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    const lines =
        doc.splitTextToSize(
            resumeText,
            170
        );

    doc.text(
        lines,
        20,
        40
    );

    doc.save(
        "JobQuestAI-Improved-Resume.pdf"
    );

}

async function updateCurrentCvReport(extraData) {

    try {

        if (!latestCvReportDocId) {
            console.log("No CV report document selected.");
            return;
        }

        await window.updateDoc(
            window.doc(
                window.db,
                "cvReports",
                latestCvReportDocId
            ),
            extraData
        );

        console.log("CV report updated successfully");

    } catch (error) {

        console.log("CV Report Update Error:");
        console.log(error);

    }

}