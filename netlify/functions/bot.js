exports.handler = async (event) => {
  const TOKEN = process.env.BOT_TOKEN;
  const DOCTOR = String(process.env.DOCTOR_ID);
  const api = (method, body) =>
    fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (event.httpMethod === "GET") {
    const r = await api("sendMessage", { chat_id: DOCTOR, text: "Test from TesfaCare bot" });
    return {
      statusCode: 200,
      body: JSON.stringify({ tokenSet: !!TOKEN, doctorId: DOCTOR, telegram: await r.json() }),
    };
  }
  try {
    const msg = JSON.parse(event.body || "{}").message;
    if (!msg) return { statusCode: 200, body: "ok" };
    const from = String(msg.chat.id);

    if (from === DOCTOR) {
      const rep = msg.reply_to_message;
      const m = rep && (rep.text || "").match(/#(\d+)/);
      if (m) await api("sendMessage", { chat_id: m[1], text: msg.text });
      else await api("sendMessage", { chat_id: DOCTOR, text: "Reply to a client's message to answer them." });
    } else if (msg.text === "/start") {
      await api("sendMessage", { chat_id: from, text: "Welcome to TesfaCare. Send your question and Dr. Tesfalem will reply here." });
    } else {
      const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
      await api("sendMessage", { chat_id: DOCTOR, text: `From: ${name}\n#${from}\n\n${msg.text || "[non-text message]"}` });
      await api("sendMessage", { chat_id: from, text: "Received. The doctor will reply soon." });
    }
  } catch (e) {
    console.error(e);
  }
  return { statusCode: 200, body: "ok" };
};
