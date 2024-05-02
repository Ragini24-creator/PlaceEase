const { NotificationModel } = require("../server");
const { user } = require("../server");
const { login } = require("../app.js");
const express = require("express");
const { placementModel } = require("../userAuthenticationModel.js");
const router = express.Router();
const { protect } = require("../userAuthenticationModel");
const app = express();

app.use(express.json());
router.get("/home/:user", protect("student"), async (req, res) => {
  try {
    const userData = await user.findOne({ name: req.params.user });
    console.log(userData);
    if (!userData) {
      console.log("No user found with that name");
      res.status(404).send("User not found");
      return;
    }
    res.status(200).render("home", { userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching the user data");
  }
});

router.get("/placementDetails", protect("student"), async (req, res) => {
  const entries = await placementModel.find();
  res.status(200).render("placementDetails", { entries });
});

router.get("/editPlacementDetails", (req, res) => {
  res.render("editForm", {});
});

// router.post("/editPlacementDetails", async (req, res) => {
//   try {
//     console.log("pd", req.body);
//     const otpt = await placementModel.create(req.body);
//     res.status(200).json({
//       status: "success",
//       data: otpt,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get("/admin", protect("admin"), (req, res) => {
  res.status(200).render("admin", {});
});

// router.get("/home/:user", (req, res) => {
//   res.status(200).render("base", {
//     title: "The Park Camper",
//   });
// });

router.get("/", (req, res) => {
  res.status(200).render("login", {
    title: "Log into Your account!",
  });
});

router.get("/userProfile", (req, res) => {
  res.status(200).render("userProfile", {
    title: "Log into Your account!",
  });
});

router.get("/login", (req, res) => {
  res.status(200).render("login", {
    title: "Log into Your account!",
  });
});

router.get("/notification", protect("student"), async (req, res) => {
  try {
    const notifications = await NotificationModel.find();
    res.status(200).render("notification", {
      notifications,
    });
  } catch (err) {
    console.log(err);
  }
});
// routes.get("/login");
module.exports = router;
