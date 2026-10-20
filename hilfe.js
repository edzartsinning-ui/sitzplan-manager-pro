"use strict";
(() => {
  const input = document.getElementById("suche");
  const result = document.getElementById("result");
  const chapters = Array.from(document.querySelectorAll(".page > details"));
  if (!input || !result) return;
  const initial = chapters.map(chapter => chapter.open);
  const normalize = value => value.toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
  input.addEventListener("input", () => {
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    chapters.forEach((chapter, index) => {
      const match = terms.every(term => normalize(chapter.textContent).includes(term));
      chapter.hidden = !match;
      chapter.open = terms.length ? match : initial[index];
      if (match) count++;
    });
    result.textContent = terms.length ? `${count} von ${chapters.length} Kapiteln gefunden.` : "";
  });
  function revealHash() {
    const chapter = document.getElementById(location.hash.slice(1));
    if (chapter && chapter.tagName === "DETAILS") {
      if (input.value) { input.value = ""; input.dispatchEvent(new Event("input")); }
      chapter.hidden = false; chapter.open = true;
    }
  }
  addEventListener("hashchange", revealHash);
  revealHash();
})();
