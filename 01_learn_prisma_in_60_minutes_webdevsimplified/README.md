# Learn Prisma In 60 Minutes

Following [Learn Prisma In 60 Minutes](https://youtu.be/RebA5J-rlwg) by Web Dev Simplified

Starts with the [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)

## 01. Project Setup

Install dependencies:
```bash
npm init -y
npm i --save-dev prisma typescript ts-node @types/node nodemon
```

Create ts config with instructions on the prisma website:
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```

## 02. Prisma Setup

Initialise Prisma code with Sqlite:
```bash
npx prisma init --datasource-provider sqlite
```

You can also use other databases.

## 03. Basic Prisma Model Setup

To create models, we edit the `schema.prisma` and create a model.

Every model needs an @id attribute.

```prisma
model User {
  id Int @id @default(autoincrement())
  name String
}
```

## 04. Prisma Migration Basics

We will add the new model using the prisma command to generate a migrations file.

```bash
npx prisma migrate dev --name init
```

This will generate migrations in the migrations folder (SQL queries).

It will also install a prisma client WITH YOUR TYPES BUILT INTO THE PACKAGE.

## 05. Prisma Client Basics

To re-generate the client library:
```prisma
npx prisma generate
```

It will also spit out an example code snippet for client-side usage.

We will create an example script like below:
```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "John"
        }
    })
    console.log(user)
}

main();
```

> Pondering. It would be nice to have this schema + migrations system built into Supabase.
> Supabase already has its own type generator, but the DX is not as good as Prisma because Prisma generates
> an entire library, whereas Supabase just gives you a type interface to pass into your client as a generic.
> It is also worth noting that both Prisma and Supabase appear to only support Typescript.
> It is also worth noting that Supabase does not appear to generate types for Database or Edge Functions.

## 06. Datasources and Generators