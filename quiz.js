document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  const results = document.getElementById('results');
  const perQ = document.getElementById('perQuestion');
  const summary = document.getElementById('summary');
  const totals = document.getElementById('totals');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !results || !perQ || !summary || !totals || !resetBtn) {
    console.error('Quiz init failed: missing required elements');
    return;
  }

  const key = {
    q1: { type: 'text', answer: 'quic', display: 'QUIC' },
    q2: { type: 'radio', answer: 'http11', display: 'HTTP/1.1' },
    q3: { type: 'radio', answer: 'hpack', display: 'HPACK' },
    q4: { type: 'radio', answer: 'tls', display: 'HTTPS/TLS' },
    q5: {
      type: 'checkbox',
      answers: ['handshake', 'streams', 'fasterRecovery'],
      display: [
        'Fewer handshake roundtrips',
        'Independent multiplexed streams',
        'Faster connection migration/recovery'
      ]
    }
  };

  const norm = (s) => (s || '').trim().toLowerCase();

  function scoreCheckbox(name, correctSet) {
    const chosen = Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
    const cSet = new Set(correctSet);
    const chosenSet = new Set(chosen);
    if (chosenSet.size !== cSet.size) return { ok: false, chosen };
    for (const v of chosenSet) if (!cSet.has(v)) return { ok: false, chosen };
    return { ok: true, chosen };
  }

  function addRow(n, ok, answerText) {
    const li = document.createElement('li');
    li.className = ok ? 'ok' : 'bad';
    li.textContent = `Q${n}: ${ok ? 'Correct' : 'Incorrect'} — ${answerText}`;
    perQ.appendChild(li);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let total = 0, got = 0;
    perQ.innerHTML = '';

    // Q1 text
    total++;
    const a1 = norm(form.q1?.value);
    const ok1 = a1 === key.q1.answer;
    if (ok1) got++;
    addRow(1, ok1, `Answer: ${key.q1.display}`);

    // Q2 radio
    total++;
    const a2 = form.querySelector('input[name="q2"]:checked')?.value || '';
    const ok2 = a2 === key.q2.answer;
    if (ok2) got++;
    addRow(2, ok2, `Answer: ${key.q2.display}`);

    // Q3 radio
    total++;
    const a3 = form.querySelector('input[name="q3"]:checked')?.value || '';
    const ok3 = a3 === key.q3.answer;
    if (ok3) got++;
    addRow(3, ok3, `Answer: ${key.q3.display}`);

    // Q4 radio
    total++;
    const a4 = form.querySelector('input[name="q4"]:checked')?.value || '';
    const ok4 = a4 === key.q4.answer;
    if (ok4) got++;
    addRow(4, ok4, `Answer: ${key.q4.display}`);

    // Q5 checkbox exact match
    total++;
    const sc5 = scoreCheckbox('q5', key.q5.answers);
    const ok5 = sc5.ok;
    if (ok5) got++;
    addRow(5, ok5, `Answers: ${key.q5.display.join('; ')}`);

    const pass = got >= 4;
    summary.textContent = pass ? 'Result: PASS' : 'Result: FAIL';
    summary.className = pass ? 'ok' : 'bad';
    totals.textContent = `Score: ${got} / ${total}`;

    results.hidden = false;
    results.style.display = ''; // override any CSS hiding
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    results.hidden = true;
    summary.textContent = '';
    totals.textContent = '';
    perQ.innerHTML = '';
  });
});
