export function formatDate(date) {
  let array = date.split("-");
  let newDate = "";
  for (let i = array.length - 1; i >= 0; i--) {
    newDate += array[i];
    if (i > 0) {
      newDate += "/";
    }
  }
  return newDate;
}

export function formatSchedule(schedule) {
  let array = schedule.split(" | ");
  let string = array[1];
  if (array[0] === "2") return "Thứ 2 : " + string;
  if (array[0] === "3") return "Thứ 3 : " + string;
  if (array[0] === "4") return "Thứ 4 : " + string;
  if (array[0] === "6") return "Thứ 6 : " + string;
  if (array[0] === "5") return "Thứ 5 : " + string;
  if (array[0] === "7") return "Thứ 7 : " + string;
  if (array[0] === "CN") return "Chủ nhật : " + string;
}
