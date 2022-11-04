exports.sendCreated = function(res, data) {
  return res.status(201).send(data);
};

exports.sendBadRequest = function(res, message) {
  return res.status(400).send({
    success: false,
    message: message
  });
};

exports.sendUnauthorized = function(res, message) {
  return res.status(401).send({
    success: false,
    message: message
  });
};

exports.sendForbidden = function(res) {
  return res.status(403).send({ 
    success: false,
    message: 'You do not have rights to access this resource.'
  });
};

exports.sendNotFound = function(res, message) {
  return res.status(404).send({
    success: false,
    message: message || 'Resource not found.'
  });
};

exports.sendSuccess = function(res, message) {
  return res.status(200).send({
    success: true,
    message: message || 'Success'
  });
};

exports.setHeadersForCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept");
  next();
}
