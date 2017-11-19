var mongoose = require('mongoose');
var ClaimFoundItemSchema = new mongoose.Schema({
      ItemId: {
      type: String,
      trim: true
    },
    Users: [ ],
  });
  var ClaimFoundItem = mongoose.model('ClaimFoundItem', ClaimFoundItemSchema);
  module.exports =  ClaimFoundItem;
