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
  //I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the 
  //information for each issue as was returned when posted.
  //I can filter my get request by also passing along any field and value in the query
  //(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      
      //collection.find({}, {skip:1, limit:1, fields:{b:1}}).toArray(function(err, docs) {
    
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
        assigned_to: assigned_to || '',
        status_text: status_text || '',
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
        db.close();
        });
      }

    })

    .put(function (req, res){
      var project = req.params.project;
      //test for id and valid id type 24hex chars
      if(!req.body._id) {res.send('missing inputs')}
      else if(!ObjectId.isValid(req.body._id)){res.send('invalid id')}
      else {
        let toUpdate = {};
        let count = 0;
        let id = req.body._id
        let formFields = req.body
        for (let key in formFields) {
           if (formFields[key] != "") {
            if(key == "open" && formFields[key] == 'false'){ 
               toUpdate[key] = false;
             }else {
               toUpdate[key] = formFields[key]
             }
            count++
           }
        }
        delete toUpdate._id
        if(count > 1) {
          console.log(toUpdate);          
          toUpdate.updated_on = Date.now();
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
            const collection = db.collection(project);
            collection.findAndModify(
              {_id:new ObjectId(id)},
              [['_id',1]],
              {$set: toUpdate},
              {new: true},
              function(err,doc){
                (!err) ? res.send('successfully updated') : res.send('could not update '+ id +' '+ err);
              }  
            );
          });
        } else {
          console.log('no updated field sent');
          res.send('no updated field sent'); 
        }
      }
    })
  
    // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.

    .delete(function (req, res){
      var project = req.params.project;
      console.log(req.body._id);
      console.log('here');
      if(!req.body._id) {res.send('_id error')}
      else if(!ObjectId.isValid(req.body._id)){res.send('invalid id')}
      else {
        console.log('valid_id'); 
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
          collection.findAndRemove(
            {_id:new ObjectId(req.body._id)},
            [['_id',1]],
            function(err,doc){
              (!err) ? res.send('deleted ' + req.body._id) : res.send('could not delete ' + req.body._id + err);
            }  
          );
        });
      }
    });
};

