/*
 * Will be used  validate the request object.
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
  if (!payload.userName) {
    console.log("userName IS MANDATORY");
    validation.status = false;
    validation.data = "userName IS MANDATORY";
    return validation;
  }

  if (!payload.description) {
    console.log("description DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "description DETAILS IS MANDATORY";
    return validation;
  }

  if (!payload.emailId) {
    console.log("emailId DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "emailId DETAILS IS MANDATORY";
    return validation;
  }

  if (payload["gender"] == undefined) {
    console.log("gender DETAILS IS MANDATORY");
    validation.status = false;
    validation.data = "gender DETAILS IS MANDATORY";
    return validation;
  }

  validation.status = true;
  validation.data = "VALIDATION SUCCESS.";
  return validation;
}

module.exports = {
  validateCreateRequestPayload,
};
