const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const AppError = require("./api.utils/appError");
const app = express();
const { user, NotificationModel } = require("./server");
const {
  userAuthenticationModel,
  protect,
  placementModel,
} = require("./userAuthenticationModel");
const catchAsync = require("./api.utils/catchAsync");
const viewRouter = require("./routes/viewRoutes");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// TEST MIDDLEWARE
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// mongodb+srv://Ragini:<password>@cluster0.fctxiez.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp
mongoose.connect(
  "mongodb+srv://Ragini:qNUzQ2Qph8Glr1nx@cluster0.fctxiez.mongodb.net/NATOURS-APP?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
);

const port = 3000;
app.listen(port, () => {
  console.log("Hello from the server!");
});

/////////////////////////////global middleware//////////////////////////////////
////////////////////////serving static files//////////////////////////////
app.use(express.static(path.join(__dirname, "public")));

const signToken = (id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //req.authorization = token;
  console.log("Generated token:", token);
  console.log("Role in token:", role);
  return token;
};

const createSendToken = (user, res) => {
  const token = signToken(user._id, user.role);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  //console.log(user.name);
  // const userName = encodeURIComponent(user.name);
  user.password = undefined;
};

const getUser = catchAsync(async (req, res) => {
  const userData = await user.findOne({ name: req.params.user });
  // console.log(req.params);
  res.status(200).json({
    status: "success",
    data: {
      userData,
    },
  });
});

const getNotification = async (req, res) => {
  try {
    const notificationAll = await NotificationModel.find();
    res.status(200).json({
      status: "success",
      data: {
        notificationAll,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const postNotification = async (req, res) => {
  try {
    console.log("hello  notification");
    const newNotification = await NotificationModel.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        newNotification,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// const catchasync = require('./../utils/catchAsync')

const signup = catchAsync(async (req, res) => {
  const newUser = await userAuthenticationModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(newUser, res);
});

const adminEmail = process.env.ADMIN_EMAIL.trim();
const adminPassword = process.env.ADMIN_PASSWORD.trim();

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    // check if role is  admin
    if (role == "admin") {
      return loginAdmin(email, password, res);
    }
    console.log("epr", email, password, role);
    // 1.Check if email and password exist

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    //2.check if user exists and password is correct
    const user = await userAuthenticationModel
      .findOne({ email })
      .select("+password");
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Invalid email or password!", 401));
    }
    console.log("correct pass");

    if (role != "student") {
      return next(
        new AppError("Select role as student to login in as student!", 403)
      );
    }
    // console.log(user);

    //3.If everything is ok, then send token to client
    createSendToken(user, res);
    const userName = encodeURIComponent(user.name);
    console.log("user naame", userName);
    // res.redirect(`/notification`);
    res.status(200).json({
      status: "success",
      redirectURL: `/home/${userName}`, // URL to redirect to on successful login
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const loginAdmin = (email, password, res) => {
  try {
    if (email !== adminEmail || password !== adminPassword) {
      // Return an error message or handle non-matching credentials differently
      return res.status(403).json({
        status: "fail",
        message: "Invalid email or password!",
      });
    }

    const adminUser = {
      _id: "06712ffeshijatw530918",
      role: "admin",
    };

    const token = signToken(adminUser._id, adminUser.role);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      status: "success",
      redirectURL: "/admin",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const placementHandler = async function (req, res) {
  try {
    console.log("app pd", req.body);
    const otpt = await placementModel.create(req.body);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
};
// const userProfHandeler = async function (req, res) {
//   try {
//     const newUser = await user.create(req.body);
//     res.status(200).json({
//       status: "success",
//       // redirectURL: `/home/${userName}`, // URL to redirect to on successful login
//     });
//     createSendToken(newUser, res);
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

const userRouter = express.Router();
const notificationRouter = express.Router();
const adminRouter = express.Router();
const signupRouter = express.Router();
const loginRouter = express.Router();
// const loginAdminRouter = express.Router();

userRouter.route("/:user").get(protect("student"), getUser);
notificationRouter.route("/").get(getNotification);
adminRouter.route("/").post(postNotification);
signupRouter.post("/", signup);
loginRouter.post("/", login);
// loginAdminRouter.route("/").post(loginAdmin);

app.use("/", viewRouter);
app.use("/api/v1/home", userRouter);
app.use("/api/v1/notification", protect("student"), notificationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/login", loginRouter);
// app.use("/api/v1/login/admin", loginAdminRouter);
// app.post("/api/v1/userProfile", userProfHandeler);
app.post("/api/v1/placementdetails", placementHandler);
app.post("/api/v1/editPlacementDetails", placementHandler);
module.exports = { app, login };
