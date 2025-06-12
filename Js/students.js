let teacherId = new URLSearchParams(location.search).get("teacherId");
const ENDPOINT = `https://68470ed97dbda7ee7ab156ca.mockapi.io/teachers/${teacherId}`;
const LIMIT = 6;
const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 20000,
});

const CONSTANTQuery = `students/`;

let teachersList = document.querySelector(".teacher--menu");
let searchInput = document.querySelector(".search-input");
let paginationBox = document.querySelector(".pagination");
let btns = document.querySelectorAll("button");
let loading = document.querySelector(".loadingNone");
let activePage = 1;
function getCard(
  {
    createdAt,
    firstName,
    lastName,
    avatar,
    isWork,
    phoneNumber,
    email,
    id,
    birthday,
  },
  list
) {
  let data = createdAt.split("T")[0];

  let template = document.createElement("template");
  template.innerHTML = `
  <div class="user-card" id="${id}">
    <div class="card-header">
      <div class="avatar-container">
        <img class="avatar" src="${avatar}" alt="${firstName}">
      </div>
    </div>
    <div class="card-body">
      <h2 class="user-name">${firstName}</h2>
      <h3 class="user-LastName">${firstName + " " + lastName}</h3>
      <p class="user-title">Field ${id} Specialist</p>
  
      <div class="divider"></div>
  
   <div class="user-details">
            <div class="detail-item">
              <div class="detail-icon">🎂</div>
              <div class="detail-content">
                <div class="detail-label">Birthday</div>
                <div class="detail-value">${birthday.split(":")[0]}</div>
              </div>
            </div>
  
        <div class="detail-item">
          <div class="detail-icon">✉️</div>
          <div class="detail-content">
            <div class="detail-label">Email</div>
            <div class="detail-value">${email}</div>
          </div>
        </div>
  
        <div class="detail-item">
          <div class="detail-icon">📱</div>
          <div class="detail-content">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${phoneNumber}</div>
          </div>
        </div>
  
        <div class="detail-item">
          <div class="detail-icon">🕒</div>
          <div class="detail-content">
            <div class="detail-label">Member Since</div>
            <div class="detail-value">${data}</div>
          </div>
        </div>
  
        <div class="detail-item">
          <div class="detail-icon">ღ</div>
          <div class="detail-content">
            <div class="detail-label">isWork</div>
            <div class="detail-value">
              <span class="status ${isWork && "available"}">${
    isWork ? "Work" : "Not Work"
  }</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="action-buttons">
        <button class="btn btn-edit" id="${id}">
          <span class="btn-icon">✏️</span>
          Edit
        </button>
        <button class="btn btn-delete" id="${id}">
          <span class="btn-icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  </div>`;

  list.append(template.content.firstElementChild);
}

async function getData(CONSTANTQueryArgument = CONSTANTQuery, isSearch = true) {
  loading.classList.replace("loadingNone", "loading");

  try {
    let query;
    if (isSearch) {
      query = {
        page: activePage,
        limit: LIMIT,
      };
    } else {
      query = isSearch;
    }

    let { data } = await request(`${CONSTANTQueryArgument}`, {
      params: query,
    });

    teachersList.innerHTML = "";
    pagination();

    data.forEach((user) => getCard(user, teachersList));

    deleteTeacher();
  } catch (error) {
    teachersList.innerHTML = "<p>No Students</p>";
  } finally {
    loading.classList.replace("loading", "loadingNone");
  }
}

getData();

// **************** ⇊ ⇊ pagination ⇊ ⇊ ***************

async function pagination() {
  try {
    let { data } = await request(CONSTANTQuery);
    let page = Math.ceil(data.length / LIMIT);

    if (page !== 1) {
      paginationBox.innerHTML = "";

      paginationBox.innerHTML += `
      <button class="pagination-btn ${
        activePage === 1 ? "disabled" : ""
      }" id="prev">⫷</button>
        <ul></ul>
        <button class="pagination-btn ${
          activePage === page ? "disabled" : ""
        }" id="next">⫸</button>`;

      let paginationList = document.querySelector(".pagination ul");

      paginationList.innerHTML = "";

      for (let i = 1; i <= page; i++) {
        paginationList.innerHTML += `
      <li class="pagination-btn ${
        i == activePage ? "active" : ""
      }" id="${i}">${i}</li>`;
      }

      let paginationBtns = document.querySelectorAll(".pagination-btn");

      paginationBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          changeActivePage(this.id, page);
        });
      });
    }
  } catch (error) {
    console.log("Pagination function:", error.message);
  }
}

function changeActivePage(id = 1, page = 10) {
  if (id == "prev" && activePage !== 1) {
    activePage--;
  } else if (id == "next" && activePage !== page) {
    activePage++;
  } else {
    activePage = +id;
  }
  getData();
}

// changeActivePage();

// **************** ⇈ ⇈ pagination ⇈ ⇈ ***************

// **************** ⇊ ⇊ add student ⇊ ⇊ ***************

let addTeacherBtn = document.querySelector(".btn-add-teacher");
let modal = document.querySelector(".modal");
let form = document.querySelector(".modal .formAdd");

addTeacherBtn.addEventListener("click", () => {
  form.classList.replace("EditForm", "formAdd");

  form.firstName.value = "";
  form.lastName.value = "";
  form.email.value = "";
  form.avatar.value = "";
  form.phoneNumber.value = "";
  form.isWork.checked = false;
  form.lastElementChild.textContent = "Submit";
  modal.classList.add("active");
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    if (!this.classList.contains("EditForm")) {
      let teacher = {
        createdAt: new Date().toISOString(),
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        avatar: this.avatar.value,
        birthday: this.birthday.value,
        isWork: this.isWork.checked,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };

      await request.post(CONSTANTQuery, teacher);

      modal.classList.remove("active");
      getData();
    }
  } catch (error) {
    console.log("submit error:", error.message);
  }
});

// **************** ⇈ ⇈ add student ⇈ ⇈ ***************

// **************** ⇊ ⇊ Delete student ⇊ ⇊ ***************

function deleteTeacher() {
  let deleteBtns = document.querySelectorAll(".btn-delete");

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async function () {
      let isDelete = confirm("Do you want to delete the teacher");
      if (isDelete) {
        await request.delete(CONSTANTQuery + this.id);
        getData();
        pagination();
      }
    });
  });
}

// **************** ⇈ ⇈ Delete student ⇈ ⇈ ***************

// **************** ⇊ ⇊ Edit student ⇊ ⇊ ***************

document.addEventListener("click", async function (e) {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    let { data } = await request(CONSTANTQuery + editBtn.id);

    form.classList.replace("formAdd", "EditForm");

    let EditForm = document.querySelector(".EditForm");

    EditForm.firstName.value = data.firstName;
    EditForm.lastName.value = data.lastName;
    EditForm.email.value = data.email;
    EditForm.avatar.value = data.avatar;
    EditForm.isWork.checked = data.isWork;
    EditForm.lastElementChild.textContent = "Edit";

    EditForm.addEventListener("submit", async function () {
      let teacher = {
        createdAt: new Date().toISOString(),
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        avatar: this.avatar.value,
        birthday: this.birthday.value,
        isWork: this.isWork.checked,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };

      try {
        await request.put(CONSTANTQuery + editBtn.id, teacher);
        modal.classList.remove("active");
        getData();
      } catch (error) {
        console.log("Edit function:", error.message);
      }
    });

    modal.classList.add("active");
  }
});

// **************** ⇈ ⇈ Edit student ⇈ ⇈ ***************

// **************** ⇊ ⇊ search student ⇊ ⇊ ***************

let inputSearch = document.getElementById("search");

inputSearch.addEventListener("keyup", (e) => {
  let searchText = e.target.value.trim();
  if (searchText) {
    getData(`students?firstName=${searchText}`, false);
  } else {
    getData();
  }
});

// **************** ⇈ ⇈ search student ⇈ ⇈ ***************

// **************** ⇊ ⇊ message post ⇊ ⇊ ***************

let messageBtn = document.querySelector(".nav-links li a");
let messageModal = document.querySelector(".messageModule");
let messageForm = document.querySelector(".messageModule .form");
messageBtn.addEventListener("click", () => {
  messageModal.classList.add("active");
});

window.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("modal")) modal.classList.remove("active");
  if (e.target.classList.contains("messageModule"))
    messageModal.classList.remove("active");
});

let massageModalDeleteBtn = document.querySelector(".messageModule .form span");

massageModalDeleteBtn.addEventListener("click", () => {
  messageModal.classList.remove("active");
});

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = this.email.value;
  let message = this.message.value;

  let sentText = `<b>userEmail:</b> ${email}\n<b>userText:</b> ${message}`;
  let chatId = "-4651127963";

  let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    sentText
  )}&parse_mode=html`;

  let api = new XMLHttpRequest();
  api.open("GET", url, true);
  api.send();

  alert("Xabar yuborildi!");
});

// **************** ⇊ ⇊ sort by isMarried teachers ⇊ ⇊ ***************

let select = document.getElementById("sortByIsWork");

select.addEventListener("change", (e) => {
  let selectValue = e.target.value;

  selectValue !== "all"
    ? getData(`students?isWork=${selectValue}`, false)
    : getData();
});
