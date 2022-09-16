import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const prisma = new PrismaClient() // { log: ["query"] }

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

    // console.log(chalk.bold.underline.blue('Find Unique User'));
    // console.log(await prisma.user.findUnique({
    //     where: {
    //         age_name: {
    //             age: 27,
    //             name: "Kyle"
    //         }
    //     }
    // }))

    // console.log(chalk.bold.underline.blue('Find First User Where...'));
    // console.log(await prisma.user.findFirst({
    //     where: { name: { startsWith: "eug" } }
    // }))

    // console.log(chalk.bold.underline.blue('Find Many Users Where...'));
    // console.log(await prisma.user.findMany({
    //     where: { name: 'Sally' }, distinct: ["name"]
    // }))

    // console.log(chalk.bold.underline.blue('Find Many Users with pagination'));
    // console.log(await prisma.user.findMany({
    //     take: 2, skip: 1, orderBy: { age: "desc" }
    // }))

    // console.log(chalk.bold.underline.blue('Find Users Where AND...'));
    // console.log(await prisma.user.findMany({
    //     where: {
    //         AND: [
    //             { name: { startsWith: "e" } },
    //             { name: { endsWith: "e" } }
    //         ]
    //     }
    // }))

    // console.log(chalk.bold.underline.blue('Find Users Where post relationship has...'));
    // console.log(await prisma.user.findMany({
    //     where: { writtenPosts: { every: { title: "Test" } } }
    // }))

    // console.log(chalk.bold.underline.blue('Find Posts where author relationship has...'));
    // console.log(await prisma.post.findMany({
    //     where: { author: { is: { age: 27 } } }
    // }))


    console.log(chalk.bold.underline.blue('Deleting Users'));
    console.log(await prisma.user.deleteMany())

    console.log(chalk.bold.underline.blue('Deleting User Preferences'));
    console.log(await prisma.userPreference.deleteMany())

}

main();