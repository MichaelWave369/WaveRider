const modules = {
  WavePeak: "Audio waveforms locked. Feature vectors streaming for classification.",
  WaveVis: "Rendering latent spaces and training curves in cinematic detail.",
  WaveTrainer: "Preparing Raspberry Pi edge runtime for compact model training.",
  WavePCB: "Synchronizing traces, layers, and component routing for ML hardware.",
  WaveTorch: "Visualizing tensor metrics and experiment timelines in real-time.",
  WaveChat: "Compiling datasets for chatbot finetuning and dialogue alignment.",
  WaveBoost: "Optimizing inference pipelines with lightweight acceleration passes.",
  WaveGen: "Spinning up prototype architectures for rapid experimentation.",
};

const cards = document.querySelectorAll(".module-card");
const output = document.querySelector("#console-output");

cards.forEach((card) => {
  const button = card.querySelector("button");
  const moduleName = card.dataset.module;

  button.addEventListener("click", () => {
    cards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    output.textContent = `${moduleName}: ${modules[moduleName]}`;
  });
});
