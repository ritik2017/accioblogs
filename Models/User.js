const UserSchema = require('../Schemas/User');
const bcrypt = require('bcrypt');

// Username, Email

let User = class {
    username;
    email;
    password;
    phoneNumber;
    name;
    profilePic;
    constructor({username, email, password, phoneNumber, name, profilePic}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.profilePic = profilePic;
    }

    static async verifyUsernameAndEmailExists({username, email}) {

        try {
        
            const user = await UserSchema.findOne({$or: [{username}, {email}]});

            if(user && user.email === email) {
                return {
                    valid: true,
                    error: "Email already exists"
                }
            }

            if(user && user.username === username) {
                return {
                    valid: true,
                    error: "Username already taken"
                }
            }

            return {
                valid: false
            }
        }
        catch(err) {
            return {
                db_error: true,
                error: err
            }
        }
    }

    registerUser() {
        return new Promise(async (resolve, reject) => {
            const user = new UserSchema({
                username: this.username,
                email: this.email,
                password: this.password,
                name: this.name,
                phoneNumber: this.phoneNumber,
                profilePic: this.profilePic
            })

            try {
                const dbUser = await user.save();
    
                return resolve(dbUser);
            }
            catch(err) {
                return reject(err);
            }
        })
    }
}

module.exports = User;