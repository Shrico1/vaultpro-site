// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Form submission
document.getElementById('applyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch('https://vault-pro-apply.nsavi-finance.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error();

    document.getElementById('applyForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  } catch {
    btn.textContent = 'Submit Application →';
    btn.disabled = false;
    alert('Something went wrong — please try again.');
  }
});
