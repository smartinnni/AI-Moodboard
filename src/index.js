const formElement = document.querySelector("#moodboard-generator");
const inputElement = document.querySelector("#user-instructions");
const resultsElement = document.querySelector("#moodboard-results");


//Add AI API
function buildApiUrl (vibe) {
    const apiKey = 
        "00t0518374baoeb3faaa6c86b66cc02f";
    const prompt = 
        `Create a mini brand kit moodboard for this ${vibe}`;
    const context = 
        `You are a senior brand designer and UX designer.
        Return only valid HTML (no backticks, no markdown, no extra commentary). You MUST include all of the information. Please behave.
        Use sections for: title+concept (keep the title the name of what is inputted + brand kit (ie. Professional Brand Kit)), palette (exactly 5 hex colors), typography (heading/body),
        motion direction (3 bullets), imagery prompts (exactly 4 items), accessibility notes (exactly 3 bullets).
        
        Output must follow this exact structure and class names - You MUST include all the information (inludint the whole typography, motion direction, imagery, and accessibility sections) and its format:
        
        <div class="kit">
    <div class="kit-header">
        <h2>...</h2>
        <p>...</p>
    </div>

    <div class="section">
        <h3>Palette</h3>
        <div class="palette">
            <!-- 5 swatches -->
             <div class="swatch">
                <div class="swatch-color" style="background:#123456"></div>
                <div class="swatch-meta">
                    <div><strong>Name</strong> - #123456 </div>
                    <div class="small">Role: primary/secondary/accent/background/text/support</div>
                </div>
             </div>
        </div>
    </div>

    <div class="section two col">
        <div class="card">
            <h3>Typography</h3>
            <p class="small"><strong>Heading:</strong>...</p>
            <p class="small"><strong>Body:</strong>...</p>
            <p class="small"><strong>Paring Note:</strong>...</p>
        </div>
        <div class="card">
            <h3>Motion Direction</h3>
            <ul>
                <li>...</li>
                <li>...</li>
                <li>...</li>
            </ul>
            <div class="tag">Tempo: calm/balanced/energetic</div>
        </div>
    </div>

    <div class="section">
        <h3>Imagery Prompts</h3>
        <ol>
            <!-- exactly 4 prompts -->
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
        </ol>
    </div>

    <div class="section">
        <h3>Accessibility</h3>
        <ul>
            <li>3 short, practical notes</li>
        </ul>
    </div>

    <p class="small"><strong>SheCodes AI</strong></p>
</div>

Constraints:
- Palette MUST include 5 hex colors.
- Keep typography realistic (common fonts, Google fonts ok).
- Prompts should be specific and cohesive (same visual style).
- Keep it modern and not generic.
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
        resultsElement.innerHTML = response.data.answer;
    })
    .catch((error) => {
        console.error(error);
        resultsElement.innerHTML = `
        <div> 
            <strong> Oops.</strong> Something went wrong.
            <div style="opacity:0.8; margin-top:6px;"> Try again or simplify your vibe.</div>
        </div>`;
    });
}

formElement.addEventListener("submit", handleSubmit);

