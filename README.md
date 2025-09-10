# KKTIX Event Tracker with Discord Notification

This Google Apps Script automatically fetches the number of registrations from **KKTIX event pages**, records the data into a Google Sheet, and posts updates to a **Discord channel**.
It also generates a registration trend chart inside the spreadsheet.

---

## Features

1. Fetches registration counts from specified KKTIX event pages.
2. Records the date, counts for each event/ticket type, and total participants into a Google Sheet.
3. Automatically generates a **line chart** showing registration trends.
4. Sends registration updates to a Discord channel.

---

## Setup Instructions

1. Create a Google Spreadsheet.
2. Open the **Apps Script editor** and paste this code.
3. Update the required **variables** (see below).
4. (Optional) Set up a **time-based trigger** (e.g., every day at 8 AM) to run `recordTicketCount`.

---

## Variables to Modify

### 1. Discord Webhook URL

```javascript
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/XXXXXX';
```

* Go to your Discord channel → *Integrations* → *Webhook*, and create a new webhook.
* Copy and paste the webhook URL here.

---

### 2. Spreadsheet URL

```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/XXXXXX/edit';
```

* Replace this with the URL of your own Google Spreadsheet.

---

### 3. KKTIX Event URLs

```javascript
  const urls = {
    'PyCon TW Individual Ticket': 'https://pycontw.kktix.cc/events/2025-individual',
     // Add more events if needed
     //'PyCon TW Corporate Ticket': 'https://pycontw.kktix.cc/events/2025-corporate',
     //'PyCon TW Reserved Ticket': 'https://pycontw.kktix.cc/events/2025-reserved',
  };
```

* The **key** (e.g., `'PyCon TW Individual Ticket'`) will be used as the event/ticket name in the sheet and Discord message.
* The **value** is the KKTIX event URL.
* You can add multiple events, and the script will automatically include them in the sheet and messages.

---

## Output Example

* A new sheet called **"報名統計"** will be created in your spreadsheet.
* Each execution will append a row like this:

```
Date | Event 1 | Event 2 | ... | Total
```

* Discord message example:

```
📊 2025-09-10 10:30 Registration Status
- PyCon TW Individual Ticket: 35 tickets
✅ Total: 35 participants
[View Full Report](https://docs.google.com/spreadsheets/d/XXXXXX/edit)
```
