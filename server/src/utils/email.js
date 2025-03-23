import { Forgot_Password_Email_Template, Verification_Email_Template, Welcome_Email_Template } from "../helper/emailTemplate.js"
import { transporter } from "./emailConfig.js"

export const sendVerificationEmail = async(email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: '"AnoTech Travels" <rawatrishi390@gmail.com>',
            to:email,
            subject: "Verify your Email",
            text: "Verify your Email",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        })
        
    } catch (error) {
        console.log('Email error',error)
    }
}

export const sendWelcomeEmail=async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"AnoTech Travels" <rawatrishi390@gmail.com>',

            to: email, 
            subject: "Welcome Email",
            text: "Welcome Email", 
            html: Welcome_Email_Template.replace("{name}",name)
        })
       
    } catch (error) {
        console.log('Email error',error)
    }
}

export const sendForgotPassword = async (email, name, code) => {
    try {
      const response = await transporter.sendMail({
        from: '"AnoTech Travels" <rawatrishi390@gmail.com>',
        to: email,
        subject: "Password Reset Request", 
        
        html: Forgot_Password_Email_Template
                .replace("{name}", name)
                .replace("{code}", code) 
      });
      
      
    } catch (error) {
      console.log('Email error:', error);
    }
  };
  
