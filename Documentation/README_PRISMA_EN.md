
# 📦 Prisma CLI – Useful Commands

This file provides a quick reference for the most commonly used Prisma CLI commands in your project.

---

## 🛠️ Initialization

```bash
npx prisma init
```
Creates the base Prisma structure:
- `prisma/schema.prisma`
- `.env` file with `DATABASE_URL`

---

## 🔄 Generate Prisma Client

```bash
npx prisma generate
```
Generates the Prisma Client based on the `schema.prisma` file.

---

## 🔎 Introspect Existing Database

```bash
npx prisma db pull
```
Updates the `schema.prisma` based on an existing database.

---

## 📤 Push Schema to Database (no migrations)

```bash
npx prisma db push
```
Pushes changes from `schema.prisma` directly to the database.

---

## 📸 Migrations (create and manage)

```bash
npx prisma migrate dev --name <migration-name>
```
Creates and applies a migration in development.

```bash
npx prisma migrate deploy
```
Applies migrations in production.

```bash
npx prisma migrate reset
```
Drops all tables and reapplies migrations. **⚠️ Destroys existing data.**

---

## 🧪 Prisma Studio

```bash
npx prisma studio
```
Opens a visual interface to browse and edit your database.

---

## 🧹 Clean Prisma Client

```bash
npx prisma generate --clean
```
Removes the old client and generates a new one.

---

## 📄 Help

```bash
npx prisma --help
```
Lists all available Prisma CLI commands and options.

---

## ✅ Requirements

- Node.js
- PostgreSQL, MySQL or SQLite database
- Prisma installed (`npm install prisma @prisma/client`)

---

> Created to ease Prisma usage in your project 🚀
