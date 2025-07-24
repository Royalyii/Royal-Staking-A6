const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  uid: { type: Number, unique: true },
  isAdmin: { type: Boolean, default: false },
  wallets: {
    invest: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    staking: { type: Number, default: 0 }
  }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isNew) return next();
  const User = mongoose.model("User", userSchema);
  const lastUser = await User.findOne().sort({ uid: -1 });
  this.uid = lastUser ? lastUser.uid + 1 : 100001;
  next();
});

module.exports = mongoose.model("User", userSchema);