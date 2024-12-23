export function generateConfirmationEmail(email: string, name?: string | null) {
  const userName = name || "there";

  return {
    subject: "Welcome to app2agent waitlist!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${userName}! 👋</h2>
        <p>Thanks for your interest in app2agent! I'm excited to have you on board.</p>
        <p>I'm currently working hard on building something that will help transform enterprise applications. I'll keep you updated about the launch and any early access opportunities.</p>
        <p>If you have any questions or specific use cases you'd like to discuss, feel free to reply to this email - I'd love to hear from you!</p>
        <br/>
        <p>Best regards,</p>
        <p>Marcus Schiesser<br/>Founder of app2agent</p>
      </div>
    `,
  };
}
