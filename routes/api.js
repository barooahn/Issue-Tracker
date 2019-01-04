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

const CONNECTION_STRING = process.env.DB; 

  
module.exports = function (app) {
  
  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
    
    })

    .post(function (req, res){
      var project = req.params.project;
        //POST /api/issues/{projectname} with form data containing 
      //required issue_title, issue_text, created_by, and optional assigned_to and status_text.
      // console.log(req.body);
      const {issue_title, issue_text, created_by, assigned_to, status_text } = req.body

      const newIssue =  {
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by, 
        assigned_to: assigned_to || null,
        status_text: status_text || null,
        created_on: Date.now(),
        updated_on: Date.now(),
        open: true
      };
     
      if(!issue_title || !issue_text || !created_by) {res.send('missing inputs')}
      else {

        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
          collection.insertOne(newIssue,function(err,doc){
            newIssue._id = doc.insertedId;
            res.json(newIssue);
          });
        });
      }

    })

    .put(function (req, res){
      var project = req.params.project;
      if(!req.body._id) {res.send('missing inputs')}
      else {

        //console.log(req.body);
        let toUpdate = {};
        let id = req.body._id
        delete toUpdate._id
        let formFields = req.body
        for (let key in formFields) {
           if (formFields[key] != "") {
               toUpdate[key] = formFields[key] 
           }
        }
        console.log(toUpdate)
        
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
          db.collection.find({_id : id}, function(err,doc){
            
            
            res.json();
          });
        });
      }
    })

    .delete(function (req, res){
      var project = req.params.project;

    });

};

