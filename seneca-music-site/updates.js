/* ==========================================================
   SENECA MUSIC — WEEKLY UPDATES
   This is the ONLY file you need to edit each week.
   Change the text between the quote marks, then save.
   Keep the commas and quote marks where they are.
   ========================================================== */

window.SITE = {

  // The one reminder shown on the home page. Change it every Monday.
  reminder: "[This week's reminder: a form due, a uniform change, a fundraiser deadline.]",

  // The date you last updated this file (shown under "What's coming up").
  updated: "[Monday, Month Day]",

  // Marching Band page mode. Use "in-season" (fall) or "recruiting" (spring/summer).
  season: "in-season",

  // Show title for the current marching season.
  showTitle: "[Show Title]",

  // Next few events on the home page. Add, remove or reorder freely.
  // month = 3-letter month, day = number.
  events: [
    { month: "[Mon]", day: "[##]", name: "[Event name, e.g. Winter Concert]", details: "[Time], [Location], call time [time]" },
    { month: "[Mon]", day: "[##]", name: "[Event name]", details: "[Time], [Location]" },
    { month: "[Mon]", day: "[##]", name: "[Event name]", details: "[Time], [Location]" }
  ],

  // Marching Band page, in-season mode: remaining competitions.
  competitions: [
    { date: "[Date]", event: "[Competition name]", location: "[Host school]", callTime: "[Time]", itineraryLink: "#" },
    { date: "[Date]", event: "[Competition name]", location: "[Host school]", callTime: "[Time]", itineraryLink: "#" }
  ],

  // Marching Band page, recruiting mode: summer dates.
  summerDates: [
    { when: "[Date], 5:30 PM", what: "First summer rehearsal for all members" },
    { when: "[Date], 5:30 PM", what: "Rehearsal. Last day to join without an audition", highlight: true },
    { when: "[Date], 5:30 PM", what: "Rehearsal. First-timers need a short audition and a meeting with the director" },
    { when: "[Week 1] and [Week 2]", what: "Band camp, all day with two meal breaks. Full participation required", highlight: true }
  ],

  // Recruiting progress bar.
  members: 47,
  memberGoal: 50
};
