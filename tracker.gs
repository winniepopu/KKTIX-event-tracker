const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/please-input-your-webhook'; 
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/please-input-your-sheet-id'
const EVENT_URLS = {
  'event name 1': 'https://pycontw.kktix.cc/events/please-input-your-event-id',
  //'event name 2': 'https://pycontw.kktix.cc/events/please-input-your-event-id',
};

function recordTicketCount() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration Stats') 
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registration Stats');
  const now = new Date();
  const urls = EVENT_URLS;

  const counts = {};
  for (const [label, url] of Object.entries(urls)) {
    const match = readTicketCount(url);
    counts[label] = match ? Number(match[1]) : 0;
  }

  // If this is the first run, create headers: Date + labels from urls + Total
  if (sheet.getLastRow() === 0) {
    const headers = ['Date', ...Object.keys(urls), 'Total'];
    sheet.appendRow(headers);
  }

  // Calculate total participants
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Append new row: Date + each ticket count + Total
  const row = [now, ...Object.keys(urls).map(k => counts[k]), total];
  sheet.appendRow(row);

  drawChart();
  sendToDiscord(now, counts, total);
}

function readTicketCount(url) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const match = html.match(/<i class="fa fa-male"><\/i>\s*(\d+)\s*\/\s*(\d+)/);
  if (!match) {
    Logger.log("No registration info found at: " + url);
    return null;
  }
  return match;
}

function drawChart() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration Stats');
  const range = sheet.getRange(1, 1, sheet.getLastRow(), 5);

  const charts = sheet.getCharts();
  for (let chart of charts) {
    sheet.removeChart(chart); // Remove old charts
  }

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(range.offset(0, 0, sheet.getLastRow(), 2)) // Date + first event
    .addRange(range.offset(0, 1, sheet.getLastRow(), 4)) // All events + Total
    .setPosition(2, 7, 0, 0)
    .setOption('title', 'PyCon TW 2025 Registration Trend')
    .setOption('curveType', 'function')
    .setOption('legend', { position: 'bottom' })
    .build();

  sheet.insertChart(chart);
}

function sendToDiscord(date, counts, total) {
  const webhookUrl = DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    Logger.log('Webhook URL is not set');
    return;
  }

  const formattedDate = Utilities.formatDate(date, 'Asia/Taipei', 'yyyy-MM-dd HH:mm');

  // Generate ticket info lines dynamically
  const lines = Object.entries(counts).map(
    ([label, value]) => `- ${label}: ${value} tickets`
  );

  const message = [
    `📊 Registration Status at ${formattedDate}`,
    ...lines,
    `✅ Total: ${total} participants`,
    `[View full report here](${SHEET_URL})`
  ].join('\n');

  const payload = JSON.stringify({ content: message });

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch(webhookUrl, options);
}
