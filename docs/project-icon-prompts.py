"""Swiss two-tone project marks: one hand-written prompt per project, rendered with Recraft V4 on Venice."""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

OUT = Path(__file__).parent / sys.argv[1]
VARIANTS = int(sys.argv[2])
ONLY = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
OUT.mkdir(exist_ok=True)

OPEN = "A brand logomark designed by a Swiss modernist studio, shown as a square full-bleed app icon. "
CLOSE = (
    " Two colors only. Perfect geometry and a strong silhouette. Generous margins: the mark sits well inside the frame "
    "with clear space on every side. Faint risograph paper grain. No text, no letters, no gradient, no shadow, no border."
)

PROMPTS = {
    # bankai: XOR patches for 1-bit models; named for a sword's final release. A one-bit circle split by a single strike.
    "bankai": (
        "Solid near-black background. A bold filled circle in electric teal, cut into two halves by one diagonal stroke of "
        "background-colored negative space, the lower half offset slightly down and to the left along the cut like a clean "
        "sword strike."
    ),
    # thimble: a tiny model that guards structured tool calls. The dome of a thimble, drawn as a pair of JSON braces.
    "thimble": (
        "Solid deep-oxblood background. A cream mark: a thimble silhouette, a rounded dome on a flat base band, where the "
        "left and right walls of the dome are drawn as two bold curly braces { and } leaning together so their tops meet "
        "in the dome's arch. Three small round dimples sit in the space between the braces."
    ),
    # tremor: catches market shocks before the news. A seismograph spike whose tip is the event itself.
    "tremor": (
        "Solid signal-orange background. One heavy black line with rounded ends runs flat across the middle third of the "
        "icon, rises into a single tall sharp spike, then drops back to flat. A solid black dot floats just above the tip of "
        "the spike, marking the event. The whole mark stays well inside the frame."
    ),
    "cross-market-state-fusion": (
        "Solid cobalt-blue background. Two bold filled lime-green circles of equal size overlapping by about a third. Where "
        "they overlap, the lens-shaped intersection is knocked out to the cobalt background, so two markets visibly fuse into "
        "a shared core."
    ),
    "veilstream": (
        "Solid electric-violet background. Three thick white horizontal bars with rounded ends, evenly stacked. A vertical "
        "band through the center of the icon acts as a veil: inside the band, each bar becomes a thin hairline before "
        "returning to full thickness on the other side, so the data stream passes through a privacy layer."
    ),
    "homunculus": (
        "Solid deep-plum background. A bold pale-pink round-bottomed flask: a large circle with a short straight neck and a "
        "flat lip on top. Knocked out of the center of the flask, in the plum background color, a tiny abstract person made "
        "of a small circle head above a rounded body, as if living inside the vessel."
    ),
    "terminal": (
        "Solid near-black pine-green background. A heavy signal-green right-pointing chevron, like the > of a command "
        "prompt, on the left. To its right, three horizontal signal-green bars of decreasing length stacked with even gaps, "
        "like the depth of an order book. Chunky, aligned on a strict grid."
    ),
    "openvenice": (
        "Solid terracotta background. A cream Venetian lancet arch: a tall shape with straight sides and a pointed ogee top, "
        "drawn as a thick solid frame, with a smaller matching arch knocked out of its center so the terracotta shows through "
        "like an open window."
    ),
    "scrim": (
        "Solid deep-espresso background. Three peach parallelograms slanted to the right, stacked vertically with small even "
        "gaps. The top one is fully solid, the middle one is a thick outline, the bottom one is a thin outline, so output "
        "visibly thins as it moves down the stack."
    ),
    "updownarena": (
        "Solid deep-navy background. One large solid aqua circle, the arena. Knocked out of it in navy: an upward arrow on "
        "the left and a downward arrow on the right, side by side, same size, with heavy stems and wide arrowheads. Flat and "
        "simple, no outlines, no hatching, no rings."
    ),
    "near-hydra": (
        "Solid deep-forest-green background. A bold mint-green mark: a single thick vertical stem that splits near the top "
        "into three smooth branches, left, center and right, each ending in a solid circle like a serpent head. Symmetric, "
        "calm, like a trident drawn with soft curves."
    ),
    "blindcache": (
        "Solid deep-teal background. A white hexagon divided into three equal rhombus segments that meet at its center, like "
        "an isometric cube, with clean even gaps between the segments. The top segment is solid white, the two lower segments "
        "are thick white outlines, so the vault is split into shares."
    ),
    "blindchat": (
        "Solid ink-navy background. A bold periwinkle speech bubble with softly rounded corners and a short tail at the lower left. Knocked out of its center in the navy background color: a closed eye, one smooth downward-curving eyelid line with four short lashes hanging below it. Private, sleeping, unseen."
    ),
    "nemo-ai": (
        "Solid deep-sea-blue background. An apricot golden-ratio spiral built from five nested quarter-circle segments of "
        "decreasing size, filled solid and separated by thin even gaps, curling into the center like a nautilus shell seen in "
        "cross-section."
    ),
    "sniffchain": (
        "Solid dark-olive background. A bold pale-lime profile of a hound's head facing right, alert ears back, reduced to a few clean geometric shapes. The tip of its nose is a single oval chain link, as if the dog is sniffing the chain."
    ),
    "clip-fun": (
        "Solid hot-pink background. A white paperclip drawn as one thick continuous rounded wire, bent so that its inner loop forms a right-pointing play triangle. Playful and clever, one unbroken line."
    ),
    "spine": (
        "Solid charcoal-slate background. A column of four light-grey rounded rectangles stacked vertically with small even "
        "gaps, each slightly narrower than the one below it, joined by one thin vertical line through their centers. Like a "
        "spine, or a coordination stack."
    ),
    "dreamloom": (
        "Solid midnight-indigo background. A lavender crescent moon drawn entirely from parallel diagonal stripes of equal "
        "width with even gaps between them, as if woven on a loom. The stripes stop crisply at the crescent's outline."
    ),
}


def generate(slug: str) -> str:
    body = {"model": "recraft-v4", "prompt": OPEN + PROMPTS[slug] + CLOSE, "width": 1024, "height": 1024,
            "format": "png", "return_binary": False, "variants": VARIANTS}
    req = urllib.request.Request(
        "https://api.venice.ai/api/v1/image/generate", data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + os.environ["VENICE_API_KEY"], "Content-Type": "application/json"},
    )
    for attempt in range(6):
        try:
            result = json.load(urllib.request.urlopen(req, timeout=300))
            break
        except urllib.error.HTTPError as err:
            if err.code not in (429, 503):
                return f"{slug}: HTTP {err.code} {err.read()[:300]!r}"
            time.sleep(6 * (attempt + 1))
    else:
        return f"{slug}: at capacity"
    for i, image in enumerate(result["images"]):
        (OUT / f"{slug}-{i}.png").write_bytes(base64.b64decode(image))
    return f"{slug}: {len(result['images'])}"


targets = [s for s in PROMPTS if (not ONLY or s in ONLY) and not (OUT / f"{s}-0.png").exists()]
with ThreadPoolExecutor(max_workers=4) as pool:
    for line in pool.map(generate, targets):
        print(line, flush=True)
