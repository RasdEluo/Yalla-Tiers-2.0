document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    const welcome = document.getElementById("welcomeText");
    const analysisLink = document.querySelector('a[href="#Analysis"]');
    const analysisModal = document.getElementById('analysisModal');
    const yearSelect = document.getElementById('yearSelect');
    const makeSelect = document.getElementById('makeSelect');
    const modelSelect = document.getElementById('modelSelect');
    const typeSelect = document.querySelector('select[name="type"]');

    // Scroll behavior
    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 100;
        document.body.classList.toggle('scrolled', isScrolled);
        scrollToTopButton.classList.toggle('show', isScrolled);
        scrollToTopButton.classList.toggle('hide', !isScrolled);
        scrollToTopButton.style.zIndex = '9999';

        if (!isScrolled) {
            setTimeout(() => scrollToTopButton.classList.remove('show'), 300);
        }
    });

    // Scroll to top
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fade out welcome text
    if (welcome) {
        setTimeout(() => {
            welcome.classList.add("fade-out");
            setTimeout(() => (welcome.style.display = "none"), 1000);
        }, 3000);
    }

    // Smooth scroll to Analysis section and show modal
    if (analysisLink) {
        analysisLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('Analysis');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => (analysisModal.style.display = 'flex'), 1000);
            }
        });
    }

    // Close modal on outside click or Escape key
    window.addEventListener('click', (e) => {
        if (e.target === analysisModal) analysisModal.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") analysisModal.style.display = 'none';
    });

    // Populate Year dropdown
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    for (let y = currentYear; y >= 1900; y--) {
        yearSelect.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`);
    }

    // Load makes for a selected year and type
    async function loadMakesForYear(year) {
        try {
            const type = typeSelect.value || "car";
            const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${type}?format=json`);
            const { Results } = await res.json();

            makeSelect.innerHTML = '<option value="">Select Make</option>';
            Results.sort((a, b) => a.MakeName.localeCompare(b.MakeName)).forEach(({ MakeName }) => {
                makeSelect.insertAdjacentHTML('beforeend', `<option value="${MakeName}">${MakeName}</option>`);
            });

            makeSelect.disabled = false;
        } catch (err) {
            console.error(err);
            makeSelect.innerHTML = '<option>Error loading makes</option>';
        }
    }

    // Load models for selected make and year
    async function loadModels(make, year) {
        try {
            const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
            const { Results } = await res.json();

            modelSelect.innerHTML = '<option value="">Select Model</option>';
            if (Results.length) {
                Results.sort((a, b) => a.Model_Name.localeCompare(b.Model_Name)).forEach(({ Model_Name }) => {
                    modelSelect.insertAdjacentHTML('beforeend', `<option value="${Model_Name}">${Model_Name}</option>`);
                });
            } else {
                modelSelect.innerHTML = '<option value="">No models found</option>';
            }

            modelSelect.disabled = false;
        } catch (err) {
            console.error('Error fetching models:', err);
            modelSelect.innerHTML = '<option>Error loading models</option>';
        }
    }

    // Event Listeners for dropdowns
    yearSelect.addEventListener("change", () => {
        const year = yearSelect.value;
        if (year) {
            makeSelect.innerHTML = '<option>Loading...</option>';
            modelSelect.innerHTML = '<option value="">Select Model</option>';
            makeSelect.disabled = true;
            modelSelect.disabled = true;
            loadMakesForYear(year);
        }
    });

    typeSelect.addEventListener("change", () => {
        if (yearSelect.value) loadMakesForYear(yearSelect.value);
    });

    makeSelect.addEventListener("change", () => {
        const make = makeSelect.value;
        const year = yearSelect.value;
        if (make && year) {
            modelSelect.innerHTML = '<option>Loading...</option>';
            modelSelect.disabled = true;
            loadModels(make, year);
        }
    });





const response = await fetch("https://your-vercel-project.vercel.app/api/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: userPrompt })
});




document.getElementById('partSearchBtn').addEventListener('click', async () => {
  const input = document.getElementById('partSearchInput').value.trim();
  if (!input) return alert("Enter a part name.");

  const response = await fetch('https://yalla-tiers-2-0.vercel.app/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: `Give me info and suggestions for a "${input}"` })
  });

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || "No data returned.";

  document.querySelector('.result-section').innerHTML = `
    <h3>${input}</h3>
    <p>${content}</p>
  `;
});

















    
});
