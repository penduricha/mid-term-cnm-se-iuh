// mkdir myapp
// cd myapp
// npm init -y
//Nhớ run thư viện ejs của express
// npm install express ejs
//nodejs 20.13.1
const express = require('express');
const app = express();
const PORT = 3000;
//dùng const, ko dùng import
const bodyParser = require('body-parser');
let students = require('./dataset/students.js');


// Thiết lập thư mục views và engine EJS
//Cho ejs dùng css và js folder
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('views'));
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', './views');
app.set('view engine', 'ejs');

// Định nghĩa route cho trang chính
app.get("/", (req, res) => {
    try {
        console.log("data=", students);
        //return res.render("index.ejs", { data: data.Items });
        return res.render("index.ejs", { students: students });
    } catch (error) {
        //console.error("Error retrieving data from DynamoDB:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/add-student", (req, res) => {
    const { name, age, gender } = req.body; // Destructure the incoming data
    if (name && age && gender) {
        // Determine the next ID
        const nextId = students.length > 0 ? Math.max(...students.map(student => student.id)) + 1 : 1;
        // Add new student with ID
        students.push({ id: nextId, name, age, gender });
        console.log("Student added:", { id: nextId, name, age, gender });
    }
    res.redirect("/");
});

app.post("/delete-student/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    students = students.filter(student => student.id !== studentId);
    console.log("Student deleted with ID:", studentId);
    res.redirect("/");
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});