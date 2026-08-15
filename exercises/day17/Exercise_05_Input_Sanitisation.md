# D17 Exercise 05 — Input Sanitisation

## Goal

Explain and apply simple input sanitisation.

## Tasks

Create a small utility or helper method that can:

1. Trim leading/trailing spaces.
2. Convert empty strings to null where appropriate.
3. Remove control characters from simple text.
4. Normalise code-like fields if needed.

## Important

Do not use sanitisation to hide invalid input. Some input should still be rejected.

## Reflection

Answer:

1. What is validation?
it is deciding whether the input is allowed and rejecting it with error if its not. 

2. What is sanitisation?
it is tidying input into a consistent shape before storing it

3. Give one example where input should be cleaned.
when the input came with trailing whitespace and newline.

4. Give one example where input should be rejected.
when the input is completely different from our intended answer
