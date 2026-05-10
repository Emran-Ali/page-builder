<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";

const pageBuilderStore = usePageBuilderStore();

const props = defineProps({
  id: {type: String, default: ""},
  content: {
    type: String,
    default:
      '<p style="text-align: center; color: red;">Sample Rich Text Content</p>',
  },
  paddingHorizontal: {type: String, default: "0px"},
  paddingVertical: {type: String, default: "24px"},
  marginHorizontal: {type: String, default: "0px"},
  marginVertical: {type: String, default: "0px"},
  backgroundColor: {type: String, default: "transparent"},
  isEditing: {type: Boolean, default: false},
});

// Stable unique ID — never rely on the prop being set
const uid = computed(
  () => props.id || `rte-${Math.random().toString(36).slice(2)}`,
);

const containerStyles = computed(() => ({
  paddingLeft: props.paddingHorizontal,
  paddingRight: props.paddingHorizontal,
  paddingTop: props.paddingVertical,
  paddingBottom: props.paddingVertical,
  marginLeft: props.marginHorizontal,
  marginRight: props.marginHorizontal,
  marginTop: props.marginVertical,
  marginBottom: props.marginVertical,
  backgroundColor: props.backgroundColor,
}));

const sanitizedContent = computed(() =>
  (props.content ?? "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/"),
);

const iframeContent = computed(() => {
  // height:auto prevents html/body from stretching to the iframe viewport size,
  // which would cause scrollHeight to be inflated and never shrink on collapse.
  const noScrollStyle = `<style>html,body{margin:0;padding:0;overflow:hidden;width:100%;height:auto;}</style>`;

  // Script runs inside the iframe:
  // - reports height immediately and on every DOM resize (accordion, images, etc.)
  // - responds to 'requestHeight' messages from the parent (handles SSR race condition
  //   where the initial postMessage fires before the parent listener is registered)
  const resizeScript = `<script>
(function() {
  var id = ${JSON.stringify(uid.value)};
  function report() {
    // offsetHeight reflects actual layout height and shrinks on collapse.
    // scrollHeight is intentionally avoided — it is clamped to the iframe's
    // own viewport height and never decreases once the iframe grows tall.
    var h = document.body.offsetHeight;
    window.parent.postMessage({ type: 'iframeHeight', id: id, height: h }, '*');
  }
  report();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(report).observe(document.body);
  }
  // <details> / native accordion toggles — wait for the close animation to finish
  document.addEventListener('toggle', function() {
    setTimeout(report, 50);
  }, true);
  // Click passthrough
  document.addEventListener('click', function() {
    window.parent.postMessage({ type: 'iframeClick', id: id }, '*');
  });
  // Allow parent to request a fresh height report (fixes SSR race condition)
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'requestHeight' && e.data.id === id) {
      report();
    }
  });
})();
<\/script>`;

  let html = sanitizedContent.value;

  // Inject no-scroll styles
  if (html.includes("</head>")) {
    html = html.replace("</head>", noScrollStyle + "</head>");
  } else if (html.includes("<body")) {
    html = html.replace(/<body([^>]*)>/, "<body$1>" + noScrollStyle);
  } else {
    html = noScrollStyle + html;
  }

  // Inject resize script before closing body/html, or append
  if (html.includes("</body>")) {
    return html.replace("</body>", resizeScript + "</body>");
  }
  if (html.includes("</html>")) {
    return html.replace("</html>", resizeScript + "</html>");
  }
  return html + resizeScript;
});

const iframeHeight = ref("0px");
const iframeRef = ref(null);
const isLoading = ref(true);

function readHeightFromDom() {
  // Direct DOM read — works because srcdoc iframes are same-origin.
  // Uses offsetHeight to match the iframe-side measurement (avoids the
  // scrollHeight inflation issue when iframe is already tall).
  try {
    const doc = iframeRef.value?.contentDocument;
    if (!doc) return;
    const h = doc.body?.offsetHeight || 0;
    if (h > 0) {
      iframeHeight.value = `${h}px`;
      isLoading.value = false;
    }
  } catch {
    // cross-origin access denied — won't happen with srcdoc iframes
  }
}

function onIframeLoad() {
  // Handles the normal client-render case where data loads after hydration.
  readHeightFromDom();
  // Also request a postMessage report so ResizeObserver is guaranteed to be
  // set up inside the iframe before any subsequent mutations.
  iframeRef.value?.contentWindow?.postMessage(
    {type: "requestHeight", id: uid.value},
    "*",
  );
}

function onMessage(event) {
  if (!event.data || typeof event.data !== "object") return;

  if (event.data.type === "iframeHeight" && event.data.id === uid.value) {
    iframeHeight.value = `${event.data.height}px`;
    isLoading.value = false;
  }

  if (event.data.type === "iframeClick" && event.data.id === uid.value) {
    pageBuilderStore.selectComponent(props.id);
  }
}

onMounted(() => {
  window.addEventListener("message", onMessage);

  // SSR race-condition fix: the iframe may have already loaded (and fired its
  // initial postMessage) before this listener was registered. Ask it to re-report.
  nextTick(() => {
    iframeRef.value?.contentWindow?.postMessage(
      {type: "requestHeight", id: uid.value},
      "*",
    );
  });
});

onUnmounted(() => {
  window.removeEventListener("message", onMessage);
});
</script>

<template>
  <div :style="containerStyles" class="rte-component">
    <div class="rte-container">
      <iframe
        ref="iframeRef"
        :srcdoc="iframeContent"
        class="rte-iframe"
        frameborder="0"
        width="100%"
        scrolling="no"
        :style="{height: iframeHeight}"
        @load="onIframeLoad"
      />
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner" />
          <p class="loading-text">Loading content...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rte-component {
  width: 100%;
}

.rte-container {
  position: relative;
  width: 100%;
}

.rte-iframe {
  border: none;
  width: 100%;
  min-height: 200px;
  background: white;
  border-radius: 0.5rem;
  display: block;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
