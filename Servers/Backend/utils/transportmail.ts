import nodemailer from "nodemailer"
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a924b98af4e91f",
      pass: "ad903a7277fb14"
    }
  });
export default transport