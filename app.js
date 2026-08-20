/* =========================================================
   PROJECT ARENA V2
   STYLE SYSTEM
========================================================= */

:root {
  --bg: #080a0f;
  --bg-2: #0c0f16;
  --surface: #11151d;
  --surface-2: #151a23;
  --surface-3: #1a202b;

  --border: rgba(255, 255, 255, 0.075);
  --border-hover: rgba(255, 255, 255, 0.14);

  --text: #f4f6fa;
  --muted: #8c94a3;
  --muted-2: #646d7d;

  --primary: #7c5cff;
  --primary-2: #6245dc;
  --primary-soft: rgba(124, 92, 255, 0.12);

  --blue: #4b9cff;
  --green: #35d99a;
  --orange: #ffad51;
  --red: #ff5f76;
  --purple: #a179ff;

  --sidebar: 245px;
  --radius: 18px;

  --shadow:
    0 20px 60px rgba(0, 0, 0, 0.28);

  --transition: 0.2s ease;
}


/* =========================================================
   RESET
========================================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 85% 0%,
      rgba(124, 92, 255, 0.10),
      transparent 30%
    ),
    radial-gradient(
      circle at 10% 80%,
      rgba(77, 156, 255, 0.035),
      transparent 28%
    ),
    var(--bg);

  color: var(--text);

  font-family:
    "Segoe UI",
    Tahoma,
    Arial,
    sans-serif;

  line-height: 1.6;

  overflow-x: hidden;
}

button,
input,
textarea,
select {
  font-family: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

::selection {
  background: rgba(124, 92, 255, 0.35);
  color: #fff;
}


/* =========================================================
   SCROLLBAR
========================================================= */

::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #252b36;
  border-radius: 50px;
}

::-webkit-scrollbar-thumb:hover {
  background: #343c4b;
}


/* =========================================================
   APP SHELL
========================================================= */

.app-shell {
  min-height: 100vh;
}


/* =========================================================
   SIDEBAR
========================================================= */

.sidebar {
  position: fixed;

  top: 0;
  right: 0;

  width: var(--sidebar);
  height: 100vh;

  padding: 22px 15px;

  display: flex;
  flex-direction: column;

  background:
    linear-gradient(
      180deg,
      rgba(17, 21, 29, 0.98),
      rgba(8, 10, 15, 0.99)
    );

  border-left: 1px solid var(--border);

  z-index: 1000;
}


/* =========================================================
   LOGO
========================================================= */

.logo-area {
  display: flex;

  align-items: center;

  gap: 11px;

  padding:
    2px
    8px
    27px;
}

.logo {
  width: 43px;
  height: 43px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 13px;

  color: #fff;

  font-size: 20px;

  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );

  box-shadow:
    0 12px 30px rgba(124, 92, 255, 0.22);
}

.logo-area h1 {
  font-size: 15px;

  font-weight: 800;

  letter-spacing: -0.3px;

  white-space: nowrap;
}

.logo-area span {
  display: block;

  margin-top: 1px;

  color: var(--muted-2);

  font-size: 9px;

  letter-spacing: 0.7px;

  text-transform: uppercase;
}


/* =========================================================
   SIDEBAR NAV
========================================================= */

.sidebar-nav {
  display: flex;

  flex-direction: column;

  gap: 6px;
}

.nav-link {
  width: 100%;

  min-height: 45px;

  padding: 9px 12px;

  display: flex;

  align-items: center;

  gap: 11px;

  border: 1px solid transparent;

  border-radius: 12px;

  background: transparent;

  color: var(--muted);

  cursor: pointer;

  text-align: right;

  transition:
    background var(--transition),
    color var(--transition),
    border-color var(--transition),
    transform var(--transition);
}

.nav-link span {
  width: 22px;

  display: grid;
  place-items: center;

  color: #737c8c;

  font-size: 17px;
}

.nav-link b {
  font-size: 12px;

  font-weight: 600;
}

.nav-link:hover {
  color: var(--text);

  background:
    rgba(255, 255, 255, 0.035);

  border-color: var(--border);

  transform: translateX(-2px);
}

.nav-link:hover span {
  color: var(--text);
}

.nav-link.active {
  color: #fff;

  background:
    linear-gradient(
      90deg,
      rgba(124, 92, 255, 0.17),
      rgba(124, 92, 255, 0.055)
    );

  border-color:
    rgba(124, 92, 255, 0.17);
}

.nav-link.active span {
  color: var(--primary);
}


/* =========================================================
   SIDEBAR FOOTER
========================================================= */

.sidebar-footer {
  margin-top: auto;
}

.sidebar-footer small {
  display: block;

  margin-top: 15px;

  color: #505968;

  font-size: 9px;

  text-align: center;
}


/* =========================================================
   MAIN
========================================================= */

.main-content {
  min-height: 100vh;

  margin-right: var(--sidebar);

  padding:
    0
    34px
    60px;
}


/* =========================================================
   TOPBAR
========================================================= */

.topbar {
  height: 74px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid var(--border);

  margin-bottom: 34px;
}

.mobile-title {
  display: none;

  align-items: center;

  gap: 9px;
}

.mobile-title strong {
  font-size: 13px;
}

.mini-logo {
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );

  font-size: 16px;
}

.topbar-actions {
  display: flex;

  gap: 8px;
}

.round-btn {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  border: 1px solid var(--border);

  border-radius: 11px;

  background: var(--surface);

  color: var(--muted);

  cursor: pointer;

  font-size: 16px;

  transition: var(--transition);
}

.round-btn:hover {
  color: var(--text);

  background: var(--surface-2);

  border-color: var(--border-hover