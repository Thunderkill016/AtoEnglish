# Data Model: English Ontology V1

## OntologyNode

Stable ID, contract version, domain, family/activity, kind, granularity, label/definition,
modalities, task constraints, context constraints, evidence compatibility, provenance refs.

## OntologyRelation

Stable source/target IDs, relation type, optional constraint tags. Contrast/confusion are
canonical symmetric pairs; transfer and all remaining types are directional.

## OntologyGraph

Contract ID plus readonly normalized nodes/relations. Node and relation ordering is lexical and
input-order independent. Dependency subgraphs are acyclic.

## FrameworkCrosswalk

External framework/version/locator, canonical node ID, mapping strength, provenance/license.
It contains no replacement node payload or authority field.

## LearnerHypothesisOverlay

Population tag, canonical node ID, hypothesis, provenance, review status. It cannot mutate nodes
and cannot encode learner-specific observation or mastery.
