// console.log(new Date().toISOString().slice(0, 19).replace("T", " "));
// const date = Date.now();
// console.log(date);

var currentTime = Date.now(); // Lấy thời gian hiện tại
console.log(currentTime); // Kết quả: 1635321296000
var mysqlDateTime = new Date(currentTime)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

console.log(mysqlDateTime); // Kết quả: 2023-10-27 12:34:56
