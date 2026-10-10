// ===== EBOOKS: paste the sale link between the quotes when a book is ready =====
const EBOOKS = [
  { am: "📗 እርግዝና", en: "📗 Pregnancy", url: "" },
  { am: "📘 የወር አበባ ዑደት ከ ሀ እስከ ፐ", en: "📘 Menstrual Cycle A to Z", url: "" },
];
// ================================================================================

const T = {
  am: {
    menuTitle: "ምን ማወቅ ይፈልጋሉ? ከታች ይምረጡ።",
    b_danger: "⚠️ አደገኛ ምልክቶች",
    b_anc: "🩺 የቅድመ ወሊድ ክትትል",
    b_habits: "🥗 ጤናማ ልምዶች",
    b_ebook: "📚 ኢ-ቡክ ይግዙ",
    b_talk: "💬 ከዶክተር ተስፋዓለም ጋር ይነጋገሩ",
    b_menu: "⬅️ ወደ ዝርዝር ተመለስ",
    soon: "በቅርቡ ይወጣል",
    ebookHead: "📚 ኢ-ቡኮች\n\nበዶ/ር ተስፋዓለም የተጻፉ ኢ-ቡኮች፦\n",
    ebookBuy: "\n\nለመግዛት ከታች ያለውን ቁልፍ ይጫኑ።",
    danger:
      "⚠️ በእርግዝና ወቅት አደገኛ ምልክቶች\n\nከሚከተሉት ማንኛውም ካጋጠመዎት ወዲያውኑ ወደ ጤና ተቋም ይሂዱ፦\n• ከብልት ደም መፍሰስ\n• ከባድ ራስ ምታት ወይም የዓይን ብዥታ\n• የፊት ወይም የእጅ እብጠት\n• የጽንስ እንቅስቃሴ መቀነስ ወይም መቆም\n• የውሃ መፍሰስ\n• ከባድ የሆድ ሕመም\n• ትኩሳት ወይም ማንዘፍዘፍ\n\nይህ ቦት ለአደጋ ጊዜ አገልግሎት አይደለም።",
    anc:
      "🩺 የቅድመ ወሊድ ክትትል\n\nእርግዝና እንደተረጋገጠ በተቻለ ፍጥነት ክትትል ይጀምሩ። የዓለም ጤና ድርጅት ቢያንስ 8 ጊዜ ጉብኝት ይመክራል። በክትትል ጊዜ የደም ግፊት፣ ክብደት፣ የደም እና የሽንት ምርመራ፣ እንዲሁም የጽንስ ሁኔታ ይታያል። ጤና ባለሙያዎ በሚሰጥዎ ቀጠሮ ይሂዱ።",
    habits:
      "🥗 ጤናማ ልምዶች\n\n• ፎሊክ አሲድና ብረት (አይረን) በጤና ባለሙያ ምክር መሠረት ይውሰዱ\n• ሲጋራና አልኮል ይራቁ\n• ያለ ባለሙያ ምክር መድኃኒት አይውሰዱ\n• በቂ እረፍትና ንጹህ ውሃ ይጠጡ\n• ሚዛናዊ ምግብ ይመገቡ",
    talk:
      "💬 ከዶክተር ተስፋዓለም ጋር ለመነጋገር ጥያቄዎን እዚህ ይጻፉ።\n\nዕድሜዎን፣ የእርግዝና ሳምንትዎን እና ዋና ችግርዎን ይጻፉ። ዶ/ር ተስፋዓለም በዚሁ ይመልሱልዎታል።",
  },
  en: {
    menuTitle: "What would you like to know? Choose below.",
    b_danger: "⚠️ Danger signs",
    b_anc: "🩺 Antenatal care",
    b_habits: "🥗 Healthy habits",
    b_ebook: "📚 Buy ebook",
    b_talk: "💬 Talk to Dr. Tesfalem",
    b_menu: "⬅️ Back to menu",
    soon: "coming soon",
    ebookHead: "📚 Ebooks\n\nEbooks written by Dr. Tesfalem:\n",
    ebookBuy: "\n\nTap a button below to buy.",
    danger:
      "⚠️ Danger signs in pregnancy\n\nIf you have any of these, go to a health facility right away:\n• Vaginal bleeding\n• Severe headache or blurred vision\n• Swelling of the face or hands\n• Baby moving less or not at all\n• Leaking of fluid\n• Severe abdominal pain\n• Fever or convulsions\n\nThis bot is not for emergencies.",
    anc:
      "🩺 Antenatal care\n\nStart antenatal visits as soon as pregnancy is confirmed. The WHO recommends at least 8 contacts. At visits your blood pressure, weight, blood and urine tests, and the baby's wellbeing are checked. Attend the appointments your health worker gives you.",
    habits:
      "🥗 Healthy habits\n\n• Take folic acid and iron as advised by your health worker\n• Avoid smoking and alcohol\n• Don't take medicines without professional advice\n• Rest well and drink clean water\n• Eat a balanced diet",
    talk:
      "💬 To talk to Dr. Tesfalem, write your question here.\n\nInclude your age, your week of pregnancy, and your main problem. Dr. Tesfalem will reply here.",
  },
};

const menu = (lang) => ({
  inline_keyboard: ["danger", "anc", "habits", "ebook", "talk"].map((k) => [
    { text: T[lang]["b_" + k], callback_data: `${k}:${lang}` },
  ]),
});

const back = (lang) => ({
  inline_keyboard: [[{ text: T[lang].b_menu, callback_data: `menu:${lang}` }]],
});

const ebookText = (lang) => {
  const lines = EBOOKS.map((b) => `${b[lang]}${b.url ? "" : " — " + T[lang].soon}`).join("\n");
  const anyReady = EBOOKS.some((b) => b.url);
  return T[lang].ebookHead + lines + (anyReady ? T[lang].ebookBuy : "");
};

const ebookMarkup = (lang) => ({
  inline_keyboard: [
    ...EBOOKS.filter((b) => b.url).map((b) => [{ text: "🛒 " + b[lang], url: b.url }]),
    [{ text: T[lang].b_menu, callback_data: `menu:${lang}` }],
  ],
});

const langChoice = {
  inline_keyboard: [
    [{ text: "አማርኛ", callback_data: "menu:am" }],
    [{ text: "English", callback_data: "menu:en" }],
  ],
};

exports.handler = async (event) => {
  const TOKEN = process.env.BOT_TOKEN;
  const DOCTOR = String(process.env.DOCTOR_ID);
  const api = (method, body) =>
    fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  try {
    const update = JSON.parse(event.body || "{}");

    // Button presses
    if (update.callback_query) {
      const cq = update.callback_query;
      const [key, lang] = String(cq.data).split(":");
      const chat = cq.message.chat.id;
      await api("answerCallbackQuery", { callback_query_id: cq.id });
      if (T[lang] && key === "menu") {
        await api("sendMessage", { chat_id: chat, text: T[lang].menuTitle, reply_markup: menu(lang) });
      } else if (T[lang] && key === "ebook") {
        await api("sendMessage", { chat_id: chat, text: ebookText(lang), reply_markup: ebookMarkup(lang) });
      } else if (T[lang] && T[lang][key]) {
        await api("sendMessage", { chat_id: chat, text: T[lang][key], reply_markup: back(lang) });
      }
      return { statusCode: 200, body: "ok" };
    }

    const msg = update.message;
    if (!msg) return { statusCode: 200, body: "ok" };
    const from = String(msg.chat.id);

    if (from === DOCTOR) {
      const rep = msg.reply_to_message;
      const m = rep && (rep.text || "").match(/#(\d+)/);
      if (m) await api("sendMessage", { chat_id: m[1], text: msg.text });
      else await api("sendMessage", { chat_id: DOCTOR, text: "Reply to a client's message to answer them." });
    } else if (msg.text === "/start") {
      await api("sendMessage", {
        chat_id: from,
        text: "እንኳን ወደ TesfaCare በደህና መጡ። ቋንቋ ይምረጡ።\nWelcome to TesfaCare. Please choose your language.",
        reply_markup: langChoice,
      });
    } else {
      const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
      await api("sendMessage", {
        chat_id: DOCTOR,
        text: `From: ${name}\n#${from}\n\n${msg.text || "[non-text message]"}`,
      });
      await api("sendMessage", {
        chat_id: from,
        text: "መልእክትዎ ደርሶናል፣ ዶክተር ተስፋዓለም በቅርቡ ይመልሳሉ።\nReceived. Dr. Tesfalem will reply soon.",
      });
    }
  } catch (e) {
    console.error(e);
  }
  return { statusCode: 200, body: "ok" };
};
