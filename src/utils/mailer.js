export async function sendContactEmail(data) {
  const payload = {
    from: process.env.MAIL_FROM || "soleva@resend.dev",
    to: process.env.MAIL_TO || "leenkkrayem@gmail.com",
    reply_to: data.email,
    subject: `New contact from ${data.name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${escape(data.name)}</p>
      <p><strong>Email:</strong> ${escape(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escape(data.phone)}</p>` : ""}
      ${data.projectType ? `<p><strong>Project:</strong> ${escape(data.projectType)}</p>` : ""}
      ${data.budget ? `<p><strong>Budget:</strong> ${escape(data.budget)}</p>` : ""}
      <hr/>
      <p>${escape(data.message).replace(/\n/g, "<br/>")}</p>
    `,
  };

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json?.message || "Resend send failed");

  return { messageId: json.id, accepted: [payload.to] };
}

function escape(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
