# LukiSourcing

## 30-Second Elevator Pitch

LukiSourcing is a sourcing workflow platform for fashion teams that need a clearer way to track raw materials from first request to final delivery. Inspired by the structured flow of restaurant reservation and floor-management tools, this app reimagines that same live-status experience for fabrics, trims, dyes, hardware, and supplier communication.

Instead of tracking sourcing across scattered emails, spreadsheets, chat threads, and PDFs, LukiSourcing gives brands and sourcing teams one place to follow each material through its lifecycle: requested, quoted, sampled, approved, ordered, in transit, received, and ready for production.

## Project Vision

Fashion sourcing is often slowed down by fragmented communication and poor visibility. A designer may request a fabric, a supplier may send swatches days later, production may ask for cost confirmation, and logistics may need delivery updates, all in separate tools.

LukiSourcing centralizes that workflow into a dashboard-driven application where each material has a clear status, timeline, owner, supplier history, and action trail.

LukiSourcing is designed to make those answers visible in real time.

Core Structure of the App
1. Material (Main Entity)
Central object in the system
Stores all info about a fabric/trim (name, category, cost, status, ETA)
Everything in the app revolves around materials
2. Users
People using the app (designer, sourcing manager, etc.)
Can:
Create materials
Update status
Add notes / track progress
Linked to actions (who updated what)
3. Factories (Suppliers)
External partners producing materials
Store info like:
Name, contact, country, lead time
One factory can work with many materials
How They’re Linked
Material ↔ Factory
Many-to-many relationship
A material can have multiple factories (quotes/options)
A factory can supply multiple materials
Material ↔ User
Users interact with materials
Each update (status, notes) is tied to a user
How It’s Displayed in the App
Main View = Materials Dashboard
Each material = a card or row
Shows:
Status (requested → sampling → approved → etc.)
Factory info
ETA
Board View (like Trello / restaurant app)
Columns = status stages
Materials move across stages visually
Detail View (click a material)
Full material info
Linked factories + quotes
Activity log (user updates)
Simple Mental Model
Material = the “thing being tracked”
Factory = who can make it
User = who manages it
UI = a live board showing where each material is in the process

If you want, I can map this directly to your database tables + API routes next (super useful for your project).

## Core Problem

Teams need a way to answer questions like:

- Which raw materials are still waiting on supplier quotes?
- Which trims have already been approved for sampling?
- What materials are delayed in transit?
- Which purchase orders are incomplete?
- What is the ETA for fabric needed for the next production run?