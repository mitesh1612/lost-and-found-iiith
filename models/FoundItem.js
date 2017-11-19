var mongoose = require('mongoose');
var FoundItemSchema = new mongoose.Schema({
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
    FoundDate: {
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
  FoundItemSchema.index({Itemname: 'text'});
  var FoundItem = mongoose.model('FoundItem', FoundItemSchema);
  module.exports =  FoundItem;
