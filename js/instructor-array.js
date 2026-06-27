/*
=== Instructor List ===
I001 - Ignacio de Paul - Java and Spring Boot
I002 - Roberto Tan - React Development
I003 - Juan Carlos Lee - MongoDB
I004 - Carlos Kim - Testing

Total instructors: 4
*/

//to run, node instructor-array.js
const instructors = [
    {
        instructorId: "I001",
        instructorName: "Ignacio de Paul",
        expertise: "Java and Spring Boot",
    },
    {
        instructorId: "I002",
        instructorName: "Roberto Tan",
        expertise: "React Development",
    },
    {
        instructorId: "I003",
        instructorName: "Juan Carlos Lee",
        expertise: "MongoDB",
    },
    {
        instructorId: "I004",
        instructorName: "Carlos Kim",
        expertise: "Testing",
    }
];

console.log("=== Instructor List ===");
for(const instructor of instructors) {
    console.log(`${instructor.instructorId} - ${instructor.instructorName} - ${instructor.expertise}`);
}

console.log("\nTotal instructors: " + instructors.length);