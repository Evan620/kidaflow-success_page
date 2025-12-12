
document.addEventListener('DOMContentLoaded', () => {

    /* ===== Pagination & Search Logic ===== */
    const itemsPerPage = 12;
    let currentPage = 1;
    let allNodes = Array.from(document.querySelectorAll('.project-node'));
    // Store original parent to clone from if needed, or just re-append. 
    // Since we are moving them, we need to be careful not to lose them.
    // Let's detach them from DOM initially to hold in memory.
    allNodes.forEach(node => node.remove());

    let filteredNodes = allNodes; // Initially all nodes

    const projectsGrid = document.getElementById('projectsGrid');
    const paginationControls = document.getElementById('paginationControls');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageIndicator = document.getElementById('pageIndicator');
    const searchInput = document.getElementById('projectSearch');

    // Function to update the view based on state
    function updateView() {
        const isSearching = searchInput && searchInput.value.trim().length > 0;

        // 1. Determine which nodes should be visible
        const nodesToShow = isSearching ? filteredNodes : filteredNodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        // 2. Clear Grid
        projectsGrid.innerHTML = '';

        // 3. Create Columns
        // Determine number of columns based on window width (simple check)
        const width = window.innerWidth;
        let numCols = 3;
        if (width <= 768) numCols = 1;
        else if (width <= 1200) numCols = 2;

        const columns = [];
        for (let i = 0; i < numCols; i++) {
            const col = document.createElement('div');
            col.className = 'project-column';
            columns.push(col);
            projectsGrid.appendChild(col);
        }

        // 4. Distribute Nodes into Columns (Masonry-ish / Sequential)
        // We want left-to-right ordering visual, so:
        // Item 0 -> Col 0
        // Item 1 -> Col 1
        // Item 2 -> Col 2
        // Item 3 -> Col 0...
        nodesToShow.forEach((node, index) => {
            node.style.display = 'block';
            node.classList.remove('fade-in');
            node.style.opacity = ''; // Reset

            const colIndex = index % numCols;
            columns[colIndex].appendChild(node);

            // Staggered Animation
            setTimeout(() => {
                node.classList.add('fade-in');
            }, index * 30);
        });

        // Fade in the grid after columns are set up (prevents horizontal flash)
        requestAnimationFrame(() => {
            projectsGrid.style.opacity = '1';
        });

        // 5. Update Pagination Controls
        if (paginationControls) {
            if (isSearching) {
                paginationControls.style.display = 'none';
            } else {
                const totalMatching = filteredNodes.length;

                if (totalMatching <= itemsPerPage) {
                    paginationControls.style.display = 'none';
                } else {
                    paginationControls.style.display = 'flex';
                    const totalPages = Math.ceil(totalMatching / itemsPerPage);
                    if (pageIndicator) pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

                    if (prevBtn) prevBtn.disabled = currentPage === 1;
                    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
                }
            }
        }
    }

    // Window Resize Handler to re-distribute columns
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateView, 200);
    });

    // Pagination Click Handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateView();
                projectsGrid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredNodes.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateView();
                projectsGrid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ===== Search Functionality ===== */
    function filterProjects(query) {
        query = query.toLowerCase();

        if (!query) {
            filteredNodes = allNodes;
        } else {
            filteredNodes = allNodes.filter(node => {
                const title = node.querySelector('.node-title')?.textContent.toLowerCase() || '';
                const subtitle = node.querySelector('.node-subtitle')?.textContent.toLowerCase() || '';
                const description = node.querySelector('.node-description')?.textContent.toLowerCase() || '';
                const tags = Array.from(node.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());

                return title.includes(query) ||
                    subtitle.includes(query) ||
                    description.includes(query) ||
                    tags.some(tag => tag.includes(query));
            });
        }

        currentPage = 1;
        updateView();
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProjects(e.target.value);
        });
    }

    /* ===== Node Expand Logic (Optional) ===== */
    // If user wants expand logic back, we can add it here.
    // For now, just handling layout.

    // Initial Render
    updateView();
});
