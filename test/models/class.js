const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moneo = require('../../index.js');

const BookSchema = new Schema({
  title: {
    type: String,
    neo_prop: true
  },
  author: {
    type: String,
    neo_prop: true
  }
});

const ClassSchema = new Schema({
    title: {
        type: String,
        neo_prop: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Person',
        neo_rel_name: "Taught By"
    },
    supervisor: {
        person: {
            type: mongoose.Schema.ObjectId,
            ref: 'Person',
            //neo_rel_name: "Supervised By"
        },
        start_date: Date
    },
    students: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Person',
        neo_rel_name: 'Has Student'
    }],
    books: [BookSchema]
});

ClassSchema.plugin(moneo.plugin());

const Class = mongoose.model('class', ClassSchema);

module.exports = Class;
