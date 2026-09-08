import type { Element } from '@chemistrylab/chemspec';
import {
  balanceEquation,
  ChemistryError,
  type ConservationResult,
  getGroup,
  getPeriod,
  parseEquation,
  parseFormula,
  validateConservation,
} from '@chemistrylab/core';
import { useMemo, useState } from 'react';

import { ELEMENTS } from './elements';
import { t } from './i18n';
import { REACTIONS } from './reactions';

const DEFAULT_EQUATION = 'H2 + O2 -> H2O';

function unbalancedRender(reaction: (typeof REACTIONS)[number]): string {
  const side = (terms: readonly { molecule: string }[]) =>
    terms.map((term) => term.molecule).join(' + ');
  return `${side(reaction.equation.reactants)} -> ${side(reaction.equation.products)}`;
}

interface Diagnosis {
  readonly conservation: ConservationResult | null;
  readonly errorMessage: string | null;
}

function diagnose(equationInput: string): Diagnosis {
  try {
    const parsed = parseEquation(equationInput);
    const conservation = validateConservation(parsed);
    return { conservation, errorMessage: null };
  } catch (err) {
    const message = err instanceof ChemistryError ? err.message : String(err);
    return { conservation: null, errorMessage: message };
  }
}

export default function App() {
  const [equationInput, setEquationInput] = useState(DEFAULT_EQUATION);
  const [selectedId, setSelectedId] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  const diagnosis = useMemo(() => diagnose(equationInput), [equationInput]);

  const selectedReaction = REACTIONS.find((r) => r.id === selectedId) ?? null;
  const selectedElement = ELEMENTS.find((el) => el.symbol === selectedSymbol) ?? null;

  const handleSelectReaction = (id: string) => {
    setSelectedId(id);
    const reaction = REACTIONS.find((r) => r.id === id);
    if (reaction) setEquationInput(unbalancedRender(reaction));
  };

  const handleAutoBalance = () => {
    try {
      const result = balanceEquation(equationInput);
      setEquationInput(result.equation);
    } catch {
      // The live status region already explains why balancing can't proceed
      // (e.g. CHEM008 for an underdetermined system) — nothing more to do.
    }
  };

  return (
    <main>
      <header>
        <h1>ChemistryLab OS — Playground</h1>
        <p>
          Explore hydrogen combustion and 13 other curated reactions. Type or adjust an equation,
          check whether it conserves atoms, or let the engine balance it for you.
        </p>
      </header>

      <section aria-labelledby="elements-heading">
        <h2 id="elements-heading">Elements</h2>
        <label htmlFor="element-picker">Element</label>
        <select
          id="element-picker"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
        >
          <option value="">— Choose an element —</option>
          {ELEMENTS.map((el) => (
            <option key={el.symbol} value={el.symbol}>
              {el.symbol} — {t(el.nameKey)}
            </option>
          ))}
        </select>
        {selectedElement && <ElementDetail element={selectedElement} />}
      </section>

      <section aria-labelledby="reaction-picker-heading">
        <h2 id="reaction-picker-heading">Choose a reaction</h2>
        <label htmlFor="reaction-picker">Curated reactions</label>
        <select
          id="reaction-picker"
          value={selectedId}
          onChange={(e) => handleSelectReaction(e.target.value)}
        >
          <option value="">— Type your own equation below —</option>
          {REACTIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {t(r.titleKey)}
            </option>
          ))}
        </select>
        {selectedReaction && (
          <dl className="reaction-meta">
            <dt>Family</dt>
            <dd>{selectedReaction.reaction.family}</dd>
            <dt>Thermal effect</dt>
            <dd>{selectedReaction.reaction.thermalEffect}</dd>
            <dt>Concepts</dt>
            <dd>{selectedReaction.learning.conceptKeys.map(t).join(', ')}</dd>
            <dt>Accessible description</dt>
            <dd>{t(selectedReaction.accessibility.descriptionKey)}</dd>
          </dl>
        )}
      </section>

      <section aria-labelledby="balance-heading">
        <h2 id="balance-heading">Balance</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="equation-input">Equation</label>
          <input
            id="equation-input"
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" onClick={handleAutoBalance}>
            Balance automatically
          </button>
        </form>

        <div className="status" data-balanced={diagnosis.conservation?.balanced ?? false}>
          {diagnosis.errorMessage && <p role="alert">{diagnosis.errorMessage}</p>}
          {diagnosis.conservation && (
            <>
              <p className="status-headline" aria-live="polite">
                {diagnosis.conservation.balanced ? '✓ Balanced' : '✗ Not balanced'}
              </p>
              <table>
                <caption>Atom conservation by element</caption>
                <thead>
                  <tr>
                    <th scope="col">Element</th>
                    <th scope="col">Reactants</th>
                    <th scope="col">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...new Set([
                      ...Object.keys(diagnosis.conservation.reactantAtoms),
                      ...Object.keys(diagnosis.conservation.productAtoms),
                    ]),
                  ]
                    .sort()
                    .map((element) => {
                      const reactants = diagnosis.conservation!.reactantAtoms[element] ?? 0;
                      const products = diagnosis.conservation!.productAtoms[element] ?? 0;
                      const matches = reactants === products;
                      return (
                        <tr key={element}>
                          <th scope="row">{element}</th>
                          <td>{reactants}</td>
                          <td>
                            {products} {matches ? '✓' : '✗'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>

      {!diagnosis.errorMessage && (
        <section aria-labelledby="visualize-heading">
          <h2 id="visualize-heading">Visualize (conceptual)</h2>
          <p className="disclaimer">
            These molecule cards show atom composition only — they are not a simulated reaction
            mechanism. See ARCHITECTURE.md § "Educational vs. research-grade simulation."
          </p>
          <MoleculeCards equationInput={equationInput} />
        </section>
      )}
    </main>
  );
}

function MoleculeCards({ equationInput }: { equationInput: string }) {
  let parsed;
  try {
    parsed = parseEquation(equationInput);
  } catch {
    return null;
  }

  const renderSide = (
    label: string,
    terms: readonly { formula: string; coefficient: number }[],
  ) => (
    <div className="molecule-side">
      <h3>{label}</h3>
      <ul className="molecule-cards">
        {terms.map((term, i) => {
          try {
            const { atoms } = parseFormula(term.formula);
            return (
              <li key={`${term.formula}-${i}`} className="molecule-card">
                <p className="molecule-formula">
                  {term.coefficient > 1 ? `${term.coefficient} × ` : ''}
                  {term.formula}
                </p>
                <p className="molecule-atoms">
                  {Object.entries(atoms)
                    .map(([element, count]) => `${element}: ${count}`)
                    .join(', ')}
                </p>
              </li>
            );
          } catch {
            return null;
          }
        })}
      </ul>
    </div>
  );

  return (
    <div className="molecule-cards-container">
      {renderSide('Reactants', parsed.reactants)}
      {renderSide('Products', parsed.products)}
    </div>
  );
}

function ElementDetail({ element }: { element: Element }) {
  const period = getPeriod(element.atomicNumber);
  const group = getGroup(element.atomicNumber);
  const status = element.provenance?.review.scientificStatus ?? 'unverified';

  return (
    <dl className="element-meta">
      <dt>Atomic number</dt>
      <dd>{element.atomicNumber}</dd>
      <dt>Period</dt>
      <dd>{period}</dd>
      <dt>Group</dt>
      <dd>{group ?? 'f-block (not numbered 1–18 — see ROADMAP.md)'}</dd>
      <dt>Atomic mass</dt>
      <dd>
        {element.atomicMass ? (
          <>
            {element.atomicMass.value}
            {element.atomicMass.uncertainty != null && ` ± ${element.atomicMass.uncertainty}`}{' '}
            <span
              className="data-status"
              data-status={status}
              title="Scientific review status — see DATA_SOURCES.md"
            >
              {status}
            </span>
          </>
        ) : (
          'Not yet sourced'
        )}
      </dd>
    </dl>
  );
}
