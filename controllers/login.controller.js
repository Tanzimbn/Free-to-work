const userModel = require("../models/users")
const nodemailer = require("nodemailer");

const email = process.env.EMAIL;
const password = process.env.PASSWORD;



exports.verify_login = async (req, res) => {
    try {
        const {email, password } = req.body;

        if(email == "admin@free2work.com" && password == "12") {
            res.json({message:"admin"});
        }
        else {
            const ans = await userModel.find({email : email, password: password});
            if(ans == "") res.json({message:"Email or Password is incorrect"});
            else {
                req.session.user_id = ans[0]._id
                res.json({message:"correct", userdata : ans[0]});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.change_password = async (req, res) => {
    let response = await userModel.find({email : req.body.email})
    if(response.length == 0) {
        res.send({"message" : "Invalid Email!", "state":"0"})
    }
    else {
        const result = Math.random().toString(36).substring(2,10);
        const ans = await userModel.updateOne({email : req.body.email}, { $set: { password : result}});


        let config = {
            service : 'gmail',
            auth : {
                user : email,
                pass : password
            }
        }
    
        let transporter = nodemailer.createTransport(config)
    
        let message = {
            from: email,
            to: req.body.email,
            subject: "Password reset",
            html: `<!DOCTYPE html>
            <html>
            
            <head>
            
              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Email Confirmation</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
                /**
                           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                           */
                @media screen {
                  @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                  }
            
                  @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                  }
                }
            
                /**
                           * Avoid browser level font resizing.
                           * 1. Windows Mobile
                           * 2. iOS / OSX
                           */
                body,
                table,
                td,
                a {
                  -ms-text-size-adjust: 100%;
                  /* 1 */
                  -webkit-text-size-adjust: 100%;
                  /* 2 */
                }
            
                /**
                           * Remove extra space added to tables and cells in Outlook.
                           */
                table,
                td {
                  mso-table-rspace: 0pt;
                  mso-table-lspace: 0pt;
                }
            
                /**
                           * Better fluid images in Internet Explorer.
                           */
                img {
                  -ms-interpolation-mode: bicubic;
                }
            
                /**
                           * Remove blue links for iOS devices.
                           */
                a[x-apple-data-detectors] {
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  color: inherit !important;
                  text-decoration: none !important;
                }
            
                /**
                           * Fix centering issues in Android 4.4.
                           */
                div[style*="margin: 16px 0;"] {
                  margin: 0 !important;
                }
            
                body {
                  width: 100% !important;
                  height: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
            
                /**
                           * Collapse table borders to avoid space between cells.
                           */
                table {
                  border-collapse: collapse !important;
                }
            
                a {
                  color: #1a82e2;
                }
            
                img {
                  height: auto;
                  line-height: 100%;
                  text-decoration: none;
                  border: 0;
                  outline: none;
                }
              </style>
            
            </head>
            
            <body style="background-color: #000000;">
            
            
              <!-- start body -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
                <!-- start logo -->
                <tr>
                  <td align="center" bgcolor="#000000">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                          <a href="http://localhost:3000/" target="_blank" style="display: inline-block;">
                            <!-- <h2>FreeToWork</h2> -->
                            <img src='https://i.postimg.cc/CRMhY4xB/Screenshot-2023-07-22-194839.png' border='0'
                              alt='Screenshot-2023-07-22-194839' />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
            
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"
                      style="color: white;background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); max-width: 600px;">
                      <tr>
                        <td align="left"
                          style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Forget password</h1>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                                </td>
                                </tr>
                                </table>
                                <![endif]-->
                  </td>
                </tr>
                <!-- end hero -->
            
                <!-- start copy block -->
                <tr>
                  <td align="center" bgcolor="#000000">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"
                      style="background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); max-width: 600px;">
            
                      <!-- start copy -->
                      <tr>
                        <td align="left"
                          style="background: inherit; color: #ffffff; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Your password have been changed. New password is given below :</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start button -->
                      <tr>
                        <td align="left">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" style="background: inherit; padding: 12px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                      <a target="_blank"
                                        style="display: inline-block; padding: 16px 36px; font-family: 'Poppins', sans-serif; font-size: 20px; color: #ffffff; text-decoration: none; border-radius: 6px;">${result}</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- end button -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left"
                          style="color: white; background: inherit; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Use this new password for login and go to profile. Click the edit profile button and change your password.</p>
                          
                          </p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left"
                          style="color: white; background: linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%); padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; ">
                          <p style="margin: 0;">Cheers,<br> FreeToWork</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                    </table>
                  </td>
                </tr>
                <!-- end copy block -->
            
                <!-- start footer -->
                <tr>
                  <td align="center" bgcolor="#000000" style="padding: 24px;">
                    <!--[if (gte mso 9)|(IE)]>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                                <tr>
                                <td align="center" valign="top" width="600">
                                <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start permission -->
                      <tr>
                        <td align="center" bgcolor="#000000"
                          style="color: rgb(171, 171, 171); padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; ">
                          <p style="margin: 0;">You received this email because we received a request of forget password from this email.</p>
                        </td>
                      </tr>
                      <!-- end permission -->
            
                      <!-- start unsubscribe -->
                      <tr>
                        <td align="center" bgcolor="#000000"
                          style="color: rgb(171, 171, 171); padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; ">
                          <!-- <p style="margin: 0;">To stop receiving these emails, you can <a href="/login" target="_blank">unsubscribe</a> at any time.</p> -->
                          <p style="margin: 0;">@FreeToWork, Pahartali, CUET</p>
                        </td>
                      </tr>
                      <!-- end unsubscribe -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                                </td>
                                </tr>
                                </table>
                                <![endif]-->
                  </td>
                </tr>
                <!-- end footer -->
            
              </table>
              <!-- end body -->
            
            </body>
            
            </html>`
        }
    
        transporter.sendMail(message).then(() => {
          res.send({"message" : "Check your Email", "state":"1"});
        }).catch(error => {
            return res.status(500).json({error})
        })
        
    }
    



}
