const Joi = require('joi');

// Common validation schemas
const schemas = {
  // User validation
  userRegistration: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid('admin', 'manager', 'designer', 'client', 'operator').default('client'),
    companyName: Joi.string().trim().max(200).optional(),
    phoneNumber: Joi.string().trim().pattern(/^[+]?[\d\s\-\(\)]+$/).optional(),
    address: Joi.object({
      street: Joi.string().trim().max(200).optional(),
      city: Joi.string().trim().max(100).optional(),
      state: Joi.string().trim().max(100).optional(),
      country: Joi.string().trim().max(100).optional(),
      postalCode: Joi.string().trim().max(20).optional()
    }).optional(),
    preferences: Joi.object({
      currency: Joi.string().valid('SDG', 'AED', 'SAR', 'EGP', 'USD').default('AED'),
      language: Joi.string().valid('en', 'ar').default('en'),
      notifications: Joi.object({
        email: Joi.boolean().default(true),
        sms: Joi.boolean().default(false),
        whatsapp: Joi.boolean().default(true)
      }).optional()
    }).optional()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Project validation
  projectCreate: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().max(1000).optional(),
    client: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    assignedTo: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
    category: Joi.string().valid('brochure', 'business-card', 'banner', 'poster', 'book', 'packaging', 'other').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    deadline: Joi.date().min('now').optional(),
    budget: Joi.object({
      amount: Joi.number().min(0).required(),
      currency: Joi.string().valid('SDG', 'AED', 'SAR', 'EGP', 'USD').default('AED')
    }).optional(),
    specifications: Joi.object({
      size: Joi.string().trim().max(100).optional(),
      colorMode: Joi.string().valid('CMYK', 'RGB', 'Pantone').default('CMYK'),
      paperType: Joi.string().trim().max(100).optional(),
      finishing: Joi.array().items(Joi.string().trim().max(50)).optional(),
      quantity: Joi.number().min(1).default(1)
    }).optional()
  }),

  // Task validation
  taskCreate: Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().max(1000).optional(),
    project: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    category: Joi.string().valid('design', 'review', 'printing', 'quality-check', 'delivery', 'other').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    dueDate: Joi.date().min('now').optional(),
    estimatedHours: Joi.number().min(0).optional(),
    subtasks: Joi.array().items(Joi.object({
      title: Joi.string().trim().min(1).max(200).required()
    })).optional(),
    tags: Joi.array().items(Joi.string().trim().max(30)).optional()
  }),

  // Invoice validation
  invoiceCreate: Joi.object({
    project: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    client: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    type: Joi.string().valid('proforma', 'final', 'deposit', 'partial').default('final'),
    items: Joi.array().items(Joi.object({
      description: Joi.string().trim().min(1).max(500).required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
      discount: Joi.number().min(0).max(100).default(0),
      tax: Joi.number().min(0).default(0)
    })).min(1).required(),
    currency: Joi.string().valid('SDG', 'AED', 'SAR', 'EGP', 'USD').default('AED'),
    dueDate: Joi.date().min('now').required(),
    paymentTerms: Joi.string().trim().max(100).default('Net 30'),
    notes: Joi.string().trim().max(1000).optional()
  }),

  // General validation
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().trim().max(50).optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // File validation
  fileMetadata: Joi.object({
    category: Joi.string().valid('design', 'proof', 'final', 'reference', 'invoice', 'contract', 'other').default('other'),
    tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
    accessLevel: Joi.string().valid('public', 'client', 'internal', 'private').default('client')
  })
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    req[property] = value;
    next();
  };
};

// Validate object ID parameter
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!schemas.objectId.validate(id).error) {
      return next();
    }

    res.status(400).json({
      success: false,
      message: `Invalid ${paramName} format`
    });
  };
};

module.exports = {
  schemas,
  validate,
  validateObjectId
};
