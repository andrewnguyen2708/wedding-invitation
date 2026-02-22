var isPlaying = false;

// ===== INTRO — CURTAIN REVEAL =====
function initAfterIntro() {
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });

  // Auto scroll down slowly — 1 pixel per frame (~60px/sec)
  var autoScrollSpeed = 1;
  var autoScrollRunning = true;

  function stopAutoScroll() {
    autoScrollRunning = false;
  }

  window.addEventListener("wheel", stopAutoScroll, { once: true });
  window.addEventListener("touchstart", stopAutoScroll, { once: true });

  // Disable CSS smooth scroll so scrollTo moves exactly
  document.documentElement.style.scrollBehavior = "auto";

  function autoScrollStep() {
    if (!autoScrollRunning) {
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    if (window.pageYOffset < maxScroll) {
      window.scrollTo(0, window.pageYOffset + autoScrollSpeed);
      requestAnimationFrame(autoScrollStep);
    } else {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }

  requestAnimationFrame(autoScrollStep);

  // Auto-play music
  var bgMusic = document.getElementById("bgMusic");
  var musicBtn = document.getElementById("musicBtn");
  bgMusic
    .play()
    .then(function () {
      isPlaying = true;
      musicBtn.classList.add("playing");
    })
    .catch(function () {});
}

(function () {
  var overlay = document.getElementById("introOverlay");
  var hasVisited = localStorage.getItem("introSeen");

  if (hasVisited) {
    // Skip intro on repeat visits
    overlay.classList.add("hidden");
    initAfterIntro();
    return;
  }

  document
    .getElementById("openInvitation")
    .addEventListener("click", function () {
      localStorage.setItem("introSeen", "1");
      overlay.classList.add("opening");
      setTimeout(function () {
        overlay.classList.add("hidden");
        initAfterIntro();
      }, 1400);
    });
})();

// ===== HERO PARTICLES =====
(function () {
  var container = document.getElementById("heroParticles");
  if (!container) return;
  for (var i = 0; i < 15; i++) {
    var p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.setProperty("--duration", 6 + Math.random() * 8 + "s");
    p.style.setProperty("--delay", Math.random() * 6 + "s");
    p.style.width = 2 + Math.random() * 4 + "px";
    p.style.height = p.style.width;
    container.appendChild(p);
  }
})();

// ===== COUNTDOWN WITH TICK ANIMATION =====
var prevValues = { days: "", hours: "", minutes: "", seconds: "" };

function updateCountdown() {
  var weddingDate = new Date("2024-09-30T10:00:00+07:00");
  var now = new Date();
  var diff = weddingDate - now;

  var d = "0",
    h = "0",
    m = "0",
    s = "0";
  if (diff > 0) {
    d = String(Math.floor(diff / (1000 * 60 * 60 * 24)));
    h = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    s = String(Math.floor((diff % (1000 * 60)) / 1000));
  }

  var ids = ["days", "hours", "minutes", "seconds"];
  var vals = [d, h, m, s];
  var keys = ["days", "hours", "minutes", "seconds"];

  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) {
      if (prevValues[keys[i]] !== vals[i]) {
        el.textContent = vals[i];
        el.classList.remove("tick");
        void el.offsetWidth;
        el.classList.add("tick");
        prevValues[keys[i]] = vals[i];
      }
    }
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== GALLERY SHOW MORE =====
var galleryShowMore = document.querySelector(".gallery-show-more");
if (galleryShowMore) {
  galleryShowMore.addEventListener("click", function () {
    openLightbox(10);
  });
}

// ===== GALLERY LIGHTBOX WITH NAVIGATION =====
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var lightboxCounter = document.getElementById("lightboxCounter");
var gallerySrcs = [];
var currentGalleryIndex = 0;

// Build gallery sources array
document.querySelectorAll(".gallery-item img").forEach(function (img) {
  gallerySrcs.push(img.src);
});

function openLightbox(index) {
  currentGalleryIndex = index;
  lightboxImg.src = gallerySrcs[index];
  lightboxCounter.textContent = index + 1 + " / " + gallerySrcs.length;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function showPrev() {
  currentGalleryIndex =
    (currentGalleryIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
  lightboxImg.src = gallerySrcs[currentGalleryIndex];
  lightboxCounter.textContent =
    currentGalleryIndex + 1 + " / " + gallerySrcs.length;
}

function showNext() {
  currentGalleryIndex = (currentGalleryIndex + 1) % gallerySrcs.length;
  lightboxImg.src = gallerySrcs[currentGalleryIndex];
  lightboxCounter.textContent =
    currentGalleryIndex + 1 + " / " + gallerySrcs.length;
}

document.querySelectorAll(".gallery-item").forEach(function (item, idx) {
  item.addEventListener("click", function () {
    openLightbox(idx);
  });
});

document
  .getElementById("lightboxClose")
  .addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", function (e) {
  e.stopPropagation();
  showPrev();
});
document.getElementById("lightboxNext").addEventListener("click", function (e) {
  e.stopPropagation();
  showNext();
});

lightbox.addEventListener("click", function (e) {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", function (e) {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// ===== RSVP DIALOG — SHOW WHEN FOOTER IS VISIBLE =====
(function () {
  // Google Apps Script web app URL — replace with your deployed URL
  var GOOGLE_SHEET_URL =
    "https://script.google.com/macros/s/AKfycbxBe2mvRoLGCjqSeX_LbI0a1nMUYsz81JFtMaOeJM8nKKPECfYL4P4VWCTjelbzido3/exec";

  function sendRsvpToSheet(name, title, attendance) {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE")
      return;
    fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "",
        title: title || "",
        attendance: attendance,
        timestamp: new Date().toISOString(),
      }),
    }).catch(function () {});
  }

  var dialog = document.getElementById("rsvpDialog");
  var questionEl = document.getElementById("rsvpQuestion");
  var buttonsEl = document.querySelector(".rsvp-dialog-buttons");
  var responseEl = document.getElementById("rsvpResponse");
  var footer = document.querySelector(".footer");
  var dialogShown = false;

  // Personalize from URL params
  // Usage: index.html?title=Anh&guestName=NguyenVanA
  var params = new URLSearchParams(window.location.search);
  var guestName = params.get("guestName");
  var titleParam = params.get("title");

  if (guestName) {
    var formattedName = guestName.replace(/([A-Z])/g, " $1").trim();
    var titleText = titleParam
      ? titleParam.charAt(0).toUpperCase() + titleParam.slice(1)
      : "";
    var displayName = titleText
      ? titleText + " " + formattedName
      : formattedName;
    questionEl.textContent =
      displayName + " chắc chắn tham dự cùng chúng em chứ?";
  }

  // Show dialog when user scrolls to the footer (not on initial load)
  var hasScrolled = false;
  window.addEventListener("scroll", function () {
    hasScrolled = true;
  }, { once: true });

  function checkScroll() {
    if (dialogShown) return;
    if (!hasScrolled) return;
    if (!footer) return;
    var rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      dialogShown = true;
      dialog.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  window.addEventListener("scroll", checkScroll);

  // "Chắc chắn chứ!" button
  document.getElementById("rsvpYes").addEventListener("click", function () {
    sendRsvpToSheet(guestName, titleParam, "yes");
    buttonsEl.style.display = "none";
    responseEl.innerHTML =
      '<i class="fas fa-check-circle" style="color: var(--gold); font-size: 2rem; display: block; margin-bottom: 12px;"></i>Cảm ơn bạn! Chúng tôi rất vui được đón tiếp bạn.';
    responseEl.classList.add("show");
    setTimeout(function () {
      dialog.classList.remove("active");
      document.body.style.overflow = "";
    }, 2500);
  });

  // "Tiếc quá, tôi bận rồi" button
  document.getElementById("rsvpNo").addEventListener("click", function () {
    sendRsvpToSheet(guestName, titleParam, "no");
    buttonsEl.style.display = "none";
    responseEl.innerHTML =
      '<i class="fas fa-heart" style="color: var(--gold); font-size: 2rem; display: block; margin-bottom: 12px;"></i>Rất tiếc! Chúng tôi vẫn gửi đến bạn những lời chúc tốt đẹp nhất.';
    responseEl.classList.add("show");
    setTimeout(function () {
      dialog.classList.remove("active");
      document.body.style.overflow = "";
    }, 2500);
  });

  // Close on overlay click
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) {
      dialog.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
})();

// ===== MUSIC TOGGLE =====
var musicBtn = document.getElementById("musicBtn");
var bgMusic = document.getElementById("bgMusic");

musicBtn.addEventListener("click", function () {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.classList.remove("playing");
  } else {
    bgMusic.play().catch(function () {});
    musicBtn.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

// ===== COUPLE ILLUSTRATION — HEARTS FLY ON HOVER =====
(function () {
  var coupleEl = document.getElementById("coupleIllustration");
  var heartsContainer = document.getElementById("coupleHearts");
  var heartInterval = null;
  var heartSymbols = ["\u2764", "\u2665", "\u2763", "\u2766"];

  function spawnHeart() {
    var heart = document.createElement("span");
    heart.className = "flying-heart";
    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 50 + "px";
    heart.style.fontSize = 0.6 + Math.random() * 0.8 + "rem";
    heart.style.animationDuration = 1 + Math.random() * 1 + "s";
    heartsContainer.appendChild(heart);
    setTimeout(function () {
      heart.remove();
    }, 2000);
  }

  coupleEl.addEventListener("mouseenter", function () {
    spawnHeart();
    heartInterval = setInterval(spawnHeart, 300);
  });

  coupleEl.addEventListener("mouseleave", function () {
    clearInterval(heartInterval);
    heartInterval = null;
  });

  // Touch support for mobile
  coupleEl.addEventListener("touchstart", function () {
    for (var i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 200);
    }
  });
})();
