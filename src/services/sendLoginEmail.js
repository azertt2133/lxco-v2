import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_abc123";
const TEMPLATE_ID = "template_ujw77ho";
const PUBLIC_KEY = "eYBZRXqTcWS-sXkzL";

export const sendLoginEmail = (userEmail) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: userEmail,
      login_time: new Date().toLocaleString(),
    },
    PUBLIC_KEY
  );
};