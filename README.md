# Preorder Management

A responsive preorder management dashboard built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite through Turso/libSQL. The backend lives inside the same Next.js app through App Router API routes.

Live demo: https://preorder-management-11.vercel.app

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- Turso/libSQL SQLite
- Tailwind CSS 4
- Sonner
- Framer Motion
- Radix UI Popover
- React DayPicker
- date-fns

## Features

- List, create, update, and delete preorders
- Backend-driven filtering, sorting, and pagination
- Active/inactive status toggle
- Seed endpoint for sample preorder data
- Turso/libSQL database connection
- Native `fetch` based frontend API layer
- Responsive table and form UI

## Environment

Create `.env.local` in the project root:

```env
DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your_turso_auth_token"
```

For deployment, add the same variables to your hosting provider.

## Setup

Clone the repository:

```bash
git clone https://github.com/humayun506034/preorder-management.git
cd preorder-management
```

Install dependencies:

```bash
yarn install
```

Generate Prisma Client:

```bash
yarn prisma generate
```

Apply the SQLite schema to Turso without Turso CLI login:

```bash
yarn db:apply
```

Start development server:

```bash
yarn dev
```

Open:

```txt
http://localhost:3000
```

## Database Notes

This project uses Turso/libSQL with Prisma adapter. `yarn prisma migrate dev` does not work with the remote `libsql://` URL, so schema SQL is applied with:

```bash
yarn db:apply
```

The SQL file is:

```txt
prisma/migrations/20260625172631_modify/migration.sql
```

The app also calls `ensureDatabase()` before DB operations, which runs `CREATE TABLE IF NOT EXISTS` as a safety check.

## Scripts

```bash
yarn dev
```

Runs the app in development mode.

```bash
yarn build
```

Creates a production build.

```bash
yarn start
```

Runs the production build locally.

&nbsp;

Applies the Turso/libSQL schema using `DATABASE_URL` and `TURSO_AUTH_TOKEN`.





```bash
yarn db:apply
```

```bash
yarn prisma generate
```

Generates Prisma Client.

## API Routes

Base URL locally:

```txt
http://localhost:3000
```

Endpoints:

```http
GET /api/preorder
POST /api/preorder
GET /api/preorder/{id}
PATCH /api/preorder/{id}
DELETE /api/preorder/{id}
POST /api/preorder/seed

```

### List Preorders

```http
GET /api/preorder
```

Query parameters:

```txt
search=summer
status=active
sortBy=createdAt
sortOrder=desc
page=1
limit=10
```

Example:

```bash
curl "http://localhost:3000/api/preorder?status=all&sortBy=createdAt&sortOrder=desc&page=1&limit=10"
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Preorder list fetched successfully.",
  "data": [
    {
      "id": "9f25f81a-1d83-4a7a-94ac-7f41fe8c011a",
      "name": "Summer Essentials Drop",
      "products": 4,
      "preorderWhen": "regardless-of-stock",
      "startsAt": "2026-06-25T09:00:00.000Z",
      "endsAt": "2026-07-02T23:59:00.000Z",
      "isActive": true,
      "createdAt": "2026-06-26T04:00:00.000Z",
      "updatedAt": "2026-06-26T04:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "itemCount": 1,
    "totalItems": 1,
    "totalPages": 1,
    "from": 1,
    "to": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Create Preorder

```http
POST /api/preorder
```

Request:

```bash
curl -X POST http://localhost:3000/api/preorder \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Essentials Drop",
    "products": 4,
    "preorderWhen": "regardless-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": "2026-07-02T23:59:00.000Z",
    "isActive": true
  }'
```

Response:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Preorder created successfully.",
  "data": {
    "id": "9f25f81a-1d83-4a7a-94ac-7f41fe8c011a",
    "name": "Summer Essentials Drop",
    "products": 4,
    "preorderWhen": "regardless-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": "2026-07-02T23:59:00.000Z",
    "isActive": true,
    "createdAt": "2026-06-26T04:00:00.000Z",
    "updatedAt": "2026-06-26T04:00:00.000Z"
  }
}
```

### Get One Preorder

```http
GET /api/preorder/{id}
```

Example:

```bash
curl http://localhost:3000/api/preorder/9f25f81a-1d83-4a7a-94ac-7f41fe8c011a
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Preorder fetched successfully.",
  "data": {
    "id": "9f25f81a-1d83-4a7a-94ac-7f41fe8c011a",
    "name": "Summer Essentials Drop",
    "products": 4,
    "preorderWhen": "regardless-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": "2026-07-02T23:59:00.000Z",
    "isActive": true,
    "createdAt": "2026-06-26T04:00:00.000Z",
    "updatedAt": "2026-06-26T04:00:00.000Z"
  }
}
```

### Update Preorder

```http
PATCH /api/preorder/{id}
```

Request:

```bash
curl -X PATCH http://localhost:3000/api/preorder/9f25f81a-1d83-4a7a-94ac-7f41fe8c011a \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Summer Drop",
    "products": 5,
    "preorderWhen": "out-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": null,
    "isActive": false
  }'
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Preorder updated successfully.",
  "data": {
    "id": "9f25f81a-1d83-4a7a-94ac-7f41fe8c011a",
    "name": "Updated Summer Drop",
    "products": 5,
    "preorderWhen": "out-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": null,
    "isActive": false,
    "createdAt": "2026-06-26T04:00:00.000Z",
    "updatedAt": "2026-06-26T04:05:00.000Z"
  }
}
```

### Delete Preorder

```http
DELETE /api/preorder/{id}
```

Example:

```bash
curl -X DELETE http://localhost:3000/api/preorder/9f25f81a-1d83-4a7a-94ac-7f41fe8c011a
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Preorder deleted successfully.",
  "data": {
    "id": "9f25f81a-1d83-4a7a-94ac-7f41fe8c011a",
    "name": "Updated Summer Drop",
    "products": 5,
    "preorderWhen": "out-of-stock",
    "startsAt": "2026-06-25T09:00:00.000Z",
    "endsAt": null,
    "isActive": false,
    "createdAt": "2026-06-26T04:00:00.000Z",
    "updatedAt": "2026-06-26T04:05:00.000Z"
  }
}
```

### Seed Preorders

```http
POST /api/preorder/seed
```

Example:

```bash
curl -X POST http://localhost:3000/api/preorder/seed
```

Response:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Sample preorder data seeded successfully.",
  "data": {
    "inserted": 15
  }
}
```

### Error Response

Example:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Preorder not found.",
  "data": null
}
```

## Supported Query Values

- `status`: `all`, `active`, `inactive`
- `sortBy`: `name`, `createdAt`, `startsAt`, `endsAt`
- `sortOrder`: `asc`, `desc`
- `page`: positive number
- `limit`: positive number, max `100`

## Project Structure

```text
app/
  api/
    preorder/
      route.ts
      seed/
        route.ts
      [id]/
        route.ts
  layout.tsx
  page.tsx
  not-found.tsx
components/
  preorders/
    preorder-management-page.tsx
    preorder-table.tsx
    preorder-filters.tsx
    preorder-pagination.tsx
    preorder-form.tsx
    confirm-delete-modal.tsx
    date-time-picker.tsx
  ui/
    calendar.tsx
    popover.tsx
features/
  preorders/
    client/
      preorder-api.ts
    server/
      preorder.constants.ts
      preorder.errors.ts
      preorder.mapper.ts
      preorder.query.ts
      preorder.service.ts
      preorder.validation.ts
    preorder-options.ts
    preorder.types.ts
lib/
  generated/
    prisma/
  server/
    api-response.ts
    prisma.ts
prisma/
  migrations/
  seed-data/
  schema.prisma
scripts/
  apply-sqlite-schema.mjs
```

## Data Flow

```txt
PreorderForm
  -> preorder-management-page.tsx
  -> features/preorders/client/preorder-api.ts
  -> app/api/preorder route
  -> features/preorders/server/preorder.service.ts
  -> lib/server/prisma.ts
  -> Turso SQLite database
```

