import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
/* import bcrypt from 'bcrypt'; */

const prisma = new PrismaClient();

export default prisma;

/* async function main() {
  const users = [
    {
      firstName: "The",
      lastName: "Rock",
      email: "rock@gmail.com",
      phoneNumber: "916868690",
      password: "teste",
    },
    {
      firstName: "John",
      lastName: "Cena",
      email: "jc@gmail.com",
      phoneNumber: "916868690",
      password: "teste",
    },
    {
      firstName: "Mia",
      lastName: "Khalifa",
      email: "Mia@gmail.com",
      phoneNumber: "916868690",
      password: "teste",
    },
    {
      firstName: "Lebron",
      lastName: "James",
      email: "king@gmail.com",
      phoneNumber: "916868690",
      password: "teste",
    },
    {
      firstName: "Pedro",
      lastName: "Henrique",
      email: "mailpedro@gmail.com",
      phoneNumber: "916868690",
      password: "teste",
    },
  ];

  const roleId = "2a573337-6a1c-48fe-a46d-705d48f4c4e0"; // ID da role

  for (const user of users) {
    const hashedPassword = await argon2.hash(user.password);
    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: hashedPassword,
        roleId: roleId,
      },
    });
  }

  console.log("Usuários inseridos com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 */