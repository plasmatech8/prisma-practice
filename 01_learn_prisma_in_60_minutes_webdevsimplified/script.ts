import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "John"
        }
    })
    console.log(user)
    // prisma.user.findFirst()
}

main();