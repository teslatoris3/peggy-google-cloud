// Updates working hours list to show current Ontario date/time and highlight current day
(function(){
  function pad(n){return n.toString().padStart(2,'0')}
  function update() {
    try {
      const ul = document.querySelector('.working-hours .elementor-icon-list-items');
      if (!ul) return;

      const now = new Date();
      // Format date and time in America/Toronto
      const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
      const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

      const dateStr = dateFormatter.format(now);
      const timeStr = timeFormatter.format(now);

      // Insert or update status node above the list
      let status = ul.previousElementSibling && ul.previousElementSibling.classList && ul.previousElementSibling.classList.contains('ontario-time-status') ? ul.previousElementSibling : null;
      if (!status) {
        status = document.createElement('div');
        status.className = 'ontario-time-status';
        status.style.marginBottom = '8px';
        status.style.fontSize = '0.95rem';
        ul.parentNode.insertBefore(status, ul);
      }
      status.innerHTML = `Local (Ontario): <strong style="font-weight:700">${dateStr} — ${timeStr}</strong>`;

      // Determine current weekday name in uppercase (e.g., TUESDAY)
      const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', weekday: 'long' }).format(now).toUpperCase();

      // Bold matching list item and remove bold from others
      const items = Array.from(ul.querySelectorAll('.elementor-icon-list-item'));
      items.forEach(li => {
        const textEl = li.querySelector('.elementor-icon-list-text') || li;
        const txt = (textEl.textContent || '').toUpperCase();
        if (txt.indexOf(weekday) !== -1) {
          textEl.style.fontWeight = '700';
        } else {
          textEl.style.fontWeight = '';
        }
      });
    } catch (e) {
      console.error('ontario-time update error', e);
    }
  }

  // Update immediately and every second
  if (document.readyState === 'complete' || document.readyState === 'interactive') update();
  document.addEventListener('DOMContentLoaded', update);
  setInterval(update, 1000);
})();
