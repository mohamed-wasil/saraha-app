export const errorHandler = (api) => {
    return (req, res, next) => {
        api(req, res, next).catch((error) => {
            console.log(`Error in : ${req.url} from error handler middleware`, error);
            return next(new Error(error.message, { cause: 500 }));
        })
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    console.error(`Global Error from error handler middleware`, err.message);
        if (err) res.status(500).json({ message: 'Server error', error: err.message })  // if error in server then return 500 error code and error message
}

