var secrets = require('../config/secrets');
var fs = require('fs');
var S3FS = require('s3fs');
//var endpoint = 'chompoo.patientsinterest.picbucket.s3-website-ap-southeast-1.amazonaws.com';
var s3client = new S3FS('chompoo.patientsinterest.picbucket', {
    accessKeyId: 'AKIAJFUKYA7ZOT2P6HOA',
    secretAccessKey: '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'
 });


exports.upload = function(req, res) {
	var file = req.files.photo;
	console.log(file);
	var stream = fs.createReadStream(file.path);

   	return s3client.writeFile(file.originalFilename, stream).then(function () {	
        fs.unlink(file.path, function (err) {
            if (err) {
                console.error(err);
            }
        });
        res.status(200).end();
    });

};