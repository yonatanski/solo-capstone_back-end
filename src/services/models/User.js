import mongoose from "mongoose"
import bcrypt from "bcrypt"
const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    username: { type: String, required: true, uniqe: true },
    email: { type: String, required: true, uniqe: true },
    password: { type: String, required: true, uniqe: true },
    isAdmin: { type: Boolean, default: false },
    img: { type: String, default: "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif" },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {
  // BEFORE saving the user in db, hash the password
  // I am NOT using arrow function here because of "this"
  const newAuthor = this // "this" represents the current user I'm trying to save in db
  const plainPw = newAuthor.password

  if (newAuthor.isModified("password")) {
    // only if the user is modifying the password field I am going to use some CPU cycles to hash that, otherwise they are just wasted
    const hash = await bcrypt.hash(plainPw, 11)
    newAuthor.password = hash
  }

  next()
})

UserSchema.methods.toJSON = function () {
  // this toJSON function will be called EVERY TIME express does a res.send(user/s)

  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
  // Given email and pw this method should check in db if email exists and then compare plainPW with the hash that belongs to that user and then return a proper response

  // 1. Find the user by email
  const user = await this.findOne({ email }) // "this" here refers to UserModel

  if (user) {
    // 2. If the user is found --> compare plainPW with the hashed one

    const isMatch = await bcrypt.compare(plainPW, user.password)

    if (isMatch) {
      // 3. If they do match --> return a proper response (user himself)
      return user
    } else {
      // 4. If they don't --> return null
      return null
    }
  } else {
    // 5. If the email is not found --> return null as well
    return null
  }
}

export default model("User", UserSchema)
