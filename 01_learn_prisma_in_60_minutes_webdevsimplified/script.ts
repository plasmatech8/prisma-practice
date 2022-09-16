import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const prisma = new PrismaClient({ log: ["query"] })

async function main() {
    console.log(chalk.bold.underline.blue('Creating User'));
    await prisma.user.create({
        data: {
            age: 4,
            email: "asdsa@example.com",
            isAdmin: true,
            name: "Eugene",
            UserPreference: {
                create: {
                    emailUpdates: true
                }
            },
        },
        // include: {  UserPreference: true  },
        select: {
            name: true,
            UserPreference: { select: { emailUpdates: true } }
        }
    }).then(console.log).catch(e => console.log(e.message))

    console.log(chalk.bold.underline.blue('Listing Users'));
    console.log(await prisma.user.findMany())

    console.log(chalk.bold.underline.blue('Listing UserPreferences'));
    console.log(await prisma.userPreference.findMany())

    console.log(chalk.bold.underline.blue('Deleting Users'));
    console.log(await prisma.user.deleteMany())
}

main();