const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors");
const { mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/dbConn");
const multer = require("multer");
const fs = require("fs");
const Places = require("./models/Places");
require("dotenv").config();

connectDB();
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://airbnb-clone-t3um.onrender.com"],
  })
);

app.get("/", (req, res) => {
  res.json("test ok");
});
//post request for register in express?
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // TODO - implement registration logic here
  try {
    console.log("inside try 1");
    const hashedPwd = await bcrypt.hash(password, 10);
    console.log(name, email);
    const userData = await User.create({
      name,
      email,
      password: hashedPwd,
    });
    res.json(userData);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userData = await jwt.verify(token, jwtSecret);
    const userDoc = await User.findById(userData.id).select("-password").lean();
    res.json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.clearCookie("token");
  res.json("logged out");
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, destination, filename, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = destination + filename + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.post("/addplaces", async (req, res) => {
  try {
    const {
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const PlaceDoc = await Places.create({
        owner: userData.id,
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });

      res.json(PlaceDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/places", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const { id } = userData;
      const places = await Places.find({ owner: id });
      res.json(places);
    });
  } else {
    res.json(null);
  }
});
app.get("/allplaces", async (req, res) => {
  // const { token } = req.cookies;

  // if (token) {
  // jwt.verify(token, jwtSecret, {}, async (error, userData) => {
  //   if (error) throw error;
  const places = await Places.find({});
  res.json(places);
  // });
  // } else {
  // res.json(null);
  // }
});
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Places.findById(id));
});

app.put("/addplaces", async (req, res) => {
  const {
    id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  const { token } = req.cookies;
  const PlaceDoc = await Places.findById(id);
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      if (userData.id === PlaceDoc.owner) {
        Places.updateOne({
          owner: userData.id,
          title,
          address,
          photos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
        });
        Places.bulkSave();
      }
      res.json("updated");
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
