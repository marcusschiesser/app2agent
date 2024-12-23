export function generateNotificationEmail(
  userEmail: string,
  name?: string | null,
  intendedUsage?: string | null,
) {
  return {
    subject: "New app2agent Signup!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Waitlist Signup 🎉</h2>
        <p>Someone new has joined the app2agent waitlist!</p>
        <br/>
        <h3>Details:</h3>
        <ul>
          <li><strong>Email:</strong> ${userEmail}</li>
          ${name ? `<li><strong>Name:</strong> ${name}</li>` : ""}
          ${intendedUsage ? `<li><strong>Intended Usage:</strong> ${intendedUsage}</li>` : ""}
        </ul>
      </div>
    `,
  };
}
