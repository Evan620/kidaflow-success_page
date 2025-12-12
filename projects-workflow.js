/* ========================================
   Workflow Portfolio JavaScript
   Interactive node controls
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    const nodes = document.querySelectorAll('.project-node');

    // NOTE: Old manual "push down" logic is REMOVED.
    // The CSS Flexbox layout now handles this natively! 
    // When a node expands (height increases), siblings below 
    // are automatically pushed down by the browser layout engine.

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    nodes.forEach(node => {
        node.classList.add('fade-in-up');
        observer.observe(node);
    });

    // Search Functionality
    const searchInput = document.getElementById('projectSearch');

    searchInput?.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        nodes.forEach(node => {
            // Get searchable content
            const title = node.querySelector('.node-title')?.textContent.toLowerCase() || '';
            const subtitle = node.querySelector('.node-subtitle')?.textContent.toLowerCase() || '';
            const desc = node.querySelector('.node-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(node.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase()).join(' ');

            // Try to find category from closest parent, though with new layout div structure might differ
            // We can check attributes or just search content

            const content = `${title} ${subtitle} ${desc} ${tags}`;

            if (content.includes(searchTerm)) {
                node.classList.remove('dimmed');
                // Ensure it's visible in flow
                node.style.display = '';
            } else {
                node.classList.add('dimmed');
                // Optional: completely hide from flow so grid tidies up?
                // node.style.display = 'none'; 
                // User asked for dimming previously, usually better to keep layout stable.
                // Keeping dimming for now.
            }
        });

        if (searchTerm === '') {
            nodes.forEach(n => {
                n.classList.remove('dimmed');
                n.style.display = '';
            });
        }
    });
});
