# Design Notes

## Project Cards

Project cards use Framer Motion for position changes only. Open/closed layout is handled by CSS so card content is not horizontally scaled during expand, close, or shuffle transitions.

Only cards that are actively expanding or minimizing receive the temporary `is-morphing` treatment. The effect is intentionally subtle: a light body blur plus a low-opacity tonal veil, used only to soften content reflow on the changing card.

Animated previews should provide an `imagePoster`, `imageSprite`, and `imageSpriteFrames` in `src/data/portfolio.js`. Card media animates the static sprite sheet with CSS for normal motion users and falls back to the poster for reduced-motion users, avoiding animated image decoder repainting inside the card.

The first project card uses a narrowly scoped size morph only for direct expand/minimize from the all-minimized state. Expanded-card shuffle remains position-only so the existing shuffle feel does not change.
