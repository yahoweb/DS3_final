// === Global Keyboard Navigation (arrows / Enter / Space) ===
// - Prev:  ArrowLeft
// - Next:  ArrowRight, Enter, Space
// - ESC:   (여기서는 다루지 않음; 팀 패널에서만 닫기 용도로 사용)
// - 입력 중이거나 버튼/링크 포커스 시 무시
// - bottom-nav 우선, 없으면 steps 기준
// - fade-in / fade-out 전환 지원

(function () {
  function go(url) {
    if (!url) return;
    const body = document.body;
    if (body.classList.contains("fade-in")) {
      body.classList.remove("fade-in");
      body.classList.add("fade-out");
      setTimeout(() => (window.location.href = url), 500);
    } else {
      window.location.href = url;
    }
  }

  function isTypingOrEditing() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    if (el.isContentEditable) return true;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      tag === "BUTTON" ||
      tag === "A"
    );
  }

  function getPrevNext() {
    let prev = null;
    let next = null;
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) {
      const prevA = bottomNav.querySelector(".arrow.prev[href]");
      const nextA = bottomNav.querySelector(".arrow.next[href]");
      if (prevA) prev = prevA.getAttribute("href");
      if (nextA) next = nextA.getAttribute("href");
    }
    if (!prev || !next) {
      const steps = Array.from(
        document.querySelectorAll(".appbar .steps .step-dot[href]")
      );
      const activeIdx = steps.findIndex((a) => a.classList.contains("active"));
      if (activeIdx !== -1) {
        if (!prev && steps[activeIdx - 1])
          prev = steps[activeIdx - 1].getAttribute("href");
        if (!next && steps[activeIdx + 1])
          next = steps[activeIdx + 1].getAttribute("href");
      }
    }
    return { prev, next };
  }

  function onKey(e) {
    if (document.body.hasAttribute("data-disable-keynav")) return;
    if (isTypingOrEditing()) return;

    // 🔒 팀 사이드패널이 열려 있으면 페이지 네비 키는 막고, ESC만 다른 핸들러에 맡김
    const panelOpen = !!document.querySelector(".team-panel.open");
    if (panelOpen) {
      if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
      }
      return; // ESC는 아래 로직에 걸리지 않게 그대로 빠져나가 다른 리스너가 처리
    }

    const { prev, next } = getPrevNext();
    if (!prev && !next) return;

    const key = e.key;

    // Next
    if (key === "ArrowRight" || key === "Enter" || key === " ") {
      if (next) {
        if (key === " ") e.preventDefault(); // 스페이스 스크롤 방지
        go(next);
      }
      return;
    }

    // Prev
    if (key === "ArrowLeft") {
      if (prev) go(prev);
      return;
    }

    // ⛔️ ESC는 여기서 아무 것도 하지 않음 (팀 패널 전용 핸들러가 처리)
  }

  window.addEventListener("keydown", onKey, { passive: false });
})();

// === ESC closes Team Page Side Panel ===
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const panel = document.querySelector(".team-panel.open");
    const scrim = document.querySelector(".panel-scrim.show");
    if (panel && scrim) {
      panel.classList.remove("open");
      scrim.classList.remove("show");
      setTimeout(() => {
        scrim.hidden = true;
      }, 200);
    }
  }
});