const userDB = require("./users/userModel.js");
const eventDB = require("./events/eventModel.js");

module.exports = {
	checkUserRegister,
	checkUserLogin,
	checkUserId,
	checkEvent,
	checkEventId,
	checkGuest,
	checkFood
};

async function checkUserId(req, res, next) {
	try {
		const user = await userDB.getById(req.params.id);
		if (user) {
			req.user = user;
			next();
		} else {
			res.status(404).json({ message: "User ID Could Not Be Found." });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The user information could not be retrieved."
		});
	}
}

async function checkUserRegister(req, res, next) {
	try {
		const user = req.body.username
			? await userDB.getByUsername(req.body.username)
			: null;
		const { username, password, full_name } = req.body;
		if (Object.keys(req.body).length === 0) {
			res.status(400).json({ message: "Missing User Data." });
		} else if (!username || !password || !full_name) {
			res.status(400).json({
				message:
					"Please ensure information for username, password, and full_name is included."
			});
		} else if (user && req.body.username === user.username) {
			res.status(401).json({
				message: "Username is already in use, please choose another."
			});
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "Something went wrong."
		});
	}
}

function checkUserLogin(req, res, next) {
	if (Object.keys(req.body).length === 0)
		return res.status(400).json({ message: "Missing User Data." });
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({
			message:
				"Please ensure information for username and password is included."
		});
	next();
}

async function checkEventId(req, res, next) {
	try {
		const event = await eventDB.getById(req.params.id);
		if (event) {
			req.event = event;
			next();
		} else {
			res.status(404).json({ message: "Event ID Could Not Be Found." });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The event information could not be retrieved."
		});
	}
}

function checkEvent(req, res, next) {
	if (Object.keys(req.body).length === 0)
		return res.status(400).json({ message: "Missing Event Data." });
	const {
		event_name,
		date,
		time,
		description,
		address,
		city,
		state
	} = req.body;
	if (
		!event_name ||
		!date ||
		!time ||
		!description ||
		!address ||
		!city ||
		!state
	)
		return res.status(400).json({
			message:
				"Please ensure information for event_name, date, time, description, address, city, and state are included."
		});
	next();
}

async function checkGuest(req, res, next) {
	try {
		const user = req.body.user_id
			? await userDB.getById(req.body.user_id)
			: null;
		const { user_id } = req.body;
		const eventGuests = await eventDB.getByIdGuests(req.params.id);
		const guestExist = eventGuests
			.map(guest => guest.user_id)
			.find(userID => (req.body.user_id ? userID === req.body.user_id : null));
		console.log(guestExist);
		if (Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "Missing Guest Data." });
		} else if (!user_id) {
			return res.status(400).json({
				message: "Please ensure information for user_id is included."
			});
		} else if (!user) {
			res.status(404).json({ message: "User ID Could Not Be Found." });
		} else if (guestExist === user_id) {
			res
				.status(401)
				.json({ message: "User has already been invited to event." });
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The user/guest information could not be retrieved."
		});
	}
}

function checkFood(req, res, next) {
	if (Object.keys(req.body).length === 0)
		return res.status(400).json({ message: "Missing Food Data." });
	const { recipe_name } = req.body;
	if (!recipe_name)
		return res.status(400).json({
			message: "Please ensure information for recipe_name is included."
		});
	next();
}
