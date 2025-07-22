const budgetAdd = document.querySelector(".budget input");
const budgetddBtn = document.querySelector(".budget button");
const removeBudgetBtn = document.querySelector(".removeBudget");
const projectAdd = document.querySelector(".projectName");
const projectCost = document.querySelector(".projectCost");
const projectAddBtn = document.querySelector(".expense button");
const showBudget = document.querySelector(".totalBudget h5");
const showExpense = document.querySelector(".totalExpenses h5");
const showBalance = document.querySelector(".totalBalance h5");
const clearAll = document.querySelector(".clearAll");
const dateInput = document.querySelector(".date");
const showing = document.querySelector(".showing");
const darkBtn = document.querySelector(".mode");
const body = document.querySelector("body");
const icon1 = document.querySelector(".night");
const icon2 = document.querySelector(".sun");

let budget = 0;
let expense = 0;
let balance = 0;
let projectName = "";
let cost = 0;
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const checkmode = () => {
  if (darkMode) {
    icon1.classList.add("hide");
    icon2.classList.remove("hide");
    body.classList.add("dark");
    darkBtn.classList.add("on");
  } else {
    icon2.classList.add("hide");
    icon1.classList.remove("hide");
    body.classList.remove("dark");
    darkBtn.classList.remove("on");
  }
  localStorage.setItem("darkMode", darkMode);
};
checkmode();

darkBtn.addEventListener("click", () => {
  if (darkMode === true) {
    darkMode = false;
  } else {
    darkMode = true;
  }
  checkmode();
});

function updateAndSave() {
  addBudget();
  addExpense();
  checkBalance();
  saveToLocalStorage();
}

clearAll.addEventListener("click", function () {
  
  localStorage.clear();
  location.reload();
});

const addBudget = () => {
  showBudget.innerHTML = `${budget}`;
};

const addExpense = () => {
  showExpense.innerHTML = `${expense}`;
};

const checkBalance = () => {
  balance = Number(budget) - Number(expense);
  if (balance < 0) {
    showing.classList.add("red");
    showing.classList.add("pulse");
  } else {
    showing.classList.remove("red");
    showing.classList.remove("pulse");
  }
  showBalance.innerHTML = `${balance}`;
};

const addToList = (name, value, dateStr) => {
  const list = document.querySelector(".list");
  const item = document.createElement("div");
  item.classList.add("project");
  item.innerHTML = `
                <div class="info">
                <div class="name">${name}</div>
                <div class="price">৳${value}</div>
                <div class="date">${dateStr}</div>
                
                </div>
                
                <div class="change">
                    <div class="edit"><i class="fa-solid fa-pen-to-square"></i></div>
                    <div class="delete"><i class="fa-solid fa-trash"></i></div>

                </div>

    
    `;

  item.querySelector(".delete").addEventListener("click", () => {
    expense -= Number(value);
    list.removeChild(item);

    updateAndSave();
  });

  item.querySelector(".edit").addEventListener("click", () => {
    expense -= Number(value);
    list.removeChild(item);
    projectAdd.value = name;
    projectCost.value = Number(value);
    dateInput.value = dateStr;
    updateAndSave();
    projectAdd.focus();
  });

  list.appendChild(item);
};

budgetddBtn.addEventListener("click", function () {
  if (budgetAdd.value.trim() === "") {
    alert("Budget can not be empty.");
    return;
  } else if (!/^\d+$/.test(budgetAdd.value.trim())) {
    alert("Please enter a valid Budget.");
    budgetAdd.value = "";
    return;
  } else {
    budget += Number(budgetAdd.value.trim());

    updateAndSave();
    budgetAdd.value = "";
  }
});

removeBudgetBtn.addEventListener("click", () => {
  if (budget === 0) {
    alert("You can not remove any budget now!");
    budgetAdd.value = "";
    return;
  } else if (budgetAdd.value.trim() === "") {
    alert("Budget can not be empty.");
    return;
  } else if (!/^\d+$/.test(budgetAdd.value.trim())) {
    alert("Please enter a valid Budget.");
    budgetAdd.value = "";
    return;
  } else {
    budget -= Number(budgetAdd.value.trim());

    updateAndSave();
    budgetAdd.value = "";
  }
});

projectAddBtn.addEventListener("click", function () {
  if (projectCost.value.trim() === "") {
    alert("Cost can not empty.");
    return;
  } else if (projectAdd.value.trim() === "") {
    alert("Title can not empty.");
    return;
  } else if (!/^\d+$/.test(projectCost.value.trim())) {
    alert("Please enter a valid cost.");

    projectAdd = "";
    projectCost = "";
    dateInput.value = "";
    return;
  } else if (dateInput.value === "") {
    alert("Select The date please!");
    return;
  } else {
    cost = projectCost.value.trim();
    expense += Number(cost);
    const selectedDate = dateInput.value;
    addToList(projectAdd.value.trim(), cost, selectedDate);
    updateAndSave();

    cost = 0;
    projectName = projectAdd.value.trim();
    projectAdd.value = "";
    projectCost.value = "";
    dateInput.value = "";
    projectAdd.focus();
  }
});

projectAdd.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    projectCost.focus();
  }
});

projectCost.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    dateInput.focus();
  }
});

budgetAdd.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    budgetddBtn.click();
  }
});

dateInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    projectAddBtn.click();
    projectAdd.focus();
  }
});

function saveToLocalStorage() {
  const expenseItems = [];
  document.querySelectorAll(".list .project").forEach((item) => {
    const name = item.querySelector(".name").textContent;
    const costText = item.querySelector(".price").textContent;
    const cost = Number(costText.replace(/[৳]/g, ""));
    const date = item.querySelector(".date").textContent;
    expenseItems.push({ name, cost, date });
  });

  const data = {
    budget,
    expense,
    expenseItems,
  };

  localStorage.setItem("expenseTrackerData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem("expenseTrackerData");
  if (!savedData) return;

  const data = JSON.parse(savedData);
  budget = data.budget || 0;
  expense = data.expense || 0;

  showBudget.innerHTML = budget;
  showExpense.innerHTML = expense;
  checkBalance();

  if (data.expenseItems && data.expenseItems.length > 0) {
    data.expenseItems.forEach((item) => {
      addToList(item.name, item.cost, item.date);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});
