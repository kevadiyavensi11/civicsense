/**
 * Validates that a route handler is a function.
 * Throws a clear error if not, preventing obscure Express crashes.
 * @param {Function} handler - The controller function
 * @param {string} name - Name of the function for error reporting
 * @returns {Function} - The valid handler
 */
const validate = (handler, name) => {
    if (typeof handler !== 'function') {
        throw new Error(`[Route Error] Handler for '${name}' is not a function. Check controller exports.`);
    }
    return handler;
};

module.exports = validate;
