import { generateSalt, hashPassword } from "../../../src/utils/encrypt.js";

export const password = "login";

export const getUser = (roleId) => ({
  id: "login",
  email: "login",
  username: "login",
  password: hashPassword(password, generateSalt()),
  roles: {
    create: {
      roleId: roleId,
    },
  },
});

export const user = {
  id: "login",
  email: "login",
  username: "login",
  password: hashPassword(password, generateSalt()),
  roles: {
    create: {
      roleId: 3,
    },
  },
};

export const input = {
  email: user.email,
  password: password,
};
