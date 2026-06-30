const SPREADSHEET_ID = "";
const SHEET_NAME = "Заявки";

const HEADERS = [
  "Дата",
  "Источник",
  "ФИО",
  "Страна гражданства",
  "Город проживания",
  "Возраст",
  "Телефон / WhatsApp / Telegram",
  "Есть действующий паспорт?",
  "Есть диплом или аттестат?",
  "Когда готовы рассматривать выезд?",
  "Комментарий",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    ensureHeaders_(sheet);

    const data = e.parameter || {};
    sheet.appendRow([
      new Date(),
      data.source || "",
      data.fullName || "",
      data.citizenship || "",
      data.city || "",
      data.age || "",
      data.contact || "",
      data.hasPassport || "",
      data.hasEducation || "",
      data.departureTime || "",
      data.comment || "",
    ]);

    return jsonResponse_({
      status: "success",
    });
  } catch (error) {
    return jsonResponse_({
      status: "error",
      message: error.message,
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    status: "ready",
  });
}

function getSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Укажите SPREADSHEET_ID или привяжите скрипт к Google Таблице.");
  }

  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some((cell) => cell);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
