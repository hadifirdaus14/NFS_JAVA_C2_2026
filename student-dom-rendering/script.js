
const students = [
    {
        studentId: "S001",
        studentName: "Alice Johnson",
        email: "alice@example.com",
        status: "Active"
    },
    {
        studentId: "S002",
        studentName: "Bob Smith",
        email: "bob@example.com",
        status: "Inactive"
    },
    {
        studentId: "S003",
        studentName: "Charlie Brown",
        email: "charlie@example.com",
        status: "Active"
    },
    {
        studentId: "S004",
        studentName: "Diana Prince",
        email: "diana@example.com",
        status: "Active"
    }
];

const studentList = document.getElementById("student-list");

students.forEach(student => {
    const studentCard = document.createElement("div");
    studentCard.innerHTML = `
        <h2>${student.studentName}</h2>
        <p>Student ID: ${student.studentId}</p>
        <p>Email: ${student.email}</p>
        <p>Status: ${student.status}</p>
    `;
    studentList.appendChild(studentCard);
});