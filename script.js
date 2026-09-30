// ===== EDIT HERE: your 5 photos =====
const photoData = {
    amp: [
        { src: "Photos/Amp_Front.jpeg",   desc: "Front view of the finished 50W tube amplifier." },
        { src: "Photos/Amp_Top.jpeg",  desc: "Hand-drafted turret board layout and wiring." },
        { src: "Photos/Amp_Schematic.png", desc: "Handwriten schematic of the entire circuit." },
        { src: "Photos/Amp_Layout2-2.jpeg",  desc: "turret board layout and wiring Diagram for the amplifier." },
        { src: "Photos/Amp_Layout2-3.jpeg", desc: "turret board layout and wiring Diagram for the linear power supply." },
        
    ],
    counter: [
        { src: "Photos/Counter_Front.jpg", desc: "Assembled 2-digit RGB 7-segment display." },
        { src: "Photos/Counter_CAD.png",   desc: "CAD render of the 3D printed enclosure." }
    ]
};
// ====================================

// Builds the photo + description blocks inside each popup
document.querySelectorAll('.gallery').forEach(gallery => {
    const photos = photoData[gallery.dataset.gallery] || [];
    photos.forEach(p => {
        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = p.src;
        img.alt = p.desc;
        img.loading = 'lazy';
        img.addEventListener('click', () => window.open(p.src, '_blank'));

        const caption = document.createElement('figcaption');
        caption.textContent = p.desc;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Open Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-target');
            document.getElementById(modalId).style.display = 'block';
        });
    });

    // Close Modal via 'X'
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Close Modal via clicking background
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});


// --- OSCILLOSCOPE ANIMATION ENGINE ---
const canvas = document.getElementById('scopeCanvas');
const ctx = canvas.getContext('2d');

// Automatically resize canvas to always match window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let phase = 0;

function drawScope() {
    // Clear out previous frame cleanly
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff7700'; // Matches your copper orange accent color

    // Draw the continuous signal across horizontal pixel steps
    for (let x = 0; x < canvas.width; x++) {
        // Core wave formulas
        const baseSine = Math.sin(x * 0.005 + phase);
        const harmonic = Math.sin(x * 0.012 + phase * 1.5) * 0.3; // Adds hardware harmonic ripple
        
        // Pin the vertical position centered exactly mid-screen
        const midY = canvas.height / 2;
        // Total height amplitude scale of the oscilloscope line
        const amplitude = canvas.height * 0.15; 

        const y = midY + (baseSine + harmonic) * amplitude;

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
    
    // Control wave frequency sweep speed over time
    phase += 0.02; 
    
    // Fire the next frame smoothly linked to monitor refresh cycles
    requestAnimationFrame(drawScope);
}

// Start tracking the waveform sweep loop
drawScope();
