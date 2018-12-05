const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moneo = require('../../index.js');

const AddressSchema = new Schema({
  city: {
    type: String,
    neo_prop: true
  },
  street: {
    type: String,
    neo_prop: true
  },
  number: Number,
  country: String
});

const PersonSchema = new Schema({
  firstName: {
    type: String,
    neo_prop: true
  },
  lastName: {
    type: String,
    neo_prop: true
  },
  mongoSpecificValue1: {
    type: String,
    neo_prop: false
  },
  mongoSpecificValue2: String,
  takenClasses: [{
    class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
      neo_rel_name: 'Takes Class'
    },
    grade: Number,
    year: Number
  }],
  address: AddressSchema
});

PersonSchema.plugin(moneo.plugin());

const Person = mongoose.model('person', PersonSchema);

module.exports = Person;
