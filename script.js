
/* Birthday surprise website for Zaryabb Kamran.
   Birthday: 11 October 2026 at 00:00 Pakistan Standard Time (UTC+05:00). */
(() => {
  "use strict";

  const BIRTHDAY_ISO = "2026-10-11T00:00:00+05:00";
  const OPTIONAL_PASSCODE = ""; // Leave empty to allow any passcode.
  const birthday = new Date(BIRTHDAY_ISO);
  const $ = (id) => document.getElementById(id);

  const screens = [
    "gateScreen",
    "birthdayScreen",
    "memoriesScreen",
    "videoScreen",
    "letterScreen",
    "finaleScreen"
  ];

  let musicPlaying = false;
  let countdownTimer = null;

  function showScreen(id) {
    screens.forEach((screenId) => {
      const screen = $(screenId);
      if (screen) {
        screen.classList.toggle("hidden", screenId !== id);
      }
    });

    const activeIndex = screens.indexOf(id);

    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (id === "finaleScreen") {
      burstConfetti(100);
    }
  }

  // Show or hide the optional passcode.
  if ($("togglePass") && $("passcode")) {
    $("togglePass").addEventListener("click", () => {
      const pass = $("passcode");
      const showing = pass.type === "text";

      pass.type = showing ? "password" : "text";

      $("togglePass").setAttribute(
        "aria-label",
        showing ? "Show passcode" : "Hide passcode"
      );
    });
  }

  // Unlock form: one submit handler only.
  if ($("unlockForm")) {
    $("unlockForm").addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("guestName")?.value.trim() || "";
      const passcode = $("passcode")?.value || "";
      const error = $("gateError");

      if (!name) {
        if (error) {
          error.textContent = "Please enter his name first 💗";
        }
        $("guestName")?.focus();
        return;
      }

      if (OPTIONAL_PASSCODE && passcode !== OPTIONAL_PASSCODE) {
        if (error) {
          error.textContent =
            "That passcode isn't quite right. Try again 💌";
        }
        $("passcode")?.focus();
        return;
      }

      if (error) error.textContent = "";

      showScreen("birthdayScreen");
      updateCountdown();
    });
  }

  // Navigate to the memories section.
  $("openLoveButton")?.addEventListener("click", () => {
    showScreen("memoriesScreen");
  });

  // Navigate to the love letter.
  $("finalSurpriseButton")?.addEventListener("click", () => {
    showScreen("letterScreen");
  });

  // Bottom navigation dots.
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = dot.dataset.target;

      if (screens.includes(target)) {
        showScreen(target);
      }
    });
  });

  // Memory slideshow.
  $("playMovieButton")?.addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".memory-card")];

    const photos = cards
      .map((card) => {
        const img = card.querySelector("img");
        const caption = card.querySelector("figcaption");

        return {
          src: img?.currentSrc || img?.src || "",
          caption: caption?.textContent.trim() || "A precious memory",
          loaded: Boolean(
            img && img.complete && img.naturalWidth > 0
          )
        };
      })
      .filter((photo) => photo.loaded && photo.src);

    if (!photos.length) {
      if ($("movieStatus")) {
        $("movieStatus").textContent =
          "Please add your photos to the assets folder first.";
      }
      return;
    }

    let overlay = $("memorySlideshow");
    let current = 0;

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "memorySlideshow";
      overlay.className = "memory-slideshow";

      overlay.innerHTML = `
        <div class="slideshow-box"
             role="dialog"
             aria-modal="true"
             aria-label="Our memory slideshow">

          <button type="button"
                  class="slide-close"
                  aria-label="Close slideshow">×</button>

          <button type="button"
                  class="slide-prev"
                  aria-label="Previous photo">❮</button>

          <img class="slide-image" alt="Our memory">

          <button type="button"
                  class="slide-next"
                  aria-label="Next photo">❯</button>

          <h3 class="slide-caption"></h3>
          <p class="slide-counter"></p>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.querySelector(".slide-close")
        .addEventListener("click", () => {
          overlay.classList.remove("show");
        });

      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          overlay.classList.remove("show");
        }
      });

      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          overlay.classList.contains("show")
        ) {
          overlay.classList.remove("show");
        }
      });
    }

    function renderSlide() {
      overlay.querySelector(".slide-image").src =
        photos[current].src;

      overlay.querySelector(".slide-caption").textContent =
        photos[current].caption;

      overlay.querySelector(".slide-counter").textContent =
        `Memory ${current + 1} of ${photos.length}`;
    }

    // Update the arrow actions every time the slideshow opens.
    overlay.querySelector(".slide-prev").onclick = () => {
      current = (current - 1 + photos.length) % photos.length;
      renderSlide();
    };

    overlay.querySelector(".slide-next").onclick = () => {
      current = (current + 1) % photos.length;
      renderSlide();
    };

    renderSlide();
    overlay.classList.add("show");

    if ($("movieStatus")) {
      $("movieStatus").textContent =
        "Our beautiful memories, just for us ❤️";
    }
  });

  // Read the love letter.
  $("readLetterButton")?.addEventListener("click", () => {
    const card = $("letterCard");

    if (card) {
      card.classList.remove("letter-reveal");
      void card.offsetWidth;
      card.classList.add("letter-reveal");
    }

    if ($("letterStatus")) {
      $("letterStatus").textContent =
        "Every word is from the heart ❤️";
    }
  });

  // Copy the love letter.
  $("copyLetterButton")?.addEventListener("click", async () => {
    const card = $("letterCard");
    if (!card) return;

    const text = card.innerText;

    try {
      await navigator.clipboard.writeText(text);

      if ($("letterStatus")) {
        $("letterStatus").textContent =
          "Letter copied! You can paste it into a message 💌";
      }
    } catch {
      const area = document.createElement("textarea");

      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";

      document.body.appendChild(area);
      area.select();

      let copied = false;

      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }

      area.remove();

      if ($("letterStatus")) {
        $("letterStatus").textContent = copied
          ? "Letter copied! 💌"
          : "Copy isn't available here. Please select and copy the letter manually.";
      }
    }
  });

  // Reveal or hide the secret birthday gift.
  $("giftButton")?.addEventListener("click", () => {
    const message = $("giftMessage");
    if (!message) return;

    message.classList.toggle("hidden");

    const isHidden = message.classList.contains("hidden");

    $("giftButton").innerHTML = isHidden
      ? 'Open Your Gift <span>🎁</span>'
      : 'Close Your Gift <span>♡</span>';

    if (!isHidden) {
      burstConfetti(65);
    }
  });

  // Restart the birthday surprise.
  $("restartButton")?.addEventListener("click", () => {
    $("giftMessage")?.classList.add("hidden");

    if ($("giftButton")) {
      $("giftButton").innerHTML =
        'Open Your Gift <span>🎁</span>';
    }

    showScreen("gateScreen");
  });

  // Background music.
  // Browsers require a user interaction before audio can play.
  $("musicToggle")?.addEventListener("click", async () => {
    const audio = $("backgroundMusic");
    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;

      $("musicToggle").textContent = "♫";
      $("musicToggle").setAttribute(
        "aria-label",
        "Play background music"
      );

      return;
    }

    try {
      await audio.play();

      musicPlaying = true;
      $("musicToggle").textContent = "Ⅱ";
      $("musicToggle").setAttribute(
        "aria-label",
        "Pause background music"
      );
    } catch {
      alert(
        "Add your song as assets/our-song.mp3, then click the music button again."
      );
    }
  });

  // Countdown to birthday midnight.
  function updateCountdown() {
    const diff = birthday.getTime() - Date.now();
    const label = $("countdownLabel");

    if (diff <= 0) {
      if ($("days")) $("days").textContent = "00";
      if ($("hours")) $("hours").textContent = "00";
      if ($("minutes")) $("minutes").textContent = "00";
      if ($("seconds")) $("seconds").textContent = "00";

      if (label) {
        label.textContent =
          "It's your birthday — let the magic begin! 🎂";
      }

      if ($("afterMidnightNote")) {
        $("afterMidnightNote").textContent =
          "Happy Birthday, Zaryabb! ❤️";
      }

      if (countdownTimer) {
        clearInterval(countdownTimer);
      }

      return;
    }

    const total = Math.floor(diff / 1000);

    if ($("days")) {
      $("days").textContent = String(
        Math.floor(total / 86400)
      ).padStart(2, "0");
    }

    if ($("hours")) {
      $("hours").textContent = String(
        Math.floor((total % 86400) / 3600)
      ).padStart(2, "0");
    }

    if ($("minutes")) {
      $("minutes").textContent = String(
        Math.floor((total % 3600) / 60)
      ).padStart(2, "0");
    }

    if ($("seconds")) {
      $("seconds").textContent = String(
        total % 60
      ).padStart(2, "0");
    }
  }

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  // Display the birthday date in Pakistan's timezone.
  if ($("birthdayDateLabel")) {
    $("birthdayDateLabel").textContent =
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        timeZone: "Asia/Karachi"
      }).format(birthday);
  }

  // Animated confetti.
  function burstConfetti(count) {
    const layer = $("confettiLayer");
    if (!layer) return;

    const colors = [
      "#ff2e79",
      "#ffd2e4",
      "#ffb82e",
      "#fff0f6",
      "#c72c81"
    ];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty(
        "--drift",
        Math.random() * 220 - 110 + "px"
      );

      piece.style.animationDelay =
        Math.random() * 1.4 + "s";

      piece.style.animationDuration =
        2.5 + Math.random() * 2 + "s";

      layer.appendChild(piece);

      setTimeout(() => piece.remove(), 5500);
    }
  }

  // Floating hearts in the background.
  function addFloatingHeart() {
    const layer = $("ambientHearts");
    if (!layer) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      ["♥", "♡", "❤"][Math.floor(Math.random() * 3)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize =
      12 + Math.random() * 23 + "px";

    heart.style.animationDuration =
      8 + Math.random() * 9 + "s";

    layer.appendChild(heart);

    setTimeout(() => heart.remove(), 18000);
  }

  for (let i = 0; i < 18; i++) {
    setTimeout(addFloatingHeart, i * 350);
  }

  setInterval(addFloatingHeart, 600);
})();
