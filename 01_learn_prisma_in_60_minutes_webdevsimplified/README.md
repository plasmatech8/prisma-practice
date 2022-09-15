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
