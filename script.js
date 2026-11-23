document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Footer Year
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Dark / Light Theme Toggle (persisted in localStorage)
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    themeToggle.addEventListener("click", () => {
        const current = root.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
    });

    // 3. Mobile Navigation Menu
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
    });

    // 4. Copy Email to Clipboard
    const copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            const email = copyBtn.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied! ✓";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            } catch {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    // 5. Project Category Filtering + Live Search
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const searchInput = document.getElementById("project-search");
    const projectCount = document.getElementById("project-count");

    let activeCategory = "all";

    function updateProjects() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const categories = card.dataset.category.split(" ");
            const text = card.textContent.toLowerCase();

            const matchesCategory = activeCategory === "all" || categories.includes(activeCategory);
            const matchesSearch = !query || text.includes(query);

            if (matchesCategory && matchesSearch) {
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });

        projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.filter;
            updateProjects();
        });
    });

    searchInput.addEventListener("input", updateProjects);
    updateProjects();

    // 6. Scroll Reveal & Active Nav Link Highlighting
    const sections = document.querySelectorAll("section.section");
    const navItems = document.querySelectorAll(".nav-link");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1 }
    );

    sections.forEach((section) => revealObserver.observe(section));

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navItems.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => navObserver.observe(section));
});
