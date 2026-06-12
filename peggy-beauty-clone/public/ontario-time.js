// Updates working hours list to show current Ontario date/time and highlight current day
(function(){
  const defaultHours = {
    TUESDAY: '10am-6pm',
    WEDNESDAY: '10am-6pm',
    THURSDAY: '10am-8pm',
    FRIDAY: '10am-6pm',
    SATURDAY: '9am-4pm',
    SUNDAY: 'CLOSED',
    MONDAY: '6am-10pm',
  };
  let closedDates = [];
  let lastAvailabilityFetch = 0;

  function formatTorontoDate(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const values = {};
    parts.forEach(part => {
      values[part.type] = part.value;
    });
    return `${values.year}-${values.month}-${values.day}`;
  }

  function closedDaysInVisibleWeek() {
    const closed = new Set(closedDates);
    const days = new Set();
    const now = Date.now();

    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(now + offset * 24 * 60 * 60 * 1000);
      const dateKey = formatTorontoDate(date);
      if (closed.has(dateKey)) {
        const weekday = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Toronto',
          weekday: 'long',
        }).format(date).toUpperCase();
        days.add(weekday);
      }
    }

    return days;
  }

  async function refreshAvailability() {
    const now = Date.now();
    if (now - lastAvailabilityFetch < 15000) return;
    lastAvailabilityFetch = now;

    const urls = ['/booking/availability', '/availability'];
    for (const url of urls) {
      try {
        const res = await fetch(`${url}?t=${now}`, { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data.closedDates)) closedDates = data.closedDates;
        return;
      } catch (e) {}
    }
  }

  function applyClosedDates(ul) {
    const closedDays = closedDaysInVisibleWeek();
    const items = Array.from(ul.querySelectorAll('.elementor-icon-list-item'));

    items.forEach(li => {
      const textEl = li.querySelector('.elementor-icon-list-text') || li;
      const currentText = (textEl.textContent || '').toUpperCase();
      const day = Object.keys(defaultHours).find(dayName => currentText.indexOf(dayName) !== -1);
      if (!day) return;
      const time = closedDays.has(day) ? 'CLOSED' : defaultHours[day];
      textEl.textContent = `${day} - ${time}`;
    });
  }

  function update() {
    try {
      const ul = document.querySelector('.working-hours .elementor-icon-list-items');
      if (!ul) return;
      refreshAvailability().catch(() => {});
      applyClosedDates(ul);

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
