const csv = require("csv-parser");
const fs = require("fs");
const getStream = require("get-stream");

module.exports.serverError = function (error, res) {
	console.log(error);
	return res.status(500).json({
		success: false,
		msg: "Server Error!!!",
		data: null,
	});
};

module.exports.readCSVData = async function (filePath) {
	const data = await getStream.array(
		fs.createReadStream(filePath).pipe(csv())
	);
	return data;
};
