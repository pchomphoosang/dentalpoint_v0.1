var _ = require('lodash');
var async = require('async');
var Provider = require('../models/Provider');
var keys = ['id','firstName','lastName','phoneNumber'];


// create new provider
exports.insertprovider = function(req, res, next) { 

  console.log('postget receive: '+JSON.stringify(req.body));
  console.log('postget params: '+JSON.stringify(req.query.owner));

  async.waterfall([function(done){
    Provider.count({owner : req.query.owner },function( err, count){
      done(err,count);
    })
  },function(count){
    var count = count + 1;
    var loc= [];
    loc[0] = req.body.longitude || 0;
    loc[1] = req.body.latitude || 0;
    
    var provider = new Provider({
      id: count,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      specialist: req.body.specialist,
      procedures: req.body.procedures,
      address1: req.body.address1,
      address2: req.body.address1,
      location: req.body.location,
      maploc: loc,
      pic: req.body.pic,
      owner: req.query.owner,
    });

    provider.save(function(err,provider) {
      var response ={};
      if (err) return next(err);
      response.entity = _.pick(provider,keys);
      response.entity.updatedAt = provider.updatedAt.toString();
      return res.json(response);
    });


  }]);
};

// get service of a user

exports.getservice = function(req, res, next) {

  console.log("req.query: "+JSON.stringify(req.query.owner));
  Provider.find({owner: req.query.owner},function(err, providers) {
    if (err) return next(err);
    if (providers) {
      return res.json(providers);
    }
      return res.json(providers);
    
  });
};

// delete service of a user
// Todo  error when not found in the collection  the err still show err
exports.deleteservice = function(req, res, next) {

  console.log("req.query: "+JSON.stringify(req.query.owner));
  console.log("req.body: "+JSON.stringify(req.body));
  console.log("req.params: "+JSON.stringify(req.query.record));

  Provider.remove({id: req.query.record, owner: req.query.owner },function(err) {
    var response ={};
    console.log("err:"+err);
    if (!err){
      response.success = { msg: 'update Success!' };
      return res.json(response);
    }else{
      response.errors = {msg : "Not found the query service"}
      return res.status(422).send(response);
    }                 
  });
};

exports.searchprovider = function(req, res, next){

  // validation
  req.checkQuery('offset', 'Invalid offset').isInt();
  req.checkQuery('count', 'Invalid count').isInt();
  req.checkQuery('specialist', 'Invalid specialist').notEmpty().isAlpha;
  req.checkQuery('location', 'Invalid location').notEmpty().isAlpha;
  var errors = req.validationErrors();

  var field  = {};
  var response = {};

  if (errors) {
     response.errors = {msg : errors}
     return res.status(422).send(response);
  }

  var offset = parseInt(req.query.offset);
  var count  = parseInt(req.query.count);

  var query  = {specialist: req.query.specialist, location:req.query.location };

  if (query.specialist.indexOf("All") > -1 ) {
      query  = {location:req.query.location };
  }

  async.waterfall([function(done){
    Provider.count(query,function( err, count){
      done(err,count);
    })
  },function(count){

    Provider.find(query,field ,{ skip: offset,limit: count }, function(err, results) {

      if (results) {
        var result = [];
        _.each(results, function(provider){
             var prov = _.pick(provider,['firstName','lastName','phoneNumber','pic','location','specialist','maploc']);
             prov.id  = provider._id
             result.push(prov);
        })
      }
      response.resultCount = count;
      response.result = result;
      return res.json(response);
    });

  }]);
  
}

//  Todo need to modify  search keyword
exports.getprovider = function(req, res, next){

  // validation
  req.checkParams('providerId', 'provider does not exist').notEmpty();
  var errors = req.validationErrors();

  var response = {};
  if (errors) {
      console.log('pawat chomphoosang:'+ errors);
     response.errors = {msg : errors}
     return res.status(422).send(response);
  }


  Provider.findOne({ _id: req.params.providerId}, function(err, provider) {

      if (err) return next(err);

      if (!provider) {
        response.errors = {msg : "provider does not exist"}
        return res.status(422).send(response);

      }else {
        response = provider;
        return res.json(response);
      }

  });

}
// create new provider
exports.postprovider = function(req, res, next) {	

  console.log('postget receive: '+JSON.stringify(req.body));

  async.waterfall([function(done){
    Provider.count(function( err, count){
      done(err,count);
    })
  },function(count){
    var count = count + 1;

    var provider = new Provider({
      id: count,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber
    });

    Provider.findOne({ phoneNumber: req.body.phoneNumber}, function(err, existingUser) {
      var response ={};
      if (existingUser) {
        response.errors = {phoneNumber : "phone # is already exited"}
        return res.status(422).send(response);

      }else {
        provider.save(function(err,provider) {

          if (err) return next(err);
          response.entity = _.pick(provider,keys);
          response.entity.updatedAt = provider.updatedAt.toString();
          return res.json(response);
        });
      }

    });

  }]);
};

// update provider
exports.modifyproviderid = function(req, res, next) {

	console.log('get receive: '+JSON.stringify(req.body));

  async.waterfall([function(done){
      var response = {};
      Provider.findOne({phoneNumber: req.body.phoneNumber},function(err,provider) {

        if ( (provider== undefined) || (provider.id == req.body.id)) {
            done(err,false,response);

        } else {
            response.errors = {phoneNumber : "phone # is already exited"}
            done(err,true,response);
        }
      });

  },function(exited,response,done){
        
        var changedOnServer = false;
        Provider.findOne({id: req.body.id},function(err, provider) {
          if (err) return next(err);

            if (provider) {

                changedOnServer = ! _.isEqual( new Date(req.body.updatedAt.toString()), new Date(provider.updatedAt.toString()) );
                console.log("clients "+ req.body.updatedAt.toString() );
                console.log("Server "+ provider.updatedAt.toString() );
                console.log("changedOnServer "+ changedOnServer );

                response.entity = _.pick(provider,keys);
                response.entity.changedOnServer = changedOnServer;
                done(err,exited,response,changedOnServer);
            }
        });

  },function(exited,response,changedOnServer){

        if (changedOnServer || exited ){        
            return res.status(422).send(response);
        }else{
          var time   = new Date().toString();
          var query = {id: req.body.id};
          var updated = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phoneNumber: req.body.phoneNumber,
              updatedAt : time
          };

          Provider.update(query,updated,function(err, result, status) {

            if (err) return next(err);

              if (status.ok) {

                response.entity = {
                  id: req.body.id,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  phoneNumber: req.body.phoneNumber,
                  updatedAt : time
                }
                response.success = { msg: 'update Success!' };
                return res.json(response);
              }
          });

        }

  }]);

};

