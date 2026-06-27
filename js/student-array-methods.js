
const students = [
  { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
  { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
  { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" }
];

/*
forEach
filter
find
map
*/

//Use `forEach` to print all student names.
console.log("====Student Names====");
students.forEach(student => {
  console.log(`Name: ${student.studentName}`);
});

//Use `filter` to create a new array containing only students whose status is `"Active"`.
console.log("====Active Students====");
const activeStudents = students.filter(student => student.status === "Active");
console.log(activeStudents);

//Use `find` to find the student with ID:
console.log("====Find Student S002====");
const foundStudent = students.find(student => student.studentId === "S002");
console.log(foundStudent);

//Use `map` to create a new array containing only student email addresses.
console.log("====Student Emails====");
const studentEmails = students.map(student => student.email);
console.log(studentEmails);

/*
push
pop
shift
unshift
*/

// Use `push` to add one new student to the **end** of the array.
/*
{
  studentId: "S004",
  studentName: "Danish Nawaz",
  email: "danish@example.com",
  status: "Active"
}
*/
console.log("=== After push ===");
const newLengthAfterPush = students.push({studentId: "S004", studentName: "Danish Nawaz",email: "danish@example.com",status: "Active"});
console.log(students);
console.log(`New length after push: ${newLengthAfterPush}`);

//Use `pop` to remove the **last student** from the array.
console.log("=== After pop ===");
const removedLastStudent = students.pop();
console.log(students);
console.log("Removed last student:", removedLastStudent);

//Use `unshift` to add one new student to the **beginning** of the array.
const newLengthAfterUnshift = students.unshift({
    studentId: "S000",
    studentName: "Ignacio de Paul",
    email: "ignacio@example.com",
    status: "Active"
});
console.log("=== After unshift ===");
console.log(students);
console.log(`New length after unshift: ${newLengthAfterUnshift}`);

//Use `shift` to remove the **first student** from the array.
const removedFirstStudent = students.shift();
console.log("=== After shift ===");
console.log(students);
console.log("Removed first student:", removedFirstStudent);

console.log("====Final Students Array====");
console.log(students);
