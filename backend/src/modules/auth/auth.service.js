const bcrypt = require('bcryptjs');
const fileUploaderSvc = require('../../services/fileuploader.service');
const { randomStringGenerator } = require('../../utilities/helper');
const emailSvc = require('../../services/mail.service');
const UserModel = require('../user.model');
class AuthService {

    transformUserRegister = async (req) => {
        try {
            let data = req.body;

            const salt = bcrypt.genSaltSync(10)
            data.password = bcrypt.hashSync(data.password, salt)
            delete data.confirmPassword

            let file = req.file
            if (file) {
                data.image = await fileUploaderSvc.uploadFile(file.path, '/users')
            }
            data.otp = randomStringGenerator(6, false)
            data.otpExpiryTime = new Date(Date.now() + 300000)
            data.status = 'inactive'

            return data


        } catch (exception) {
            console.log("Transform User Register exception : ", exception);
            throw exception
        }
    }

    createUser = async (data) => {
        try {
            const userObj = new UserModel(data)
            return await userObj.save()
        } catch (exception) {
            console.log("Create User exception : ", exception);
            throw exception
        }
    }
    sendActivationNotification = async (name, otp, email) => {
        try {
            let msg = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Activation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                    }
                    .content {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.6;
                    }
                    .otp {
                        font-size: 20px;
                        font-weight: bold;
                        color: grey;
                        text-align: center;
                        padding: 10px;
                        background: #f8f8f8;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        font-size: 12px;
                        text-align: center;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Account Activation</div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you for registering with us. Please activate your account by using the following OTP code:</p>
                        <div class="otp">${otp}</div>
                        <p>Warm regards,</p>
                        <p>${process.env.SMTP_FROM}</p>
                    </div>
                    <div class="footer">
                        <em>Please do not reply to this email directly.</em>
                    </div>
                </div>
            </body>
            </html>
            `

            await emailSvc.sendEmail({
                to: email,
                subject: 'Account Activation',
                message: msg
            })

        } catch (exception) {
            console.log("Send Activation Notification exception : ", exception);
            throw exception
        }
    }
    sendRestNotificationEmail = async (name, otp, email) => {
        try {
            let msg = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Recovery</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                    }
                    .content {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.6;
                    }
                    .otp {
                        font-size: 20px;
                        font-weight: bold;
                        color: grey;
                        text-align: center;
                        padding: 10px;
                        background: #f8f8f8;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        font-size: 12px;
                        text-align: center;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Account Activation</div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you for reaching out. Please reset your password by using the following OTP code:</p>
                        <div class="otp">${otp}</div>
                        <p>Warm regards,</p>
                        <p>${process.env.SMTP_FROM}</p>
                    </div>
                    <div class="footer">
                        <em>Please do not reply to this email directly.</em>
                    </div>
                </div>
            </body>
            </html>
            `

            await emailSvc.sendEmail({
                to: email,
                subject: 'Account Activation',
                message: msg
            })

        } catch (exception) {
            console.log("Send Activation Notification exception : ", exception);
            throw exception
        }
    }
    activateUser = async (user) => {
        try {
            user.otp = null
            user.otpExpiryTime = null
            user.status = 'active'

            return await user.save()

        } catch (exception) {
            console.log("Activate User exception : ", exception);
            throw exception
        }
    }

    getSingleUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter)
            if (!user) {
                throw {
                    code: 422,
                    message: 'User not found',
                    status: "USER_NOT_FOUND",
                    detail: ""
                }
            }
            return user

        } catch (exception) {
            console.log("Get Single User By Filter exception : ", exception);
            throw exception
        }
    }
    getAllUsers = async (filter) => {
        try {
            const userList = await UserModel.find(filter, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                __v: 0,
                createdAt: 0,
                updatedAt: 0

            }).sort({
                createdAt: "desc"
            })
            return userList

        } catch (exception) {
            console.log("Get All Users exception : ", exception);
            throw exception
        }
    }
    getAllUsersByFilter = async (filter) => {
        try {
            const response = await UserModel.find(filter)
            return response
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    resetOtp = async (user) => {
        try {
            let otp = randomStringGenerator(6, false)
            let expiryTime = new Date(Date.now() + 300000)

            user.otp = otp
            user.otpExpiryTime = expiryTime
            return await user.save()

        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    transformUpdateRequest = async (req) => {
        try {
            let data = req.body;
            let file = req.file;  //single upload
            console.log("File Check", file)
            if (file) {
                data.image = await fileUploaderSvc.uploadFile(file.path, '/users')
            }
            return data
        } catch (exception) {
            console.log("Transform User Register exception : ", exception);
            throw exception
        }
    }
    updateByFilter = async (filter, updateData) => {
        try {
            const response = await UserModel.findOneAndUpdate(filter, { $set: updateData })
            return response

        } catch (exception) {
            console.log("updateByFilter service exception : ", exception)
            throw exception
        }
    }

    forgotPassword = async (user, data) => {
        try {
            data.resetOtp = randomStringGenerator(6, false)
            data.resetOtpExpiryTime = new Date(Date.now() + 300000)

            await this.sendRestNotificationEmail(user.name, data.resetOtp, data.email)

            await this.updateByFilter({ _id: user._id }, data)

        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    resetPassword = async (user, data) => {
        try {

            const salt = bcrypt.genSaltSync(10)
            data.password = bcrypt.hashSync(data.password, salt)
            delete data.confirmPassword

            const response = await this.updateByFilter({ _id: user._id }, data)
            return response

        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

}
const authSvc = new AuthService()
module.exports = authSvc