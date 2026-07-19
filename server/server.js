
const jobsRules = require("./jobs-rules");
require("dotenv").config();

const liveInterviewRouter =
    require("./live-interview");

const express = require("express");

const path = require("path");

const multer = require("multer");
const { PDFParse } = require("pdf-parse"); 
const mammoth = require("mammoth");

const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");
const { jsonrepair } = require("jsonrepair");
/*const fs = require("fs");*/


const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const upload = multer({
    storage: multer.memoryStorage()
});


const cors = require("cors");

const app = express();
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.APP_URL,
        "X-Title": "JobQuestAI"
    }
});

app.use(cors());
app.use(express.json());

/* ================= SERVE FRONTEND ================= */

const frontendPath =
    path.join(__dirname, "..");

app.use(
    express.static(frontendPath)
);

app.use(
    "/api/live-interview",
    liveInterviewRouter
);

/* ================= TEST ROUTE ================= */

/*app.get("/", (req, res) => {
  res.send("Server is working");
});*/

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

    console.log("GROQ RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

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

    console.log("========== ERROR ==========");
    console.error(error);
    console.log("===========================");

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
    
score = Math.max(0, score);

let eligibilityLevel = "";

if (score >= 85 && status === "Eligible") {
    eligibilityLevel = "Strong Candidate";
}
else if (score >= 60) {
    eligibilityLevel = "Near Eligible";
}
else {
    eligibilityLevel = "Needs Improvement";
}

const eligibilityBreakdown = [
    {
        title: "Age Requirement",
        status: missingRequirements.includes("Age Requirement") ? "Failed" : "Passed"
    },
    {
        title: "Qualification Requirement",
        status: missingRequirements.some(item => item.includes("Qualification")) ? "Failed" : "Passed"
    },
    {
        title: "Height Requirement",
        status: missingRequirements.some(item => item.includes("Height")) ? "Failed" : "Passed"
    },
    {
        title: "Computer Skills",
        status: missingRequirements.includes("Basic Computer Skills Required") ? "Failed" : "Passed"
    },
    {
        title: "Driving License",
        status: missingRequirements.includes("Valid Driving License Required") ? "Failed" : "Passed"
    }
];

let preparationRoadmap = [];

if (targetJob.toLowerCase().includes("police")) {
    preparationRoadmap = [
        "Prepare written test subjects including English, General Knowledge, Current Affairs and Pakistan Studies.",
        "Start physical preparation including running, push-ups and stamina training.",
        "Keep original CNIC, domicile and educational documents ready.",
        "Practice interview questions related to discipline, public service and law enforcement."
    ];
}
else if (targetJob.toLowerCase().includes("fia")) {
    preparationRoadmap = [
        "Prepare English, Analytical Reasoning, General Knowledge and Current Affairs.",
        "Study basic cyber crime, investigation and law-related concepts.",
        "Practice FPSC-style MCQs and past papers.",
        "Prepare professional interview answers related to investigation and public service."
    ];
}
else if (targetJob.toLowerCase().includes("css")) {
    preparationRoadmap = [
        "Start compulsory subjects preparation including Essay, Precis, Pakistan Affairs and Current Affairs.",
        "Read newspaper daily for national and international issues.",
        "Practice written answers with proper structure.",
        "Prepare optional subjects according to your academic background."
    ];
}
else {
    preparationRoadmap = [
        "Understand the official job advertisement carefully.",
        "Prepare test syllabus and past papers.",
        "Improve weak requirements before applying.",
        "Prepare documents and apply before deadline."
    ];
}

const applicationSteps = [
    "Read the official advertisement carefully.",
    "Check age, qualification, domicile and physical requirements.",
    "Prepare required documents.",
    "Apply through the official website or recruitment portal.",
    "Download roll number slip when available.",
    "Prepare for written test, physical test and interview."
];

const importantTips = [
    "Always verify requirements from the official advertisement.",
    "Do not apply with incorrect information.",
    "Keep documents scanned and updated.",
    "Prepare according to the exact syllabus.",
    "Apply before the last date."
];

const result = {

    status: status,

    eligibilityLevel: eligibilityLevel,

    score: score,

    analysis:
        status === "Eligible"
        ? `You meet the basic eligibility requirements for ${targetJob}.`
        : `You do not meet all requirements for ${targetJob}. Please review the missing requirements.`,

    missingRequirements: missingRequirements,

    eligibilityBreakdown: eligibilityBreakdown,

    recommendedJobs: recommendedJobs,

    careerGuidance:
        status === "Eligible"
        ? "You should now focus on test preparation, documents and interview preparation."
        : "Improve the missing requirements and consider recommended alternative jobs.",

    preparationRoadmap: preparationRoadmap,

    applicationSteps: applicationSteps,

    importantTips: importantTips,

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

            const targetRole =
                req.body.targetRole || "Frontend Developer";

            if (!req.file) {
                return res.status(400).json({
                    error: "No CV file uploaded"
                });
            }

            let cvText = "";

            if (
                req.file.mimetype.includes("word") ||
                req.file.originalname.endsWith(".docx")
            ) {

                const result =
                    await mammoth.extractRawText({
                        buffer: req.file.buffer
                    });

                cvText = result.value;

            } else if (
                req.file.mimetype.includes("pdf") ||
                req.file.originalname.endsWith(".pdf")
            ) {

                const parser =
                    new PDFParse({
                        data: req.file.buffer
                    });

                const pdfData =
                    await parser.getText();

                cvText = pdfData.text;

                await parser.destroy();

            } else {

                return res.status(400).json({
                    error: "Only PDF and DOCX files are supported"
                });

            }

            if (!cvText || cvText.trim().length < 30) {
                return res.status(400).json({
                    error: "CV text could not be extracted properly"
                });
            }

            const aiResponse =
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

                            temperature: 0.2,

                            messages: [
                                {
                                    role: "user",

                                    content: `
You are a professional ATS resume analyzer and career advisor.

Analyze this CV for the target role:
${targetRole}

CV Content:
${cvText}

Return ONLY valid JSON.
No markdown.
No extra text.

Required JSON format:

{
  "atsScore": 0,
  "jobMatchScore": 0,
  "jobMatch": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "skills": [],
  "missingSkills": [],
  "recommendedKeywords": [],
  "recommendedJobs": [],
  "sectionScores": {
    "education": 0,
    "skills": 0,
    "experience": 0,
    "projects": 0,
    "formatting": 0
  },
  "careerAdvice": ""
}

Rules:
- Analyze only the uploaded CV content.
- Give realistic ATS score from 0 to 100.
- Give realistic jobMatchScore from 0 to 100.
- Compare CV with the target role.
- Strengths must come from actual CV content.
- Weaknesses must be based on missing or weak areas.
- Skills must be extracted from CV.
- Missing skills must be role-specific.
- Recommended keywords must help ATS ranking.
- Recommended jobs must match candidate profile.
- Career advice must be practical and professional.
`
                                }
                            ]
                        })
                    }
                );

            const aiData =
                await aiResponse.json();

            if (aiData.error || !aiData.choices) {
                return res.status(500).json({
                    error:
                        aiData.error?.message ||
                        "AI CV analysis failed"
                });
            }

            let resultText =
                aiData.choices[0].message.content
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            const firstBrace =
                resultText.indexOf("{");

            const lastBrace =
                resultText.lastIndexOf("}");

            if (firstBrace === -1 || lastBrace === -1) {
                return res.status(500).json({
                    error: "AI did not return valid JSON"
                });
            }

            resultText =
                resultText.substring(
                    firstBrace,
                    lastBrace + 1
                );

            let finalResult;

            try {
                finalResult =
                    JSON.parse(resultText);
            } catch (parseError) {
                console.log("JSON PARSE ERROR:");
                console.log(resultText);

                return res.status(500).json({
                    error: "AI response JSON was incomplete. Please try again with a clearer image."
                });
            }

            res.json(finalResult);

        } catch (error) {

            console.log("CV ROUTE ERROR:");
            console.log(error.message);

            res.status(500).json({
                error: error.message
            });

        }

    }
);

app.post("/generate-cover-letter", async (req, res) => {
    try {
        const { targetRole, report } = req.body;

        if (!report) {
            return res.status(400).json({
                error: "CV report data is missing"
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.4,

                    messages: [
                        {
                            role: "user",

                            content: `
You are a professional career advisor and cover letter writer.

Write a professional cover letter for the following target role:

Target Role:
${targetRole}

Candidate CV Analysis Report:
ATS Score: ${report.atsScore}
Job Match Score: ${report.jobMatchScore}

Summary:
${report.summary}

Strengths:
${(report.strengths || []).join(", ")}

Skills:
${(report.skills || []).join(", ")}

Missing Skills:
${(report.missingSkills || []).join(", ")}

Career Advice:
${report.careerAdvice}

Instructions:
- Write in professional English.
- Make it suitable for job application.
- Keep it 250 to 350 words.
- Do not mention ATS score directly.
- Highlight candidate strengths.
- Match the cover letter with the target role.
- Do not include fake company name.
- Start with "Dear Hiring Manager,"
- End with "Sincerely,"
`
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error || !data.choices) {
            return res.status(500).json({
                error:
                    data.error?.message ||
                    "Cover letter generation failed"
            });
        }

        const coverLetter =
            data.choices[0].message.content.trim();

        res.json({
            coverLetter: coverLetter
        });

    } catch (error) {

        console.log("COVER LETTER ERROR:");
        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }
});

app.post("/rewrite-resume", async (req, res) => {
    try {
        const { targetRole, report } = req.body;

        if (!report) {
            return res.status(400).json({
                error: "CV report data is missing"
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,

                    messages: [
                        {
                            role: "user",

                            content: `
You are a professional ATS resume writer.

Create an improved ATS-friendly resume draft for this target role:

Target Role:
${targetRole}

Candidate CV Analysis Report:

Summary:
${report.summary}

Strengths:
${(report.strengths || []).join(", ")}

Skills:
${(report.skills || []).join(", ")}

Weaknesses:
${(report.weaknesses || []).join(", ")}

Missing Skills:
${(report.missingSkills || []).join(", ")}

Recommended Keywords:
${(report.recommendedKeywords || []).join(", ")}

Career Advice:
${report.careerAdvice}

Return ONLY clean resume text.
Do not return JSON.
Do not use markdown symbols.
Do not invent fake degrees, companies, or experience.
Use only available information from the report.
Make it professional, concise, and ATS-friendly.

Resume format:
Professional Summary
Skills
Projects / Experience Suggestions
Education
Recommended Improvements
`
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error || !data.choices) {
            return res.status(500).json({
                error:
                    data.error?.message ||
                    "Resume rewrite failed"
            });
        }

        const improvedResume =
            data.choices[0].message.content.trim();

        res.json({
            improvedResume
        });

    } catch (error) {
        console.log("RESUME REWRITE ERROR:");
        console.log(error.message);

        res.status(500).json({
            error: error.message
        });
    }
});
 

app.post(
    "/analyze-advertisement",
    upload.single("adFile"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    error: "No advertisement file uploaded"
                });
            }

            const fileName =
                req.file.originalname.toLowerCase();

            const mimeType =
                req.file.mimetype;

            let response;

            const prompt = `
You are JobQuestAI Advertisement Intelligence Engine.

Your task is to read a Pakistani job advertisement and extract detailed structured data.

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

Required JSON schema:

{
  "relevanceScore": 0,
  "difficultyLevel": "Medium",
  "organization": "",
  "advertisementTitle": "",
  "advertisementNo": "",
  "publishedDate": "",
  "lastDate": "",
  "website": "",
  "email": "",
  "phone": "",
  "fee": "",
  "address": "",
  "availableJobs": [
    {
      "jobTitle": "",
      "bpsScale": "",
      "posts": "",
      "qualification": "",
      "experience": "",
      "ageLimit": "",
      "gender": "",
      "domicile": ""
    }
  ],
  "requiredDocuments": [],
  "applicationProcess": [],
  "importantInstructions": [],
  "testPattern": [],
  "careerAdvice": ""
}

Extraction Rules:
- Extract ALL visible job posts separately.
- Never merge multiple jobs into one jobTitle.
- If the advertisement has a table, read every row as a separate job.
- Try to extract 3 to 15 jobs if visible.
- For each job, extract BPS/scale, number of posts, qualification, experience, age, gender and domicile if visible.
- Extract last date, website, fee, address, phone and email if visible.
- If a value is not visible, write "Not mentioned".
- Arrays must not be empty.
- requiredDocuments should include CNIC, domicile, degrees, experience certificates, photographs, NOC if mentioned or likely required.
- applicationProcess should explain how to apply in short steps.
- importantInstructions should include deadline, incomplete application, NOC, fee, original documents, shortlisting or test/interview instructions if visible.
- testPattern should include written test, interview, skill test, physical test or "Not mentioned".
- careerAdvice should be useful and under 60 words.
- Keep text short but meaningful.
- All string values must be inside double quotes.
- Do not use line breaks inside JSON string values.
`;

            if (
                mimeType.includes("image") ||
                fileName.endsWith(".jpg") ||
                fileName.endsWith(".jpeg") ||
                fileName.endsWith(".png")
            ) {

                const base64Image =
                    req.file.buffer.toString("base64");

                response =
                    await openrouter.chat.completions.create({
                        model: "qwen/qwen2.5-vl-72b-instruct",
                        max_tokens: 3000,
                        temperature: 0.1,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: prompt
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url:
                                                `data:${mimeType};base64,${base64Image}`
                                        }
                                    }
                                ]
                            }
                        ]
                    });

            }

            else if (
                mimeType.includes("word") ||
                fileName.endsWith(".docx")
            ) {

                const result =
                    await mammoth.extractRawText({
                        buffer: req.file.buffer
                    });

                const docText =
                    result.value;

                response =
                    await openrouter.chat.completions.create({
                        model: "qwen/qwen2.5-vl-72b-instruct",
                        max_tokens: 2500,
                        temperature: 0.1,
                        messages: [
                            {
                                role: "user",
                                content:
                                    `${prompt}\n\nAdvertisement Text:\n${docText}`
                            }
                        ]
                    });

            }

            else if (
                mimeType.includes("pdf") ||
                fileName.endsWith(".pdf")
            ) {

                const parser =
                    new PDFParse({
                        data: req.file.buffer
                    });

                const pdfData =
                    await parser.getText();

                const pdfText =
                    pdfData.text;

                await parser.destroy();

                if (!pdfText || pdfText.trim().length < 30) {
                    return res.status(400).json({
                        error:
                            "This PDF looks scanned. Please upload a clear JPG/PNG image of the advertisement."
                    });
                }

                response =
                    await openrouter.chat.completions.create({
                        model: "qwen/qwen2.5-vl-72b-instruct",
                        max_tokens: 2500,
                        temperature: 0.1,
                        messages: [
                            {
                                role: "user",
                                content:
                                    `${prompt}\n\nAdvertisement Text:\n${pdfText}`
                            }
                        ]
                    });

            }

            else {

                return res.status(400).json({
                    error:
                        "Only PDF, DOCX, JPG, JPEG and PNG files are supported"
                });

            }

            let resultText =
                response.choices[0].message.content
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            const firstBrace =
                resultText.indexOf("{");

            const lastBrace =
                resultText.lastIndexOf("}");

            if (firstBrace !== -1 && lastBrace !== -1) {
                resultText =
                    resultText.substring(
                        firstBrace,
                        lastBrace + 1
                    );
            }

            let finalResult;

            try {

                const repairedJson =
                    jsonrepair(resultText);

                finalResult =
                    JSON.parse(repairedJson);

            } catch (parseError) {

                console.log("RAW AI RESPONSE:");
                console.log(resultText);

                return res.status(500).json({
                    error:
                        "AI response format issue. Please try again with a clearer advertisement."
                });

            }

            if (!finalResult.availableJobs) {
                finalResult.availableJobs = [];
            }

            if (!finalResult.requiredDocuments || finalResult.requiredDocuments.length === 0) {
                finalResult.requiredDocuments = [
                    "CNIC",
                    "Domicile",
                    "Educational Certificates",
                    "Experience Certificates if required",
                    "Recent Photographs"
                ];
            }

            if (!finalResult.applicationProcess || finalResult.applicationProcess.length === 0) {
                finalResult.applicationProcess = [
                    "Read the advertisement carefully",
                    "Prepare required documents",
                    "Submit application before the last date"
                ];
            }

            if (!finalResult.importantInstructions || finalResult.importantInstructions.length === 0) {
                finalResult.importantInstructions = [
                    "Apply before deadline",
                    "Incomplete applications may be rejected",
                    "Bring original documents for interview"
                ];
            }

            if (!finalResult.testPattern || finalResult.testPattern.length === 0) {
                finalResult.testPattern = [
                    "Written test or interview details are not clearly mentioned"
                ];
            }

            res.json(finalResult);

        } catch (error) {

            console.log("OPENROUTER AD ANALYZER ERROR:");
            console.log(error);

            res.status(500).json({
                error:
                    error.message ||
                    "Advertisement analysis failed"
            });

        }

    }
);

app.post("/generate-study-plan", async (req, res) => {

    try {

        const {
            studyTarget,
            studyDuration,
            dailyHours,
            prepLevel,
            weakTopics
        } = req.body;

        if (!studyTarget) {
            return res.status(400).json({
                error: "Target exam or job is required"
            });
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

                        temperature:
                            0.3,

                        messages: [
                            {
                                role: "user",

                                content: `
You are JobQuestAI Professional Study Planning Engine.

Create a realistic, personalized exam preparation plan.

User Details:
Target Exam / Job: ${studyTarget}
Preparation Duration: ${studyDuration}
Daily Study Hours: ${dailyHours}
Preparation Level: ${prepLevel}
Weak Topics: ${weakTopics || "Not mentioned"}

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

Required JSON:

{
  "target": "",
  "examCategory": "",
  "summary": "",
  "difficultyLevel": "",
  "difficultyReason": "",
  "successProbability": "",
  "successReason": "",
  "dailyRoutine": [],
  "weeklyPlan": [
    {
      "week": "",
      "focus": "",
      "tasks": []
    }
  ],
  "recommendedResources": [],
  "practiceTasks": [],
  "milestones": [],
  "revisionStrategy": [],
  "mockTestPlan": [],
  "weakTopicStrategy": [],
  "advice": ""
}

Professional Rules:
- successProbability must NOT always be 70%.
- Calculate successProbability based on preparation duration, daily study hours, preparation level and weak topics.
- Beginner + short duration = lower probability.
- Advanced + long duration + more hours = higher probability.
- CSS/PMS/FPSC should be harder than simple police/clerical tests.
- successProbability must be realistic between 35% and 90%.
- difficultyLevel must be Easy, Medium, Hard, or Very Hard.
- Create weeklyPlan according to duration:
  15 Days = 2 weeks
  30 Days = 4 weeks
  45 Days = 6 weeks
  60 Days = 8 weeks
  90 Days = 12 weeks
- Each week must have focus and 3 to 5 tasks.
- dailyRoutine must match daily study hours.
- weakTopicStrategy must specifically address weak topics.
- mockTestPlan must include test frequency.
- milestones must include measurable goals.
- revisionStrategy must include daily and weekly revision.
- Keep all points short, practical and professional.
- First classify target into one category:
  government_job_test, competitive_exam, technical_skill, language_test, academic_test, unknown.
- difficultyLevel must be Easy, Medium, Hard, or Very Hard.
- difficultyReason must explain why this difficulty was selected.
- successProbability must be realistic and based on:
  target type, preparation duration, daily study hours, preparation level, and weak topics.
- successReason must explain why this probability was selected.
- Do not use same successProbability for every user.
- Do not overrate beginner users.
- Do not underrate easy tests with long preparation time.
`
                            }
                        ]
                    })
                }
            );

        const data =
            await response.json();

        if (data.error || !data.choices) {
            return res.status(500).json({
                error:
                    data.error?.message ||
                    "Study plan generation failed"
            });
        }

        let resultText =
            data.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        const firstBrace =
            resultText.indexOf("{");

        const lastBrace =
            resultText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
            resultText =
                resultText.substring(
                    firstBrace,
                    lastBrace + 1
                );
        }

        let finalResult;

        try {

            const repairedJson =
                jsonrepair(resultText);

            finalResult =
                JSON.parse(repairedJson);

        } catch (parseError) {

            console.log("STUDY PLAN RAW RESPONSE:");
            console.log(resultText);

            return res.status(500).json({
                error:
                    "AI response format issue. Please try again."
            });

        }

        res.json(finalResult);

    } catch (error) {

        console.log("STUDY PLAN ERROR:");
        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});

app.post("/generate-interview-prep", async (req, res) => {

    try {

        const {
            interviewRole,
            interviewType,
            interviewExperience,
            interviewLanguage,
            candidateBackground
        } = req.body;

        if (!interviewRole) {
            return res.status(400).json({
                error: "Target job or role is required"
            });
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

                        temperature:
                            0.3,

                        messages: [
                            {
                                role: "user",

                                content: `
You are JobQuestAI Professional Interview Coach.

Create a personalized interview preparation report.

Candidate Details:
Target Role: ${interviewRole}
Interview Type: ${interviewType}
Experience Level: ${interviewExperience}
Preferred Language: ${interviewLanguage}
Candidate Background: ${candidateBackground || "Not mentioned"}

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

Required JSON:

{
  "targetRole": "",
  "summary": "",
  "confidenceScore": "",
  "difficultyLevel": "",
  "strategy": "",
  "questions": [
    {
      "question": "",
      "answer": "",
      "followUp": ""
    }
  ],
  "hrTips": [],
  "commonMistakes": [],
  "documentsToCarry": [],
  "finalChecklist": [],
  "finalFeedback": ""
}

Professional Rules:
- Generate 20 interview questions.
- Questions must match target role and interview type.
- Answers must be professional, realistic and candidate-friendly.
- For government jobs, include discipline, public service, honesty and job knowledge.
- For technical roles, include technical, project-based and problem-solving questions.
- For HR interviews, include introduction, strengths, weaknesses, teamwork and career goals.
- Confidence score must be realistic between 40% and 95%.
- Beginner/fresh candidates should not get overestimated.
- difficultyLevel must be Easy, Medium, Hard or Very Hard.
- Use preferred language style.
- Keep answers clear and practical.
- Do not invent fake experience.
`
                            }
                        ]
                    })
                }
            );

        const data =
            await response.json();

        if (data.error || !data.choices) {
            return res.status(500).json({
                error:
                    data.error?.message ||
                    "Interview preparation failed"
            });
        }

        let resultText =
            data.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        const firstBrace =
            resultText.indexOf("{");

        const lastBrace =
            resultText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
            resultText =
                resultText.substring(
                    firstBrace,
                    lastBrace + 1
                );
        }

        let finalResult;

        try {

            const repairedJson =
                jsonrepair(resultText);

            finalResult =
                JSON.parse(repairedJson);

        } catch (parseError) {

            console.log("INTERVIEW RAW RESPONSE:");
            console.log(resultText);

            return res.status(500).json({
                error:
                    "AI response format issue. Please try again."
            });

        }

        res.json(finalResult);

    } catch (error) {

        console.log("INTERVIEW PREP ERROR:");
        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});

app.post("/generate-career-roadmap", async (req, res) => {

    try {

        const {
            careerEducation,
            careerField,
            careerCgpa,
            careerExperience,
            careerSkills,
            careerGoal,
            careerCountry,
            careerTimeline,
            careerPreference
        } = req.body;

        if (!careerEducation || !careerGoal) {
            return res.status(400).json({
                error: "Education and career goal are required"
            });
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

                        temperature:
                            0.3,

                        messages: [
                            {
                                role: "user",

                                content: `
You are JobQuestAI Professional Career Roadmap Engine.

Create a complete, realistic and professional career roadmap.

Candidate Details:

Current Education:
${careerEducation}

Degree / Field:
${careerField || "Not mentioned"}

CGPA / Percentage:
${careerCgpa || "Not mentioned"}

Experience Level:
${careerExperience}

Current Skills:
${careerSkills || "Not mentioned"}

Career Goal / Dream Job:
${careerGoal}

Target Country:
${careerCountry || "Not mentioned"}

Timeline:
${careerTimeline}

Work Preference:
${careerPreference}

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

Required JSON:

{
  "careerGoal": "",
  "summary": "",
  "readinessScore": "",
  "marketDemand": "",
  "timelineDifficulty": "",
  "currentLevelAnalysis": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "certifications": [],
  "roadmap": [
    {
      "phase": "",
      "focus": "",
      "tasks": []
    }
  ],
  "projects": [],
  "jobStrategy": [],
  "salaryEstimate": "",
  "weeklyActions": [],
  "finalAdvice": ""
}

Professional Rules:

- Analyze candidate according to education, skills, experience and target role.
- Do not give fake claims.
- Do not assume advanced skills if not mentioned.
- readinessScore must be realistic between 20% and 95%.
- marketDemand must be Low, Medium, High or Very High.
- timelineDifficulty must be Easy, Medium, Hard or Very Hard.
- currentLevelAnalysis must explain current career position clearly.
- strengths must be based on provided education, skills or experience.
- weaknesses must be realistic.
- missingSkills must be role-specific.
- certifications must be practical and relevant.
- roadmap must match selected timeline:
  3 Months = 3 phases
  6 Months = 6 phases
  12 Months = 6 to 8 phases
  24 Months = 8 to 10 phases
- Each roadmap phase must contain 3 to 5 tasks.
- projects must be practical portfolio or field projects.
- jobStrategy must include job search, networking, portfolio, LinkedIn, CV and interview preparation.
- salaryEstimate must be realistic for target country if possible.
- weeklyActions must contain 4 to 8 practical weekly actions.
- finalAdvice must be professional and motivational.
- Keep all points concise but useful.
`
                            }
                        ]
                    })
                }
            );

        const data =
            await response.json();

        if (data.error || !data.choices) {
            return res.status(500).json({
                error:
                    data.error?.message ||
                    "Career roadmap generation failed"
            });
        }

        let resultText =
            data.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        const firstBrace =
            resultText.indexOf("{");

        const lastBrace =
            resultText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
            resultText =
                resultText.substring(
                    firstBrace,
                    lastBrace + 1
                );
        }

        let finalResult;

        try {

            const repairedJson =
                jsonrepair(resultText);

            finalResult =
                JSON.parse(repairedJson);

        } catch (parseError) {

            console.log("CAREER ROADMAP RAW RESPONSE:");
            console.log(resultText);

            return res.status(500).json({
                error:
                    "AI response format issue. Please try again."
            });

        }

        if (!finalResult.strengths || finalResult.strengths.length === 0) {
            finalResult.strengths = [
                "Clear career goal",
                "Willingness to improve skills"
            ];
        }

        if (!finalResult.weaknesses || finalResult.weaknesses.length === 0) {
            finalResult.weaknesses = [
                "Need more practical experience",
                "Need stronger role-specific portfolio"
            ];
        }

        if (!finalResult.missingSkills || finalResult.missingSkills.length === 0) {
            finalResult.missingSkills = [
                "Role-specific technical skills",
                "Interview preparation",
                "Professional portfolio"
            ];
        }

        if (!finalResult.certifications || finalResult.certifications.length === 0) {
            finalResult.certifications = [
                "Relevant online certification",
                "Portfolio-based learning certificate"
            ];
        }

        if (!finalResult.roadmap || finalResult.roadmap.length === 0) {
            finalResult.roadmap = [
                {
                    phase: "Phase 1",
                    focus: "Foundation Building",
                    tasks: [
                        "Revise core concepts",
                        "Improve missing skills",
                        "Create learning schedule"
                    ]
                },
                {
                    phase: "Phase 2",
                    focus: "Practical Projects",
                    tasks: [
                        "Build portfolio project",
                        "Upload work on GitHub",
                        "Improve CV and LinkedIn"
                    ]
                },
                {
                    phase: "Phase 3",
                    focus: "Job Applications",
                    tasks: [
                        "Apply to relevant jobs",
                        "Prepare interview answers",
                        "Track applications weekly"
                    ]
                }
            ];
        }

        if (!finalResult.projects || finalResult.projects.length === 0) {
            finalResult.projects = [
                "Portfolio website",
                "Role-specific practical project",
                "Case study project"
            ];
        }

        if (!finalResult.jobStrategy || finalResult.jobStrategy.length === 0) {
            finalResult.jobStrategy = [
                "Build a professional CV",
                "Improve LinkedIn profile",
                "Apply to relevant jobs weekly",
                "Prepare for interviews"
            ];
        }

        if (!finalResult.weeklyActions || finalResult.weeklyActions.length === 0) {
            finalResult.weeklyActions = [
                "Learn one key skill",
                "Practice one project task",
                "Update portfolio",
                "Apply to jobs"
            ];
        }

        res.json(finalResult);

    } catch (error) {

        console.log("CAREER ROADMAP ERROR:");
        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});

/* ================= FRONTEND ROUTES ================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );

});

app.get("*", (req, res, next) => {

    if (
        req.path.startsWith("/generate") ||
        req.path.startsWith("/eligibility") ||
        req.path.startsWith("/jobs") ||
        req.path.startsWith("/analyze-cv") ||
        req.path.startsWith("/api/")
    ) {

        return next();

    }

    const requestedFile =
        path.join(
            frontendPath,
            req.path
        );

    res.sendFile(
        requestedFile,
        function (error) {

            if (error) {

                res.sendFile(
                    path.join(
                        frontendPath,
                        "index.html"
                    )
                );

            }

        }
    );

});

/*app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
}); */

const PORT =
    process.env.PORT || 3000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);