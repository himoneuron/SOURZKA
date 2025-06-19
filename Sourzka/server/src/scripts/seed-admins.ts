import { AdminService } from "../services/admin.service";

async function main() {
  const admins = [
    {
      name: "Alice Johnson",
      email: "a@gmail.com",
      password: "password123",
      role: "SUPERADMIN" as const
    },
    {
      name: "Bob Smith",
      email: "b@gmail.com",
      password: "password123",
      role: "SUPERADMIN" as const
    },
    {
      name: "Charlie Brown",
      email: "c@gmail.com",
      password: "password123",
      role: "SUPERADMIN" as const
    }
  ];

  console.log("Starting admin seeding...");

  for (const admin of admins) {
    try {
      await AdminService.createAdmin(admin);
      console.log(`✓ Created admin: ${admin.name} (${admin.email})`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.warn(`⚠ Admin already exists: ${admin.email}`);
      } else {
        console.error(`✗ Error creating admin ${admin.email}:`, error);
      }
    }
  }

  console.log("Admin seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  });
