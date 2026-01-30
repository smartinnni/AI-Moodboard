const formElement = document.querySelector("#moodboard-generator");
const inputElement = document.querySelector("#user-instructions");
const resultsElement = document.querySelector("#moodboard-results");


//Add AI API
function buildApiUrl (vibe) {
    const apiKey = 
        "00t0518374baoeb3faaa6c86b66cc02f";
    const prompt = 
        `Create a mini brand kit moodboard for this ${vibe}`;
    const context = `
        Return ONLY minified JSON. No markdown. No backticks.
        Keys:
        title (string)
        concept (string)
        palette (array of 5-6 objects with name, hex, role)
        headingFont (string)
        bodyFont (string)
        pairingNote (string)
        motion (array of 3 strings)
        tempo (calm|balanced|energetic)
        imageryPrompts (array of exactly 6 strings)
        accessibility (array of 2-4 strings)
    `.trim();
    return  `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;
        
}

function handleSubmit(event) {
    event.preventDefault();

    const vibe = inputElement.value.trim();
    if (!vibe) return;

    resultsElement.classList.remove("hidden");
    resultsElement.innerHTML = `Generating a moodboard for ${vibe}...`;

    const apiURL = buildApiUrl(vibe);

    axios
    .get(apiURL)
    .then((response) => {
        let data;

    // Try to parse the AI response as JSON
    try {
      data = JSON.parse(response.data.answer);
    } catch (error) {
      console.error("JSON parse error:", error);
      console.log("Raw AI output:", response.data.answer);

      resultsElement.innerHTML = `
        <div>
          <strong>Output error.</strong>
          <div style="opacity:0.8; margin-top:6px;">
            The AI returned an unexpected format. Try again.
          </div>
        </div>
      `;
      return;
    }

    // Build the HTML manually (safe + controlled)
    resultsElement.innerHTML = `
      <div class="kit">
        <div class="kit-header">
          <h2>${data.title}</h2>
          <p>${data.concept}</p>
        </div>

        <div class="section">
          <h3>Palette</h3>
          <div class="palette">
            ${data.palette
              .map(
                (color) => `
                  <div class="swatch">
                    <div class="swatch-color" data-hex="${color.hex}"></div>
                    <div class="swatch-meta">
                      <div><strong>${color.name}</strong> — ${color.hex}</div>
                      <div class="small">Role: ${color.role}</div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="section two-col">
          <div class="card">
            <h3>Typography</h3>
            <p class="small"><strong>Heading:</strong> ${data.headingFont}</p>
            <p class="small"><strong>Body:</strong> ${data.bodyFont}</p>
            <p class="small">Pairing note: ${data.pairingNote}</p>
          </div>

          <div class="card">
            <h3>Motion direction</h3>
            <ul>
              ${data.motion.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <div class="tag">Tempo: ${data.tempo}</div>
          </div>
        </div>

        <div class="section">
          <h3>Imagery prompts</h3>
          <ol>
            ${data.imageryPrompts.map((prompt) => `<li>${prompt}</li>`).join("")}
          </ol>
        </div>

        <div class="section">
          <h3>Accessibility notes</h3>
          <ul>
            ${data.accessibility.map((note) => `<li>${note}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;

    // Apply palette colors safely
    const swatches = resultsElement.querySelectorAll(".swatch-color");
    swatches.forEach((el) => {
      const hex = el.getAttribute("data-hex");
      if (hex && /^#([0-9A-Fa-f]{6})$/.test(hex)) {
        el.style.backgroundColor = hex;
      }
    });
  })
  .catch((error) => {
    console.error(error);
    resultsElement.innerHTML = `
      <div>
        <strong>Oops.</strong> Something went wrong.
        <div style="opacity:0.8; margin-top:6px;">
          Try again or simplify your vibe.
        </div>
      </div>
    `;
  });
}

formElement.addEventListener("submit", handleSubmit);

