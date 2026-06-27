
// S001 - Aina Rahman (Active)
// aina@example.com
// Active

const student ={
    studentId: "S001",
    studentName: "Aina Rahman",
    email: "aina@example.com",
    status: "Active"
};

function formatStudent(student){
    // return formatted string
    return `${student.studentId} - ${student.studentName} (${student.status})`;
}

const getStudentEmail = (student) => {
  // return student email
  return student.email;
};

const getStudentStatus = (student) => student.status;

console.log(formatStudent(student));
console.log(getStudentEmail(student));
console.log(getStudentStatus(student));