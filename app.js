const cards = document.querySelectorAll('.module-card');
const workspaceTitle = document.querySelector('#workspace-title');
const workspaceSubtitle = document.querySelector('#workspace-subtitle');
const workspaceContent = document.querySelector('#workspace-content');

const ACTIVITY_KEY = 'waverider-activity-log';
const moduleRunCount = {};
let activityLog = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');

const moduleDescriptions = {
  WavePeak: 'Feature extraction and audio event classification bench.',
  WaveVis: 'Visual diagnostics for model behavior and data shape.',
  WaveTrainer: 'Edge model planning tuned for Raspberry Pi constraints.',
  WavePCB: 'Smart PCB blueprint helper for ML hardware builds.',
  WaveTorch: 'Torch run visual summaries and training telemetry snapshot.',
  WaveChat: 'Dataset shaping and chatbot training recipe generator.',
  WaveBoost: 'Inference optimization advisor for speed + memory.',
  WaveGen: 'Rapid architecture ideation and prototype emitter.',
};

const renderers = {
  WavePeak: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Detected Peak Frequency</small><span class="metric-value" id="wp-frequency">-- Hz</span></article>
      <article class="metric"><small>Signal Energy</small><span class="metric-value" id="wp-energy">-- dB</span></article>
      <article class="metric"><small>Predicted Class</small><span class="metric-value" id="wp-class">Awaiting scan</span></article>
      <article class="metric"><small>Runs</small><span class="metric-value" id="wp-runs">0</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wp-input">Sample Label</label><input id="wp-input" value="urban-traffic.wav" /></div>
      <div class="tool-actions"><button id="wp-run">Run Feature Extraction</button><button id="wp-preset">Apply Night Preset</button></div>
    </section>
  `,
  WaveVis: () => `
    <div class="workspace-grid">
      <article class="metric"><small>2D Clusters</small><span class="metric-value" id="wv-clusters">0</span></article>
      <article class="metric"><small>Outlier Ratio</small><span class="metric-value" id="wv-outlier">0%</span></article>
      <article class="metric"><small>Projection</small><span class="metric-value" id="wv-projection">t-SNE</span></article>
      <article class="metric"><small>Drift Alert</small><span class="metric-value" id="wv-drift">Stable</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wv-mode">View Mode</label><select id="wv-mode"><option>t-SNE</option><option>UMAP</option><option>PCA</option></select></div>
      <div class="tool-actions"><button id="wv-refresh">Refresh Visualization</button><button id="wv-baseline">Lock Baseline</button></div>
    </section>
  `,
  WaveTrainer: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Estimated Train Time</small><span class="metric-value" id="wt-time">-- min</span></article>
      <article class="metric"><small>Memory Footprint</small><span class="metric-value" id="wt-memory">-- MB</span></article>
      <article class="metric"><small>Thermal Risk</small><span class="metric-value" id="wt-risk">Unknown</span></article>
      <article class="metric"><small>Checkpoint Plan</small><span class="metric-value" id="wt-checkpoint">N/A</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wt-model">Model Size (MB)</label><input id="wt-model" type="number" min="5" value="36" /></div>
      <div class="tool-row"><label for="wt-epochs">Epochs</label><input id="wt-epochs" type="number" min="1" value="20" /></div>
      <div class="tool-actions"><button id="wt-plan">Build Pi Training Plan</button><button id="wt-safe">Enable Thermal Safe Mode</button></div>
    </section>
  `,
  WavePCB: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Layer Count</small><span class="metric-value" id="wpcb-layers">4</span></article>
      <article class="metric"><small>Power Rails</small><span class="metric-value" id="wpcb-rails">2</span></article>
      <article class="metric"><small>Route Congestion</small><span class="metric-value" id="wpcb-congestion">Moderate</span></article>
      <article class="metric"><small>EMI Risk</small><span class="metric-value" id="wpcb-emi">Medium</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wpcb-target">Target Board</label><input id="wpcb-target" value="Edge-Audio Hat" /></div>
      <div class="tool-actions"><button id="wpcb-suggest">Generate Routing Suggestion</button><button id="wpcb-shield">Apply Shielding Upgrade</button></div>
    </section>
  `,
  WaveTorch: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Latest Loss</small><span class="metric-value" id="wtor-loss">--</span></article>
      <article class="metric"><small>Validation Accuracy</small><span class="metric-value" id="wtor-acc">--%</span></article>
      <article class="metric"><small>Step Throughput</small><span class="metric-value" id="wtor-speed">--/s</span></article>
      <article class="metric"><small>Convergence</small><span class="metric-value" id="wtor-conv">Unknown</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wtor-run">Run Name</label><input id="wtor-run" value="noir-audio-v2" /></div>
      <div class="tool-actions"><button id="wtor-load">Load Tensorboard Snapshot</button><button id="wtor-compare">Compare Previous Run</button></div>
    </section>
  `,
  WaveChat: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Prompt Templates</small><span class="metric-value" id="wch-prompts">3</span></article>
      <article class="metric"><small>Safety Score</small><span class="metric-value" id="wch-safety">Pending</span></article>
      <article class="metric"><small>Training Readiness</small><span class="metric-value" id="wch-ready">Draft</span></article>
      <article class="metric"><small>Eval Coverage</small><span class="metric-value" id="wch-coverage">0%</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wch-domain">Bot Domain</label><input id="wch-domain" value="Audio support assistant" /></div>
      <div class="tool-actions"><button id="wch-build">Build Finetune Recipe</button><button id="wch-guard">Inject Guardrails</button></div>
    </section>
  `,
  WaveBoost: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Latency Gain</small><span class="metric-value" id="wbo-latency">0%</span></article>
      <article class="metric"><small>Memory Gain</small><span class="metric-value" id="wbo-memory">0%</span></article>
      <article class="metric"><small>Recommended Pass</small><span class="metric-value" id="wbo-pass">None</span></article>
      <article class="metric"><small>Power Gain</small><span class="metric-value" id="wbo-power">0%</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wbo-target">Target Runtime</label><select id="wbo-target"><option>CPU</option><option>CUDA</option><option>ARM</option></select></div>
      <div class="tool-actions"><button id="wbo-optimize">Run Optimization Plan</button><button id="wbo-export">Export Plan JSON</button></div>
    </section>
  `,
  WaveGen: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Prototype Family</small><span class="metric-value" id="wgen-family">Hybrid-CNN</span></article>
      <article class="metric"><small>Layer Count</small><span class="metric-value" id="wgen-layers">8</span></article>
      <article class="metric"><small>Estimated Params</small><span class="metric-value" id="wgen-params">1.4M</span></article>
      <article class="metric"><small>Deploy Target</small><span class="metric-value" id="wgen-target">Edge CPU</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wgen-goal">Design Goal</label><textarea id="wgen-goal" rows="2">Low-latency edge audio classification</textarea></div>
      <div class="tool-actions"><button id="wgen-create">Generate Prototype Spec</button><button id="wgen-stack">Auto-select Tech Stack</button></div>
    </section>
  `,
};

function persistActivity() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog.slice(0, 18)));
}

function logActivity(moduleName, message) {
  const stamp = new Date().toLocaleTimeString();
  activityLog.unshift(`[${stamp}] ${moduleName}: ${message}`);
  persistActivity();
  renderActivity();
}

function renderActivity() {
  const list = workspaceContent.querySelector('#activity-list');
  if (!list) {
    return;
  }
  list.innerHTML = activityLog.length
    ? activityLog.slice(0, 5).map((entry) => `<li>${entry}</li>`).join('')
    : '<li>No module activity yet.</li>';
}

function renderOutput(title, message) {
  const existing = workspaceContent.querySelector('.output');
  if (existing) {
    existing.remove();
  }
  const output = document.createElement('article');
  output.className = 'output';
  output.innerHTML = `<h4>${title}</h4><p>${message}</p>`;
  workspaceContent.appendChild(output);
}

function attachSharedFooter(moduleName) {
  const footer = document.createElement('section');
  footer.className = 'tool-block';
  footer.innerHTML = `
    <h4>Ops Activity Log</h4>
    <ul id="activity-list" class="activity-list"></ul>
    <div class="tool-actions">
      <button id="${moduleName}-clear">Clear Log</button>
    </div>
  `;
  workspaceContent.appendChild(footer);
  renderActivity();
  document.querySelector(`#${moduleName}-clear`).addEventListener('click', () => {
    activityLog = [];
    persistActivity();
    renderActivity();
  });
}

function bindModuleEvents(moduleName) {
  moduleRunCount[moduleName] = moduleRunCount[moduleName] || 0;

  if (moduleName === 'WavePeak') {
    document.querySelector('#wp-preset').addEventListener('click', () => {
      document.querySelector('#wp-input').value = 'night-port-ambience.wav';
      renderOutput('WavePeak Preset', 'Night preset loaded with denoise + high-sensitivity attack tracking.');
      logActivity(moduleName, 'Loaded Night Preset');
    });
    document.querySelector('#wp-run').addEventListener('click', () => {
      const label = document.querySelector('#wp-input').value;
      const frequency = (200 + Math.floor(Math.random() * 3400));
      const energy = (35 + Math.random() * 45).toFixed(1);
      const classes = ['Speech', 'Machinery', 'Birdsong', 'Traffic', 'Rain'];
      const predicted = classes[Math.floor(Math.random() * classes.length)];
      moduleRunCount[moduleName] += 1;
      document.querySelector('#wp-frequency').textContent = `${frequency} Hz`;
      document.querySelector('#wp-energy').textContent = `${energy} dB`;
      document.querySelector('#wp-class').textContent = predicted;
      document.querySelector('#wp-runs').textContent = String(moduleRunCount[moduleName]);
      renderOutput('WavePeak Upgrade+', `Processed ${label} with adaptive FFT windows and predicted ${predicted}.`);
      logActivity(moduleName, `Classified ${predicted} from ${label}`);
    });
  }

  if (moduleName === 'WaveVis') {
    document.querySelector('#wv-baseline').addEventListener('click', () => {
      document.querySelector('#wv-drift').textContent = 'Baseline Locked';
      renderOutput('WaveVis Baseline', 'Current embedding baseline locked for drift comparison.');
      logActivity(moduleName, 'Locked baseline projection');
    });
    document.querySelector('#wv-refresh').addEventListener('click', () => {
      const mode = document.querySelector('#wv-mode').value;
      const drift = Math.random() > 0.75 ? 'Watch' : 'Stable';
      document.querySelector('#wv-projection').textContent = mode;
      document.querySelector('#wv-clusters').textContent = String(2 + Math.floor(Math.random() * 7));
      document.querySelector('#wv-outlier').textContent = `${(Math.random() * 8).toFixed(1)}%`;
      document.querySelector('#wv-drift').textContent = drift;
      renderOutput('WaveVis Upgrade+', `${mode} map regenerated with anomaly highlighting. Drift status: ${drift}.`);
      logActivity(moduleName, `${mode} refresh completed`);
    });
  }

  if (moduleName === 'WaveTrainer') {
    document.querySelector('#wt-safe').addEventListener('click', () => {
      document.querySelector('#wt-risk').textContent = 'Low';
      renderOutput('WaveTrainer Safe Mode', 'Enabled thermal-safe mode with throttled batch sizing and cooling intervals.');
      logActivity(moduleName, 'Thermal safe mode enabled');
    });
    document.querySelector('#wt-plan').addEventListener('click', () => {
      const model = Number(document.querySelector('#wt-model').value);
      const epochs = Number(document.querySelector('#wt-epochs').value);
      const mins = Math.round((model * epochs) / 8.5);
      const mem = Math.round(model * 1.9);
      const checkpoint = `${Math.max(1, Math.round(epochs / 5))} epochs`;
      const risk = mem > 120 ? 'High' : mem > 75 ? 'Moderate' : 'Low';
      document.querySelector('#wt-time').textContent = `${mins} min`;
      document.querySelector('#wt-memory').textContent = `${mem} MB`;
      document.querySelector('#wt-risk').textContent = risk;
      document.querySelector('#wt-checkpoint').textContent = checkpoint;
      renderOutput('WaveTrainer Upgrade+', `Generated Pi schedule (${mins} min est.) with checkpoint cadence every ${checkpoint}.`);
      logActivity(moduleName, `Plan built (${mins} min, ${risk} thermal risk)`);
    });
  }

  if (moduleName === 'WavePCB') {
    document.querySelector('#wpcb-shield').addEventListener('click', () => {
      document.querySelector('#wpcb-emi').textContent = 'Low';
      renderOutput('WavePCB Shielding', 'Applied copper shielding strategy and split-ground isolation guidance.');
      logActivity(moduleName, 'Applied shielding upgrade');
    });
    document.querySelector('#wpcb-suggest').addEventListener('click', () => {
      const board = document.querySelector('#wpcb-target').value;
      const congestion = ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)];
      document.querySelector('#wpcb-congestion').textContent = congestion;
      renderOutput('WavePCB Upgrade+', `${board}: differential pair routing for mic bus + guarded analog zone near ADC.`);
      logActivity(moduleName, `Routing suggestion generated for ${board}`);
    });
  }

  if (moduleName === 'WaveTorch') {
    document.querySelector('#wtor-compare').addEventListener('click', () => {
      document.querySelector('#wtor-conv').textContent = 'Improving';
      renderOutput('WaveTorch Compare', 'Compared latest run to previous checkpoint: +1.8% validation gain.');
      logActivity(moduleName, 'Compared run to previous checkpoint');
    });
    document.querySelector('#wtor-load').addEventListener('click', () => {
      const run = document.querySelector('#wtor-run').value;
      document.querySelector('#wtor-loss').textContent = (0.03 + Math.random() * 0.2).toFixed(3);
      document.querySelector('#wtor-acc').textContent = `${(82 + Math.random() * 16).toFixed(2)}%`;
      document.querySelector('#wtor-speed').textContent = `${(45 + Math.random() * 85).toFixed(1)} it/s`;
      document.querySelector('#wtor-conv').textContent = Math.random() > 0.45 ? 'Converging' : 'Plateau';
      renderOutput('WaveTorch Upgrade+', `Loaded ${run} with gradient trend summary and overfit-risk indicator.`);
      logActivity(moduleName, `Loaded telemetry for ${run}`);
    });
  }

  if (moduleName === 'WaveChat') {
    document.querySelector('#wch-guard').addEventListener('click', () => {
      document.querySelector('#wch-coverage').textContent = '92%';
      renderOutput('WaveChat Guardrails', 'Guardrails injected: policy intents, refusal scaffolds, and red-team prompt pack.');
      logActivity(moduleName, 'Injected guardrails and red-team tests');
    });
    document.querySelector('#wch-build').addEventListener('click', () => {
      const domain = document.querySelector('#wch-domain').value;
      const safety = `${(88 + Math.random() * 10).toFixed(1)}%`;
      document.querySelector('#wch-safety').textContent = safety;
      document.querySelector('#wch-ready').textContent = 'Ready';
      document.querySelector('#wch-coverage').textContent = `${(72 + Math.random() * 25).toFixed(0)}%`;
      renderOutput('WaveChat Upgrade+', `Generated finetune recipe for "${domain}" with eval rubric and safety checkpoints.`);
      logActivity(moduleName, `Recipe generated for ${domain}`);
    });
  }

  if (moduleName === 'WaveBoost') {
    document.querySelector('#wbo-export').addEventListener('click', () => {
      const runtime = document.querySelector('#wbo-target').value;
      const stub = {
        runtime,
        pass: document.querySelector('#wbo-pass').textContent,
        latencyGain: document.querySelector('#wbo-latency').textContent,
        memoryGain: document.querySelector('#wbo-memory').textContent,
      };
      renderOutput('WaveBoost Export', `Plan JSON: ${JSON.stringify(stub)}`);
      logActivity(moduleName, `Exported optimization plan for ${runtime}`);
    });
    document.querySelector('#wbo-optimize').addEventListener('click', () => {
      const runtime = document.querySelector('#wbo-target').value;
      const pass = runtime === 'CUDA' ? 'Kernel Fusion' : runtime === 'ARM' ? 'INT8 Quantization' : 'Operator Folding';
      document.querySelector('#wbo-pass').textContent = pass;
      document.querySelector('#wbo-latency').textContent = `${(18 + Math.random() * 34).toFixed(1)}%`;
      document.querySelector('#wbo-memory').textContent = `${(12 + Math.random() * 28).toFixed(1)}%`;
      document.querySelector('#wbo-power').textContent = `${(8 + Math.random() * 20).toFixed(1)}%`;
      renderOutput('WaveBoost Upgrade+', `Optimization plan generated for ${runtime} using ${pass} and graph-level simplification.`);
      logActivity(moduleName, `Optimization plan created for ${runtime}`);
    });
  }

  if (moduleName === 'WaveGen') {
    document.querySelector('#wgen-stack').addEventListener('click', () => {
      document.querySelector('#wgen-target').textContent = 'Edge GPU';
      renderOutput('WaveGen Stack', 'Selected stack: PyTorch Lite + ONNX Runtime + quantization-aware recipe.');
      logActivity(moduleName, 'Auto-selected deployment stack');
    });
    document.querySelector('#wgen-create').addEventListener('click', () => {
      const goal = document.querySelector('#wgen-goal').value;
      const families = ['Hybrid-CNN', 'Conv-Transformer', 'DepthwiseNet', 'TinyResNet'];
      const targets = ['Edge CPU', 'Edge GPU', 'Raspberry Pi', 'Jetson Nano'];
      const family = families[Math.floor(Math.random() * families.length)];
      const layers = 6 + Math.floor(Math.random() * 8);
      const params = (0.6 + Math.random() * 3.2).toFixed(1);
      const target = targets[Math.floor(Math.random() * targets.length)];
      document.querySelector('#wgen-family').textContent = family;
      document.querySelector('#wgen-layers').textContent = String(layers);
      document.querySelector('#wgen-params').textContent = `${params}M`;
      document.querySelector('#wgen-target').textContent = target;
      renderOutput('WaveGen Upgrade+', `Generated ${family} prototype for goal: ${goal}. Includes deploy profile for ${target}.`);
      logActivity(moduleName, `Generated ${family} (${params}M params)`);
    });
  }

  attachSharedFooter(moduleName);
}

function activateModule(moduleName) {
  workspaceTitle.textContent = moduleName;
  workspaceSubtitle.textContent = moduleDescriptions[moduleName];
  workspaceContent.innerHTML = renderers[moduleName]();
  bindModuleEvents(moduleName);
}

cards.forEach((card) => {
  const button = card.querySelector('button');
  const moduleName = card.dataset.module;
  button.addEventListener('click', () => {
    cards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    activateModule(moduleName);
  });
});
