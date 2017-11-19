var mongoose = require('mongoose');
var multer = require('multer');
var LostItemSchema = new mongoose.Schema({
      Itemname: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    ItemDescription: {
      type: String,
      required: true,
      trim: true
    },
    MissingDate: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type: String,
      required: true
    },
    imgPath: {
      type: String,
      required: true,
      trim: true
    }
  });
  LostItemSchema.index({Itemname: 'text'});
  var LostItem = mongoose.model('LostItem', LostItemSchema);
  module.exports =  LostItem;
