/* ============================================================
   AlpiGPT B2B Concierge — workspace cards
   Migrated from alpitour/concierge/components.jsx
   ============================================================ */
import React from 'react';
import { fmtEUR, agency, requirements, hotels, flight, addOns as allAddOns } from './data';

export function Ki({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  return <svg className={`ki ${className}`} style={size !== 16 ? { width: size, height: size } : undefined}><use href={`#icon-${name}`} /></svg>;
}

export function Card({ icon, title, sub, badges, children, className = '' }: any) {
  return (
    <div className={`cg-card ${className}`}>
      {(icon || title) && (
        <div className="cg-card-h">
          {icon && <span className="ic"><Ki name={icon} size={16} /></span>}
          <div><h3>{title}</h3>{sub && <div className="sub">{sub}</div>}</div>
          {badges && <div className="right">{badges}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function WelcomeCard() {
  return (
    <div className="cg-card cg-welcome">
      <span className="cg-eyebrow">EasyBook · AlpiGPT concierge</span>
      <h2 style={{ marginTop: 8 }}>Buongiorno, Marco.</h2>
      <p>I can help you build, check, modify, or hold a travel proposal — across packages, hotels, Neos flights, transfers and excursions. Describe the customer request to begin; I'll orchestrate the rest.</p>
      <div className="caps">
        {([['chat-bot', 'Build', 'Brief → ranked options → priced package'], ['analytics', 'Check', 'Availability, amenities & policy answers'], ['recommend', 'Modify', 'Self-service changes after proposal'], ['checkmark-filled', 'Hold', '24-hour booking holds from the chat']] as [string, string, string][]).map(([ic, t, s]) => (
          <div className="cg-cap" key={t}><Ki name={ic} size={18} /><div className="t">{t}</div><div className="s">{s}</div></div>
        ))}
      </div>
    </div>
  );
}

export function RequestCapturedCard() {
  const r = requirements;
  return (
    <Card icon="document-chart" title="Request captured" sub="Work package wpkg_alpitour_001 · classified standard_package_quote" badges={<span className="cg-badge ai"><Ki name="recommend" size={11} /> Intent Agent</span>}>
      <dl className="cg-kv">
        <dt>Destination</dt><dd>Egypt</dd>
        <dt>Departure</dt><dd>Rome</dd>
        <dt>Travellers</dt><dd>Family of 3</dd>
        <dt>Budget</dt><dd>{fmtEUR(r.budget)}</dd>
        <dt>Preferred hotel</dt><dd>{r.preferredHotel}</dd>
      </dl>
    </Card>
  );
}

export function TripContextCard({ signals }: { signals: string[] }) {
  const r = requirements;
  return (
    <Card icon="group" title="Trip context" sub="Structured by the Requirements Agent" badges={<span className="cg-badge ok"><Ki name="checkmark-filled" size={11} /> Validated</span>}>
      <dl className="cg-kv">
        <dt>Party</dt><dd>2 adults + 1 child (age 2)</dd>
        <dt>Dates</dt><dd>{r.dates} · 7 nights</dd>
        <dt>Board</dt><dd>{r.boardBasis}</dd>
        <dt>Budget</dt><dd>{fmtEUR(r.budget)}</dd>
        <dt>Preferred hotel</dt><dd>{r.preferredHotel}</dd>
        <dt>Flexibility</dt><dd>Show alternatives if unavailable</dd>
        <dt>Needs</dt><dd>Family-friendly · travelling with baby{signals.includes('baby_pool') ? ' · baby pool' : ''}</dd>
      </dl>
    </Card>
  );
}

export function TripStrip({ signals }: { signals: string[] }) {
  return (
    <div className="cg-tripstrip">
      <span className="lbl">Trip context</span>
      <span className="cg-fact"><Ki name="group" size={12} /> Family of 3 · child 2y</span>
      <span className="cg-fact">Sharm el-Sheikh · 12–19 Aug · 7nt</span>
      <span className="cg-fact">All inclusive</span>
      <span className="cg-fact">≤ €3,500</span>
      {signals.includes('baby_pool') && <span className="cg-fact signal"><Ki name="recommend" size={12} /> baby-friendly priority</span>}
    </div>
  );
}

export function AgencyContextCard() {
  const a = agency;
  return (
    <>
      <Card icon="network" title="Agency context applied" sub="Resolved by the Context Agent via crm-mcp" badges={<span className="cg-badge gold">Gold Partner</span>}>
        <dl className="cg-kv">
          <dt>Agency</dt><dd>{a.name}</dd>
          <dt>Tier</dt><dd>{a.tier}</dd>
          <dt>Commission</dt><dd>{a.commissionRate}% · applied automatically</dd>
          <dt>Preferred brands</dt><dd>{a.preferredBrands.join(', ')}</dd>
          <dt>Channel</dt><dd>{a.channel}</dd>
        </dl>
      </Card>
      <Card icon="warning-alt" title="Commercial rules" sub="OPA policy guardrails · enforced at proposal time">
        <div className="cg-amens" style={{ gap: 7 }}>
          <span className="cg-amen">Gold-tier pricing floor</span>
          <span className="cg-amen">Commission 12% cap</span>
          <span className="cg-amen">Brand template · Alpitour</span>
          <span className="cg-amen">Cancellation terms v2026.2</span>
        </div>
      </Card>
    </>
  );
}

export function HotelKnowledgeCard() {
  const h = hotels.jaz;
  return (
    <>
      <Card icon="lightbulb" title={h.name} sub="Amenity check · grounded in the Alpitour product catalogue (rag-mcp)" badges={<span className="cg-badge ai"><Ki name="recommend" size={11} /> Retrieval Agent</span>}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <image-slot id="hotel-jaz" shape="rounded" radius="8" placeholder="Hotel photo" style={{ width: 168, height: 112, flexShrink: 0 }}></image-slot>
          <div className="cg-know" style={{ flex: 1 }}>
            {h.amenities.map((a: string) => (
              <div className="cg-know-it" key={a}><Ki name="checkmark-filled" size={16} /><div className="t">{a}</div><div className="s">Yes</div></div>
            ))}
          </div>
        </div>
      </Card>
      <div className="cg-signal">
        <Ki name="recommend" size={16} />
        <span><b>Preference detected:</b> baby-friendly amenities — added to the Travel Work Context and <b>applied to search ranking</b>.</span>
      </div>
    </>
  );
}

export function AvailabilityCard() {
  return (
    <Card icon="anomaly" title="Availability check" sub="Inventory Agent · travel-inventory-mcp · allotment check" badges={<span className="cg-badge err"><Ki name="error-filled" size={11} /> Sold out</span>}>
      <div className="cg-soldout">
        <span className="ic"><Ki name="error-filled" size={20} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Jaz Mirabel Beach — sold out for 12–19 August</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>Party: 2 adults + 1 child · all allotments consumed for this date range</div>
        </div>
        <span className="cg-badge ai" style={{ whiteSpace: 'nowrap' }}><Ki name="arrow-up-right" size={11} /> Next: find alternatives</span>
      </div>
    </Card>
  );
}

function HotelOptionCard({ hotel, onSelect, busy }: any) {
  const best = hotel.rank === 'Best match';
  return (
    <div className={`cg-opt ${best ? 'best' : ''}`}>
      <span className="rank"><span className={`cg-badge ${best ? 'ai' : hotel.rank === 'Best value' ? 'ok' : 'warn'}`}>{hotel.rank}</span></span>
      <image-slot id={`hotel-${hotel.id}`} shape="rounded" radius="7" placeholder={`${hotel.name} photo`} style={{ width: '100%', height: 92 }}></image-slot>
      <h4>{hotel.name}</h4>
      <div className="price">{fmtEUR(hotel.price)} <small>family of 3 · 7 nights</small></div>
      <div className="cg-match"><span>Match</span><span className="bar"><i style={{ width: hotel.matchScore + '%' }} /></span><b>{hotel.matchScore}%</b></div>
      <div className="cg-amens">{hotel.amenities.slice(0, 4).map((a: string) => <span key={a} className={`cg-amen ${(hotel.hi || []).includes(a) ? 'hi' : ''}`}>{a}</span>)}</div>
      <div className="cg-why"><b>Why recommended</b>{hotel.why}</div>
      <button className="cg-btn primary" disabled={busy} onClick={() => onSelect(hotel.id)}>Select package</button>
    </div>
  );
}

export function AlternativesGrid({ onSelect, busy }: { onSelect: (id: string) => void; busy: boolean }) {
  return (
    <>
      <div className="cg-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Ranked alternatives <span className="cg-badge ai" style={{ textTransform: 'none', letterSpacing: 0 }}><Ki name="recommend" size={11} /> ranked on family fit · budget · baby-pool signal</span></div>
      <div className="cg-opts">
        {[hotels.coral, hotels.redsea, hotels.sinai].map((h) => <HotelOptionCard key={h.id} hotel={h} onSelect={onSelect} busy={busy} />)}
      </div>
    </>
  );
}

export function PackageBuilder({ hotel, addOns, compact, onEdit }: any) {
  const F = flight;
  const segs: [string, string, string, string][] = [
    ['arrow-up-right', 'Flight · ' + F.carrier, `${F.route} · ${F.dates} · ${F.code}`, 'included'],
    ['dashboard', hotel.name, '7 nights · all-inclusive · family room', fmtEUR(hotel.price)],
    ['network', 'Airport transfer', addOns.includes('transfer') ? 'Private transfer · baby seat included' : 'Standard shared transfer · included', addOns.includes('transfer') ? '+€120' : 'included'],
  ];
  const addSegs = allAddOns.filter((a) => addOns.includes(a.id) && a.id !== 'transfer');
  return (
    <Card icon="document-chart" title="Package summary" sub="Composed by the Itinerary Agent · availability confirmed" badges={<span className="cg-badge ok"><Ki name="checkmark-filled" size={11} /> Flight + hotel confirmed</span>}>
      {segs.map(([ic, t, s, p]) => (
        <div className="cg-seg" key={t}>
          <span className="ic"><Ki name={ic} size={15} /></span>
          <div><div className="t">{t}</div><div className="s">{s}</div></div>
          <span className="p">{p === 'included' ? <small>included</small> : p}</span>
        </div>
      ))}
      {addSegs.map((a) => (
        <div className="cg-seg" key={a.id}>
          <span className="ic"><Ki name="recommend" size={15} /></span>
          <div><div className="t">{a.name}</div><div className="s">Add-on</div></div>
          <span className="p">+{fmtEUR(a.price)}</span>
        </div>
      ))}
      {!compact && (
        <div className="cg-edits">
          {([['Change hotel', 'hotel'], ['Change dates', 'dates'], ['Modify flight', 'flight'], ['Add experiences', 'addons']] as [string, string][]).map(([l, k]) => (
            <button key={k} className="cg-btn sm" onClick={() => onEdit(k)}>{l}</button>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AddOnsPanel({ selected, onToggle, onGenerate, busy }: any) {
  return (
    <Card icon="recommend" title="Suggested add-ons" sub="Upsell Agent · ranked by family context — travelling with a 2-year-old" badges={<span className="cg-badge ai"><Ki name="lightbulb" size={11} /> Contextual</span>}>
      <div className="cg-addons">
        {allAddOns.map((a) => {
          const sel = selected.includes(a.id);
          return (
            <div key={a.id} className={`cg-addon ${sel ? 'sel' : ''}`} onClick={() => onToggle(a.id)}>
              <span className="ck">{sel ? '✓' : ''}</span>
              <div><div className="t">{a.name}</div><div className="s">{a.why}</div></div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}><div className="p">+{fmtEUR(a.price)}</div></div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
        <button className="cg-btn primary" disabled={busy} onClick={onGenerate}><Ki name="document-chart" size={14} /> Generate proposal</button>
      </div>
    </Card>
  );
}

export function ProposalPreview({ hotel, addOns, totals, onHold, onRevise, busy, version, dates }: any) {
  const F = flight;
  const adds = allAddOns.filter((a) => addOns.includes(a.id));
  return (
    <Card icon="document-chart" title={`Proposal ${version || 'v1'} · Rossi Travel`} sub="Generated by the Proposal Agent · Alpitour brand template"
      badges={<><span className="cg-badge ok"><Ki name="checkmark-filled" size={11} /> Policy validated</span><span className="cg-badge gold">Gold pricing</span></>}>
      <div className="cg-proposal-grid">
        <dl className="cg-kv" style={{ alignContent: 'start' }}>
          <dt>Customer</dt><dd>Family of 3 (child age 2)</dd>
          <dt>Destination</dt><dd>Sharm el-Sheikh, Egypt</dd>
          <dt>Dates</dt><dd>{dates || '12–19 August'} · 7 nights</dd>
          <dt>Hotel</dt><dd>{hotel.name}</dd>
          <dt>Flight</dt><dd>{F.route} · {F.carrier}</dd>
          <dt>Board</dt><dd>All inclusive</dd>
          <dt>Add-ons</dt><dd>{adds.length ? adds.map((a: any) => a.name).join(', ') : 'None'}</dd>
        </dl>
        <div>
          <div className="cg-totals">
            <div className="row"><span>Package price</span><b>{fmtEUR(totals.base)}</b></div>
            <div className="row"><span>Add-ons</span><b>{totals.addons ? '+' + fmtEUR(totals.addons) : '—'}</b></div>
            <div className="row grand"><span>Total client price</span><b>{fmtEUR(totals.total)}</b></div>
          </div>
          <div className="cg-commission" style={{ marginTop: 12 }}>
            <span>Agency commission · 12%</span><b>{fmtEUR(totals.commission)}</b>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.5 }}>
            Compliance: cancellation terms v2026.2 attached · OPA pricing floor passed · commission within Gold-tier cap.
          </div>
        </div>
      </div>
      {onHold && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-1)' }}>
          <button className="cg-btn" disabled={busy} onClick={onRevise}>Revise</button>
          <button className="cg-btn primary" disabled={busy} onClick={onHold}><Ki name="checkmark-filled" size={14} /> Place hold · 24h</button>
        </div>
      )}
    </Card>
  );
}

export function BookingHoldCard({ version, total, onAction, busy }: any) {
  return (
    <Card icon="checkmark-filled" title="Booking hold confirmed" sub="Booking Agent · booking-platform-mcp → EasyBook" badges={<span className="cg-badge warn"><Ki name="warning-alt" size={11} /> On hold · expires in 24h</span>}>
      <div className="cg-holdref">
        <span className="ref">AT-88421</span>
        <span className="cg-badge info">Proposal {version}</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>{fmtEUR(total)}</span>
      </div>
      <div className="cg-actions-grid">
        {([['checkmark-filled', 'Confirm booking', 'confirm'], ['recommend', 'Modify proposal', 'modify'], ['arrow-up-right', 'Send to customer', 'send'], ['information', 'Add follow-up reminder', 'remind']] as [string, string, string][]).map(([ic, l, k]) => (
          <button key={k} className={`cg-btn ${k === 'modify' ? 'primary' : ''}`} disabled={busy} onClick={() => onAction(k)}><Ki name={ic} size={14} /> {l}</button>
        ))}
      </div>
    </Card>
  );
}

export function ModificationPanel({ onPick, busy }: any) {
  return (
    <Card icon="recommend" title="Modify proposal — self-service" sub="No support call, no ticket · Modification Agent re-orchestrates the pipeline">
      <div className="cg-modopts">
        {([['analytics', 'Change dates', 'dates'], ['arrow-up-right', 'Modify flight departure', 'flight'], ['dashboard', 'Switch hotel', 'hotel'], ['recommend', 'Add / remove services', 'services']] as [string, string, string][]).map(([ic, l, k]) => (
          <button key={k} className="cg-modopt" disabled={busy} onClick={() => onPick(k)}><Ki name={ic} size={15} /> {l}</button>
        ))}
      </div>
    </Card>
  );
}

export function VersionCompareCard({ onAccept, onKeep, busy }: any) {
  return (
    <Card icon="analytics" title="Version compare" sub="Same hotel & flight route available one week earlier · re-priced by the Pricing Agent">
      <div className="cg-vers">
        <div className="cg-ver">
          <div className="vtag">Original · v1</div>
          <div className="vtotal">{fmtEUR(3465)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 6 }}>12–19 August · Coral Bay Family Resort</div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 3 }}>Hold AT-88421 · unchanged</div>
        </div>
        <div className="cg-ver new">
          <div className="vtag">Updated · v2</div>
          <div className="vtotal">{fmtEUR(3365)} <span className="cg-delta down"><Ki name="arrow-down-right" size={12} /> −€100</span></div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 6 }}>5–12 August · Coral Bay Family Resort</div>
          <div style={{ fontSize: 11.5, color: 'var(--k-status-success-110)', marginTop: 3 }}>✓ Availability confirmed · flight + hotel</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
        <button className="cg-btn" disabled={busy} onClick={onKeep}>Keep original</button>
        <button className="cg-btn primary" disabled={busy} onClick={onAccept}><Ki name="checkmark-filled" size={14} /> Accept updated proposal</button>
      </div>
    </Card>
  );
}

export function HotelSwitchCard({ onApply, onKeep, busy }: any) {
  const h = hotels.sinai;
  return (
    <Card icon="dashboard" title="Alternative · water park nearby" sub="Retrieval Agent checked amenity fit · Pricing Agent computed the delta" badges={<span className="cg-badge warn">Premium upgrade</span>}>
      <div style={{ display: 'flex', gap: 14 }}>
        <image-slot id="hotel-sinai-switch" shape="rounded" radius="8" placeholder="Resort photo" style={{ width: 190, height: 122, flexShrink: 0 }}></image-slot>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 16 }}>{h.name}</h4>
          <div className="cg-amens" style={{ marginTop: 8 }}>
            {['Baby pool', 'Water park nearby', 'Premium family suite', 'Private transfer'].map((a) => <span key={a} className={`cg-amen ${a.includes('Water') || a.includes('Baby') ? 'hi' : ''}`}>{a}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{fmtEUR(3795)}</span>
            <span className="cg-delta up"><Ki name="arrow-up-right" size={12} /> +€330 vs current</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
        <button className="cg-btn" disabled={busy} onClick={onKeep}>Keep current hotel</button>
        <button className="cg-btn primary" disabled={busy} onClick={onApply}>Apply hotel change</button>
      </div>
    </Card>
  );
}

export function NextBestActionsPanel({ onAction }: any) {
  return (
    <Card icon="lightbulb" title="Next best actions" sub="Upsell Agent · contextual follow-ups for this booking">
      <div className="cg-nba">
        {([['arrow-up-right', 'Send updated proposal to client', 'send'], ['information', 'Set follow-up reminder · 48h', 'remind'], ['checkmark-filled', 'Confirm booking', 'confirm'], ['recommend', 'Add water park day pass · €160', 'wp'], ['dashboard', 'Add room upgrade · €280', 'ru'], ['group', 'Save family preference for future proposals', 'save']] as [string, string, string][]).map(([ic, l, k]) => (
          <button key={k} className="cg-nba-item" onClick={() => onAction(k, l)}><Ki name={ic} size={15} /> {l}</button>
        ))}
      </div>
    </Card>
  );
}

export function BusinessValueSummary() {
  return (
    <Card icon="analytics" title="What just happened — business value" sub="AI Lab PoC · Phase 1 pilot scenario" className="cg-value">
      <div className="cg-value-grid">
        {['No support ticket required', 'No operator call required', 'Sold-out hotel recovered into a sale', 'Proposal modified self-service', 'Quote traceable across versions (v1 → v2)', 'Contextual upsells from one retrieval question'].map((t) => (
          <div className="cg-value-item" key={t}><Ki name="checkmark-filled" size={14} /> {t}</div>
        ))}
      </div>
    </Card>
  );
}
