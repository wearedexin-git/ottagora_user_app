/**
 * Stile del menu a tendina aperto, dove il browser lo permette (appearance: base-select, es.
 * Chrome): usa i colori dell'app invece della tendina di sistema. Altrove (Safari, Firefox)
 * resta quella nativa; sui telefoni si apre comunque il selettore del sistema operativo.
 *
 * Sta in un <style> qui e non in globals.css perché il compilatore CSS del progetto non
 * riconosce ancora ::picker(select) e scarterebbe l'intero blocco.
 */
const CSS = `
@supports (appearance: base-select) {
  select,
  ::picker(select) {
    appearance: base-select;
  }

  /* La freccia è già disegnata come sfondo del campo (vedi select in globals.css). */
  select::picker-icon {
    display: none;
  }

  ::picker(select) {
    min-width: anchor-size(width);
    max-height: 18rem;
    margin-top: 0.375rem;
    padding: 0.25rem;
    overflow-y: auto;
    border: 1px solid var(--neutral-200);
    border-radius: calc(var(--radius) * 1.25);
    background: var(--surface);
    box-shadow: 0 16px 32px -16px rgba(0, 0, 0, 0.25);
  }

  select option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    border-radius: calc(var(--radius) * 0.75);
    font-size: 0.875rem;
    color: var(--neutral-800);
    cursor: pointer;
  }

  select option:hover,
  select option:focus-visible {
    background: var(--primary-soft);
    outline: none;
  }

  select option:checked {
    font-weight: 600;
    color: var(--primary);
  }

  select option::checkmark {
    order: 1;
    margin-left: auto;
    color: var(--primary);
  }
}
`;

export function SelectPickerStyles() {
  return <style>{CSS}</style>;
}
