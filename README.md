# MoveWise Platform

PROMPT 01 — FOUNDATION + PREMIUM PRODUCT SHELL

Build the first substantial foundation of a new web platform for the moving industry.

This is NOT a generic moving-company website.

It is a premium two-sided marketplace and moving-operations platform where customers discover and hire moving providers, while providers manage their businesses, crews, vehicles and jobs.

The product should eventually feel like:

Uber's ease of discovery and live movement + Amazon's marketplace clarity + a premium modern web application + a friendly moving personality.

Do NOT copy the UI, branding, or visual identity of any existing company. We are borrowing proven interaction principles, not designs.

==================================================

1. PRODUCT VISION

==================================================

The platform connects:

- Customers who need moving services

- Moving companies and independent moving providers

- Moving crews

- Moving vehicles

- Moving jobs

The customer is the PRIMARY user.

The platform must feel immediately understandable to a normal person who simply wants to move their belongings.

The eventual customer journey is:

Customer needs to move

→ tells us what they need

→ discovers suitable movers

→ explores providers

→ compares them

→ requests/gets quotes

→ books

→ crew and vehicle are assigned

→ tracks the job

→ move is completed

→ reviews provider

Moving providers eventually:

- Create a provider/business profile

- Manage vehicles

- Manage crews

- Define services

- Manage availability

- Receive requests

- Submit quotes

- Accept jobs

- Assign crews and vehicles

- Manage active jobs

- Track performance

- Communicate with customers

- Publish provider updates

- Eventually recruit workers

The worker/job-opportunity marketplace is future functionality and must NOT be built now.

==================================================

2. CUSTOMER-FIRST UX

==================================================

The customer must be the obvious primary user.

DO NOT force visitors to choose:

"Customer"

or

"Company"

before they understand the product.

Do NOT create a confusing role-selection wall.

The primary experience should simply provide:

GET STARTED

and

FIND MOVERS

Moving companies should have a secondary but obvious entry:

FOR MOVING COMPANIES

The underlying authentication architecture must still support:

- Customer

- Provider

- Admin

Eventually one human account should be able to have both:

Personal / Customer

and

Business / Provider

contexts.

Do not expose this complexity unnecessarily during initial customer onboarding.

==================================================

3. FIRST EXPERIENCE

==================================================

Create a beautiful initial customer experience centered around:

"Where are you moving?"

The exact copy may be polished, but the interaction should be immediately understandable.

Provide:

Pickup location

Destination

Moving date

Then:

FIND MOVERS

Also provide a clear alternative:

EXPLORE MOVERS NEAR YOU

This should take the user into the map/discovery experience.

Do NOT force users through a long questionnaire before they can explore the platform.

We want:

GUIDED SEARCH

OR

EXPLORATION.

==================================================

4. APPLICATION SHELL

==================================================

Create the foundational responsive application shell.

Desktop:

- Premium top navigation

- Logo/brand

- Primary navigation

- Search/access controls

- Account area

- "For Moving Companies"

- Main content region

Mobile:

- Compact header

- Brand

- Account access

- Clean mobile navigation

- Responsive layouts

- Mobile-friendly search/map behavior

The shell must be reusable across future pages.

==================================================

5. CUSTOMER NAVIGATION

==================================================

Establish the customer navigation around:

- Home

- Find Movers

- My Move

- Messages

- Saved

- Profile

These can initially be placeholder destinations if the underlying functionality is not yet implemented.

Do NOT build fake complex functionality simply to fill navigation items.

==================================================

6. PROVIDER CONTEXT

==================================================

Establish the conceptual structure for the provider experience.

Providers will eventually have:

- Overview

- Jobs

- Calendar

- Fleet

- Crews

- Customers

- Messages

- Profile

The provider experience should feel like a professional business operating environment, while the customer experience feels like a beautiful consumer marketplace.

Do NOT build the complete provider dashboard yet.

Establish the routing/navigation structure and visual foundation.

==================================================

7. PREMIUM DESIGN DIRECTION

==================================================

The product MUST look:

- Premium

- Professional

- Expensive

- Carefully designed

- Modern

- Friendly

- Relaxing

- Approachable

"Expensive" does NOT mean black-and-gold luxury styling.

It means:

- Exceptional spacing

- Excellent typography

- Strong visual hierarchy

- Sophisticated cards

- Refined controls

- Beautiful interaction states

- Subtle depth

- Consistent iconography

- Thoughtful animation

- High-quality responsive design

- Excellent empty states

- Excellent loading states

- Excellent error states

- No sloppy alignment

- No generic template appearance

The user should feel:

"Someone put serious effort into making this."

Avoid:

- Generic SaaS templates

- Cheap-looking UI

- Excessive gradients

- Excessive shadows

- Visual clutter

- Random colors

- Poor typography

- Amateur layouts

==================================================

8. VISUAL PERSONALITY

==================================================

The platform should also have personality.

The 🚚 emoji is a conceptual reference for the personality.

Do NOT simply scatter emojis throughout the interface.

Instead, create a visual language inspired by:

- Moving trucks

- Boxes

- Movers

- Houses

- Furniture

- Routes

- Location pins

Illustrations should feel:

- Simple

- Clean

- Expressive

- Minimal

- Geometric

- Friendly

- Slightly playful

Think of the clever illustrative language used in polished educational products and high-quality application empty states.

Avoid:

- Generic corporate stock illustrations

- Overly childish cartoons

- Photorealistic 3D

- Excessively detailed illustrations

- Cheap-looking AI-generated graphics

The illustrations provide personality.

The interface provides premium credibility.

==================================================

9. COLOR

==================================================

Do NOT interpret "premium" as:

- Black + gold

- Metallic gradients

- Excessive dark mode

- Stereotypical luxury styling

Use a modern, calm, premium and approachable palette.

Keep color usage disciplined.

Use color primarily to communicate:

- Status

- Availability

- Actions

- Warnings

- Success

Do not decorate every component with unnecessary color.

==================================================

10. TYPOGRAPHY

==================================================

Use a carefully selected modern sans-serif type system.

Typography should feel:

- Modern

- Premium

- Extremely readable

- Spacious

- Confident

Establish a consistent hierarchy for:

- Display

- H1

- H2

- H3

- Body

- Small text

- Captions

- Labels

==================================================

11. REUSABLE COMPONENT SYSTEM

==================================================

Create reusable components for:

- Buttons

- Inputs

- Search fields

- Location fields

- Date selectors

- Cards

- Provider cards

- Vehicle cards

- Crew cards

- Status badges

- Ratings

- Tabs

- Navigation

- Modals

- Bottom sheets

- Dropdowns

- Tooltips

- Alerts

- Empty states

- Loading states

Do NOT create dozens of inconsistent one-off components.

Create a coherent design system that future prompts can extend.

==================================================

12. PROVIDER CARD

==================================================

Create the first reusable provider-card component.

It should support information such as:

ABC Movers

★ 4.9

1,284 completed moves

97% on-time

5/6 vehicles available

5/10 movers available

Services:

Moving · Packing · Assembly

Use realistic-looking mock data for the visual foundation, but structure the component so real backend data can replace it later.

==================================================

13. MAP EXPERIENCE

==================================================

The map is one of the signature parts of this product.

Create the foundation for a marketplace map experience inspired by the interaction philosophy of high-quality ride-hailing applications, but DO NOT copy Uber's UI.

The map should eventually:

- Show providers geographically

- Allow users to explore nearby providers

- Allow provider selection

- Smoothly focus/zoom to the selected provider

- Open provider information without destroying map context

- Allow users to move naturally between exploration and provider details

Desktop concept:

LEFT:

Search

Filters

Provider results

RIGHT:

Large map

Example:

Provider card:

ABC Movers

★ 4.9

1,284 moves

Map:

Provider markers

User location

Mobile:

- Map-first

- Floating search/filter controls

- Provider results in a draggable bottom sheet

- Touch-friendly interactions

Do not simply shrink the desktop interface for mobile.

==================================================

14. MAP MARKERS

==================================================

Where technically appropriate, establish custom provider map markers rather than relying entirely on generic default pins.

Markers should eventually support states such as:

- Available

- Limited availability

- Busy

Use our own visual language.

IMPORTANT:

Public users should NOT receive precise live locations of providers.

Public map = provider/service-area discovery.

Active Job = authorized live tracking.

==================================================

15. SEARCH

==================================================

Create the foundation for provider search.

A customer should eventually be able to search:

"ABC Movers"

and see relevant provider results.

When a provider is selected:

The map should focus/zoom to the provider's location

and the provider profile should open.

This behavior is part of the original product concept and must be preserved.

==================================================

16. PROVIDER PROFILE FOUNDATION

==================================================

Build the initial visual structure of the provider profile.

It must feel like a premium marketplace profile, NOT a directory listing.

Include the structure for:

HEADER:

- Logo

- Company name

- Verification

- Rating

- Completed moves

- Description

QUICK STATISTICS:

- Completed moves

- Rating

- On-time performance

- Response time

SERVICES

FLEET

Vehicle cards showing:

- Vehicle type

- Capacity

- Availability

CREWS

Crew availability/capacity

REVIEWS

UPDATES

SERVICE AREA

PRIMARY CTA:

REQUEST A MOVE

The primary CTA should remain accessible without forcing the customer to scroll to the bottom of the page.

==================================================

17. CRITICAL RESOURCE ARCHITECTURE

==================================================

Even though the complete operational system comes later, the architecture MUST respect this rule:

VEHICLES AND CREWS ARE INDEPENDENT RESOURCES.

Never assume:

Vehicle occupied = Crew occupied

or:

Crew occupied = Vehicle occupied.

A Job may assign:

Crew A

+

Vehicle 03

but each resource must have its own schedule and status.

Example:

Vehicle 03:

10:00–13:00 Job A

13:00 Available

Crew A:

10:00–15:00 Job A

15:00 Available

The future backend must support this.

Do not create UI or data assumptions that prevent it.

==================================================

18. AVAILABILITY ARCHITECTURE

==================================================

The future platform should determine availability from actual:

- Resource assignments

- Jobs

- Schedules

- Time windows

- Resource states

Do NOT design the system around providers manually toggling:

"Truck occupied"

or:

"Crew available"

as the primary source of truth.

The UI should eventually be capable of showing:

5 of 10 movers available

4 of 6 vehicles available

and more importantly:

Available for your requested date/time.

Do not fake real-time availability now.

Create components/data structures that can accept real availability later.

==================================================

19. JOB ARCHITECTURE

==================================================

The central operational entity is:

JOB

A Job must eventually support:

- Customer

- Pickup

- Destination

- Requirements

- Services

- Quotes

- Booking

- Multiple Trips

- Multiple Vehicles

- Multiple Crews

- Tasks

- Resource assignments

- Tracking

- Timeline

- Payment

- Review

DO NOT assume:

One Job = One Vehicle + One Crew.

A complex move might require:

Job 1001

Trip 1:

Truck A + Crew A

Trip 2:

Truck B + Crew B

Task:

Furniture assembly + Crew C

The architecture must remain compatible with this.

==================================================

20. CUSTOMER QUESTIONNAIRE FOUNDATION

==================================================

Prepare the UX/component architecture for a progressive move questionnaire.

Eventually it should be capable of asking:

LOCATION

- Pickup

- Destination

TIMING

- Date

- Time/window

MOVE TYPE

- Home

- Apartment

- Office

- Business

- Other

SIZE

- Studio

- 1 bedroom

- 2 bedroom

- 3 bedroom

- 4+

- House/villa

INVENTORY

- Furniture

- Appliances

- Boxes

- Special items

SERVICES

- Loading

- Transport

- Unloading

- Packing

- Unpacking

- Assembly

- Disassembly

ACCESS

- Stairs

- Elevator

- Parking restrictions

- Long carry

- Narrow access

- Special instructions

Do NOT build the complete questionnaire in this prompt.

Establish the design system/components needed for it.

==================================================

21. AUTHENTICATION FOUNDATION

==================================================

Establish the authentication architecture and route structure for:

CUSTOMER

Primary/default user.

PROVIDER

Secondary/business context.

ADMIN

Internal platform role.

The public UI should make the customer experience the obvious path.

Provider access should be discoverable through:

FOR MOVING COMPANIES

Do NOT create a confusing role-selection wall.

==================================================

22. ACCOUNT SWITCHING

==================================================

Design the architecture so one person can eventually have:

Personal / Customer

and

Business / Provider

contexts.

Example:

John

Personal

Customer

----------------

John's Moving Co.

Provider

Switch

This does not need to be fully implemented now.

The architecture simply must not make it impossible.

==================================================

23. DOMAIN MODEL

==================================================

Establish clean foundations for the following entities:

Account

Customer Profile

Provider

Provider Profile

Vehicle

Crew

Service

Job

Trip

Task

Resource Assignment

Quote

Booking

Location

Job Event

Review

Payment

Notification

Message

Future entities that should be architecturally possible but NOT built now:

Provider Update

Follow Relationship

Worker Profile

Job Opportunity

Application

Do not create unnecessary duplicate entities.

==================================================

24. JOB LIFECYCLE

==================================================

Prepare the architecture for a lifecycle such as:

Draft

↓

Requested

↓

Matching / Quote

↓

Quoted

↓

Accepted

↓

Booked

↓

Scheduled

↓

Resources Assigned

↓

Crew En Route

↓

Arrived

↓

Loading

↓

In Transit

↓

At Destination

↓

Unloading

↓

Completed

Also support appropriate alternative states such as:

- Cancelled

- Declined

- Expired

- Disputed

- Failed

Do not build the complete operational workflow yet.

Establish a maintainable state model.

==================================================

25. EVENT / TIMELINE FOUNDATION

==================================================

The system must eventually record important Job events with timestamps.

Examples:

- Request created

- Provider notified

- Provider responded

- Quote submitted

- Quote accepted

- Booking confirmed

- Crew assigned

- Vehicle assigned

- Crew departed

- Crew arrived

- Loading started

- Loading completed

- Trip started

- Destination reached

- Unloading started

- Unloading completed

- Job completed

This data will eventually allow calculation of:

- Response time

- Assignment time

- Arrival time

- Loading duration

- Travel duration

- Unloading duration

- Total Job duration

- On-time performance

Metrics must eventually come from actual platform events, not manually entered claims.

==================================================

26. LOCATION / TRACKING FOUNDATION

==================================================

The platform will eventually support Uber-like active Job tracking.

The architecture should allow:

- Resource current location

- Job location

- Pickup

- Destination

- Route

- Location updates

- Timestamped location events

Do NOT build complete live GPS tracking in this prompt.

Establish clean abstractions so it can be added later.

Public users must not automatically receive precise live locations of providers.

==================================================

27. PROVIDER PERFORMANCE

==================================================

Prepare the architecture for future metrics such as:

- Completed jobs

- Rating

- Customer satisfaction

- Completion rate

- Cancellation rate

- Response time

- On-time arrival

- Job duration

- Repeat customers

- Similar jobs completed

Do not fabricate metrics.

Future performance data must be traceable to real platform activity.

==================================================

28. SECURITY / PERMISSIONS

==================================================

Establish appropriate role-based access.

Customers must not be able to:

- Edit another customer's data

- Modify provider resources

- Access another provider's Jobs

- View unauthorized live locations

- Modify financial records

Providers must only be able to manage:

- Their provider profile

- Their vehicles

- Their crews

- Their services

- Their authorized Jobs

- Their authorized customer communications

- Their operational data

Admins have controlled elevated access.

Authorization must exist at the appropriate backend/data layer, not merely by hiding UI elements.

==================================================

29. DATA INTEGRITY

==================================================

Establish appropriate relationships, constraints and validation.

Examples:

- Vehicle belongs to a Provider.

- Crew belongs to a Provider.

- Resource Assignment references a valid resource.

- Resource schedules cannot create prohibited conflicts.

- Job belongs to a Customer.

- Booking references valid Job and Provider.

- Reviews relate to eligible completed Jobs.

- Providers cannot arbitrarily alter historical operational events.

- Completed Job events should remain auditable.

==================================================

30. RESPONSIVE DESIGN

==================================================

Build from the beginning for:

DESKTOP

- Large map experience

- Split-view marketplace

- Rich provider profiles

TABLET

- Adaptive layouts

MOBILE

- Map-first discovery

- Bottom sheets

- Touch-friendly controls

- Compact navigation

- Responsive provider profiles

- Responsive forms

Do NOT simply shrink desktop components.

==================================================

31. MICROINTERACTIONS

==================================================

Use subtle, deliberate motion:

- Hover transitions

- Card elevation

- Map selection animation

- Panel transitions

- Bottom-sheet movement

- Button feedback

- Loading animations

- Success transitions

Do NOT make everything bounce or animate.

Motion should feel premium and intentional.

==================================================

32. EMPTY / LOADING / ERROR STATES

==================================================

Establish reusable patterns for:

- No movers found

- No saved providers

- No upcoming Jobs

- No vehicles

- No crews

- Loading

- Error

- Successful completion

Use our simple, friendly moving illustration language where appropriate.

For example:

A small illustrated truck waiting for a job.

The illustration should support the message, not replace it.

==================================================

33. FUTURE FEATURES — DO NOT BUILD

==================================================

Do NOT spend this build on:

- Full booking

- Payment processing

- Full live GPS tracking

- Advanced matching algorithm

- Advanced pricing

- Worker marketplace

- Social feed

- Following

- Provider updates functionality

- AI move estimation

- Complex analytics

- Full admin system

However, do not architect the project in a way that makes these future capabilities unnecessarily difficult.

==================================================

34. BUILD PRIORITIES FOR THIS 10-CREDIT TASK

==================================================

Use the available implementation budget primarily on:

1. Strong application architecture

2. Authentication/identity foundation

3. Customer-first entry experience

4. Premium visual system

5. Reusable component system

6. Application shell

7. Initial customer homepage

8. Initial search/discovery experience

9. Initial map experience

10. Provider card

11. Provider profile foundation

12. Responsive behavior

13. Domain/data foundations

14. Vehicle/crew resource foundations

15. Job architecture

16. Availability architecture

17. Clean routing

18. Security/permissions foundation

19. Loading/error/empty states

20. Overall visual polish

Do not prioritize feature count over quality.

==================================================

35. QUALITY BAR

==================================================

The result should look like a serious, well-funded product.

It must NOT look like:

- A weekend prototype

- A generic AI-generated SaaS

- A template with our text pasted into it

- A directory

- A basic CRUD dashboard

Avoid:

- Inconsistent spacing

- Weak typography

- Random colors

- Poor mobile layouts

- Generic cards

- Unfinished-looking sections

- Excessive shadows

- Excessive gradients

- Default-looking controls

- Visually noisy screens

Inspect the application after implementation and fix obvious visual inconsistencies introduced during the build.

==================================================

36. ACCEPTANCE CRITERIA

==================================================

CUSTOMER EXPERIENCE

A new visitor immediately understands:

"This is a platform for finding and hiring movers."

There is an obvious path toward:

FIND MOVERS

without unnecessary role-selection friction.

PROVIDER EXPERIENCE

There is a clear:

FOR MOVING COMPANIES

entry.

DESIGN

The product feels:

- Premium

- Professional

- Expensive

- Friendly

- Relaxing

- Simple

- Polished

ARCHITECTURE

The project supports or establishes foundations for:

- Customer

- Provider

- Admin

- Vehicles

- Crews

- Jobs

- Trips

- Assignments

- Locations

- Events

RESOURCE MODEL

Crew and vehicle are independent concepts.

MAP

The initial discovery map exists and is structured to evolve into the full marketplace experience.

SEARCH

Provider search foundation exists.

PROFILE

Provider profile foundation exists.

RESPONSIVENESS

Desktop and mobile foundations work properly.

COMPONENTS

Reusable design components are used rather than repeated one-off implementations.

CODE QUALITY

Business logic is not unnecessarily buried inside presentation components.

==================================================

37. PRESERVE THE ORIGINAL PRODUCT

==================================================

Do NOT simplify this product into a generic directory of moving companies.

The heart of the product is:

Customer discovers

→ platform helps match

→ provider responds/quotes

→ customer books

→ crew and vehicle are assigned

→ job happens

→ customer can follow progress

→ job completes

→ performance is recorded

→ customer reviews provider

→ provider reputation grows

The platform is:

A MOVING MARKETPLACE

+

A MOVING OPERATIONS PLATFORM

It must be simple on the surface and sophisticated underneath.

==================================================

38. FINAL INSTRUCTION

==================================================

Treat this as:

FOUNDATION / PROMPT 01

This is intentionally a LARGE first build.

Use the available implementation budget to create a strong foundation and substantial initial product shell.

Do NOT rush into unrelated future features.

Do NOT silently change the product vision.

Do NOT remove important concepts because they are complex.

Where a feature is not yet being implemented, create the appropriate architectural/component foundation rather than fake functionality.

Before finishing:

1. Inspect the application visually.

2. Check desktop layouts.

3. Check mobile layouts.

4. Check navigation.

5. Check component consistency.

6. Check spacing and typography.

7. Check obvious responsive issues.

8. Check that customer-first UX is clear.

9. Check that provider entry is still discoverable.

10. Fix obvious issues introduced during this build.

At completion, provide a concise implementation report containing:

1. What was built.

2. What architecture was established.

3. What was intentionally left unbuilt.

4. Important assumptions made.

5. Technical decisions that should be reviewed before Prompt 02.

Do not proceed into Prompt 02 automatically.

Stop after completing Prompt 01.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d14c3b13-e7c6-45e8-9f50-182c8153bccc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
