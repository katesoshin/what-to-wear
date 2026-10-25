// Technical flats — the line drawings designers send to factories — as recolorable SVG.
// Each garment: `fill` = filled outline paths, `line` = construction lines, `stitch` = dashed topstitching,
// `dots` = buttons [cx, cy, r], `sole` = parts drawn in a fixed sole color. All in a 100 x 100 box.
const FLATS = {
  tee: {
    fill: ["M30 12 L41 8 Q50 16 59 8 L70 12 L91 27 L83 41 L72 35 L72 91 L28 91 L28 35 L17 41 L9 27 Z"],
    line: ["M41 8 Q50 20 59 8"],
    stitch: ["M30 87 L70 87", "M13 33 L20 37", "M87 33 L80 37", "M42 11 Q50 19 58 11"],
  },
  shirt: {
    fill: ["M32 12 L42 7 L58 7 L68 12 L84 22 L95 79 L85 81 L74 38 L74 93 L26 93 L26 38 L15 81 L5 79 L16 22 Z"],
    line: ["M42 7 L44 19 L50 13 L56 19 L58 7", "M50 13 L50 93", "M7 72 L17 74", "M93 72 L83 74", "M56 30 L66 30 L66 40 L56 40 Z"],
    stitch: ["M28 89 L72 89"],
    dots: [[50, 25, 1.4], [50, 38, 1.4], [50, 51, 1.4], [50, 64, 1.4], [50, 77, 1.4]],
  },
  knit: {
    fill: ["M34 11 Q50 19 66 11 L84 20 L95 79 L85 81 L74 38 L74 93 L26 93 L26 38 L15 81 L5 79 L16 20 Z"],
    line: ["M34 11 Q50 25 66 11", "M26 85 L74 85", "M6 72 L16 74", "M94 72 L84 74"],
    stitch: ["M30 85 L30 93", "M36 85 L36 93", "M42 85 L42 93", "M48 85 L48 93", "M54 85 L54 93", "M60 85 L60 93",
             "M66 85 L66 93", "M38 15 Q50 22 62 15"],
  },
  turtleneck: {
    fill: ["M38 3 L62 3 L64 13 L84 20 L95 79 L85 81 L74 38 L74 93 L26 93 L26 38 L15 81 L5 79 L16 20 L36 13 Z"],
    line: ["M36 13 Q50 18 64 13", "M26 85 L74 85", "M6 72 L16 74", "M94 72 L84 74"],
    stitch: ["M42 4 L42 13", "M48 4 L48 14", "M54 4 L54 14", "M60 4 L60 13", "M34 85 L34 93", "M44 85 L44 93",
             "M54 85 L54 93", "M64 85 L64 93"],
  },
  camisole: {
    fill: ["M37 30 L41 10 L43 10 L46 28 Q50 34 54 28 L57 10 L59 10 L63 30 L68 92 L32 92 Z"],
    line: ["M46 28 Q50 34 54 28"],
    stitch: ["M34 88 L66 88", "M38 31 Q50 39 62 31"],
  },
  blazer: {
    fill: ["M31 10 L42 6 L58 6 L69 10 L86 20 L95 82 L85 84 L76 40 L76 94 L24 94 L24 40 L15 84 L5 82 L14 20 Z"],
    line: ["M42 6 L36 23 L43 27 L50 50 L57 27 L64 23 L58 6", "M50 50 L50 94", "M29 74 L42 74", "M58 74 L71 74",
           "M6 76 L16 78", "M94 76 L84 78"],
    dots: [[52, 62, 1.8]],
  },
  coat: {
    fill: ["M32 6 L42 3 L58 3 L68 6 L84 15 L94 84 L84 86 L76 36 L77 98 L23 98 L24 36 L16 86 L6 84 L16 15 Z"],
    line: ["M42 3 L37 18 L44 22 L50 42 L56 22 L63 18 L58 3", "M50 42 L50 98", "M28 72 L28 84", "M72 72 L72 84",
           "M8 78 L17 80", "M92 78 L83 80"],
    dots: [[45, 52, 1.6], [55, 52, 1.6], [45, 64, 1.6], [55, 64, 1.6]],
  },
  jacket: {
    fill: ["M31 12 L42 8 L58 8 L69 12 L86 22 L92 72 L82 74 L76 40 L76 80 L24 80 L24 40 L18 74 L8 72 L14 22 Z"],
    line: ["M42 8 L45 18 L50 14 L55 18 L58 8", "M50 14 L50 80", "M24 73 L76 73", "M32 30 L44 30 L44 40 L32 40 Z",
           "M56 30 L68 30 L68 40 L56 40 Z"],
    stitch: ["M26 76 L74 76"],
    dots: [[50, 28, 1.4], [50, 42, 1.4], [50, 56, 1.4], [50, 68, 1.4]],
  },
  trousers: {
    fill: ["M28 7 L72 7 L79 95 L56 95 L50 33 L44 95 L21 95 Z"],
    line: ["M28 14 L72 14", "M38 20 L32 95", "M62 20 L68 95", "M50 14 Q53 22 50 30"],
    stitch: ["M34 7 L34 14", "M66 7 L66 14", "M22 91 L44 91", "M56 91 L78 91"],
  },
  jeans: {
    fill: ["M28 7 L72 7 L78 95 L56 95 L50 33 L44 95 L22 95 Z"],
    line: ["M28 14 L72 14"],
    stitch: ["M30 16 Q38 18 40 26", "M70 16 Q62 18 60 26", "M50 14 Q54 24 50 32", "M23 91 L44 91", "M56 91 L77 91",
             "M34 7 L34 14", "M66 7 L66 14"],
    stitchColor: "#c9a64a",
    dots: [[50, 10, 1.6]],
  },
  skirt: {
    fill: ["M33 10 L67 10 L81 90 L19 90 Z"],
    line: ["M33 17 L67 17", "M43 17 L37 90", "M57 17 L63 90", "M50 17 L50 90"],
    stitch: ["M21 86 L79 86"],
  },
  dress: {
    fill: ["M38 5 L44 5 Q50 13 56 5 L62 5 L66 18 L62 40 L81 95 L19 95 L38 40 L34 18 Z"],
    line: ["M44 5 Q50 17 56 5", "M38 40 L62 40", "M45 40 L38 95", "M55 40 L62 95"],
    stitch: ["M21 91 L79 91"],
  },
  loafers: {
    fill: ["M8 66 Q10 52 25 52 L50 56 Q72 58 87 66 Q93 71 89 77 L11 77 Q6 73 8 66 Z"],
    line: ["M38 55 Q47 66 62 60", "M44 61 L60 59"],
    sole: ["M9 74 L91 74 L90 80 L10 80 Z"],
  },
  sneakers: {
    fill: ["M7 64 Q9 46 26 48 L45 54 Q66 54 84 60 Q95 64 93 72 L7 72 Z"],
    line: ["M26 48 Q26 62 34 70"],
    stitch: ["M40 53 L46 59", "M46 52 L52 58", "M52 53 L58 59"],
    sole: ["M6 72 L94 72 L93 80 L7 80 Z"],
  },
  boots: {
    fill: ["M28 18 L52 18 L53 54 Q74 57 88 65 Q93 71 88 77 L28 77 Z"],
    line: ["M43 20 Q46 36 43 52"],
    sole: ["M27 77 L89 77 L88 81 L27 81 Z", "M27 81 L39 81 L38 90 L28 90 Z"],
  },
  heels: {
    fill: ["M12 56 Q22 48 38 56 Q56 64 78 58 L92 60 Q88 68 74 69 L38 71 L30 70 Q16 66 12 56 Z"],
    line: ["M38 56 Q44 62 52 63"],
    sole: ["M30 70 L37 71 L29 91 L25 91 Z"],
  },
  flats: {
    fill: ["M9 66 Q13 56 30 58 Q50 62 74 60 Q91 61 91 70 Q91 77 80 77 L16 77 Q7 75 9 66 Z"],
    line: ["M44 60 Q52 66 62 61"],
    dots: [[53, 63, 2.2]],
    sole: ["M12 76 L88 76 L86 80 L14 80 Z"],
  },
  bag: {
    fill: ["M21 40 L79 40 L85 90 L15 90 Z"],
    line: ["M34 40 Q34 17 50 17 Q66 17 66 40"],
    stitch: ["M24 46 L76 46"],
  },
  jewelry: {
    ring: [[34, 50, 13], [68, 50, 13]],
  },
  watch: {
    fill: ["M42 8 L58 8 L58 92 L42 92 Z"],
    ring: [[50, 50, 14]],
  },
  belt: {
    fill: ["M8 43 L92 43 L92 57 L8 57 Z"],
    line: ["M18 39 L32 39 L32 61 L18 61 Z"],
    dots: [[50, 50, 1.4], [58, 50, 1.4], [66, 50, 1.4]],
  },
  scarf: {
    fill: ["M18 20 Q50 34 82 20 L76 40 Q50 50 24 40 Z", "M54 44 L66 88 L55 91 L46 46 Z"],
    stitch: ["M66 88 L55 91"],
  },
  tie: {
    fill: ["M44 7 L56 7 L54 18 L62 76 L50 93 L38 76 L46 18 Z"],
    line: ["M44 18 L56 18"],
  },
};

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Guess a drawing for closet items, which only have a category and a name.
function guessGarment(category, name = "") {
  const n = name.toLowerCase();
  const rules = [
    [/jean|denim(?! jacket)/, "jeans"], [/skirt/, "skirt"], [/dress/, "dress"], [/turtleneck/, "turtleneck"],
    [/camisole|cami\b|shell|slip top/, "camisole"], [/shirt|blouse|oxford|polo/, "shirt"],
    [/sweater|knit|crewneck|cardigan|hoodie/, "knit"], [/blazer|suit jacket|dinner jacket/, "blazer"],
    [/coat|trench|overcoat/, "coat"], [/jacket|puffer|overshirt/, "jacket"],
    [/sneaker|trainer/, "sneakers"], [/boot/, "boots"], [/pump|heel|slingback/, "heels"],
    [/flat|sandal/, "flats"], [/loafer|oxford dress shoe|shoe/, "loafers"],
    [/earring|necklace|ring|bracelet|chain|hoop/, "jewelry"], [/watch/, "watch"], [/belt/, "belt"],
    [/scarf/, "scarf"], [/\btie\b/, "tie"], [/bag|tote|backpack/, "bag"],
  ];
  for (const [re, g] of rules) if (re.test(n)) return g;
  return {top: "tee", bottom: "trousers", dress: "dress", outerwear: "blazer", shoes: "loafers", accessory: "bag"}[category] || "tee";
}

function drawFlat(garment, hex) {
  const spec = FLATS[garment] || FLATS.tee;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  const detail = luminance(hex) > 0.55 ? "rgba(17,17,17,.55)" : "rgba(255,255,255,.6)";
  const add = (tag, attrs) => {
    const n = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
    return n;
  };
  const outline = {stroke: "#111", "stroke-width": 1.3, "stroke-linejoin": "round"};
  (spec.fill || []).forEach(d => add("path", {d, fill: hex, ...outline}));
  (spec.ring || []).forEach(([cx, cy, r]) => {
    add("circle", {cx, cy, r, fill: "none", stroke: "#111", "stroke-width": 7});
    add("circle", {cx, cy, r, fill: "none", stroke: hex, "stroke-width": 4.6});
  });
  (spec.sole || []).forEach(d => add("path", {d, fill: garment === "sneakers" ? "#f4f2ee" : "#2a2a2a", ...outline}));
  (spec.line || []).forEach(d => add("path", {d, fill: "none", stroke: detail, "stroke-width": 1.1, "stroke-linejoin": "round"}));
  (spec.stitch || []).forEach(d => add("path", {d, fill: "none", stroke: spec.stitchColor || detail, "stroke-width": 0.9,
                                               "stroke-dasharray": "2 1.6"}));
  (spec.dots || []).forEach(([cx, cy, r]) => add("circle", {cx, cy, r, fill: detail}));
  return svg;
}
