"use strict";

/* =========================================================
   JOBQUESTAI - LIVE AI RECRUITER BACKEND MODULE

   Responsibilities:
   - Validate interview setup
   - Accept optional PDF/DOCX CV
   - Extract CV text safely
   - Create Gemini Live ephemeral token
   - Build professional recruiter instructions
   - Generate evidence-based interview report
   - Reject empty or incomplete interview reports
========================================================= */

const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const { jsonrepair } = require("jsonrepair");

const router = express.Router();


/* =========================================================
   CONFIGURATION
========================================================= */

const GEMINI_LIVE_MODEL =
    process.env.GEMINI_LIVE_MODEL ||
    "gemini-3.1-flash-live-preview";

const GROQ_MODEL =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";

const MAX_CV_FILE_SIZE =
    5 * 1024 * 1024;

const MAX_CV_TEXT_LENGTH =
    14000;

const MIN_REPORT_ANSWERS =
    2;

const MIN_REPORT_DURATION_SECONDS =
    30;


/* =========================================================
   INTERVIEW CV UPLOADER
========================================================= */

const interviewUpload = multer({

    storage:
        multer.memoryStorage(),

    limits: {

        fileSize:
            MAX_CV_FILE_SIZE,

        files:
            1

    },

    fileFilter: function (
        req,
        file,
        callback
    ) {

        const fileName =
            String(
                file.originalname || ""
            ).toLowerCase();

        const mimeType =
            String(
                file.mimetype || ""
            ).toLowerCase();

        const isPdf =
            mimeType === "application/pdf" ||
            fileName.endsWith(".pdf");

        const isDocx =
            mimeType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileName.endsWith(".docx");

        if (!isPdf && !isDocx) {

            const error =
                new Error(
                    "Only PDF and DOCX CV files are supported."
                );

            error.code =
                "INVALID_CV_TYPE";

            return callback(
                error,
                false
            );

        }

        callback(
            null,
            true
        );

    }

});


/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

function handleInterviewUpload(
    req,
    res,
    next
) {

    interviewUpload.single("cv")(
        req,
        res,
        function (error) {

            if (!error) {

                next();

                return;

            }

            if (
                error instanceof
                multer.MulterError
            ) {

                if (
                    error.code ===
                    "LIMIT_FILE_SIZE"
                ) {

                    return res
                        .status(400)
                        .json({

                            success:
                                false,

                            error:
                                "CV file must be 5 MB or smaller.",

                            code:
                                "CV_FILE_TOO_LARGE"

                        });

                }

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        error:
                            error.message ||
                            "CV upload failed.",

                        code:
                            error.code ||
                            "CV_UPLOAD_ERROR"

                    });

            }

            return res
                .status(400)
                .json({

                    success:
                        false,

                    error:
                        error.message ||
                        "CV upload failed.",

                    code:
                        error.code ||
                        "CV_UPLOAD_ERROR"

                });

        }
    );

}


/* =========================================================
   BASIC TEXT HELPERS
========================================================= */

function cleanText(
    value,
    maximumLength = 2000
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }

    return String(value)
        .replace(/\0/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(
            0,
            maximumLength
        );

}


function cleanSingleLine(
    value,
    maximumLength = 200
) {

    return cleanText(
        value,
        maximumLength
    )
        .replace(/\s*\n\s*/g, " ")
        .trim();

}


function clampInteger(
    value,
    minimum,
    maximum,
    fallback
) {

    const number =
        Number.parseInt(
            value,
            10
        );

    if (!Number.isFinite(number)) {

        return fallback;

    }

    return Math.min(
        maximum,
        Math.max(
            minimum,
            number
        )
    );

}


/* =========================================================
   NORMALIZATION
========================================================= */

function normalizeLanguage(value) {

    const language =
        cleanSingleLine(
            value,
            60
        ).toLowerCase();

    if (language === "urdu") {

        return "Urdu";

    }

    if (
        language.includes("mix") ||
        (
            language.includes("english") &&
            language.includes("urdu")
        )
    ) {

        return "English + Urdu Mix";

    }

    return "English";

}


function normalizeInterviewType(value) {

    const provided =
        cleanSingleLine(
            value,
            100
        );

    const allowedTypes =
        new Set([
            "HR Interview",
            "Technical Interview",
            "Behavioral Interview",
            "Government Job Interview",
            "Mixed Interview"
        ]);

    return allowedTypes.has(provided)
        ? provided
        : "Mixed Interview";

}


function normalizeExperienceLevel(value) {

    const provided =
        cleanSingleLine(
            value,
            100
        );

    const allowedLevels =
        new Set([
            "Student",
            "Fresh Graduate",
            "Internship Level",
            "Junior Level",
            "Mid Level",
            "Senior Level",
            "1-2 Years Experience",
            "3+ Years Experience"
        ]);

    return allowedLevels.has(provided)
        ? provided
        : "Fresh Graduate";

}


/* =========================================================
   SETUP VALIDATION
========================================================= */

function validateInterviewSetup(body = {}) {

    const candidateName =
        cleanSingleLine(
            body.candidateName,
            100
        );

    const targetJob =
        cleanSingleLine(
            body.targetJob,
            160
        );

    const candidateBackground =
        cleanText(
            body.candidateBackground,
            3500
        );

    if (
        !candidateName ||
        candidateName.length < 2
    ) {

        const error =
            new Error(
                "Please enter a valid candidate name."
            );

        error.statusCode =
            400;

        error.code =
            "INVALID_CANDIDATE_NAME";

        throw error;

    }

    if (
        !targetJob ||
        targetJob.length < 2
    ) {

        const error =
            new Error(
                "Please enter a valid target job or role."
            );

        error.statusCode =
            400;

        error.code =
            "INVALID_TARGET_JOB";

        throw error;

    }

    return {

        candidateName,

        targetJob,

        interviewType:
            normalizeInterviewType(
                body.interviewType
            ),

        experienceLevel:
            normalizeExperienceLevel(
                body.experienceLevel
            ),

        interviewLanguage:
            normalizeLanguage(
                body.interviewLanguage
            ),

        questionCount:
            clampInteger(
                body.questionCount,
                3,
                15,
                5
            ),

        candidateBackground

    };

}


/* =========================================================
   CV EXTRACTION
========================================================= */

async function extractPdfText(buffer) {

    const parser =
        new PDFParse({
            data:
                buffer
        });

    try {

        const result =
            await parser.getText();

        return cleanText(
            result?.text || "",
            MAX_CV_TEXT_LENGTH
        );

    } finally {

        await parser.destroy();

    }

}


async function extractDocxText(buffer) {

    const result =
        await mammoth.extractRawText({

            buffer

        });

    return cleanText(
        result?.value || "",
        MAX_CV_TEXT_LENGTH
    );

}


async function extractCvText(file) {

    if (!file) {

        return "";

    }

    const fileName =
        String(
            file.originalname || ""
        ).toLowerCase();

    const mimeType =
        String(
            file.mimetype || ""
        ).toLowerCase();

    let cvText = "";

    if (
        mimeType === "application/pdf" ||
        fileName.endsWith(".pdf")
    ) {

        cvText =
            await extractPdfText(
                file.buffer
            );

    } else if (
        mimeType.includes(
            "wordprocessingml.document"
        ) ||
        fileName.endsWith(".docx")
    ) {

        cvText =
            await extractDocxText(
                file.buffer
            );

    }

    if (
        !cvText ||
        cvText.length < 30
    ) {

        const error =
            new Error(
                "CV text could not be extracted. Upload a clear text-based PDF or DOCX file."
            );

        error.statusCode =
            400;

        error.code =
            "CV_EXTRACTION_FAILED";

        throw error;

    }

    return cvText;

}


/* =========================================================
   LANGUAGE INSTRUCTIONS
========================================================= */

function buildLanguageInstructions(language) {

    if (language === "Urdu") {

        return `
Speak in natural and clear Pakistani Urdu.

Use simple Urdu that a Pakistani candidate can easily understand.

Keep common technical and professional terms in English where
translating them would sound unnatural.

Do not use overly literary or difficult Urdu.
`.trim();

    }

    if (language === "English + Urdu Mix") {

        return `
Speak in a natural professional Pakistani English-Urdu mix.

Use English for technical terms, job titles and professional terminology.

Use Urdu naturally for conversational transitions.

Do not switch language mechanically after every sentence.
`.trim();

    }

    return `
Speak in clear professional English.

Use vocabulary suitable for the candidate's stated experience level.

Keep questions concise and easy to understand.
`.trim();

}


/* =========================================================
   RECRUITER SYSTEM INSTRUCTIONS
========================================================= */

function buildRecruiterInstructions(
    profile,
    cvText = ""
) {

    const candidateName =
        String(
            profile?.candidateName ||
            "Candidate"
        ).trim();

    const targetJob =
        String(
            profile?.targetJob ||
            "Selected Role"
        ).trim();

    const interviewType =
        String(
            profile?.interviewType ||
            "Mixed Interview"
        ).trim();

    const experienceLevel =
        String(
            profile?.experienceLevel ||
            "Fresh Graduate"
        ).trim();

    const interviewLanguage =
        String(
            profile?.interviewLanguage ||
            "English"
        ).trim();

    const candidateBackground =
        String(
            profile?.candidateBackground ||
            ""
        ).trim();

    const questionCount =
        Math.max(
            3,
            Math.min(
                10,
                Number.parseInt(
                    profile?.questionCount,
                    10
                ) || 5
            )
        );

    /*
     * Keep enough resume text for accurate grounding,
     * while preventing extremely large documents from
     * overwhelming the live interview instructions.
     */
    const cleanedCvText =
        String(cvText || "")
            .replace(/\0/g, "")
            .replace(/\r\n/g, "\n")
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim()
            .slice(0, 18000);

    const hasUploadedCv =
        cleanedCvText.length > 0;

    const backgroundSection =
        candidateBackground
            ? candidateBackground
            : "No additional background was provided.";

    const cvSection =
        hasUploadedCv
            ? cleanedCvText
            : "No CV or resume was uploaded.";

    return `
You are the JobQuestAI Live AI Recruiter.

You are conducting a realistic, professional, voice-first mock interview.

==================================================
CANDIDATE INTERVIEW PROFILE
==================================================

Candidate Name:
${candidateName}

Target Job:
${targetJob}

Interview Type:
${interviewType}

Experience Level:
${experienceLevel}

Interview Language:
${interviewLanguage}

Planned Main Questions:
${questionCount}

Candidate Background Provided in Form:
${backgroundSection}

==================================================
UPLOADED CV / RESUME CONTENT
==================================================

CV Uploaded:
${hasUploadedCv ? "Yes" : "No"}

BEGIN CV CONTENT

${cvSection}

END CV CONTENT

==================================================
CRITICAL GROUNDING RULES
==================================================

1. The candidate profile and CV content above are your source of truth.

2. Before asking questions, carefully read and understand:
   - candidate name;
   - target role;
   - education;
   - skills;
   - projects;
   - employment or internship experience;
   - certifications;
   - achievements;
   - any other relevant information contained in the uploaded CV.

3. When a CV is uploaded, ask relevant questions based on its actual content.

4. Refer to specific information from the CV naturally. Examples:
   - "I noticed that you worked on..."
   - "Your CV mentions..."
   - "You listed experience in..."
   - "Can you explain the project named..."

5. Never claim that you read, reviewed or noticed something that is not actually present in the supplied CV content.

6. Never invent:
   - projects;
   - skills;
   - education;
   - experience;
   - companies;
   - certifications;
   - achievements;
   - responsibilities.

7. If the candidate asks what is written in the CV, answer only from the supplied CV content.

8. If requested information is not present in the CV, clearly say:
   "That information is not mentioned in the uploaded CV."

9. If no CV is uploaded, do not say that you reviewed one. Use only the candidate background and interview profile.

10. The uploaded document may occasionally be something other than a traditional CV. If so:
    - identify the document from its content;
    - do not pretend it is a resume;
    - use only professionally relevant information found in it;
    - do not invent missing CV sections.

11. If the candidate asks you a direct question about the uploaded CV,
    pause the interview flow and answer that question clearly from the
    supplied CV content before continuing.

12. When answering a CV-related question:
    - provide the exact relevant information found in the document;
    - mention the relevant project, skill, education or experience;
    - do not give a vague answer;
    - do not say that you cannot access the CV when CV Uploaded is "Yes".

13. Before beginning the main interview questions, silently identify:
    - the candidate's name;
    - highest education;
    - most relevant skills;
    - most relevant project;
    - employment or internship experience.

14. Use these identified CV facts throughout the interview, but never
    read the entire CV aloud.

==================================================
INTERVIEW BEHAVIOUR
==================================================

1. Speak naturally like a professional human recruiter.

2. Address the candidate as "${candidateName}".

3. Conduct the interview for the target position:
   "${targetJob}".

4. Match the question difficulty to:
   "${experienceLevel}".

5. Conduct the interview in:
   "${interviewLanguage}".

6. Ask only one question at a time.

7. Wait for the candidate's spoken response before continuing.

8. Listen carefully to each answer.

9. Ask a relevant follow-up question when the answer contains:
   - an important project;
   - a technical decision;
   - a challenge;
   - an achievement;
   - an unclear claim;
   - relevant experience.

10. Do not repeat a question that has already been answered.

11. Do not turn the interview into a lecture.

12. Keep each spoken response concise and conversational.

13. Do not provide the candidate with the ideal answer during the interview.

14. Do not reveal scores or detailed feedback before the interview ends.

15. Remain respectful, neutral and professional.

==================================================
QUESTION STRATEGY
==================================================

Use an appropriate mix of:

- introduction questions;
- CV-based questions;
- target-role questions;
- project questions;
- technical questions;
- behavioural questions;
- situational questions;
- problem-solving questions;
- professional communication questions.

When a CV is available, prioritize this order:

1. Candidate introduction.
2. Relevant education.
3. Most relevant CV project or experience.
4. Technical skills connected to the target role.
5. Challenges and decisions.
6. Behavioural or situational question.
7. Final readiness or motivation question.

Do not ask every possible CV question.

Choose only the most relevant questions for the selected role.

The total number of main questions should be approximately:
${questionCount}

Relevant follow-up questions may be asked naturally and do not have to count as separate main questions.

==================================================
OPENING INSTRUCTIONS
==================================================

Start naturally.

Your opening should:

1. Greet "${candidateName}".
2. Introduce yourself briefly as the JobQuestAI recruiter.
3. Mention the target role "${targetJob}".
4. Confirm that the candidate can hear you.
5. Wait for the candidate's response.
6. Then begin with one clear question.

If a CV is uploaded, do not immediately recite its contents.

Reference the CV naturally later in the interview.

==================================================
INTERVIEW COMPLETION
==================================================

When the planned interview is complete:

1. Thank the candidate.
2. Do not provide detailed scoring verbally.
3. Say exactly:

"Your interview is complete. JobQuestAI will now prepare your professional report."

4. Do not ask another question after this sentence.
`.trim();

}


/* =========================================================
   GEMINI CLIENT
========================================================= */

function createGeminiClient() {

    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {

        const error =
            new Error(
                "GEMINI_API_KEY is missing from server environment variables."
            );

        error.statusCode =
            500;

        error.code =
            "GEMINI_API_KEY_MISSING";

        throw error;

    }

    return new GoogleGenAI({

        apiKey

    });

}


/* =========================================================
   EPHEMERAL TOKEN CREATION
========================================================= */

async function createGeminiLiveToken(
    instructions
) {
    console.log(
        "TOKEN SYSTEM INSTRUCTION LENGTH:",
        String(instructions || "").length
    );

    console.log(
        "TOKEN CONTAINS CV:",
        String(instructions || "")
            .includes("BEGIN CV CONTENT")
    ); 
    

    const client =
        createGeminiClient();

    const expireTime =
        new Date(
            Date.now() +
            30 * 60 * 1000
        ).toISOString();

    const newSessionExpireTime =
        new Date(
            Date.now() +
            60 * 1000
        );

    const token =
        await client.authTokens.create({

            config: {

                uses:
                    1,

                expireTime,

                newSessionExpireTime,

                liveConnectConstraints: {

                    model:
                        GEMINI_LIVE_MODEL,

                    config: {

                        sessionResumption:
                            {},

                        temperature:
                            0.7,

                        responseModalities: [
                            "AUDIO"
                        ],

                        systemInstruction: {

                            parts: [
                                {
                                    text:
                                        instructions
                                }
                            ]

                        }

                    }

                },

                httpOptions: {

                    apiVersion:
                        "v1alpha"

                }

            }

        });

    if (!token?.name) {

        const error =
            new Error(
                "Gemini did not return a valid temporary Live API token."
            );

        error.statusCode =
            500;

        error.code =
            "GEMINI_TOKEN_MISSING";

        throw error;

    }

    return {

        token:
            token.name,

        expireTime:
            token.expireTime ||
            expireTime,

        newSessionExpireTime:
            token.newSessionExpireTime ||
            newSessionExpireTime.toISOString()

    };

}


/* =========================================================
   SESSION ENDPOINT
========================================================= */

router.post(
    "/session",
    handleInterviewUpload,
    async function (
        req,
        res
    ) {

        try {

            const profile =
                validateInterviewSetup(
                    req.body || {}
                );

            const cvText =
                await extractCvText(
                    req.file || null
                );
            console.log("\n=========================================");
            console.log("LIVE INTERVIEW CANDIDATE DATA");
            console.log("=========================================");

            console.log("Candidate Name:", profile.candidateName);
            console.log("Target Job:", profile.targetJob);
            console.log("Interview Type:", profile.interviewType);
            console.log("Experience Level:", profile.experienceLevel);
            console.log("Interview Language:", profile.interviewLanguage);
            console.log("Candidate Background:", profile.candidateBackground);

            console.log("CV Uploaded:", Boolean(req.file));
            console.log("CV File Name:", req.file?.originalname || "No CV");
            console.log("CV Extracted Characters:", cvText.length);

            console.log(
                "CV Preview:",
                cvText
                    ? cvText.slice(0, 800)
                    : "No CV text extracted"
            );

            console.log("=========================================\n");

            const instructions =
                buildRecruiterInstructions(
                    profile,
                    cvText
                );
            console.log("\n=========================================");
            console.log("GEMINI RECRUITER INSTRUCTIONS CHECK");
            console.log("=========================================");

            console.log(
                "Candidate:",
                profile.candidateName
            );

            console.log(
                "Target Role:",
                profile.targetJob
            );

            console.log(
                "CV Included:",
                instructions.includes(
                    "BEGIN CV CONTENT"
                )
            );

            console.log(
                "Actual CV Text Included:",
                cvText
                    ? instructions.includes(
                        cvText.slice(0, 100)
                    )
                    : false
            );

            console.log(
                "Total Instruction Characters:",
                instructions.length
            );

            console.log("=========================================\n");

            const credentials =
                await createGeminiLiveToken(
                    instructions
                );

            return res
                .status(201)
                .json({

                    success:
                        true,

                    provider:
                        "gemini",

                    token:
                        credentials.token,

                    model:
                        GEMINI_LIVE_MODEL,

                    expireTime:
                        credentials.expireTime,

                    newSessionExpireTime:
                        credentials.newSessionExpireTime,

                    instructions,

                    candidate: {

                        name:
                            profile.candidateName,

                        targetJob:
                            profile.targetJob,

                        interviewType:
                            profile.interviewType,

                        experienceLevel:
                            profile.experienceLevel,

                        language:
                            profile.interviewLanguage,

                        questionCount:
                            profile.questionCount

                    },

                    cv: {

                            uploaded:
                                Boolean(req.file),

                            fileName:
                                req.file?.originalname || "",

                            extractedCharacters:
                                cvText.length,

                            preview:
                                cvText
                                    ? cvText.slice(0, 500)
                                    : ""

                        }

                });

        } catch (error) {

            console.error(
                "LIVE INTERVIEW SESSION ERROR:",
                error
            );

            return res
                .status(
                    error.statusCode ||
                    500
                )
                .json({

                    success:
                        false,

                    error:
                        error.message ||
                        "Live interview session could not be prepared.",

                    code:
                        error.code ||
                        "LIVE_INTERVIEW_SESSION_ERROR"

                });

        }

    }
);


/* =========================================================
   TRANSCRIPT VALIDATION
========================================================= */

function normalizeTranscript(
    transcript
) {

    if (!Array.isArray(transcript)) {

        return [];

    }

    return transcript
        .map(
            function (entry) {

                const role =
                    entry?.role === "ai"
                        ? "ai"
                        : entry?.role === "user"
                            ? "user"
                            : "";

                const text =
                    cleanText(
                        entry?.text,
                        5000
                    );

                if (!role || !text) {

                    return null;

                }

                return {

                    role,

                    text

                };

            }
        )
        .filter(Boolean)
        .slice(
            0,
            100
        );

}


function isSubstantiveAnswer(text) {

    const normalized =
        cleanSingleLine(
            text,
            5000
        );

    if (normalized.length < 15) {

        return false;

    }

    const basicReplies =
        new Set([
            "yes",
            "yes i can",
            "yes i am ready",
            "i am ready",
            "okay",
            "ok",
            "sure",
            "ji",
            "jee",
            "han",
            "haan"
        ]);

    return !basicReplies.has(
        normalized.toLowerCase()
    );

}


function countCandidateAnswers(
    transcript
) {

    return transcript.filter(
        function (entry) {

            return (
                entry.role === "user" &&
                isSubstantiveAnswer(
                    entry.text
                )
            );

        }
    ).length;

}


/* =========================================================
   REPORT GENERATION THROUGH GROQ
========================================================= */

async function generateInterviewReport({

    candidate,
    transcript,
    durationSeconds

}) {

    const apiKey =
        process.env.API_KEY;

    if (!apiKey) {

        const error =
            new Error(
                "Groq API key is missing from server environment variables."
            );

        error.statusCode =
            500;

        error.code =
            "GROQ_API_KEY_MISSING";

        throw error;

    }

    const response =
        await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {

                method:
                    "POST",

                headers: {

                    Authorization:
                        `Bearer ${apiKey}`,

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        model:
                            GROQ_MODEL,

                        temperature:
                            0.2,

                        messages: [
                            {

                                role:
                                    "user",

                                content: `
You are JobQuestAI Professional Interview Assessment Engine.

Evaluate only the evidence contained in the interview transcript.

Candidate:
${JSON.stringify(candidate)}

Interview duration:
${durationSeconds} seconds

Interview transcript:
${JSON.stringify(transcript)}

Return ONLY valid JSON.
No markdown.
No text outside JSON.

Required JSON:

{
  "candidateName": "",
  "targetJob": "",
  "interviewType": "",
  "summary": "",
  "overallScore": 0,
  "communicationScore": 0,
  "relevanceScore": 0,
  "jobKnowledgeScore": 0,
  "professionalismScore": 0,
  "answerStructureScore": 0,
  "recommendation": "",
  "scoreReasons": {
    "overall": "",
    "communication": "",
    "relevance": "",
    "jobKnowledge": "",
    "professionalism": "",
    "answerStructure": ""
  },
  "strongAnswers": [],
  "weakAnswers": [],
  "strengths": [],
  "improvementAreas": [],
  "practicePlan": [],
  "finalFeedback": ""
}

Rules:

- Base every conclusion only on actual transcript evidence.
- Do not invent skills, qualifications, projects or experience.
- Do not award scores for information that was not discussed.
- All scores must be integers between 0 and 100.
- Score reasons must explain the transcript evidence.
- recommendation must be one of:
  "Ready",
  "Almost Ready",
  "Needs Practice",
  "Not Enough Role Knowledge".
- strongAnswers should reference actual answers.
- weakAnswers should reference actual weak, short or unclear answers.
- Do not evaluate eye contact.
- Do not diagnose personality.
- Do not claim to measure emotion medically.
- Keep feedback professional, practical and concise.
`
                            }
                        ]

                    })

            }
        );

    const data =
        await response.json();

    if (
        !response.ok ||
        data.error ||
        !data.choices?.[0]?.message?.content
    ) {

        const error =
            new Error(
                data?.error?.message ||
                "Interview report could not be generated."
            );

        error.statusCode =
            response.status || 500;

        error.code =
            "REPORT_AI_ERROR";

        throw error;

    }

    let resultText =
        data.choices[0].message.content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

    const firstBrace =
        resultText.indexOf("{");

    const lastBrace =
        resultText.lastIndexOf("}");

    if (
        firstBrace !== -1 &&
        lastBrace !== -1
    ) {

        resultText =
            resultText.substring(
                firstBrace,
                lastBrace + 1
            );

    }

    try {

        return JSON.parse(
            jsonrepair(
                resultText
            )
        );

    } catch (error) {

        console.error(
            "INTERVIEW REPORT RAW RESPONSE:",
            resultText
        );

        const parseError =
            new Error(
                "AI returned an invalid interview report format."
            );

        parseError.statusCode =
            500;

        parseError.code =
            "INVALID_REPORT_FORMAT";

        throw parseError;

    }

}


/* =========================================================
   REPORT ENDPOINT
========================================================= */

router.post(
    "/report",
    async function (
        req,
        res
    ) {

        try {

            const candidate = {

                candidateName:
                    cleanSingleLine(
                        req.body?.candidate?.candidateName,
                        100
                    ),

                targetJob:
                    cleanSingleLine(
                        req.body?.candidate?.targetJob,
                        160
                    ),

                interviewType:
                    cleanSingleLine(
                        req.body?.candidate?.interviewType,
                        100
                    ),

                experienceLevel:
                    cleanSingleLine(
                        req.body?.candidate?.experienceLevel,
                        100
                    ),

                interviewLanguage:
                    normalizeLanguage(
                        req.body?.candidate?.interviewLanguage
                    )

            };

            const transcript =
                normalizeTranscript(
                    req.body?.transcript
                );

            const durationSeconds =
                clampInteger(
                    req.body?.durationSeconds,
                    0,
                    14400,
                    0
                );

            const answerCount =
                countCandidateAnswers(
                    transcript
                );

            if (
                answerCount <
                MIN_REPORT_ANSWERS
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        error:
                            `A professional report requires at least ${MIN_REPORT_ANSWERS} detailed candidate answers.`,

                        code:
                            "INSUFFICIENT_ANSWERS",

                        evidence: {

                            answerCount,

                            durationSeconds

                        }

                    });

            }

            if (
                durationSeconds <
                MIN_REPORT_DURATION_SECONDS
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        error:
                            `A professional report requires at least ${MIN_REPORT_DURATION_SECONDS} seconds of interview evidence.`,

                        code:
                            "INTERVIEW_TOO_SHORT",

                        evidence: {

                            answerCount,

                            durationSeconds

                        }

                    });

            }

            const report =
                await generateInterviewReport({

                    candidate,

                    transcript,

                    durationSeconds

                });

            return res.json({

                success:
                    true,

                evidence: {

                    answerCount,

                    durationSeconds,

                    transcriptEntries:
                        transcript.length

                },

                report

            });

        } catch (error) {

            console.error(
                "LIVE INTERVIEW REPORT ERROR:",
                error
            );

            return res
                .status(
                    error.statusCode ||
                    500
                )
                .json({

                    success:
                        false,

                    error:
                        error.message ||
                        "Interview report could not be generated.",

                    code:
                        error.code ||
                        "LIVE_INTERVIEW_REPORT_ERROR"

                });

        }

    }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

router.get(
    "/health",
    function (
        req,
        res
    ) {

        res.json({

            success:
                true,

            module:
                "JobQuestAI Live Interview",

            provider:
                "Gemini Live",

            model:
                GEMINI_LIVE_MODEL,

            status:
                "ready"

        });

    }
);


/* =========================================================
   EXPORT ROUTER
========================================================= */

module.exports =
    router;