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

// ===== PERSONALIZE INTRO =====
(function () {
  var params = new URLSearchParams(window.location.search);
  var title = params.get("title") || "";
  var guestName = params.get("guestName") || "";
  var introGuestName = document.getElementById("introGuestName");
  if (title || guestName) {
    introGuestName.textContent = (title ? title + " " : "") + guestName;
  }
})();

// ===== RENDER TIỆC CƯỚI BY TYPE (groom/bride) =====
(function () {
  var params = new URLSearchParams(window.location.search);
  var type = params.get("type") || "bride";
  var nhaGai = document.getElementById("venueNhaGai");
  var nhaTrai = document.getElementById("venueNhaTrai");

  if (type === "groom") {
    nhaGai.style.display = "none";
    nhaTrai.style.display = "";
  } else {
    nhaGai.style.display = "";
    nhaTrai.style.display = "none";
  }
})();

(function () {
  var overlay = document.getElementById("introOverlay");

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
  var weddingDate = new Date("2026-04-19T15:30:00+07:00");
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
    openLightbox(4);
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
    if (
      !GOOGLE_SHEET_URL ||
      GOOGLE_SHEET_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
    )
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
  // Usage: index.html?title=Anh&guestName=Cuong
  var params = new URLSearchParams(window.location.search);
  var guestName = params.get("guestName");
  var titleParam = params.get("title");

  if (guestName) {
    var displayName = titleParam ? titleParam + " " + guestName : guestName;
    var t = (titleParam || "").toLowerCase().trim();
    var pronoun = "chúng em";
    if (t === "bạn") pronoun = "chúng mình";
    else if (t === "bác" || t === "cô" || t === "chú" || t === "dì")
      pronoun = "chúng con";
    questionEl.textContent =
      displayName + " chắc chắn tham dự cùng " + pronoun + " chứ?";
  }

  // Show dialog when user scrolls to the footer (not on initial load)
  var hasScrolled = false;
  window.addEventListener(
    "scroll",
    function () {
      hasScrolled = true;
    },
    { once: true },
  );

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

// ===== WISHES (GOOGLE SHEETS) =====
(function () {
  // Google Apps Script web app URL for wishes
  // Deploy a new Apps Script that handles GET (return wishes) and POST (add wish)
  var WISHES_SHEET_URL =
    "https://script.google.com/macros/s/AKfycbwW4lrpBLkN_njMnz5B3GJpWqyXihlK6lDFukost5yaWBVxlU1pbNvU4nKDI_bYiFuzfw/exec";

  var wishesList = document.getElementById("wishesList");
  var wishInput = document.getElementById("bottomWishInput");
  var wishSendBtn = document.getElementById("bottomWishSend");

  function timeAgo(dateStr) {
    var now = new Date();
    var date = new Date(dateStr);
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return Math.floor(diff / 60) + " phút trước";
    if (diff < 86400) return Math.floor(diff / 3600) + " giờ trước";
    return Math.floor(diff / 86400) + " ngày trước";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderWishes(wishes) {
    wishesList.innerHTML = "";
    if (!wishes || !wishes.length) {
      wishesList.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);">Hãy là người đầu tiên gửi lời chúc!</p>';
      return;
    }
    wishes
      .slice()
      .reverse()
      .forEach(function (wish) {
        var card = document.createElement("div");
        card.className = "wish-card";
        card.innerHTML =
          '<div class="wish-card-header">' +
          '<div class="wish-avatar">' +
          wish.name.charAt(0).toUpperCase() +
          "</div>" +
          '<span class="wish-name">' +
          escapeHtml(wish.name) +
          "</span>" +
          '<span class="wish-time">' +
          timeAgo(wish.time) +
          "</span>" +
          "</div>" +
          '<div class="wish-message">' +
          escapeHtml(wish.message) +
          "</div>";
        wishesList.appendChild(card);
      });
  }

  function loadWishes() {
    fetch(WISHES_SHEET_URL, { redirect: "follow" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderWishes(data.wishes || []);
      })
      .catch(function () {
        // Fallback: try JSONP approach
        var script = document.createElement("script");
        window._wishesCallback = function (data) {
          renderWishes(data.wishes || []);
          delete window._wishesCallback;
        };
        script.src = WISHES_SHEET_URL + "?callback=_wishesCallback";
        script.onerror = function () {
          renderWishes([]);
        };
        document.head.appendChild(script);
      });
  }

  function submitWish() {
    var message = wishInput.value.trim();
    if (!message) return;

    var params = new URLSearchParams(window.location.search);
    var guestName = params.get("guestName");
    var title = params.get("title") || "";
    var name = guestName || "Khách mời";
    if (title) name = title + " " + name;

    var wish = { name: name, message: message, time: new Date().toISOString() };

    // Send to Google Sheets
    fetch(WISHES_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wish),
    }).catch(function () {});

    wishInput.value = "";
    // Scroll to wishes section
    document.getElementById("wishes").scrollIntoView({ behavior: "smooth" });

    // Reload wishes after a short delay to allow the sheet to update
    setTimeout(loadWishes, 1500);
  }

  wishSendBtn.addEventListener("click", submitWish);
  wishInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitWish();
  });

  // Load wishes on page load
  loadWishes();
})();

// ===== GIFT SIDEBAR =====
(function () {
  var giftBtn = document.getElementById("bottomGiftBtn");
  var giftSidebar = document.getElementById("giftSidebar");
  var giftOverlay = document.getElementById("giftOverlay");
  var giftClose = document.getElementById("giftClose");

  function openGift() {
    giftSidebar.classList.add("active");
    giftOverlay.classList.add("active");
  }

  function closeGift() {
    giftSidebar.classList.remove("active");
    giftOverlay.classList.remove("active");
  }

  giftBtn.addEventListener("click", openGift);
  var giftsOpenBtn = document.getElementById("giftsOpenBtn");
  if (giftsOpenBtn) giftsOpenBtn.addEventListener("click", openGift);
  giftOverlay.addEventListener("click", closeGift);
  giftClose.addEventListener("click", closeGift);
})();
