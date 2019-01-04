/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const issueSchema = new Schema({
    project: {type:String,required:true},
    issue_title: {type:String,required:true},
    issue_text: {type:String,required:true},
    created_by: {type:String,required:true},
    assigned_to: {type:String},
    status_text: {type:String},
    created_on: {type:Date},
    updated_on: {type:Date},
    open: {type: Boolean}
}); 

const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  
const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, function(err, db) {
  if(err) {
      console.log('Database error: ' + err);
  } else {
      console.log('Successful database connection');

  }

  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      //POST /api/issues/{projectname} with form data containing 
      //required issue_title, issue_text, created_by, and optional assigned_to and status_text.
      console.log(req.body);
      const {issue_title, issue_text, created_by, assigned_to, status_text } = req.body
      const newIssue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by, 
        assigned_to: assigned_to || null,
        status_text: status_text || null
      });

      console.log(newIssue);
      // newIssue.save(function(err, data) {
      //     console.log(data);
      // });

    })

    .post(function (req, res){
      var project = req.params.project;

    })

    .put(function (req, res){
      var project = req.params.project;

    })

    .delete(function (req, res){
      var project = req.params.project;

    });

});  

};