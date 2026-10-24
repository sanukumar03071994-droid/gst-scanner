// Google Sheet me: Extensions > Apps Script me ye paste karein, phir Deploy > New deployment > Web app
// (Execute as: Me, Who has access: Anyone). Naya URL milega, use index.html me daalein.
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var keys = Object.keys(data);

  // Pehli baar header row banao
  if (sheet.getLastRow() === 0) sheet.appendRow(keys);

  // Existing headers ke hisaab se columns match karo, naye keys ke liye column add karo
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  keys.forEach(function (k) {
    if (headers.indexOf(k) === -1) {
      headers.push(k);
      sheet.getRange(1, headers.length).setValue(k);
    }
  });
  var row = headers.map(function (h) { return data[h] !== undefined ? data[h] : ""; });
  sheet.appendRow(row);

  return ContentService.createTextOutput("OK");
}
