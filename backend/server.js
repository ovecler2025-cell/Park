const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Google API Setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });

// Google Sheet ID
const SPREADSHEET_ID = '1xBKMM05EJuYpjsYircHfXGrN7AlbrMCv_1BOPE6eBMc';

// Upload Resim to Drive
async function uploadToDrive(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: ['<FOLDER_ID>'] // Drive klasör ID'si
  };
  const media = { body: fs.createReadStream(filePath) };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink'
  });
  return response.data.webViewLink;
}

// Add Data to Sheet
async function addToSheet(rowData) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sayfa1!A1',
    valueInputOption: 'USER_ENTERED',
    resource: { values: [rowData] }
  });
}

// API: Add Record
app.post('/add', upload.array('resimler', 2), async (req, res) => {
  try {
    const { baslik, tarih, aciklama, tab } = req.body;
    const files = req.files;
    let urls = [];

    for (let f of files) {
      const url = await uploadToDrive(f.path, f.originalname);
      urls.push(url);
      fs.unlinkSync(f.path); // temp dosyayı sil
    }

    let row = [tab, baslik, tarih, aciklama, urls[0]||'', urls[1]||''];
    await addToSheet(row);

    res.json({ success: true, urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
