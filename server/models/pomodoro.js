const env = process.env;
const textMessage = require('./textMessage');

let currentPomodoroTask = { };
let currentPomodoroBreak = { };
const pomodoroLength = env.pomodoroLength ? env.pomodoroLength : 25;
const breakLength = env.breakLength ? env.breakLength : 7;

function minutes(value) {
  return 1000 * 60 * value;
}

function currentTask() {
  currentPomodoroTask.minutesLeft = (currentPomodoroTask.endTime - new Date()) / minutes(1);
  return currentPomodoroTask;
}

function currentBreak() {
  currentPomodoroBreak.minutesLeft = (currentPomodoroBreak.endTime - new Date()) / minutes(1);
  return currentPomodoroBreak;
}

function isWorkingOnTask() {
  return currentTask().startTime;
}

function isOnBreak() {
  return currentBreak().startTime;
}

function clearTask() {
  if (!isWorkingOnTask()) return;
  currentTask().endTime = new Date();

  // TODO: Save task

  currentPomodoroTask = { };
}

function clearBreak() {
  currentPomodoroBreak = { };
}

function startTask(description) {
  clearTask();

  clearBreak();

  currentPomodoroTask = {
    id: new Date().getTime(),
    title: description,
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(pomodoroLength)),
  };
  // TODO: Save task
  textMessage.send(`${currentPomodoroTask.title} started at ${new Date()}`);
}

function startBreak() {
  textMessage.send('take a break!');

  clearTask();
  currentPomodoroBreak = {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(breakLength)),
  };
}

function clearAll() {
  textMessage.send('cleared.');
  clearTask();
  clearBreak();
}

function backToWork() {
  textMessage.send('back to work!');
  clearTask();
  clearBreak();
}

function tick() {
  if (isWorkingOnTask()) {
    if (currentTask().minutesLeft <= 0) {
      startBreak();
    }
  }

  if (isOnBreak()) {
    if (currentBreak().minutesLeft <= 0) {
      backToWork();
    }
  }
}

module.exports.startTask = startTask;
module.exports.currentTask = currentTask;
module.exports.currentBreak = currentBreak;
module.exports.isWorkingOnTask = isWorkingOnTask;
module.exports.isOnBreak = isOnBreak;
module.exports.startBreak = startBreak;
module.exports.tick = tick;
module.exports.clearAll = clearAll;

