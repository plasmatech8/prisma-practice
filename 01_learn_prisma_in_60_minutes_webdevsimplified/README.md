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