/* ===========================================
   GEN GREEN SURVEY
=========================================== */

/* ===========================================
   SUPABASE
=========================================== */

const SUPABASE_URL =
  "https://wyynmerbfzotuqjnubmu.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-hLBldUj6TohFiCz6X9Enw_FaE12j8d";


const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );



const surveyForm =
  document.getElementById("genGreenSurvey");

const finishSurveyButton =
  document.getElementById("finishSurveyButton");

const surveyProgressCount =
  document.getElementById("surveyProgressCount");

const surveyProgressFill =
  document.getElementById("surveyProgressFill");

const surveyError =
  document.getElementById("surveyError");

const organizationSchoolInput =
  document.getElementById("organizationSchool");


const TOTAL_QUESTIONS = 8;



/* ===========================================
   CLOUDFLARE TURNSTILE
=========================================== */

let captchaToken = null;


/* CAPTCHA SUCCESS */

window.onCaptchaSuccess =
  function(token) {

    captchaToken = token;

    console.log(
      "Human verification complete."
    );

    updateSurveyProgress();

  };


/* CAPTCHA EXPIRED */

window.onCaptchaExpired =
  function() {

    captchaToken = null;

    surveyError.textContent =
      "Human verification expired. Please verify again.";

    updateSurveyProgress();

  };


/* CAPTCHA ERROR */

window.onCaptchaError =
  function() {

    captchaToken = null;

    surveyError.textContent =
      "Human verification failed. Please try again.";

    updateSurveyProgress();

  };








/* ===========================================
   GET OR CREATE ANONYMOUS SUPABASE USER
=========================================== */

async function getSupabaseUser() {

  /*
    First check whether this browser already
    has a Supabase session.
  */

  const {
    data: sessionData,
    error: sessionError
  } =
    await supabaseClient.auth.getSession();


  if (sessionError) {

    console.error(
      "Session error:",
      sessionError
    );

  }


  /*
    If a session already exists,
    use the same anonymous user.
  */

  if (
    sessionData &&
    sessionData.session &&
    sessionData.session.user
  ) {

    return sessionData.session.user;

  }


  /*
    Otherwise create an anonymous user.
  */

  const {
    data,
    error
  } =
    await supabaseClient.auth
  .signInAnonymously({
    options: {
      captchaToken: captchaToken
    }
  });


  if (error) {

    console.error(
      "Anonymous sign-in error:",
      error
    );

    throw error;

  }


  return data.user;

}





/* ===========================================
   RADIO QUESTION NAMES
=========================================== */

const RADIO_QUESTIONS = [
  "ward",
  "age",
  "likedVoting",
  "feltImportant",
  "understoodVote",
  "voteAgain",
  "learnMore"
];


/* ===========================================
   WATCH SURVEY ANSWERS
=========================================== */

/* Radio buttons */

surveyForm.addEventListener(
  "change",
  () => {

    saveSurveyProgress();

    updateSurveyProgress();

  }
);


/* Organization / School text field */

organizationSchoolInput.addEventListener(
  "input",
  () => {

    saveSurveyProgress();

    updateSurveyProgress();

  }
);


/* ===========================================
   COUNT ANSWERED QUESTIONS
=========================================== */

function getAnsweredCount() {

  let answered = 0;


  /* =====================================
     QUESTION 1:
     ORGANIZATION / SCHOOL
  ====================================== */

  const organizationSchool =
    organizationSchoolInput
      .value
      .trim();


  if (organizationSchool !== "") {

    answered++;

  }


  /* =====================================
     QUESTIONS 2–8:
     RADIO BUTTONS
  ====================================== */

  RADIO_QUESTIONS.forEach(
    (questionName) => {

      const selected =
        document.querySelector(
          `input[name="${questionName}"]:checked`
        );


      if (selected) {

        answered++;

      }

    }
  );


  return answered;

}


/* ===========================================
   UPDATE PROGRESS
=========================================== */

function updateSurveyProgress() {

  const answered =
    getAnsweredCount();


  /* TEXT COUNTER */

  surveyProgressCount.textContent =
    `${answered} of ${TOTAL_QUESTIONS}`;


  /* PROGRESS BAR */

  const percentage =
    (answered / TOTAL_QUESTIONS) * 100;


  surveyProgressFill.style.width =
    `${percentage}%`;


  /* =====================================
     ENABLE SUBMIT BUTTON
  ====================================== */

if (
  answered === TOTAL_QUESTIONS &&
  captchaToken
) {

  finishSurveyButton.disabled = false;

  finishSurveyButton.classList.add(
    "ready"
  );

  surveyError.textContent = "";

  }

  else {

    finishSurveyButton.disabled = true;

    finishSurveyButton.classList.remove(
      "ready"
    );

  }

}


/* ===========================================
   SAVE SURVEY PROGRESS

   This means the user's answers remain if
   they accidentally refresh the page.
=========================================== */

function saveSurveyProgress() {

  const progress = {

    organizationSchool:
      organizationSchoolInput
        .value
        .trim(),

    ward:
      getSelectedValue("ward"),

    age:
      getSelectedValue("age"),

    likedVoting:
      getSelectedValue("likedVoting"),

    feltImportant:
      getSelectedValue("feltImportant"),

    understoodVote:
      getSelectedValue("understoodVote"),

    voteAgain:
      getSelectedValue("voteAgain"),

    learnMore:
      getSelectedValue("learnMore")

  };


  sessionStorage.setItem(
    "genGreenSurveyProgress",
    JSON.stringify(progress)
  );

}


/* ===========================================
   HELPER:
   GET SELECTED RADIO VALUE
=========================================== */

function getSelectedValue(name) {

  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );


  return selected
    ? selected.value
    : "";

}


/* ===========================================
   RESTORE SURVEY PROGRESS
=========================================== */

function restoreSurveyProgress() {

  const savedProgress =
    sessionStorage.getItem(
      "genGreenSurveyProgress"
    );


  if (!savedProgress) {

    return;

  }


  try {

    const progress =
      JSON.parse(savedProgress);


    /* ORGANIZATION / SCHOOL */

    if (progress.organizationSchool) {

      organizationSchoolInput.value =
        progress.organizationSchool;

    }


    /* RADIO QUESTIONS */

    RADIO_QUESTIONS.forEach(
      (questionName) => {

        const value =
          progress[questionName];


        if (!value) {

          return;

        }


        const matchingInput =
          document.querySelector(
            `input[name="${questionName}"][value="${CSS.escape(value)}"]`
          );


        if (matchingInput) {

          matchingInput.checked = true;

        }

      }
    );

  }

  catch (error) {

    console.error(
      "Could not restore survey answers:",
      error
    );


    sessionStorage.removeItem(
      "genGreenSurveyProgress"
    );

  }

}


/* ===========================================
   SUBMIT COMPLETE VOTE
=========================================== */

finishSurveyButton.addEventListener(
  "click",
  async () => {

    const answered =
      getAnsweredCount();


    /* =====================================
       REQUIRE ALL 8 QUESTIONS
    ====================================== */

    if (answered !== TOTAL_QUESTIONS) {

      surveyError.textContent =
        "Please answer all 8 questions before submitting your vote.";

      return;

    }


    /* =====================================
       GET FIVE VOTING CHOICES
    ====================================== */

    const savedVote =
      localStorage.getItem(
        "genGreenSelections"
      ) ||
      sessionStorage.getItem(
        "genGreenSelections"
      );


    if (!savedVote) {

      surveyError.textContent =
        "We couldn't find your voting choices. Please return to the voting page.";

      return;

    }


    let selectedIdeas = [];


    try {

      selectedIdeas =
        JSON.parse(savedVote);

    }

    catch (error) {

      console.error(
        "Voting choices error:",
        error
      );

      surveyError.textContent =
        "There was a problem loading your voting choices. Please return to the voting page.";

      return;

    }


    /* =====================================
       REQUIRE EXACTLY FIVE
    ====================================== */

    if (
      !Array.isArray(selectedIdeas) ||
      selectedIdeas.length !== 5
    ) {

      surveyError.textContent =
        "Please select exactly 5 ideas before submitting.";

      return;

    }


    /* =====================================
       COLLECT SURVEY RESPONSES
    ====================================== */

    const surveyResponses = {

      organizationSchool:
        organizationSchoolInput
          .value
          .trim(),

      ward:
        getSelectedValue("ward"),

      age:
        getSelectedValue("age"),

      likedVoting:
        getSelectedValue("likedVoting"),

      feltImportant:
        getSelectedValue("feltImportant"),

      understoodVote:
        getSelectedValue("understoodVote"),

      voteAgain:
        getSelectedValue("voteAgain"),

      learnMore:
        getSelectedValue("learnMore")

    };


    /* =====================================
       DISABLE BUTTON WHILE SUBMITTING
    ====================================== */

    finishSurveyButton.disabled = true;

    finishSurveyButton.classList.remove(
      "ready"
    );

    finishSurveyButton.textContent =
      "Submitting...";

    surveyError.textContent = "";


    try {

      /* =====================================
         GET / CREATE ANONYMOUS USER
      ====================================== */

      const user =
        await getSupabaseUser();


      if (!user) {

        throw new Error(
          "Could not create voter session."
        );

      }


      /* =====================================
         CREATE / KEEP VOTE ID
      ====================================== */

      let voteId =
        localStorage.getItem(
          "genGreenVoteId"
        );


      if (!voteId) {

        voteId =
          "GG-" + Date.now();

        localStorage.setItem(
          "genGreenVoteId",
          voteId
        );

      }


      /* =====================================
         BUILD DATABASE RECORD
      ====================================== */

      const databaseRow = {

        user_id:
          user.id,

        vote_id:
          voteId,

        organization_school:
          surveyResponses.organizationSchool,

        ward:
          surveyResponses.ward,

        age:
          Number(
            surveyResponses.age
          ),

        liked_voting:
          surveyResponses.likedVoting,

        felt_important:
          surveyResponses.feltImportant,

        understood_vote:
          surveyResponses.understoodVote,

        vote_again:
          surveyResponses.voteAgain,

        learn_more:
          surveyResponses.learnMore,

        choice_1:
          selectedIdeas[0].title,

        choice_2:
          selectedIdeas[1].title,

        choice_3:
          selectedIdeas[2].title,

        choice_4:
          selectedIdeas[3].title,

        choice_5:
          selectedIdeas[4].title

      };


      console.log(
        "Submitting record:",
        databaseRow
      );


      /* =====================================
         INSERT OR UPDATE

         Because user_id has a UNIQUE index,
         this will INSERT on the first vote
         and UPDATE on a later resubmission.
      ====================================== */

      const {
        error: databaseError
      } =
        await supabaseClient
          .from(
            "gen_green_responses"
          )
          .upsert(
            databaseRow,
            {
              onConflict: "user_id"
            }
          );


      if (databaseError) {

        throw databaseError;

      }


      /* =====================================
         SAVE LOCAL COPY
      ====================================== */

      const completeSubmission = {

        voteId:
          voteId,

        userId:
          user.id,

        submittedAt:
          new Date().toISOString(),

        choices:
          selectedIdeas,

        survey:
          surveyResponses

      };


      localStorage.setItem(
        "genGreenCompleteSubmission",
        JSON.stringify(
          completeSubmission
        )
      );


      sessionStorage.setItem(
        "genGreenCompleteSubmission",
        JSON.stringify(
          completeSubmission
        )
      );


      localStorage.setItem(
        "genGreenSubmitted",
        "true"
      );


      /* =====================================
         CLEAR TEMP SURVEY DRAFT
      ====================================== */

      sessionStorage.removeItem(
        "genGreenSurveyProgress"
      );


      /* =====================================
         CONTINUE TO BADGE
      ====================================== */

      window.location.href =
        "badge.html";

    }

    catch (error) {

      console.error(
        "Vote submission failed:",
        error
      );


      surveyError.textContent =
        "We couldn't submit your vote. Please check your connection and try again.";


      finishSurveyButton.disabled = false;

      finishSurveyButton.classList.add(
        "ready"
      );

      finishSurveyButton.textContent =
        "Submit My Vote →";

    }

  }
);


/* ===========================================
   INITIALIZE SURVEY
=========================================== */

restoreSurveyProgress();

updateSurveyProgress();