

exports.pageNotFound = (req, res, next) => {  

  res.status(404).json({
    error: "API endpoint not found"
  });
};