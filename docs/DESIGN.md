# Design Notes

## Project Cards

Project cards use Framer Motion for position changes only. Open/closed layout is handled by CSS so card content is not horizontally scaled during expand, close, or shuffle transitions.

Only cards that are actively expanding or minimizing receive the temporary `is-morphing` treatment. The effect is intentionally subtle: a light body blur plus a low-opacity tonal veil, used only to soften content reflow on the changing card.

Animated GIFs should provide an `imagePoster` in `src/data/portfolio.js`. Card media renders the poster instead of autoplaying GIF frames inside the card chrome, preventing idle flicker while keeping the animated source available as project metadata.
