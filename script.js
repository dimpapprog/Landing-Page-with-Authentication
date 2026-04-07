const STORAGE_KEY = "novaflow-demo-user";
const SESSION_KEY = "novaflow-demo-session";

const defaultUser = {
  name: "Demo User",
  email: "demo@novaflow.com",
  password: "Demo123!"
};

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const authBackdrop = document.getElementById("authBackdrop");
const authModal = document.getElementById("authModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const openSignupBtn = document.getElementById("openSignupBtn");
const heroStartBtn = document.getElementById("heroStartBtn");
const heroDemoBtn = document.getElementById("heroDemoBtn");
const ctaSignupBtn = document.getElementById("ctaSignupBtn");
const closeAuthBtn = document.getElementById("closeAuthBtn");
const mobileLoginBtn = document.getElementById("mobileLoginBtn");
const mobileSignupBtn = document.getElementById("mobileSignupBtn");
const authMessage = document.getElementById("authMessage");
const sessionToast = document.getElementById("sessionToast");
const toastTitle = document.getElementById("toastTitle");
const toastText = document.getElementById("toastText");

const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const forgotForm = document.getElementById("forgotForm");
const tabButtons = document.querySelectorAll(".tab-btn");
const openForgotBtn = document.getElementById("openForgotBtn");
const backToSignInBtn = document.getElementById("backToSignInBtn");

function saveStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveStoredUser(defaultUser);
    return defaultUser;
  }
  try {
    return JSON.parse(raw);
  } catch {
    saveStoredUser(defaultUser);
    return defaultUser;
  }
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function showMessage(type, text) {
  authMessage.className = "auth-message " + type;
  authMessage.textContent = text;
  authMessage.classList.remove("hidden");
}

function hideMessage() {
  authMessage.className = "auth-message hidden";
  authMessage.textContent = "";
}

function showToast(title, text) {
  toastTitle.textContent = title;
  toastText.textContent = text;
  sessionToast.classList.remove("hidden");
  setTimeout(() => sessionToast.classList.add("hidden"), 2600);
}

function openModal(view = "signin") {
  setView(view);
  authBackdrop.classList.remove("hidden");
  authModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  hideMessage();
}

function closeModal() {
  authBackdrop.classList.add("hidden");
  authModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function setView(view) {
  tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  signInForm.classList.toggle("hidden", view !== "signin");
  signUpForm.classList.toggle("hidden", view !== "signup");
  forgotForm.classList.toggle("hidden", view !== "forgot");
}

function setLoggedInHeader(user) {
  const headerActions = document.querySelector(".header-actions");
  headerActions.innerHTML = `
    <div class="logged-chip">
      <span class="avatar">${user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
      <div class="logged-copy">
        <strong>${user.name || "User"}</strong>
        <small>${user.email}</small>
      </div>
    </div>
    <button class="secondary-btn" id="logoutBtn">Log out</button>
    <button class="menu-btn mobile-only" id="menuBtn" aria-label="Open menu">☰</button>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  const newMenuBtn = document.getElementById("menuBtn");
  logoutBtn.addEventListener("click", () => {
    clearSession();
    location.reload();
  });

  if (newMenuBtn) {
    newMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }
}

function initSession() {
  const session = getSession();
  if (session) {
    setLoggedInHeader(session);
  }
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

document.querySelectorAll(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    const isPassword = target.type === "password";
    target.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "Hide" : "Show";
  });
});

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setView(btn.dataset.view);
    hideMessage();
  });
});

openLoginBtn.addEventListener("click", () => openModal("signin"));
openSignupBtn.addEventListener("click", () => openModal("signup"));
heroStartBtn.addEventListener("click", () => openModal("signup"));
heroDemoBtn.addEventListener("click", () => openModal("signin"));
ctaSignupBtn.addEventListener("click", () => openModal("signup"));
mobileLoginBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  openModal("signin");
});
mobileSignupBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  openModal("signup");
});
document.querySelectorAll(".open-signup").forEach(btn => {
  btn.addEventListener("click", () => openModal("signup"));
});

openForgotBtn.addEventListener("click", () => {
  setView("forgot");
  hideMessage();
});

backToSignInBtn.addEventListener("click", () => {
  setView("signin");
  hideMessage();
});

closeAuthBtn.addEventListener("click", closeModal);
authBackdrop.addEventListener("click", closeModal);

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value.trim();
  const user = getStoredUser();

  if (!validateEmail(email)) {
    showMessage("error", "Please enter a valid email address.");
    return;
  }

  if (!password) {
    showMessage("error", "Please enter your password.");
    return;
  }

  if (email !== user.email || password !== user.password) {
    showMessage("error", "Incorrect email or password. Use the demo account or create a new one.");
    return;
  }

  setSession(user);
  closeModal();
  setLoggedInHeader(user);
  showToast("Signed in successfully", "Demo session created.");
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (name.length < 2) {
    showMessage("error", "Please enter your full name.");
    return;
  }

  if (!validateEmail(email)) {
    showMessage("error", "Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showMessage("error", "Use at least 6 characters for the password.");
    return;
  }

  const newUser = { name, email, password };
  saveStoredUser(newUser);
  setSession(newUser);
  closeModal();
  setLoggedInHeader(newUser);
  showToast("Account created", "You are now logged in.");
});

forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();

  if (!validateEmail(email)) {
    showMessage("error", "Please enter a valid email address.");
    return;
  }

  showMessage("success", "Password reset link sent successfully. This is a front-end demo flow.");
});

initSession();
