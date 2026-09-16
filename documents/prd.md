# Product Requirements Document (PRD)
## Project: Winner Court — Smart Badminton Booking & Social Gang Platform

- **Status**: Ready for Implementation (Production Design Complete)
- **Target Platform**: LINE LIFF (Lightweight Mobile Web App) & Responsive Web
- **Design System**: Honey Oat & Navy Court (Deep Navy `#1d2d44`, Warm Oatmeal `#fbf9f5`, Oat Accent `#d8cbb5`, Court Green `#2e7d32`, Alert Orange `#e65100`)
- **Primary Audience**: Badminton Court Owners (B2B SaaS / White-label) & Gang Organizers / Players (B2C / LINE-based)

---

## 1. Executive Summary & Vision

### 1.1 The Problem
In Thailand, the amateur badminton ecosystem heavily relies on informal communication via LINE groups. This creates major friction points:
1. **Disjointed Booking**: Court booking often requires phone calls or chatting with admin staff who manually check whiteboards or Excel sheets.
2. **Payment & Split Bill Nightmare**: The gang organizer pays upfront, then spends hours tracking bank transfer slips in group chats, checking who paid and who didn't.
3. **Court Lighting Wastage & Overhead**: Court owners keep lighting on manually, resulting in electricity waste during idle periods or early departures.
4. **Disengaged Players**: Scores are lost after each match, match tracking is nonexistent, and player rivalries/stats vanish into thin air.

### 1.2 The Solution
**Winner Court** is an integrated end-to-end platform bridging court management, IoT smart lighting, payment tracking, and social gamification directly inside the LINE messaging ecosystem. Gang leaders and players never have to leave LINE to book, split bills, check in, score matches, or brag about victories.

---

## 2. User Personas & Target Audiences

| Persona | Role & Habits | Key Pain Points | Platform Needs |
|---|---|---|---|
| **Ken (Gang Leader / Organizer)** | 28-year-old tech-savvy professional; organizes weekly Friday night badminton sessions for 6–10 friends. | Spends 30+ mins chasing friends for 120 THB each; manually booking slots; calculating court vs. shuttlecock fees. | Fast slot booking, 1-click PromptPay split bill, automated slip verification in LINE group. |
| **Mind (Competitive Player / Challenger)** | 26-year-old recreational player; plays singles/doubles; loves friendly rivalry and boba milk tea wagers. | Forgets past game scores; loves tracking smash speed, head-to-head stats, and rematches. | Live interactive scoreboard, digital match history, LINE Flex post-match cards, scouting reports. |
| **Owner Somchai (Court Facility Owner)** | 52-year-old court operator managing 12 courts in Bangkok. | High electricity bills from lights left on; front-desk bottlenecks; manual slot scheduling errors. | Smart IoT QR check-in to auto-switch court lights, automated payment confirmation, occupancy optimization. |

---

## 3. Brand Identity & Design System

- **Design System Name**: Honey Oat & Navy Court
- **Visual Personality**: Premium athletic, cozy, clean, and welcoming. Avoids cold clinical software feel while maintaining sharp sports contrast.
- **Key Brand Mascot**: **"Phi Kapi" (Capybara Mascot)** — Calm, unbothered, and sporty, wearing a navy scarf and holding a racket.
  - *Pose 1 (Idle/Neutral)*: Sitting calmly holding racket (Empty states, default headers).
  - *Pose 2 (Cheering/Victory)*: Racket raised high, smiling (Booking success, match winner).
  - *Pose 3 (Sleeping)*: Shuttlecock on back (Court fully booked, closed hours).
  - *Pose 4 (Avatar/Icon)*: 24px micro-badge face (Line chat stickers, badges).
- **Color Tokens**:
  - `brand-navy`: `#1d2d44` (Primary headers, high-contrast actions, text dominance)
  - `brand-oat-bg`: `#fbf9f5` (Warm, comforting background)
  - `brand-oat-card`: `#ffffff` & `#f5f3ef` (Card containers, subtle borders)
  - `court-green`: `#2e7d32` / `#10b981` (Verified, lights active, open slots)
  - `boba-amber`: `#d97706` / `#f59e0b` (Wagers, notifications, match highlights)
- **Typography**: Prompt & Noto Sans Thai / DM Sans (Optimized for Thai legibility and mobile scanability).

---

## 4. Feature Modules & Detailed Requirements

### Module 1: Court Booking & Schedule Grid
- **Interactive Time Slot Grid**:
  - Displays courts (Court 1–12) against 1-hour time blocks (17:00–23:00).
  - Multi-hour selection (e.g., 2 consecutive hours 19:00–21:00) with dynamic price calculation (e.g., 260 THB/hr).
  - Status indicators: Available (Oat border), Selected (Deep Navy fill + Checkmark), Booked (Disabled Gray).
- **Alternate Day Recommendation Engine**:
  - When a chosen date is 100% full, triggers Capybara Pose 3 (Sleeping) and auto-suggests the next available adjacent slots.
- **Court Profile & Amenities**:
  - High-res photo gallery (mat type: BWF-certified rubber mats, lighting lux rating, AC lounge).
  - Facility badges: Parking (50+ cars), Racket stringing service, Hot showers, Cafe & Boba counter.
  - Map & directions with direct Google Maps integration.

### Module 2: Checkout, Payment & Instant Confirmation
- **Booking Review & Policy Enforcement**:
  - Itemized breakdown: Court fee, racket rentals, advance shuttlecock tubes.
  - Cancellation policy notice (Free cancellation up to 4 hours prior).
- **PromptPay QR Engine**:
  - Dynamic PromptPay QR generation with unique checksum and 10-minute expiry countdown timer.
  - Automated payment webhook listener (SCB / KBank Open API / Thai QR standard).
- **Confirmation Screen**:
  - Generates booking booking reference ID (`#WC-202410-B84`).
  - Capybara Pose 2 celebration visual.
  - Primary CTA: **"แชร์เข้ากลุ่ม LINE ทันที"** (Direct LINE Flex Message sharing).

### Module 3: Gang Split Bill & Slip Verification (Social FinTech)
- **Organizer Bill Setup**:
  - Automatically imports booking total.
  - Allows adding extra expenses (e.g., 3 tubes of RSL Silver = 1,140 THB).
  - Custom headcount selector (e.g., 6 players = 120 THB/person).
  - Input organizer's PromptPay phone/account.
- **LINE Flex Message Bubble (Bill Card)**:
  - Sent directly to the gang chat with live paid/unpaid progress bar.
  - Embedded button: **"แจ้งโอนเงิน (Pay My Share)"** opens LIFF modal for members.
- **Member Payment & AI Slip OCR**:
  - Member selects their name, views PromptPay QR or copies account number.
  - Uploads mobile banking slip image.
  - AI Slip Verification validates transaction reference, recipient account, and amount.
  - Real-time status update: Instantly turns member's badge to Green (Paid).
- **Bill Closing & Settlement**:
  - When 100% collected, sends an automated celebratory Flex message into the LINE group.

### Module 4: Smart IoT Court Check-In & Lighting Automation
- **Digital Pass & High-Contrast QR Code**:
  - Pass available under "My Bookings" 15 minutes before the session starts.
  - Full-screen high-brightness mode with inverted contrast for rapid scanner read.
- **Hardware Integration (Pole Scanner)**:
  - Hardware pole scanner at Court 4 reads the secure dynamic QR.
  - Triggers relay controller via MQTT/HTTP webhook to activate 500-lux court lighting.
- **Instant Visual Feedback**:
  - Mobile app triggers haptic feedback and displays **"Court 4 Light Turned ON"**.
  - Starts 60-minute match countdown timer with 5-minute pre-turnoff warning chime.

### Module 5: Live Match Scoreboard & Real-Time Sync
- **Touch-Optimized Digital Scoreboard**:
  - Designed for high visibility while standing court-side (390px mobile or court tablet).
  - Large tap targets for Player A / Player B point increments.
  - Built-in Badminton Rules: 21-point standard or 30-point single-set duel, automated Deuce detection, service court side indicators (Right = Even, Left = Odd).
  - Undo button for accidental tap correction.
- **Live Stream to LINE**:
  - Broadcasts score updates into LINE group via lightweight Flex messages without refreshing the chat.

### Module 6: Match Insights, Analytics & Gamification
- **Post-Match Victory Screen**:
  - Highlights winner photo, match duration (e.g., 52 mins), final score (30 : 28 Deuce x2).
  - Wager resolution card: e.g., 🧋 Boba milk tea settlement status.
- **Point Flow & Momentum Graph**:
  - 58-point interactive timeline tracking lead changes and momentum shifts.
  - "Rally of the Match" marker (e.g., 38 shots in deuce point).
- **Coach Capybara Tactical Insights (AI Summary)**:
  - Natural-language breakdown of match tactics (e.g., "Ken controlled backcourt errors, forcing unforced drop mistakes at 28-28").
- **Detailed Head-to-Head Statistics**:
  - Smash Winners count & Peak Smash Speed (km/h).
  - Net Drops point ratio.
  - Unforced Error tally.

### Module 7: Duel Lobby, Rematches & Leaderboards
- **Duel Challenge System**:
  - Create formal challenge sheets (Singles 30 points, loser pays court + boba).
  - Send challenge cards directly to LINE groups.
  - Target player can click "Accept Challenge", locking both schedules into calendar.
- **Rematch Flow ("ท้าล้างตา")**:
  - From the match summary screen, loser can trigger an instant 1-tap Rematch Challenge.
- **Gang Leaderboard**:
  - Tiered ranking system (Smash Master, Net Magician, Consistent Wall).
  - Win/Loss records, Win Rate %, EXP and Level progression.
  - Weekly leaderboard Flex summaries pushed automatically every Sunday night.

---

## 5. Information Architecture & Screen Catalog (Delivered)

The complete UI system encompasses 29+ high-fidelity production screens across 7 categories:

```
Winner Court Platform
├── 0. Design System & Components
│   ├── Component Sheet (Honey Oat & Navy Court) (Screen 59)
│   └── Mascot Capybara Vector Suite (Images 60-63)
├── 1. Booking Flow
│   ├── Booking Grid: Default State (Screen 58)
│   ├── Booking Grid: 2-Hour Selection (Screen 56)
│   ├── Booking Grid: Fully Booked & Alternative (Screen 57)
│   ├── Court Profile & Amenities: Winner Court (Screen 52)
│   ├── Booking Confirmation Sheet (Screen 50)
│   ├── PromptPay QR Checkout (Screen 51)
│   └── Booking Success Screen (Screen 49)
├── 2. Booking Management
│   ├── My Bookings: Active & History (Screen 48)
│   └── My Bookings: Empty State (Screen 47)
├── 3. Gang Split Bill
│   ├── Split Bill Calculator & Settings (Screen 46)
│   ├── LINE Flex Preview: Bill Request Card (Screen 45)
│   ├── Member Slip Upload & Verification (Screen 44)
│   ├── Gang Settlement Complete 100% (Screen 43)
│   └── LINE Flex Preview: 100% Paid Closed Card (Screen 42)
├── 4. Smart IoT Check-in
│   ├── Check-in Pass & QR Code (Screen 41)
│   ├── Full-Screen Court 4 Light QR Pass (Screen 15)
│   ├── Court Light Turned ON Feedback (Screens 14, 40)
│   └── Pre-Match 30-Min Notification (Screen 16)
├── 5. Match Scoring & Summary
│   ├── Court 4 Live Scoreboard (Screens 12, 39)
│   ├── LINE Flex Preview: Live Score (Screen 38)
│   ├── Post-match Victory Summary: Ken vs Mind (Screens 9, 37)
│   └── LINE Flex Preview: Victory Flex Message (Screens 7, 36)
└── 6. Stats, Community & Match Challenges
    ├── Match Insights & 58-Point Replay (Screens 5, 35)
    ├── LINE Flex Preview: Match Insights Flex (Screens 3, 54, 56)
    ├── Player Profile & Career Stats: Ken (Screen 34)
    ├── LINE Flex Preview: Player Card (Screen 33)
    ├── Gang Leaderboard & Ranking (Screen 32)
    ├── LINE Flex Preview: Weekly Leaderboard (Screen 30)
    ├── Match Challenge Sheet (Screen 29)
    ├── LINE Flex Preview: Match Challenge Card (Screen 28)
    ├── Duel Accepted & Locked Screen (Screen 27)
    ├── LINE Flex Preview: Duel Accepted Card (Screen 26)
    ├── Duel Lobby & Match Center (Screen 25)
    ├── Past Duels History (Screen 24)
    ├── Rematch Challenge Sheet (Screen 22)
    ├── LINE Flex Preview: Rematch Challenge Card (Screen 21)
    ├── Rematch Accepted Screen (Screen 19)
    └── LINE Flex Preview: Rematch Accepted Card (Screen 18)
```

---

## 6. Technical & Implementation Architecture

### 6.1 Frontend Stack Recommendation
- **Framework**: Next.js 14 (App Router) or Vite + React
- **Styling**: Tailwind CSS v3.4 (Pre-mapped to design system tokens)
- **Integration Layer**: LINE LIFF SDK v2.22+
- **Animation**: CSS Keyframes + Framer Motion (Smooth sheet transitions & score increments)

### 6.2 Backend & Cloud Infrastructure
- **API Runtime**: Node.js (TypeScript) on AWS Lambda / Google Cloud Run
- **Database**: PostgreSQL (Prisma ORM) for relational booking & match logs; Redis for real-time live score websockets
- **Messaging**: LINE Messaging API (Flex Message JSON templates via Push & Reply API)
- **IoT Protocol**: MQTT Broker (AWS IoT Core) talking to ESP32 / Raspberry Pi relay controllers at court lighting poles
- **Slip Verification**: Thai QR Bank Slip OCR via Open API / Webhooks

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

1. **Booking Conversion Rate**: > 80% from grid selection to paid booking within 3 minutes.
2. **Split Bill Completion Speed**: 100% payment collected across gang members in < 2 hours from link dispatch.
3. **Check-in Latency**: QR scan to pole light activation < 1.2 seconds.
4. **Social Sharing Virality**: > 65% of completed matches share either Victory Flex or Insights Flex into LINE groups.
5. **Electricity Optimization for Venue**: 15–22% reduction in monthly lighting energy costs through automated idle shutoff.
