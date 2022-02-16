const express = require("express");
const router = express.Router();
const controller = require("../../controllers/FileController");

let routes = (app) => {
	router.get("/files", controller.getListFiles);
	router.get("/archiveFiles/:name", controller.downloadArchive);
	router.get("/uploadFiles/:name", controller.downloadUpload);

	app.use(router);
};

module.exports = routes;
