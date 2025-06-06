import db from "../../configs/connectToDb.js";
import usersRoles from "../usersRoles.js";

const seedRoles = async () => {
  try {
    const roles = Object.values(usersRoles);

    for (const role of roles) {
      await db.execute(
        `INSERT INTO roles (role_name)
        SELECT ? FROM DUAL
        WHERE NOT EXISTS (
        SELECT 1 FROM roles WHERE role_name = ?
        );`,
        [role, role]
      );
    }
  } catch (error) {
    console.log("Error seeding roles:", error);
  }
};

export default seedRoles;
