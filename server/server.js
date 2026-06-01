

require("dotenv").config();


const express = require("express");
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


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});