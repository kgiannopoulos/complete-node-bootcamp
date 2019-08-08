const handleCastErrorDB = err


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack :err.stack
  });
};

const sendErrorProd = (err, res) => {
  //operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    //programming error dont want to leak the details to the client
  } else {
    //1. log to console
    console.error('ERROR', err);
    //2.send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  };


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};

    if(error.name === 'CastError') error =  handleCastErrorDB(error)


    sendErrorProd(err, res);
  }
  };
