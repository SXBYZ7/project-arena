/* =========================================================
   PROJECT ARENA V2
   APP.JS
========================================================= */

"use strict";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "projectArenaV2";

const defaultData = {
  projects: [],
  ideas: [],
  tasks: [],
  theme: "dark"
};

let appData = loadData();


/* =========================================================
   DOM
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* Pages */
const pages = $$(".page");
const navLinks = $$(".nav-link");


/* Project elements */
const projectModal = $("#projectModal");
const projectForm = $("#projectForm");

const projectName = $("#projectName");
const projectDescription = $("#projectDescription");
const projectStatus = $("#projectStatus");

const activeProjectContainer = $("#activeProjectContainer");
const recentProjects = $("#recentProjects");
const allProjects = $("#allProjects");

const totalProjects = $("#totalProjects");
const activeProjects = $("#activeProjects");
const completedProjects = $("#completedProjects");
const overallProgress = $("#overallProgress");


/* Buttons */
const newProjectButton = $("#newProjectButton");
const projectsNewButton = $("#projectsNewButton");

const closeProjectModal = $("#closeProjectModal");
const cancelProjectButton = $("#cancelProjectButton");

const themeButton = $("#themeButton");
const settingsThemeButton = $("#settingsThemeButton");

const notificationButton = $("#notificationButton");
const clearDataButton = $("#clearDataButton");

const newIdeaButton = $("#newIdeaButton");

const tasksContainer = $("#tasksContainer");
const ideasContainer = $("#ideasContainer");


/* =========================================================
   LOAD / SAVE
========================================================= */

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(defaultData);
    }

    const parsed = JSON.parse(saved);

    return {
      ...structuredClone(defaultData),
      ...parsed,
      projects: Array.isArray(parsed.projects)
        ? parsed.projects
        : [],
      ideas: Array.isArray(parsed.ideas)
        ? parsed.ideas
        : [],
      tasks: Array.isArray(parsed.tasks)
        ? parsed.tasks
        : []
    };

  } catch (error) {
    console.error("Storage error:", error);

    return structuredClone(defaultData);
  }
}


function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}


/* =========================================================
   UTILITIES
========================================================= */

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}


function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getStatusLabel(status) {
  const labels = {
    idea: "💡 فكرة",
    active: "🟡 قيد التطوير",
    completed: "🟢 مكتمل",
    paused: "🔴 متوقف"
  };

  return labels[status] || "💡 فكرة";
}


function getProgress(project) {
  if (!project) return 0;

  if (project.status === "completed") {
    return 100;
  }

  const progress = Number(project.progress);

  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, progress)
  );
}


function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString(
      "ar-IQ",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  } catch {
    return "";
  }
}


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(pageId) {

  pages.forEach((page) => {
    page.classList.toggle(
      "active",
      page.id === pageId
    );
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.page === pageId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


navLinks.forEach((link) => {

  link.addEventListener("click", () => {

    const page = link.dataset.page;

    if (page) {
      showPage(page);
    }

  });

});


/* Buttons with data-page-target */

$$("[data-page-target]").forEach((button) => {

  button.addEventListener("click", () => {

    const page = button.dataset.pageTarget;

    if (page) {
      showPage(page);
    }

  });

});


/* =========================================================
   PROJECT MODAL
========================================================= */

function openProjectModal() {

  projectModal.classList.add("show");

  setTimeout(() => {
    projectName.focus();
  }, 100);

}


function closeModal() {

  projectModal.classList.remove("show");

  projectForm.reset();

}


newProjectButton?.addEventListener(
  "click",
  openProjectModal
);


projectsNewButton?.addEventListener(
  "click",
  openProjectModal
);


closeProjectModal?.addEventListener(
  "click",
  closeModal
);


cancelProjectButton?.addEventListener(
  "click",
  closeModal
);


projectModal?.addEventListener(
  "click",
  (event) => {

    if (event.target === projectModal) {
      closeModal();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      projectModal.classList.contains("show")
    ) {
      closeModal();
    }

  }
);


/* =========================================================
   CREATE PROJECT
========================================================= */

projectForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const name =
      projectName.value.trim();

    const description =
      projectDescription.value.trim();

    const status =
      projectStatus.value;

    if (!name) {
      projectName.focus();
      return;
    }

    const project = {

      id: generateId(),

      name,

      description:
        description ||
        "لا يوجد وصف للمشروع.",

      status,

      progress:
        status === "completed"
          ? 100
          : 0,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    };


    appData.projects.unshift(project);

    saveData();

    renderAll();

    closeModal();

    showPage("projects");

  }
);


/* =========================================================
   PROJECT CARD
========================================================= */

function projectCard(project) {

  const progress =
    getProgress(project);

  return `

    <article
      class="project-card"
      data-project-id="${escapeHTML(project.id)}"
    >

      <div class="project-top">

        <div style="min-width:0;">

          <div class="project-title">
            ${escapeHTML(project.name)}
          </div>

          <div class="project-description">
            ${escapeHTML(project.description)}
          </div>

        </div>

        <span class="status ${escapeHTML(project.status)}">
          ${getStatusLabel(project.status)}
        </span>

      </div>


      <div class="progress-area">

        <div class="progress-header">

          <span>نسبة الإنجاز</span>

          <strong>${progress}%</strong>

        </div>

        <div class="progress-bar">

          <div
            class="progress-value"
            style="width:${progress}%"
          ></div>

        </div>

      </div>


      <div
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          margin-top:15px;
        "
      >

        <span
          style="
            color:var(--text-muted);
            font-size:9px;
          "
        >
          ${formatDate(project.createdAt)}
        </span>

        <button
          class="danger-btn delete-project-btn"
          data-id="${escapeHTML(project.id)}"
          style="
            min-height:32px;
            padding:6px 10px;
            font-size:9px;
          "
        >
          حذف
        </button>

      </div>

    </article>

  `;
}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

  const projects =
    appData.projects;

  /* All projects */

  if (!projects.length) {

    allProjects.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">⚔</div>

        <h3>ما عندك مشاريع حاليًا</h3>

        <p>
          ابدأ أول مشروع وخليه يظهر هنا.
        </p>

        <button
          class="primary-btn"
          id="emptyNewProject"
          style="margin-top:15px;"
        >
          ＋ مشروع جديد
        </button>

      </div>

    `;

  } else {

    allProjects.innerHTML =
      projects
        .map(projectCard)
        .join("");

  }


  /* Recent */

  const recent =
    projects.slice(0, 6);

  if (!recent.length) {

    recentProjects.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">◈</div>

        <h3>لا توجد مشاريع</h3>

        <p>
          أضف مشروعك الأول للبدء.
        </p>

      </div>

    `;

  } else {

    recentProjects.innerHTML =
      recent
        .map(projectCard)
        .join("");

  }


  /* Active project */

  const active =
    projects.find(
      project =>
        project.status === "active"
    );

  if (!active) {

    activeProjectContainer.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">◷</div>

        <h3>لا يوجد مشروع نشط</h3>

        <p>
          عندما تبدأ مشروعًا سيظهر هنا.
        </p>

      </div>

    `;

  } else {

    activeProjectContainer.innerHTML =
      projectCard(active);

  }

}


/* =========================================================
   PROJECT ACTIONS
========================================================= */

document.addEventListener(
  "click",
  (event) => {

    const deleteButton =
      event.target.closest(
        ".delete-project-btn"
      );

    if (deleteButton) {

      event.stopPropagation();

      const id =
        deleteButton.dataset.id;

      deleteProject(id);

      return;
    }


    const emptyButton =
      event.target.closest(
        "#emptyNewProject"
      );

    if (emptyButton) {
      openProjectModal();
      return;
    }

  }
);


function deleteProject(id) {

  const project =
    appData.projects.find(
      item => item.id === id
    );

  if (!project) return;


  const confirmed =
    confirm(
      `هل تريد حذف المشروع "${project.name}"؟`
    );

  if (!confirmed) return;


  appData.projects =
    appData.projects.filter(
      item => item.id !== id
    );


  /* حذف مهام المشروع */

  appData.tasks =
    appData.tasks.filter(
      task => task.projectId !== id
    );


  saveData();

  renderAll();

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStats() {

  const projects =
    appData.projects;

  const total =
    projects.length;

  const active =
    projects.filter(
      p => p.status === "active"
    ).length;

  const completed =
    projects.filter(
      p => p.status === "completed"
    ).length;


  let progress = 0;

  if (projects.length) {

    const sum =
      projects.reduce(
        (total, project) =>
          total + getProgress(project),
        0
      );

    progress =
      Math.round(
        sum / projects.length
      );

  }


  totalProjects.textContent =
    total;

  activeProjects.textContent =
    active;

  completedProjects.textContent =
    completed;

  overallProgress.textContent =
    `${progress}%`;

}


/* =========================================================
   TASKS
========================================================= */

function renderTasks() {

  if (!appData.tasks.length) {

    tasksContainer.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">✓</div>

        <h3>لا توجد مهام</h3>

        <p>
          المهام المرتبطة بالمشاريع ستظهر هنا.
        </p>

      </div>

    `;

    return;
  }


  tasksContainer.innerHTML =
    appData.tasks
      .map(task => {

        const project =
          appData.projects.find(
            p => p.id === task.projectId
          );

        return `

          <div class="task-item">

            <button
              class="task-check ${
                task.completed
                  ? "completed"
                  : ""
              }"
              data-task-id="${escapeHTML(task.id)}"
            >
              ${
                task.completed
                  ? "✓"
                  : ""
              }
            </button>


            <div style="flex:1;min-width:0;">

              <div
                class="task-name ${
                  task.completed
                    ? "completed"
                    : ""
                }"
              >
                ${escapeHTML(task.name)}
              </div>

              ${
                project
                  ? `
                    <div
                      style="
                        color:var(--text-muted);
                        font-size:8px;
                        margin-top:2px;
                      "
                    >
                      ${escapeHTML(project.name)}
                    </div>
                  `
                  : ""
              }

            </div>

          </div>

        `;

      })
      .join("");

}


document.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest(
        ".task-check"
      );

    if (!button) return;

    const id =
      button.dataset.taskId;

    const task =
      appData.tasks.find(
        item => item.id === id
      );

    if (!task) return;

    task.completed =
      !task.completed;

    saveData();

    renderTasks();

  }
);


/* =========================================================
   IDEAS
========================================================= */

function renderIdeas() {

  if (!appData.ideas.length) {

    ideasContainer.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">✦</div>

        <h3>خزنة الأفكار فارغة</h3>

        <p>
          أضف فكرة جديدة حتى لا تضيع منك.
        </p>

        <button
          class="primary-btn"
          id="emptyNewIdea"
          style="margin-top:15px;"
        >
          ＋ فكرة جديدة
        </button>

      </div>

    `;

    return;
  }


  ideasContainer.innerHTML =
    appData.ideas
      .map(idea => `

        <article
          class="idea-card"
          data-idea-id="${escapeHTML(idea.id)}"
        >

          <div class="idea-icon">
            💡
          </div>

          <h3>
            ${escapeHTML(idea.title)}
          </h3>

          <p>
            ${escapeHTML(idea.description)}
          </p>

          <div
            style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              margin-top:13px;
            "
          >

            <span
              style="
                color:var(--text-muted);
                font-size:8px;
              "
            >
              ${formatDate(idea.createdAt)}
            </span>

            <button
              class="danger-btn delete-idea-btn"
              data-id="${escapeHTML(idea.id)}"
              style="
                min-height:30px;
                padding:5px 9px;
                font-size:8px;
              "
            >
              حذف
            </button>

          </div>

        </article>

      `)
      .join("");

}


/* =========================================================
   ADD IDEA
========================================================= */

function createIdea() {

  const title =
    prompt(
      "اكتب اسم الفكرة:"
    );

  if (!title || !title.trim()) {
    return;
  }


  const description =
    prompt(
      "اكتب وصفًا مختصرًا للفكرة:"
    );


  const idea = {

    id: generateId(),

    title:
      title.trim(),

    description:
      description?.trim() ||
      "لا يوجد وصف.",

    createdAt:
      new Date().toISOString()

  };


  appData.ideas.unshift(idea);

  saveData();

  renderIdeas();

}


newIdeaButton?.addEventListener(
  "click",
  createIdea
);


document.addEventListener(
  "click",
  (event) => {

    if (
      event.target.closest(
        "#emptyNewIdea"
      )
    ) {
      createIdea();
      return;
    }


    const deleteButton =
      event.target.closest(
        ".delete-idea-btn"
      );

    if (!deleteButton) return;


    const id =
      deleteButton.dataset.id;

    const idea =
      appData.ideas.find(
        item => item.id === id
      );

    if (!idea) return;


    if (
      confirm(
        `هل تريد حذف الفكرة "${idea.title}"؟`
      )
    ) {

      appData.ideas =
        appData.ideas.filter(
          item => item.id !== id
        );

      saveData();

      renderIdeas();

    }

  }
);


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

  if (appData.theme === "light") {

    document.body.classList.add(
      "light"
    );

  } else {

    document.body.classList.remove(
      "light"
    );

  }

}


function toggleTheme() {

  appData.theme =
    appData.theme === "light"
      ? "dark"
      : "light";

  saveData();

  applyTheme();

}


themeButton?.addEventListener(
  "click",
  toggleTheme
);


settingsThemeButton?.addEventListener(
  "click",
  toggleTheme
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

notificationButton?.addEventListener(
  "click",
  () => {

    const tasks =
      appData.tasks.filter(
        task => !task.completed
      ).length;

    const active =
      appData.projects.filter(
        project =>
          project.status === "active"
      ).length;


    if (!tasks && !active) {

      alert(
        "🔔 لا توجد إشعارات جديدة حاليًا."
      );

      return;
    }


    alert(
      `🔔 إشعارات Project Arena\n\n` +
      `المشاريع قيد التطوير: ${active}\n` +
      `المهام غير المكتملة: ${tasks}`
    );

  }
);


/* =========================================================
   CLEAR DATA
========================================================= */

clearDataButton?.addEventListener(
  "click",
  () => {

    const confirmed =
      confirm(
        "⚠️ سيتم حذف جميع المشاريع والأفكار والمهام من هذا الجهاز.\n\nهل أنت متأكد؟"
      );

    if (!confirmed) return;


    appData =
      structuredClone(defaultData);

    saveData();

    applyTheme();

    renderAll();

    showPage("dashboard");

    alert(
      "تم حذف البيانات بنجاح."
    );

  }
);


/* =========================================================
   SAMPLE TASKS
========================================================= */

function createTasksForProject(project) {

  if (!project) return;


  const exists =
    appData.tasks.some(
      task =>
        task.projectId === project.id
    );

  if (exists) return;


  appData.tasks.push(

    {
      id: generateId(),

      projectId:
        project.id,

      name:
        "تحديد فكرة المشروع",

      completed:
        project.progress >= 25
    },

    {
      id: generateId(),

      projectId:
        project.id,

      name:
        "تجهيز التصميم",

      completed:
        project.progress >= 50
    },

    {
      id: generateId(),

      projectId:
        project.id,

      name:
        "برمجة المشروع",

      completed:
        project.progress >= 75
    },

    {
      id: generateId(),

      projectId:
        project.id,

      name:
        "اختبار المشروع",

      completed:
        project.status === "completed"
    }

  );

}


/* =========================================================
   INITIALIZE PROJECT TASKS
========================================================= */

function initializeTasks() {

  let changed = false;


  appData.projects.forEach(
    project => {

      const before =
        appData.tasks.length;

      createTasksForProject(project);

      if (
        appData.tasks.length !== before
      ) {
        changed = true;
      }

    }
  );


  if (changed) {
    saveData();
  }

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

  renderStats();

  renderProjects();

  renderTasks();

  renderIdeas();

}


/* =========================================================
   START APP
========================================================= */

function init() {

  applyTheme();

  initializeTasks();

  renderAll();

  showPage("dashboard");

}


init();