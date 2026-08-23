/* =========================================
   GEN GREEN REVIEW PAGE
========================================= */

const reviewChoices =
  document.getElementById("reviewChoices");

const submitVoteButton =
  document.getElementById("submitVoteButton");


/* =========================================
   LOAD SAVED CHOICES
========================================= */

/*
   First try localStorage.
   If that fails, use sessionStorage.
*/

let savedSelections =
  localStorage.getItem("genGreenSelections");

if (!savedSelections) {

  savedSelections =
    sessionStorage.getItem("genGreenSelections");

}


let selectedIdeas = [];


if (savedSelections) {

  try {

    selectedIdeas =
      JSON.parse(savedSelections);

  } catch (error) {

    console.error(
      "Could not read saved selections:",
      error
    );

    selectedIdeas = [];

  }

}


console.log(
  "Choices loaded on review page:",
  selectedIdeas
);


/* =========================================
   DISPLAY ERROR IF NOT 5
========================================= */

if (selectedIdeas.length !== 5) {

  reviewChoices.innerHTML = `

    <div class="review-error">

      <h3>
        We couldn't find 5 choices.
      </h3>

      <p>
        Please return to the voting page and choose exactly five ideas.
      </p>

      <a href="vote.html">
        Return to Voting
      </a>

    </div>

  `;


  submitVoteButton.disabled = true;

}


/* =========================================
   DISPLAY SELECTIONS
========================================= */

else {

  reviewChoices.innerHTML = "";


  selectedIdeas.forEach((idea, index) => {

    const choice =
      document.createElement("div");


    choice.className =
      "review-choice-item";


    choice.innerHTML = `

      <div class="review-choice-number">
        ${index + 1}
      </div>


      <div class="review-choice-text">

        <span class="review-choice-category">
          ${idea.category || "Gen Green"}
        </span>

        <h3>
          ${idea.title}
        </h3>

      </div>


      <div class="review-check">
        ✓
      </div>

    `;


    reviewChoices.appendChild(choice);

  });


  submitVoteButton.disabled = false;

}


/* =========================================
   SUBMIT VOTE
========================================= */

submitVoteButton.addEventListener(
  "click",
  () => {

    if (selectedIdeas.length !== 5) {
      return;
    }

    /* Keep the reviewed choices saved */

    localStorage.setItem(
      "genGreenSelections",
      JSON.stringify(selectedIdeas)
    );

    sessionStorage.setItem(
      "genGreenSelections",
      JSON.stringify(selectedIdeas)
    );

    /* Continue to survey */

    window.location.href =
      "survey.html";
  }
);