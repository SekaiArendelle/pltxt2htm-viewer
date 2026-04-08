import type { Component } from 'solid-js';
import { createEffect, createSignal, onMount, Show } from 'solid-js';
import styles from './App.module.css';
import { getAdvancedParser } from './lib/pltxt2htm';

const defaultMarkdown = `# Markdown Preview

Type Markdown on the left, and the converted HTML preview will render in real time on the right.

## Example

- Supports headings
- Supports lists
- Supports **bold** and *italic*

\`\`\`ts
const hello = "pltxt2htm";
console.log(hello);
\`\`\`
`;

const App: Component = () => {
  const [markdown, setMarkdown] = createSignal(defaultMarkdown);
  const [renderedHtml, setRenderedHtml] = createSignal('');
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [advancedParser, setAdvancedParser] = createSignal<
    ((text: string) => string) | null
  >(null);

  onMount(async () => {
    try {
      const parser = await getAdvancedParser();
      setAdvancedParser(() => parser);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize parser');
    } finally {
      setLoading(false);
    }
  });

  createEffect(() => {
    const parser = advancedParser();
    if (!parser) return;
    try {
      setRenderedHtml(parser(markdown()));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse markdown');
    }
  });

  return (
    <main class={styles.app}>
      <section class={styles.panel}>
        <h2 class={styles.title}>Markdown Input</h2>
        <textarea
          class={styles.editor}
          value={markdown()}
          onInput={(e) => setMarkdown(e.currentTarget.value)}
          spellcheck={false}
        />
      </section>
      <section class={styles.panel}>
        <h2 class={styles.title}>Rendered Preview</h2>
        <Show when={!loading()} fallback={<div class={styles.tip}>Loading parser...</div>}>
          <Show when={!error()} fallback={<div class={styles.error}>{error()}</div>}>
            <article class={styles.preview} innerHTML={renderedHtml()} />
          </Show>
        </Show>
      </section>
    </main>
  );
};

export default App;
