const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moneo = require('../../index.js');

const ClassSchema = new Schema({
    title: {
        type: String,
        nodeProperty: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Person',
        relName: "Taught By"
    },
    supervisor: {
        person: {
            type: mongoose.Schema.ObjectId,
            ref: 'Person',
            relName: "Supervised By"
        },
        startDate: Date
    },
    students: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Person',
        relName: 'Teaches'
    }]
});

ClassSchema.plugin(moneo.plugin());

const Class = mongoose.model('class', ClassSchema);

module.exports = Class;
