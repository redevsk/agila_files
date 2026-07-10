function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

function created(res, data) {
  return ok(res, data, 201);
}

function fail(res, status, message, details) {
  return res.status(status).json({
    error: {
      message,
      details,
    },
  });
}

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { ok, created, fail, asyncHandler };
