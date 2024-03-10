const crypto = require('crypto'); 
const UserModel = require("../models/user.js");
const bcrypt = require('bcryptjs');
const moment = require('moment');

//time
const currentDateAndTime = moment();
const formattedDateTime = currentDateAndTime.format('YYYY-MM-DD HH:mm:ss');


module.exports = {
    post: async (req, res) => {
        const { username, password, phone} = req.body;
        const email = req.session.vemail;
        console.log(username);
        let user = await UserModel.findOne({ email }); 
        if (user) {
            return res.send("User already exists");
        }
        // Generate unique user ID
        const userId = generateUserId();
        console.log(userId);
        // Setting the default role if not provided
        const userRole = 'default';

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
        console.log(hashedPassword);
        user = new UserModel({
            userid: userId,
            username,
            email,
            password: hashedPassword, // Saving hashed password
            role: userRole,
            phone,
            created: formattedDateTime,
            // status field will remain blank
        });

        // Save the user to the database
        await user.save();
        res.redirect('/login');
    }
}

// Function to generate a unique user ID
function generateUserId() {
    const buffer = crypto.randomBytes(16);
    return buffer.toString('hex');
}
