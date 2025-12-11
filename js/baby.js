document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Animation using Intersection Observer
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target elements to animate
  const animatedElements = document.querySelectorAll(
    ".profile-card, .section-title, .gallery-item, .timeline-content"
  );
  animatedElements.forEach((el) => observer.observe(el));

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Form Submission Handling
  const form = document.querySelector(".wishes-form");
  const wishesListContainer = $(".wishes-list"); // Use jQuery for easier manipulation with WishManager response

  // Initial Load of Wishes (Type 2 for Baby)
  if (typeof WishManager !== "undefined") {
    WishManager.fetchWishes(2, function (wishes) {
      renderBabyWishes(wishes);
    });
  }

  function renderBabyWishes(wishes) {
    wishesListContainer.empty();
    if (!wishes || wishes.length === 0) {
      wishesListContainer.append(
        '<p class="text-center text-muted">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>'
      );
      return;
    }

    // Reverse to show newest first? Or assume API returns sorted.
    // Usually API returns newest first or we prepend.
    wishes.forEach((wish) => {
      const initial = wish.name ? wish.name.charAt(0).toUpperCase() : "?";
      const colors = ["#81D4FA", "#FFCDD2", "#C5CAE9", "#B39DDB", "#80DEEA"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const wishItem = `
                <div class="wish-card fade-in-up">
                    <div class="wish-avatar" style="background-color: ${randomColor};">${initial}</div>
                    <div class="wish-content">
                        <h4>${wish.name}</h4>
                        <p>${wish.wish_message}</p>
                    </div>
                </div>`;
      wishesListContainer.append(wishItem);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[type="text"]');
      const messageInput = form.querySelector("textarea");
      const btn = form.querySelector(".btn-submit");

      if (!nameInput.value || !messageInput.value) return;

      const originalText = btn.innerText;
      btn.innerText = "Đang gửi...";
      btn.disabled = true;
    });
  }

  // Sparkle Mouse Trail Effect
  document.addEventListener("mousemove", function (e) {
    if (Math.random() > 0.85) {
      // Only create sparkles occasionally to avoid lag
      createSparkle(e.pageX, e.pageY);
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    // Random slight offsets
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    sparkle.style.left = x + offsetX + "px";
    sparkle.style.top = y + offsetY + "px";

    document.body.appendChild(sparkle);

    // Remove after animation completes
    setTimeout(() => {
      sparkle.remove();
    }, 800); // Matches CSS animation duration
  }

  console.log("Baby page scripts loaded successfully! 🍼");
});
