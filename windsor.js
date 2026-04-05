const buttons = document.querySelectorAll("main button");
const submit = document.getElementById("submit");
const selectionMessage = document.getElementById("selection-message");
const page1 = document.getElementById("page-1");
const page2 = document.getElementById("page-2");
let selectedItems = [];
let confirmStep = false;

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const buttonText = e.target.textContent;
    const isSelected = selectedItems.includes(buttonText);

    if (!isSelected && selectedItems.length < 3) {
      selectedItems.push(buttonText);
      e.target.style.backgroundColor = "#CEB888";
    } else if (isSelected) {
      const index = selectedItems.indexOf(buttonText);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
      e.target.style.backgroundColor = "transparent";
    }

    updateSelectionList();
  });
});

submit.addEventListener("click", () => {
  if (!confirmStep) {
    // First click: show the order review page
    if (selectedItems.length === 0) {
      alert("Please select up to three items before hitting submit.");
      return;
    }
    page1.classList.add("hide-display");
    page2.classList.remove("hide-display");
    submit.innerHTML = "Confirm your order";
    confirmStep = true;
  } else {
    // Second click: confirm and go to thank you page
    window.location.href = "page3.html";
  }
});

function updateSelectionList() {
  selectionMessage.innerHTML = "";
  selectedItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    selectionMessage.appendChild(listItem);
  });
}

page1.classList.remove("hide-display");
page2.classList.add("hide-display");