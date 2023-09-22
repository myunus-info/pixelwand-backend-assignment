// Common function for replacing try-catch block
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
