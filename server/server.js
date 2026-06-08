
const jobsRules = require("./jobs-rules");
require("dotenv").config();


const express = require("express");

const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");

const upload = multer({
    dest: "uploads/"
});
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

/* ================= AI GENERATE ROUTE ================= */

app.post("/generate", async (req, res) => {

  try {

    const { topic, difficulty, count } = req.body;

    /* ================= SMART TOPIC FIX ================= */

    let fullTopic = topic;

    // CSS FIX
    if(topic.toLowerCase().includes("css")) {

      fullTopic =
      topic.replace(
        "CSS",
        "Central Superior Services (CSS) competitive exam"
      );

    }

    // PMS FIX
    if(topic.toLowerCase().includes("pms")) {

      fullTopic =
      topic.replace(
        "PMS",
        "Provincial Management Services (PMS) exam"
      );

    }

    // PPSC FIX
    if(topic.toLowerCase().includes("ppsc")) {

      fullTopic =
      topic.replace(
        "PPSC",
        "Punjab Public Service Commission (PPSC)"
      );

    }

    // FPSC FIX
    if(topic.toLowerCase().includes("fpsc")) {

      fullTopic =
      topic.replace(
        "FPSC",
        "Federal Public Service Commission (FPSC)"
      );

    }


    /* ================= AI REQUEST ================= */

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "llama-3.3-70b-versatile",
          temperature: 1.3,

          top_p: 0.95,

          messages: [
            {
              role: "user",

              content: `


Generate exactly ${count} HIGH-QUALITY and UNIQUE MCQs for:

"${fullTopic}"

Difficulty level:
${difficulty}

TARGET:
Competitive exam preparation students.

VERY IMPORTANT RULES:

- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- No headings
- No extra text

- Questions MUST feel like real:
CSS
PMS
FPSC
PPSC
NTS
university entry test
and government job MCQs

- Generate concept-based,
analytical,
fact-based,
scenario-based,
and reasoning MCQs

- Avoid simple/common/repeated internet MCQs

- Every response MUST generate completely fresh questions

- Randomize:
topics,
concepts,
question styles,
correct option positions

- Never repeat previous style/questions

- Questions should feel professional and exam-standard

- Avoid vague wording

- Avoid trick/confusing English

- Each question MUST contain:
exactly 4 options

- Correct answer MUST exactly match one option

- Keep options balanced length

- Avoid:
"All of the above"
"None of the above"

- Questions must be educational and realistic

- Add short explanation for learning

JSON format:

[
  {
    "q":"Question here",

    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],

    "correct":"Correct option here",

    "explanation":
    "Short explanation why answer is correct"
  }
]
  `
            }
          ]
        })
      }
    );

    const data = await response.json();

    /* ================= ERROR HANDLING ================= */

    if(data.error){

      return res.status(500).json({
        error: data.error.message
      });

    }

    /* ================= DEBUG ================= */

    console.log("AI RESPONSE:");
    console.log(data);

    res.json(data);

  } catch (error) {

    console.log("FULL ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});

app.post("/eligibility", async (req, res) => {

try {

    const {
        fullName,
        age,
        gender,
        province,
        height,
        qualification,
        degree,
        percentage,
        experience,
        computerSkills,
        drivingLicense,
        targetJob
    } = req.body;

    const jobKey = Object.keys(jobsRules).find(
        job =>
            job.toLowerCase().includes(
                targetJob.toLowerCase()
            )
    );

const jobRule =
    jobsRules[jobKey];

    console.log("TARGET JOB:", targetJob);
    console.log("MATCHED JOB:", jobKey);
    console.log("RULE:", jobRule);

    let status = "Eligible";
    let score = 100;

    const missingRequirements = [];

    if (jobRule) {

        if (
            age < jobRule.minAge ||
            age > jobRule.maxAge
        ) {

            status = "Not Eligible";

            score -= 25;

            missingRequirements.push(
                "Age Requirement"
            );
        }

        if (
            !jobRule.qualification
                .map(q => q.toLowerCase())
                .includes(
                    qualification.toLowerCase()
                )
        ) 
        {

            status = "Not Eligible";

            score -= 25;

            missingRequirements.push(
                `Minimum Qualification Required: ${jobRule.qualification.join(", ")}`
            );
        }

        if (
          jobRule.minHeightMale &&
          gender === "Male"
      ) {

          if (
              parseFloat(height) <
              jobRule.minHeightMale
          ) {

              status = "Not Eligible";

              score -= 20;

              missingRequirements.push(
                  `Minimum Height Required: ${jobRule.minHeightMale} feet`
              );
          }

      }

      if (
          jobRule.drivingLicense &&
          drivingLicense !== "Yes"
      ) {

          status = "Not Eligible";

          score -= 20;

          missingRequirements.push(
              "Valid Driving License Required"
          );

      }

      if (
          jobRule.computerSkills &&
          computerSkills !== "Yes"
      ) {

          status = "Not Eligible";

          score -= 15;

          missingRequirements.push(
              "Basic Computer Skills Required"
          );

      }
    }

    let recommendedJobs = [];

if (targetJob.toLowerCase().includes("police")) {

    if (status === "Eligible") {

        recommendedJobs = [
            targetJob,
            "Investigation Officer",
            "Detective Officer"
        ];

    } else {

        recommendedJobs = [
            "Punjab Police Constable",
            "Punjab Police ASI",
            "Investigation Officer"
        ];

    }

}
else if (targetJob.toLowerCase().includes("fia")) {

    recommendedJobs = [
        "Assistant Director FIA",
        "Inspector FIA",
        "Sub Inspector FIA"
    ];

}
else if (targetJob.toLowerCase().includes("asf")) {

    recommendedJobs = [
        "ASF Inspector",
        "ASF Sub Inspector",
        "ASF ASI"
    ];

}
else if (targetJob.toLowerCase().includes("css")) {

    recommendedJobs = [
        "CSS",
        "PMS",
        "Assistant Commissioner"
    ];

}
else if (targetJob.toLowerCase().includes("army")) {

    recommendedJobs = [
        "PMA Long Course",
        "Army Soldier",
        "Army Clerk"
    ];

}
else {

    recommendedJobs = [
        "Software Engineer",
        "Data Analyst",
        "Junior IT Officer"
    ];

}

let documents = ["CNIC"];

if (targetJob.toLowerCase().includes("police")) {

    documents = [
        "CNIC",
        "Domicile",
        "Educational Certificates",
        "Character Certificate"
    ];

}
else if (targetJob.toLowerCase().includes("fia")) {

    documents = [
        "CNIC",
        "Domicile",
        "Bachelor Degree",
        "Experience Certificate"
    ];

}
else if (targetJob.toLowerCase().includes("asf")) {

    documents = [
        "CNIC",
        "Domicile",
        "Educational Certificates",
        "Medical Fitness Certificate"
    ];

}
else if (targetJob.toLowerCase().includes("css")) {

    documents = [
        "CNIC",
        "Domicile",
        "Bachelor Degree",
        "Photographs"
    ];

}
else {

    documents = [
        "CNIC",
        "Educational Certificates"
    ];

}
    
const result = {

    status: status,

    score: score,

    analysis:
        status === "Eligible"
        ? "You meet the basic eligibility requirements."
        : "You do not meet all required eligibility criteria.",

    missingRequirements:
        missingRequirements,

   recommendedJobs: recommendedJobs,

    careerGuidance:

        status === "Eligible"

        ? "Prepare for written tests, physical tests and interviews."

        : "Improve missing requirements and apply again.",

        documents: documents

};

res.json({

    result:
    JSON.stringify(result)

});

}

catch (error) {

    console.log("Eligibility Error:", error);

    res.status(500).json({
        error: error.message
    });

}


});


/* ================= LIVE JOBS ROUTE ================= */

app.get("/jobs", async (req, res) => {

try {

const response = await fetch(

  "https://jsearch.p.rapidapi.com/search?query=jobs%20in%20Pakistan&page=1&num_pages=1",

  {
    method: "GET",

    headers: {

      "X-RapidAPI-Key":
      process.env.JSEARCH_API_KEY,

      "X-RapidAPI-Host":
      "jsearch.p.rapidapi.com"

    }
  }
);

const data =
await response.json();

res.json(data);

}

catch(error){

console.log(error);

res.status(500).json({
  error:error.message
});

}

});


app.post(
    "/analyze-cv",
    upload.single("cv"),
    async (req, res) => {

        try {

            let cvText = "";

            if (
                req.file.mimetype ===
                "application/pdf"
            ) {

                const dataBuffer =
                    fs.readFileSync(
                        req.file.path
                    );

                const pdfData =
                    await pdfParse(
                        dataBuffer
                    );

                cvText =
                    pdfData.text;

            }

            else if (
                req.file.mimetype.includes(
                    "word"
                )
            ) {

                const result =
                    await mammoth.extractRawText({
                        path:
                        req.file.path
                    });

                cvText =
                    result.value;

            }

            const response =
                await fetch(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                            `Bearer ${process.env.API_KEY}`,
                            "Content-Type":
                            "application/json"
                        },

                        body: JSON.stringify({

                            model:
                            "llama-3.3-70b-versatile",

                            messages: [

                                {
                                    role: "user",

                                    content: `

Analyze this CV.

CV:

${cvText}

Return ONLY JSON:

{
 "atsScore":85,
 "strengths":[
   "Strength 1"
 ],
 "weaknesses":[
   "Weakness 1"
 ],
 "skills":[
   "Skill 1"
 ],
 "careerAdvice":
 "Advice"
}

`
                                }
                            ]
                        })
                    }
                );

            const data =
                await response.json();

            const result =
                data.choices[0]
                .message.content;

            res.json({
                result
            });

        }

        catch(error){

            console.log(error);

            res.status(500).json({
                error:
                error.message
            });

        }

    }
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});