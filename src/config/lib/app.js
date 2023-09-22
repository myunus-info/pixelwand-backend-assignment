exports.start = () => {
  const db = require('./mongoose');
  const app = require('./express')();

  db.then(() => {
    console.log('Database connected successfully!');
    app.listen(app.get('port'), () => {
      console.log('Server is up on port %s in %s mode', app.get('port'), app.settings.env);
    });
  });
};
