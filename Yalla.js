document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopButton = document.getElementById('scrollToTop');
    const welcome = document.getElementById("welcomeText");
    

    // Scroll event for showing the button and controlling z-index
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            document.body.classList.add('scrolled');
            scrollToTopButton.classList.add('show');
            scrollToTopButton.classList.remove('hide');
        } else {
            document.body.classList.remove('scrolled');
            scrollToTopButton.classList.add('hide');
            setTimeout(() => {
                scrollToTopButton.classList.remove('show');
            }, 300);
        }

        // Keeps it above the video
        scrollToTopButton.style.zIndex = '9999';
    });

    // Smooth scroll to top
    scrollToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ✅ Fade out welcome text after 3 seconds
    setTimeout(() => {
        if (welcome) {
            welcome.classList.add("fade-out");
            setTimeout(() => {
                welcome.style.display = "none";
            }, 1000); // after fade
        }
    }, 3000);

    // Scroll to #Analysis section and then open modal
const analysisLink = document.querySelector('a[href="#Analysis"]');
if (analysisLink) {
    analysisLink.addEventListener('click', function (e) {
        e.preventDefault();

        const targetSection = document.getElementById('Analysis');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Delay to allow scroll before showing modal
            setTimeout(() => {
                document.getElementById('analysisModal').style.display = 'flex';
            }, 1000); // Adjust timing if scroll is slower/faster
        }
    });
}


    // Close modal function
    function closeAnalysisModal() {
        document.getElementById('analysisModal').style.display = 'none';
    }

    // Optional: close when clicking outside the form
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('analysisModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });











 // Get the select elements
 const yearSelect = document.getElementById('yearSelect');
 const makeSelect = document.getElementById('makeSelect');
 const modelSelect = document.getElementById('modelSelect');

 const typeSelect = document.querySelector('select[name="type"]');



 // Populate Year Dropdown (1980-current year)
 const currentYear = new Date().getFullYear();
 yearSelect.innerHTML = '<option value="">Select Year</option>';
 for (let year = currentYear; year >= 1900; year--) {
     const option = document.createElement("option");
     option.value = year;
     option.textContent = year;
     yearSelect.appendChild(option);
 }




// Function to load makes
async function loadMakesForYear(year) {
    try {
        const selectedType = typeSelect.value || "car"; // default to car
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${selectedType}?format=json`);
                const data = await res.json();
        // ✅ Sort the make names alphabetically here
            data.Results.sort((a, b) => a.MakeName.localeCompare(b.MakeName));

        makeSelect.innerHTML = '<option value="">Select Make</option>';
        data.Results.forEach(make => {
            const option = document.createElement("option");
            option.value = make.MakeName;
            option.textContent = make.MakeName;
            makeSelect.appendChild(option);
        });
        makeSelect.disabled = false;
    } catch (err) {
        makeSelect.innerHTML = '<option>Error loading makes</option>';
        console.error(err);
    }
}

// Bind to year selection
yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;
    if (selectedYear) {
        makeSelect.innerHTML = '<option value="">Loading...</option>';
        makeSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        modelSelect.disabled = true;
        loadMakesForYear(selectedYear);
    }
});

typeSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;
    if (selectedYear) {
        loadMakesForYear(selectedYear);
    }
});







 // Fetch models when make is selected
 makeSelect.addEventListener("change", async function() {
     const make = this.value;
     const year = yearSelect.value;

     if (!make || !year) return;

     modelSelect.innerHTML = '<option value="">Loading...</option>';
     modelSelect.disabled = true;

     try {
         const response = await fetch(
             `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
         );
         const data = await response.json();
         
         // ✅ Sort the model names alphabetically here
            data.Results.sort((a, b) => a.Model_Name.localeCompare(b.Model_Name));

         modelSelect.innerHTML = '<option value="">Select Model</option>';
         if (data.Results && data.Results.length > 0) {
             data.Results.forEach(model => {
                 const option = document.createElement("option");
                 option.value = model.Model_Name;
                 option.textContent = model.Model_Name;
                 modelSelect.appendChild(option);
             });
         } else {
             modelSelect.innerHTML = '<option value="">No models found</option>';
         }
         modelSelect.disabled = false;
     } catch (error) {
         console.error('Error fetching models:', error);
         modelSelect.innerHTML = '<option value="">Error loading models</option>';
     }
 });



 document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        document.getElementById('analysisModal').style.display = 'none';
    }
});




});