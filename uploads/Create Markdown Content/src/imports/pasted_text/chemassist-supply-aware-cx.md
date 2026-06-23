Dow ChemAssist: Supply-Aware Customer Experience
Subtitle:
From product search to governed customer orchestration.
One-line demo promise:
A customer asks for an automotive elastomer sample. ChemAssist turns the intent into a guided product recommendation, checks compliance, understands supply-chain risk from a naphtha price spike, routes the sample request through PAC, and keeps the customer informed through a single explainable timeline.
Internal architecture line:
Customer intent flows through ChemAssist, RegRadar, PAC, and the Supply Chain Agentic Spine.
External customer line:
The customer sees a clear, guided, trustworthy experience — not the back-office complexity.
2. What the Current Dow CX Is Doing Wrong
Your screenshots show the current state clearly:
Search is doing too much work.
The user types things like “what product to make dashboard in the car” or “I need rubber to make running shoes,” and the system returns a huge, generic list. This is not intent understanding. It is keyword retrieval.
Product discovery is separated from application reasoning.
The customer has to know product names, markets, submarkets, applications, SDS links, sample rules, and buying options before the system helps them.
Sample request is a form, not a guided workflow.
The sample cart asks for details but does not explain why they matter, how they affect eligibility, what happens next, or whether supply risk exists.
Registration interrupts value.
The customer is asked to create an account/password as a separate hurdle rather than as a progressive trust step when account-specific capabilities are needed.
Case creation is invisible.
A confirmation email creates a case number, but the customer does not get a living timeline, expert routing visibility, status, evidence, or next-best action.
AI search is disclaimed as unreliable.
The beta AI banner warns that results may be incomplete or outdated. That undermines trust instead of showing grounding, citations, confidence, and policy scope.
Supply chain is absent from CX.
The customer experience does not know whether a feedstock shock, plant constraint, regional inventory issue, or trade policy should affect the sample promise.
Feedback does not become system improvement.
Ratings, failed searches, abandoned carts, escalations, and customer objections are not visibly feeding the BRD, ontology, PAC rules, or agent behavior.
3. Target Experience Concept
Replace this:
Search → Product list → Product page → Sample cart → Form → Confirmation email → Case number
With this:
Intent → Guided application profile → Product recommendation → Compliance and supply check → Smart sample plan → Policy-gated submission → Living timeline → Expert escalation if needed → Feedback-to-BRD loop
This aligns with the reimagined O2C principle from the provided document: shift from fragmented ERP transaction chains and reactive exceptions into an intelligent, event-driven revenue execution platform.
Dema.ai is a useful design reference not because Dow should look like an e-commerce analytics startup, but because Dema’s model is “all commerce data connected to one AI Agent,” unifying orders, inventory, customers, and sales into a commerce-native data model. For Dow, the equivalent is: all customer, product, regulatory, sample, supply, and policy data connected to one governed agentic spine.
4. Primary Demo Scenario
Scenario Title
Supply-Aware Sample Request for ENGAGE™ Polyolefin Elastomers
Customer
A technical buyer or materials engineer at an automotive Tier 1 supplier in Germany.
Customer Intent
“I need a material for an automotive dashboard or interior soft-touch component that can handle cold-weather performance and be sampled quickly.”
Product Context
Dow’s elastomer materials are used in automotive TPO compounds, including hard and soft TPO applications for interiors and exteriors. The Dow elastomers guide specifically references automotive TPO uses, material selection, performance criteria, low-temperature ductility, melt index, density, and ENGAGE™ polyolefin elastomers.
Back-End Event
A market feed detects:
A 10% naphtha price spike in two hours affecting the feedstock economics for a European cracker.
Agentic Spine Response
Anomaly Agent detects the naphtha price spike.
Cost Agent recomputes cost-to-serve and margin exposure.
Inventory Agent evaluates sample and stock positioning options.
Demand Agent scores risk by SKU, region, and customer.
PAC checks Finance, trade, plant SOP, product, regulatory, and customer covenants.
Planner reviews the evidence and approves or overrides.
Customer-facing CX receives a sanitized supply-aware status.
Customer-Facing Translation
The customer should not see “naphtha spike,” “margin floor,” “European cracker,” or “Finance rule breach.”
They see:
“Supply conditions changed for one recommended grade. Your sample request is still eligible, but the estimated fulfillment window changed. ChemAssist found an equivalent candidate with stronger availability for your region.”
This is the demo magic: the customer experience becomes downstream-aware without exposing internal operating logic.
5. Figma Prototype Structure
Create a Figma file with these pages:
Demo Storyboard
Customer Portal Prototype
Agentic Timeline Components
Policy & Explainability Components
Feedback-to-BRD Loop
Backtesting / Shadow Mode Lab
Design System Components
6. Required Screens for the Customer Experience Demo
Screen 1 — Dow Home / Intent Entry
Purpose
Replace generic search with an intent-aware ChemAssist entry point.
Layout
Top navigation remains Dow-branded:
Dow logo
Applications
Products
Sustainability
Support
Language / region
Account
Cart
Hero section:
Headline:
“What are you trying to make?”
Subhead:
“Describe your application. ChemAssist will recommend products, check compliance, and guide next steps.”
Large intent input:
“I need a material for an automotive dashboard that performs in cold weather.”
Suggested chips:
Automotive interior
TPO compound
Cold-weather impact
Request sample
Compare grades
Check compliance
Right-side panel:
ChemAssist can help with:
Product selection
Application fit
Regulatory checks
Sample request
Availability guidance
Expert escalation
Agent Behavior
On submit:
ChemAssist parses intent.
Product ontology maps “dashboard” to “automotive interior / instrument panel / soft-touch TPO.”
RegRadar checks jurisdiction assumptions.
Supply agent checks if supply-aware guidance is available.
PAC checks whether the answer can be customer-facing.
Interaction
Clicking submit moves to Screen 2.
Screen 2 — Guided Application Profile
Purpose
Turn vague intent into structured requirements without making the customer fill a long form.
Layout
Left: conversational ChemAssist thread.
ChemAssist says:
“I can help. To recommend the right Dow elastomer, I need to understand the application, region, performance needs, and sample goal.”
Center: progressive profile cards.
Cards:
Application
Automotive interior
Instrument panel / dashboard
TPO compound
Performance Needs
Low-temperature impact
Soft-touch / appearance
Processing efficiency
Lightweighting
Region
Germany / EU
Next Step
Compare products
Request sample
Ask technical expert
Right: “Why this matters” drawer.
Example:
“Region affects regulatory documentation, sample routing, and availability. Application affects product fit and technical guidance.”
Policy / Explainability
Small chips under the profile:
Customer-facing answer allowed
EU region detected
Formal certification not requested
Account-specific data not yet unlocked
Interaction
Customer confirms profile. Move to Screen 3.
Screen 3 — Ranked Product Recommendations
Purpose
Replace search results with a product decision experience.
Layout
Header:
Recommended Dow Elastomers for your application
Subhead:
“Ranked by technical fit, documented application relevance, compliance readiness, and sample pathway.”
Product recommendation cards:
Card 1
ENGAGE™ 8180 Polyolefin Elastomer
Fit score: High
Best for: Low-temperature impact and TPO compound modification
Sample status: Eligible
Supply status: Watch condition
Compliance: EU documents available
Next action: Add to sample plan
Card 2
ENGAGE™ 8003 Polyolefin Elastomer
Fit score: Medium-high
Best for: General TPO compound performance
Sample status: Eligible
Supply status: Strong availability
Compliance: EU documents available
Next action: Compare
Card 3
ENGAGE™ XLT 8677 Polyolefin Elastomer
Fit score: High technical performance
Sample status: Expert review suggested
Reason: Specialized performance profile
Next action: Ask Technical Service
Each card includes:
“Why recommended”
“Evidence”
“Compare”
“Request sample”
“Ask expert”
Data shown
Do not show internal feedstock economics. Show customer-safe supply language only.
Evidence Drawer
Clicking evidence opens:
Product guide citation
Application mapping
Property relevance
Document version
Confidence
Limitations
Interaction
Customer clicks “Compare ENGAGE™ 8180 and ENGAGE™ 8003.”
Screen 4 — Product Comparison With Explainability
Purpose
Show how ChemAssist explains recommendations.
Layout
Comparison table:
Attribute	ENGAGE™ 8180	ENGAGE™ 8003
Application fit	High	Medium-high
TPO relevance	Strong	Strong
Low-temp performance evidence	Stronger	Moderate
Sample eligibility	Yes	Yes
Regional documentation	Available	Available
Supply confidence	Medium	High
Expert review needed	Optional	No
Below the table:
ChemAssist recommendation
“For cold-weather automotive interior TPO evaluation, start with ENGAGE™ 8180. Add ENGAGE™ 8003 as a comparison sample because it has stronger current sample availability for your region.”
Right rail:
How this recommendation was made
Product ontology matched your application
Technical guide checked
EU region applied
Sample eligibility checked
Supply signal checked
PAC reviewed customer-facing response
Interaction
Customer clicks “Build sample plan.”
Screen 5 — Smart Sample Plan
Purpose
Replace sample cart with an intelligent plan.
Layout
Title:
Sample Plan: Automotive Interior TPO Evaluation
Left side:
Products selected:
ENGAGE™ 8180 POE — 1 kg
ENGAGE™ 8003 POE — 1 kg
Middle:
Sample purpose:
Qualification trial
Comparative evaluation
Application: automotive dashboard / interior TPO
Right:
Readiness panel:
Product documentation: Ready
SDS: Ready
EU shipping: Needs address confirmation
Sample eligibility: Allowed
Supply signal: One grade under watch
Expert review: Optional
Important UX detail
Instead of “cart,” call it Sample Plan. Cart language feels transactional; sample plan feels collaborative and technical.
PAC Check Banner
“ChemAssist is checking sample eligibility, shipping rules, customer permissions, and documentation requirements.”
Result:
“Your sample request can proceed. One item has a supply watch condition, but an alternate grade is available.”
Interaction
Customer clicks “Continue.”
Screen 6 — Progressive Account Step
Purpose
Replace registration friction with a trust-based unlock.
Layout
Title:
Save and submit your sample plan
Message:
“We need a verified business email and shipping region to submit this sample request. This lets Dow apply the correct product, compliance, and sample policies.”
Options:
Continue with business email
Sign in
Continue as guest with limited status visibility
Fields:
Business email
Company
Country
Role
Application purpose
Trust explanation:
“Account details are used to verify sample eligibility, route expert support, and apply regional documentation rules.”
Interaction
Customer enters details and continues.
Policy note
If the customer is unauthenticated, the system can answer general product questions but cannot expose account-specific availability, pricing, order history, or customer-specific commitments. This aligns with the BRD requirement for account-specific answers only after authentication and authorization.
Screen 7 — Policy-Gated Review Before Submission
Purpose
Show the customer that Dow is not just collecting a form; it is checking the request.
Layout
Title:
Review sample request
Sections:
Recipient
Application
Products
Required documents
Eligibility checks
Estimated fulfillment path
Policy check module:
Sample purpose: allowed
Commercial use: allowed
Region: EU
Product documentation: available
SDS: available
Trade restriction: clear
Shipping rule: clear
Supply watch: one item
Human review: not required
Each item has a “Why?” link.
Customer-safe explanation
For supply watch:
“One requested sample has a current fulfillment watch due to supply conditions. This does not block your request. ChemAssist included an alternate grade to help avoid evaluation delay.”
Interaction
Customer clicks “Submit sample request.”
Screen 8 — Confirmation With Living Timeline
Purpose
Replace static confirmation email with a living customer case.
Layout
Title:
Sample request submitted
Subtitle:
“Your request is now being orchestrated across product, compliance, supply, and fulfillment checks.”
Case ID:
CX-2026-ENGAGE-00482
Timeline:
Intent captured
Products recommended
Compliance checked
Sample eligibility cleared
Supply condition reviewed
Request submitted
Fulfillment routing in progress
Customer update pending
Each timeline event has:
Timestamp
Status
Agent / system
Customer-safe explanation
Evidence link
Next action
Right rail
What happens next
Dow validates sample routing
If anything changes, you’ll see it here
Technical Service may contact you if expert review is needed
Customer Feedback Prompt
“Was this easier than your usual sample request process?”
Buttons:
Yes
Somewhat
No
Tell us what was missing
This feedback becomes part of the feedback-to-BRD loop.
Screen 9 — Supply-Aware Customer Update
Purpose
Show the downstream effect of the naphtha spike without exposing internal cost logic.
Trigger
The back-office naphtha spike flow has completed:
Anomaly detected
Cost recomputed
Inventory options modeled
PAC checked
Planner approved alternate sample routing
Customer View
Title:
Update to your sample plan
Message:
“Supply conditions changed for one requested grade. Your sample request remains active. Dow has identified an alternate fulfillment path and kept ENGAGE™ 8003 in your plan to reduce qualification delay.”
Timeline event:
Supply-aware routing updated
Customer-safe details:
No action required
Estimated sample window unchanged / adjusted
Alternate grade remains available
Expert support available
CTA:
View updated sample plan
Ask Technical Service
Confirm priority
What not to show
Do not show:
Naphtha price movement
Margin exposure
Plant/cracker identity
Internal working-capital rule
Internal customer allocation logic
Finance policy names
Screen 10 — Expert Handoff
Purpose
Show escalation-triggered human collaboration.
Trigger
Customer asks:
“Can I use ENGAGE™ 8180 for a colder climate vehicle platform, and how should I compare it with ENGAGE™ 8003?”
ChemAssist can answer documented basics but routes deeper formulation guidance to Technical Service.
Layout
Title:
Technical Service review started
Message:
“This question needs a Dow technical expert because it involves application-specific qualification guidance.”
Escalation packet visible to customer:
Question
Application
Products
Region
Documents used
Expected response time
Assigned team
Internal-only packet, not visible to customer:
Retrieved documents
Confidence
Policy decision
Supply context
Customer account tier
Prior interactions
CTA:
Add more details
Upload test requirements
Continue sample request
Screen 11 — Feedback-to-BRD Loop
Purpose
Make the demo intellectually strong: customer experience changes business requirements.
Layout
Title:
Your feedback improves Dow’s product experience
Customer-facing version:
“You told us that sample timing and product comparison were the hardest parts of this workflow. Dow uses this feedback to improve product guidance, sample routing, and digital support.”
Feedback options:
Recommendation was helpful
I need clearer sample timing
I need more comparison detail
I need regulatory documents earlier
I need expert support sooner
Other
Internal explanation panel for demo mode:
Feedback generated candidate improvements
Ontology update
“Dashboard” should map to “automotive interior / instrument panel / TPO.”
BRD candidate
“Customer sample flows must show customer-safe supply confidence.”
PAC candidate
“Rush sample requests for supply-watch grades should route to human approval.”
Content gap
“Need clearer customer-facing comparison copy for ENGAGE™ grades.”
Experiment
“Test sample plan timeline vs. static confirmation email.”
This directly supports the collaboration library principle that human and customer feedback should become system memory, not just thumbs-up/down data.
Screen 12 — Internal Demo Overlay: Back Office Explanation
Purpose
During the demo, switch from customer view to internal view to show the same timeline with more detail.
Layout
Same case ID:
CX-2026-ENGAGE-00482
Tabs:
Customer view
Agent trace
PAC decisions
Evidence
Feedback
BRD impact
Agent trace:
ChemAssist parsed intent
Product ontology matched application
RegRadar checked EU compliance
Supply Chain Agentic Spine detected supply watch
PAC checked customer-safe disclosure
Sample plan generated
Planner sign-off completed
Customer update sent
PAC decisions:
Action	Decision	Level	Reason
General product recommendation	Allow	1	Grounded in approved sources
Sample request submission	Allow	2	Human-approved process
Supply-risk customer message	Allow with redaction	1	Customer-safe disclosure
Internal cost exposure disclosure	Deny	4	Internal-only financial data
Rush sample for watched grade	Route to human	2	Supply condition requires review
7. Core Components for Figma
Build these as reusable components.
7.1 ChemAssist Intent Bar
Used on:
Home
Search results replacement
Product page
Sample plan
Timeline
States:
Empty
Typing
Understanding
Asking clarification
Recommendation ready
Escalating
Policy blocked
7.2 Product Recommendation Card
Fields:
Product name
Fit score
Application fit
Key evidence
Compliance status
Sample status
Supply confidence
CTA
Evidence drawer
7.3 Evidence Drawer
Sections:
Source document
Version/date
Retrieved passage summary
Confidence
Assumptions
What this does not cover
Ask expert CTA
7.4 PAC Decision Chip
Variants:
Allowed
Allowed with redaction
Route to human
Denied
Simulation only
Customer-safe
7.5 Supply Confidence Badge
Customer-facing labels:
Strong availability
Watch condition
Alternate available
Expert review suggested
Not available for this region
Internal labels:
Feedstock exposure
Plant constraint
Inventory threshold
Margin floor
Customer covenant
Trade restriction
7.6 Living Timeline Event
Fields:
Event title
Timestamp
Actor: customer / ChemAssist / RegRadar / PAC / planner / Technical Service
Status
Customer-facing explanation
Internal trace link
Evidence
Next action
7.7 Feedback Capture Card
Customer version:
Was this helpful?
What was missing?
What would make this easier?
Internal version:
Feedback type
Impacted requirement
Impacted ontology term
Impacted policy
Required owner
Experiment candidate
Promotion status
7.8 Expert Handoff Packet
Customer visible:
Your question
Assigned team
Expected response
Documents attached
Add more context
Internal visible:
Conversation history
Application profile
Product candidates
Retrieved evidence
Policy checks
Confidence
Suggested response draft
Knowledge gap classification
8. UX State Machine
Use this to define prototype behavior.
STATE 01: Anonymous visitor
  Can ask general product/application questions
  Cannot see account-specific availability, pricing, order history, or commitments

STATE 02: Intent captured
  ChemAssist extracts application, region, product family, performance needs

STATE 03: Guided profile incomplete
  System asks clarifying questions

STATE 04: Recommendation generated
  Products ranked with rationale, citations, compliance, sample path

STATE 05: Sample plan created
  Products selected, sample purpose defined, region known

STATE 06: Policy checking
  PAC evaluates sample eligibility, disclosure rules, compliance, shipping, account access

STATE 07: Account verification required
  User must authenticate or continue with limited guest flow

STATE 08: Request submitted
  Living timeline created

STATE 09: Back-office orchestration active
  Agents update supply, demand, cost, inventory status

STATE 10: Customer-safe update available
  Customer sees sanitized status change

STATE 11: Expert escalation required
  Case routed with context

STATE 12: Feedback captured
  Feedback becomes candidate ontology, BRD, PAC, or content update

STATE 13: Improvement routed to lab
  Backtesting validates change before production promotion
9. Customer-Side Data Model
Use this as the model behind the Figma prototype.
{
  "customer_case": {
    "case_id": "CX-2026-ENGAGE-00482",
    "customer_type": "Automotive Tier 1 Supplier",
    "region": "Germany / EU",
    "persona": "Materials Engineer",
    "intent": "Find elastomer for automotive dashboard TPO with cold-weather performance",
    "application_profile": {
      "market": "Mobility",
      "submarket": "Automotive",
      "application": "Interior dashboard / instrument panel",
      "performance_needs": [
        "low-temperature impact",
        "soft-touch feel",
        "processing efficiency",
        "lightweighting"
      ]
    },
    "recommended_products": [
      {
        "name": "ENGAGE™ 8180 Polyolefin Elastomer",
        "fit_score": "High",
        "sample_status": "Eligible",
        "supply_status_customer": "Watch condition",
        "supply_status_internal": "Feedstock economics changed for dependent European supply path",
        "evidence_level": "Strong"
      },
      {
        "name": "ENGAGE™ 8003 Polyolefin Elastomer",
        "fit_score": "Medium-high",
        "sample_status": "Eligible",
        "supply_status_customer": "Strong availability",
        "supply_status_internal": "No current fulfillment constraint for selected route",
        "evidence_level": "Moderate"
      }
    ],
    "policy_decisions": [
      {
        "action": "Show product recommendation",
        "decision": "allow",
        "action_level": 1,
        "customer_visible": true
      },
      {
        "action": "Submit sample request",
        "decision": "route_to_existing_sample_workflow",
        "action_level": 2,
        "customer_visible": true
      },
      {
        "action": "Expose internal naphtha event",
        "decision": "deny",
        "action_level": 4,
        "customer_visible": false
      },
      {
        "action": "Show customer-safe supply watch",
        "decision": "allow_with_redaction",
        "action_level": 1,
        "customer_visible": true
      }
    ],
    "timeline": [
      {
        "event": "Intent captured",
        "actor": "ChemAssist",
        "customer_message": "We understood your application requirements."
      },
      {
        "event": "Products recommended",
        "actor": "ChemAssist",
        "customer_message": "Two ENGAGE™ grades were recommended for comparison."
      },
      {
        "event": "Compliance checked",
        "actor": "RegRadar + PAC",
        "customer_message": "EU documentation is available."
      },
      {
        "event": "Supply condition reviewed",
        "actor": "Supply Chain Agentic Spine",
        "customer_message": "One product has a supply watch condition; an alternate remains available."
      },
      {
        "event": "Sample request submitted",
        "actor": "Customer",
        "customer_message": "Your sample request is now active."
      }
    ],
    "feedback": {
      "rating": "somewhat helpful",
      "customer_comment": "I need clearer delivery timing before submitting.",
      "candidate_brd_update": "Sample flows shall show customer-safe fulfillment confidence before submission.",
      "candidate_policy_update": "Supply-risk disclosure must be redacted and customer-safe.",
      "lab_status": "queued_for_backtest"
    }
  }
}
10. Agent Orchestration for Customer CX
Customer-facing agent stack
ChemAssist
Owns:
Intent understanding
Product recommendation
Formulation Q&A
Sample journey guidance
Customer-safe explanation
Feedback capture
RegRadar
Owns:
Regulatory intelligence
SDS/GHS/REACH/FDA answer support
Jurisdiction-specific compliance status
Escalation to Regulatory
Supply Chain Agentic Spine
Owns:
Supply-risk signals
Product availability risk
Fulfillment path impact
Downstream customer-safe updates
PAC
Owns:
Whether the answer/action is allowed
Whether human review is required
Whether information must be redacted
Which action tier applies
What reason chain is logged
Human teams
Technical Service: product/application guidance
Regulatory: formal compliance review
Sales: account relationship and quote support
Planner: supply-chain approval
Customer Service: fulfillment follow-up
11. Customer Feedback Loop Into BRD
This needs to be explicit in the demo because it turns the CX into a living product system.
Feedback sources
Failed searches
Clarification questions
Product comparison clicks
Sample cart abandonment
Customer satisfaction rating
Expert escalations
Repeated customer objections
Supply-related confusion
Regulatory uncertainty
Sample-to-order conversion outcomes
Feedback classification
Every feedback event is classified as one of these:
Feedback Type	Example	System Impact
Ontology gap	“Dashboard” did not map correctly	Update product/application ontology
Content gap	No clear comparison between ENGAGE grades	Create or improve approved content
Policy gap	Customer needs supply timing earlier	Add PAC-safe disclosure rule
UX friction	Registration caused abandonment	Modify progressive profile flow
Escalation gap	Expert needed sooner	Adjust confidence threshold
BRD gap	No requirement for customer-safe supply confidence	Add BRD requirement
Commercial signal	Customer requested rush sample	Add RevOps / Sales follow-up rule
Feedback-to-BRD workflow
Customer interaction
  ↓
Feedback event captured
  ↓
Classified by ChemAssist
  ↓
Linked to timeline and source evidence
  ↓
Candidate improvement generated
  ↓
Routed to owner:
    Product / Regulatory / Supply Chain / Sales / Finance / UX
  ↓
Backtested in experimental lab
  ↓
Reviewed by governance board
  ↓
Promoted to:
    BRD amendment
    PAC policy update
    Ontology update
    Content update
    Agent behavior update
  ↓
Versioned and released
  ↓
Impact monitored
Screen concept: “Customer Signal → Business Requirement”
This is an internal/demo screen.
Left column:
Customer signal
37% of customers requesting ENGAGE samples ask for estimated fulfillment timing before submission.
Middle:
System interpretation
Current BRD supports audit logging and sample submission, but does not explicitly require pre-submit customer-safe fulfillment confidence.
Right:
Candidate BRD amendment
“ChemAssist shall show customer-safe fulfillment confidence before sample submission when supply-chain signals are available and PAC approves disclosure.”
Bottom:
Promotion gate
Evidence threshold met
Backtest required
PAC simulation required
Product owner approval
Legal/compliance review if customer-facing
Release candidate
12. Critical Gates Before Customer Deployment
The customer environment should only receive agentic capability after passing gates.
Gate 0 — Content and Ontology Readiness
Must pass:
Approved product corpus loaded
Product attributes normalized
Application ontology validated
Known aliases mapped: dashboard, instrument panel, interior trim, TPO, soft-touch
Unsupported terms route to clarification
Gate 1 — PAC Simulation
Must pass:
All customer-facing actions produce allow / deny / route-to-human
Internal-only data is blocked
Redaction works
Policy version appears in audit
Gate 2 — Internal Backtest Lab
Must pass:
Historical or synthetic customer journeys replayed
Naphtha spike event replayed
Sample plan recommendations compared to expected outcome
Human reviewers score usefulness and safety
Gate 3 — Shadow Mode
Customer uses existing Dow flow. Agentic system runs silently in parallel.
Measure:
Would it have recommended the right products?
Would it have routed the sample correctly?
Would it have caught supply risk?
Would it have reduced manual steps?
Did PAC block anything incorrectly?
Gate 4 — Internal Pilot
Internal Dow teams use the new interface for customer support.
Users:
Technical Service
Customer Service
Sales
Regulatory
Supply Chain planners
Gate 5 — Private Customer Beta
Only selected customer accounts.
Capabilities:
Product recommendation
Sample plan
General compliance answers
Customer-safe timeline
Human escalation
No autonomous commercial commitments.
Gate 6 — Controlled Release
Expand only after:
Citation coverage is high
Unsupported claim rate is near zero
Customer satisfaction improves
Escalation quality improves
No policy bypass incidents
No data leakage incidents
Governance board approves
13. BRD Amendments Needed for the Customer CX Build
The BRD is strong, but it needs more explicit language for customer-facing event-driven CX and feedback-to-requirements loops.
Add these requirements.
New Requirement: Customer-Safe Supply Awareness
BR-CX-001
The platform shall expose customer-safe supply confidence, fulfillment status, and sample routing updates when supply-chain signals are available, PAC approves disclosure, and internal financial, plant, margin, or sourcing details are redacted.
New Requirement: Unified Customer Timeline
BR-CX-002
The platform shall create a persistent customer case timeline for sample, quote, technical support, regulatory, and order-related workflows. Each timeline event shall contain customer-facing status, internal traceability, actor, timestamp, policy decision, and evidence references.
New Requirement: Customer-Facing Redaction Policy
BR-CX-003
PAC shall determine whether operational information may be shown externally, shown with redaction, routed to human review, or denied. Internal-only information shall include margin exposure, cost-to-serve details, plant-specific constraints, feedstock economics, customer allocation rules, and Finance policy thresholds unless explicitly approved for disclosure.
New Requirement: Feedback-to-BRD Governance
BR-CX-004
Customer feedback, failed intents, abandoned workflows, escalations, and repeated support patterns shall be captured as structured feedback events and may generate candidate updates to the BRD, ontology, approved content, PAC policies, agent behavior, or UX workflow. Candidate updates must pass review, backtesting, and governance approval before production release.
New Requirement: Progressive Trust and Authentication
BR-CX-005
The customer experience shall support progressive disclosure of capabilities based on authentication and authorization. Anonymous users may receive general product information. Authenticated users may receive account-specific status, sample timeline, order intelligence, and customer-specific recommendations only where permitted.
New Requirement: Customer Explainability Standard
BR-CX-006
Every product recommendation, sample eligibility decision, compliance answer, escalation, and supply-aware update shall include an appropriate customer-facing explanation. Explanations must distinguish between technical rationale, regulatory status, sample eligibility, and operational availability.
New Requirement: Experimental Lab Promotion
BR-CX-007
No customer-facing agent behavior, policy update, ontology update, or recommendation strategy shall be promoted to production until it has passed experimental lab validation, including replay tests, PAC simulation, human review, audit logging, and rollback readiness.
14. Prototype Demo Script
Act 1 — Current State Pain
Show screenshots of current Dow.com.
Say:
“Today the customer has to search, interpret, filter, compare, register, request, and wait. Dow has the knowledge, but the experience does not orchestrate it.”
Act 2 — New Intent Entry
Show ChemAssist.
Customer types:
“I need a material for an automotive dashboard that performs in cold weather.”
Say:
“The new experience starts with customer intent, not catalog navigation.”
Act 3 — Guided Application Profile
ChemAssist maps the intent.
Say:
“Dashboard becomes automotive interior, instrument panel, TPO compound, low-temperature impact, EU region.”
Act 4 — Product Recommendation
Show ENGAGE™ 8180 and ENGAGE™ 8003.
Say:
“ChemAssist recommends products with rationale, evidence, compliance status, and sample eligibility.”
Act 5 — Supply-Aware Sample Plan
Show sample plan.
Say:
“This is not a cart. It is a governed sample plan. The system checks documentation, compliance, sample eligibility, and supply signals.”
Act 6 — Naphtha Spike Event
Switch briefly to internal overlay.
Say:
“Behind the scenes, the Agentic Spine detected a 10% naphtha price spike affecting feedstock economics. The customer does not see that internal event. They see only the safe, relevant consequence.”
Act 7 — PAC-Governed Disclosure
Show policy decision table.
Say:
“PAC allows a customer-safe supply watch message, denies internal cost disclosure, and routes risky actions to human review.”
Act 8 — Living Timeline
Return to customer view.
Say:
“Instead of a static email, the customer gets a living timeline. Every update is grounded, governed, and explainable.”
Act 9 — Feedback Influences BRD
Customer says:
“I need clearer delivery timing before submitting.”
Show feedback-to-BRD screen.
Say:
“That feedback becomes a candidate business requirement, not a lost survey response. It can update the ontology, PAC rules, content, or agent behavior after lab validation.”
Act 10 — Close
Say:
“The win is not a better chatbot. It is a governed customer operating layer connected to Dow’s product intelligence, regulatory intelligence, supply-chain intelligence, and business requirements.”
15. Figma Make Prompt
Use this as the direct prompt.
Create a high-fidelity enterprise B2B customer experience prototype for Dow called “Dow ChemAssist: Supply-Aware Customer Experience.”

The prototype should reimagine Dow’s current product search and sample request flow as an agentic, policy-governed customer journey. The visual style should feel like a modern Dow enterprise platform: clean white background, Dow red accents, dark blue-gray navigation, subtle cards, clear status chips, timeline components, and enterprise-grade trust cues. Do not make it feel like a generic chatbot. It should feel like a premium industrial customer portal powered by AI orchestration.

Core concept:
A customer at an automotive Tier 1 supplier in Germany needs an elastomer material for an automotive dashboard / interior TPO application with cold-weather performance. ChemAssist guides the user from vague intent to product recommendation, comparison, sample plan, policy-gated submission, living timeline, expert handoff, and feedback-to-business-requirements loop.

Create the following screens:

1. Dow home / intent entry
- Top nav with Dow logo, Applications, Products, Sustainability, Support, region/language, Account, Cart.
- Hero headline: “What are you trying to make?”
- Large ChemAssist input: “I need a material for an automotive dashboard that performs in cold weather.”
- Suggested chips: Automotive interior, TPO compound, Cold-weather impact, Request sample, Compare grades, Check compliance.
- Right panel explaining ChemAssist capabilities: product selection, application fit, regulatory checks, sample request, availability guidance, expert escalation.

2. Guided application profile
- Conversational ChemAssist panel on left.
- Progressive cards for Application, Performance Needs, Region, Next Step.
- Map “dashboard” to “Automotive interior / instrument panel / TPO compound.”
- Show policy chips: Customer-facing answer allowed, EU region detected, formal certification not requested, account-specific data locked until sign-in.
- CTA: Confirm profile.

3. Ranked product recommendations
- Title: “Recommended Dow Elastomers for your application.”
- Show product cards:
  a. ENGAGE™ 8180 Polyolefin Elastomer — high fit, eligible sample, supply watch condition, EU documents available.
  b. ENGAGE™ 8003 Polyolefin Elastomer — medium-high fit, eligible sample, strong availability, EU documents available.
  c. ENGAGE™ XLT 8677 — high technical performance, expert review suggested.
- Each card has Why recommended, Evidence, Compare, Request sample.

4. Product comparison with explainability
- Compare ENGAGE™ 8180 and ENGAGE™ 8003.
- Include rows for application fit, TPO relevance, low-temp performance evidence, sample eligibility, regional documentation, supply confidence, expert review needed.
- Right rail: “How this recommendation was made” with steps: ontology match, technical guide checked, EU region applied, sample eligibility checked, supply signal checked, PAC reviewed customer-facing response.

5. Smart sample plan
- Rename cart to “Sample Plan: Automotive Interior TPO Evaluation.”
- Selected products: ENGAGE™ 8180, ENGAGE™ 8003.
- Show sample purpose, product documents, SDS, EU shipping, sample eligibility, supply signal, expert review.
- Include PAC checking banner: “ChemAssist is checking sample eligibility, shipping rules, customer permissions, and documentation requirements.”
- Result: “Your sample request can proceed. One item has a supply watch condition, but an alternate grade is available.”

6. Progressive account step
- Title: “Save and submit your sample plan.”
- Explain why business email and company details are needed.
- Fields: business email, company, country, role, application purpose.
- Options: Continue with business email, Sign in, Continue as guest with limited status visibility.

7. Policy-gated review before submission
- Review recipient, application, products, required documents, eligibility checks, estimated fulfillment path.
- Policy check module:
  Sample purpose allowed, commercial use allowed, EU region detected, SDS available, trade restriction clear, shipping rule clear, supply watch on one item, human review not required.
- Add “Why?” links beside each decision.
- CTA: Submit sample request.

8. Confirmation with living timeline
- Title: “Sample request submitted.”
- Case ID: CX-2026-ENGAGE-00482.
- Timeline events: Intent captured, Products recommended, Compliance checked, Sample eligibility cleared, Supply condition reviewed, Request submitted, Fulfillment routing in progress, Customer update pending.
- Right rail: What happens next.
- Feedback prompt: “Was this easier than your usual sample request process?”

9. Supply-aware customer update
- Title: “Update to your sample plan.”
- Message: “Supply conditions changed for one requested grade. Your sample request remains active. Dow has identified an alternate fulfillment path and kept ENGAGE™ 8003 in your plan to reduce qualification delay.”
- Show customer-safe timeline update.
- CTA buttons: View updated sample plan, Ask Technical Service, Confirm priority.

10. Expert handoff
- Customer asks a deeper technical question.
- Show message: “This question needs a Dow technical expert because it involves application-specific qualification guidance.”
- Show customer-visible escalation packet: question, application, products, region, documents used, expected response time, assigned team.
- CTA: Add more details, Upload test requirements, Continue sample request.

11. Feedback-to-BRD loop
- Customer-facing title: “Your feedback improves Dow’s product experience.”
- Feedback options: Recommendation was helpful, I need clearer sample timing, I need more comparison detail, I need regulatory documents earlier, I need expert support sooner.
- Add internal demo panel showing generated candidate improvements:
  Ontology update: dashboard maps to automotive interior / instrument panel / TPO.
  BRD candidate: customer sample flows must show customer-safe supply confidence.
  PAC candidate: rush sample requests for supply-watch grades should route to human approval.
  Content gap: clearer comparison copy for ENGAGE grades.
  Experiment: test sample plan timeline vs static confirmation email.

12. Internal demo overlay
- Same case ID.
- Tabs: Customer view, Agent trace, PAC decisions, Evidence, Feedback, BRD impact.
- Show agent trace:
  ChemAssist parsed intent.
  Product ontology matched application.
  RegRadar checked EU compliance.
  Supply Chain Agentic Spine detected supply watch.
  PAC checked customer-safe disclosure.
  Sample plan generated.
  Planner sign-off completed.
  Customer update sent.
- Show PAC decision table:
  General product recommendation: allow, Level 1.
  Sample request submission: route to existing workflow, Level 2.
  Supply-risk customer message: allow with redaction, Level 1.
  Internal cost exposure disclosure: deny, Level 4.
  Rush sample for watched grade: route to human, Level 2.

Create reusable components:
- ChemAssist intent bar
- Product recommendation card
- Evidence drawer
- PAC decision chip
- Supply confidence badge
- Living timeline event
- Feedback capture card
- Expert handoff packet
- Policy explanation drawer
- Customer-safe/internal-only toggle for demo mode

Prototype interactions:
- Submit intent moves to guided profile.
- Confirm profile moves to recommendations.
- Compare products opens comparison.
- Build sample plan opens smart sample plan.
- Continue opens account step.
- Submit request opens timeline.
- Trigger supply update opens customer-safe update.
- Ask Technical Service opens expert handoff.
- Submit feedback opens feedback-to-BRD loop.
- Internal overlay shows the agent trace and PAC decision table.

Tone:
Clear, executive-grade, trustworthy, not playful. Use concise copy. Emphasize governed intelligence, supply-aware CX, explainability, and human review where needed.
16. What This Demo Proves
This customer-side build proves five things:
Dow can move from search to intent.
Product recommendations can be grounded in technical, regulatory, and supply data.
Sample requests can become orchestrated cases, not form submissions.
Supply-chain events can inform CX without exposing internal details.
Customer feedback can reshape BRD requirements, ontology, PAC rules, and agent behavior through governed loops.