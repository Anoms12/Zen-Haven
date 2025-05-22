// ==UserScript==
// @name        Custom Toolbox UI (Safe Mode)
// @description Only injects UI when #navigator-toolbox has [haven]
// @include     main
// ==/UserScript==

(function () {
  const { document } = window;
  let toolboxObserver; // Declare at top level
  console.log("[ZenHaven] Script loaded");

  function getGradientCSS(theme) {
    if (!theme || theme.type !== "gradient" || !theme.gradientColors?.length) return "transparent";

    const angle = Math.round(theme.rotation || 0);
    const stops = theme.gradientColors.map(({ c }) => {
      const [r, g, b] = c;
      return `rgb(${r}, ${g}, ${b})`;
    }).join(", ");

    return `linear-gradient(${angle}deg, ${stops})`;
  }


  function setupCustomUI() {
    console.log("[ZenHaven] Setting up UI...");
    const toolbox = document.getElementById("navigator-toolbox");
    if (!toolbox) {
      console.log("[ZenHaven] Toolbox not found!");
      return;
    }

    // Only activate if [haven] attribute is present
    if (!toolbox.hasAttribute("haven")) {
      console.log("[ZenHaven] Haven attribute not present");
      return;
    }

    console.log("[ZenHaven] Haven attribute found, proceeding with UI setup");

    // Hide all children except the toolbox itself
    Array.from(toolbox.children).forEach((child) => {
      child.style.display = "none";
    });

    // Check if custom toolbar already exists
    if (document.getElementById("custom-toolbar")) {
      console.log("[ZenHaven] Custom toolbar already exists");
      return;
    }

    // Create container for new UI elements
    const customContainer = document.createElement("div");
    customContainer.id = "custom-toolbar";
    toolbox.appendChild(customContainer);

    // Create top div with header icon and text
    const topDiv = document.createElement("div");
    topDiv.id = "toolbar-header";

    // Add header icon
    const headerIcon = document.createElement("span");
    headerIcon.className = "header-icon";
    headerIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="currentColor"/>
    </svg>`;

    // For header icon
    headerIcon.className = "toolbarbutton-1";

    const headerText = document.createElement("span");
    headerText.className = "header-text";
    headerText.textContent = "Haven";

    topDiv.appendChild(headerIcon);
    topDiv.appendChild(headerText);
    customContainer.appendChild(topDiv);

    // Create middle container for function buttons
    const functionsContainer = document.createElement("div");
    functionsContainer.id = "functions-container";
    customContainer.appendChild(functionsContainer);

    // Define button configs with labels and SVG placeholders
    const buttonConfigs = [
      {
        id: "haven-downloads-button",
        label: "Downloads",
        command: "downloads",
        svgContent: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM8 4V8.5L11 10L10.5 11L7 9.25V4H8Z" fill="currentColor"/>
        </svg>`,
      },
      {
        id: "haven-workspaces-button",
        label: "Workspaces",
        command: "workspaces",
        svgContent: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2H13V14H3V2ZM2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 0.96814 14.5523 0.96814 14V2ZM4 4H12V5H4V4ZM4 7H12V8H4V7ZM12 10H4V11H12V10Z" fill="currentColor"/>
        </svg>`,
      },
      {
        id: "haven-history-button",
        label: "History",
        command: "history",
        svgContent: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1.06567H14.9613V4.0144H1L1 1.06567ZM0 1.06567C0 0.513389 0.447715 0.0656738 1 0.0656738H14.9613C15.5136 0.0656738 15.9613 0.513389 15.9613 1.06567V4.0144C15.9613 4.55603 15.5307 4.99708 14.9932 5.01391V5.02686V13C14.9932 14.6569 13.65 16 11.9932 16H3.96814C2.31129 16 0.96814 14.6569 0.96814 13V5.02686V5.01391C0.430599 4.99708 0 4.55603 0 4.0144V1.06567ZM13.9932 5.02686H1.96814V13C1.96814 14.1046 2.86357 15 3.96814 15H11.9932C13.0977 15 13.9932 14.1046 13.9932 13V5.02686ZM9.95154 8.07495H6.01318V7.07495H9.95154V8.07495Z" fill="currentColor"/>
        </svg>`,
      },
    ];

    // Modify the button creation code
    buttonConfigs.forEach((config) => {
      const customDiv = document.createElement("div");
      customDiv.className = "custom-button";
      customDiv.setAttribute("id", config.id);

      // Create icon span
      const iconSpan = document.createElement("span");
      iconSpan.className = "icon";
      iconSpan.innerHTML = config.svgContent;

      // Create label span
      const labelSpan = document.createElement("span");
      labelSpan.className = "label";
      labelSpan.textContent = config.label;

      customDiv.appendChild(iconSpan);
      customDiv.appendChild(labelSpan);

      // Add click handler for haven container attributes
      customDiv.addEventListener("click", (event) => {
        // Handle haven container attributes
        const havenContainer = document.getElementById("zen-haven-container");
        if (havenContainer) {
          const currentAttr = `haven-${config.command}`;
          const hasCurrentAttr = havenContainer.hasAttribute(currentAttr);

          // If clicking same button and container is visible, hide it
          if (hasCurrentAttr && havenContainer.style.display !== "none") {
            havenContainer.style.display = "none";
            havenContainer.removeAttribute(currentAttr);
            return;
          }

          // Remove all existing content first
          havenContainer.innerHTML = '';

          // Remove all haven- attributes
          const attrs = havenContainer.getAttributeNames();
          attrs.forEach((attr) => {
            if (attr.startsWith("haven-")) {
              havenContainer.removeAttribute(attr);
            }
          });

          // Set new attribute for current view and ensure visibility
          havenContainer.setAttribute(currentAttr, "");
          havenContainer.style.display = "flex";
        }

        // Trigger original button click
        const originalButton = document.getElementById(config.command + "-button");
        if (originalButton) {
          originalButton.click();
          event.stopPropagation(); // Prevent double triggers
        }
      });

      // Add click animation class
      customDiv.addEventListener("mousedown", () => {
        customDiv.classList.add("clicked");
      });
      customDiv.addEventListener("mouseup", () => {
        customDiv.classList.remove("clicked");
      });
      customDiv.addEventListener("mouseleave", () => {
        customDiv.classList.remove("clicked");
      });

      functionsContainer.appendChild(customDiv);
    });

    // Handle bottom buttons
    const sidebarBottomButtons = document.getElementById("zen-sidebar-bottom-buttons");
    const workspacesButton = sidebarBottomButtons?.querySelector("#zen-workspaces-button");

    if (sidebarBottomButtons && workspacesButton) {
      // Count workspaces and store in variable
      const workspaceCount = workspacesButton.children.length;
      console.log(`[ZenHaven] Found ${workspaceCount} workspaces`);

      // Move the original buttons to our container
      customContainer.appendChild(sidebarBottomButtons);

      // Hide workspace button
      workspacesButton.style.display = "none";

      // Add CSS to style the bottom buttons
      const customStyles = document.createElement("style");
      customStyles.textContent = `
            #zen-sidebar-bottom-buttons {
                display: flex !important;
                justify-content: space-between;
                height: min-content;
                width: 100%;
                padding: 8px;
            }

            #zen-sidebar-bottom-buttons > * {
                margin: 0 5px;
                -moz-context-properties: fill, fill-opacity !important;
            }

            #zen-sidebar-bottom-buttons toolbarbutton {
                -moz-appearance: none !important;
            }
        `;
      document.head.appendChild(customStyles);
    }

    // Create sidebar container
    const sidebarSplitter = document.getElementById("zen-sidebar-splitter");
    if (sidebarSplitter) {
      const sidebarContainer = document.createElement("div");
      sidebarContainer.id = "zen-haven-container";
      sidebarContainer.style.cssText = `
            height: 100%;
            width: 60vw;
            position: relative;
            display: none;
            flex-direction: column;
        `;

      // Find the tabbox and inject before it
      const tabbox = document.getElementById("tabbrowser-tabbox");
      if (tabbox) {
        // Insert before the tabbox
        tabbox.parentNode.insertBefore(sidebarContainer, tabbox);
        console.log("[ZenHaven] Sidebar container added before tabbrowser-tabbox");
      } else {
        // Fallback to original placement after splitter
        sidebarSplitter.parentNode.insertBefore(
          sidebarContainer,
          sidebarSplitter.nextSibling
        );
        console.log("[ZenHaven] Tabbox not found, sidebar container added after splitter");
      }

      // Create workspace observer
      const workspaceObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "haven-workspaces") {
            console.log("[ZenHaven] Workspace observer triggered");

            // Toggle behavior - if workspaces are already shown, hide them
            const existingWorkspaces = sidebarContainer.querySelectorAll('.haven-workspace');
            if (existingWorkspaces.length > 0) {
              existingWorkspaces.forEach(ws => ws.remove());
              sidebarContainer.removeAttribute("haven-workspaces");
              return;
            }

            // Add styles for workspace button
            const workspaceStyles = document.createElement("style");
            workspaceStyles.textContent = `
              .haven-workspace-add-button {
                position: fixed;
                right: 16px;
                top: 16px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--toolbar-bgcolor);
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
              }
              .haven-workspace-add-button:hover {
                background: var(--toolbar-hover-bgcolor);
              }
              .haven-workspace-add-button svg {
                color: var(--toolbar-color);
              }
            `;
            document.head.appendChild(workspaceStyles);

            // Create new workspace divs if attribute is present
            if (sidebarContainer.hasAttribute("haven-workspaces")) {
              // Create add workspace button
              const addWorkspaceButton = document.createElement("div");
              addWorkspaceButton.className = "haven-workspace-add-button";
              addWorkspaceButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>`;
              addWorkspaceButton.addEventListener("click", () => {
                try {
                  if (typeof ZenWorkspaces === "undefined") {
                    throw new Error("ZenWorkspaces is not defined");
                  }
                  if (typeof ZenWorkspaces.openSaveDialog !== "function") {
                    throw new Error("openSaveDialog function is not available");
                  }
                  console.log("[ZenHaven] Attempting to open workspace save dialog...");
                  ZenWorkspaces.openSaveDialog();
                } catch (error) {
                  console.error("[ZenHaven] Error opening workspace dialog:", error);
                }
              });
              sidebarContainer.appendChild(addWorkspaceButton);

              const workspacesButton = document.getElementById("zen-workspaces-button");
              if (workspacesButton) {
                console.log("[ZenHaven] Found workspace button:", workspacesButton);

                // Get all workspace elements directly
                const workspaceElements = Array.from(workspacesButton.children);
                console.log("[ZenHaven] Workspace elements:", workspaceElements);

                workspaceElements.forEach((workspace) => {
                  // Create base workspace div
                  const workspaceDiv = document.createElement("div");
                  workspaceDiv.className = "haven-workspace";

                  // Get the workspace object using the UUID from the element
                  const uuid = workspace.getAttribute("zen-workspace-id");
                  ZenWorkspacesStorage.getWorkspaces().then((allWorkspaces) => {
                    const data = allWorkspaces.find(ws => ws.uuid === uuid);
                    if (data?.theme?.type === "gradient" && data.theme.gradientColors?.length) {
                      workspaceDiv.style.background = getGradientCSS(data.theme);
                      workspaceDiv.style.opacity = data.theme.opacity ?? 1;
                    } else {
                      // Fallback: use a solid neutral background
                      workspaceDiv.style.background = "var(--zen-colors-border)";
                      workspaceDiv.style.opacity = 1;
                    }
                  });


                  // Create content container
                  const contentDiv = document.createElement("div");
                  contentDiv.className = "haven-workspace-content";

                  // Find workspace sections using the workspace's own ID
                  const sections = document.querySelectorAll(
                    `.zen-workspace-tabs-section[zen-workspace-id="${workspace.getAttribute('zen-workspace-id')}"]`
                  );

                  sections.forEach(section => {
                    const root = section.shadowRoot || section;

                    // Create wrapper with same class
                    const sectionWrapper = document.createElement('div');
                    sectionWrapper.className = 'haven-workspace-section';

                    // Copy computed styles from original section
                    const computedStyle = window.getComputedStyle(section);
                    const cssText = Array.from(computedStyle).reduce((str, property) => {
                      return `${str}${property}:${computedStyle.getPropertyValue(property)};`;
                    }, '');
                    sectionWrapper.style.cssText = cssText;

                    // Move tab groups query inside the loop where root is defined
                    const tabGroups = root.querySelectorAll('tab-group');
                    // Clone tab groups with their styles
                    tabGroups.forEach(group => {
                      const groupClone = group.cloneNode(true);
                      // Copy computed styles from original group
                      const groupStyle = window.getComputedStyle(group);
                      const groupCssText = Array.from(groupStyle).reduce((str, property) => {
                        return `${str}${property}:${groupStyle.getPropertyValue(property)};`;
                      }, '');
                      groupClone.style.cssText = groupCssText;
                      sectionWrapper.appendChild(groupClone);
                    });

                    // Clone remaining children with their styles 
                    Array.from(root.children).forEach(child => {
                      if (!child.classList.contains('zen-tab-group')) {
                        const clone = child.cloneNode(true);
                        // Copy computed styles from original child
                        const childStyle = window.getComputedStyle(child);
                        const childCssText = Array.from(childStyle).reduce((str, property) => {
                          return `${str}${property}:${childStyle.getPropertyValue(property)};`;
                        }, '');
                        clone.style.cssText = childCssText;
                        sectionWrapper.appendChild(clone);
                      }
                    });

                    contentDiv.appendChild(sectionWrapper);
                  });

                  // Assemble workspace
                  workspaceDiv.appendChild(contentDiv);
                  sidebarContainer.appendChild(workspaceDiv);
                });
              }
            }
          }

          if (mutation.type === "attributes" && mutation.attributeName === "haven-downloads") {
            const sidebarContainer = document.getElementById("zen-haven-container");

            // --- 1. Cleanup Existing Elements ---
            const existingDownloadsContent = sidebarContainer.querySelector('.haven-downloads-container');
            if (existingDownloadsContent) {
              existingDownloadsContent.remove();
            }
            const existingDownloadsStyles = document.getElementById('haven-downloads-styles');
            if (existingDownloadsStyles) {
              existingDownloadsStyles.remove();
            }

            // --- 2. Check if Attribute Exists and Build Base UI ---
            if (sidebarContainer.hasAttribute("haven-downloads")) {
              const downloadsViewContainer = document.createElement("div");
              downloadsViewContainer.className = "haven-downloads-container";

              // --- Data Store and State ---
              let allFetchedDownloads = [];
              let filteredDisplayDownloads = [];
              let currentViewMode = 'recent';
              let currentStatusFilter = 'all';
              let currentCategoryFilter = 'all';
              let currentSearchTerm = '';

              // --- Helper Functions ---
              function formatBytes(bytes, decimals = 2) {
                if (!+bytes || bytes === 0) return '0 Bytes';
                const k = 1024;
                const dm = decimals < 0 ? 0 : decimals;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
              }

              function getFileIconDetails(filename) {
                const fn = filename || "";
                const extension = fn.includes('.') ? fn.split('.').pop().toLowerCase() : 'file';
                switch (extension) {
                  case 'pdf': return { text: 'PDF', className: 'pdf-icon' };
                  case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return { text: 'ZIP', className: 'zip-icon' };
                  case 'mp4': case 'mkv': case 'avi': case 'mov': case 'webm': return { text: 'VID', className: 'vid-icon' };
                  case 'doc': case 'docx': case 'odt': return { text: 'DOC', className: 'doc-icon' };
                  case 'mp3': case 'wav': case 'ogg': case 'aac': case 'flac': return { text: 'MP3', className: 'mp3-icon' };
                  case 'png': case 'jpg': case 'jpeg': case 'gif': case 'bmp': case 'svg': case 'webp': return { text: 'IMG', className: 'img-icon' };
                  case 'txt': return { text: 'TXT', className: 'doc-icon' };
                  case 'xls': case 'xlsx': case 'csv': return { text: 'XLS', className: 'doc-icon' };
                  case 'ppt': case 'pptx': return { text: 'PPT', className: 'doc-icon' };
                  case 'exe': case 'msi': case 'dmg': return { text: 'EXE', className: 'zip-icon' };
                  default: return { text: extension.toUpperCase().substring(0, 3), className: 'default-icon' };
                }
              }

              // **** getFileCategory ****
              function getFileCategory(filename) {
                const fn = filename || "";
                const extension = fn.includes('.') ? fn.split('.').pop().toLowerCase() : '';

                if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'heic', 'avif'].includes(extension)) return 'images';
                if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'mp4', 'mkv', 'avi', 'mov', 'webm', 'flv'].includes(extension)) return 'media';
                // Everything else (PDF, DOC, TXT, ZIP, EXE, etc.) will fall under 'documents' for filtering
                return 'documents';
              }


              function getStatusInfo(download) {
                const stat = download && download.status ? download.status : "unknown";
                switch (stat) {
                  case 'completed': return { text: 'Completed', className: 'status-completed' };
                  case 'failed': return { text: 'Failed', className: 'status-failed' };
                  case 'paused': return { text: 'Paused', className: 'status-paused' };
                  default: return { text: stat.charAt(0).toUpperCase() + stat.slice(1), className: 'status-unknown' };
                }
              }

              function timeAgo(timestamp) {
                const now = new Date();
                const then = new Date(timestamp);
                const seconds = Math.round((now - then) / 1000);
                const minutes = Math.round(seconds / 60);
                const hours = Math.round(minutes / 60);
                const days = Math.round(hours / 24);
                const weeks = Math.round(days / 7);
                const months = Math.round(days / 30.44);
                const years = Math.round(days / 365.25);

                if (seconds < 5) return "Just now";
                if (seconds < 60) return `${seconds} seconds ago`;
                if (minutes < 60) return `${minutes} minutes ago`;
                if (hours < 24) return `${hours} hours ago`;
                if (days === 1) return "Yesterday";
                if (days < 7) return `${days} days ago`;
                if (weeks === 1) return "1 week ago";
                if (weeks < 4) return `${weeks} weeks ago`;
                if (months === 1) return "1 month ago";
                if (months < 12) return `${months} months ago`;
                if (years === 1) return "1 year ago";
                return `${years} years ago`;
              }

              // --- UI Rendering ---
              function renderUI() {
                downloadsViewContainer.innerHTML = '';

                const header = document.createElement('div');
                header.className = 'haven-dl-header';
                const titleSection = document.createElement('div');
                titleSection.className = 'haven-dl-title-section';
                const titleIconPlaceholder = document.createElement('span');
                titleIconPlaceholder.className = 'haven-dl-title-icon-placeholder';
                titleIconPlaceholder.textContent = '⬇';
                const titleText = document.createElement('h1');
                titleText.className = 'haven-dl-title-text';
                titleText.textContent = 'Downloads';
                titleSection.appendChild(titleIconPlaceholder);
                titleSection.appendChild(titleText);
                header.appendChild(titleSection);

                const controls = document.createElement('div');
                controls.className = 'haven-dl-controls';

                const searchFilterRow = document.createElement('div');
                searchFilterRow.className = 'haven-dl-search-filter-row';

                const searchBox = document.createElement('div');
                searchBox.className = 'haven-dl-search-box';
                const searchIconPlaceholder = document.createElement('span');
                searchIconPlaceholder.className = 'haven-dl-search-icon-placeholder';
                searchIconPlaceholder.textContent = '🔍';
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.className = 'haven-dl-search-input';
                searchInput.placeholder = 'Search downloads...';
                searchInput.value = currentSearchTerm;
                searchBox.appendChild(searchIconPlaceholder);
                searchBox.appendChild(searchInput);
                searchFilterRow.appendChild(searchBox);

                const statusFilter = document.createElement('select');
                statusFilter.className = 'haven-dl-filter-dropdown';
                statusFilter.id = 'statusFilter';
                ['all', 'completed', 'paused', 'failed'].forEach(val => {
                  const option = document.createElement('option');
                  option.value = val;
                  option.textContent = val === 'paused' ? 'Paused/Interrupted' : val.charAt(0).toUpperCase() + val.slice(1);
                  if (val === currentStatusFilter) option.selected = true;
                  statusFilter.appendChild(option);
                });
                searchFilterRow.appendChild(statusFilter);

                const viewToggle = document.createElement('div');
                viewToggle.className = 'haven-dl-view-toggle';
                const recentBtn = document.createElement('button');
                recentBtn.className = `haven-dl-view-btn ${currentViewMode === 'recent' ? 'active' : ''}`;
                recentBtn.dataset.view = 'recent';
                recentBtn.title = 'Recent Downloads';
                recentBtn.textContent = 'Recent';
                const historyBtn = document.createElement('button');
                historyBtn.className = `haven-dl-view-btn ${currentViewMode === 'history' ? 'active' : ''}`;
                historyBtn.dataset.view = 'history';
                historyBtn.title = 'Download History';
                historyBtn.textContent = 'History';
                viewToggle.appendChild(recentBtn);
                viewToggle.appendChild(historyBtn);
                searchFilterRow.appendChild(viewToggle);
                controls.appendChild(searchFilterRow);

                const categoryTabs = document.createElement('div');
                categoryTabs.className = 'haven-dl-category-tabs';
                const categories = [
                  { id: 'all', text: '📁 All Files' }, { id: 'documents', text: '📄 Documents' },
                  { id: 'images', text: '🖼️ Images' }, { id: 'media', text: '🎵 Media' }
                ];
                categories.forEach(cat => {
                  const tab = document.createElement('button');
                  tab.className = `haven-dl-category-tab ${currentCategoryFilter === cat.id ? 'active' : ''}`;
                  tab.dataset.category = cat.id;
                  tab.textContent = cat.text;
                  categoryTabs.appendChild(tab);
                });
                controls.appendChild(categoryTabs);

                const stats = document.createElement('div');
                stats.className = 'haven-dl-stats-bar';
                const statsCounts = document.createElement('div');
                statsCounts.className = 'haven-dl-stats-counts';
                statsCounts.innerHTML = `Total: <strong id="totalCount">0</strong> Active: <strong id="activeCount">0</strong> Completed: <strong id="completedCount">0</strong>`;
                const viewInfoText = document.createElement('div');
                viewInfoText.className = 'haven-dl-view-info';
                viewInfoText.id = 'viewInfoText';
                viewInfoText.textContent = 'Showing recent downloads';
                stats.appendChild(statsCounts);
                stats.appendChild(viewInfoText);

                downloadsViewContainer.appendChild(header);
                downloadsViewContainer.appendChild(controls);
                downloadsViewContainer.appendChild(stats);

                const listContainer = document.createElement('div');
                listContainer.className = 'haven-dl-list-container';
                listContainer.id = 'downloadsListArea';
                downloadsViewContainer.appendChild(listContainer);

                updateAndRenderDownloadsList();
                attachEventListeners();
              }

              function updateAndRenderDownloadsList() {
                applyAllFilters();

                const listArea = downloadsViewContainer.querySelector('#downloadsListArea');
                if (!listArea) { console.error("downloadsListArea not found in updateAndRenderDownloadsList"); return; }
                listArea.innerHTML = '';

                const totalCountEl = downloadsViewContainer.querySelector('#totalCount');
                const activeCountEl = downloadsViewContainer.querySelector('#activeCount');
                const completedCountEl = downloadsViewContainer.querySelector('#completedCount');
                const viewInfoTextEl = downloadsViewContainer.querySelector('#viewInfoText');

                if (totalCountEl) totalCountEl.textContent = allFetchedDownloads.length;
                if (activeCountEl) activeCountEl.textContent = allFetchedDownloads.filter(d => d.status === 'paused').length;
                if (completedCountEl) completedCountEl.textContent = allFetchedDownloads.filter(d => d.status === 'completed').length;
                if (viewInfoTextEl) viewInfoTextEl.textContent = currentViewMode === 'recent' ? 'Showing recent downloads' : 'Showing download history';

                if (filteredDisplayDownloads.length === 0) {
                  const emptyState = document.createElement('div');
                  emptyState.className = 'haven-dl-empty-state';
                  const emptyIcon = document.createElement('span');
                  emptyIcon.className = 'haven-dl-empty-icon-placeholder';
                  emptyIcon.textContent = '📥';
                  const emptyText = document.createElement('p');
                  emptyText.textContent = 'No downloads found.';
                  emptyState.appendChild(emptyIcon);
                  emptyState.appendChild(emptyText);
                  listArea.appendChild(emptyState);
                  return;
                }

                if (currentViewMode === 'history') {
                  const groupedByDate = groupDownloadsByDate(filteredDisplayDownloads);
                  Object.keys(groupedByDate).sort((a, b) => {
                    if (a === "Today") return -1; if (b === "Today") return 1;
                    if (a === "Yesterday") return -1; if (b === "Yesterday") return 1;
                    const tsA = groupedByDate[a] && groupedByDate[a][0] ? groupedByDate[a][0].timestamp : 0;
                    const tsB = groupedByDate[b] && groupedByDate[b][0] ? groupedByDate[b][0].timestamp : 0;
                    return tsB - tsA;
                  })
                    .forEach(dateKey => {
                      const dateSeparator = document.createElement('div');
                      dateSeparator.className = 'haven-dl-date-separator';
                      dateSeparator.textContent = dateKey;
                      listArea.appendChild(dateSeparator);
                      groupedByDate[dateKey]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .forEach(item => listArea.appendChild(createDownloadItemElement(item)));
                    });
                } else {
                  filteredDisplayDownloads
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .forEach(item => listArea.appendChild(createDownloadItemElement(item)));
                }
              }

              function groupDownloadsByDate(downloads) {
                const groups = {};
                const now = new Date();

                downloads.forEach(download => {
                  const downloadDate = new Date(download.timestamp);
                  const diffTime = now - downloadDate;
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                  let dateKey;
                  if (diffDays === 0 && now.getDate() === downloadDate.getDate()) {
                    dateKey = 'Today';
                  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== downloadDate.getDate())) {
                    dateKey = 'Yesterday';
                  } else if (diffDays < 7) {
                    dateKey = downloadDate.toLocaleDateString(undefined, { weekday: 'long' });
                  } else if (diffDays < 30) {
                    const currentWeekStart = new Date(now);
                    currentWeekStart.setDate(now.getDate() - now.getDay());
                    currentWeekStart.setHours(0, 0, 0, 0);

                    const downloadWeekStart = new Date(downloadDate);
                    downloadWeekStart.setDate(downloadDate.getDate() - downloadDate.getDay());
                    downloadWeekStart.setHours(0, 0, 0, 0);

                    const diffWeeks = Math.floor((currentWeekStart.getTime() - downloadWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

                    if (diffWeeks === 1) dateKey = "Last Week";
                    else if (diffWeeks > 1 && diffWeeks <= 4) dateKey = `${diffWeeks} Weeks Ago`;
                    else dateKey = "Earlier this month";
                  } else if (diffDays < 365) {
                    dateKey = downloadDate.toLocaleDateString(undefined, { month: 'long' });
                  } else {
                    dateKey = downloadDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                  }

                  if (!groups[dateKey]) groups[dateKey] = [];
                  groups[dateKey].push(download);
                });
                return groups;
              }

              function createDownloadItemElement(item) {
                const el = document.createElement('div');
                el.className = 'haven-dl-item';
                if (item.status === 'failed') el.classList.add('failed-item');
                if (item.status === 'paused') el.classList.add('paused-item');

                const iconDetails = getFileIconDetails(item.filename);
                const statusInfo = getStatusInfo(item);

                let progressPercent = 0;
                if (item.status === 'completed') {
                  progressPercent = 100;
                } else if (item.progressBytes && item.totalBytes) {
                  progressPercent = item.totalBytes > 0 ? Math.min(100, Math.max(0, (item.progressBytes / item.totalBytes) * 100)) : 0;
                }

                const itemIconDiv = document.createElement('div');
                itemIconDiv.className = `haven-dl-item-icon ${iconDetails.className}`;
                itemIconDiv.textContent = iconDetails.text;

                const itemInfoDiv = document.createElement('div');
                itemInfoDiv.className = 'haven-dl-item-info';
                const itemNameDiv = document.createElement('div');
                itemNameDiv.className = 'haven-dl-item-name';
                itemNameDiv.title = `${item.filename || 'Unknown Filename'}\n${item.url || 'Unknown URL'}`;
                itemNameDiv.textContent = item.filename || 'Unknown Filename';
                const itemDetailsDiv = document.createElement('div');
                itemDetailsDiv.className = 'haven-dl-item-details';
                const sizeSpan = document.createElement('span');
                sizeSpan.textContent = formatBytes(item.totalBytes);
                const sepSpan = document.createElement('span');
                sepSpan.textContent = '•';
                const timeSpan = document.createElement('span');
                timeSpan.textContent = timeAgo(new Date(item.timestamp));
                const urlSpan = document.createElement('span');
                urlSpan.className = 'haven-dl-item-url';
                urlSpan.title = item.url || 'Unknown URL';
                urlSpan.textContent = item.url || 'Unknown URL';
                itemDetailsDiv.appendChild(sizeSpan);
                itemDetailsDiv.appendChild(sepSpan);
                itemDetailsDiv.appendChild(timeSpan);
                itemDetailsDiv.appendChild(urlSpan);
                itemInfoDiv.appendChild(itemNameDiv);
                itemInfoDiv.appendChild(itemDetailsDiv);

                const itemStatusSection = document.createElement('div');
                itemStatusSection.className = 'haven-dl-item-status-section';
                const progressBar = document.createElement('div');
                progressBar.className = 'haven-dl-item-progress-bar';
                const progressFill = document.createElement('div');
                progressFill.className = `haven-dl-item-progress-fill ${statusInfo.className}`;
                progressFill.style.width = `${progressPercent}%`;
                progressBar.appendChild(progressFill);
                const statusText = document.createElement('div');
                statusText.className = `haven-dl-item-status-text ${statusInfo.className}`;
                statusText.textContent = statusInfo.text;
                itemStatusSection.appendChild(progressBar);
                itemStatusSection.appendChild(statusText);

                const itemActionsDiv = document.createElement('div');
                itemActionsDiv.className = 'haven-dl-item-actions';
                itemActionsDiv.innerHTML = getActionButtonsHTML(item);

                el.appendChild(itemIconDiv);
                el.appendChild(itemInfoDiv);
                el.appendChild(itemStatusSection);
                el.appendChild(itemActionsDiv);

                itemActionsDiv.addEventListener('click', (e) => {
                  const action = e.target.closest('button')?.dataset.action;
                  if (action) handleItemAction(item, action, e);
                });

                itemInfoDiv.addEventListener('click', (e) => {
                  if (item.status === 'completed') {
                    handleItemAction(item, 'open', e);
                  }
                });
                return el;
              }

              function getActionButtonsHTML(item) {
                let buttons = '';
                if (item.status === 'completed') {
                  buttons += `<button class="haven-dl-action-btn" data-action="open" title="Open File">📂</button>`;
                  buttons += `<button class="haven-dl-action-btn" data-action="show" title="Show in Folder">📍</button>`;
                } else if (item.status === 'failed') {
                  buttons += `<button class="haven-dl-action-btn" data-action="retry" title="Retry Download">🔄</button>`;
                } else if (item.status === 'paused') {
                  buttons += `<button class="haven-dl-action-btn" data-action="resume" title="Resume Download (Conceptual)">▶️</button>`;
                }
                buttons += `<button class="haven-dl-action-btn" data-action="copy" title="Copy Download Link">📋</button>`;
                buttons += `<button class="haven-dl-action-btn" data-action="remove" title="Remove from History">🗑️</button>`;
                return buttons;
              }

              function handleItemAction(item, action, event) {
                event.stopPropagation();
                switch (action) {
                  case 'open':
                    try {
                      if (!item.targetPath) { alert("File path not available."); return; }
                      let file = new FileUtils.File(item.targetPath);
                      if (file.exists()) file.launch();
                      else alert(`File not found: ${item.filename}`);
                    } catch (e) { console.error("Error opening file:", e); alert(`Could not open file: ${item.filename}`); }
                    break;
                  case 'show':
                    try {
                      if (!item.targetPath) { alert("File path not available."); return; }
                      let file = new FileUtils.File(item.targetPath);
                      if (file.exists()) file.reveal();
                      else alert(`File not found: ${item.filename}`);
                    } catch (e) { console.error("Error showing file:", e); alert(`Could not show file: ${item.filename}`); }
                    break;
                  case 'retry': alert(`Retry download: ${item.filename} (Conceptual)`); break;
                  case 'resume': alert(`Resume download: ${item.filename} (Conceptual)`); break;
                  case 'copy':
                    try { Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString(item.url); }
                    catch (e) { console.error("Error copying link:", e); alert("Could not copy link."); }
                    break;
                  case 'remove':
                    (async () => {
                      try {
                        const { DownloadHistory } = ChromeUtils.importESModule("resource://gre/modules/DownloadHistory.sys.mjs");
                        await DownloadHistory.remove([item.historicalData]);
                        allFetchedDownloads = allFetchedDownloads.filter(d => d.id !== item.id);
                        updateAndRenderDownloadsList();
                      } catch (e) { console.error("Error removing download from history:", e); alert("Could not remove download from history."); }
                    })();
                    break;
                }
              }

              // **** MODIFIED applyAllFilters for category logic ****
              function applyAllFilters() {
                const searchTermLower = currentSearchTerm.toLowerCase();
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

                filteredDisplayDownloads = allFetchedDownloads.filter(item => {
                  if (currentViewMode === 'recent' && item.timestamp < sevenDaysAgo) return false;
                  if (currentViewMode === 'history' && item.timestamp >= sevenDaysAgo) return false;
                  if (currentStatusFilter !== 'all' && item.status !== currentStatusFilter) return false;
                  
                  // Category filter logic:
                  // If 'all' is selected, always true for category.
                  // Otherwise, item's category must match the selected filter.
                  if (currentCategoryFilter !== 'all' && item.category !== currentCategoryFilter) {
                      return false;
                  }

                  const itemFilename = item.filename || "";
                  const itemUrl = item.url || "";

                  if (searchTermLower &&
                    !itemFilename.toLowerCase().includes(searchTermLower) &&
                    !itemUrl.toLowerCase().includes(searchTermLower)) {
                    return false;
                  }
                  return true;
                });
                filteredDisplayDownloads.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              }


              function attachEventListeners() {
                const searchInputEl = downloadsViewContainer.querySelector('.haven-dl-search-input');
                if (searchInputEl) searchInputEl.addEventListener('input', (e) => {
                  currentSearchTerm = e.target.value;
                  updateAndRenderDownloadsList();
                });

                const statusFilterEl = downloadsViewContainer.querySelector('#statusFilter');
                if (statusFilterEl) statusFilterEl.addEventListener('change', (e) => {
                  currentStatusFilter = e.target.value;
                  updateAndRenderDownloadsList();
                });

                downloadsViewContainer.querySelectorAll('.haven-dl-view-btn').forEach(btn => {
                  btn.addEventListener('click', (e) => {
                    currentViewMode = e.currentTarget.dataset.view;
                    downloadsViewContainer.querySelectorAll('.haven-dl-view-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    updateAndRenderDownloadsList();
                  });
                });
                downloadsViewContainer.querySelectorAll('.haven-dl-category-tab').forEach(tab => {
                  tab.addEventListener('click', (e) => {
                    currentCategoryFilter = e.currentTarget.dataset.category;
                    downloadsViewContainer.querySelectorAll('.haven-dl-category-tab').forEach(t => t.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    updateAndRenderDownloadsList();
                  });
                });
              }

              (async () => {
                try {
                  const { DownloadHistory } = ChromeUtils.importESModule("resource://gre/modules/DownloadHistory.sys.mjs");
                  const { Downloads } = ChromeUtils.importESModule("resource://gre/modules/Downloads.sys.mjs");
                  const { PrivateBrowsingUtils } = ChromeUtils.importESModule("resource://gre/modules/PrivateBrowsingUtils.sys.mjs");
                  const { FileUtils } = ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs");

                  const isPrivate = PrivateBrowsingUtils.isContentWindowPrivate(window);
                  const list = await DownloadHistory.getList({ type: isPrivate ? Downloads.ALL : Downloads.PUBLIC });
                  const allDownloadsRaw = await list.getAll();

                  allFetchedDownloads = allDownloadsRaw.map(d => {
                    let filename = 'Unknown Filename';
                    let targetPath = '';

                    if (d.target && d.target.path) {
                      try {
                        let file = new FileUtils.File(d.target.path);
                        filename = file.leafName;
                        targetPath = d.target.path;
                      } catch (e) {
                        console.warn("[ZenHaven Downloads] Error creating FileUtils.File or getting leafName from path:", d.target.path, e);
                        const pathParts = String(d.target.path).split(/[\\/]/);
                        filename = pathParts.pop() || "ErrorInPathUtil";
                      }
                    }

                    if ((filename === 'Unknown Filename' || filename === "ErrorInPathUtil") && d.source && d.source.url) {
                      try {
                        const decodedUrl = decodeURIComponent(d.source.url);
                        // More robust URL parsing for filename
                        let urlObj;
                        try {
                            urlObj = new URL(decodedUrl);
                            const pathSegments = urlObj.pathname.split('/');
                            filename = pathSegments.pop() || pathSegments.pop() || 'Unknown from URL Path'; // handle trailing slash
                        } catch (urlParseError) { // If URL is not absolute or malformed for new URL()
                            const urlPartsDirect = String(d.source.url).split('/');
                            const lastPartDirect = urlPartsDirect.pop() || urlPartsDirect.pop();
                            filename = (lastPartDirect.split('?')[0]) || 'Invalid URL Filename';
                        }

                      }
                      catch (e) {
                        console.warn("[ZenHaven Downloads] Error extracting filename from URL:", d.source.url, e);
                        const urlPartsDirect = String(d.source.url).split('/');
                        const lastPartDirect = urlPartsDirect.pop() || urlPartsDirect.pop();
                        filename = (lastPartDirect.split('?')[0]) || 'Invalid URL Filename';
                      }
                    }

                    let status = 'unknown';
                    let progressBytes = Number(d.bytesTransferredSoFar) || 0;
                    let totalBytes = Number(d.totalBytes) || 0;

                    if (d.succeeded) {
                      status = 'completed';
                      if (d.target && d.target.size && Number(d.target.size) > totalBytes) {
                        totalBytes = Number(d.target.size);
                      }
                      progressBytes = totalBytes;
                    } else if (d.error) { status = 'failed'; }
                    else if (d.canceled) { status = 'failed'; }
                    else if (d.stopped || d.hasPartialData || d.state === Downloads.STATE_PAUSED || d.state === Downloads.STATE_SCANNING || d.state === Downloads.STATE_BLOCKED_PARENTAL || d.state === Downloads.STATE_BLOCKED_POLICY || d.state === Downloads.STATE_BLOCKED_SECURITY || d.state === Downloads.STATE_DIRTY) {
                      status = 'paused';
                    } else if (d.state === Downloads.STATE_DOWNLOADING) { status = 'paused'; }

                    if (status === 'completed' && totalBytes === 0 && progressBytes > 0) {
                      totalBytes = progressBytes;
                    }

                    return {
                      id: d.id,
                      filename: String(filename || "FN_MISSING"),
                      size: formatBytes(totalBytes),
                      totalBytes: totalBytes,
                      progressBytes: progressBytes,
                      type: getFileIconDetails(String(filename || "tmp.file")).text.toLowerCase(),
                      category: getFileCategory(String(filename || "tmp.file")), // Uses updated getFileCategory
                      status: status,
                      url: String(d.source?.url || 'URL_MISSING'),
                      timestamp: d.endTime || d.startTime || Date.now(),
                      targetPath: String(targetPath || ""),
                      historicalData: d,
                    };
                  }).filter(d => d.timestamp);

                  const loggableDownloads = allFetchedDownloads.map(item => {
                    const { historicalData, ...rest } = item;
                    return { ...rest, historicalDataId: historicalData.id };
                  });
                  console.log("[ZenHaven Downloads] Processed Download Items (for logging):", JSON.parse(JSON.stringify(loggableDownloads)));

                  renderUI();
                } catch (err) {
                  console.error("[ZenHaven Downloads] Error fetching or processing download history:", err);
                  if (downloadsViewContainer) {
                    downloadsViewContainer.innerHTML = `<div class="haven-dl-empty-state"><p>Error loading download history (async init).</p><pre>${err.message}\n${err.stack}</pre></div>`;
                  }
                }
              })();

              sidebarContainer.appendChild(downloadsViewContainer);

              const downloadsStyles = document.createElement("style");
              downloadsStyles.id = "haven-downloads-styles";
              downloadsStyles.textContent = `
                :root {
                  --haven-dl-bg: #202020; --haven-dl-surface-bg: #2a2a2a; --haven-dl-text-primary: #E0E0E0;
                  --haven-dl-text-secondary: #A0A0A0; --haven-dl-text-disabled: #666666; --haven-dl-border-color: #404040;
                  --haven-dl-accent-color: #7B68EE; --haven-dl-accent-hover: #9370DB; --haven-dl-success-color: #5CB85C;
                  --haven-dl-warning-color: #F0AD4E; --haven-dl-error-color: #D9534F;
                  --haven-dl-icon-bg-pdf: linear-gradient(135deg, #D9534F, #CD5C5C); --haven-dl-icon-bg-zip: linear-gradient(135deg, #7B68EE, #6A5ACD);
                  --haven-dl-icon-bg-vid: linear-gradient(135deg, #F0AD4E, #EE9A2E); --haven-dl-icon-bg-doc: linear-gradient(135deg, #5BC0DE, #46B8DA);
                  --haven-dl-icon-bg-mp3: linear-gradient(135deg, #DB7093, #D86087); --haven-dl-icon-bg-img: linear-gradient(135deg, #5CB85C, #4CAF50);
                  --haven-dl-icon-bg-default: linear-gradient(135deg, #6c757d, #5a6268);
                }
                .haven-downloads-container { display: flex; flex-direction: column; height: 100%; width: 100%; background-color: var(--haven-dl-bg); color: var(--haven-dl-text-primary); padding: 16px; box-sizing: border-box; overflow: hidden; font-family: system-ui, sans-serif; max-height: 100vh; }
                .haven-dl-header { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 8px; }
                .haven-dl-title-section { display: flex; align-items: center; gap: 10px; }
                .haven-dl-title-icon-placeholder { font-size: 24px; color: var(--haven-dl-accent-color); }
                .haven-dl-title-text { font-size: 22px; font-weight: 600; margin: 0; line-height: 1; }
                .haven-dl-controls { flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; padding: 0 8px; }
                .haven-dl-search-filter-row { display: flex; gap: 10px; align-items: center; }
                .haven-dl-search-box { position: relative; flex-grow: 1; }
                .haven-dl-search-icon-placeholder { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--haven-dl-text-secondary); font-size: 16px; pointer-events: none; }
                .haven-dl-search-input { width: 100%; padding: 8px 10px 8px 34px; border: 1px solid var(--haven-dl-border-color); border-radius: 6px; background-color: var(--haven-dl-surface-bg); color: var(--haven-dl-text-primary); font-size: 14px; box-sizing: border-box; height: 36px; }
                .haven-dl-search-input:focus { outline: none; border-color: var(--haven-dl-accent-color); box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.3); }
                .haven-dl-filter-dropdown { padding: 0 12px; border: 1px solid var(--haven-dl-border-color); border-radius: 6px; background-color: var(--haven-dl-surface-bg); color: var(--haven-dl-text-primary); font-size: 13px; cursor: pointer; box-sizing: border-box; height: 36px; -moz-appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${"A0A0A0".substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.4-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 10px top 50%; background-size: .65em auto; padding-right: 30px; }
                .haven-dl-filter-dropdown:focus { outline: none; }
                .haven-dl-view-toggle { display: flex; background-color: var(--haven-dl-surface-bg); border-radius: 6px; border: 1px solid var(--haven-dl-border-color); overflow: hidden; height: 36px; }
                .haven-dl-view-btn { background-color: transparent; border: none; border-radius: 0; padding: 0 12px; color: var(--haven-dl-text-secondary); font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-grow: 1; }
                .haven-dl-view-btn:not(:last-child) { border-right: 1px solid var(--haven-dl-border-color); }
                .haven-dl-view-btn.active { background-color: var(--haven-dl-accent-color); color: white; }
                .haven-dl-view-btn:hover:not(.active) { background-color: var(--haven-dl-border-color); }
                .haven-dl-category-tabs { display: flex; gap: 4px; background-color: var(--haven-dl-surface-bg); padding: 4px; border-radius: 6px; border: 1px solid var(--haven-dl-border-color); }
                .haven-dl-category-tab { flex-grow: 1; padding: 6px 10px; border: none; background-color: transparent; border-radius: 4px; font-size: 12px; font-weight: 500; color: var(--haven-dl-text-secondary); cursor: pointer; transition: background-color 0.2s, color 0.2s; display: flex; align-items: center; justify-content: center; gap: 5px; height: 30px; box-sizing: border-box; }
                .haven-dl-category-tab.active { background-color: var(--haven-dl-accent-color); color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
                .haven-dl-category-tab:hover:not(.active) { color: var(--haven-dl-text-primary); background-color: var(--haven-dl-border-color); }
                .haven-dl-stats-bar { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--haven-dl-text-secondary); padding: 8px; margin-bottom: 8px; border-bottom: 1px solid var(--haven-dl-border-color); }
                .haven-dl-stats-bar strong { color: var(--haven-dl-text-primary); font-weight: 500; }
                .haven-dl-list-container { flex: 1 1 0; overflow-y: auto; overflow-x: hidden; padding-right: 5px; scrollbar-width: thin; scrollbar-color: var(--haven-dl-border-color) var(--haven-dl-surface-bg); min-height: 0; height: 0; border: 1px solid transparent; /* For debugging scroll */ }
                .haven-dl-list-container::-webkit-scrollbar { width: 8px; } .haven-dl-list-container::-webkit-scrollbar-track { background: var(--haven-dl-surface-bg); } .haven-dl-list-container::-webkit-scrollbar-thumb { background-color: var(--haven-dl-border-color); border-radius: 4px; }
                .haven-dl-date-separator { padding: 10px 8px; font-size: 11px; font-weight: 600; color: var(--haven-dl-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--haven-dl-border-color); margin: 16px 0 8px 0; position: sticky; top: -1px; background: var(--haven-dl-bg); z-index: 1; }
                .haven-dl-item { display: flex; align-items: center; padding: 12px 8px; border-bottom: 1px solid var(--haven-dl-border-color); transition: background-color 0.15s ease; cursor: default; }
                .haven-dl-item:hover { background-color: var(--haven-dl-surface-bg); } .haven-dl-item:last-child { border-bottom: none; }
                .haven-dl-item-icon { width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 13px; color: white; font-weight: bold; flex-shrink: 0; text-transform: uppercase; }
                .pdf-icon { background: var(--haven-dl-icon-bg-pdf); } .zip-icon { background: var(--haven-dl-icon-bg-zip); } .vid-icon { background: var(--haven-dl-icon-bg-vid); } .doc-icon { background: var(--haven-dl-icon-bg-doc); } .mp3-icon { background: var(--haven-dl-icon-bg-mp3); } .img-icon { background: var(--haven-dl-icon-bg-img); } .default-icon { background: var(--haven-dl-icon-bg-default); }
                .haven-dl-item-info { flex-grow: 1; min-width: 0; cursor: pointer; }
                .haven-dl-item-name { font-weight: 500; font-size: 14px; color: var(--haven-dl-text-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .haven-dl-item-details { font-size: 12px; color: var(--haven-dl-text-secondary); display: flex; gap: 6px; align-items: center; }
                .haven-dl-item-url { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 1; max-width: 150px; }
                .haven-dl-item-status-section { min-width: 100px; text-align: right; margin-left: 12px; flex-shrink: 0; }
                .haven-dl-item-progress-bar { width: 100%; height: 4px; background-color: var(--haven-dl-border-color); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
                .haven-dl-item-progress-fill { height: 100%; border-radius: 2px; } .haven-dl-item-status-text { font-size: 11px; font-weight: 500; }
                .status-completed { color: var(--haven-dl-success-color); } .haven-dl-item-progress-fill.status-completed { background-color: var(--haven-dl-success-color); }
                .status-paused { color: var(--haven-dl-warning-color); } .haven-dl-item-progress-fill.status-paused { background-color: var(--haven-dl-warning-color); }
                .status-failed { color: var(--haven-dl-error-color); } .haven-dl-item-progress-fill.status-failed { background-color: var(--haven-dl-error-color); }
                .haven-dl-item-actions { display: flex; gap: 6px; margin-left: 16px; flex-shrink: 0; }
                .haven-dl-action-btn { width: 30px; height: 30px; border: none; border-radius: 4px; background-color: var(--haven-dl-surface-bg); color: var(--haven-dl-text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, color 0.2s; font-size: 16px; }
                .haven-dl-action-btn:hover { background-color: var(--haven-dl-border-color); color: var(--haven-dl-text-primary); }
                .haven-dl-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--haven-dl-text-secondary); text-align: center; }
                .haven-dl-empty-icon-placeholder { font-size: 48px; color: var(--haven-dl-text-disabled); margin-bottom: 16px; }
                .haven-dl-empty-state p { font-size: 16px; }
              `;
              document.head.appendChild(downloadsStyles);
            }
          }

          if (mutation.type === "attributes" && mutation.attributeName === "haven-history") {
            console.log("[ZenHaven] History observer triggered");

            const existingHistory = sidebarContainer.querySelectorAll(".haven-history");
            existingHistory.forEach((el) => el.remove());

            if (sidebarContainer.hasAttribute("haven-history")) {
              const historyContainer = document.createElement("div");
              historyContainer.className = "haven-history";
              sidebarContainer.appendChild(historyContainer);

              const { PlacesUtils } = ChromeUtils.importESModule("resource://gre/modules/PlacesUtils.sys.mjs");
              const SESSION_TIMEOUT_MINUTES = 30;

              const startDate = new Date();
              startDate.setDate(startDate.getDate() - 7);

              const query = PlacesUtils.history.getNewQuery();
              query.beginTimeReference = query.TIME_RELATIVE_EPOCH;
              query.beginTime = startDate.getTime() * 1000;
              query.endTime = Date.now() * 1000;
              query.endTimeReference = query.TIME_RELATIVE_EPOCH;

              const options = PlacesUtils.history.getNewQueryOptions();
              options.sortingMode = options.SORT_BY_DATE_DESCENDING;
              options.resultType = options.RESULTS_AS_VISIT;
              options.includeHidden = false;

              const result = PlacesUtils.history.executeQuery(query, options);
              const root = result.root;
              root.containerOpen = true;

              const visitsByDate = new Map();

              for (let i = 0; i < root.childCount; i++) {
                const node = root.getChild(i);
                const visitTime = new Date(node.time / 1000);
                const dayKey = visitTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });

                if (!visitsByDate.has(dayKey)) visitsByDate.set(dayKey, []);
                visitsByDate.get(dayKey).push({ node, time: visitTime });
              }

              root.containerOpen = false;

              visitsByDate.forEach((visits, dayKey, index) => {
                const daySection = createCollapsible("📅 " + dayKey, false, "day-section");
                historyContainer.appendChild(daySection.wrapper);

                // Group by session within the day
                const sessions = [];
                let currentSession = [];
                let lastTime = null;

                visits.forEach(({ node, time }) => {
                  if (lastTime) {
                    const gap = (lastTime - time) / (1000 * 60);
                    if (gap > SESSION_TIMEOUT_MINUTES) {
                      if (currentSession.length > 0) {
                        sessions.push(currentSession);
                        currentSession = [];
                      }
                    }
                  }
                  currentSession.push({ node, time });
                  lastTime = time;
                });

                if (currentSession.length > 0) sessions.push(currentSession);

                sessions.forEach((session, idx) => {
                  const sessionStart = session[session.length - 1].time;
                  const sessionEnd = session[0].time;

                  const timeRange = `${sessionStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${sessionEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
                  const sessionTitle = `🕓 Session ${idx + 1} • ${timeRange}`;

                  const sessionSection = createCollapsible(sessionTitle, false, "session-section");
                  daySection.content.appendChild(sessionSection.wrapper);

                  session.forEach(({ node }) => {
                    const item = createHistoryItem(node);
                    sessionSection.content.appendChild(item);
                  });
                });
              });

              function createCollapsible(title, expanded = false, className = "") {
                const wrapper = document.createElement("div");
                wrapper.className = className;

                const header = document.createElement("div");
                header.className = "collapsible-header";
                header.innerHTML = `
                  <span class="section-toggle">${expanded ? "▼" : "▶"}</span>
                  <span class="section-title">${title}</span>
                `;

                const content = document.createElement("div");
                content.className = "collapsible-content";
                content.style.display = expanded ? "block" : "none";

                header.addEventListener("click", () => {
                  const isOpen = content.style.display === "block";
                  content.style.display = isOpen ? "none" : "block";
                  header.querySelector(".section-toggle").textContent = isOpen ? "▶" : "▼";
                });

                wrapper.appendChild(header);
                wrapper.appendChild(content);
                return { wrapper, content };
              }

              function createHistoryItem(node) {
                const item = document.createElement("div");
                item.className = "haven-history-item";

                const favicon = document.createElement("img");
                favicon.className = "history-icon";
                favicon.src = "https://www.google.com/s2/favicons?sz=32&domain_url=" + encodeURIComponent(node.uri);

                const content = document.createElement("div");
                content.className = "history-item-content";

                const title = document.createElement("div");
                title.className = "history-title";
                title.textContent = node.title || node.uri;

                const time = document.createElement("div");
                time.className = "history-time";
                time.textContent = new Date(node.time / 1000).toLocaleTimeString();

                content.appendChild(title);
                content.appendChild(time);

                item.appendChild(favicon);
                item.appendChild(content);

                item.addEventListener("click", () => {
                  gBrowser.selectedTab = gBrowser.addTab(node.uri, {
                    triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
                  });
                });

                return item;

              }



              const style = document.createElement("style");
              style.textContent = `
                .haven-history {
                  padding: 16px;
                  height: 90vh;
                  width: 50vw;
                  overflow-y: auto;
                  background: var(--zen-background);
                }
          
                .day-section, .session-section {
                  margin-bottom: 12px;
                }
          
                .collapsible-header {
                  background: var(--zen-themed-toolbar-bg);
                  border-radius: 6px;
                  padding: 12px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  cursor: pointer;
                }
          
                .collapsible-header:hover {
                  background: var(--toolbarbutton-hover-background);
                }
          
                .section-toggle {
                  font-family: monospace;
                  font-size: 12px;
                  width: 16px;
                  text-align: center;
                  color: var(--toolbar-color);
                }
          
                .section-title {
                  font-weight: 600;
                  color: var(--toolbar-color);
                }
          
                .collapsible-content {
                  padding: 8px 12px;
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                }
          
                .haven-history-item {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  padding: 8px;
                  border-radius: 4px;
                  transition: background-color 0.2s;
                  cursor: pointer;
                }
          
                .haven-history-item:hover {
                  background-color: var(--toolbarbutton-hover-background);
                }
          
                .history-icon {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: var(--zen-colors-border);
                }
          
                .history-item-content {
                  display: flex;
                  flex-direction: column;
                  gap: 2px;
                }
          
                .history-title {
                  font-weight: 500;
                  color: var(--toolbar-color);
                }
          
                .history-time {
                  font-size: 0.85em;
                  color: var(--toolbar-color);
                  opacity: 0.75;
                }
              `;
              document.head.appendChild(style);
            }
          }


        });
      });

      workspaceObserver.observe(sidebarContainer, { attributes: true });

      // Add styles for workspaces
      const workspaceStyles = document.createElement("style");
      workspaceStyles.textContent = `
        :root:has(#navigator-toolbox[haven]) {
          #zen-haven-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            overflow-x: scroll;
            overflow-y: hidden;
            
            .haven-workspace {
              height: 85% !important;
              min-width: 20%;
              background-color: var(--zen-primary-color);
              margin-left: 30px;
              margin-right: 30px;
              border-radius: 8px;
              border: 2px solid var(--zen-colors-border);
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px !important;

              .tab-reset-pin-button {
                display: none;
              }

              .tab-icon-image {
                margin-right: 10px;
              }
              
              .haven-workspace-header {
                margin: 2px !important;
                
                .workspace-icon {
                  font-size: 16px;
                }
                
                .workspace-title {
                  font-size: 16px !important;
                  margin-right: 10px !important;
                }
              }
              
              .haven-workspace-content {
                margin: 0 !important;
                padding: 10px !important;
                display: flex !important;
                align-items: center !important;
                height: fit-content !important;
                width: 100% !important;
                overflow: hidden !important;
                align-items: flex-start;
                
                .haven-workspace-section {
                  display: flex !important;
                  position: relative !important;
                  min-height: 70px !important;
                  margin: 0 !important;
                  padding-inline: 2px !important;
                  transform: translateX(0) !important;
                }
              }
            }
          }
        }

        .haven-workspace {
          width: 20%;
          height: 100%;
          display: none;
          padding: 16px;
        }

        .haven-workspace-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .workspace-icon {
          font-size: 24px;
          margin: 0;
          color: var(--toolbar-color);
        }

        .workspace-title {
          font-size: 24px;
          margin: 0;
          color: var(--toolbar-color);
        }

        #zen-haven-container[haven-workspaces] .haven-workspace {
          display: block;
        }

        .haven-workspace-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          overflow-y: auto;
        }

        .haven-workspace-content > * {
          width: 100%;
        }
      `;
      document.head.appendChild(workspaceStyles);
    } else {
      console.log("[ZenHaven] Sidebar splitter not found!");
    }

    // Update the CSS
    const customStyles = document.createElement("style");
    customStyles.textContent += `
      :root:has(#navigator-toolbox[haven]) {
        #custom-toolbar {
          width: 15vw;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        #toolbar-header {
          font-size: 20px;
          display: flex !important;
          align-items: center;
          margin-top: 5px;
          margin-left: 5px;
          margin-right: 50px;
          height: 24px;
        }

        #toolbar-header .header-icon {
          display: flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
        }

        #toolbar-header .header-icon svg {
          width: 20px !important;
          height: 20px !important;
        }

        #functions-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .custom-button {
          display: flex;
          flex-direction: column;
          width: 100px;
          height: 100px;
          margin-top: auto;
          margin-bottom: auto;
          align-items: center;
          justify-content: center;
        }

        .custom-button .icon svg {
          height: 24px !important;
        }

        .custom-button .label {
          display: block;
          margin-top: 8px;
          text-align: center;
        }

        .custom-button,
        .toolbarbutton-1 {
          transition: transform 0.1s ease-in-out, background-color 0.2s ease;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          position: relative;
        }

      . custom-button:hover,
        .toolbarbutton-1:hover {
          background-color: var(--toolbarbutton-hover-background);
          transform: translateY(-1px);
        } 

        .custom-button.clicked {
          transform: translateY(1px);
          background-color: var(--toolbarbutton-active-background);
        } 
    }
    `;
    document.head.appendChild(customStyles);

    console.log("[ZenHaven] UI setup complete");
  }

  // Create an observer for the [haven] attribute
  function createToolboxObserver() {
    console.log("[ZenHaven] Setting up toolbox observer");
    const toolbox = document.getElementById("navigator-toolbox");
    if (!toolbox) return;

    const toolboxObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "haven"
        ) {
          console.log("[ZenHaven] Haven attribute changed");

          if (toolbox.hasAttribute("haven")) {
            // Haven mode activated
            setupCustomUI();
          } else {
            // Haven mode deactivated - restore original UI
            console.log("[ZenHaven] Restoring original UI");

            // Restore bottom buttons after media controls toolbar
            const bottomButtons = document.getElementById("zen-sidebar-bottom-buttons");
            const mediaToolbar = document.getElementById("zen-media-controls-toolbar");

            if (bottomButtons && mediaToolbar) {
              // Insert after media toolbar
              mediaToolbar.parentNode.insertBefore(bottomButtons, mediaToolbar.nextSibling);

              // Show workspaces button again
              const workspacesButton = bottomButtons.querySelector("#zen-workspaces-button");
              if (workspacesButton) {
                workspacesButton.style.display = "";
              }
              console.log("[ZenHaven] Bottom buttons restored after media controls");
            } else {
              console.log("[ZenHaven] Could not find media controls toolbar or bottom buttons");
            }

            // Show all original children
            Array.from(toolbox.children).forEach((child) => {
              if (child.id !== "custom-toolbar") {
                child.style.display = "";
              }
            });

            // Remove custom elements
            const customToolbar = document.getElementById("custom-toolbar");
            const havenContainer = document.getElementById("zen-haven-container");

            if (customToolbar) {
              customToolbar.remove();
            }

            if (havenContainer) {
              havenContainer.remove();
            }
          }
        }
      });
    });

    toolboxObserver.observe(toolbox, { attributes: true });
    console.log("[ZenHaven] Toolbox observer active");
  }

  // After document ready, create and inject the haven toggle button
  // Modify the createHavenToggle function to insert after new tab button
  function createHavenToggle() {
    const sidebarBottomButtons = document.getElementById("zen-sidebar-bottom-buttons");
    if (!sidebarBottomButtons) {
      console.log('[ZenHaven] Bottom buttons container not found');
      return;
    }

    // Create the button with correct XUL structure
    const toolbarButton = document.createXULElement('toolbarbutton');
    toolbarButton.setAttribute('xmlns', 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul');
    toolbarButton.className = 'toolbarbutton-1 chromeclass-toolbar-additional subviewbutton-nav';
    toolbarButton.id = 'haven-toggle-button';
    toolbarButton.setAttribute('delegatesanchor', 'true');
    toolbarButton.setAttribute('removable', 'true');
    toolbarButton.setAttribute('overflows', 'true');
    toolbarButton.setAttribute('label', 'Toggle Haven');
    toolbarButton.setAttribute('tooltiptext', 'Toggle Haven Mode');

    // Add icon
    const iconSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3ZM3 3H13V13H3V3ZM5 5H11V6H5V5ZM11 7H5V8H11V7ZM5 9H11V10H5V9Z" fill="currentColor"/>
    </svg>`;

    const image = document.createXULElement('image');
    image.className = 'toolbarbutton-icon';
    image.style.listStyleImage = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSVG)}")`;
    image.setAttribute('label', 'Toggle Haven');

    const label = document.createXULElement('label');
    label.className = 'toolbarbutton-text';
    label.setAttribute('crop', 'end');
    label.setAttribute('flex', '1');
    label.setAttribute('value', 'Toggle Haven');

    // Add click handler
    toolbarButton.addEventListener('click', () => {
      const toolbox = document.getElementById('navigator-toolbox');
      if (toolbox) {
        if (toolbox.hasAttribute('haven')) {
          toolbox.removeAttribute('haven');
        } else {
          toolbox.setAttribute('haven', '');
        }
      }
    });

    // Assemble the button
    toolbarButton.appendChild(image);
    toolbarButton.appendChild(label);

    // Add to sidebar bottom buttons
    sidebarBottomButtons.appendChild(toolbarButton);
    console.log('[ZenHaven] Toggle button added to sidebar bottom buttons');
  }

  // Wait for startup before injecting UI
  if (gBrowserInit.delayedStartupFinished) {
    console.log("[ZenHaven] Browser already started");
    setupCustomUI();
    createToolboxObserver();
    createHavenToggle();
  } else {
    console.log("[ZenHaven] Waiting for browser startup");
    let observer = new MutationObserver(() => {
      if (gBrowserInit.delayedStartupFinished) {
        console.log("[ZenHaven] Browser startup detected");
        observer.disconnect();
        setupCustomUI();
        createToolboxObserver();
        createHavenToggle();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }
})();