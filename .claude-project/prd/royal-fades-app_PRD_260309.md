# royal-fades-app — Product Requirements Document

**Version:** 1.0
**Date:** 2023-10-27
**Status:** Draft

---

## 0. Project Overview

### Product

**Name:** royal-fades-app
**Type:** Web Application (Mobile-Responsive) & Admin Dashboard
**Deadline:** Q1 2024
**Status:** Draft

### Description

Royal Fades is a premier barbershop located in Houston, TX, currently employing 8 barbers. The `royal-fades-app` is a custom-built, end-to-end management solution designed to replace their current Vagaro system. It streamlines the client experience through a seamless booking and walk-in queue system while providing the shop owner with robust tools for commission tracking, analytics, and CRM.

### Goals

1.  **Optimize Shop Flow:** Transition from a purely appointment-based system to a hybrid model that efficiently manages both scheduled bookings and real-time walk-in queues.
2.  **Automate Financials:** Eliminate manual calculations by implementing automated commission tracking for 8+ barbers and integrated payment processing.
3.  **Enhance Client Retention:** Build a proprietary loyalty program and SMS notification system to reduce no-shows and increase lifetime value (LTV).

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | **Clients:** Local residents in Houston seeking high-quality grooming services with easy booking. |
| **Secondary** | **Barbers:** Professional staff needing to manage their schedules, view earnings, and track client history. |
| **Tertiary** | **Admin/Owner:** The shop owner managing operations, payroll, and marketing. |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Client** | `0` | Regular customers | Book appointments, join walk-in queue, track loyalty points. |
| **Barber** | `1` | Shop staff/Barbers | Manage personal calendar, view commission, check-in clients. |
| **Admin** | `99` | Shop Owner/Manager | Full system access, financial reports, staff management, settings. |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access to booking and profile features. |
| **Suspended** | `1` | Restricted from booking (usually due to repeated no-shows). |
| **Withdrawn** | `2` | Account deactivated; data anonymized after 30 days. |

### MVP Scope

**Included:**
- User Authentication (OTP/Email)
- Appointment Booking Engine
- Real-time Walk-in Queue Management
- SMS Reminders & Notifications
- Basic Loyalty Program (Points per visit)
- Barber Commission Tracking
- Admin Analytics Dashboard
- Stripe Payment Integration

**Excluded (deferred):**
- Inventory/Product Sales Management
- Multi-location Support
- Advanced AI-based demand forecasting

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **The Queue** | The real-time list of walk-in clients currently waiting at the shop. |
| **Service** | A specific grooming offering (e.g., Skin Fade, Beard Trim) with a set price and duration. |
| **Commission** | The percentage of a service price paid to the barber (e.g., 60/40 split). |
| **No-Show** | A client who misses a scheduled appointment without canceling. |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Can view the shop gallery, service list, and current wait times. |
| **Client** | Authenticated user who can book, pay, and join the queue. |
| **Barber** | Staff member who can see their specific schedule and client notes. |
| **Admin** | The owner who controls pricing, staff rosters, and views total revenue. |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **AppointmentStatus** | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NOSHOW` | Tracks the lifecycle of a booking. |
| **QueueStatus** | `WAITING`, `IN_CHAIR`, `FINISHED` | Tracks the physical presence of a walk-in client. |
| **PaymentStatus** | `UNPAID`, `PARTIAL`, `PAID`, `REFUNDED` | Status of the transaction in Stripe. |

---

## 2. System Modules

### Module 1 — Booking & Scheduling

Handles the logic for matching client requests with barber availability.

#### Main Features

1.  **Availability Engine** — Calculates open slots based on barber working hours and existing appointments.
2.  **Service Selection** — Dynamic pricing based on service complexity and duration.
3.  **Conflict Resolution** — Prevents double-booking and accounts for "buffer time" between cuts.

#### Technical Flow

##### Appointment Booking Flow

1.  User selects a **Service** and a **Barber**.
2.  App fetches available time slots from the backend (NestJS) for the selected date.
3.  User selects a slot and provides payment details (Stripe Pre-auth).
4.  On success:
    -   Appointment record created with status `CONFIRMED`.
    -   SMS notification triggered via Twilio.
    -   Calendar updated for the Barber.
5.  On failure:
    -   Show "Slot no longer available" if another user booked simultaneously.

---

### Module 2 — Walk-in Queue Management

A real-time system for clients who arrive without an appointment.

#### Main Features

1.  **Wait-time Estimator** — Calculates estimated wait based on current "In-Chair" status and average service time.
2.  **Digital Check-in** — Tablet-friendly interface for clients to join the list upon arrival.
3.  **Queue Dashboard** — Public-facing monitor view showing "Next Up."

#### Technical Flow

1.  Client enters name and phone number at the shop kiosk.
2.  System checks if the client is already in the CRM; if not, creates a guest profile.
3.  Client is added to the `Queue` table with status `WAITING`.
4.  On success: Client receives an SMS: "You are #3 in line. Estimated wait: 25 mins."
5.  Barber clicks "Start Service" → Status moves to `IN_CHAIR`.

---

### Module 3 — Commission & Analytics

The financial engine of the application.

#### Main Features

1.  **Automated Split Calculation** — Calculates Barber vs. House share for every completed transaction.
2.  **Payout Reports** — Weekly summaries for payroll processing.
3.  **Retention Analytics** — Tracks how often clients return to the same barber.

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React (Vite), React Router, Tailwind CSS, TanStack Query.

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Landing page, Service Menu, Gallery |
| Auth | Login (SMS OTP), Sign-up |
| Protected | Booking, Queue Join, Profile, Loyalty |

#### Page Map

**Public**
| Route | Page |
|-------|------|
| `/` | Home / Landing Page |
| `/services` | Service Menu & Pricing |
| `/barbers` | Barber Profiles & Portfolios |

**Auth**
| Route | Page |
|-------|------|
| `/login` | SMS OTP Login |
| `/register` | Profile Setup |

**Protected**
| Route | Page |
|-------|------|
| `/book` | Booking Wizard (Step-by-step) |
| `/queue` | Join Walk-in Queue |
| `/my-appointments` | Upcoming & Past Cuts |
| `/loyalty` | Rewards & Points Balance |
| `/profile` | User Settings |

---

### 3.2 Feature List by Page

#### `/` — Home
- **Live Wait Time:** Real-time display of current walk-in wait.
- **CTA Buttons:** "Book Appointment" and "Join Queue."
- **Shop Info:** Address (Houston, TX), Hours, and Instagram feed integration.

#### `/book` — Booking Wizard
- **Barber Selection:** Filter by "First Available" or specific barber.
- **Service Selection:** Multi-select services (e.g., Haircut + Beard).
- **Calendar:** Date picker with real-time slot availability.
- **Payment:** Stripe Elements integration for deposit or full payment.

#### `/queue` — Join Walk-in Queue
- **Position Tracker:** Shows how many people are ahead.
- **Barber Preference:** Option to wait for a specific barber or take the next available.
- **SMS Opt-in:** Checkbox to receive "You're next" alerts.

#### `/loyalty` — Rewards
- **Progress Bar:** "3 more cuts until a free Beard Trim."
- **Point History:** List of points earned per visit.
- **Redeemable Items:** List of services that can be bought with points.

---

## 4. Admin Dashboard

### 4.1 Page Architecture

**Access:** Admin or Barber role (Barbers see restricted views).

| Route | Page |
|-------|------|
| `/admin` | Overview Dashboard |
| `/admin/calendar` | Master Shop Calendar |
| `/admin/queue` | Queue Management Console |
| `/admin/clients` | CRM / Client List |
| `/admin/staff` | Barber Management & Commission |
| `/admin/reports` | Financial & Analytics Reports |
| `/admin/settings` | Shop Configuration |

---

### 4.2 Feature List by Page

#### `/admin` — Overview Dashboard
- **Daily Stats:** Total revenue today, number of cuts, top-performing barber.
- **Active Queue:** Mini-view of who is currently in the shop.
- **Alerts:** Low inventory (if added) or high no-show alerts.

#### `/admin/calendar` — Master Calendar
- **Drag-and-Drop:** Move appointments between barbers or times.
- **Color Coding:** Different colors for different service types.
- **Quick-Add:** Click any empty slot to manually add a client.

#### `/admin/queue` — Queue Management
- **Manual Sort:** Admin can bump VIPs or adjust order if needed.
- **Status Toggle:** Buttons to move clients from "Waiting" to "In-Chair" to "Done."
- **No-Show Trigger:** Remove client from queue and trigger "We missed you" SMS.

#### `/admin/staff` — Staff & Commission
- **Commission Profiles:** Set individual splits (e.g., Senior Barber 70%, Junior 50%).
- **Performance Metrics:** Average cut time, re-booking rate, total tips.
- **Schedule Manager:** Set weekly shifts and time-off requests.

---

## 5. Tech Stack

### Architecture

The system follows a modern decoupled architecture with a centralized API and specialized frontends.

```
royal-fades-app/
├── backend/       ← NestJS API (Node.js)
├── frontend-user/ ← React (Vite) Mobile-responsive app
└── frontend-admin/← React (Vite) Desktop-optimized dashboard
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | Scalable API Architecture |
| Language | TypeScript | 5.x | Type safety across stack |
| ORM | TypeORM | 0.3.x | Database mapping & migrations |
| Database | PostgreSQL | 15.x | Relational data (Users, Bookings) |
| Frontend | React | 18.x | UI Library |
| Styling | Tailwind CSS | 3.x | Utility-first styling |
| State | TanStack Query | 5.x | Server state management |
| Real-time | Socket.io | 4.x | Live queue updates |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Stripe** | Payment processing, deposits, and barber payouts. |
| **Twilio** | SMS notifications for reminders and queue alerts. |
| **Google Calendar API** | Syncing barber schedules to their personal phones. |
| **AWS S3** | Storing barber portfolio images and client profile photos. |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **PostgreSQL** | Required for complex relational queries involving commissions and scheduling. |
| **Socket.io** | Essential for the "Live Queue" so clients see their position update without refreshing. |
| **SMS-first Auth** | Barbershop clients prefer quick phone-number logins over remembering passwords. |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | **Vagaro Migration?** | Do we need to import historical client data and notes from Vagaro? | Client | ⏳ Open |
| 2 | **Deposit Policy?** | Will all appointments require a $10-20 deposit to prevent no-shows? | Client | ⏳ Open |
| 3 | **Hardware?** | Will the shop provide a dedicated iPad/Tablet for the walk-in kiosk? | Client | ⏳ Open |
| 4 | **Tax Logic?** | Should the system calculate Houston/Texas sales tax on top of service prices? | Client | ⏳ Open |