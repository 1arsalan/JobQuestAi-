import {

  db,
  collection,
  getDocs

}

from "../firebase.js";


console.log("JS Connected");

// ==========================
// FIREBASE JOBS FETCH
// ==========================

const jobsContainer =
document.getElementById("jobsContainer");

async function loadJobs(category = "all"){

  const jobsRef =
  collection(db,"jobs");

  const snapshot =
  await getDocs(jobsRef);

  jobsContainer.innerHTML = "";

  snapshot.forEach((doc)=>{

    const job = doc.data();

    // FILTER

    if(

      category !== "all"

      &&

      job.category !== category

    ){

      return;

    }

    jobsContainer.innerHTML += `

    <div class="job-card"
    data-category="${job.category}"
    data-apply="${job.applyLink}"
    data-description="${job.description}">

      <div class="job-top">

        <div class="job-company-icon">

          <i class="bi bi-briefcase"></i>

        </div>

        <span class="job-type">

          ${job.category}

        </span>

      </div>

      <div class="job-badge">

        🔥 ${job.badge}

      </div>

      <h3>${job.title}</h3>

      <p class="company-name">

        ${job.company}

      </p>

      <div class="job-info">

        <span>

          <i class="bi bi-geo-alt"></i>

          ${job.location}

        </span>

        <span>

          <i class="bi bi-cash"></i>

          ${job.salary}

        </span>

      </div>

      <div class="job-footer">

        <button class="details-btn">

          View Details

        </button>

        <button class="save-btn">

          <i class="bi bi-heart"></i>

        </button>

        <button class="apply-btn">

          Apply Now

        </button>

      </div>

    </div>

    `;

  });

}

loadJobs("all");

async function loadLiveJobs(){

try{

const response =
await fetch("/jobs");

const result =
await response.json();

const aiJobsContainer =
document.getElementById("aiJobsContainer");

aiJobsContainer.innerHTML = "";

result.data.slice(0,8).forEach(job=>{

aiJobsContainer.innerHTML += `

<div class="job-card"
data-apply="${job.job_apply_link || '#'}"
data-description="${job.job_description || 'No Description'}">

<div class="job-top">

<div class="job-company-icon">
<i class="bi bi-briefcase"></i>
</div>

<span class="job-type">
Live Job
</span>

</div>

<div class="job-badge">
🔥 Active Vacancy
</div>

<h3>
${job.job_title}
</h3>

<p class="company-name">
${job.employer_name}
</p>

<div class="job-info">

<span>
<i class="bi bi-geo-alt"></i>
${job.job_city || 'Pakistan'}
</span>

<span>
<i class="bi bi-building"></i>
${job.job_employment_type || 'Full Time'}
</span>

</div>

<div class="job-footer">

<button class="details-btn">

View Details

</button>

<button class="save-btn">

<i class="bi bi-heart"></i>

</button>

<button class="apply-btn">

Apply Now

</button>

</div>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadLiveJobs();

const modal =
document.getElementById("jobModal");

const modalTitle =
document.getElementById("modalTitle");

const modalCompany =
document.getElementById("modalCompany");

const modalDescription =
document.querySelector(".modal-description");

const closeModal =
document.getElementById("closeModal");

closeModal.addEventListener("click",()=>{

modal.style.display = "none";

});

window.addEventListener("click",(e)=>{

if(e.target === modal){

modal.style.display = "none";

}

});


// ==========================
// DYNAMIC BUTTON EVENTS
// ==========================

document.addEventListener("click",(e)=>{

  // APPLY BUTTON

  if(e.target.classList.contains("apply-btn")){

    const card =
    e.target.closest(".job-card");

    const applyLink =
    card.dataset.apply;

    window.open(applyLink,"_blank");

  }

  // SAVE BUTTON

  if(e.target.closest(".save-btn")){

    const saveBtn =
    e.target.closest(".save-btn");

    saveBtn.classList.toggle("saved");

  }

  // DETAILS BUTTON

  if(e.target.classList.contains("details-btn")){

    const card =
    e.target.closest(".job-card");

    const title =
    card.querySelector("h3").textContent;

    const company =
    card.querySelector(".company-name").textContent;

    modalTitle.textContent =
    title;

    modalCompany.textContent =
    company;

    const description =
    card.dataset.description
    || "No Description Available";

    modalDescription.textContent =
    description;
    modal.style.display =
    "flex";

    const modalApplyBtn =
    document.querySelector(".modal-apply-btn");

    modalApplyBtn.onclick = ()=>{

        const applyLink =
        card.dataset.apply;

        window.open(applyLink,"_blank");

    };

  }

});

const categoryButtons =
document.querySelectorAll(".category-btn");

categoryButtons.forEach((button)=>{

button.addEventListener("click",()=>{

categoryButtons.forEach((btn)=>{

btn.classList.remove("active-category");

});

button.classList.add("active-category");

const category =
button.dataset.category;

loadJobs(category);

});

});

// SEARCH

const searchInput =
document.getElementById("jobSearch");

searchInput.addEventListener("keyup",()=>{

const value =
searchInput.value.toLowerCase();

const cards =
document.querySelectorAll(".job-card");

cards.forEach((card)=>{

const text =
card.textContent.toLowerCase();

if(text.includes(value)){

card.style.display = "block";

}

else{

card.style.display = "none";

}

});

});


