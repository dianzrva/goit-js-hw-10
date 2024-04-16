import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', onClickStartTimer);
startBtn.disabled = true;

let timeDifference;
let intervalId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      startBtn.disabled = true;
      iziToast.error({
        backgroundColor: 'tomato',
        message: 'Please choose a date in the future',
        messageColor: 'white',
        messageSize: '20',
        position: 'topRight',
        close: true,
        displayMode: 2,
      });
    } else {
      startBtn.disabled = false;
      timeDifference = selectedDates[0];
    }
  },
};

flatpickr(input, options);

function onClickStartTimer() {
  intervalId = setInterval(calculateTimeLeft, 1000);
  startBtn.disabled = true;
  input.disabled = true;
}

function updateClockface(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  if (!days && !hours && !minutes && !seconds) {
    clearInterval(intervalId);
    input.disabled = false;
  }

  timerDays.textContent = addLeadingZero(days);
  timerHours.textContent = addLeadingZero(hours);
  timerMinutes.textContent = addLeadingZero(minutes);
  timerSeconds.textContent = addLeadingZero(seconds);
}


function calculateTimeLeft() {
  const currentDate = new Date().getTime();
  const selectedDate = new Date(timeDifference).getTime();
  const ms = selectedDate - currentDate;
  updateClockface(ms);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}