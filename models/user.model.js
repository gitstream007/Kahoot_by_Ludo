let mongoose    = require('mongoose');
let bcrypt      = require('bcrypt');
let bcrypt_p    = require('bcrypt-promise');
let jwt         = require('jsonwebtoken');
let validate    = require('mongoose-validator');
let {TE, to}    = require('../services/utilService');
let CONFIG      = require('../config/config');


// Define a schema
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        required: true,
        validate: [validate({
            validator: 'isEmail',
            message: 'Not a valid email.',
        }),]
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    is_admin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function(next) {

    if (this.isModified('password') || this.isNew) {

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if(err) TE(err.message, true);

        this.password = hash;
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = async function(pw) {
    let err, pass;
    if (!this.password) TE('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('invalid password');

    return this;
};

UserSchema.methods.getJWT = function() {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer " + jwt.sign({user_id:this._id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
};

UserSchema.methods.toWeb = function() {
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    return json;
};

let User = module.exports = mongoose.model('User', UserSchema);