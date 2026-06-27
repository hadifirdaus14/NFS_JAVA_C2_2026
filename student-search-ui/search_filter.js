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
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resetButton = document.getElementById("reset-button");

function renderStudents(studentArray) {
    studentList.innerHTML = "";

    if (studentArray.length === 0) {
        studentList.innerHTML = "<p>No students found.</p>";
        return;
    }

    studentArray.forEach((student) => {
        const studentCard = document.createElement("div");
        studentCard.innerHTML = `
            <h2>${student.studentName}</h2>
            <p>Student ID: ${student.studentId}</p>
            <p>Email: ${student.email}</p>
            <p>Status: ${student.status}</p>
        `;
        studentList.appendChild(studentCard);
    });
}

/*
add button to search and reset
*/

searchButton.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const results = students.filter((student) => {
        return student.studentName.toLowerCase().includes(keyword);
    });
    renderStudents(results);
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    renderStudents(students);
});

renderStudents(students);