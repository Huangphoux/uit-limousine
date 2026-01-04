export const getInstructor = (roleId) => ({
  id: "create course",
  username: "create course",
  email: "create course",
  roles: {
    create: {
      roleId: roleId,
    },
  },
});

export const instructor = {
    id: "create course",
    username: "create course",
    email: "create course",
    roles: {
        create: {
            role: {
                connect: {
                    name: "INSTRUCTOR"
                }
            }
        }
    }
}

export const input = {
  authId: "create course",
  title: "create course",
  instructorId: "create course",
};
