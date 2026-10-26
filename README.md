<!DOCTYPE html>
<html lang="hi" class="h-full bg-slate-50">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST e-Invoice QR & LR Barcode Reader Pro</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- ZXing Multi-Format QR & Barcode Engine -->
  <script src="https://unpkg.com/@zxing/library@latest"></script>
  <!-- HTML5 QR Code Library -->
  <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>

  <style>
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    
    .glow-indigo-light {
      box-shadow: 0 20px 40px -15px rgba(79, 70, 229, 0.12);
    }

    #reader video {
      border-radius: 1rem;
      object-fit: cover;
      width: 100% !important;
      height: 100% !important;
    }

    .scanner-laser-line {
      animation: scanLaser 2.2s infinite ease-in-out;
    }

    @keyframes scanLaser {
      0% { top: 5%; opacity: 0.4; }
      50% { top: 90%; opacity: 1; }
      100% { top: 5%; opacity: 0.4; }
    }

    .scanner-grid-bg {
      background-size: 24px 24px;
      background-image: 
        linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
    }

    .animate-pop-in {
      animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.95) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(241, 245, 249, 0.8);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.3);
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 text-slate-800 min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 font-sans selection:bg-indigo-500 selection:text-white">

  <!-- Glow Background Accents -->
  <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Header Section -->
  <header class="text-center my-2 sm:my-4 w-full max-w-xl z-10 animate-pop-in">
    <div class="inline-flex items-center gap-2 bg-indigo-100/80 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-700 text-xs font-bold mb-3 shadow-sm backdrop-blur-md">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span> 
      AI-Powered GST e-Invoice & LR Barcode Scanner
    </div>
    <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
      GST Invoice & LR Reader
    </h1>
    <p class="text-slate-500 text-xs sm:text-sm mt-1.5 font-medium">Dual Step High-Density Engine (QR Code + LR Barcode)</p>
  </header>

  <!-- Main Container -->
  <main class="w-full max-w-xl glass-card rounded-3xl p-4 sm:p-7 shadow-xl border border-slate-200 flex-1 flex flex-col justify-between z-10 glow-indigo-light relative overflow-hidden">
    
    <!-- Top Action Toolbar -->
    <div class="flex items-center justify-between bg-slate-100/80 p-3 rounded-2xl border border-slate-200 mb-5">
      <div class="flex items-center gap-2.5">
        <div class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
        <span id="activeModeText" class="text-xs font-extrabold tracking-wide text-indigo-900">DUAL SCAN MODE</span>
      </div>
      <button onclick="resetScanner()" class="bg-rose-50 hover:bg-rose-100 text-rose-700 active:scale-95 font-bold px-3.5 py-1.5 rounded-xl border border-rose-200 text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm">
        <span>🔄 Reset All</span>
      </button>
    </div>

    <!-- Scanner Section -->
    <section id="scannerSection" class="space-y-5 animate-pop-in">
      
      <!-- Progress Bar -->
      <div class="grid grid-cols-2 gap-3 bg-slate-100/70 p-2 rounded-2xl border border-slate-200">
        <div id="step1Indicator" class="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white shadow-md text-xs font-bold transition-all duration-300">
          <span class="w-5 h-5 rounded-full bg-white text-indigo-700 flex items-center justify-center text-[11px] font-black">1</span>
          <span class="truncate">Step 1: GST QR Code</span>
        </div>
        <div id="step2Indicator" class="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200/60 text-slate-500 text-xs font-bold transition-all duration-300">
          <span class="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[11px] font-black">2</span>
          <span class="truncate">Step 2: LR Barcode</span>
        </div>
      </div>

      <!-- Mode Title -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-3.5">
        <div>
          <h2 id="currentScanTitle" class="text-base sm:text-lg font-bold text-slate-900 tracking-wide">Scan GST QR Code</h2>
          <p id="currentScanSubtitle" class="text-xs text-slate-500 mt-0.5">Invoice ka QR Code photo upload karein ya camera se dekhein</p>
        </div>
        <span class="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
          HD Engine
        </span>
      </div>

      <!-- Scanner Box -->
      <div class="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center border border-indigo-200 shadow-inner group">
        <div id="reader" class="w-full h-full min-h-[280px] sm:min-h-[320px]"></div>
        
        <div id="placeholderView" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 scanner-grid-bg p-6 text-center z-10 border border-dashed border-slate-300 rounded-2xl transition-all">
          <div class="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-indigo-600"></div>
          <div class="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-indigo-600"></div>
          <div class="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-indigo-600"></div>
          <div class="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-indigo-600"></div>

          <div id="scannerIcon" class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-3xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
            📷
          </div>
          <p id="placeholderTitle" class="text-slate-900 font-bold text-sm tracking-wide">Scanner Ready For QR Code</p>
          <p id="placeholderDesc" class="text-slate-500 text-xs mt-1 max-w-xs">HD Camera ya Upload Image option select karein</p>
        </div>

        <div id="scanLaserAnimation" class="hidden absolute inset-0 pointer-events-none z-20">
          <div class="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#34d399] scanner-laser-line"></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="space-y-3 pt-1">
        <div class="grid grid-cols-2 gap-3">
          <button onclick="startCameraScanner()" class="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] font-bold py-3 px-4 rounded-xl transition-all duration-200 text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
            <span>📷 Live Camera</span>
          </button>

          <label class="bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-center cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md">
            <span>📁 Upload Image</span>
            <input type="file" id="qrFileInput" accept="image/*" class="hidden" onchange="processUploadedImage(this)">
          </label>
        </div>

        <button id="skipBarcodeBtn" onclick="skipBarcodeStep()" class="hidden w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition border border-slate-300">
          ⏩ Barcode Scan Skip Karein (Dekhein Sirf QR Data)
        </button>
      </div>
    </section>

    <!-- Combined Result Section -->
    <section id="resultSection" class="hidden space-y-4 animate-pop-in">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          Scanned Invoice Payload Data
        </h2>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-[11px] font-black tracking-wide px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ GST + LR Decoded
          </span>

          <div class="flex items-center gap-2">
            <button onclick="sendEmailData()" class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-md flex items-center gap-1">
              📧 Email Data
            </button>
            <button onclick="sendToGoogleSheet()" class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-md flex items-center gap-1">
              📊 Save to Sheet
            </button>
            <button onclick="copyFormattedText()" class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-md flex items-center gap-1">
              📋 Copy
            </button>
          </div>
        </div>

        <div id="tableContainer" class="max-h-[320px] overflow-y-auto custom-scrollbar bg-slate-50 rounded-xl border border-slate-200">
          <table class="w-full text-left border-collapse text-xs">
            <tbody id="invoiceTableBody" class="divide-y divide-slate-200"></tbody>
          </table>
        </div>

        <details class="pt-2 border-t border-slate-200 group">
          <summary class="text-xs text-slate-500 cursor-pointer font-semibold hover:text-slate-800 select-none transition flex items-center justify-between">
            <span>📄 View Raw Decoded Payload Text</span>
            <span class="text-[10px] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <pre id="rawPayloadText" class="bg-slate-900 p-3 rounded-xl text-[11px] font-mono mt-2 overflow-x-auto text-emerald-400 break-all whitespace-pre-wrap border border-slate-800 max-h-36"></pre>
        </details>
      </div>
    </section>

  </main>

  <!-- Step Success Modal -->
  <div id="successModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md hidden flex items-center justify-center p-4 z-50 animate-pop-in">
    <div class="bg-white border border-slate-200 rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>

      <div id="modalIcon" class="w-16 h-16 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-md">
        ✓
      </div>
      <h3 id="modalTitle" class="text-xl font-black text-slate-900 mb-1.5 tracking-tight">Scan Successful!</h3>
      <p id="modalMessage" class="text-slate-600 text-xs mb-5 leading-relaxed">GST Invoice QR Data extract ho gaya hai.</p>
      
      <button id="modalActionBtn" onclick="closeModal()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs tracking-wide shadow-md active:scale-[0.98]">
        Next Step
      </button>
    </div>
  </div>

  <footer class="text-center text-xs text-slate-400 my-3 font-medium">
    GST e-Invoice QR & Barcode Reader Tool Pro
  </footer>

  <script>
    const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxPC3FoRh2cZMbvMKXkt2uxLVLYIwYSS_yWNhp-eTy8msOtODWnlybC73loLwns93o-RQ/exec";

    let html5QrcodeScanner = null;
    let isCameraRunning = false;
    
    let currentStep = 1;
    let scannedQRData = null;
    let scannedBarcodeData = null;
    let combinedDataMap = {};

    // ZXing Reader Instance
    const codeReader = new ZXing.BrowserMultiFormatReader();

    function processUploadedImage(input) {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];
      stopCameraScanner();

      const imgUrl = URL.createObjectURL(file);

      // Priority 1: ZXing Engine (GST e-Invoice High-Density QR Codes ke liye best)
      codeReader.decodeFromImageUrl(imgUrl)
        .then(result => {
          URL.revokeObjectURL(imgUrl);
          handleScanSuccess(result.text);
        })
        .catch(() => {
          // Priority 2: Fallback to Html5Qrcode
          const html5QrCode = new Html5Qrcode("reader");
          html5QrCode.scanFile(file, true)
            .then(decodedText => {
              URL.revokeObjectURL(imgUrl);
              handleScanSuccess(decodedText);
            })
            .catch(err => {
              URL.revokeObjectURL(imgUrl);
              alert("QR Code / Barcode decode nahi ho paya. Kripya bilkul saaf aur bina blur wali photo upload karein.");
            });
        });
    }

    function startCameraScanner() {
      if (!html5QrcodeScanner) {
        // ZXing multi-format support enabled in html5qrcode
        html5QrcodeScanner = new Html5Qrcode("reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13
          ],
          verbose: false
        });
      }

      document.getElementById('placeholderView').classList.add('hidden');
      document.getElementById('scanLaserAnimation').classList.remove('hidden');

      // High Resolution video constraints taaki sघन QR code blur na ho
      const cameraConfig = {
        facingMode: "environment",
        width: { min: 1280, ideal: 1920 },
        height: { min: 720, ideal: 1080 }
      };

      const config = { 
        fps: 20, 
        // QR Code ke liye bada frame, Barcode ke liye wide frame
        qrbox: currentStep === 1 ? { width: 280, height: 280 } : { width: 300, height: 140 },
        aspectRatio: 1.0
      };

      html5QrcodeScanner.start(
        cameraConfig,
        config,
        (decodedText) => handleScanSuccess(decodedText)
      ).then(() => { 
        isCameraRunning = true; 
      }).catch(err => {
        // Fallback agar HD stream support na kare device
        html5QrcodeScanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => handleScanSuccess(decodedText)
        ).then(() => {
          isCameraRunning = true;
        }).catch(fallbackErr => {
          document.getElementById('placeholderView').classList.remove('hidden');
          document.getElementById('scanLaserAnimation').classList.add('hidden');
          alert("Camera Error: Kripya browser me Camera permissions allow karein aur HTTPS par host karein.");
        });
      });
    }

    function stopCameraScanner() {
      if (html5QrcodeScanner && isCameraRunning) {
        html5QrcodeScanner.stop().then(() => {
          isCameraRunning = false;
          document.getElementById('reader').innerHTML = '';
          document.getElementById('placeholderView').classList.remove('hidden');
          document.getElementById('scanLaserAnimation').classList.add('hidden');
        }).catch(err => console.error(err));
      } else {
        document.getElementById('placeholderView').classList.remove('hidden');
        document.getElementById('scanLaserAnimation').classList.add('hidden');
      }
    }

    function handleScanSuccess(decodedText) {
      stopCameraScanner();

      if (currentStep === 1) {
        scannedQRData = decodedText;
        showModal("Step 1 Complete!", "GST Invoice QR Code successfully scan ho gaya! Ab LR Barcode scan karein.", "Next: Scan LR Barcode", () => {
          closeModal();
          switchToStep2();
        });
      } else {
        scannedBarcodeData = decodedText;
        showModal("Dual Scan Successful!", "QR Code aur LR Barcode dono scan ho chuke hain.", "View Combined Data", () => {
          closeModal();
          renderFinalResults();
        });
      }
    }

    function switchToStep2() {
      currentStep = 2;

      document.getElementById('step1Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 text-white shadow-md text-xs font-bold transition-all duration-300";
      document.getElementById('step2Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white shadow-md text-xs font-bold transition-all duration-300";
      
      document.getElementById('currentScanTitle').innerText = "Scan LR Barcode";
      document.getElementById('currentScanSubtitle').innerText = "Invoice ke LR Number ka Barcode camera/file se scan karein";
      
      document.getElementById('placeholderTitle').innerText = "Scanner Ready For LR Barcode";
      document.getElementById('placeholderDesc').innerText = "Barcode image upload karein ya live camera se scan karein";
      document.getElementById('scannerIcon').innerText = "📊";

      document.getElementById('skipBarcodeBtn').classList.remove('hidden');
      document.getElementById('qrFileInput').value = '';
    }

    function skipBarcodeStep() {
      scannedBarcodeData = "N/A (Skipped)";
      renderFinalResults();
    }

    // GST e-Invoice JWT Parser
    function parseGstQRText(text) {
      try {
        return JSON.parse(text);
      } catch (e) {}

      try {
        const parts = text.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const parsed = JSON.parse(jsonPayload);
          let innerData = parsed.data ? (typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data) : parsed;
          
          let mapped = {};
          if (innerData.SellerGstin) mapped["Seller GSTIN"] = innerData.SellerGstin;
          if (innerData.BuyerGstin) mapped["Buyer GSTIN"] = innerData.BuyerGstin;
          if (innerData.DocNo) mapped["Invoice Number"] = innerData.DocNo;
          if (innerData.DocDt) mapped["Invoice Date"] = innerData.DocDt;
          if (innerData.TotInvVal) mapped["Gross Total Amount"] = "₹" + innerData.TotInvVal;
          if (innerData.Irn) mapped["IRN Number"] = innerData.Irn;
          if (innerData.HsnCode) mapped["HSN Code"] = innerData.HsnCode;

          return Object.keys(mapped).length > 0 ? mapped : innerData;
        }
      } catch (e) {}

      return { "Scanned QR Data": text };
    }

    function renderFinalResults() {
      document.getElementById('scannerSection').classList.add('hidden');
      document.getElementById('resultSection').classList.remove('hidden');

      const tbody = document.getElementById('invoiceTableBody');
      tbody.innerHTML = '';
      combinedDataMap = {};

      const parsedQR = parseGstQRText(scannedQRData);

      const createRowHTML = (key, val, isHighlighted = false) => {
        const row = document.createElement('tr');
        if (isHighlighted) {
          row.className = "bg-amber-50 border-b border-amber-200 font-bold";
          row.innerHTML = `
            <td class="py-3 px-3.5 text-amber-900 border-r border-amber-200 w-2/5 flex items-center gap-1.5">🚛 ${escapeHtml(key)}</td>
            <td class="py-3 px-3.5 font-mono text-amber-900 text-right">${escapeHtml(String(val))}</td>
          `;
        } else {
          row.className = "hover:bg-slate-100 transition border-b border-slate-200";
          row.innerHTML = `
            <td class="py-2.5 px-3.5 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200 w-2/5">${escapeHtml(key)}</td>
            <td class="py-2.5 px-3.5 font-mono text-slate-900 break-all text-right">${escapeHtml(String(val))}</td>
          `;
        }
        return row;
      };

      let lrInserted = false;

      for (const [key, val] of Object.entries(parsedQR)) {
        tbody.appendChild(createRowHTML(key, val));
        combinedDataMap[key] = val;

        if (!lrInserted && (key.toLowerCase().includes("invoice date") || key.toLowerCase().includes("invoice number"))) {
          tbody.appendChild(createRowHTML("LR Number (Barcode)", scannedBarcodeData || 'N/A', true));
          combinedDataMap["LR Number (Barcode)"] = scannedBarcodeData || 'N/A';
          lrInserted = true;
        }
      }

      if (!lrInserted) {
        tbody.appendChild(createRowHTML("LR Number (Barcode)", scannedBarcodeData || 'N/A', true));
        combinedDataMap["LR Number (Barcode)"] = scannedBarcodeData || 'N/A';
      }

      document.getElementById('rawPayloadText').innerText = 
        `--- LR BARCODE ---\n${scannedBarcodeData}\n\n--- QR CODE PAYLOAD ---\n${scannedQRData}`;
    }

    function sendEmailData() {
      const subject = encodeURIComponent("GST e-Invoice & LR Details: " + (combinedDataMap["Invoice Number"] || "New Scan"));
      let bodyText = "GST e-Invoice & LR Barcode Scanned Details:\n\n";
      
      for (const [key, val] of Object.entries(combinedDataMap)) {
        bodyText += `${key}: ${val}\n`;
      }

      bodyText += "\nRaw Payload:\n" + document.getElementById('rawPayloadText').innerText;
      window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    }

    function sendToGoogleSheet() {
      fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedDataMap)
      })
      .then(() => {
        alert("Data successfully Google Sheet me save kar diya gaya hai!");
      })
      .catch(err => {
        alert("Google Sheet me save karte waqt error aaya: " + err);
      });
    }

    function showModal(title, msg, btnText, callback) {
      document.getElementById('modalTitle').innerText = title;
      document.getElementById('modalMessage').innerText = msg;
      
      const btn = document.getElementById('modalActionBtn');
      btn.innerText = btnText;
      btn.onclick = callback;
      
      document.getElementById('successModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('successModal').classList.add('hidden');
    }

    function copyFormattedText() {
      const textToCopy = document.getElementById('tableContainer').innerText;
      if (!textToCopy) return;

      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Combined Table content copied to clipboard!");
      } catch (err) {
        console.error(err);
      }
      document.body.removeChild(textArea);
    }

    function resetScanner() {
      stopCameraScanner();
      
      currentStep = 1;
      scannedQRData = null;
      scannedBarcodeData = null;
      combinedDataMap = {};

      document.getElementById('qrFileInput').value = '';
      document.getElementById('resultSection').classList.add('hidden');
      document.getElementById('scannerSection').classList.remove('hidden');
      document.getElementById('placeholderView').classList.remove('hidden');

      document.getElementById('step1Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white shadow-md text-xs font-bold transition-all duration-300";
      document.getElementById('step2Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200/60 text-slate-500 text-xs font-bold transition-all duration-300";
      
      document.getElementById('currentScanTitle').innerText = "Scan GST QR Code";
      document.getElementById('currentScanSubtitle').innerText = "Invoice ka QR Code photo upload karein ya camera se dekhein";
      document.getElementById('placeholderTitle').innerText = "Scanner Ready For QR Code";
      document.getElementById('placeholderDesc').innerText = "HD Camera ya Upload Image option select karein";
      document.getElementById('scannerIcon').innerText = "📷";

      document.getElementById('skipBarcodeBtn').classList.add('hidden');
    }

    function escapeHtml(text) {
      return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  </script>
</body>
</html>
