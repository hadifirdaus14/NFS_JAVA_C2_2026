

const student ={
    studentId: "S001",
    studentName: "Aina Rahman",
    email: "aina@example.com",
    status: "Active"
};

//normal function
function formatStudent(student){
    // return formatted string
    return `${student.studentId} - ${student.studentName} (${student.status})`;
}

//arrow function
const getStudentEmail = (student) => {
  // return student email
  return student.email;
};

//short arrow function
const getStudentStatus = (student) => student.status;

console.log(formatStudent(student));
console.log(getStudentEmail(student));
console.log(getStudentStatus(student));