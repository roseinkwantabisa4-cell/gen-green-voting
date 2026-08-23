/* ===========================================
   GEN GREEN VOTING SYSTEM
=========================================== */

const ideaCards =
  document.querySelectorAll(".ballot-option");

const selectionCount =
  document.getElementById("selectionCount");

const bottomCount =
  document.getElementById("bottomCount");

const selectionMessage =
  document.getElementById("selectionMessage");

const selectionDots =
  document.querySelectorAll(".selection-dot");

const reviewButton =
  document.getElementById("reviewButton");


const MAX_SELECTIONS = 5;

let selectedIdeas = [];


/* ===========================================
   CLICK AN IDEA
=========================================== */

ideaCards.forEach((card) => {

  card.addEventListener("click", () => {

    const ideaId =
      card.dataset.id;

    const ideaTitle =
      card.dataset.title;

    const ideaCategory =
      card.dataset.category;


    /* REMOVE EXISTING SELECTION */

    if (card.classList.contains("selected")) {

      card.classList.remove("selected");

      selectedIdeas =
        selectedIdeas.filter(
          (idea) => idea.id !== ideaId
        );

      updateVotingInterface();

      return;
    }


    /* PREVENT MORE THAN 5 */

    if (selectedIdeas.length >= MAX_SELECTIONS) {

      if (selectionMessage) {

        selectionMessage.textContent =
          "You already selected 5 ideas. Remove one to choose another.";

      }

      return;
    }


    /* ADD NEW SELECTION */

    card.classList.add("selected");

    selectedIdeas.push({
      id: ideaId,
      title: ideaTitle,
      category: ideaCategory
    });


    updateVotingInterface();

  });

});


/* ===========================================
   UPDATE SCREEN
=========================================== */

function updateVotingInterface() {

  const count =
    selectedIdeas.length;


  /* TOP COUNTER */

  if (selectionCount) {

    selectionCount.textContent =
      count;

  }


  /* BOTTOM COUNTER */

  if (bottomCount) {

    bottomCount.textContent =
      `${count} of ${MAX_SELECTIONS}`;

  }


  /* DOTS */

  selectionDots.forEach(
    (dot, index) => {

      if (index < count) {

        dot.classList.add("filled");

      } else {

        dot.classList.remove("filled");

      }

    }
  );


  /* MESSAGE */

  if (selectionMessage) {

    if (count === 0) {

      selectionMessage.textContent =
        "Select 5 ideas to continue.";

      selectionMessage.classList.remove(
        "complete"
      );

    }

    else if (count < MAX_SELECTIONS) {

      const remaining =
        MAX_SELECTIONS - count;

      selectionMessage.textContent =
        `Choose ${remaining} more ${
          remaining === 1
            ? "idea"
            : "ideas"
        }.`;

      selectionMessage.classList.remove(
        "complete"
      );

    }

    else {

      selectionMessage.textContent =
        "Great! You selected your Top 5.";

      selectionMessage.classList.add(
        "complete"
      );

    }

  }


  /* DISABLE OTHER OPTIONS AFTER 5 */

  ideaCards.forEach((card) => {

    if (
      count === MAX_SELECTIONS &&
      !card.classList.contains("selected")
    ) {

      card.classList.add(
        "selection-disabled"
      );

    } else {

      card.classList.remove(
        "selection-disabled"
      );

    }

  });


  /* REVIEW BUTTON */

  if (reviewButton) {

    if (count === MAX_SELECTIONS) {

      reviewButton.disabled = false;

      reviewButton.classList.add(
        "ready"
      );

    } else {

      reviewButton.disabled = true;

      reviewButton.classList.remove(
        "ready"
      );

    }

  }


  /* SAVE CURRENT CHOICES */

  saveSelections();

}


/* ===========================================
   SAVE CHOICES
=========================================== */

function saveSelections() {

  const savedData =
    JSON.stringify(selectedIdeas);


  localStorage.setItem(
    "genGreenSelections",
    savedData
  );


  sessionStorage.setItem(
    "genGreenSelections",
    savedData
  );

}


/* ===========================================
   REVIEW BUTTON
=========================================== */

if (reviewButton) {

  reviewButton.addEventListener(
    "click",
    () => {

      if (
        selectedIdeas.length !==
        MAX_SELECTIONS
      ) {

        return;

      }


      /* Save once more before leaving */

      saveSelections();


      console.log(
        "Choices being saved:",
        selectedIdeas
      );


      window.location.href =
        "review.html";

    }
  );

}


/* ===========================================
   RESTORE PREVIOUS CHOICES
=========================================== */

function restoreSelections() {

  const savedSelections =
    localStorage.getItem(
      "genGreenSelections"
    ) ||
    sessionStorage.getItem(
      "genGreenSelections"
    );


  if (!savedSelections) {

    updateVotingInterface();

    return;

  }


  try {

    const parsedSelections =
      JSON.parse(savedSelections);


    /*
      Protect against old or broken data
    */

    selectedIdeas =
      parsedSelections.slice(
        0,
        MAX_SELECTIONS
      );


    selectedIdeas.forEach(
      (idea) => {

        const matchingCard =
          document.querySelector(
            `.ballot-option[data-id="${idea.id}"]`
          );


        if (matchingCard) {

          matchingCard.classList.add(
            "selected"
          );

        }

      }
    );


    updateVotingInterface();

  }


  catch (error) {

    console.error(
      "Could not restore selections:",
      error
    );


    selectedIdeas = [];


    localStorage.removeItem(
      "genGreenSelections"
    );


    sessionStorage.removeItem(
      "genGreenSelections"
    );


    updateVotingInterface();

  }

}


/* ===========================================
   RUN WHEN PAGE OPENS
=========================================== */

restoreSelections();