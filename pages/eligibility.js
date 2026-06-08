
/* ===================================
   SECTION TOGGLE
=================================== */

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


function showCvSection() {

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
                "http://localhost:3000/eligibility",
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

            <div class="result-card">

                <h2>
                    Eligibility Result
                </h2>

                <div class="score-box">

                    <h1>
                        ${ai.score}%
                    </h1>

                </div>

                <h3>
                    ${ai.status}
                </h3>

                <p>
                    ${ai.analysis}
                </p>

                <h3>
                    Career Guidance
                </h3>

                <p>
                    ${ai.careerGuidance}
                </p>

                ${ai.missingRequirements.length > 0 ? `
                <h3>Missing Requirements</h3>
                <ul>
                ${ai.missingRequirements
                    .map(item => `<li>${item}</li>`)
                    .join("")}
                </ul>
                ` : ""}

                <ul>
                ${ai.missingRequirements
                    .map(item => `<li>${item}</li>`)
                    .join("")}
                </ul>

                <h3>
                    Recommended Jobs
                </h3>

                <ul>
                ${ai.recommendedJobs
                    .map(item => `<li>${item}</li>`)
                    .join("")}
                </ul>

                <h3>
                    Required Documents
                </h3>

                <ul>
                ${ai.documents
                    .map(item => `<li>${item}</li>`)
                    .join("")}
                </ul>

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

    analyzeCvBtn.addEventListener(
        "click",
        async function () {

            const file =
                document.getElementById(
                    "cvFile"
                ).files[0];

            if (!file) {

                alert(
                    "Please upload a CV."
                );

                return;
            }

            loadingSection.style.display =
                "block";

            resultSection.style.display =
                "none";

            try {

                const formData =
                new FormData();

                formData.append(
                    "cv",
                    file
                );

                const response =
                await fetch(
                    "http://localhost:3000/analyze-cv",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data =
                await response.json();

                loadingSection.style.display =
                "none";

                const ai =
                JSON.parse(data.result);

                resultContainer.innerHTML = `

                <div class="result-card">

                    <h2>
                        CV Analysis Report
                    </h2>

                    <div class="score-box">

                        <h1>
                            ${ai.atsScore}%
                        </h1>

                        <p>
                            ATS Score
                        </p>

                    </div>

                    <h3>Strengths</h3>

                    <ul>
                    ${ai.strengths
                        .map(item =>
                        `<li>${item}</li>`)
                        .join("")}
                    </ul>

                    <h3>Weaknesses</h3>

                    <ul>
                    ${ai.weaknesses
                        .map(item =>
                        `<li>${item}</li>`)
                        .join("")}
                    </ul>

                    <h3>Skills</h3>

                    <ul>
                    ${ai.skills
                        .map(item =>
                        `<li>${item}</li>`)
                        .join("")}
                    </ul>

                    <h3>
                        Career Advice
                    </h3>

                    <p>
                        ${ai.careerAdvice}
                    </p>

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

                loadingSection.style.display =
                "none";

                alert(
                    "CV Analysis Failed"
                );


                }

        }
    );

}

