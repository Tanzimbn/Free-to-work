const blockModel = require("../models/block");
const userModel = require("../models/users");
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");
const verifyModel = require("../models/verify");

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// exports.reg_submit = async (req, res) => {
//     try {
//         const new_user = new verifyModel({
//             fname: req.body.fname,
//             lname: req.body.lname,
//             nid: req.body.nid,
//             gender: req.body.gender,
//             email : req.body.email,
//             password : req.body.password,
//             phone: req.body.phone,
//             division: req.body.division,
//             district: req.body.district,
//             station: req.body.station
//         })
//         const register = await new_user.save();

//         let verify_email = `http://localhost:3000/verify/${register._id}`;
        
//         let config = {
//             service : 'gmail',
//             auth : {
//                 user : email,
//                 pass : password
//             }
//         }
    
//         let transporter = nodemailer.createTransport(config)
    
//         let message = {
//             from: email,
//             to: req.body.email,
//             subject: "Verify Email",
//             html: `<!DOCTYPE html>
//             <html>
            
//             <head>
            
//               <meta charset="utf-8">
//               <meta http-equiv="x-ua-compatible" content="ie=edge">
//               <title>Email Confirmation</title>
//               <meta name="viewport" content="width=device-width, initial-scale=1">
//               <style type="text/css">
//                 /**
//                            * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//                            */
//                 @media screen {
//                   @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 400;
//                     src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//                   }
            
//                   @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 700;
//                     src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//                   }
//                 }
            
//                 /**
//                            * Avoid browser level font resizing.
//                            * 1. Windows Mobile
//                            * 2. iOS / OSX
//                            */
//                 body,
//                 table,
//                 td,
//                 a {
//                   -ms-text-size-adjust: 100%;
//                   /* 1 */
//                   -webkit-text-size-adjust: 100%;
//                   /* 2 */
//                 }
            
//                 /**
//                            * Remove extra space added to tables and cells in Outlook.
//                            */
//                 table,
//                 td {
//                   mso-table-rspace: 0pt;
//                   mso-table-lspace: 0pt;
//                 }
            
//                 /**
//                            * Better fluid images in Internet Explorer.
//                            */
//                 img {
//                   -ms-interpolation-mode: bicubic;
//                 }
            
//                 /**
//                            * Remove blue links for iOS devices.
//                            */
//                 a[x-apple-data-detectors] {
//                   font-family: inherit !important;
//                   font-size: inherit !important;
//                   font-weight: inherit !important;
//                   line-height: inherit !important;
//                   color: inherit !important;
//                   text-decoration: none !important;
//                 }
            
//                 /**
//                            * Fix centering issues in Android 4.4.
//                            */
//                 div[style*="margin: 16px 0;"] {
//                   margin: 0 !important;
//                 }
            
//                 body {
//                   width: 100% !important;
//                   height: 100% !important;
//                   padding: 0 !important;
//                   margin: 0 !important;
//                 }
            
//                 /**
//                            * Collapse table borders to avoid space between cells.
//                            */
//                 table {
//                   border-collapse: collapse !important;
//                 }
            
//                 a {
//                   color: #1a82e2;
//                 }
            
//                 img {
//                   height: auto;
//                   line-height: 100%;
//                   text-decoration: none;
//                   border: 0;
//                   outline: none;
//                 }
//               </style>
            
//             </head>
            
//             <body style="background-color: #000000;">
            
            
//               <!-- start body -->
//               <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
//                 <!-- start logo -->
//                 <tr>
//                   <td align="center" bgcolor="#000000">
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                       <tr>
//                         <td align="center" valign="top" style="padding: 36px 24px;">
//                           <a href="http://localhost:3000/" target="_blank" style="display: inline-block;">
//                             <!-- <h2>FreeToWork</h2> -->
//                             <img src='https://i.postimg.cc/CRMhY4xB/Screenshot-2023-07-22-194839.png' border='0'
//                               alt='Screenshot-2023-07-22-194839' />
//                           </a>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
            
//                 <tr>
//                   <td align="center">
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%"
//                       style="color: white;background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); max-width: 600px;">
//                       <tr>
//                         <td align="left"
//                           style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
//                           <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm
//                             Your Email Address</h1>
//                         </td>
//                       </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//                                 </td>
//                                 </tr>
//                                 </table>
//                                 <![endif]-->
//                   </td>
//                 </tr>
//                 <!-- end hero -->
            
//                 <!-- start copy block -->
//                 <tr>
//                   <td align="center" bgcolor="#000000">
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%"
//                       style="background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); max-width: 600px;">
            
//                       <!-- start copy -->
//                       <tr>
//                         <td align="left"
//                           style="background: inherit; color: #ffffff; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                           <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account,
//                             you can safely delete this email.</p>
//                         </td>
//                       </tr>
//                       <!-- end copy -->
            
//                       <!-- start button -->
//                       <tr>
//                         <td align="left">
//                           <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                             <tr>
//                               <td align="center" style="background: inherit; padding: 12px;">
//                                 <table border="0" cellpadding="0" cellspacing="0">
//                                   <tr>
//                                     <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
//                                       <a href= ${verify_email} target="_blank"
//                                         style="display: inline-block; padding: 16px 36px; font-family: 'Poppins', sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Do
//                                         Something Sweet</a>
//                                     </td>
//                                   </tr>
//                                 </table>
//                               </td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>
//                       <!-- end button -->
            
//                       <!-- start copy -->
//                       <tr>
//                         <td align="left"
//                           style="color: white; background: inherit; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                           <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
//                           <p style="margin: 0;"><a href= ${verify_email} target="_blank">${verify_email}</a>
//                           </p>
//                         </td>
//                       </tr>
//                       <!-- end copy -->
            
//                       <!-- start copy -->
//                       <tr>
//                         <td align="left"
//                           style="color: white; background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; ">
//                           <p style="margin: 0;">Cheers,<br> FreeToWork</p>
//                         </td>
//                       </tr>
//                       <!-- end copy -->
            
//                     </table>
//                   </td>
//                 </tr>
//                 <!-- end copy block -->
            
//                 <!-- start footer -->
//                 <tr>
//                   <td align="center" bgcolor="#000000" style="padding: 24px;">
//                     <!--[if (gte mso 9)|(IE)]>
//                                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//                                 <tr>
//                                 <td align="center" valign="top" width="600">
//                                 <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
//                       <!-- start permission -->
//                       <tr>
//                         <td align="center" bgcolor="#000000"
//                           style="color: rgb(171, 171, 171); padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; ">
//                           <p style="margin: 0;">You received this email because we received a request for registration using this
//                             email. If you didn't request, you can safely delete this email.</p>
//                         </td>
//                       </tr>
//                       <!-- end permission -->
            
//                       <!-- start unsubscribe -->
//                       <tr>
//                         <td align="center" bgcolor="#000000"
//                           style="color: rgb(171, 171, 171); padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; ">
//                           <!-- <p style="margin: 0;">To stop receiving these emails, you can <a href="/login" target="_blank">unsubscribe</a> at any time.</p> -->
//                           <p style="margin: 0;">@FreeToWork, Pahartali, CUET</p>
//                         </td>
//                       </tr>
//                       <!-- end unsubscribe -->
            
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//                                 </td>
//                                 </tr>
//                                 </table>
//                                 <![endif]-->
//                   </td>
//                 </tr>
//                 <!-- end footer -->
            
//               </table>
//               <!-- end body -->
            
//             </body>
            
//             </html>`
//         }
    
//         transporter.sendMail(message).then(() => {
//             res.send({"message" : "Successfull"});
//         }).catch(error => {
//             return res.status(500).json({error})
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(400).send(error);
//     }
// }

exports.reg_submit = async (req, res) => {
  try {
      const new_user = new userModel({
          fname: req.body.fname,
          lname: req.body.lname,
          nid: req.body.nid,
          gender: req.body.gender,
          email : req.body.email,
          password : req.body.password,
          phone: req.body.phone,
          division: req.body.division,
          district: req.body.district,
          station: req.body.station
      })
      const register = await new_user.save();
      res.send({"message" : "Successfull"});
  } catch (error) {
      console.error(error);
      res.status(400).send(error);
  }
}

exports.form1_submit = async (req, res) => {
    try {
        const {fname, nid} = req.body;
        const ans = await userModel.find({nid : nid});
        const block = await blockModel.find({nid: nid})

        if(fname.length == 0) res.json({"message" : "Enter first name"})
        else if(ans == "" && block == "" && nid.length == 10) res.json({"message" : "Valid"});
        else if(block != "") res.json({"message" : "Given Nid is blocked"});
        else res.json({"message" : "Invalid nid"});

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.form2_submit = async (req, res) => {
    try {
        const {email, Station, phone} = req.body;
        if(phone.length != 11) {
            res.json({"message" : "Invalid phone number"});
        }
        else if(emailValidator.validate(email)) {
            if(Station == "") {
                res.json({"message" : "Select police station"});
            }
            else {
                const ans = await userModel.find({email : email});
                if(ans == "") res.json({"message" : "Valid"});
                else res.json({"message" : "Invalid email"});
            }
        }
        else {
            res.json({"message" : "Invalid email"});
        }

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.email_confirmed = async (req, res) => {
    try {
        const user = await verifyModel.find({_id : req.params.id})
        
        if(user.length) {
            const new_user = new userModel({
                fname: user[0].fname,
                lname: user[0].lname,
                nid: user[0].nid,
                gender: user[0].gender,
                email : user[0].email,
                password : user[0].password,
                phone: user[0].phone,
                division: user[0].division,
                district: user[0].district,
                station: user[0].station
            })
            const register = await new_user.save();
            const del = await verifyModel.deleteOne({_id : req.params.id})
        }

        res.redirect("/login");
        
    } catch (error) {
        
    }
}