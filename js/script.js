/* ====== CONFIG ====== */
const GITHUB_URL = "https://github.com/muhammadnurulahsan"; 

/* ====== UTILITIES ====== */
function maskFormulaForDisplay(formula) {
  return formula.replace(/"(https?:\/\/[^"]+)"/, '"<link>"');
}
function tokens(str) {
  return (str || "")
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
}

/* ====== COMPOSER (right card) ====== */
function updateComposedCells() {
  const letters = tokens(
    document.getElementById("cellLetters").value.toUpperCase()
  )
    .map((s) => s.replace(/[^A-Z]/g, ""))
    .filter(Boolean);
  const numbers = tokens(document.getElementById("cellNumbers").value)
    .map((s) => s.replace(/[^\d]/g, ""))
    .filter(Boolean);

  const out = [];
  if (letters.length && numbers.length) {
    letters.forEach((L) => numbers.forEach((N) => out.push(`${L}${N}`)));
  }
  const area = document.getElementById("composedCells");
  area.value = out.join(" ");

  const copyBtn = document.getElementById("copyComposedBtn");
  if (copyBtn) copyBtn.disabled = out.length === 0;
}

function copyComposedCells() {
  const area = document.getElementById("composedCells");
  const btn = document.getElementById("copyComposedBtn");
  const text = (area.value || "").trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const prev = btn.textContent;
    btn.textContent = "Copied";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = prev;
      btn.disabled = !area.value.trim();
    }, 1100);
  });
}

function clearComposer() {
  document.getElementById("cellLetters").value = "";
  document.getElementById("cellNumbers").value = "";
  document.getElementById("composedCells").value = "";
  const copyBtn = document.getElementById("copyComposedBtn");
  if (copyBtn) {
    copyBtn.textContent = "Copy Cell Number";
    copyBtn.disabled = true;
  }
}

function getAllCells() {
  const manual = tokens(document.getElementById("cellAddresses").value);
  const composed = tokens(document.getElementById("composedCells").value);
  return [...manual, ...composed];
}

/* ====== GENERATE / CLEAR ====== */
function generateLinks() {
  updateComposedCells(); // ensure freshest composed cells

  const links = document
    .getElementById("sheetLinks")
    .value.trim()
    .split(/\n+/)
    .filter(Boolean);
  const sheetName = document.getElementById("sheetName").value.trim();
  const cells = getAllCells();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (!links.length || !cells.length) return;

  let counter = 1,
    linkCount = 0;

  links.forEach((link) => {
    cells.forEach((cell) => {
      const formula = `=IMPORTRANGE("${link}","${sheetName}!${cell}")`;
      const displayFormula = maskFormulaForDisplay(formula);

      const row = document.createElement("div");
      row.className = "result-row";
      const box = document.createElement("div");
      box.className = "link-box";
      const serial = document.createElement("div");
      serial.className = "serial";
      serial.textContent = `Link ${counter}`;
      const text = document.createElement("div");
      text.className = "link-text";
      text.textContent = displayFormula;
      box.appendChild(serial);
      box.appendChild(text);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(formula).then(() => {
          copyBtn.textContent = "Copied";
          copyBtn.disabled = true;
        });
      };

      const tag = document.createElement("div");
      tag.className = "cell-tag";
      tag.textContent = cell;

      row.appendChild(box);
      row.appendChild(copyBtn);
      row.appendChild(tag);
      resultsDiv.appendChild(row);

      counter++;
      linkCount++;
      if (linkCount % 6 === 0) {
        const divider = document.createElement("div");
        divider.className = "group-divider";
        divider.setAttribute("role", "separator");
        resultsDiv.appendChild(divider);
      }
    });
  });
}

function clearAll() {
  document.getElementById("sheetLinks").value = "";
  document.getElementById("sheetName").value = "Jan-Dec-2025";
  document.getElementById("cellAddresses").value = "";
  document.getElementById("results").innerHTML = "";
  clearComposer();
}

/* ====== BANGLADESH TIME & DATE ====== */
function updateDhakaDateTime() {
  const tz = "Asia/Dhaka";

  // time HH:MM:SS
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  });
  document.getElementById("bdTime").textContent = timeFmt.format(new Date());


  // Bengali (Gregorian, localized)
  const bnFmt = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  });
  document.getElementById("dateBn").textContent = bnFmt.format(new Date());
}

/* ====== INIT ====== */
(function init() {
  // GitHub link hookup
  const gh = document.getElementById("githubLink");
  if (gh && GITHUB_URL) gh.href = GITHUB_URL;

  updateComposedCells();
  updateDhakaDateTime();
  setInterval(updateDhakaDateTime, 1000);
})();
