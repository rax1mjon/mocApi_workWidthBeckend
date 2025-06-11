const ENDPOINT = "https://68470ed97dbda7ee7ab156ca.mockapi.io";
const LIMIT = 6;
const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 20000,
});

export { ENDPOINT, LIMIT, request };

let teachersList = document.querySelector(".teacher--menu");
let searchInput = document.querySelector(".search-input");
let paginationBox = document.querySelector(".pagination");
let btns = document.querySelectorAll("button");
let activePage = 1;
function getCard(
  {
    createdAt,
    FirstName,
    LastName,
    avatar,
    isMarried,
    phoneNumber,
    email,
    id,
    group,
  },
  list
) {
  let data = createdAt.split("T")[0];

  let template = document.createElement("template");
  template.innerHTML = `
  <div class="user-card" id="${id}">
    <div class="card-header">
      <div class="avatar-container">
        <img class="avatar" src="${avatar}" alt="${FirstName}">
      </div>
    </div>
    <div class="card-body">
      <h2 class="user-name">${FirstName}</h2>
      <h3 class="user-LastName">${FirstName + " " + LastName}</h3>
      <p class="user-title">Field ${id} Specialist</p>
  
      <div class="divider"></div>
  
      <div class="user-details">
        <div class="detail-item">
          <div class="detail-icon">👥</div>
          <div class="detail-content">
            <div class="detail-label">Group</div>
            <div class="detail-value">${group.length}</div>
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
            <div class="detail-label">isMarried</div>
            <div class="detail-value">
              <span class="status ${isMarried && "available"}">${
    isMarried ? "Married" : "Not Married"
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
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

async function getData(CONSTANTQueryArgument = "teachers", isSearch = true) {
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

    let userCards = document.querySelectorAll(".user-card");

    userCards.forEach((userCard) => {
      userCard.addEventListener("dblclick", function () {
        location = "./students.html?teacherId=" + this.id;
      });
    });
  } catch (error) {
    if (error.status == 404) teachersList.innerHTML = "<p>No Teachers</p>";
  }
}

getData();

// **************** ⇊ ⇊ pagination ⇊ ⇊ ***************

async function pagination() {
  try {
    let { data } = await request("teachers");
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

changeActivePage();

// **************** ⇈ ⇈ pagination ⇈ ⇈ ***************

// **************** ⇊ ⇊ add teachers ⇊ ⇊ ***************

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
  form.isMarried.checked = false;
  form.lastElementChild.textContent = "Submit";
  modal.classList.add("active");
});

window.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("modal")) modal.classList.remove("active");
});

form.addEventListener("submit", async function () {
  try {
    if (!this.classList.contains("EditForm")) {
      let teacher = {
        createdAt: new Date().toISOString(),
        FirstName: this.firstName.value,
        LastName: this.lastName.value,
        avatar: this.avatar.value,
        group: [],
        isMarried: this.isMarried.checked,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };

      await request.post("teachers", teacher);

      modal.classList.remove("active");
      getData();
    }
  } catch (error) {
    console.log("submit error:", error.message);
  }
});

// **************** ⇈ ⇈ add teachers ⇈ ⇈ ***************

// **************** ⇊ ⇊ Delete teachers ⇊ ⇊ ***************

function deleteTeacher() {
  let deleteBtns = document.querySelectorAll(".btn-delete");

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async function () {
      let isDelete = confirm("Do you want to delete the teacher");
      if (isDelete) {
        await request.delete("teachers/" + this.id);
        getData();
      }
    });
  });
}

// **************** ⇈ ⇈ Delete teachers ⇈ ⇈ ***************

// **************** ⇊ ⇊ Edit teachers ⇊ ⇊ ***************

document.addEventListener("click", async function (e) {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    let { data } = await request("teachers/" + editBtn.id);

    form.classList.replace("formAdd", "EditForm");

    let EditForm = document.querySelector(".EditForm");

    EditForm.firstName.value = data.FirstName;
    EditForm.lastName.value = data.LastName;
    EditForm.email.value = data.email;
    EditForm.avatar.value = data.avatar;
    EditForm.phoneNumber.value = data.phoneNumber.split("x")[0];
    EditForm.isMarried.checked = data.isMarried;
    EditForm.lastElementChild.textContent = "Edit";

    EditForm.addEventListener("submit", async function () {
      let teacher = {
        createdAt: new Date().toISOString(),
        FirstName: this.firstName.value,
        LastName: this.lastName.value,
        avatar: this.avatar.value,
        group: [],
        isMarried: this.isMarried.checked,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };

      try {
        await request.put("teachers/" + editBtn.id, teacher);
        modal.classList.remove("active");
        getData();
      } catch (error) {
        console.log("Edit function:", error.message);
      }
    });

    modal.classList.add("active");
  }
});

// **************** ⇈ ⇈ Edit teachers ⇈ ⇈ ***************

// **************** ⇊ ⇊ search teachers ⇊ ⇊ ***************

let inputSearch = document.getElementById("search");

inputSearch.addEventListener("keyup", (e) => {
  let searchText = e.target.value.trim();
  if (searchText) {
    getData(`teachers?FirstName=${searchText}`, false);
  } else {
    getData();
  }
});
