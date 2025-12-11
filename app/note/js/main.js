  // Colors Palette
  const COLORS = [
    { bg: "#35b4ff", name: "Blue" },
    { bg: "#a26bff", name: "Purple" },
    { bg: "#ff6b6b", name: "Red" },
    { bg: "#2bcbba", name: "Teal" },
    { bg: "#fd9644", name: "Orange" },
    { bg: "#4b6584", name: "Grey" }
  ];

  // State
  let notes = JSON.parse(localStorage.getItem("text2-notes-v2")) || [];
  let currentColor = COLORS[0].bg;
  let editingId = null; // Track which note is being edited

  // DOM Elements
  const container = document.getElementById("notes-grid");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const fab = document.getElementById("fab");
  const closeBtn = document.getElementById("close-modal");
  const saveBtn = document.getElementById("save");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const colorBar = document.querySelector(".color-bar");

  // --- UI Functions ---

  function initColors() {
    colorBar.innerHTML = "";
    COLORS.forEach(c => {
      const div = document.createElement("div");
      div.className = `color-opt ${c.bg === currentColor ? 'selected' : ''}`;
      div.style.backgroundColor = c.bg;
      div.onclick = () => {
        document.querySelectorAll(".color-opt").forEach(el => el.classList.remove("selected"));
        div.classList.add("selected");
        currentColor = c.bg;
      };
      colorBar.appendChild(div);
    });
  }

  function toggleModal(show) {
    if (show) {
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("show"), 10);
      titleInput.focus();
    } else {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        resetForm(); // Clear form on close
      }, 300);
    }
  }

  function resetForm() {
    titleInput.value = "";
    contentInput.value = "";
    editingId = null;
    modalTitle.innerText = "Note";
    // Reset to first color or keep current choice, defaulting to blue for new
    currentColor = COLORS[0].bg;
    initColors();
  }

  function renderNotes() {
    container.innerHTML = "";
    
    if (notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Nothing here yet?</h3>
          <p>Tap the + button below to write something!</p>
        </div>
      `;
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      return;
    }
    
    container.style.display = 'block';

    notes.forEach((note, index) => {
      const el = document.createElement("div");
      el.className = "note-card";
      el.style.setProperty("--note-color", note.color);
      el.style.animationDelay = `${index * 0.05}s`;

      el.innerHTML = `
        <div class="note-indicator"></div>
        <div class="note-title">${note.title}</div>
        <div class="note-content">${note.content}</div>
        <div class="note-footer">
          <div class="note-date">${note.date}</div>
          <div class="card-actions">
            <button class="icon-btn edit" onclick="editNote(${note.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="icon-btn delete" onclick="deleteNote(${note.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // --- Logic Functions ---

  function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!content && !title) {
      alert("Please write at least something! 😅");
      return;
    }

    if (editingId) {
      // UPDATE existing note
      notes = notes.map(n => {
        if (n.id === editingId) {
          return {
            ...n,
            title: title || "Untitled",
            content: content,
            color: currentColor,
            // Keep original date or update? Let's keep original for now.
          };
        }
        return n;
      });
    } else {
      // CREATE new note
      const newNote = {
        id: Date.now(),
        title: title || "Untitled",
        content: content,
        color: currentColor,
        date: new Date().toLocaleDateString('en-US', {day: 'numeric', month: 'short'})
      };
      notes.unshift(newNote);
    }

    localStorage.setItem("text2-notes-v2", JSON.stringify(notes));
    toggleModal(false);
    renderNotes();
  }

  // Edit Function
  window.editNote = function(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    editingId = id;
    titleInput.value = note.title;
    contentInput.value = note.content;
    currentColor = note.color;
    
    // Update modal title
    modalTitle.innerText = "Edit Note";
    
    // Update color UI
    initColors();
    
    toggleModal(true);
  }

  // Delete Function
  window.deleteNote = function(id) {
    if(confirm("Are you sure? This will permanently delete the note!")) {
      notes = notes.filter(n => n.id !== id);
      localStorage.setItem("text2-notes-v2", JSON.stringify(notes));
      renderNotes();
    }
  }

  // --- Event Listeners ---

  fab.onclick = () => {
    resetForm(); // Ensure clean state for new note
    toggleModal(true);
  };
  
  closeBtn.onclick = () => toggleModal(false);
  saveBtn.onclick = saveNote;
  
  modal.onclick = (e) => {
    if (e.target === modal) toggleModal(false);
  }

  // Init
  initColors();
  renderNotes();
  // Export notes as JSON file (used by settings)
  function exportNotes() {
    const data = notes || [];
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const ts = new Date().toISOString().slice(0,19).replace(/:/g,'-');
      const filename = `text2-notes-${ts}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Xuất dữ liệu thất bại. Vui lòng thử lại.');
    }
  }

  // Settings modal handling (contains import/export controls)
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings');
  const importFileInput = document.getElementById('import-file');
  const importBtn = document.getElementById('import-btn');
  const settingsExportBtn = document.getElementById('settings-export-btn');

  function toggleSettings(show) {
    if (!settingsModal) return;
    if (show) {
      settingsModal.style.display = 'flex';
      setTimeout(() => settingsModal.classList.add('show'), 10);
    } else {
      settingsModal.classList.remove('show');
      setTimeout(() => { settingsModal.style.display = 'none'; }, 260);
    }
  }

  // Import function: supports array of notes or object { notes: [...] }
  async function importNotes() {
    const file = importFileInput && importFileInput.files && importFileInput.files[0];
    if (!file) {
      alert('Vui lòng chọn file JSON để nhập.');
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const imported = Array.isArray(parsed) ? parsed : (parsed && parsed.notes ? parsed.notes : null);
      if (!imported || !Array.isArray(imported)) {
        alert('File không chứa dữ liệu hợp lệ (một mảng ghi chú).');
        return;
      }

      // Validate minimal shape (title/content) and normalize
      const normalized = imported.map((n, i) => {
        return {
          id: typeof n.id === 'number' ? n.id : Date.now() + i,
          title: n.title || 'Untitled',
          content: n.content || '',
          color: n.color || COLORS[0].bg,
          date: n.date || new Date().toLocaleDateString('en-US', {day: 'numeric', month: 'short'})
        };
      });

      const modeEl = document.querySelector('input[name="import-mode"]:checked');
      const mode = modeEl ? modeEl.value : 'merge';

      if (mode === 'replace') {
        notes = normalized.slice().reverse(); // reverse to keep order consistent (newest first)
      } else {
        // Merge: avoid id collisions by remapping duplicates
        const existingIds = new Set(notes.map(n => n.id));
        const toAdd = normalized.map((n, idx) => {
          if (existingIds.has(n.id)) {
            n.id = Date.now() + idx + Math.floor(Math.random() * 1000);
          }
          return n;
        });
        // prepend imported notes so they appear first
        notes = toAdd.concat(notes);
      }

      localStorage.setItem('text2-notes-v2', JSON.stringify(notes));
      renderNotes();
      toggleSettings(false);
      alert('Nhập dữ liệu thành công.');
    } catch (e) {
      console.error('Import failed', e);
      alert('Nhập dữ liệu thất bại. File không hợp lệ hoặc có lỗi.');
    }
  }

  // Wire settings controls
  if (settingsBtn) settingsBtn.onclick = () => toggleSettings(true);
  if (closeSettingsBtn) closeSettingsBtn.onclick = () => toggleSettings(false);
  if (settingsModal) settingsModal.onclick = (e) => { if (e.target === settingsModal) toggleSettings(false); };
  if (settingsExportBtn) settingsExportBtn.onclick = exportNotes;
  if (importBtn) importBtn.onclick = importNotes;