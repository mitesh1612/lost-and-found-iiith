var mongoose = require('mongoose');
var ClaimItemSchema = new mongoose.Schema({
      ItemId: {
      type: String,
      trim: true
    },
    Users: [ ],
  });
  var ClaimItem = mongoose.model('ClaimItem', ClaimItemSchema);
  module.exports =  ClaimItem;
