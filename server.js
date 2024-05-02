const dotenv = require("dotenv");
// const app = require("./app");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
// const bcrypt = require("bcrypt");
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB connection is successfull"));

// const port = 3000;
// app.listen(port, () => {
//   console.log("Hello from the server!");
// });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    unique: true,
  },

  professionalSummary: {
    type: String,
  },

  Email: {
    type: String,
  },

  Phn: {
    type: Number,
    required: [true, "User must have a number"],
  },

  Department: {
    type: String,
  },

  YearOfStudy: {
    type: String,
  },

  Cgpi: { type: Number },
  langugesSpoken: { type: String },

  linkedinProfile: { type: String },

  Skills: {
    type: String,
    required: [true, "Skills are required!"],
  },

  Interests: {
    type: String,
  },

  Projects: {
    type: String,
  },
});

// userSchema.methods.correctPassword = async (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

const user = mongoose.model("user", userSchema);

const user1 = new user({
  name: "Aarav Singh",
  professionalSummary:
    "Third-year Computer Science student with a strong foundation in programming languages like Java and Python. Eager to apply technical skills to real-world challenges and seeking internship opportunities in web development. Passionate about technology and problem-solving.",

  Email: "aaravs@gmail.com",

  Phn: +912794268274,

  Department: "Computer Engineering",

  YearOfStudy: "3rd Year",

  CGPI: 9.2,

  langugesSpoken: "English,Hindi",

  linkedinProfile: "_adamCarlsen",

  Skills: "Java, Python, HTML/CSS,Data Analysis",

  Interests: "Web development,Machine Learning ",
  Projects:
    "E-commerce Website Redesign,Sentiment Analysis Model,Personal Portfolio Website",
});

const user2 = new user({
  name: "Rahul Singh",
  professionalSummary:
    "Second-year Computer Engineering student with a keen interest in AI . Actively seeking internship opportunities to gain hands-on experience in the field. Enjoys problem-solving and learning new technologies.",
  Email: "rs@gmail.com",
  Phn: 911234567890,
  Department: "Computer Engineering",
  YearOfStudy: "2nd Year",
  CGPI: 8.7,
  languagesSpoken: "English,Spanish,Hindi",
  linkedinProfile: "rahul_singh",
  Skills: " C,MATLAB,Python,dataAnalysis",
  Interests: "Artificial Intelligence,Machine Learning",
  Projects: "Rainfall Prediction System,Disease Prediction in Medicinal Plants",
});

user3 = new user({
  name: "Alice Smith",
  professionalSummary:
    "Third-year Computer Science student passionate about AI and Machine Learning. Seeking internship opportunities in AI research.",
  Email: "alice.smith@example.com",
  Phn: 912791234567,
  Department: "Computer Science",
  YearOfStudy: "3rd Year",
  CGPI: 9.5,
  languagesSpoken: "English, Hindi",
  linkedinProfile: "_aliceSmith",
  Skills: "Python, TensorFlow, Keras, Data Science, Machine Learning",
  Interests: "AI Research, Deep Learning, Natural Language Processing",
  Projects:
    "Developing a Chatbot using NLP,Sentiment Analysis on Social Media Data,AI-Powered Personal Assistant",
});

const user4 = new user({
  name: "Naina Sharma",
  professionalSummary:
    "Computer Science student specializing in Artificial Intelligence. Actively seeking internships in AI development.",
  Email: "Naina.Sharma123@gmail.com",
  Phn: 912797654321,
  Department: "Computer Engineering",
  YearOfStudy: "4th Year",
  CGPI: 9.0,
  languagesSpoken: "English,Hindi",
  linkedinProfile: "_nainaSharma",
  Skills: "AI Development, Python, TensorFlow, Deep Learning",
  Interests: "Computer Vision, Reinforcement Learning, Neural Networks",
  Projects:
    "Building a Self-Driving Car Simulation,Object Detection System using CNN,AI for Game Character Control",
});

user5 = new user({
  name: "Nirmaan Singh",
  professionalSummary:
    "Third-year Computer Engineering student with a passion for web development and full-stack applications. Actively seeking internships in web development.",
  Email: "Nirmaan.singh7152@gmail.com",
  Phn: 914533765432,
  Department: "Computer Engineering",
  YearOfStudy: "3rd Year",
  CGPI: 9.2,
  langugesSpoken: "English,Hindi,Spanish",
  linkedinProfile: "the_NirmaanSingh",
  Skills: " HTML, CSS, JavaScript, Node.js, React, MongoDB",
  Interests: "Full-Stack Web Development, Web Security",
  Projects: "Online Shopping Platform, Blogging WebsiteE-commerce Dashboard",
});

// user1
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// user2
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// user3
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
  },

  content: {
    type: String,
    required: [true, "Notification Content is required!"],
  },
});

const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema
);
module.exports = { user, NotificationModel };
