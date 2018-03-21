const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moneo = require('../../index.js');

const PersonSchema = new Schema({
    firstName: {
        type: String,
        nodeProperty: true
    },
    lastName: {
        type: String,
        nodeProperty: true
    },
    mongoSpecificValue1: {
        type: String,
        nodeProperty: false
    },
    mongoSpecificValue2: String,
    takenClasses: [{
        class: {
            type: mongoose.Schema.ObjectId,
            ref: 'Class',
            relName:'Takes Class'
        },
        grade: Number,
        year: Number
    }]
});

PersonSchema.plugin(moneo.plugin());

const Person = mongoose.model('person', PersonSchema);

module.exports = Person;
