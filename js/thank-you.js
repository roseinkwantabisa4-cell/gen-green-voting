/* =========================================
   GEN GREEN THANK YOU PAGE
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
  "https://wyynmerbfzotuqjnubmu.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-hLBldUj6TohFiCz6X9Enw_FaE12j8d";


const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================
   BUTTONS
========================================= */

const returnHomeButton =
  document.getElementById(
    "returnHomeButton"
  );


const withdrawVoteButton =
  document.getElementById(
    "withdrawVoteButton"
  );


/* =========================================
   RETURN HOME
========================================= */

/*
  IMPORTANT:

  Do NOT clear the vote when returning home.

  We want Supabase + the browser to remember
  that this person already voted so they can
  later change or withdraw their vote.
*/

if (returnHomeButton) {

  returnHomeButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "index.html";

    }
  );

}


/* =========================================
   WITHDRAW VOTE
========================================= */

if (withdrawVoteButton) {

  withdrawVoteButton.addEventListener(
    "click",
    async () => {


      /* =====================================
         CONFIRM WITHDRAWAL
      ====================================== */

      const confirmed =
        window.confirm(
          "Are you sure you want to withdraw your vote? This will permanently remove your current Gen Green submission."
        );


      if (!confirmed) {

        return;

      }


      /* =====================================
         DISABLE BUTTON DURING REQUEST
      ====================================== */

      withdrawVoteButton.disabled = true;

      withdrawVoteButton.textContent =
        "Withdrawing...";


      try {


        /* =====================================
           GET CURRENT SUPABASE SESSION
        ====================================== */

        const {
          data: sessionData,
          error: sessionError
        } =
          await supabaseClient.auth
            .getSession();


        if (sessionError) {

          throw sessionError;

        }


        const user =
          sessionData.session?.user;


        if (!user) {

          throw new Error(
            "No voting session was found."
          );

        }


        /* =====================================
           DELETE THIS USER'S VOTE
        ====================================== */

        const {
          error: deleteError
        } =
          await supabaseClient
            .from(
              "gen_green_responses"
            )
            .delete()
            .eq(
              "user_id",
              user.id
            );


        if (deleteError) {

          throw deleteError;

        }


        /* =====================================
           CLEAR LOCAL VOTING DATA
        ====================================== */

        localStorage.removeItem(
          "genGreenSubmitted"
        );


        localStorage.removeItem(
          "genGreenCompleteSubmission"
        );


        sessionStorage.removeItem(
          "genGreenCompleteSubmission"
        );


        localStorage.removeItem(
          "genGreenVoteId"
        );


        localStorage.removeItem(
          "genGreenSelections"
        );


        sessionStorage.removeItem(
          "genGreenSelections"
        );


        localStorage.removeItem(
          "genGreenVoteReviewed"
        );


        sessionStorage.removeItem(
          "genGreenVoteReviewed"
        );


        sessionStorage.removeItem(
          "genGreenSurveyProgress"
        );


        /* =====================================
           SUCCESS
        ====================================== */

        alert(
          "Your Gen Green vote has been withdrawn successfully."
        );


        window.location.href =
          "index.html";

      }


      catch (error) {


        console.error(
          "Withdrawal failed:",
          error
        );


        alert(
          "We couldn't withdraw your vote. Please try again."
        );


        withdrawVoteButton.disabled =
          false;


        withdrawVoteButton.textContent =
          "Withdraw My Vote";

      }

    }
  );

}