// Shared JavaScript for the Practice Caddie pages.
$(document).ready(function () {
  var parameters = new URLSearchParams(window.location.search);

  // These are sample sessions, not records from a database.
  var sessions = [
    {
      id: "putting-wedges",
      date: "2026-09-10",
      dateLabel: "September 10, 2026",
      title: "Putting + Wedges",
      location: "Home Course Golf Center",
      duration: 42,
      areas: ["putting", "wedges"],
      clubs: "Putter, 56 Degree",
      focus: "Putting",
      effort: "Moderate",
      result: "Good",
      summary: "Putting: 18 of 20 made from three feet. Wedges: 10 of 15 inside fifteen feet from 50 yards.",
      notes: "Tempo felt better after slowing the backswing on shorter putts. Wedge contact was solid, but distance control drifted long once tired.",
      drills: [
        { title: "3 Foot Circle Drill", result: "18 of 20 made from around the hole.", score: "90%" },
        { title: "6 Foot Straight Putts", result: "40 of 50 made with the same pre-shot routine.", score: "80%" },
        { title: "50 Yard Wedge Ladder", result: "10 of 15 shots finished inside the fifteen-foot target circle.", score: "67%" }
      ]
    },
    {
      id: "driver",
      date: "2026-09-09",
      dateLabel: "September 9, 2026",
      title: "Driver",
      location: "Home Course Golf Center",
      duration: 45,
      areas: ["driving"],
      clubs: "Driver",
      focus: "Driving",
      effort: "High",
      result: "Mixed",
      summary: "Recorded a max drive of 320 yards and kept 12 of 25 balls inside the fairway target zone.",
      notes: "Slower tempo improved contact. Next time, prioritize dispersion over maximum distance.",
      drills: [
        { title: "Fairway Target Drill", result: "12 of 25 drives inside the fairway-width target.", score: "48%" }
      ]
    },
    {
      id: "wedges",
      date: "2026-09-08",
      dateLabel: "September 8, 2026",
      title: "Wedges",
      location: "Home Course Golf Center",
      duration: 35,
      areas: ["wedges"],
      clubs: "56 Degree",
      focus: "Wedges",
      effort: "Moderate",
      result: "Improving",
      summary: "Hit 10 of 50 shots within three feet from 50 yards and finished with improved distance control.",
      notes: "Consistent backswing length helped with distance control in the final set.",
      drills: [
        { title: "50 Yard Precision Drill", result: "10 of 50 shots finished within three feet.", score: "20%" }
      ]
    }
  ];

  var practicePlans = {
    driving: {
      label: "Driving",
      minutes: 30,
      note: "Build a repeatable swing and track fairway-width misses.",
      drills: ["15 drives with your normal setup", "10 drives with a slower tempo", "Record how many finish inside a fairway-width target"]
    },
    putting: {
      label: "Putting",
      minutes: 20,
      note: "Work on start line and a consistent pre-shot routine.",
      drills: ["20 putts around the hole from three feet", "20 straight putts from six feet", "10 lag putts with a three-foot finishing circle"]
    },
    wedges: {
      label: "Wedges",
      minutes: 25,
      note: "Match backswing length to your target distance.",
      drills: ["10 wedge shots to a 30-yard target", "10 wedge shots to a 50-yard target", "10 wedge shots to a 70-yard target"]
    },
    irons: {
      label: "Irons",
      minutes: 30,
      note: "Choose a specific target and repeat your setup.",
      drills: ["10 half swings with a 7 iron", "15 full swings at a green-width target", "Alternate 5 iron and 9 iron for ten shots"]
    },
    "short-game": {
      label: "Short game",
      minutes: 20,
      note: "Practice landing spots from different lies.",
      drills: ["10 chips from a tight lie", "10 chips from light rough", "Finish with five up-and-down attempts"]
    }
  };

  function findSession(id) {
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].id === id) {
        return sessions[i];
      }
    }
    return null;
  }

  function makeSaveButton(session) {
    var button = $("<button type='button' class='save-session'>");
    button.attr("data-session-title", session.title);
    button.attr("aria-pressed", "false");
    button.attr("aria-label", "Save " + session.title + " for later");
    button.text("Save for later");
    return button;
  }

  // Reuse the same cards on the history and search pages.
  function showSessions(list, matchingSessions) {
    list.empty();

    for (var i = 0; i < matchingSessions.length; i++) {
      var session = matchingSessions[i];
      var card = $("<article class='panel session-card'>");
      card.attr("data-session-id", session.id);

      var heading = $("<div class='row spread'>");
      heading.append($("<h3>").text(session.title));
      var date = $("<time class='session-meta'>").text(session.dateLabel);
      date.attr("datetime", session.date);
      heading.append(date);
      card.append(heading);
      card.append($("<p>").text(session.location + " · " + session.duration + " minutes"));
      card.append($("<p>").text(session.summary));

      var actions = $("<div class='row'>");
      var link = $("<a>").text("View details");
      link.attr("href", "session-detail.html?id=" + session.id);
      link.attr("aria-label", "View " + session.title + " details");
      actions.append(link);
      actions.append(makeSaveButton(session));
      card.append(actions);
      list.append(card);
    }
  }

  // Interaction 1: delegate clicks to main so new buttons work too.
  $("#main-content").on("click", ".save-session", function () {
    var button = $(this);
    var card = button.closest(".session-card, #detail-actions");
    var title = button.attr("data-session-title");

    // The button itself tells us whether this session is currently selected.
    if (button.attr("aria-pressed") === "false") {
      card.addClass("is-saved");
      button.attr("aria-pressed", "true");
      button.attr("aria-label", "Unsave " + title + " for later");
      button.text("Remove from saved");
      card.append("<p class='saved-message'>Marked for review in this view.</p>");
      $("#saved-status").text(title + " saved in this view.");
    } else {
      card.removeClass("is-saved");
      button.attr("aria-pressed", "false");
      button.attr("aria-label", "Save " + title + " for later");
      button.text("Save for later");
      card.find(".saved-message").remove();
      $("#saved-status").text(title + " removed from saved sessions.");
    }
  });

  // Simulated search: only the keyphrase "putting" returns results.
  if ($("#search-results").length > 0) {
    var phrase = parameters.get("q") || "";
    $("#header-query").val(phrase);

    if (phrase.trim().toLowerCase() === "putting") {
      $("#search-summary").text('2 sample results for “' + phrase.trim() + '”.');
      showSessions($("#search-results"), [sessions[0]]);
      var result = $("<article class='panel'>");
      result.append("<h3>A focused putting plan</h3>");
      result.append("<p>Build a 20-minute routine with short putts, straight putts, and lag putting.</p>");
      result.append("<a href='dashboard.html?focus=putting#practice-planner'>Build a putting plan</a>");
      $("#search-results").append(result);
    } else {
      if (phrase.trim() === "") {
        $("#search-summary").text("Enter a phrase to see sample search results.");
      } else {
        // Use .text() so a user's search is displayed as text, not HTML.
        $("#search-summary").text('No results for “' + phrase.trim() + '”.');
      }
      var notice = $("<section class='panel'>");
      notice.append("<h2>No matching results yet</h2>");
      notice.append('<p>Try “putting” in the search box above to explore a sample session and practice plan.</p>');
      notice.append("<a href='sessions.html'>Browse all sample sessions</a>");
      $("#search-results").append(notice);
    }
  }

  // History filters: check each sample session against the form fields.
  function filterSessions() {
    var phrase = $("#session-search").val().trim().toLowerCase();
    var location = $("#location-filter").val().trim().toLowerCase();
    var from = $("#date-from").val();
    var to = $("#date-to").val();
    var selectedAreas = $("#session-filters input[name='area']:checked");
    var matches = [];

    for (var i = 0; i < sessions.length; i++) {
      var session = sessions[i];
      var text = (session.title + " " + session.summary + " " + session.areas.join(" ")).toLowerCase();
      var matchesArea = selectedAreas.length === 0;

      for (var j = 0; j < selectedAreas.length; j++) {
        if (session.areas.indexOf(selectedAreas[j].value) !== -1) {
          matchesArea = true;
        }
      }

      if (text.indexOf(phrase) === -1 || session.location.toLowerCase().indexOf(location) === -1) {
        continue;
      }
      if (from !== "" && session.date < from) {
        continue;
      }
      if (to !== "" && session.date > to) {
        continue;
      }
      if (matchesArea) {
        matches.push(session);
      }
    }

    var sortBy = $("#sort-sessions").val();
    matches.sort(function (a, b) {
      if (sortBy === "oldest") {
        return a.date.localeCompare(b.date);
      } else if (sortBy === "focus") {
        return a.focus.localeCompare(b.focus);
      } else if (sortBy === "location") {
        return a.location.localeCompare(b.location);
      } else {
        return b.date.localeCompare(a.date);
      }
    });

    showSessions($("#session-list"), matches);
    if (matches.length === 1) {
      $("#session-count").text("1 sample session");
    } else {
      $("#session-count").text(matches.length + " sample sessions");
    }
    $("#empty-sessions").prop("hidden", matches.length > 0);
  }

  if ($("#session-list").length > 0) {
    $("#session-search").val(parameters.get("search") || "");
    $("#date-from").val(parameters.get("date-from") || "");
    $("#date-to").val(parameters.get("date-to") || "");
    $("#location-filter").val(parameters.get("location") || "");
    var areasFromUrl = parameters.getAll("area");
    $("#session-filters input[name='area']").each(function () {
      $(this).prop("checked", areasFromUrl.indexOf(this.value) !== -1);
    });

    $("#session-filters").on("submit", function (event) {
      event.preventDefault();
      filterSessions();
    });
    $("#session-filters").on("reset", function () {
      // Wait for the browser to clear the fields before filtering again.
      setTimeout(filterSessions, 0);
    });
    $("#sort-sessions").on("change", filterSessions);
    filterSessions();
  }

  // Display the sample selected by the detail link's id.
  if ($("#session-overview").length > 0) {
    var sessionId = parameters.get("id") || "putting-wedges";
    var selectedSession = findSession(sessionId);

    if (selectedSession) {
      document.title = selectedSession.title + " | Practice Caddie";
      $("#detail-title").text(selectedSession.title);
      $("#detail-date").attr("datetime", selectedSession.date);
      $("#detail-date").text(selectedSession.dateLabel);
      $("#detail-location").text(selectedSession.location);
      $("#detail-duration").text(selectedSession.duration + " minutes");
      $("#detail-focus").text(selectedSession.focus);
      $("#detail-clubs").text(selectedSession.clubs);
      $("#detail-effort").text(selectedSession.effort);
      $("#detail-result").text(selectedSession.result);
      $("#detail-notes").text(selectedSession.notes);

      $("#detail-drills").empty();
      for (var i = 0; i < selectedSession.drills.length; i++) {
        var drill = selectedSession.drills[i];
        var row = $("<article class='drill-row row spread'>");
        var description = $("<div>");
        description.append($("<h3>").text(drill.title));
        description.append($("<p>").text(drill.result));
        row.append(description);
        row.append($("<strong class='score'>").text(drill.score));
        $("#detail-drills").append(row);
      }

      $("#detail-actions .action-buttons").append(makeSaveButton(selectedSession));
    } else {
      $("#main-content").empty();
      $("#main-content").append("<h1>Session not found</h1>");
      $("#main-content").append("<p>This sample session is unavailable. Choose another session from your history.</p>");
      $("#main-content").append("<a href='sessions.html'>Back to session history</a>");
    }
  }

  // Interaction 2: changing the focus updates the panel and adds drill steps.
  function makePracticePlan() {
    var focus = $("#focus-area").val();
    var plan;
    switch (focus) {
      case "driving": plan = practicePlans.driving; break;
      case "putting": plan = practicePlans.putting; break;
      case "wedges": plan = practicePlans.wedges; break;
      case "irons": plan = practicePlans.irons; break;
      case "short-game": plan = practicePlans["short-game"]; break;
      default: return;
    }

    // Traverse up to this control's panel, then find its other elements.
    var panel = $("#focus-area").closest(".practice-planner");
    panel.addClass("has-plan");
    panel.find(".plan-title").text("Next session: " + plan.label.toLowerCase());
    panel.find(".plan-description").text(plan.note);
    panel.find(".plan-status").text(plan.minutes + "-minute " + plan.label.toLowerCase() + " plan ready.");

    var steps = $("<ol class='plan-steps'>");
    for (var i = 0; i < plan.drills.length; i++) {
      steps.append($("<li>").text(plan.drills[i]));
    }
    panel.find(".plan-content").empty();
    panel.find(".plan-content").append(steps);
    var note = $("<p class='plan-note'>");
    note.text("Suggested time: " + plan.minutes + " minutes. Record your results after practice.");
    panel.find(".plan-content").append(note);
  }

  $("#focus-area").on("change", makePracticePlan);

  // A search result can link directly to the putting plan.
  var focusFromUrl = parameters.get("focus");
  var validFocuses = ["driving", "putting", "wedges", "irons", "short-game"];
  if ($("#focus-area").length > 0 && validFocuses.indexOf(focusFromUrl) !== -1) {
    $("#focus-area").val(focusFromUrl);
    makePracticePlan();
  }
});
