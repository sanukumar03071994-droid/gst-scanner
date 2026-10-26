<!DOCTYPE html>
<html lang="hi" class="h-full bg-slate-50">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST e-Invoice & Barcode Scanner</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Multi-engine ZXing library -->
  <script src="https://unpkg.com/@zxing/library@0.19.2/umd/index.min.js"></script>
  <style>
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    #videoElement {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      border-radius: 1rem;
    }
    .scanner-laser-line {
      animation: scanLaser 2s infinite ease-in-out;
    }
    @keyframes scanLaser {
      0% { top: 5%; opacity: 0.3; }
      50% { top: 90%; opacity: 1; }
      100% { top: 5%; opacity: 0.3; }
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 font-sans">

  <header class="text-center my-3 w-full max-w-xl">
    <div class="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 px-3.5 py-1 rounded-full text-indigo-700 text-xs font-bold mb-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      High-Density GST Engine
    </div>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      GST e-Invoice & LR Reader
    </h1>
  </header>

  <main class="w-full max-w-xl glass-card rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 flex-1 flex flex-col justify-between">
    
    <!-- Top Step Bar -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div id="step1Indicator" class="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold transition">
        <span>1</span>
        <span>Step 1: GST QR Code</span>
      </div>
      <div id="step2Indicator" class="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold transition">
        <span>2</span>
        <span>Step 2: LR Barcode</span>
      </div>
    </div>

    <!-- Scanner Area -->
    <section id="scannerSection" class="space-y-4">
      <div class="border-b pb-2">
        <h2 id="currentScanTitle" class="text-base font-bold text-slate-900">Scan GST QR Code</h2>
        <p id="statusMsg" class="text-xs text-indigo-600 font-semibold mt-0.5">Camera chalu karne ke liye button dabayein</p>
      </div>

      <!-- Video Display -->
      <div class="relative overflow-hidden rounded-2xl bg-black min-h-[290px] flex items-center justify-center border border-indigo-200">
        <video id="videoElement" playsinline autoplay muted class="hidden"></video>
        <canvas id="hiddenCanvas" class="hidden"></canvas>
        
        <div id="placeholderView" class="p-6 text-center text-slate-400">
          <div class="text-4xl mb-2">📷</div>
          <p class="text-xs font-bold text-slate-300">Live Camera ya File Upload Select Karein</p>
        </div>

        <div id="laserLine" class="hidden absolute inset-0 pointer-events-none">
          <div class="absolute inset-x-6 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] scanner-laser-line"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button onclick="startCamera()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95">
          📷 Start Camera
        </button>
        <label class="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-center cursor-pointer text-xs sm:text-sm shadow-md transition flex items-center justify-center">
          📁 Upload Image
          <input type="file" accept="image/*" class="hidden" onchange="handleFileSelect(this)">
        </label>
      </div>

      <button id="skipBtn" onclick="skipBarcode()" class="hidden w-full bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs">
        ⏩ Barcode Skip Karein (View QR Data)
      </button>
    </section>

    <!-- Result Section -->
    <section id="resultSection" class="hidden space-y-4">
      <div class="flex items-center justify-between border-b pb-2">
        <h3 class="font-bold text-emerald-700 text-sm">✓ Data Decoded Successfully</h3>
        <button onclick="resetAll()" class="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-lg">Reset</button>
      </div>

      <div class="max-h-72 overflow-y-auto border rounded-xl bg-slate-50 p-2">
        <table class="w-full text-xs">
          <tbody id="resultBody" class="divide-y divide-slate-200"></tbody>
        </table>
      </div>

      <button onclick="copyData()" class="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs">
        📋 Copy Scanned Details
      </button>
    </section>

  </main>

  <script>
    let currentStep = 1;
    let scannedQR = null;
    let scannedBarcode = null;
    let videoStream = null;
    let scanInterval = null;

    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('hiddenCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const statusMsg = document.getElementById('statusMsg');

    // Native Barcode Detector support check
    const hasBarcodeDetector = ('BarcodeDetector' in window);
    let nativeDetector = null;
    if (hasBarcodeDetector) {
      nativeDetector = new BarcodeDetector({ 
        formats: ['qr_code', 'code_128', 'code_39', 'ean_13'] 
      });
    }

    // ZXing Fallback Engine
    const zxingReader = new ZXing.BrowserMultiFormatReader();

    async function startCamera() {
      try {
        statusMsg.innerText = "Camera khul raha hai...";
        
        // High Resolution Request taaki dense dots saaf aayein
        const constraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 }
          }
        };

        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
        await video.play();

        video.classList.remove('hidden');
        document.getElementById('placeholderView').classList.add('hidden');
        document.getElementById('laserLine').classList.remove('hidden');

        statusMsg.innerText = "Camera active: Invoice QR code ko thoda door rakh kar samne laayein";
        startScanningLoop();
      } catch (err) {
        statusMsg.innerText = "Camera error: HTTPS check karein aur permission allow karein.";
        alert("Camera error: " + err.message);
      }
    }

    function stopCamera() {
      if (scanInterval) clearInterval(scanInterval);
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }
      video.classList.add('hidden');
      document.getElementById('placeholderView').classList.remove('hidden');
      document.getElementById('laserLine').classList.add('hidden');
    }

    function startScanningLoop() {
      scanInterval = setInterval(async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          
          // Method 1: Hardware BarcodeDetector (Fastest for Dense GST JWT)
          if (nativeDetector) {
            try {
              const barcodes = await nativeDetector.detect(video);
              if (barcodes.length > 0) {
                onScanSuccess(barcodes[0].rawValue);
                return;
              }
            } catch (e) {}
          }

          // Method 2: ZXing Canvas Processing Fallback
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const result = zxingReader.decode(canvas);
            if (result && result.text) {
              onScanSuccess(result.text);
            }
          } catch (e) {
            // Processing frame
          }
        }
      }, 300);
    }

    // Image Upload Handler
    async function handleFileSelect(input) {
      if (!input.files || input.files.length === 0) return;
      stopCamera();
      statusMsg.innerText = "Image analyze ho rahi hai...";

      const file = input.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        // Method 1: Native BarcodeDetector on Image
        if (hasBarcodeDetector && nativeDetector) {
          try {
            const detected = await nativeDetector.detect(img);
            if (detected.length > 0) {
              URL.revokeObjectURL(img.src);
              onScanSuccess(detected[0].rawValue);
              return;
            }
          } catch (e) {}
        }

        // Method 2: ZXing Image Decode
        try {
          const result = await zxingReader.decodeFromImageUrl(img.src);
          URL.revokeObjectURL(img.src);
          onScanSuccess(result.getText());
        } catch (e) {
          URL.revokeObjectURL(img.src);
          alert("QR Code decode nahi ho saka. Photo ko bilkul seedha aur bina chamak/reflection ke upload karein.");
          statusMsg.innerText = "Scan fail hua. Dobara koshish karein.";
        }
      };
    }

    function onScanSuccess(text) {
      stopCamera();
      
      if (currentStep === 1) {
        scannedQR = text;
        currentStep = 2;
        
        document.getElementById('step1Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold";
        document.getElementById('step2Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold";
        document.getElementById('currentScanTitle').innerText = "Scan LR Barcode";
        document.getElementById('skipBtn').classList.remove('hidden');
        statusMsg.innerText = "Step 1 Pass! Ab LR Barcode scan karein.";
      } else {
        scannedBarcode = text;
        renderResults();
      }
    }

    function skipBarcode() {
      scannedBarcode = "N/A (Skipped)";
      renderResults();
    }

    // JWT / GST Payload Decoder
    function parseGSTPayload(raw) {
      let data = {};
      try {
        const parts = raw.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const inner = payload.data ? (typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data) : payload;
          
          if (inner.SellerGstin) data["Seller GSTIN"] = inner.SellerGstin;
          if (inner.BuyerGstin) data["Buyer GSTIN"] = inner.BuyerGstin;
          if (inner.DocNo) data["Invoice Number"] = inner.DocNo;
          if (inner.DocDt) data["Invoice Date"] = inner.DocDt;
          if (inner.TotInvVal) data["Total Value"] = "₹" + inner.TotInvVal;
          if (inner.Irn) data["IRN"] = inner.Irn;
          return data;
        }
      } catch (e) {}

      try {
        return JSON.parse(raw);
      } catch (e) {}

      return { "Raw Scanned Data": raw };
    }

    function renderResults() {
      document.getElementById('scannerSection').classList.add('hidden');
      document.getElementById('resultSection').classList.remove('hidden');

      const tbody = document.getElementById('resultBody');
      tbody.innerHTML = '';

      const parsed = parseGSTPayload(scannedQR);

      for (const [k, v] of Object.entries(parsed)) {
        tbody.innerHTML += `
          <tr class="border-b">
            <td class="py-2 px-3 font-semibold text-slate-600">${k}</td>
            <td class="py-2 px-3 font-mono text-right text-slate-900 break-all">${v}</td>
          </tr>
        `;
      }

      tbody.innerHTML += `
        <tr class="bg-amber-50 font-bold border-b">
          <td class="py-2 px-3 text-amber-900">LR Number</td>
          <td class="py-2 px-3 font-mono text-right text-amber-900">${scannedBarcode || 'N/A'}</td>
        </tr>
      `;
    }

    function copyData() {
      const text = document.getElementById('resultBody').innerText;
      navigator.clipboard.writeText(text);
      alert("Details copied!");
    }

    function resetAll() {
      stopCamera();
      currentStep = 1;
      scannedQR = null;
      scannedBarcode = null;
      document.getElementById('resultSection').classList.add('hidden');
      document.getElementById('scannerSection').classList.remove('hidden');
      document.getElementById('skipBtn').classList.add('hidden');
      document.getElementById('step1Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold";
      document.getElementById('step2Indicator').className = "flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold";
      document.getElementById('currentScanTitle').innerText = "Scan GST QR Code";
      statusMsg.innerText = "Camera chalu karne ke liye button dabayein";
    }
  </script>
</body>
</html>
