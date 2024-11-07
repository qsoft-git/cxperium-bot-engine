// ? Node modules.
import express from 'express';

export interface IUtilsRouter {
	router: express.Router;
	exportRouter(): express.Router;
}
