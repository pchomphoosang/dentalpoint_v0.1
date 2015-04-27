var secrets = require('../config/secrets'),
    fs = require('fs'),
    aws = require('aws-sdk');

exports.upload = function(req, res) {
	var file = req.files.photo,
        stream = fs.createReadStream(file.path);

    aws.config.update({accessKeyId: secrets.aws.accessKeyId, secretAccessKey: secrets.aws.secretAccessKey });
    aws.config.region = secrets.aws.region;

    var p ={Bucket: secrets.aws.bucket, Key: Date.now()+file.originalFilename, ContentType: file.type},
        s3obj  = new aws.S3({params: p });
    
    s3obj.upload({Body: stream}).send(function(err, data) {
            var response = {};
            console.log(data);
            if (err) {
                response.errors = {phoneNumber : "upload failure"}
                res.status(422);
            } else {
                response.pic = data.Location;
            }
            return  res.json(response);
    });


};