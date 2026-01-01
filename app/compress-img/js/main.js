    // --- State Management ---
    let files = []; 
    let isProcessing = false;
    let quality = 0.5; // Default 50%
    let isZipReady = false;

    // --- DOM Elements ---
    const fileInput = document.getElementById('fileInput');
    const qualityInput = document.getElementById('qualityInput');
    const qualityValue = document.getElementById('qualityValue');
    const fileListEl = document.getElementById('fileList');
    const emptyStateEl = document.getElementById('emptyState');
    const fileCountEl = document.getElementById('fileCount');
    const actionButtonsDesktopEl = document.getElementById('actionButtonsDesktop');
    const actionButtonsMobileEl = document.getElementById('actionButtonsMobile');
    const successBadgeEl = document.getElementById('successBadge');

    // --- Init ---
    lucide.createIcons();

    // --- Event Listeners ---
    qualityInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        quality = val / 100;
        qualityValue.textContent = val + '%';
    });

    fileInput.addEventListener('change', handleFileUpload);

    // --- Core Functions ---

    function formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    function handleFileUpload(e) {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        const newFiles = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            originalSize: file.size,
            processed: null
        }));

        files = [...files, ...newFiles];
        isZipReady = false;
        files.forEach(f => f.processed = null); 
        renderUI();
    }

    window.removeFile = function(id) {
        files = files.filter(f => f.id !== id);
        const hasUnprocessed = files.some(f => !f.processed);
        if (hasUnprocessed || files.length === 0) isZipReady = false;
        renderUI();
    }

    window.resetApp = function() {
        files = [];
        isZipReady = false;
        isProcessing = false;
        fileInput.value = ''; 
        renderUI();
    }

    function compressImage(fileObj) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileObj.file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const width = img.width;
                    const height = img.height;

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve({
                            ...fileObj,
                            processed: {
                                blob: blob,
                                size: blob.size,
                                url: URL.createObjectURL(blob),
                                width,
                                height
                            }
                        });
                    }, 'image/jpeg', quality);
                };
            };
        });
    }

    window.processAll = async function() {
        if (files.length === 0) return;
        isProcessing = true;
        renderUI(); 

        const results = [];
        for (const file of files) {
            const result = await compressImage(file);
            results.push(result);
        }

        files = results;
        isProcessing = false;
        isZipReady = true;
        renderUI();
    }

    window.downloadZip = function() {
        if (!window.JSZip || files.length === 0) return;
        
        const zip = new JSZip();
        const folder = zip.folder("text2_compressed");

        files.forEach(file => {
            if(file.processed) {
                folder.file(`min_${file.file.name}`, file.processed.blob);
            }
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `Text2_Compress_${new Date().toISOString().slice(0,10)}.zip`;
            link.click();
        });
    }

    // --- Render UI Function ---
    function renderUI() {
        fileCountEl.textContent = files.length;
        
        if (files.length === 0) {
            emptyStateEl.classList.remove('hidden');
            fileListEl.classList.add('hidden');
            successBadgeEl.classList.add('hidden');
        } else {
            emptyStateEl.classList.add('hidden');
            fileListEl.classList.remove('hidden');
        }

        // Generate Button HTML with Hover/Click Effects (Monochrome Style)
        let buttonHTML = '';
        const btnBaseClass = "w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold flex justify-center items-center gap-3 transition-all duration-300 transform active:scale-95 text-sm md:text-base border shadow-lg";

        if (files.length === 0) {
            buttonHTML = '';
        } else if (isProcessing) {
            buttonHTML = `
                <button disabled class="${btnBaseClass} bg-[#2a2a2a] text-textSub cursor-not-allowed border-white/5 opacity-80">
                    <i data-lucide="loader" class="animate-spin text-white w-5 h-5"></i> Compressing...
                </button>
            `;
        } else if (isZipReady) {
            buttonHTML = `
                 <button onclick="downloadZip()" class="${btnBaseClass} bg-white text-black hover:bg-gray-200 border-white hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <i data-lucide="package-check" class="w-5 h-5 animate-bounce"></i> Download ZIP
                </button>
            `;
            successBadgeEl.classList.remove('hidden');
        } else {
            buttonHTML = `
                <button onclick="processAll()" class="${btnBaseClass} bg-white text-black hover:bg-gray-200 border-white hover:-translate-y-1 group shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]">
                    <span class="group-hover:animate-bounce"><i data-lucide="zap" fill="currentColor" class="w-5 h-5"></i></span> 
                    Compress ${files.length} Images Now
                </button>
            `;
            successBadgeEl.classList.add('hidden');
        }

        actionButtonsDesktopEl.innerHTML = buttonHTML;
        actionButtonsMobileEl.innerHTML = buttonHTML;
        
        // Render List Items
        if (files.length > 0) {
            fileListEl.innerHTML = files.map((file, index) => {
                const isProcessed = file.processed !== null;
                const percentSave = isProcessed 
                    ? Math.round(((file.originalSize - file.processed.size) / file.originalSize) * 100) 
                    : 0;
                
                return `
                    <div class="item-enter bg-[#2a2a2a] hover:bg-[#333] hover:border-white/20 rounded-xl p-2 md:p-2.5 flex items-center gap-3 border border-white/5 transition-all duration-300 group relative overflow-hidden shadow-sm" style="animation-delay: ${index * 50}ms">
                        ${isProcessed ? '<div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>' : ''}
                        
                        <!-- Thumbnail -->
                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10 relative z-10 group-hover:scale-105 transition-transform duration-300">
                            <img src="${file.preview}" alt="preview" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0 relative z-10">
                            <p class="text-xs md:text-sm font-medium text-textMain truncate pr-2 group-hover:text-white transition-colors">${file.file.name}</p>
                            <div class="flex items-center gap-2 mt-0.5 text-[10px] md:text-[11px]">
                                <span class="text-textSub">${formatBytes(file.originalSize)}</span>
                                ${isProcessed ? `
                                    <i data-lucide="arrow-right" class="w-3 h-3 text-textSub"></i>
                                    <span class="text-white font-bold">
                                        ${formatBytes(file.processed.size)}
                                    </span>
                                    <span class="text-white bg-white/10 px-1.5 rounded text-[9px] md:text-[10px] border border-white/20">
                                        -${percentSave}%
                                    </span>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="relative z-10">
                            ${isProcessed ? `
                                <a href="${file.processed.url}" download="min_${file.file.name}" class="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:scale-90 transition-all duration-200" title="Download">
                                    <i data-lucide="download" class="w-4 h-4 md:w-[18px]"></i>
                                </a>
                            ` : `
                                <button onclick="removeFile('${file.id}')" class="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-textSub hover:text-red-400 hover:bg-red-500/10 hover:scale-110 active:scale-90 transition-all duration-200" title="Remove">
                                    <i data-lucide="x" class="w-4 h-4 md:w-[18px]"></i>
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }).join('');
            
            lucide.createIcons();
        }
    }

    renderUI();