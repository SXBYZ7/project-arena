/* =====================================================
   PROJECT ARENA V1
   APP ENGINE
===================================================== */

"use strict";

/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY = "project_arena_v1";

let state = {
  projects: [],
  ideas: [],
  theme: "dark"
};


/* =====================================================
   DOM HELPERS
===================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =====================================================
   LOAD DATA
===================================================== */

function loadState() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      const parsed = JSON.parse(saved);

      state = {
        ...state,
        ...parsed
      };

    }

  } catch (error) {

    console.error(
      "Failed to load Project Arena data:",
      error
    );

  }

}


/* =====================================================
   SAVE DATA
===================================================== */

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}


/* =====================================================
   ID GENERATOR
===================================================== */

function generateId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   STATUS
===================================================== */

function getStatusLabel(status) {

  const labels = {

    idea: "💡 فكرة",

    active: "🟡 قيد التطوير",

    completed: "🟢 مكتمل",

    paused: "🔴 متوقف"

  };

  return labels[status] || "💡 فكرة";

}


/* =====================================================
   PROJECT PROGRESS
===================================================== */

function calculateProjectProgress(project) {

  if (!project.tasks || project.tasks.length === 0) {

    return project.progress || 0;

  }

  const completed =
    project.tasks.filter(
      task => task.completed
    ).length;

  return Math.round(
    (completed / project.tasks.length) * 100
  );

}


/* =====================================================
   NAVIGATION
===================================================== */

function navigateTo(pageId) {

  $$(".page").forEach(page => {

    page.classList.remove("active");

  });


  const target = $(`#${pageId}`);

  if (!target) return;

  target.classList.add("active");


  $$(".nav-item").forEach(item => {

    item.classList.remove("active");

    if (
      item.dataset.page === pageId
    ) {

      item.classList.add("active");

    }

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  renderAll();

}


/* =====================================================
   NAV BUTTONS
===================================================== */

$$(".nav-item").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const page =
        button.dataset.page;

      if (!page) return;

      navigateTo(page);

    }
  );

});


$$("[data-page-target]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const page =
        button.dataset.pageTarget;

      navigateTo(page);

    }
  );

});


/* =====================================================
   PROJECT MODAL
===================================================== */

const projectModal =
  $("#projectModal");


function openProjectModal() {

  projectModal.classList.add("show");

  setTimeout(() => {

    $("#projectName").focus();

  }, 100);

}


function closeProjectModal() {

  projectModal.classList.remove("show");

  $("#projectForm").reset();

}


$("#newProjectButton")
  ?.addEventListener(
    "click",
    openProjectModal
  );


$("#projectsNewButton")
  ?.addEventListener(
    "click",
    openProjectModal
  );


$("#emptyNewProject")
  ?.addEventListener(
    "click",
    openProjectModal
  );


$("#closeProjectModal")
  ?.addEventListener(
    "click",
    closeProjectModal
  );


$("#cancelProjectButton")
  ?.addEventListener(
    "click",
    closeProjectModal
  );


projectModal?.addEventListener(
  "click",
  event => {

    if (
      event.target === projectModal
    ) {

      closeProjectModal();

    }

  }
);


/* =====================================================
   CREATE PROJECT
===================================================== */

$("#projectForm")
  ?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        $("#projectName")
          .value
          .trim();

      const description =
        $("#projectDescription")
          .value
          .trim();

      const status =
        $("#projectStatus")
          .value;


      if (!name) {

        return;

      }


      const project = {

        id: generateId(),

        name,

        description,

        status,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),

        progress: 0,

        tasks: []

      };


      state.projects.unshift(project);


      saveState();

      closeProjectModal();

      renderAll();

      navigateTo("projects");

    }
  );


/* =====================================================
   RENDER STATISTICS
===================================================== */

function renderStatistics() {

  const total =
    state.projects.length;


  const active =
    state.projects.filter(
      project =>
        project.status === "active"
    ).length;


  const completed =
    state.projects.filter(
      project =>
        project.status === "completed"
    ).length;


  let overall = 0;


  if (total > 0) {

    const totalProgress =
      state.projects.reduce(
        (sum, project) => {

          return (
            sum +
            calculateProjectProgress(
              project
            )
          );

        },
        0
      );


    overall =
      Math.round(
        totalProgress / total
      );

  }


  $("#totalProjects").textContent =
    total;

  $("#activeProjects").textContent =
    active;

  $("#completedProjects").textContent =
    completed;

  $("#overallProgress").textContent =
    `${overall}%`;

}


/* =====================================================
   PROJECT CARD
===================================================== */

function createProjectCard(project) {

  const progress =
    calculateProjectProgress(project);


  const card =
    document.createElement("article");


  card.className =
    "project-card";


  card.dataset.projectId =
    project.id;


  card.innerHTML = `

    <div class="project-top">

      <div>

        <div class="project-title">
          ${escapeHTML(project.name)}
        </div>

        <div class="project-description">
          ${
            escapeHTML(
              project.description ||
              "لا يوجد وصف للمشروع."
            )
          }
        </div>

      </div>

      <span class="status ${project.status}">
        ${getStatusLabel(project.status)}
      </span>

    </div>


    <div class="progress-area">

      <div class="progress-header">

        <span>
          التقدم
        </span>

        <strong>
          ${progress}%
        </strong>

      </div>

      <div class="progress-bar">

        <div
          class="progress-value"
          style="width:${progress}%"
        ></div>

      </div>

    </div>

  `;


  card.addEventListener(
    "click",
    () => {

      openProjectDetails(
        project.id
      );

    }
  );


  return card;

}


/* =====================================================
   RENDER RECENT PROJECTS
===================================================== */

function renderRecentProjects() {

  const container =
    $("#recentProjects");


  container.innerHTML = "";


  if (
    state.projects.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          📁
        </div>

        <h3>
          لا توجد مشاريع
        </h3>

        <p>
          أنشئ مشروعك الأول.
        </p>

      </div>

    `;

    return;

  }


  state.projects
    .slice(0, 6)
    .forEach(project => {

      container.appendChild(
        createProjectCard(project)
      );

    });

}


/* =====================================================
   RENDER ALL PROJECTS
===================================================== */

function renderAllProjects() {

  const container =
    $("#allProjects");


  container.innerHTML = "";


  if (
    state.projects.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⚔️
        </div>

        <h3>
          ساحة المشاريع فارغة
        </h3>

        <p>
          أنشئ مشروعًا وابدأ العمل.
        </p>

      </div>

    `;

    return;

  }


  state.projects.forEach(
    project => {

      container.appendChild(
        createProjectCard(project)
      );

    }
  );

}


/* =====================================================
   ACTIVE PROJECT
===================================================== */

function renderActiveProject() {

  const container =
    $("#activeProjectContainer");


  const activeProject =
    state.projects.find(
      project =>
        project.status === "active"
    );


  if (!activeProject) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⚔️
        </div>

        <h3>
          لا يوجد مشروع نشط
        </h3>

        <p>
          أنشئ مشروعًا أو غيّر حالة مشروع إلى قيد التطوير.
        </p>

        <button
          class="primary-button"
          id="emptyNewProject"
        >
          إنشاء مشروع
        </button>

      </div>

    `;


    $("#emptyNewProject")
      ?.addEventListener(
        "click",
        openProjectModal
      );


    return;

  }


  const progress =
    calculateProjectProgress(
      activeProject
    );


  container.innerHTML = `

    <div class="project-card">

      <div class="project-top">

        <div>

          <div class="project-title">
            ${escapeHTML(
              activeProject.name
            )}
          </div>

          <div class="project-description">
            ${
              escapeHTML(
                activeProject.description ||
                "مشروع قيد التطوير."
              )
            }
          </div>

        </div>

        <span class="status active">
          🟡 قيد التطوير
        </span>

      </div>


      <div class="progress-area">

        <div class="progress-header">

          <span>
            نسبة الإنجاز
          </span>

          <strong>
            ${progress}%
          </strong>

        </div>

        <div class="progress-bar">

          <div
            class="progress-value"
            style="width:${progress}%"
          ></div>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   OPEN PROJECT DETAILS
===================================================== */

function openProjectDetails(projectId) {

  const project =
    state.projects.find(
      item =>
        item.id === projectId
    );


  if (!project) return;


  const taskText =
    project.tasks
      .map(
        task =>
          `${task.completed ? "✓" : "○"} ${task.title}`
      )
      .join("\n");


  const action =
    confirm(
      `📁 ${project.name}\n\n` +
      `الحالة: ${getStatusLabel(project.status)}\n` +
      `الإنجاز: ${calculateProjectProgress(project)}%\n\n` +
      `المهام:\n` +
      (taskText || "لا توجد مهام") +
      `\n\n` +
      `هل تريد إضافة مهمة؟`
    );


  if (action) {

    addTaskToProject(project);

  }

}


/* =====================================================
   ADD TASK
===================================================== */

function addTaskToProject(project) {

  const title =
    prompt(
      `إضافة مهمة إلى:\n${project.name}`
    );


  if (!title) return;


  project.tasks.push({

    id: generateId(),

    title: title.trim(),

    completed: false,

    createdAt:
      new Date().toISOString()

  });


  project.updatedAt =
    new Date().toISOString();


  saveState();

  renderAll();

}


/* =====================================================
   RENDER TASKS
===================================================== */

function renderTasks() {

  const container =
    $("#tasksContainer");


  container.innerHTML = "";


  const tasks = [];


  state.projects.forEach(
    project => {

      (project.tasks || [])
        .forEach(task => {

          tasks.push({

            ...task,

            projectId: project.id,

            projectName:
              project.name

          });

        });

    }
  );


  if (tasks.length === 0) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ✓
        </div>

        <h3>
          لا توجد مهام
        </h3>

        <p>
          أضف مهامًا إلى مشاريعك.
        </p>

      </div>

    `;

    return;

  }


  tasks.forEach(task => {

    const item =
      document.createElement("div");


    item.className =
      "task-item";


    item.innerHTML = `

      <button
        class="task-check ${
          task.completed
            ? "completed"
            : ""
        }"
        aria-label="تغيير حالة المهمة"
      >
        ${
          task.completed
            ? "✓"
            : ""
        }
      </button>


      <div
        class="task-name ${
          task.completed
            ? "completed"
            : ""
        }"
      >

        ${escapeHTML(task.title)}

        <small
          style="
            display:block;
            color:#6f7786;
            font-size:9px;
          "
        >
          ${escapeHTML(task.projectName)}
        </small>

      </div>

    `;


    item
      .querySelector(".task-check")
      .addEventListener(
        "click",
        () => {

          toggleTask(
            task.projectId,
            task.id
          );

        }
      );


    container.appendChild(item);

  });

}


/* =====================================================
   TOGGLE TASK
===================================================== */

function toggleTask(
  projectId,
  taskId
) {

  const project =
    state.projects.find(
      item =>
        item.id === projectId
    );


  if (!project) return;


  const task =
    project.tasks.find(
      item =>
        item.id === taskId
    );


  if (!task) return;


  task.completed =
    !task.completed;


  project.progress =
    calculateProjectProgress(
      project
    );


  project.updatedAt =
    new Date().toISOString();


  saveState();

  renderAll();

}


/* =====================================================
   IDEAS
===================================================== */

function renderIdeas() {

  const container =
    $("#ideasContainer");


  container.innerHTML = "";


  if (
    state.ideas.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ✦
        </div>

        <h3>
          خزنة الأفكار فارغة
        </h3>

        <p>
          عندك فكرة؟ احفظها هنا.
        </p>

      </div>

    `;

    return;

  }


  state.ideas.forEach(
    idea => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "idea-card";


      card.innerHTML = `

        <div class="idea-icon">
          💡
        </div>

        <h3>
          ${escapeHTML(idea.title)}
        </h3>

        <p>
          ${escapeHTML(idea.description)}
        </p>

      `;


      container.appendChild(card);

    }
  );

}


/* =====================================================
   NEW IDEA
===================================================== */

$("#newIdeaButton")
  ?.addEventListener(
    "click",
    () => {

      const title =
        prompt(
          "اسم الفكرة:"
        );


      if (!title) return;


      const description =
        prompt(
          "وصف الفكرة:"
        ) || "";


      state.ideas.unshift({

        id: generateId(),

        title:
          title.trim(),

        description:
          description.trim(),

        createdAt:
          new Date().toISOString()

      });


      saveState();

      renderIdeas();

    }
  );


/* =====================================================
   THEME
===================================================== */

function applyTheme() {

  if (
    state.theme === "light"
  ) {

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

  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";


  saveState();

  applyTheme();

}


$("#themeButton")
  ?.addEventListener(
    "click",
    toggleTheme
  );


$("#settingsThemeButton")
  ?.addEventListener(
    "click",
    toggleTheme
  );


/* =====================================================
   CLEAR DATA
===================================================== */

$("#clearDataButton")
  ?.addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "هل أنت متأكد؟\n\nسيتم حذف جميع المشاريع والمهام والأفكار من هذا الجهاز."
        );


      if (!confirmed) return;


      state = {

        projects: [],

        ideas: [],

        theme: "dark"

      };


      saveState();

      applyTheme();

      renderAll();

    }
  );


/* =====================================================
   NOTIFICATIONS
===================================================== */

$("#notificationButton")
  ?.addEventListener(
    "click",
    () => {

      alert(
        "🔔 لا توجد إشعارات جديدة."
      );

    }
  );


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

  renderStatistics();

  renderActiveProject();

  renderRecentProjects();

  renderAllProjects();

  renderTasks();

  renderIdeas();

}


/* =====================================================
   INITIALIZATION
===================================================== */

function init() {

  loadState();

  applyTheme();

  renderAll();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  init
);