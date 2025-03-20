import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address.'],
    unique: true,
    validate: {
      message: "Please enter a valid email.",
      validator: (email) => validator.isEmail(email)
    },
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    validate: [
      {
        message: "Password must be at least 8 characters in length.",
        validator: (password) => password.length >= 8
      },
      {
        message: "Password must contain at least 1 lowercase, uppercase, and symbol",
        validator: (password) => validator.isStrongPassword(password, 
          { minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 }
        )
      }
    ]
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  }],
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  }]
})

userSchema.set('toJSON', {
  transform(doc, json){
    delete json.password
  }
})

// Virtual field for confirmPassword
userSchema
    .virtual('confirmPassword')
    .set(function (confirmPassword) {
        return this._confirmPassword = confirmPassword
    })

userSchema.pre('save', function(next) {  
  if (this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next() 
})

userSchema.methods.isPasswordValid = function(plainTextPassword){
  const isValid = bcrypt.compareSync(plainTextPassword, this.password)
  console.log(`Password is valid: ${isValid}`)
  return isValid
}

const User = mongoose.model('User', userSchema)
export default User