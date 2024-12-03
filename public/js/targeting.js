// targeting.js - Handles photo tagging and mode toggling
document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('sunny_1');
    const container = document.getElementById('photo-container');
    const photoId = image.dataset.photoId;
    const adminButton = document.getElementById('admin-button');
    const userButton = document.getElementById('user-button');
    const optionButtons = document.querySelectorAll('.option-btn');

    let mode = 'admin'; // Default to admin mode
    let selectedOption = null; // No option selected initially

    // Toggle between admin and user modes
    function toggleMode(newMode) {
        if (mode === newMode) return;

        mode = newMode;
        if (mode === 'admin') {
            adminButton.style.backgroundColor = 'green';
            userButton.style.backgroundColor = 'white';
        } else {
            userButton.style.backgroundColor = 'green';
            adminButton.style.backgroundColor = 'white';
            removeTargetingBox(); // Remove targeting box when switching out of admin
        }
    }

    // Set up toggle button listeners
    adminButton.addEventListener('click', () => toggleMode('admin'));
    userButton.addEventListener('click', () => toggleMode('user'));

    // Handle option button selection
    optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Highlight the selected option
            optionButtons.forEach((b) => (b.style.backgroundColor = 'white'));
            btn.style.backgroundColor = 'yellow';
            selectedOption = btn.dataset.character;
        });
    });

    // Handle photo click events
    image.addEventListener('click', (event) => {
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        if (mode === 'admin') {
            showTargetingBox(xPercent, yPercent);
        } else if (mode === 'user') {
            if (!selectedOption) {
                alert('Please select an option first.');
                return;
            }
            validateMarker(photoId, selectedOption, xPercent, yPercent);
        }
    });

    // Remove targeting box when clicking outside the container
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && mode === 'admin') {
            removeTargetingBox();
        }
    });

    // Display targeting box for admin
    function showTargetingBox(xPercent, yPercent) {
        removeTargetingBox(); // Remove existing targeting box

        // Create the targeting box
        const box = document.createElement('div');
        box.className = 'targeting-box';
        box.style.position = 'absolute';
        box.style.left = `${xPercent}%`;
        box.style.top = `${yPercent}%`;
        box.style.transform = 'translate(-50%, -50%)'; // Center the box
        box.style.width = '150px';
        box.style.height = '150px';
        box.style.border = '2px solid red';
        box.style.background = 'rgba(255, 0, 0, 0.2)';
        box.style.zIndex = '10';

        // Create the dropdown for selecting a character
        const dropdown = document.createElement('select');
        dropdown.className = 'character-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = 'calc(100% + 10px)'; // Position below the box
        dropdown.style.left = '50%';
        dropdown.style.transform = 'translateX(-50%)'; // Center dropdown horizontally
        dropdown.style.zIndex = '20';
        dropdown.innerHTML = `
            <option value="" disabled selected>Select Character</option>
            <option value="Frank">Frank</option>
            <option value="Charlie">Charlie</option>
            <option value="Dee">Dee</option>
        `;

        dropdown.addEventListener('change', (event) => {
            const selectedCharacter = event.target.value;
            if (selectedCharacter) {
                saveTag(photoId, selectedCharacter, xPercent, yPercent);
                console.log(`Tag saved: ${selectedCharacter}`);
            }
        });

        box.appendChild(dropdown);
        container.appendChild(box);
    }

    // Remove existing targeting box
    function removeTargetingBox() {
        const existingBox = document.querySelector('.targeting-box');
        if (existingBox) existingBox.remove();
    }

    // Save tag to database for admin
    async function saveTag(photoId, name, xPercent, yPercent) {
        console.log('Saving tag:', { photoId, name, xPercent, yPercent });
        try {
            const response = await fetch('/tags/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photoId, name, xPercent, yPercent }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Tag saved successfully.');
            } else {
                alert('Failed to save tag.');
            }
        } catch (error) {
            console.error('Error saving tag:', error);
        }
    }

    // Validate marker placement for user
    async function validateMarker(photoId, name, xPercent, yPercent) {
        console.log('Validating marker:', { photoId, name, xPercent, yPercent });
        try {
            const response = await fetch('/tags/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photoId, name, xPercent, yPercent }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Correct marker placed!');
                placeMarker(xPercent, yPercent, name);
            } else {
                alert('Incorrect marker. Try again!');
            }
        } catch (error) {
            console.error('Error validating marker:', error);
        }
    }

    // Place marker for user
    function placeMarker(xPercent, yPercent, character) {
        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.position = 'absolute';
        marker.style.left = `calc(${xPercent}% - 10px)`;
        marker.style.top = `calc(${yPercent}% - 10px)`;
        marker.style.width = '20px';
        marker.style.height = '20px';
        marker.style.background = 'green';
        marker.style.borderRadius = '50%';

        container.appendChild(marker);
        alert(`Marker placed for ${character}!`);
    }
});
