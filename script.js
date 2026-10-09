
const missions = [
  {
    emoji: "🌿",
    category: "NOTICE THE LITTLE THINGS",
    title: "Meet your neighborhood plants.",
    description: "Take a short walk and notice three different plants. Look at their leaves, shapes, and colors.",
    duration: 10,
    xp: 50,
    difficulty: "EASY DOES IT"
  },
  {
    emoji: "🐦",
    category: "LISTEN TO NATURE",
    title: "Become a bird listener.",
    description: "Spend 10 minutes in a safe outdoor spot. Listen for bird calls and notice where the sounds come from.",
    duration: 10,
    xp: 50,
    difficulty: "EASY DOES IT"
  },
  {
    emoji: "☁️",
    category: "LOOK UP",
    title: "Find your favorite cloud.",
    description: "Look at the sky and find a cloud with an interesting shape. Use your imagination to describe it.",
    duration: 5,
    xp: 30,
    difficulty: "QUICK ADVENTURE"
  },
  {
    emoji: "🌳",
    category: "SLOW DOWN",
    title: "Take a mindful nature walk.",
    description: "Walk somewhere safe and notice five things you can see, four sounds you can hear, and the breeze around you.",
    duration: 15,
    xp: 75,
    difficulty: "A LITTLE FURTHER"
  },
  {
    emoji: "🌻",
    category: "GROW SOMETHING",
    title: "Give a plant some love.",
    description: "Check a garden or potted plant. Learn what it needs to grow, or help care for it with permission.",
    duration: 10,
    xp: 50,
    difficulty: "EASY DOES IT"
  },
  {
    emoji: "🍂",
    category: "DISCOVER TEXTURES",
    title: "Become a texture detective.",
    description: "Observe the different textures around you, such as tree bark, grass, stones, and fallen leaves. Leave nature where it belongs.",
    duration: 10,
    xp: 50,
    difficulty: "EASY DOES IT"
  },
  {
    emoji: "🌼",
    category: "NOTICE THE DETAILS",
    title: "Find three colors in nature.",
    description: "Explore a safe outdoor area and find three different natural colors. Notice how light changes what you see.",
    duration: 10,
    xp: 50,
    difficulty: "EASY DOES IT"
  },
  {
    emoji: "🚶",
    category: "MOVE YOUR WAY",
    title: "Explore a new little path.",
    description: "With a safe route in mind, take a short walk somewhere you do not usually explore. Stay in public, familiar areas.",
    duration: 15,
    xp: 75,
    difficulty: "A LITTLE FURTHER"
  }
];

const $ = (id) => document.getElementById(id);

const elements = {
  start: $("start-button"),
  complete: $("complete-button"),
  next: $("new-mission-button"),
  ai: $("ai-button"),
  title: $("mission-title"),
  description: $("mission-description"),
  emoji: $("mission-emoji"),
  category: $("mission-category"),
  duration: $("mission-duration"),
  xp: $("mission-xp"),
  difficulty: $("mission-difficulty"),
  status: $("mission-status"),
  aiStatus: $("ai-status"),
  aiDescription: $("ai-description"),
  xpValue: $("xp-value"),
  levelValue: $("level-value"),
  completedValue: $("completed-value"),
  heroCount: $("hero-mission-count"),
  progress: $("level-progress"),
  progressCaption: $("progress-caption"),
  toast: $("toast")
};

let currentMission = null;
let currentMissionCompleted = false;
let previousMissionTitle = "";
let toastTimeout;

const state = {
  xp: 0,
  completed: 0,
  level: 1
};

const levelNames = [
  "Seedling",
  "Sprout",
  "Sapling",
  "Explorer",
  "Nature Guardian"
];

// Load saved progress when available.
try {
  const saved = JSON.parse(localStorage.getItem("greenquest-progress"));

  if (saved && typeof saved === "object") {
    state.xp = Number.isFinite(saved.xp) && saved.xp >= 0
      ? Math.floor(saved.xp) : 0;

    state.completed =
      Number.isFinite(saved.completed) && saved.completed >= 0
        ? Math.floor(saved.completed) : 0;
  }
} catch (error) {
  console.info("Starting a fresh GreenQuest session.");
}

function saveProgress() {
  try {
    localStorage.setItem(
      "greenquest-progress",
      JSON.stringify({
        xp: state.xp,
        completed: state.completed
      })
    );
  } catch (error) {
    console.info("Progress will remain in memory for this session.");
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2800);
}

function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function getLevelName(level) {
  return levelNames[
    Math.min(level - 1, levelNames.length - 1)
  ];
}

function updateStats() {
  state.level = getLevel(state.xp);

  elements.xpValue.textContent = `${state.xp} XP`;
  elements.levelValue.textContent =
    `Level ${state.level} · ${getLevelName(state.level)}`;

  elements.completedValue.textContent =
    `${state.completed} ${state.completed === 1 ? "adventure" : "adventures"}`;

  elements.heroCount.textContent =
    `${state.completed} ${state.completed === 1 ? "adventure" : "adventures"}`;

  const xpWithinLevel = state.xp % 100;

  elements.progress.style.width = `${xpWithinLevel}%`;
  elements.progressCaption.textContent =
    `${100 - xpWithinLevel} XP to your next level`;

  saveProgress();
}

function renderMission(mission) {
  currentMission = mission;
  currentMissionCompleted = false;

  elements.emoji.textContent = mission.emoji || "🌿";
  elements.category.textContent =
    mission.category || "DISCOVER THE OUTDOORS";

  elements.title.textContent = mission.title;
  elements.description.textContent = mission.description;
  elements.duration.textContent = `${mission.duration} minutes`;
  elements.xp.textContent = `${mission.xp} XP`;
  elements.difficulty.textContent =
    mission.difficulty || "YOUR OWN PACE";

  elements.complete.textContent = `I did it! +${mission.xp} XP ✓`;
  elements.complete.disabled = false;
  elements.status.textContent =
    "Head outside when you're ready. Your adventure awaits.";

  previousMissionTitle = mission.title;
}

function getRandomMission() {
  const alternatives = missions.filter(
    mission => mission.title !== previousMissionTitle
  );

  const choices = alternatives.length ? alternatives : missions;
  return choices[Math.floor(Math.random() * choices.length)];
}

function generateMission() {
  renderMission(getRandomMission());
  showToast("A fresh adventure is ready! 🌱");
}

function completeMission() {
  if (!currentMission || currentMissionCompleted) {
    showToast("Choose a new mission to continue exploring.");
    return;
  }

  currentMissionCompleted = true;
  state.xp += currentMission.xp;
  state.completed += 1;

  elements.complete.disabled = true;
  elements.complete.textContent = "Mission completed ✓";
  elements.status.textContent =
    "Beautiful work! Take a moment to enjoy the world around you.";

  updateStats();
  showToast(`+${currentMission.xp} XP earned! Keep growing 🌿`);
}

function updateAIStatus(connected, message) {
  elements.aiStatus.replaceChildren();

  const dot = document.createElement("span");
  dot.className = "status-dot";
  elements.aiStatus.append(dot);

  elements.aiStatus.append(
    document.createTextNode(connected ? " LOCAL AI CONNECTED" : " LOCAL MODE")
  );

  elements.aiDescription.textContent = message;
}

function parseAIResponse(raw) {
  let text = raw.trim();

  // Remove optional Markdown code fences.
  text = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  const data = JSON.parse(text);

  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string"
  ) {
    throw new Error("The AI returned an incomplete mission.");
  }

  return {
    emoji: typeof data.emoji === "string" ? data.emoji : "🌿",
    category: typeof data.category === "string"
      ? data.category : "YOUR AI NATURE MISSION",
    title: data.title.slice(0, 100),
    description: data.description.slice(0, 500),
    duration: 10,
    xp: 50,
    difficulty: "AI ADVENTURE"
  };
}

async function askLocalAI() {
  const originalLabel = elements.ai.textContent;

  elements.ai.disabled = true;
  elements.next.disabled = true;
  elements.ai.textContent = "Dreaming up a mission...";

  elements.status.textContent =
    "Asking your local AI for a fresh outdoor idea...";

  try {
    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          stream: false,
          format: "json",
          prompt: [
            "You are GreenQuest, a friendly outdoor adventure coach.",
            "Create one safe, simple, enjoyable real-world nature mission.",
            "Encourage the user to put their phone away after reading.",
            "Do not suggest trespassing, touching unknown wildlife, or dangerous activities.",
            "Return only a JSON object with these fields:",
            "title (string), description (string), emoji (string), category (string).",
            "Keep the title short and the description under 45 words."
          ].join(" ")
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Ollama returned HTTP ${response.status}`);
    }

    const result = await response.json();
    const mission = parseAIResponse(result.response || "");

    renderMission(mission);
    updateAIStatus(
      true,
      "Your mission was created by an open-weight AI model running locally on your computer."
    );
    elements.status.textContent =
      "Your local AI created a fresh adventure. Ready when you are!";

    showToast("Your local AI created a new mission ✨");
  } catch (error) {
    console.warn("Local AI unavailable:", error);

    updateAIStatus(
      false,
      "Local AI isn't connected yet. Built-in missions work without it. Start with one while you set up Ollama."
    );

    renderMission(getRandomMission());
    elements.status.textContent =
      "Showing a built-in mission. Check that Ollama is running to use local AI.";

    showToast("Using a built-in mission for now.");
  } finally {
    elements.ai.disabled = false;
    elements.next.disabled = false;
    elements.ai.textContent = originalLabel;
  }
}

function setTodayDate() {
  const today = new Date();

  $("today-date").textContent = today.toLocaleDateString(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric"
    }
  ).toUpperCase();
}

function startAdventure() {
  $("mission-title").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  showToast("Your next adventure starts outside 🌎");
}

// Connect the buttons to their actions.
elements.start.addEventListener("click", startAdventure);
elements.complete.addEventListener("click", completeMission);
elements.next.addEventListener("click", generateMission);
elements.ai.addEventListener("click", askLocalAI);

// Initial setup.
setTodayDate();
updateStats();
renderMission(getRandomMission());
