const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const sidebar = document.getElementById("sidebar");
const history = document.getElementById("history");

// Fake replies (no real AI, just demo text)
const replies = {
  hello: "Hello! 👋 How can I help you today?",
  hi: "Hi there! What would you like to talk about?",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  photosynthesis:
    "Photosynthesis is how plants turn sunlight, water and carbon dioxide into glucose and oxygen. It happens in the chloroplasts. 🌱",
  study: "Try the Pomodoro technique: study for 25 minutes, then take a 5 minute break. 📚",
};

const fallbacks = [
  "That's interesting! Tell me more.",
  "I'm just a demo frontend, but I'd love to chat! 😄",
  "Great question! In a real app, I'd answer using an AI model.",
  "Hmm, let me think about that... 🤔",
];

function getReply(text) {
  const t = text.toLowerCase();
  for (const key in replies) {
    if (t.includes(key)) return replies[key];
  }
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

// Types text out letter by letter
function typeText(el, text, done) {
  let i = 0;
  el.textContent = "";
  const timer = setInterval(() => {
    el.textContent += text[i++];
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) {
      clearInterval(timer);
      done();
    }
  }, 20);
}

function sendMessage(text) {
  text = text.trim();
  if (!text) return;

  // Switch from welcome screen to chat view
  welcome.style.display = "none";
  chat.classList.add("active");

  addMessage(text, "user");
  input.value = "";
  sendBtn.disabled = true;

  // Add to sidebar history (only first message of a chat)
  if (chat.querySelectorAll(".msg.user").length === 1) {
    const item = document.createElement("button");
    item.className = "side-item small";
    item.textContent = text;
    history.prepend(item);
  }

  // Typing dots, then typed reply
  const bot = addMessage("", "bot");
  bot.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';

  setTimeout(() => {
    typeText(bot, getReply(text), () => {
      sendBtn.disabled = false;
      input.focus();
    });
  }, 900);
}

// Form submit (Enter key or send button)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

// Suggestion chips
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => sendMessage(chip.textContent));
});

// New chat
document.getElementById("newChatBtn").addEventListener("click", () => {
  chat.innerHTML = "";
  chat.classList.remove("active");
  welcome.style.display = "flex";
  input.focus();
});

// Sidebar toggle
document.getElementById("toggleBtn").addEventListener("click", () => {
  sidebar.classList.add("hidden");
});
document.getElementById("openBtn").addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});