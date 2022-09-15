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

This will generate migrations in the migrations folder (SQL queries)
and it will also npm install the prisma client.
