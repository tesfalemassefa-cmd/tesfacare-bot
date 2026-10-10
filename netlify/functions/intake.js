const crypto = require("crypto");

function verify(initData, token) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const dcs = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(token).digest();
  const calc = crypto.createHmac("sha256", secret).update(dcs).digest("hex");
  if (calc.length !== hash.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(hash))) return null;
  const age = Date.now() / 1000 - Number(params.get("auth_date") || 0);
  if (age > 86400) return null;
  try { return JSON.parse(params.get("user")); } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  const TOKEN = process.env.BOT_TOKEN;
  const DOCTOR = String(process.env.DOCTOR_ID);

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, body: "Bad request" }; }

  const user = verify(String(body.initData || ""), TOKEN);
  if (!user || !user.id) return { statusCode: 401, body: "Unauthorized" };

  const f = body.form || {};
  const s = (v, n = 500) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n);
  const arr = (v) => (Array.isArray(v) ? v.slice(0, 12).map((x) => s(x, 60)).join(", ") : "");
  const danger = Array.isArray(f.danger) ? f.danger.slice(0, 12).map((x) => s(x, 60)) : [];
  const pregnant = f.status === "pregnant";

  const lines = [];
  if (danger.length) lines.push("🚨 URGENT - danger signs reported");
  lines.push("📋 New intake form");
  lines.push(`From: ${s(f.name, 80)}${user.username ? " (@" + user.username + ")" : ""}`);
  lines.push(`#${user.id}`);
  lines.push("");
  lines.push(`Age: ${s(f.age, 3)}`);
  lines.push(`Status: ${pregnant ? "Pregnant" : "Not pregnant"}`);
  if (pregnant) {
    lines.push(`Weeks: ${f.weeks === "unknown" ? "unknown" : s(f.weeks, 3)}`);
    lines.push(`Previous pregnancies: ${s(f.prev, 3)}`);
    lines.push(`Previous cesarean: ${f.csec === "yes" ? "Yes" : "No"}`);
  }
  lines.push(`Concern: ${s(f.concern, 800)}`);
  lines.push(`Conditions: ${arr(f.conditions) || "none reported"}`);
  lines.push(`Medicines/allergies: ${s(f.meds, 200) || "none reported"}`);
  if (pregnant) lines.push(`Danger signs: ${danger.join(", ") || "none"}`);
  lines.push(`Language: ${f.lang === "am" ? "Amharic" : "English"}`);

  const api = (method, payload) =>
    fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const r = await api("sendMessage", { chat_id: DOCTOR, text: lines.join("\n").slice(0, 4000) });
  if (!r.ok) return { statusCode: 502, body: "Send failed" };

  const am = f.lang === "am";
  const confirm = am
    ? "መረጃዎ ደርሶናል፣ ዶክተር ተስፋዓለም በቅርቡ ይመልሳሉ።"
    : "We received your information. Dr. Tesfalem will reply soon.";
  const urgent = am
    ? "\n\n⚠️ ያመለከቱት ምልክት አደገኛ ሊሆን ይችላል። ሳይዘገዩ ወደ ቅርብ ጤና ተቋም ይሂዱ።"
    : "\n\n⚠️ The signs you reported may be dangerous. Please go to the nearest health facility without delay.";
  await api("sendMessage", { chat_id: user.id, text: confirm + (danger.length ? urgent : "") });

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
