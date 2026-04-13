# LukiSourcing

## 30-Second Elevator Pitch

LukiSourcing is a sourcing workflow platform for fashion teams that need a clearer way to track raw materials from first request to final delivery. Inspired by the structured flow of restaurant reservation and floor-management tools, this app reimagines that same live-status experience for materials, trims, dyes, hardware, and supplier communication.

Instead of tracking sourcing across scattered emails, spreadsheets, chat threads, and PDFs, LukiSourcing gives brands and sourcing teams one place to follow each material through its lifecycle: requested, quoted, sampled, approved, ordered, in transit, received, and ready for production.

## Project Vision

Fashion sourcing is often slowed down by fragmented communication and poor visibility. A designer may request a material, a supplier may send swatches days later, production may ask for cost confirmation, and logistics may need delivery updates, all in separate tools.

LukiSourcing centralizes that workflow into a dashboard-driven application where each material has a clear status, owner, factory connection, and ETA. The goal is to make those answers visible in real time.

## Core Problem

Teams need a way to answer questions like:

- Which raw materials are still waiting on supplier quotes?
- Which trims have already been approved for sampling?
- What materials are delayed in transit?
- Which purchase orders are incomplete?
- What is the ETA for a material needed for the next production run?

## Main Concepts

### Materials

Materials are the main entity in the system. Each material is the thing being tracked.

For MVP, each material should store a simple status field and key details such as:

- material name
- category
- status
- cost
- ETA
- description

### Users

Users are the people using the app, such as a designer, sourcing manager, or production coordinator.

Users can:

- create materials
- assign factories
- update status
- add notes
- track progress

Each important action in the app should be tied to a user so it is clear who updated what.

### Factories

Factories are the suppliers or production partners that make the materials.

A factory should store simple information such as:

- factory name
- contact information
- country
- lead time

## How They Are Linked

### Material and Factory

Materials and factories are a many-to-many relationship.

- one material can have multiple factories
- one factory can supply multiple materials

For that reason, the MVP technical plan includes a join table:

- `material_factories`

This join table can later support quotes, supplier options, and factory-specific pricing.

### Material and User

Users interact with materials by creating them, updating them, and leaving notes. This means the app should connect user actions back to materials through simple tracking fields and activity records.

## MVP Scope

To keep scope manageable, the MVP will focus on:

- create materials
- assign factories
- update status
- view materials on a dashboard

Stretch goals such as full history, supplier quotes, purchase orders, invoices, and deeper document workflows can come later.

## Database Schema

For the MVP, the main tables will likely be:

### `users`

- `id`
- `first_name`
- `last_name`
- `company`
- `email`
- `password`

### `materials`

- `id`
- `name`
- `category`
- `description`
- `status`
- `cost`
- `eta`
- `created_by`

### `factories`

- `id`
- `factory_name`
- `country`
- `address`
- `website`
- `main_phone`
- `main_email`
- `lead_time`

### `material_factories`

- `id`
- `material_id`
- `factory_id`
- `quoted_cost`
- `lead_time`
- `notes`

Because the app also includes notes, status updates, and activity tracking, it will likely need more tables such as:

### `notes`

- `id`
- `material_id`
- `user_id`
- `note`
- `created_at`

### `activity_log`

- `id`
- `material_id`
- `user_id`
- `action_type`
- `old_value`
- `new_value`
- `created_at`

These tables support change tracking and make the workflow easier to manage.

## API Endpoints

For MVP, the app will likely need routes such as:

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`

### Materials

- `GET /api/materials`
- `POST /api/materials`
- `GET /api/materials/:id`
- `PATCH /api/materials/:id`

### Factories

- `GET /api/factories`
- `POST /api/factories`
- `GET /api/factories/:id`
- `PATCH /api/factories/:id`

### Material and Factory Assignment

- `GET /api/material-factories`
- `POST /api/material-factories`
- `PATCH /api/material-factories/:id`

### Notes and Activity

- `GET /api/materials/:id/notes`
- `POST /api/materials/:id/notes`
- `GET /api/materials/:id/activity`

## User Stories

- As a sourcing manager, I want to create a material so I can begin tracking it.
- As a sourcing manager, I want to assign one or more factories to a material so I can compare sourcing options.
- As a designer, I want to update the status of a material so the team can see progress.
- As a production coordinator, I want to view materials on a dashboard so I can quickly see what is delayed.
- As a team member, I want to add notes to a material so information is not lost in email threads.

## Wireframes and Pages

The application includes these main pages:

- Login / Register
- Dashboard
- Factories
- Materials
- Stage of Material

### Dashboard

Main view for materials. Each material appears as a card or row showing:

- status
- factory info
- ETA

### Board View

Columns represent status stages such as:

- requested
- quoted
- sampled
- approved
- ordered
- in transit
- received

Materials move across stages visually.

### Material Detail View

Clicking a material shows:

- full material info
- linked factories
- notes
- activity log

### Factory View

A page for managing supplier records, contacts, and supplier details.

## Current Project Build

The current `lukisourcing` project already includes early versions of:

- backend user registration and login
- frontend register and login pages
- dashboard page
- factories page
- materials page
- stage of material page

This means the project has already started implementing the core workflow.

## Simple Mental Model

- Material = the thing being tracked
- Factory = who can make it
- User = who manages it
- UI = a live board showing where each material is in the process

## Final MVP Statement

This project is practical, based on a real workflow problem, and scoped clearly for MVP.

For MVP, the app should stay focused on:

- create materials
- assign factories
- update status
- view materials on a dashboard

Other features like full history, quotes, and purchase orders can be stretch goals after the core workflow is working.
