// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a "Save Note" button and a "Clear Form" button appear in the navigation at the top of the page
// WHEN I click on the Save button
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes and the buttons in the navigation disappear
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column and a "New Note" button appears in the navigation
// WHEN I click on the "New Note" button in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column and the button disappears

const fs = require("fs").promises;
const express = require("express");
const path = require("path");
const uuid = require("./help/uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// route

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8").then((data) =>
    res.json(JSON.parse(data))
  );
});

// add read file element
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile("./db/db.json", "utf8").then((data) => {
      const parsedNote = JSON.parse(data);

      parsedNote.push(newNote);

      const updatedNote = JSON.stringify(parsedNote);

      fs.writeFile("./db/db.json", updatedNote)
        .then(() => console.log("Success!!"))
        .catch((err) => console.log(err));
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}/`)
);
