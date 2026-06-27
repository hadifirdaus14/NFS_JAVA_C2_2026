
const statusMessage = document.getElementById('status-message');
const studentList = document.getElementById('student-list');

function renderStudents(studentArray) {
    studentList.innerHTML = "";

    if (studentArray.length === 0) {
        studentList.innerHTML = "<p>No students found.</p>";
        return;
    }

    studentArray.forEach((student) => { // Loop through each student in the array
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

async function loadStudents() {
    try {
        statusMessage.textContent = "Loading student data...";
        const response = await fetch("students.json"); //fetch the student data from JSON file

        if (!response.ok) {
            throw new Error("Failed to load student data.");
        }

        const students = await response.json(); //converts the response of json data into a JavaScript object
        statusMessage.textContent = "Student data loaded successfully.";
        renderStudents(students);

    } catch (error) {
        console.error("Failed to load student data: " + error.message);
        statusMessage.textContent = "Failed to load student data."; //if error, this message will be displayed
    }
}

loadStudents(); // load the student data when the page loads