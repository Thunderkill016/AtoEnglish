# Contract: English Ontology V1

- Contract identifier: `nep.english-ontology.v1`.
- Canonical node ID grammar: `nep.en.v1.<domain>.<slug>`.
- Builder returns immutable, lexically normalized nodes, relations, crosswalks, and overlays.
- Validator returns lexically sorted typed problems; any problem blocks construction.
- Dependency relations `prerequisite-of`, `component-of`, and `enables` are acyclic.
- `contrasts-with` and `confusable-with` are symmetric canonical pairs.
- `transfers-to` is directional and never expanded.
- Crosswalks and overlays reference canonical IDs but cannot replace node fields or certify
  observation, evidence, calibration, mastery, or authority.
