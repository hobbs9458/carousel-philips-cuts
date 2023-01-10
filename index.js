const pages = [...document.querySelectorAll(".carousel__page")];
const track = document.querySelector(".carousel__track");

const btns = [...document.querySelectorAll(".carousel__btn")];
const nextPageBtn = document.querySelector(".carousel__btn-right");
const prevCardBtn = document.querySelector(".carousel__btn-left");

const originalStartingCard = document.querySelector(".track__start-original");
const originalEndCard = document.querySelector(".track__end-original");

let autoSlide = true;
let currentPage = document.querySelector(".carousel__page-current");
let nextPage = currentPage.nextElementSibling;
const pageWidth = currentPage.getBoundingClientRect().width;

// CREATE HORIZONTAL TRACK USING PAGE WIDTH
track.style.transition = pages.map((page, index) => {
  page.style.left = `${pageWidth * index}px`;
});

// SETS CAROUSEL TO START ON THE FIRST ORIGINAL CARD
// RATHER THAN THE CLONE WHICH HAS AN INDEX OF 0
track.style.transform = `translateX(-${pageWidth}px)`;

// ADD / REMOVE CURRENT PAGE CLASS AND UPDATE CURRENT PAGE
const updateCurrentPage = (theCurrentPage, updatedCurrentPage) => {
  if (!updatedCurrentPage) return;
  theCurrentPage.classList.remove("carousel__page-current");
  updatedCurrentPage.classList.add("carousel__page-current");
  currentPage = updatedCurrentPage;
};

const removeEventListeners = (e) => {
  // REMOVE EVENT LISTENERS TO PREVENT THE USER FROM THROWING
  // ERRORS DURING RAPID CLICKING
  nextPageBtn.removeEventListener("click", moveTrack);
  prevCardBtn.removeEventListener("click", moveTrack);
};

const transitionsOn = (e) => {
  // TURN ON TRANSITIONS
  track.style.transitionDuration = "1s";
  track.style.transitionTimingFunction = "ease-in";
};

const transitionsOff = (e) => {
  // TURN TRANSITIONS TO NONE TO MAKE INVISIBLE THE SLIDE FROM
  // CLONE TO ORIGINAL
  track.style.transitionDuration = "0s";
  track.style.transitionTimingFunction = "none";
};

const sneakyCloneSlide = (e) => {
  // IF YOU LAND ON A CLONE,SLIDE TO CLONE'S ORIGINAL
  // WITHOUT BEING NOTICED
  transitionsOff();
  if (currentPage.classList.contains("track__start-clone")) {
    track.style.transform = `translateX(-${originalStartingCard.style.left})`;
    updateCurrentPage(currentPage, originalStartingCard);
  } else if (currentPage.classList.contains("track__end-clone")) {
    track.style.transform = `translateX(-${originalEndCard.style.left})`;
    updateCurrentPage(currentPage, originalEndCard);
  } else {
    return;
  }
};

// MAIN EVENT LISTENERS
nextPageBtn.addEventListener("click", (e) => {
  nextPage = currentPage.nextElementSibling;
});

prevCardBtn.addEventListener("click", (e) => {
  nextPage = currentPage.previousElementSibling;
});

const moveTrack = () => {
  removeEventListeners();
  transitionsOn();
  track.style.transform = `translateX(-${nextPage.style.left})`;
  updateCurrentPage(currentPage, nextPage);
};

track.addEventListener("transitionend", (e) => {
  if (currentPage.classList.contains("clone")) {
    sneakyCloneSlide();
  }

  // ADD EVENT LISTENERS BACK ONCE THE SLIDER IS FINISHED SLIDING
  nextPageBtn.addEventListener("click", moveTrack);
  prevCardBtn.addEventListener("click", moveTrack);
});

btns.forEach((btn) => btn.addEventListener("click", moveTrack));

// COMMENT OUT REMAINDER OF SCRIPT TO DISABLE AUTO MODE
const intervalID = setInterval(() => {
  if (currentPage.nextElementSibling) {
    nextPage = currentPage.nextElementSibling;
  } else {
    nextPage = originalStartingCard;
  }
  moveTrack();
}, 3000);

btns.forEach((btn) =>
  btn.addEventListener("click", (e) => clearInterval(intervalID))
);
