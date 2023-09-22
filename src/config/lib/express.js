const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const config = require('../config');
const { AppError, globalErrorHandler } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

module.exports = () => {
  const app = express();
  app.use(morgan('dev'));
  app.use(cookieParser(nodeCache.getValue('COOKIE_SECRET')));
  app.use(express.json());
  app.set('port', nodeCache.getValue('PORT'));

  const globalConfig = config.getGlobalConfig();
  globalConfig.routes.forEach(routePath => require(path.resolve(routePath))(app));
  globalConfig.strategies.forEach(strategyPath => require(path.resolve(strategyPath))());

  app.all('*', (req, res, next) => {
    return next(new AppError(404, `Could not find ${req.originalUrl} on this server`));
  });
  app.use(globalErrorHandler);

  return app;
};
