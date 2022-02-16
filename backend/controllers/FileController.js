const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";

const getListFiles = (req, res) => {
	const directoryPath = __basedir + "/archive/";

	fs.readdir(directoryPath, function (err, files) {
		if (err) {
			res.status(500).send({
				message: "Unable to scan files!",
			});
		}

		let fileInfos = [];

		files.forEach((file) => {
			fileInfos.push({
				name: file,
				url: baseUrl + file,
			});
		});

		return res.status(200).send(fileInfos);
	});
};

const downloadArchive = (req, res) => {
	const fileName = req.params.name;
	const directoryPath = __basedir + "/archive/";

	res.download(directoryPath + fileName, fileName, (err) => {
		if (err) {
			return res.status(500).send({
				message: "Could not download the file. " + err,
			});
		}
	});
};

const downloadUpload = (req, res) => {
	const fileName = req.params.name;
	const directoryPath = __basedir + "/uploads/";

	res.download(directoryPath + fileName, fileName, (err) => {
		if (err) {
			return res.status(500).send({
				message: "Could not download the file. " + err,
			});
		}
	});
};

module.exports = {
	getListFiles,
	downloadArchive,
	downloadUpload,
};
