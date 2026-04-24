// ============================================================
//  Sena High School — EmailJS Form Integration
//  Instructions:
//  1. Replace the three placeholders below with your real IDs
//  2. Add these two lines to your HTML <head> (before this script):
//       <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
//       <script>emailjs.init("YOUR_PUBLIC_KEY");</script>
//  3. Link this file in your HTML just before </body>:
//       <script src="emailjs-form.js"></script>
// ============================================================

const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
// Public key is already set in emailjs.init() in your <head>

// ─── Override the handleSubmit function from your existing script ───
function handleSubmit() {
  // Grab field values
  const firstName   = document.getElementById("first-name").value.trim();
  const lastName    = document.getElementById("last-name").value.trim();
  const email       = document.getElementById("email").value.trim();
  const inquiryEl   = document.querySelector("select");
  const inquiry     = inquiryEl ? inquiryEl.value : "";
  const messageEl   = document.querySelector("textarea");
  const message     = messageEl ? messageEl.value.trim() : "";

  // Basic validation
  if (!firstName || !lastName) {
    showToast("Please enter your full name.", true);
    return;
  }
  if (!email || !email.includes("@")) {
    showToast("Please enter a valid email address.", true);
    return;
  }
  if (!message) {
    showToast("Please write a message before sending.", true);
    return;
  }

  // Disable button while sending
  const btn = document.querySelector(".submit-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sending…";
  }

  // Template parameters — these must match the variable names
  // you used when building your EmailJS template
  const templateParams = {
    from_name:    `${firstName} ${lastName}`,
    from_email:   email,
    inquiry_type: inquiry || "Not specified",
    message:      message,
    reply_to:     email,
  };

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      showToast("Message sent! We will get back to you shortly. ✓");
      clearForm();
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      showToast("Oops! Something went wrong. Please try again.", true);
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    });
}

// ─── Toast helper (supports error variant) ───
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.borderLeftColor = isError ? "#e55" : "var(--gold)";
  toast.style.color = isError ? "#fdd" : "var(--gold-light, #e8c96a)";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}

// ─── Clear the form after successful send ───
function clearForm() {
  const fields = ["first-name", "last-name", "email"];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const select = document.querySelector("select");
  if (select) select.selectedIndex = 0;
  const textarea = document.querySelector("textarea");
  if (textarea) textarea.value = "";
}
