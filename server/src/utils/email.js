import { Forgot_Password_Email_Template, Verification_Email_Template, Welcome_Email_Template } from "../helper/emailTemplate.js"
import { transporter } from "./emailConfig.js"

export const sendVerificationEmail = async(email, verificationCode) => {
    try {
        console.log(`Attempting to send verification email to: ${email}`);
        const response = await transporter.sendMail({
            from: '"RishiTech04" <rawatrishi390@gmail.com>',
            to: email,
            subject: "Verify your Email",
            text: "Verify your Email",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        });
        
        console.log(`Verification email sent to ${email}, messageId: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error('Email error sending verification email:', error);
        return { success: false, error: error.message };
    }
}

export const sendWelcomeEmail = async(email, name) => {
    try {
        console.log(`Attempting to send welcome email to: ${email}`);
        const response = await transporter.sendMail({
            from: '"RishiTech04" <rawatrishi390@gmail.com>',
            to: email, 
            subject: "Welcome to RishiTech04",
            text: "Welcome to RishiTech04", 
            html: Welcome_Email_Template.replace("{name}", name)
        });
       
        console.log(`Welcome email sent to ${email}, messageId: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error('Email error sending welcome email:', error);
        return { success: false, error: error.message };
    }
}

export const sendForgotPassword = async (email, name, code) => {
    try {
        console.log(`Attempting to send password reset email to: ${email}`);
        const response = await transporter.sendMail({
            from: '"RishiTech04" <rawatrishi390@gmail.com>',
            to: email,
            subject: "Password Reset Request", 
            html: Forgot_Password_Email_Template
                    .replace("{name}", name)
                    .replace("{code}", code) 
        });
      
        console.log(`Password reset email sent to ${email}, messageId: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error('Email error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};
  
