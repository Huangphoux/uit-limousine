const validateUser = require("../validateUser.js");

it("should fail", () => {
  expect(validateUser(123, 123)).toBeFalsy();
});
