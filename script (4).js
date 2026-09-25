// Exam Rescue — front-end only WhatsApp routing
// Change this if the WhatsApp number ever changes (international format, no + or leading 0)
const WHATSAPP_NUMBER = "923455407001";

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function setStatus(el, text, isError) {
  el.textContent = text;
  el.classList.toggle("error", Boolean(isError));
}

// Planner form
const plannerForm = document.getElementById("plannerForm");
const plannerStatus = document.getElementById("plannerStatus");

if (plannerForm) {
  plannerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(plannerForm);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const whatsapp = data.get("whatsapp").trim();
    const grade = data.get("grade").trim();
    const subject = data.get("subject").trim();

    if (!name || !email || !whatsapp || !grade || !subject) {
      setStatus(plannerStatus, "Please fill in all fields.", true);
      return;
    }

    const message =
      `Hi Exam Rescue! I'd like my FREE 7-Day Revision Planner.\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `Class/Grade: ${grade}\n` +
      `Main Subject: ${subject}`;

    setStatus(plannerStatus, "Opening WhatsApp…", false);
    openWhatsApp(message);
    plannerForm.reset();
  });
}

// Contact form
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const message_ = data.get("message").trim();

    if (!name || !email || !message_) {
      setStatus(contactStatus, "Please fill in all fields.", true);
      return;
    }

    const message =
      `Hi Exam Rescue! I have a question.\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message: ${message_}`;

    setStatus(contactStatus, "Opening WhatsApp…", false);
    openWhatsApp(message);
    contactForm.reset();
  });
}
