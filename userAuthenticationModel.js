const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AppError = require("./api.utils/appError");
const { user } = require("./server");

const placementSchema = new mongoose.Schema({
  Name: String,
  Branch: String,
  Company: String,
});

const placementModel = new mongoose.model("placementModel", placementSchema);

// {
//   {Branch:"Computer Engineering",Name:"Niraj harishankar pal" , Company:	"Jio Platforms Ltd.(Jio Illuminate)"}
// 	Computer Engineering	 Adnan Chaudhary	Jio Platforms Ltd. (Jio Illuminate)
// 	Computer Engineering	 Shubham Mishra	Jio Platforms Ltd. (Jio Illuminate)
// 	Computer Engineering	Kunal Patil	Jio Platforms Ltd.(Jio Illuminate)
// 	Computer Engineering	Gupta Kishan Kumar Rajesh Kumar 	Zeus Learning
// 	Computer Engineering	Tejas Maniyar	FlytBase
// 	Computer Engineering	Prathmesh Deshmukh	Jio Platforms Ltd.

// 	Computer Engineering	Aniket ishwar jagtap	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Ravishankar kaushal	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Pranav Tiwari	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Poorvita Chandwadkar	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Shrishty Anil Saxena 	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Affan Ansari 	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Pooja Girish Bhagat	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Abhay Upadhyaya 	Jio Platforms Ltd. ( Jio Ignite)	Computer Engineering	Kovid Thalia 	Jio Platforms Ltd. ( Jio Ignite)
// 	Computer Engineering	Dishant Singh 	LS Digital
// 	Computer Engineering	Vismita Verma	LS Digital
// 	Computer Engineering	Anurag Nadkarni	Jio Platforms Ltd.(Jio Spark)
// 	Computer Engineering	Shivendra Singh	exponentia.ai
// 	Computer Engineering	Anushka Gaikwad	exponentia.ai
// 	Computer Engineering	Siddhesh Bhor	Intellect Design Arena
// 	Computer Engineering	Devanshi Shrivastava 	Nimap Infotech
// 	Computer Engineering	Richa Singh 	Aurionpro Solutions Ltd.
// 	Computer Engineering	Aashish Verma 	Aurionpro Solutions Ltd.
// 	Computer Engineering	Ujjwal Jha	Aurionpro Solutions Ltd.
// Computer Engineering	Shreyas Mhatre	Aurionpro Solutions Ltd.
// 	Computer Engineering	Shaikh Mehzabeen Altaf	Aurionpro Solutions Ltd.
// 	Computer Engineering	Priyansha Tiwary	Aurionpro Solutions Ltd.
//   	Computer Engineering	Tanish Indrajeet Batham	Aurionpro Solutions Ltd.
// 	Computer Engineering	Rohit Sabat 	Aurionpro Solutions Ltd.
// Nucsoft Limited
// 	Computer Engineering	Vedang Badawe	Aurionpro Solutions Ltd.
// 	Computer Engineering	Utkarsh Rana	Aurionpro Solutions Ltd.
// SBI LIFE
// 	Computer Engineering	Abhishek Singh	Zycus Infotech
// 	Computer Engineering	Pradeep Gupta 	SBI Life
// 	Computer Engineering	Prathamesh Anil Bhanse	SBI Life
// 	Computer Engineering	Nikita Patil 	SBI Life
// 	Computer Engineering	Shivam Pandey	SBI Life
// 	Computer Engineering	Ashish Gupta 	SBI Life
// 	Computer Engineering	Gayatri Patkar	SBI Life
// Computer Engineering	Sujata Jaiswar 	Hindustan Unilever Ltd.
// Computer Engineering	Aniket Singh 	Neebel Technologies
// Computer Engineering	Shraddha Mishra 	Ugam Solutions
// Computer Engineering	Swaraj Dhanaji Gadhave	Ugam Solutions
// Computer Engineering	Siddhi Manjrekar 	Ugam Solutions
// Computer Engineering	Iram Abdul Wahid Shaikh 	Ugam Solutions
// Computer Engineering	Soham Nandkumar Mahajan	Burns & McDonnell
// Computer Engineering	Samiksha Shridhar Bopardikar	Sankey Solutions
// Computer Engineering	Sumit Sharma 	Sankey Solutions
// Computer Engineering	Rajas Mahajan	Sankey Solutions
// }

//name,email,photo,password, passwordConfirm
const userAuthenticationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Provide Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password!"],
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "Password are not the same!",
    },
  },

  role: {
    type: String,
    default: "student",
    enum: ["student", "admin"],
  },
});

userAuthenticationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userAuthenticationSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userAuthenticationModel = mongoose.model(
  "userAuthenticationModel",
  userAuthenticationSchema
);

const protect = (requiredRole) => {
  return async (req, res, next) => {
    try {
      let token;
      // 1. Getting token and checking if it's there
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      // 2. Verification token
      if (!token) {
        return next(
          new AppError(
            "You are not logged in. Please log in to get access!",
            401
          )
        );
      }

      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      console.log(decoded.role);
      // Check user's role
      if (decoded.role !== requiredRole) {
        return res.status(403).json({
          message: `Access denied. ${requiredRole} role required.`,
        });
      }

      // If the role is correct, proceed
      req.user = decoded; // Set decoded user information in the request
      next();
    } catch (err) {
      res.status(401).json({
        status: "fail",
        message: err,
      });
    }
  };
};
module.exports = { userAuthenticationModel, protect, placementModel };
