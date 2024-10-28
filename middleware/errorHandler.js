// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    // Res tp 500 error
    res.status(err.status || 500).send({
        error: {
            message: err.message || 'Internal Server Error',
        }
    });
};

module.exports = errorHandler;