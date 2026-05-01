const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Extract and format Zod errors into a readable string
      const errorMessages = err.issues.map((e) => e.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }
    next(err);
  }
};

module.exports = validate;
