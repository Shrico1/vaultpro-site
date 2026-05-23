const CLOSE_DATE = new Date('2026-05-29T23:59:59');
const TOTAL = 7;

// Countdown
function pad(n) { return String(n).padStart(2, '0'); }
function tick() {
  const diff = CLOSE_DATE - Date.now();
  const d = diff <= 0 ? 0 : Math.floor(diff / 86400000);
  const h = diff <= 0 ? 0 : Math.floor((diff % 86400000) / 3600000);
  const m = diff <= 0 ? 0 : Math.floor((diff % 3600000) / 60000);
  const s = diff <= 0 ? 0 : Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent  = pad(d);
  document.getElementById('cd-hours').textContent = pad(h);
  document.getElementById('cd-mins').textContent  = pad(m);
  document.getElementById('cd-secs').textContent  = pad(s);

  document.getElementById('nav-days').textContent  = pad(d);
  document.getElementById('nav-hours').textContent = pad(h);
  document.getElementById('nav-mins').textContent  = pad(m);
  document.getElementById('nav-secs').textContent  = pad(s);
}
tick(); setInterval(tick, 1000);

// Airtable progressive save
let airtableRecordId = null;

function getFormData() {
  const data = {};
  const name      = document.getElementById('name')?.value?.trim();
  const phone     = document.getElementById('phone')?.value?.trim();
  const email     = document.getElementById('email')?.value?.trim();
  const instagram = document.getElementById('instagram')?.value?.trim();
  const exp       = document.querySelector('input[name="experience"]:checked')?.value;
  const goal      = document.querySelector('input[name="goal"]:checked')?.value;
  const age       = document.querySelector('input[name="age"]:checked')?.value;
  const budget    = document.querySelector('input[name="budget"]:checked')?.value;
  if (name)      data.name       = name;
  if (phone)     data.phone      = phone;
  if (email)     data.email      = email;
  if (instagram) data.instagram  = instagram;
  if (exp)       data.experience = exp;
  if (goal)      data.goal       = goal;
  if (age)       data.age        = age;
  if (budget)    data.budget     = budget;
  if (airtableRecordId) data.recordId = airtableRecordId;
  return data;
}

async function saveProgress() {
  try {
    const res = await fetch('https://vault-pro-apply.nsavi-finance.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData()),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.id) airtableRecordId = json.id;
    }
  } catch {}
}

// Progress dots
const dotsEl = document.getElementById('dots');
for (let i = 1; i <= TOTAL; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 1 ? ' active' : '');
  d.id = 'dot-' + i;
  dotsEl.appendChild(d);
}

function setStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector('[data-step="' + n + '"]').classList.add('active');
  for (let i = 1; i <= TOTAL; i++) {
    document.getElementById('dot-' + i).classList.toggle('active', i === n);
  }
}

function prevStep(current) { if (current > 1) setStep(current - 1); }

function showErr(n) { document.getElementById('err-' + n).classList.add('show'); }
function clearErr(n) { document.getElementById('err-' + n).classList.remove('show'); }

function nextStep(current) {
  const radioNames = ['experience', 'goal', 'age', 'budget'];
  if (current <= 4) {
    if (!document.querySelector('input[name="' + radioNames[current - 1] + '"]:checked')) {
      showErr(current); return;
    }
  }
  if (current === 5 && !document.getElementById('instagram').value.trim()) { showErr(5); return; }
  if (current === 6 && !document.getElementById('email').value.trim()) { showErr(6); return; }
  clearErr(current);
  setStep(current + 1);
  saveProgress();
}

async function submitForm() {
  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (!name || !phone) { showErr(7); return; }

  const btn = document.querySelector('.submit-btn');
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  try {
    const res = await fetch('https://vault-pro-apply.nsavi-finance.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData()),
    });
    if (!res.ok) throw new Error();
    document.getElementById('form-inner').style.display = 'none';
    document.getElementById('success-state').style.display = 'flex';
  } catch {
    btn.textContent = 'Submit Application →';
    btn.disabled = false;
    alert('Something went wrong — please try again.');
  }
}
