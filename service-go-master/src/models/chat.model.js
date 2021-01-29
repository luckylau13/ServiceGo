const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const chatSchema = new Schema(
  {
    senderName: {
      type: String
    },
    senderEmail: {
      type: String
    },
    message: {
      type: String
    },
    receiverName: {
      type: String
    },
    receiverEmail: {
      type: String
    }
  },
  { timestamps: true }
);
const Chat = model("chats", chatSchema);
module.exports = Chat;
