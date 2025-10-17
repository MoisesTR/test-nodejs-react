/**
 * Utility function to handle pagination logic consistently across controllers
 * @param {Object} req - Express request object
 * @param {Function} queryFn - Prisma query function that accepts skip, take, and orderBy
 * @param {Function} countFn - Prisma count function
 * @param {Object} options - Configuration options
 * @param {number} options.defaultLimit - Default items per page
 * @param {number} options.maxLimit - Maximum items per page
 * @param {Object} options.defaultOrderBy - Default ordering
 * @returns {Object} Paginated response data
 */
const getPaginatedData = async (req, queryFn, countFn, options = {}) => {
  const {
    defaultLimit = 10,
    maxLimit = 100,
    defaultOrderBy = { id: 'desc' }
  } = options;

  // Parse pagination parameters
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit) || defaultLimit));
  const skip = (page - 1) * limit;

  // Execute queries in parallel
  const [data, total] = await Promise.all([
    queryFn({
      skip,
      take: limit,
      orderBy: defaultOrderBy
    }),
    countFn()
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = {
  getPaginatedData
};