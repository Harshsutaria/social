/*
 * Will be used  validate the request object for posts.
 * @description
 * Only used to validate the request body.
 * will check wether the required fields are available or not.
 *
 * mandatory fields are:
 * 1. username,
 * 2. description,
 * 3. emailId,
 * 4. image
 * 5. gender
 * 6. state
 *
 * @param {any} payload ,
 * @returns {any} object,
 */
function validateCreateRequestPayload(payload) {
  let validation = {};
  if (!payload.title) {
    console.log("title IS MANDATORY");
    validation.status = false;
    validation.data = "title IS MANDATORY";
    return validation;
  }

  if (!payload.description) {
    console.log("description DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "description DETAILS IS MANDATORY";
    return validation;
  }

  if (!payload.authorName) {
    console.log("authorName DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "authorName DETAILS IS MANDATORY";
    return validation;
  }

  if (!payload.authorId) {
    console.log("authorId DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "authorId DETAILS IS MANDATORY";
    return validation;
  }

  validation.status = true;
  validation.data = "VALIDATION SUCCESS.";
  return validation;
}

function validateGetRequestParam(params) {
  let validation = {};
  if (!params.id) {
    console.log("ID IS MANDATORY");
    validation.status = false;
    validation.data = "ID IS MANDATORY";
    return validation;
  }

  validation.status = true;
  validation.data = "VALIDATION SUCCESS.";
  return validation;
}

module.exports = {
  validateCreateRequestPayload,
  validateGetRequestParam,
};
