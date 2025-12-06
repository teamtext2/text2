const KEY = 'simple_notes_v1';
let notes = [];
let editingId = null;

// DOM ELEMENTS MAPPING
const dom = {
  list: document.getElementById('view-list'),
  editor: document.getElementById('view-editor'),
  notesContainer: document.getElementById('notesContainer'),
  titleInput: document.getElementById('note-title'),
  bodyInput: document.getElementById('note-body'),
  emptyMsg: document.getElementById('emptyMsg'),
  search: document.getElementById('searchInput'),
  exportSheet: document.getElementById('exportSheet'),
  colorSheet: document.getElementById('colorSheet')
};

// --- INIT ---
function load() {
  try { notes = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) { notes = []; }
  renderNotesList();
}

function saveToStorage() { localStorage.setItem(KEY, JSON.stringify(notes)); }

function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// --- NAVIGATION & VIEW LOGIC ---
function gotoEditor(noteId = null) {
  editingId = noteId;
  
  if (noteId) {
    const n = notes.find(x => x.id === noteId);
    if (n) {
      dom.titleInput.value = n.title;
      dom.bodyInput.innerHTML = n.body;
    }
  } else {
    // New Note
    dom.titleInput.value = '';
    dom.bodyInput.innerHTML = '';
  }

  // Animation: Slide Editor In
  dom.list.classList.remove('view-active');
  dom.list.classList.add('view-hidden-left');
  
  dom.editor.classList.remove('view-hidden-right');
  dom.editor.classList.add('view-active');
}

function gotoList() {
  // Auto-save on back
  autoSaveNote();

  // Animation: Slide Editor Out
  dom.editor.classList.remove('view-active');
  dom.editor.classList.add('view-hidden-right');

  dom.list.classList.remove('view-hidden-left');
  dom.list.classList.add('view-active');
  
  editingId = null;
  
  // Hide keyboard
  document.activeElement.blur();
}

// --- NOTE OPERATIONS ---
function saveNote() {
  const title = dom.titleInput.value.trim();
  const body = (dom.bodyInput.innerHTML || '').trim();
  
  if (!title && !body) return; // Empty, don't save

  if (editingId) {
    const i = notes.findIndex(n => n.id === editingId);
    if (i > -1) { 
      notes[i].title = title; 
      notes[i].body = body; 
      notes[i].updated = Date.now(); 
    }
  } else {
    const newId = makeId();
    notes.unshift({ id: newId, title, body, created: Date.now(), updated: Date.now(), pinned: false });
    editingId = newId; // Set current editing ID so further edits update this note
  }
  saveToStorage();
  renderNotesList();
  showToast('Saved');
}

function autoSaveNote() {
  const title = dom.titleInput.value.trim();
  const body = (dom.bodyInput.innerHTML || '').trim();
  if(!title && !body) return; 
  
  // Logic identical to saveNote but no toast
  if (editingId) {
    const i = notes.findIndex(n => n.id === editingId);
    if (i > -1) { notes[i].title = title; notes[i].body = body; notes[i].updated = Date.now(); }
  } else {
    notes.unshift({ id: makeId(), title, body, created: Date.now(), updated: Date.now(), pinned: false });
  }
  saveToStorage();
  renderNotesList();
}

function deleteNote(id) {
  if (confirm('Delete this note?')) {
    notes = notes.filter(n => n.id !== id);
    saveToStorage();
    renderNotesList();
    if(editingId === id) gotoList();
  }
}

function togglePin(e, id) {
  e.stopPropagation();
  const i = notes.findIndex(n => n.id === id);
  if (i > -1) {
    notes[i].pinned = !notes[i].pinned;
    saveToStorage();
    renderNotesList(dom.search.value);
  }
}

// --- RENDER ---
function renderNotesList(filter = '') {
  dom.notesContainer.innerHTML = '';
  const f = filter.toLowerCase().trim();
  
  const list = notes.filter(n => {
    if (!f) return true;
    return (n.title || '').toLowerCase().includes(f) || (n.body || '').toLowerCase().includes(f);
  }).sort((a, b) => (b.pinned === true) - (a.pinned === true) || (b.updated || 0) - (a.updated || 0));

  if (list.length === 0) {
    dom.emptyMsg.style.display = 'flex';
  } else {
    dom.emptyMsg.style.display = 'none';
  }

  list.forEach(n => {
    // Create stripped text for preview
    const tmp = document.createElement('DIV');
    tmp.innerHTML = n.body;
    const plainText = tmp.textContent || tmp.innerText || 'No additional text';

    const card = document.createElement('div');
    card.className = 'note-card';
    card.onclick = () => gotoEditor(n.id);
    
    // HTML Structure for Card
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="card-title" style="${!n.title ? 'color:var(--text-muted);font-style:italic':''}">${n.title || 'Untitled Note'}</div>
        ${n.pinned ? '<ion-icon name="pin" style="color:var(--primary);font-size:14px;"></ion-icon>' : ''}
      </div>
      <div class="card-preview">${plainText.substring(0, 80)}</div>
      <div class="card-meta">
        <span>${new Date(n.updated).toLocaleDateString()}</span>
        <div class="card-actions">
           <button class="btn-icon mini-btn" onclick="togglePin(event, '${n.id}')">
             <ion-icon name="${n.pinned ? 'pin-outline' : 'pin-outline'}"></ion-icon>
           </button>
           <button class="btn-icon mini-btn" onclick="event.stopPropagation(); deleteNote('${n.id}')" style="color:#ef4444">
             <ion-icon name="trash-outline"></ion-icon>
           </button>
        </div>
      </div>
    `;
    dom.notesContainer.appendChild(card);
  });
}

// --- RICH TEXT HELPERS ---
function exec(cmd, val=null) { document.execCommand(cmd, false, val); dom.bodyInput.focus(); }
function formatHeading(level) { document.execCommand('formatBlock', false, `<h${level}>`); dom.bodyInput.focus(); }

// --- EVENT LISTENERS ---

// FAB & Buttons
document.getElementById('fab-add').addEventListener('click', () => gotoEditor(null));
document.getElementById('saveBtn').addEventListener('click', () => { saveNote(); });
document.getElementById('btn-back').addEventListener('click', gotoList);
document.getElementById('clearBtn').addEventListener('click', () => { if(confirm('Clear all content?')) dom.bodyInput.innerHTML = ''; });

// Search
dom.search.addEventListener('input', (e) => renderNotesList(e.target.value));

// Formatting Toolbar
document.getElementById('btnH1').onclick = () => formatHeading(1);
document.getElementById('btnH2').onclick = () => formatHeading(2);
document.getElementById('btnBold').onclick = () => exec('bold');
document.getElementById('btnItalic').onclick = () => exec('italic');
document.getElementById('btnUnderline').onclick = () => exec('underline');

// Color Picker
const colorSheet = document.getElementById('colorSheet');
document.getElementById('btnColorTrigger').onclick = () => { colorSheet.classList.add('open'); };
window.setColor = (hex) => { exec('foreColor', hex); colorSheet.classList.remove('open'); };
document.getElementById('colorInput').onchange = (e) => { exec('foreColor', e.target.value); colorSheet.classList.remove('open'); };

// Image Handling
document.getElementById('btnImage').onclick = () => document.getElementById('imgInput').click();
document.getElementById('imgInput').onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    // Insert simple resizable image HTML
    const html = `<img src="${evt.target.result}" style="max-width:100%;height:auto;margin:10px 0;display:block">`;
    document.execCommand('insertHTML', false, html);
    // Re-bind zoom events if needed, but for this mobile version simple full-width is best
  };
  reader.readAsDataURL(file);
  this.value = '';
};

// Export Sheet Logic
const exportSheet = document.getElementById('exportSheet');
document.getElementById('btn-export-trigger').onclick = () => exportSheet.classList.add('open');
window.closeSheet = (id) => document.getElementById(id).classList.remove('open');
document.getElementById('deleteCurrentBtn').onclick = () => {
  closeSheet('exportSheet');
  if(editingId) deleteNote(editingId);
};

// Theme Logic
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('simple_notes_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.querySelector('ion-icon').name = savedTheme === 'dark' ? 'sunny-outline' : 'moon-outline';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('simple_notes_theme', next);
  themeToggle.querySelector('ion-icon').name = next === 'dark' ? 'sunny-outline' : 'moon-outline';
});

// Import Logic
const fileInput = document.getElementById('file-input');
document.getElementById('btn-import-trigger').onclick = () => fileInput.click();

fileInput.addEventListener('change', function(event) {
  const file = this.files[0];
  if(!file) return;
  
  if(file.name.endsWith('.docx')) {
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      mammoth.convertToHtml({ arrayBuffer: loadEvent.target.result })
        .then(function(result) {
          gotoEditor(null); // Open new
          setTimeout(() => {
              dom.titleInput.value = file.name.replace('.docx','');
              dom.bodyInput.innerHTML = result.value;
          }, 300); // Wait for anim
        })
        .catch(err => alert(err));
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please select a .docx file');
  }
  this.value = '';
});

// Export Logic (Wrapped from original)
function getHtmlForExport() {
  const t = dom.titleInput.value || 'Untitled';
  const b = dom.bodyInput.innerHTML;
  return `
    <html><head><style>body{font-family:Arial;} img{max-width:100%}</style></head>
    <body><h1>${t}</h1>${b}</body></html>
  `;
}

document.getElementById('export-docx').onclick = () => {
  closeSheet('exportSheet');
  const content = getHtmlForExport();
  const converted = window.htmlDocx.asBlob(content);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(converted);
  link.download = `${dom.titleInput.value || 'note'}.docx`;
  link.click();
};

document.getElementById('export-pdf').onclick = () => {
  closeSheet('exportSheet');
  const element = document.createElement('div');
  element.innerHTML = getHtmlForExport();
  element.style.padding = '20px';
  element.style.color = 'black'; // Force black text for PDF
  element.style.background = 'white'; // Force white bg
  
  html2pdf().set({
    margin: 10,
    filename: `${dom.titleInput.value || 'note'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
};

// Initial Load
load();