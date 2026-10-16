// User facing newsletter copy, shared by the route handler and the form.
// Wording is from docs/CONTENT-PACK.md sections 11 and the check-email page.

export const newsletterMessages = {
  invalidEmail: "Enter a valid email address.",
  failure: "Something went wrong. Please try again in a moment.",
  successHeading: "Check your email",
  success:
    "A confirmation email is on its way. Click the link inside to finish subscribing. If it does not arrive within a few minutes, check the spam or promotions folder.",
} as const;
