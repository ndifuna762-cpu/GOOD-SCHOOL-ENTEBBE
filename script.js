
const EMAILJS_SERVICE_ID  = "service_gcn6u54";   // e.g. "service_gcn6u54"
const EMAILJS_TEMPLATE_ID = "template_7wbmtrv";  // e.g. "template_7wbmtr"
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
