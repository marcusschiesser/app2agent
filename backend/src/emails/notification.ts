export function generateNotificationEmail(formValues: {
  email: string;
  name: string;
  companyName: string;
  intendedUsage: string;
  linkedInProfile: string;
}) {
  return {
    subject: "New app2agent Signup!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Signup 🎉</h2>
        <p>Someone new has joined app2agent!</p>
        <br/>
        <h3>Details:</h3>
        <ul>
          <li><strong>Email:</strong> ${formValues.email}</li>
          <li><strong>Name:</strong> ${formValues.name}</li>
          <li><strong>Company:</strong> ${formValues.companyName}</li>
          <li><strong>Intended Usage:</strong> ${formValues.intendedUsage}</li>
          <li><strong>LinkedIn Profile:</strong> ${formValues.linkedInProfile || "Not provided"}</li>
        </ul>
      </div>
    `,
  };
}

export function generateInviteEmail(formValues: {
  email: string;
  name: string;
  signupUrl: string;
}) {
  return {
    from: "app2agent <no-reply@app2agent.com>",
    to: formValues.email,
    subject: "Your Invitation to app2agent",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to app2agent! 🎉</h2>
        <p>Hi ${formValues.name || "there"},</p>
        <p>We're excited to have you join app2agent! Click the button below to complete your signup:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${formValues.signupUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Complete Your Signup
          </a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #4F46E5;">${formValues.signupUrl}</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br/>The app2agent Team</p>
      </div>
    `,
  };
}
