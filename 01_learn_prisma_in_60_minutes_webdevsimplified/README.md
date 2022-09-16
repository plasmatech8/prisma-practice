# Learn Prisma In 60 Minutes

Following [Learn Prisma In 60 Minutes](https://youtu.be/RebA5J-rlwg) by Web Dev Simplified

Starts with the [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)

Also worth checking out [Prisma in 100 Seconds](https://youtu.be/rLRIB6AF2Dg)

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

## 06. Model Fields

Model fields:
* Attributes start with `@` and are used to add properties to a column
* Optional columns have a question mark after the type. e.g. `String?`

Field types:
* Int, BigInt, Boolean, Float, Decimal
* String, Json (not supported in sqlite), Bytes, DateTime
* Unsupported (used for different databases)
* You can also use other models as the type

## 07. Model Relationships

You can reference other models using relations:
```prisma
model User {
    id      Int     @id @default(autoincrement())
    // ...
    Post    Post[]
}

model Post {
    id        Int      @id @default(autoincrement())
    // ...
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
}
```

What if we have multiple lists?

If we want to add multiple lists of posts to the user, we need to add a name. e.g.
```prisma
model User {
  id            String  @id @default(uuid())
  // ...
  writtenPosts  Post[] @relation("WrittenPosts")
  favoritePosts Post[] @relation("FavoritePosts")
}

model Post {
  id            String   @id @default(uuid())
  // ...
  author        User     @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String
  favoritedBy   User?    @relation("FavoritePosts", fields: [favoritedById], references: [id])
  favoritedById String
}
```

What about a many-to-many relationship?

We don't need to do much. It will automatically create a join table between the two tables.
(You don't need foreign key IDs in your main tables when you use a join table)

```prisma
model Post {
  id            String     @id @default(uuid())
  // ...
  Categories    Category[]
}

model Category {
  id    String @id @default(uuid())
  // ...
  posts Post[]
}
```

## 08. Model Attributes

More noteworthy column attributes:
* `@unique` makes sure that the column only contains unique values
* `@updatedAt` automatically updates the DateTime when the record is created/updated
* `@default(now())` sets default DateTime value to now

We can also do block-level attributes using `@@`:
* `@@unique([age, name])` add this line to a model and it will make sure that name and age together must be unique.
* `@@index([email])` will allow us to query by email more easily
* `@@id([title, authorId])` will allow us to have a composite primary key

## 09. Enums

We can create enums like below.
```prisma
model User {
  id             String          @id @default(uuid())
  // ...
  role           Role            @default(BASIC)
}

enum Role {
  BASIC
  ADMIN
}
```

sqlite does not support enums, so we will ignore this.


## 09. Migration Debug

```bash
npx prisma migrate dev
#  • Step 4 Added the required column `age` to the `User` table without a default value. There are 3 rows in this table, it is not possible to execute this step.
#   • Step 4 Added the required column `email` to the `User` table without a default value. There are 3 rows in this table, it is not possible to execute this step.
#   • Step 4 Added the required column `isAdmin` to the `User` table without a default value. There are 3 rows in this table, it is not possible to execute this step.
```

For this case, we will delete all users using `await prisma.user.deleteMany()`.

## 10. Client Create Operations

Note that you should only use one Prisma client if you want to make multiple database connections.

We can create a user, and also create a referenced UserPreferences object in a single request:
```ts
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
        include: {
            UserPreference: true
        }
    }).then(console.log).catch(e => console.log(e.message))
```

Note:
* When we delete this record, we get a foreign key error due to UserPreference referencing the user.
* We can switch around the relationship so that User references the UserPreference instead.
* Now we can delete the user and the user preference remains

We can also use a `select` block instead of a `include` block:
```ts
select: {
    name: true,
    UserPreference: { select: { emailUpdates: true } }
}
```

Note:
* We can add log to our prisma client to print the SQL queries made
* `const prisma = new PrismaClient({ log: ["query"] })`

Note:
* `createMany` is not supported in sqlite

## 11. Client Read Operations

```ts
// Find unique by a unique column / primary key
await prisma.user.findUnique({
    where: {
        age_name: {
            age: 27,
            name: "Kyle"
        }
    }
})

// Find unique by a unique column / primary key...
await prisma.user.findUnique({
    where: {
        age_name: {
            age: 27,
            name: "Kyle"
        }
    }
})

// Find first user where column is...
await prisma.user.findFirst({
    where: { name: { startsWith: "eug" } }
})

// Find many users where name is X and only return one of each distinct name and age:
await prisma.user.findMany({
    where: { name: 'Sally' }, distinct: ["name", "age"]
})

// Find many users with pagination can be done using `skip`, `take`, and `orderBy`:
console.log(await prisma.user.findMany({
        take: 2, skip: 1, orderBy: { age: "desc" }
}))

// Find users with AND (can also do OR):
await prisma.user.findMany({
    where: {
        AND: [
            { name: { startsWith: "e" } },
            { name: { endsWith: "e" } }
        ]
    }
})
```

## 12. Relationship filtering

You can do conditions like: `every`, `none` and `some`

```ts
await prisma.user.findMany({
    where: { writtenPosts: { every: { title: "Test"} } }
})
await prisma.post.findMany({
    where: { author: { is: { age: 27 } } }
})
```

## 12. Client Update Operations

We can update/updateMany users in similar ways to create and read:
```ts
await prisma.user.updateMany({
    where: { age: 4 },  data: { age: 26 }
})
await prisma.user.update({
    where: { email: "kyle@test.com" /* unique field */ },  data: { age: { decrement: 1  /* multiply, increment, etc */} }
})
```