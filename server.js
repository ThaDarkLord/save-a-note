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

app.delete(`/api/notes/:id`, (req, res) => {
  console.info(`${req.method} request received to add a review`);
  console.log(req.params.id);
  // let id = req.params.id
  // console.log(id)

  fs.readFile("./db/db.json", "utf8").then((data) => {
    const parsedNote = JSON.parse(data);
    const result = parsedNote.filter((note) => note.id !== req.params.id);

    const updatedNote = JSON.stringify(result);
    fs.writeFile("./db/db.json", updatedNote)
      .then(() => {
        res.status(201).json(updatedNote);
      })
      .catch((err) => console.log(err));
  });
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
