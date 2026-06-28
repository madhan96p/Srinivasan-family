let isPlaying = false;
let currentPanzoom = null;
const audioBtn = document.getElementById("audio-btn");
const bgMusic = document.getElementById("bg-music");

// --- Door Entry Animation & Music Trigger ---
function openDoors() {
  window.scrollTo(0, 0);

  // 2. Unlock the scrolling
  document.body.classList.remove("no-scroll");

  const overlay = document.getElementById("door-overlay");
  overlay.classList.add("doors-open");

  // NEW: Trigger the main content to elegantly scale up & fade in
  document.querySelector(".container").classList.add("entered");

  // Attempt to play music automatically when user clicks the door
  if (!isPlaying) {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        audioBtn.style.background = "#8B0000";
      })
      .catch((err) => console.log("Audio play prevented:", err));
  }

  // Hide the doors from DOM after animation completes (1.5s)
  setTimeout(() => {
    overlay.style.display = "none";

    // Trigger the scroll animations for items currently in view
    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
    elementsToAnimate.forEach((el) => el.classList.add("visible"));
  }, 1500);
}

// --- Scroll Animations (Intersection Observer) ---
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => observer.observe(el));
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";
  document.body.classList.add("no-scroll"); // Locks background scrolling

  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
  document.body.classList.remove("no-scroll"); // Unlocks background scrolling

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Also update the window.onclick to unlock scrolling if they click outside the modal
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("show");
    document.body.classList.remove("no-scroll"); // Unlocks background scrolling

    setTimeout(() => {
      event.target.style.display = "none";
    }, 300);
  }
};

// --- Image Zoom Logic (Panzoom) ---
function openImageModal(imgSrc) {
  const fullImg = document.getElementById("full-size-img");
  fullImg.src = imgSrc;
  openModal("image-modal");

  // Reset or Initialize Panzoom
  const container = document.getElementById("panzoom-container");
  if (currentPanzoom) {
    currentPanzoom.destroy();
  }

  currentPanzoom = Panzoom(fullImg, {
    maxScale: 5,
    minScale: 1, // Ensures it doesn't shrink smaller than the screen
    step: 0.3,
    // We removed 'contain: outside' so it stops cropping the edges!
  });

  // Enable mouse wheel zooming for desktop users
//  container.addEventListener("wheel", currentPanzoom.zoomWithWheel);
}
// Add this once at the top of your script, outside of any functions:
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("panzoom-container");
  container.addEventListener("wheel", function(e) {
      if (currentPanzoom) {
          currentPanzoom.zoomWithWheel(e);
      }
  });
});

// --- Audio Toggle Logic ---
audioBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    audioBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    audioBtn.style.background = "#D4AF37";
  } else {
    bgMusic.play().catch((error) => console.log("Audio play failed:", error));
    audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    audioBtn.style.background = "#8B0000";
  }
  isPlaying = !isPlaying;
});
