/* Seneca Music - site script
 * 1. Mobile menu
 * 2. Reads updates.txt and fills in events, the weekly reminder,
 *    competitions, summer dates and the in-season/off-season switch.
 * You should never need to edit this file. Edit updates.txt instead.
 */
(function () {
  'use strict';

  /* ---------- 1. Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.click();
        toggle.focus();
      }
    });
  }
  document.querySelectorAll('[data-year]').forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });

  /* ---------- helpers ---------- */
  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var MON_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(n, arguments[i]);
    return n;
  }
  function append(n, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(n, k); }); return; }
    n.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function isPlaceholder(s) { return /^\s*\[[^\]]*\]\s*$/.test(s || ''); }

  // Only allow web links, email links, or files inside this site.
  function safeUrl(u) {
    u = String(u || '').trim();
    if (!u || isPlaceholder(u)) return null;
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[\w@.-]+@[\w.-]+\.[a-z]{2,}$/i.test(u)) return 'mailto:' + u;
    if (!/:/.test(u) && !/^\/\//.test(u)) return u;
    return null;
  }

  function parseDate(s) {
    s = String(s || '').replace(/[\[\]]/g, '').trim();
    var m, d;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) d = make(+m[1], +m[2] - 1, +m[3]);
    else if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/))) d = make(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[1] - 1, +m[2]);
    else if ((m = s.match(/^(?:[a-z]+\.?,?\s+)?([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i))) {
      var mi = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
      if (mi >= 0) d = make(+m[3], mi, +m[2]);
    }
    return d || null;
    function make(y, mo, day) {
      var x = new Date(y, mo, day);
      return x.getMonth() === mo && x.getDate() === day ? x : null;
    }
  }
  function today() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function fmtDate(d) { return DOW[d.getDay()] + ', ' + MON_SHORT[d.getMonth()] + ' ' + d.getDate(); }
  function fmtLong(d) { return DOW[d.getDay()] + ', ' + MON_LONG[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }

  // Turn https:// links inside plain text into clickable links.
  function linkify(text) {
    var out = [];
    String(text).split(/(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]])/).forEach(function (part, i) {
      if (i % 2) out.push(el('a', { href: part }, part));
      else if (part) out.push(part);
    });
    return out;
  }

  /* ---------- 2. Read updates.txt ---------- */
  var SECTIONS = {
    settings: 'settings',
    weeklyreminder: 'reminder', reminder: 'reminder',
    thisweek: 'week', weeklyitinerary: 'week',
    upcomingevents: 'events', events: 'events',
    competitions: 'competitions',
    summerdates: 'summer',
    bandcamp: 'bandcamp'
  };

  function parseUpdates(text) {
    var data = {
      settings: {}, reminder: { title: '', lines: [] }, week: { label: '', rows: [] },
      events: [], competitions: [], summer: [], bandcamp: [], warnings: []
    };
    var section = null;
    String(text).replace(/^﻿/, '').split(/\r?\n/).forEach(function (raw, i) {
      var lineNo = i + 1;
      var line = raw.trim();
      function warn(msg) { data.warnings.push({ line: lineNo, text: raw.trim(), msg: msg }); }

      if (line.charAt(0) === '#') return;
      if (!line) {
        if (section === 'reminder' && data.reminder.lines.length) data.reminder.lines.push('');
        return;
      }
      var h = line.match(/^=+\s*(.*?)\s*=+$/);
      if (h) {
        section = SECTIONS[norm(h[1])] || null;
        if (!section) warn('I don\'t recognize the section name "' + h[1] + '". Lines under it will be ignored until the next section.');
        return;
      }
      if (!section) { warn('This line isn\'t under a section heading, so it was ignored.'); return; }

      var cols = line.split('|').map(function (c) { return c.trim(); });
      var kv = line.match(/^([^:|]{1,40}):\s*(.*)$/);

      switch (section) {
        case 'settings':
          if (kv) data.settings[norm(kv[1])] = kv[2].trim();
          else warn('Settings should look like  Name: value');
          break;

        case 'reminder':
          if (!data.reminder.title && !data.reminder.lines.length && /^title\s*:/i.test(line)) {
            data.reminder.title = line.replace(/^title\s*:\s*/i, '');
          } else data.reminder.lines.push(line);
          break;

        case 'week':
          if (/^week\s*of\s*:/i.test(line)) { data.week.label = line.replace(/^week\s*of\s*:\s*/i, ''); break; }
          if (cols.length < 2) { warn('Weekly itinerary lines need columns separated by |  (Day | Time | Who | What & where)'); break; }
          data.week.rows.push({ day: cols[0], time: cols[1] || '', who: cols[2] || '', what: cols.slice(3).join(' | ') });
          break;

        case 'events':
          if (cols.length < 2) { warn('Event lines need columns separated by |  (Date | Time | Event | Location | Group)'); break; }
          var ed = parseDate(cols[0]);
          if (!ed) warn('I couldn\'t read the date "' + cols[0] + '". Try a format like  Nov 14, 2026');
          data.events.push({ date: ed, dateText: cols[0], time: cols[1] || '', name: cols[2] || '', location: cols[3] || '', group: cols[4] || '', line: lineNo });
          break;

        case 'competitions':
          if (cols.length < 2) { warn('Competition lines need columns separated by |  (Date | Competition | Location | Report | Perform | Return | Link)'); break; }
          var cd = parseDate(cols[0]);
          if (!cd) warn('I couldn\'t read the date "' + cols[0] + '". Try a format like  Nov 14, 2026');
          if (cols[6] && !isPlaceholder(cols[6]) && !safeUrl(cols[6])) warn('The itinerary link doesn\'t look like a web address (it should start with https://).');
          data.competitions.push({ date: cd, dateText: cols[0], name: cols[1] || '', location: cols[2] || '', report: cols[3] || '', perform: cols[4] || '', back: cols[5] || '', link: safeUrl(cols[6]), line: lineNo });
          break;

        case 'summer':
          if (cols.length < 2) { warn('Summer date lines need columns separated by |  (Date | What | Time | Where)'); break; }
          data.summer.push({ date: cols[0], what: cols[1] || '', time: cols[2] || '', where: cols[3] || '' });
          break;

        case 'bandcamp':
          if (kv) data.bandcamp.push({ label: kv[1].trim(), value: kv[2].trim() });
          else data.bandcamp.push({ label: '', value: line });
          break;
      }
    });

    var s = norm(data.settings.season);
    data.season = /^off/.test(s) ? 'off' : 'in';
    if (data.settings.season === undefined) data.warnings.push({ line: 0, text: '', msg: 'No "Season:" setting found, so the site is showing in-season.' });
    else if (!/^(in|on|off)/.test(s)) data.warnings.push({ line: 0, text: data.settings.season, msg: 'Season should be  in-season  or  off-season.  Showing in-season for now.' });

    // Everything with a date, for "What's coming up" and the full list.
    data.allDated = data.events.filter(function (e) { return e.date; })
      .concat(data.competitions.filter(function (c) { return c.date; }).map(function (c) {
        return { date: c.date, time: c.report ? 'Report ' + c.report : '', name: c.name, location: c.location, group: 'Marching Band & Color Guard', competition: true };
      }))
      .sort(function (a, b) { return a.date - b.date; });
    var t0 = today();
    data.upcoming = data.allDated.filter(function (e) { return e.date >= t0; });
    return data;
  }

  /* ---------- renderers ---------- */
  function eventItem(e, headingTag) {
    var meta = [e.time, e.location].filter(Boolean).join(' · ');
    return el('li', { class: 'event' },
      el('div', { class: 'date-badge', 'aria-hidden': 'true' },
        el('span', { class: 'mon', text: MON_SHORT[e.date.getMonth()] }),
        el('span', { class: 'day', text: e.date.getDate() }),
        el('span', { class: 'dow', text: DOW[e.date.getDay()] })),
      el('div', { class: 'event-body' },
        el(headingTag || 'h3', { class: 'event-title' }, e.name || 'Event'),
        el('p', { class: 'event-date' }, el('span', { class: 'visually-hidden', text: 'Date: ' }), fmtLong(e.date)),
        meta ? el('p', { class: 'event-meta', text: meta }) : null,
        e.group ? el('span', { class: 'tag', text: e.group }) : null));
  }

  function emptyNote(text) { return el('p', { class: 'empty-note', text: text }); }

  function stackTable(headers, rows, rowClass) {
    return el('div', { class: 'table-wrap' },
      el('table', { class: 'stack-table' },
        el('thead', null, el('tr', null, headers.map(function (h) { return el('th', { scope: 'col', text: h }); }))),
        el('tbody', null, rows.map(function (r, i) {
          return el('tr', { class: rowClass ? rowClass(i) : null }, r.map(function (cell, j) {
            return el('td', { 'data-label': headers[j] }, cell);
          }));
        }))));
  }

  function itineraryLink(c, compact) {
    if (c.link) return el('a', { href: c.link, class: compact ? null : 'btn btn-primary' }, compact ? 'View itinerary' : 'Open full itinerary');
    return el('span', { class: 'muted', text: 'Itinerary coming soon' });
  }

  var renderers = {
    upcoming: function (node, d) {
      var n = node.getAttribute('data-upcoming');
      clear(node);
      if (n === 'all') {
        if (!d.upcoming.length) { node.appendChild(emptyNote('Nothing on the calendar right now. Check back soon!')); return; }
        var groups = [];
        d.upcoming.forEach(function (e) {
          var key = e.date.getFullYear() + '-' + e.date.getMonth();
          if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key: key, label: MON_LONG[e.date.getMonth()] + ' ' + e.date.getFullYear(), items: [] });
          groups[groups.length - 1].items.push(e);
        });
        groups.forEach(function (g) {
          node.appendChild(el('h3', { class: 'month-head', text: g.label }));
          node.appendChild(el('ul', { class: 'event-list' }, g.items.map(function (e) { return eventItem(e, 'h4'); })));
        });
        return;
      }
      var list = d.upcoming.slice(0, parseInt(n, 10) || 3);
      if (!list.length) { node.appendChild(emptyNote('Nothing on the calendar right now. Check back soon!')); return; }
      node.appendChild(el('ul', { class: 'event-list event-grid' }, list.map(function (e) { return eventItem(e, 'h3'); })));
    },

    reminder: function (node, d) {
      var lines = d.reminder.lines.slice();
      while (lines.length && lines[lines.length - 1] === '') lines.pop();
      var wrap = node.closest('[data-reminder-wrap]') || node;
      if (!lines.length && !d.reminder.title) { wrap.hidden = true; return; }
      var titleNode = document.querySelector('[data-reminder-title]');
      if (titleNode && d.reminder.title) titleNode.textContent = d.reminder.title;
      clear(node);
      var ul = null, para = null;
      lines.forEach(function (l) {
        if (/^[-*•]\s+/.test(l)) {
          para = null;
          if (!ul) { ul = el('ul'); node.appendChild(ul); }
          ul.appendChild(el('li', null, linkify(l.replace(/^[-*•]\s+/, ''))));
        } else if (l === '') { ul = null; para = null; }
        else {
          ul = null;
          if (!para) { para = el('p'); node.appendChild(para); } else para.appendChild(document.createTextNode(' '));
          append(para, linkify(l));
        }
      });
    },

    week: function (node, d) {
      clear(node);
      var label = document.querySelector('[data-week-label]');
      if (label) label.textContent = d.week.label ? 'Week of ' + d.week.label : '';
      if (!d.week.rows.length) { node.appendChild(emptyNote('This week\'s itinerary will be posted soon.')); return; }
      node.appendChild(stackTable(['Day', 'Time', 'Who', 'What & where'],
        d.week.rows.map(function (r) { return [el('strong', { text: r.day }), r.time, r.who, r.what]; })));
    },

    competitions: function (node, d) {
      var mode = node.getAttribute('data-competitions');
      clear(node);
      if (!d.competitions.length) { node.appendChild(emptyNote('Our competition schedule will be posted soon.')); return; }
      var t0 = today();
      if (mode === 'table') {
        node.appendChild(stackTable(['Date', 'Competition', 'Location', 'Perform', 'Itinerary'],
          d.competitions.map(function (c) {
            var past = c.date && c.date < t0;
            return [c.date ? fmtDate(c.date) : c.dateText, el('span', null, el('strong', { text: c.name }), past ? el('span', { class: 'tag tag-muted', text: 'Done' }) : null),
              c.location, c.perform, itineraryLink(c, true)];
          }),
          function (i) { var c = d.competitions[i]; return c.date && c.date < t0 ? 'is-past' : null; }));
        return;
      }
      // cards: upcoming first, then past
      var up = d.competitions.filter(function (c) { return !c.date || c.date >= t0; });
      var past = d.competitions.filter(function (c) { return c.date && c.date < t0; });
      if (!up.length) node.appendChild(emptyNote('No upcoming competitions right now.'));
      else node.appendChild(el('div', { class: 'grid grid-2' }, up.map(compCard)));
      if (past.length) {
        node.appendChild(el('details', { class: 'past-list' },
          el('summary', null, 'Earlier this season (' + past.length + ')'),
          el('div', { class: 'grid grid-2' }, past.map(compCard))));
      }
      function compCard(c) {
        return el('article', { class: 'card comp-card' },
          el('p', { class: 'comp-date', text: c.date ? fmtLong(c.date) : c.dateText }),
          el('h3', { text: c.name || 'Competition' }),
          c.location ? el('p', { class: 'muted', text: c.location }) : null,
          el('dl', { class: 'times' },
            el('div', null, el('dt', { text: 'Report' }), el('dd', { text: c.report || 'TBA' })),
            el('div', null, el('dt', { text: 'Perform' }), el('dd', { text: c.perform || 'TBA' })),
            el('div', null, el('dt', { text: 'Home (approx.)' }), el('dd', { text: c.back || 'TBA' }))),
          itineraryLink(c, false));
      }
    },

    summer: function (node, d) {
      clear(node);
      if (!d.summer.length) { node.appendChild(emptyNote('Summer dates will be posted soon.')); return; }
      node.appendChild(stackTable(['Date', 'What', 'Time', 'Where'],
        d.summer.map(function (r) { return [el('strong', { text: r.date }), r.what, r.time, r.where]; })));
    },

    bandcamp: function (node, d) {
      clear(node);
      if (!d.bandcamp.length) { node.appendChild(emptyNote('Band camp details will be posted soon.')); return; }
      node.appendChild(el('dl', { class: 'detail-list' }, d.bandcamp.map(function (r) {
        var url = /^(https?:|mailto:)/i.test(r.value) || /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(r.value) ? safeUrl(r.value) : null;
        return el('div', null, r.label ? el('dt', { text: r.label }) : null,
          el('dd', null, url ? el('a', { href: url, text: r.value.replace(/^mailto:/i, '') }) : linkify(r.value)));
      })));
    },

    calendarEmbed: function (node, d) {
      var url = safeUrl(d.settings.googlecalendarlink || d.settings.calendarlink);
      if (!url || !/^https:\/\/calendar\.google\.com\//i.test(url)) return; // keep the placeholder
      clear(node);
      node.classList.add('has-embed');
      node.appendChild(el('iframe', { src: url, title: 'Seneca Music full calendar (Google Calendar)', loading: 'lazy' }));
      var open = document.querySelector('[data-calendar-open]');
      if (open) { open.href = url; open.hidden = false; }
    },

    settingLink: function (node, d) {
      var url = safeUrl(d.settings[norm(node.getAttribute('data-setting-link'))]);
      if (url) { node.href = url; node.removeAttribute('aria-disabled'); node.classList.remove('is-disabled'); var note = node.querySelector('.link-note'); if (note) note.remove(); }
    },

    season: function (d) {
      document.querySelectorAll('[data-season-show]').forEach(function (n) {
        n.hidden = n.getAttribute('data-season-show') !== d.season;
      });
      document.querySelectorAll('[data-season-label]').forEach(function (n) {
        n.textContent = d.season === 'off' ? 'Off-season: getting ready for next fall' : 'In season: competition time!';
      });
    },

    checker: function (node, d) {
      clear(node);
      var ok = !d.warnings.length;
      node.appendChild(el('div', { class: ok ? 'check-ok' : 'check-warn' },
        el('h2', { text: ok ? 'Looks good! No problems found.' : 'Found ' + d.warnings.length + ' thing' + (d.warnings.length > 1 ? 's' : '') + ' to check' }),
        ok ? el('p', { text: 'Everything in updates.txt was read correctly. Here\'s what the website is showing.' }) :
          el('ul', null, d.warnings.map(function (w) {
            return el('li', null, w.line ? el('strong', { text: 'Line ' + w.line + ': ' }) : null, w.msg,
              w.text ? el('code', { class: 'check-line', text: w.text }) : null);
          }))));
      var t0 = today();
      var summary = [
        ['Season', d.season === 'off' ? 'Off-season (summer dates & band camp showing)' : 'In-season (competition table showing)'],
        ['Weekly reminder', d.reminder.lines.filter(Boolean).length ? (d.reminder.title || 'Untitled') : 'Hidden (no text)'],
        ['This week', d.week.rows.length + ' line(s)' + (d.week.label ? ', week of ' + d.week.label : '')],
        ['Upcoming events', d.events.filter(function (e) { return e.date && e.date >= t0; }).length + ' upcoming, ' + d.events.filter(function (e) { return e.date && e.date < t0; }).length + ' past (hidden)'],
        ['Competitions', d.competitions.length + ' total'],
        ['Summer dates', d.summer.length + ' line(s)'],
        ['Band camp details', d.bandcamp.length + ' line(s)'],
        ['Google Calendar link', safeUrl(d.settings.googlecalendarlink) ? 'Set' : 'Not set yet'],
        ['Member Google Drive link', safeUrl(d.settings.membergoogledrivelink) ? 'Set' : 'Not set yet']
      ];
      node.appendChild(el('h2', { text: 'What the website read' }));
      node.appendChild(stackTable(['Item', 'Status'], summary.map(function (r) { return [el('strong', { text: r[0] }), r[1]]; })));
      node.appendChild(el('h2', { text: 'Next 3 events on the home page' }));
      node.appendChild(d.upcoming.length ? el('ul', { class: 'event-list' }, d.upcoming.slice(0, 3).map(function (e) { return eventItem(e, 'h3'); })) : emptyNote('None.'));
    }
  };

  var targets = {
    upcoming: document.querySelectorAll('[data-upcoming]'),
    reminder: document.querySelectorAll('[data-reminder]'),
    week: document.querySelectorAll('[data-week]'),
    competitions: document.querySelectorAll('[data-competitions]'),
    summer: document.querySelectorAll('[data-summer]'),
    bandcamp: document.querySelectorAll('[data-bandcamp]'),
    calendarEmbed: document.querySelectorAll('[data-calendar-embed]'),
    settingLink: document.querySelectorAll('[data-setting-link]'),
    checker: document.querySelectorAll('[data-checker]')
  };
  var needsData = document.querySelector('[data-season-show]') || Object.keys(targets).some(function (k) { return targets[k].length; });
  if (!needsData) return;

  fetch('updates.txt', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(function (text) {
      var d = parseUpdates(text);
      renderers.season(d);
      Object.keys(targets).forEach(function (k) {
        targets[k].forEach(function (node) {
          try { renderers[k](node, d); } catch (err) { console.error('Seneca Music: could not show', k, err); }
        });
      });
    })
    .catch(function (err) {
      console.error('Seneca Music: could not load updates.txt', err);
      ['upcoming', 'reminder', 'week', 'competitions', 'summer', 'bandcamp', 'checker'].forEach(function (k) {
        targets[k].forEach(function (node) {
          clear(node);
          node.appendChild(emptyNote('We couldn\'t load the latest updates. Please refresh the page, or check Instagram @senmarchingband.'));
        });
      });
    });
})();
