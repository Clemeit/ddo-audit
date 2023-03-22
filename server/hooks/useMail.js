import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

const useMail = () => {
	dotenv.config();

	let transporter = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	var mailOptions = {
		from: process.env.EMAIL_USER,
		to: `${process.env.EMAIL_PHONE}, ${process.env.EMAIL_USER}`,
		subject: "DDO Audit - Monitor",
		text: "No additional information",
	};

	const sendMessage = (message) => {
		const newMessage = {
			...mailOptions,
			text: `${new Date().toUTCString()}\n${message}`,
		};
		transporter.sendMail(newMessage, function (error) {
			if (error) {
				console.log("Failed to send alert email");
			} else {
				console.log("Alert email sent");
			}
		});
	};

	return {
		sendMessage,
	};
};

export default useMail;
