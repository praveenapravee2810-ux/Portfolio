const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), message: "Please enter your name." },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error"), message: "Enter a valid email address." },
  { input: document.querySelector("#message"), error: document.querySelector("#message-error"), message: "Please add a short message." }
];

function validateField(field) {
  const value = field.input.value.trim();
  let valid = value.length > 0;
  if (field.input.type === "email") {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  field.input.setAttribute("aria-invalid", String(!valid));
  field.error.textContent = valid ? "" : field.message;
  return valid;
}

fields.forEach((field) => {
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") validateField(field);
    statusMessage.textContent = "";
    statusMessage.classList.remove("error");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);
  if (!isValid) {
    statusMessage.textContent = "Please correct the highlighted fields.";
    statusMessage.classList.add("error");
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
    return;
  }
  statusMessage.textContent = "Your details look good. This demo doesn't send messages yet.";
  statusMessage.classList.remove("error");
});
