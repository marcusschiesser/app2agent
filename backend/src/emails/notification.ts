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
