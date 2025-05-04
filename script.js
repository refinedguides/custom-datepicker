const datepicker = document.querySelector(".datepicker");
const dateInput = document.querySelector(".date-input");
const yearInput = datepicker.querySelector(".year-input");
const monthInput = datepicker.querySelector(".month-input");
const cancelBtn = datepicker.querySelector(".cancel");
const applyBtn = datepicker.querySelector(".apply");
const nextBtn = datepicker.querySelector(".next");
const prevBtn = datepicker.querySelector(".prev");
const dates = datepicker.querySelector(".dates");

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = selectedDate.getMonth();

// show datepicker
dateInput.addEventListener("click", () => {
  datepicker.hidden = false;
});

// hide datepicker
cancelBtn.addEventListener("click", () => {
  datepicker.hidden = true;
});

// close datepicker on outside click
document.addEventListener("click", (e) => {
  const datepickerContainer = datepicker.parentNode;
  if (!datepickerContainer.contains(e.target)) {
    datepicker.hidden = true;
  }
});

// handle apply button click event
applyBtn.addEventListener("click", () => {
  // set the selected date to date input
  dateInput.value = selectedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // hide datepicker
  datepicker.hidden = true;
});

// handle next month nav
nextBtn.addEventListener("click", () => {
  if (month === 11) year++;
  month = (month + 1) % 12;
  displayDates();
});

// handle prev month nav
prevBtn.addEventListener("click", () => {
  if (month === 0) year--;
  month = (month - 1 + 12) % 12;
  displayDates();
});

// handle month input change event
monthInput.addEventListener("change", () => {
  month = monthInput.selectedIndex;
  displayDates();
});

// handle year input change event
yearInput.addEventListener("change", () => {
  const newYear = parseInt(yearInput.value, 10) || new Date().getFullYear();
  year = Math.min(2100, Math.max(1900, newYear));
  yearInput.value = year;
  displayDates();
});

const updateYearMonth = () => {
  monthInput.selectedIndex = month;
  yearInput.value = year;
};

const handleDateClick = (e) => {
  const button = e.target;

  // remove the 'selected' class from other buttons
  const selected = dates.querySelector(".selected");
  selected && selected.classList.remove("selected");

  // add the 'selected' class to current button
  button.classList.add("selected");

  // set the selected date
  selectedDate = new Date(year, month, parseInt(button.textContent));
};

// render the dates in the calendar interface
const displayDates = () => {
  // update year & month whenever the dates are updated
  updateYearMonth();

  // clear the dates
  dates.innerHTML = "";

  //* display the last week of previous month

  // get the last date of previous month
  const lastOfPrevMonth = new Date(year, month, 0);

  for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
    // if the last day is Saturday don't show the leading dates
    if (lastOfPrevMonth.getDay() === 6) break;

    const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }

  //* display the current month

  // get the last date of the month
  const lastOfMonth = new Date(year, month + 1, 0);

  for (let i = 1; i <= lastOfMonth.getDate(); i++) {
    const button = createButton(i, false);
    button.addEventListener("click", handleDateClick);
    dates.appendChild(button);
  }

  //* display the first week of next month

  const firstOfNextMonth = new Date(year, month + 1, 1);

  for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
    // if the first day starts on Sunday don't show the trailing dates
    if (firstOfNextMonth.getDay() === 0) break;

    const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }
};

const createButton = (text, isDisabled = false) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.disabled = isDisabled;
  if (!isDisabled) {
    const buttonDate = new Date(year, month, text).toDateString();
    const today = buttonDate === new Date().toDateString();
    const selected = buttonDate === selectedDate.toDateString();

    button.classList.toggle("today", today);
    button.classList.toggle("selected", selected);
  }
  return button;
};

displayDates();
