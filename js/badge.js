/* =========================================
   GEN GREEN — BADGE PAGE
========================================= */


/* ELEMENTS */

const voterName =
  document.getElementById("voterName");

const voterPhoto =
  document.getElementById("voterPhoto");

const badgeName =
  document.getElementById("badgeName");

const badgePhoto =
  document.getElementById("badgePhoto");

const shareBadgeButton =
  document.getElementById("shareBadgeButton");

const finishButton =
  document.getElementById("finishButton");



/* =========================================
   LIVE NAME
========================================= */

voterName.addEventListener(
  "input",
  () => {

    const name =
      voterName.value.trim();


    if (name) {

      badgeName.textContent =
        name;

    }

    else {

      badgeName.textContent =
        "Your Name";

    }

  }
);



/* =========================================
   PHOTO UPLOAD
========================================= */

voterPhoto.addEventListener(
  "change",
  (event) => {

    const file =
      event.target.files[0];


    if (!file) {

      return;

    }


    /* MAKE SURE FILE IS AN IMAGE */

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Please select an image file."
      );

      voterPhoto.value = "";

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      function(event) {

        badgePhoto.src =
          event.target.result;

      };


    reader.readAsDataURL(file);

  }
);



/* =========================================
   SHARE
========================================= */

shareBadgeButton.addEventListener(
  "click",
  async () => {

    const name =
      voterName.value.trim();


    const message =
      name
        ? `${name} voted in Newark's Gen Green initiative! 🌱`
        : "I voted in Newark's Gen Green initiative! 🌱";


    const shareData = {

      title:
        "I Voted Green",

      text:
        message

    };


    if (navigator.share) {

      try {

        await navigator.share(
          shareData
        );

      }

      catch (error) {

        console.log(
          "Share cancelled."
        );

      }

    }

    else {

      alert(
        "Sharing is not supported in this browser."
      );

    }

  }
);



/* =========================================
   FINISH
========================================= */

finishButton.addEventListener(
  "click",
  () => {

    /*
      Clear temporary ballot selections
      so the next voter starts fresh.
    */

    localStorage.removeItem(
      "genGreenSelections"
    );

    sessionStorage.removeItem(
      "genGreenSelections"
    );


    localStorage.removeItem(
      "genGreenVoteReviewed"
    );


    /*
      Return to landing page
    */

   window.location.href =
  "thank-you.html";

  }
);