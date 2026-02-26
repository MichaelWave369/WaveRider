const cards = document.querySelectorAll('.module-card');
const workspaceTitle = document.querySelector('#workspace-title');
const workspaceSubtitle = document.querySelector('#workspace-subtitle');
const workspaceContent = document.querySelector('#workspace-content');

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
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wp-input">Sample Label</label><input id="wp-input" value="urban-traffic.wav" /></div>
      <div class="tool-actions"><button id="wp-run">Run Feature Extraction</button></div>
    </section>
  `,
  WaveVis: () => `
    <div class="workspace-grid">
      <article class="metric"><small>2D Clusters</small><span class="metric-value" id="wv-clusters">0</span></article>
      <article class="metric"><small>Outlier Ratio</small><span class="metric-value" id="wv-outlier">0%</span></article>
      <article class="metric"><small>Projection</small><span class="metric-value" id="wv-projection">t-SNE</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wv-mode">View Mode</label><select id="wv-mode"><option>t-SNE</option><option>UMAP</option><option>PCA</option></select></div>
      <div class="tool-actions"><button id="wv-refresh">Refresh Visualization</button></div>
    </section>
  `,
  WaveTrainer: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Estimated Train Time</small><span class="metric-value" id="wt-time">-- min</span></article>
      <article class="metric"><small>Memory Footprint</small><span class="metric-value" id="wt-memory">-- MB</span></article>
      <article class="metric"><small>Thermal Risk</small><span class="metric-value" id="wt-risk">Unknown</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wt-model">Model Size (MB)</label><input id="wt-model" type="number" min="5" value="36" /></div>
      <div class="tool-row"><label for="wt-epochs">Epochs</label><input id="wt-epochs" type="number" min="1" value="20" /></div>
      <div class="tool-actions"><button id="wt-plan">Build Pi Training Plan</button></div>
    </section>
  `,
  WavePCB: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Layer Count</small><span class="metric-value" id="wpcb-layers">4</span></article>
      <article class="metric"><small>Power Rails</small><span class="metric-value" id="wpcb-rails">2</span></article>
      <article class="metric"><small>Route Congestion</small><span class="metric-value" id="wpcb-congestion">Moderate</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wpcb-target">Target Board</label><input id="wpcb-target" value="Edge-Audio Hat" /></div>
      <div class="tool-actions"><button id="wpcb-suggest">Generate Routing Suggestion</button></div>
    </section>
  `,
  WaveTorch: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Latest Loss</small><span class="metric-value" id="wtor-loss">--</span></article>
      <article class="metric"><small>Validation Accuracy</small><span class="metric-value" id="wtor-acc">--%</span></article>
      <article class="metric"><small>Step Throughput</small><span class="metric-value" id="wtor-speed">--/s</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wtor-run">Run Name</label><input id="wtor-run" value="noir-audio-v2" /></div>
      <div class="tool-actions"><button id="wtor-load">Load Tensorboard Snapshot</button></div>
    </section>
  `,
  WaveChat: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Prompt Templates</small><span class="metric-value" id="wch-prompts">3</span></article>
      <article class="metric"><small>Safety Score</small><span class="metric-value" id="wch-safety">Pending</span></article>
      <article class="metric"><small>Training Readiness</small><span class="metric-value" id="wch-ready">Draft</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wch-domain">Bot Domain</label><input id="wch-domain" value="Audio support assistant" /></div>
      <div class="tool-actions"><button id="wch-build">Build Finetune Recipe</button></div>
    </section>
  `,
  WaveBoost: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Latency Gain</small><span class="metric-value" id="wbo-latency">0%</span></article>
      <article class="metric"><small>Memory Gain</small><span class="metric-value" id="wbo-memory">0%</span></article>
      <article class="metric"><small>Recommended Pass</small><span class="metric-value" id="wbo-pass">None</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wbo-target">Target Runtime</label><select id="wbo-target"><option>CPU</option><option>CUDA</option><option>ARM</option></select></div>
      <div class="tool-actions"><button id="wbo-optimize">Run Optimization Plan</button></div>
    </section>
  `,
  WaveGen: () => `
    <div class="workspace-grid">
      <article class="metric"><small>Prototype Family</small><span class="metric-value" id="wgen-family">Hybrid-CNN</span></article>
      <article class="metric"><small>Layer Count</small><span class="metric-value" id="wgen-layers">8</span></article>
      <article class="metric"><small>Estimated Params</small><span class="metric-value" id="wgen-params">1.4M</span></article>
    </div>
    <section class="tool-block">
      <div class="tool-row"><label for="wgen-goal">Design Goal</label><textarea id="wgen-goal" rows="2">Low-latency edge audio classification</textarea></div>
      <div class="tool-actions"><button id="wgen-create">Generate Prototype Spec</button></div>
    </section>
  `,
};

function updateOutput(title, message) {
  const existing = workspaceContent.querySelector('.output');
  if (existing) {
    existing.remove();
  }
  const output = document.createElement('article');
  output.className = 'output';
  output.innerHTML = `<h4>${title}</h4><p>${message}</p>`;
  workspaceContent.appendChild(output);
}

function bindModuleEvents(moduleName) {
  if (moduleName === 'WavePeak') {
    document.querySelector('#wp-run').addEventListener('click', () => {
      const label = document.querySelector('#wp-input').value;
      const frequency = (200 + Math.floor(Math.random() * 3400));
      const energy = (35 + Math.random() * 45).toFixed(1);
      const classes = ['Speech', 'Machinery', 'Birdsong', 'Traffic', 'Rain'];
      const predicted = classes[Math.floor(Math.random() * classes.length)];
      document.querySelector('#wp-frequency').textContent = `${frequency} Hz`;
      document.querySelector('#wp-energy').textContent = `${energy} dB`;
      document.querySelector('#wp-class').textContent = predicted;
      updateOutput('WavePeak Upgrade', `Processed ${label} with adaptive FFT windows and predicted ${predicted}.`);
    });
  }

  if (moduleName === 'WaveVis') {
    document.querySelector('#wv-refresh').addEventListener('click', () => {
      const mode = document.querySelector('#wv-mode').value;
      document.querySelector('#wv-projection').textContent = mode;
      document.querySelector('#wv-clusters').textContent = String(2 + Math.floor(Math.random() * 7));
      document.querySelector('#wv-outlier').textContent = `${(Math.random() * 8).toFixed(1)}%`;
      updateOutput('WaveVis Upgrade', `${mode} map regenerated with dynamic class overlays and anomaly highlighting.`);
    });
  }

  if (moduleName === 'WaveTrainer') {
    document.querySelector('#wt-plan').addEventListener('click', () => {
      const model = Number(document.querySelector('#wt-model').value);
      const epochs = Number(document.querySelector('#wt-epochs').value);
      const mins = Math.round((model * epochs) / 8.5);
      const mem = Math.round(model * 1.9);
      const risk = mem > 120 ? 'High' : mem > 75 ? 'Moderate' : 'Low';
      document.querySelector('#wt-time').textContent = `${mins} min`;
      document.querySelector('#wt-memory').textContent = `${mem} MB`;
      document.querySelector('#wt-risk').textContent = risk;
      updateOutput('WaveTrainer Upgrade', `Generated thermal-aware Pi schedule (${mins} min est.) with checkpoint cadence every ${Math.max(1, Math.round(epochs / 5))} epochs.`);
    });
  }

  if (moduleName === 'WavePCB') {
    document.querySelector('#wpcb-suggest').addEventListener('click', () => {
      const board = document.querySelector('#wpcb-target').value;
      const congestion = ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)];
      document.querySelector('#wpcb-congestion').textContent = congestion;
      updateOutput('WavePCB Upgrade', `${board}: recommended differential pair routing for microphone bus and ground guard ring near ADC section.`);
    });
  }

  if (moduleName === 'WaveTorch') {
    document.querySelector('#wtor-load').addEventListener('click', () => {
      const run = document.querySelector('#wtor-run').value;
      document.querySelector('#wtor-loss').textContent = (0.03 + Math.random() * 0.2).toFixed(3);
      document.querySelector('#wtor-acc').textContent = `${(82 + Math.random() * 16).toFixed(2)}%`;
      document.querySelector('#wtor-speed').textContent = `${(45 + Math.random() * 85).toFixed(1)} it`;
      updateOutput('WaveTorch Upgrade', `Loaded ${run} with gradient trend summary and overfit-risk indicator.`);
    });
  }

  if (moduleName === 'WaveChat') {
    document.querySelector('#wch-build').addEventListener('click', () => {
      const domain = document.querySelector('#wch-domain').value;
      document.querySelector('#wch-safety').textContent = `${(88 + Math.random() * 10).toFixed(1)}%`;
      document.querySelector('#wch-ready').textContent = 'Ready';
      updateOutput('WaveChat Upgrade', `Generated finetune recipe for "${domain}" with system prompt, eval rubric, and safety checkpoints.`);
    });
  }

  if (moduleName === 'WaveBoost') {
    document.querySelector('#wbo-optimize').addEventListener('click', () => {
      const runtime = document.querySelector('#wbo-target').value;
      const pass = runtime === 'CUDA' ? 'Kernel Fusion' : runtime === 'ARM' ? 'INT8 Quantization' : 'Operator Folding';
      document.querySelector('#wbo-pass').textContent = pass;
      document.querySelector('#wbo-latency').textContent = `${(18 + Math.random() * 34).toFixed(1)}%`;
      document.querySelector('#wbo-memory').textContent = `${(12 + Math.random() * 28).toFixed(1)}%`;
      updateOutput('WaveBoost Upgrade', `Optimization plan generated for ${runtime} using ${pass} and graph-level simplification.`);
    });
  }

  if (moduleName === 'WaveGen') {
    document.querySelector('#wgen-create').addEventListener('click', () => {
      const goal = document.querySelector('#wgen-goal').value;
      const families = ['Hybrid-CNN', 'Conv-Transformer', 'DepthwiseNet', 'TinyResNet'];
      const family = families[Math.floor(Math.random() * families.length)];
      const layers = 6 + Math.floor(Math.random() * 8);
      const params = (0.6 + Math.random() * 3.2).toFixed(1);
      document.querySelector('#wgen-family').textContent = family;
      document.querySelector('#wgen-layers').textContent = String(layers);
      document.querySelector('#wgen-params').textContent = `${params}M`;
      updateOutput('WaveGen Upgrade', `Generated ${family} prototype for goal: ${goal}. Includes deployment profile and starter hyperparameters.`);
    });
  }
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
