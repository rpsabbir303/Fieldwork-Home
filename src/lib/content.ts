export type SectionKey =
  "projects" | "guides" | "cost-guides" | "materials-tools" | "design-ideas" | "home-maintenance";
export type ContentBlock = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type ContentItem = {
  section: SectionKey;
  slug: string;
  title: string;
  summary: string;
  category: string;
  blocks: ContentBlock[];
  tools?: string[];
  materials?: string[];
  safety?: string;
  related?: string[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
};

export const sectionInfo: Record<SectionKey, { title: string; intro: string; label: string }> = {
  projects: {
    title: "Projects for the home you live in",
    intro:
      "Practical, sequenced projects with preparation, materials, safety notes, and a clear path to the right calculator.",
    label: "Project library",
  },
  guides: {
    title: "Know-how for every stage",
    intro: "Short, useful field guides that help you make better decisions before work begins.",
    label: "Learning library",
  },
  "cost-guides": {
    title: "Plan the real cost",
    intro:
      "Understand what drives a project budget, then use your own local quotes and product prices to estimate it.",
    label: "Cost planning",
  },
  "materials-tools": {
    title: "Choose materials with confidence",
    intro:
      "Plain-language comparisons of fit, installation, upkeep, and tradeoffs. No invented ratings or prices.",
    label: "Materials & tools",
  },
  "design-ideas": {
    title: "Ideas worth making real",
    intro:
      "Design directions grounded in materials, light, and the projects needed to bring them home.",
    label: "Design studio",
  },
  "home-maintenance": {
    title: "Care for what you build",
    intro: "Seasonal checklists and simple upkeep routines to help you spot issues early.",
    label: "Home maintenance",
  },
};

export const sectionPath = (item: Pick<ContentItem, "section" | "slug">) =>
  `/${item.section}/${item.slug}`;

export const projectCategories = [
  "Painting",
  "Flooring",
  "Tile",
  "Bathroom Improvement",
  "Kitchen Improvement",
  "Walls & Drywall",
  "Outdoor Projects",
  "Home Repairs",
];
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const starterContent: ContentItem[] = [
  {
    section: "projects",
    slug: "paint-an-interior-room",
    title: "Paint an interior room",
    category: "Painting",
    summary:
      "A careful room refresh, from surface repair and masking through the final coat and cleanup.",
    tools: [
      "Drop cloths",
      "Putty knife",
      "Sanding block",
      "Painter’s tape",
      "Angled brush",
      "Roller frame and tray",
      "Step ladder",
    ],
    materials: [
      "Interior paint",
      "Primer when needed",
      "Spackling compound",
      "Caulk for paintable gaps",
      "Roller covers",
    ],
    safety:
      "Ventilate the room and follow the coating label. For homes built before 1978, disturbing painted surfaces may involve lead; consult EPA lead-safe guidance before sanding or scraping.",
    related: [
      "/calculators/paint",
      "/cost-guides/interior-painting-budget",
      "/guides/choosing-interior-paint-finish",
    ],
    blocks: [
      {
        heading: "Before you start",
        paragraphs: [
          "Move furniture to the center or out of the room. Remove switch plates, cover floors, and inspect walls in strong side light. Buy paint from the same batch when possible and keep the label for touch-ups.",
          "Measure all wall runs and height before buying. Subtract openings only when they are large enough to materially change the estimate; an extra margin is useful for touch-ups.",
        ],
        bullets: [
          "Check whether your existing finish is glossy, damaged, stained, or freshly patched.",
          "Test your chosen color on more than one wall and view it in daylight and artificial light.",
          "Set aside time for the drying and recoating intervals printed on the paint can.",
        ],
      },
      {
        heading: "Repair and prepare",
        paragraphs: [
          "Fill small holes, let the compound dry, sand smooth, and remove dust. Caulk narrow gaps at trim only where the product label permits. Clean greasy areas so the coating bonds to the surface.",
        ],
        bullets: [
          "Prime bare patches and stains with a suitable primer.",
          "Mask hardware and edges that cannot be removed.",
          "Keep a damp cloth nearby for fresh drips.",
        ],
      },
      {
        heading: "Cut in and roll",
        paragraphs: [
          "Stir paint thoroughly. Use an angled brush to cut a narrow band at corners, ceiling lines, and trim. Roll adjacent sections while the cut-in edge is still workable to reduce lap marks.",
          "Load the roller evenly without flooding it. Work from top to bottom in manageable sections, maintaining a wet edge. Follow the manufacturer’s spread rate and recoat time rather than trying to stretch the paint.",
        ],
        bullets: [
          "Paint the ceiling first if it is part of the project.",
          "Apply a second coat after the stated drying interval.",
          "Check coverage in natural light before removing protection.",
        ],
      },
      {
        heading: "Finish and clean up",
        paragraphs: [
          "Remove tape carefully according to the tape and coating instructions. Reinstall plates after the paint is dry enough to avoid marks. Label and store leftover paint according to local rules.",
        ],
        bullets: [
          "Do not wash paint into storm drains.",
          "Keep a small sealed amount for later touch-ups.",
          "Record the color, finish, and room for future reference.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Skipping cleaning or primer on problem areas.",
          "Overworking paint as it begins to dry.",
          "Removing protective coverings before inspecting the final coat.",
        ],
      },
    ],
  },
  {
    section: "projects",
    slug: "install-a-tile-backsplash",
    title: "Install a tile backsplash",
    category: "Tile",
    summary:
      "Plan a backsplash layout, prepare the wall, set tile, grout, and seal movement joints.",
    tools: [
      "Tape measure",
      "Level",
      "Tile cutter or wet saw",
      "Notched trowel",
      "Tile spacers",
      "Grout float",
      "Sponge",
      "Safety glasses",
    ],
    materials: [
      "Tile",
      "Manufacturer-approved adhesive or mortar",
      "Grout",
      "Color-matched flexible sealant",
      "Edge trim where exposed",
    ],
    safety:
      "Turn off power before removing outlet covers. Cutting tile creates sharp edges and dust; use eye protection and a cutting method appropriate to the material. Electrical box extensions may be required and should meet local code.",
    related: [
      "/calculators/tile",
      "/cost-guides/tile-project-budget",
      "/guides/tile-layout-before-you-set",
    ],
    blocks: [
      {
        heading: "Plan the layout",
        paragraphs: [
          "Measure the wall, including outlets and the range area. Dry-lay a row on a flat surface and mark a level reference line. Shift the starting point to avoid very narrow cuts at the most visible ends.",
        ],
        bullets: [
          "Confirm tile size includes or excludes built-in spacing as applicable.",
          "Order extra tile for cuts and breakage based on layout complexity.",
          "Check whether your tile requires sealing before grout.",
        ],
      },
      {
        heading: "Prepare the surface",
        paragraphs: [
          "Remove loose finish and clean grease from the wall. The substrate must be flat, dry, sound, and compatible with the selected setting product. A backsplash is a splash area, but zones exposed to sustained water need a system appropriate for that exposure.",
        ],
        bullets: [
          "Protect countertops and cabinets.",
          "Remove covers and extend outlet boxes when required.",
          "Mark a level line; countertops are not always level.",
        ],
      },
      {
        heading: "Set the tile",
        paragraphs: [
          "Mix or open the setting product according to its instructions. Spread only an area you can tile within its working time. Comb with the recommended notch and press each tile into the bed with consistent spacing.",
        ],
        bullets: [
          "Check alignment every few rows.",
          "Clear excess material from joints before it hardens.",
          "Leave a movement gap where tile meets counters, cabinets, and inside corners.",
        ],
      },
      {
        heading: "Grout and finish",
        paragraphs: [
          "Allow the setting material to cure for the stated period. Work grout diagonally across the joints, remove excess with a lightly damp sponge, then buff haze after the surface firms up. Fill changes of plane with a suitable flexible sealant rather than rigid grout.",
        ],
        bullets: [
          "Follow the grout manufacturer’s mixing and cleaning directions.",
          "Seal only products that require it.",
          "Wait for the specified cure before heavy cleaning or splash exposure.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Starting from an unlevel countertop without a reference line.",
          "Using a setting product incompatible with tile or substrate.",
          "Grouting the countertop joint instead of allowing movement.",
        ],
      },
    ],
  },
  {
    section: "projects",
    slug: "repair-and-patch-drywall",
    title: "Repair and patch drywall",
    category: "Walls & Drywall",
    summary:
      "Repair a small to medium wall opening with a supported patch, compound, and a finish ready for paint.",
    tools: [
      "Utility knife",
      "Drywall saw",
      "Putty knives",
      "Sanding sponge",
      "Dust mask or respirator appropriate to the task",
      "Stud finder",
    ],
    materials: [
      "Matching drywall or repair patch",
      "Backing strips where needed",
      "Drywall screws",
      "Joint tape",
      "Joint compound",
      "Primer",
    ],
    safety:
      "Check for wiring and plumbing before cutting. In pre-1978 homes, painted surfaces may contain lead. If damage comes from water, find and fix the source before closing the wall; mold or structural damage may need a professional.",
    related: [
      "/calculators/drywall",
      "/cost-guides/drywall-repair-budget",
      "/guides/drywall-sheet-sizes-and-waste",
    ],
    blocks: [
      {
        heading: "Assess the damage",
        paragraphs: [
          "A shallow dent may only need compound. A hole with broken gypsum needs a patch supported by sound material. Investigate stains, soft board, or repeated cracking before cosmetic repair.",
        ],
        bullets: [
          "Locate studs, pipes, and electrical runs.",
          "Match the existing board thickness and any required fire or moisture rating.",
          "Protect the floor and contain sanding dust.",
        ],
      },
      {
        heading: "Cut and support the patch",
        paragraphs: [
          "Trim damaged board to a neat opening while preserving sound edges. For a hole between framing, fasten backing strips behind the opening, then cut replacement board to fit with a small, even gap. Screw it flush without tearing the paper face.",
        ],
        bullets: [
          "Never cut blindly into a wall cavity.",
          "Use a rated assembly detail where fire or sound performance matters.",
          "Check that the patch sits in the same plane as the wall.",
        ],
      },
      {
        heading: "Tape and finish",
        paragraphs: [
          "Apply joint compound and embed tape around the patch. Let each coat dry completely, feather wider with each pass, and sand lightly. Multiple thin coats usually finish better than one thick coat.",
        ],
        bullets: [
          "Remove ridges before the next coat.",
          "Use a work light across the surface to reveal uneven areas.",
          "Prime the patched area before paint to avoid a dull spot.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Patching over an active leak.",
          "Skipping backing for an unsupported opening.",
          "Sanding through the paper face or applying paint before primer.",
        ],
      },
    ],
  },
  ...[
    [
      "choosing-interior-paint-finish",
      "Choosing an interior paint finish",
      "Painting",
      "Match sheen to use, light, wall condition, and cleaning needs.",
      "Flat and matte finishes tend to hide surface imperfections, while glossier finishes are typically easier to wipe but show flaws more readily. Product lines vary, so compare the actual labels and samples.",
      "Test the finish on your wall under both day and evening light. For high-traffic areas, balance cleaning needs against how visible patching and roller marks may be.",
    ],
    [
      "how-to-measure-a-room-for-paint",
      "How to measure a room for paint",
      "Painting",
      "Turn a room’s dimensions into a transparent paint estimate.",
      "Add the lengths of all walls, multiply by wall height, and subtract meaningful door and window areas. Multiply by coats, then divide by the coverage on your chosen paint label.",
      "Textured walls, color changes, and application technique can alter coverage. Round up to a practical purchase amount and keep a little for touch-ups.",
    ],
    [
      "primer-when-and-why",
      "When a wall needs primer",
      "Painting",
      "Identify bare patches, stains, and difficult surfaces before painting.",
      "Primer can help seal porous repairs, improve adhesion, and block certain stains when the primer is selected for that purpose. A paint-and-primer label does not replace every specialty primer.",
      "Follow the coating system instructions. On older painted surfaces, use lead-safe practices before disturbing paint.",
    ],
    [
      "tile-layout-before-you-set",
      "Plan your tile layout before setting",
      "Tile",
      "A dry layout prevents awkward cuts and drifting lines.",
      "Measure the full surface and mark a center or reference line. Lay out tile with the intended joint width to see where cuts will land.",
      "Check the substrate with a level and straightedge. Decide where movement joints and transitions belong before opening adhesive.",
    ],
    [
      "tile-waste-allowance",
      "Choosing a tile waste allowance",
      "Tile",
      "Estimate cuts and breakage based on your actual layout.",
      "A straight layout with large open areas creates different waste than a diagonal layout with many corners and outlets. Use the calculator’s editable percentage as a planning allowance, not a guarantee.",
      "Order from the same lot when possible. Keep spare tile for future repairs because colors and sizes can change between production runs.",
    ],
    [
      "grout-and-caulk-where-each-belongs",
      "Grout or caulk: where each belongs",
      "Tile",
      "Use rigid grout and flexible sealant in the right places.",
      "Grout fills joints within a tile field. Changes of plane and transitions to other materials generally need a suitable flexible sealant so normal movement does not crack a rigid joint.",
      "Always follow the installation system’s instructions, especially in wet areas where waterproofing details are critical.",
    ],
    [
      "drywall-sheet-sizes-and-waste",
      "Drywall sheet sizes and waste",
      "Walls & Drywall",
      "Choose a board layout before buying sheets.",
      "Sheet size affects seams, lifting, transport, and offcuts. Calculate total surface area, account for large openings, and compare it with sheet area.",
      "Area alone cannot guarantee the right cut plan. Sketch each wall and ceiling, then add an editable waste allowance. Check local requirements for board type and rated assemblies.",
    ],
    [
      "patching-versus-replacing-drywall",
      "Patch or replace damaged drywall?",
      "Walls & Drywall",
      "Know when a cosmetic repair is enough.",
      "Small impact damage in otherwise dry, sound board can often be patched. Extensive softness, recurring cracks, or moisture staining may signal a larger issue.",
      "Fix the cause first. Wet or mold-affected assemblies and fire-rated walls may require a more specific repair approach.",
    ],
    [
      "reading-a-contractor-estimate",
      "How to read a contractor estimate",
      "Planning",
      "Compare scope, materials, and allowances on equal terms.",
      "An estimate should identify the work included, preparation, material assumptions, disposal, schedule, payment terms, and how changes are handled.",
      "Ask each bidder to clarify exclusions in writing. Check licensing and insurance requirements with your state or locality before hiring.",
    ],
    [
      "budgeting-for-surprises",
      "Budgeting for project surprises",
      "Planning",
      "Build a flexible plan for conditions you cannot see yet.",
      "Older walls, hidden moisture, uneven floors, and code-related corrections can change the scope after work starts. A contingency is a planning reserve, not a predicted fee.",
      "Keep it separate from the base estimate. Revisit the budget when you receive real quotes and document approved changes.",
    ],
    [
      "vinyl-versus-porcelain-flooring",
      "Vinyl or porcelain for a busy floor?",
      "Flooring",
      "Compare upkeep, water exposure, and subfloor demands.",
      "Luxury vinyl and porcelain tile differ in feel, installation, repairability, and substrate requirements. Neither is universally better for every room.",
      "Review the selected product’s installation instructions, slip characteristics, and warranty conditions. In wet rooms, the full assembly matters more than the surface alone.",
    ],
    [
      "measure-floor-area",
      "Measure floor area for materials",
      "Flooring",
      "Break irregular rooms into simple shapes.",
      "Measure each rectangle separately, multiply length by width, and add the results. Subtract only areas that truly will not receive material.",
      "Add allowance for cuts, pattern matching, and unusable offcuts. Confirm whether products are sold by piece, carton, or square foot.",
    ],
    [
      "caulk-clean-joints",
      "Make a clean paintable caulk joint",
      "Home Repairs",
      "A small finishing detail with a big visual effect.",
      "Remove loose old material, clean and dry the gap, and use a paintable product sized for the joint. Apply a modest bead and tool it before it skins over.",
      "Do not use paintable decorator caulk as a substitute for sealants specified for wet or high-movement joints. Follow cure instructions before painting.",
    ],
    [
      "seasonal-home-inspection",
      "A seasonal home inspection routine",
      "Maintenance",
      "Look for water, air, and wear before they become larger repairs.",
      "Walk the exterior after severe weather, inspect accessible plumbing for leaks, and note changes in doors, windows, and finishes.",
      "Document what you find. Hire a qualified professional for roof, electrical, gas, or structural concerns rather than taking avoidable risks.",
    ],
    [
      "ventilation-while-renovating",
      "Ventilation during an indoor project",
      "Safety",
      "Plan fresh air and dust control before work begins.",
      "Paint, adhesives, sanding, and cutting can affect indoor air. Read product labels and safety data, isolate dusty areas, and use ventilation suited to the task.",
      "A fan alone is not a substitute for appropriate respiratory protection or containment. Pay special attention to lead, asbestos, and mold risks in older homes.",
    ],
  ].map(([slug, title, category, summary, first, second]) => ({
    section: "guides" as const,
    slug,
    title,
    category,
    summary,
    related:
      slug.includes("paint") || slug.includes("primer")
        ? ["/calculators/paint", "/projects/paint-an-interior-room"]
        : slug.includes("tile") || slug.includes("grout")
          ? ["/calculators/tile", "/projects/install-a-tile-backsplash"]
          : slug.includes("drywall")
            ? ["/calculators/drywall", "/projects/repair-and-patch-drywall"]
            : ["/projects", "/cost-guides"],
    blocks: [
      { heading: "What to know", paragraphs: [first] },
      { heading: "How to use this advice", paragraphs: [second] },
    ],
  })),
  ...[
    [
      "interior-painting-budget",
      "Build an interior painting budget",
      "Painting",
      "A clear budget starts with wall area, the chosen coating, preparation, and supplies.",
      [
        "Paint: calculate gallons from net wall area, coats, and the label’s coverage, then multiply by your local price.",
        "Preparation: include patching compound, primer, caulk, tape, and floor protection when needed.",
        "Labor: obtain written local quotes that specify prep, coats, trim, and cleanup.",
      ],
    ],
    [
      "tile-project-budget",
      "Build a tile project budget",
      "Tile",
      "Account for the full installation system, not just the visible tile.",
      [
        "Tile: estimate pieces or cartons with a layout-specific waste allowance, then use your actual store price.",
        "Setting materials: include suitable mortar or adhesive, grout, trim, and movement-joint sealant.",
        "Labor and substrate: quotes should state demolition, leveling, waterproofing if needed, and disposal.",
      ],
    ],
    [
      "drywall-repair-budget",
      "Build a drywall repair budget",
      "Walls & Drywall",
      "Price the size of the repair and the finish quality you need.",
      [
        "Board and backing: count replacement material and supports for the opening.",
        "Finish: allow for tape, compound, primer, and matching paint.",
        "Labor: access, texture matching, drying visits, and cleanup affect a local quote.",
      ],
    ],
  ].map(([slug, title, category, summary, bullets]) => ({
    section: "cost-guides" as const,
    slug: slug as string,
    title: title as string,
    category: category as string,
    summary: summary as string,
    related: [
      slug === "tile-project-budget"
        ? "/calculators/tile"
        : slug === "drywall-repair-budget"
          ? "/calculators/drywall"
          : "/calculators/paint",
      "/projects",
    ],
    blocks: [
      { heading: "Budget components", bullets: bullets as string[] },
      {
        heading: "Get to a usable number",
        paragraphs: [
          "Enter your own current prices and measurements. Compare at least two written local quotes for hired work. Materials, taxes, delivery, permits, and disposal vary by location and scope; no national price is assumed here.",
        ],
        bullets: [
          "Write down the exact products and quantities.",
          "Keep a separate contingency for hidden conditions.",
          "Update the estimate after opening up the work or receiving quotes.",
        ],
      },
    ],
  })),
  ...[
    [
      "paint-finishes-compared",
      "Compare interior paint finishes",
      "Paint",
      "A practical comparison of matte, eggshell, satin, and semi-gloss finishes.",
      [
        "Matte: usually minimizes visible wall flaws; check product-specific washability.",
        "Eggshell and satin: a middle ground often chosen for lived-in rooms.",
        "Semi-gloss: highlights detail and is often used on trim; surface flaws are more apparent.",
      ],
    ],
    [
      "porcelain-vs-ceramic-tile",
      "Porcelain vs. ceramic tile",
      "Tile",
      "Understand how product classification, installation, and use affect the choice.",
      [
        "Porcelain: a defined subset of ceramic tile with low water absorption; cutting may require more capable tools.",
        "Other ceramic tile: broad range of wall and floor products; verify the exact tile’s intended use.",
        "For either: compare slip behavior, finish, thickness, maintenance, and manufacturer instructions for your application.",
      ],
    ],
    [
      "drywall-types-explained",
      "Drywall types explained",
      "Drywall",
      "Select board according to the assembly, exposure, and local requirements.",
      [
        "Standard board: common for many dry interior walls and ceilings.",
        "Moisture-resistant products: designed for specified damp applications, but are not a waterproofing system.",
        "Fire-rated assemblies: require a specified combination of board, fasteners, framing, and detailing—not just a board label.",
      ],
    ],
  ].map(([slug, title, category, summary, bullets]) => ({
    section: "materials-tools" as const,
    slug: slug as string,
    title: title as string,
    category: category as string,
    summary: summary as string,
    related: ["/projects", "/guides"],
    blocks: [
      { heading: "At a glance", bullets: bullets as string[] },
      {
        heading: "Before you buy",
        paragraphs: [
          "Compare the specifications and installation instructions for the exact product you are considering. Substrate, use, maintenance, and local requirements can change the right choice.",
        ],
      },
    ],
  })),
  ...[
    [
      "warm-minimal-kitchen",
      "Warm minimal kitchen",
      "Kitchen",
      "Layer warm white, natural wood, and restrained hardware for a calm working space.",
      "Start with light and existing cabinets. A painted wall or refreshed backsplash can shift the room without a full remodel.",
    ],
    [
      "earth-toned-bathroom",
      "Earth-toned bathroom",
      "Bathroom",
      "Use clay, stone, and soft contrast to make a small space feel grounded.",
      "Choose tile and grout together in real light. Wet-area waterproofing and ventilation must be planned as part of the design.",
    ],
    [
      "quiet-color-living-room",
      "Quiet color living room",
      "Living room",
      "A muted wall color and tactile finishes make room for everyday life.",
      "Sample paint on multiple walls. Choose sheen with cleaning and wall condition in mind.",
    ],
    [
      "patterned-entry-floor",
      "Patterned entry floor",
      "Entry",
      "A durable floor pattern gives an entry its own sense of place.",
      "Sketch the layout at full scale and check slip, cleaning, and substrate needs before ordering.",
    ],
  ].map(([slug, title, category, summary, paragraph]) => ({
    section: "design-ideas" as const,
    slug,
    title,
    category,
    summary,
    related: ["/projects", "/materials-tools"],
    blocks: [
      { heading: "Bring it home", paragraphs: [paragraph] },
      {
        heading: "Plan the work",
        bullets: [
          "Collect real material samples.",
          "Check them in your home’s daylight and evening light.",
          "Measure the space before buying.",
        ],
      },
    ],
  })),
  ...[
    [
      "spring-home-checklist",
      "Spring home checklist",
      "Spring",
      "Inspect winter wear and prepare for warmer, wetter weather.",
      [
        "Look for loose gutters and downspout discharge from the ground.",
        "Inspect accessible exterior caulk and paint for openings.",
        "Check interior plumbing under sinks for leaks.",
        "Test smoke and carbon monoxide alarms according to the manufacturer.",
      ],
    ],
    [
      "summer-home-checklist",
      "Summer home checklist",
      "Summer",
      "Keep water, heat, and ventilation in view.",
      [
        "Check bathroom and kitchen exhaust fans for normal operation.",
        "Clear plant growth from accessible outdoor equipment as directed by its manufacturer.",
        "Inspect visible deck surfaces and railings; refer structural concerns to a professional.",
        "Look for signs of condensation or leaks around cooling equipment.",
      ],
    ],
    [
      "fall-home-checklist",
      "Fall home checklist",
      "Fall",
      "Prepare the building envelope before colder weather.",
      [
        "Inspect weatherstripping and door sweeps.",
        "Arrange safe gutter cleaning where leaves collect.",
        "Check accessible attic or basement areas for moisture changes.",
        "Have heating equipment serviced as its manufacturer recommends.",
      ],
    ],
    [
      "winter-home-checklist",
      "Winter home checklist",
      "Winter",
      "Watch for cold-weather moisture and safety issues.",
      [
        "Keep exterior vents and exhaust outlets clear of snow or debris where safely accessible.",
        "Check exposed plumbing areas for freezing risk.",
        "Watch for condensation on windows and investigate persistent moisture.",
        "Review emergency supplies and manufacturer guidance for heating equipment.",
      ],
    ],
  ].map(([slug, title, category, summary, bullets]) => ({
    section: "home-maintenance" as const,
    slug: slug as string,
    title: title as string,
    category: category as string,
    summary: summary as string,
    related: ["/guides/seasonal-home-inspection", "/guides/ventilation-while-renovating"],
    safety:
      "Use a qualified professional for roof, electrical, gas, structural, or other tasks beyond safe access and your experience.",
    blocks: [
      { heading: "Your checklist", bullets: bullets as string[] },
      {
        heading: "Keep a record",
        paragraphs: [
          "Note the date, what you observed, and any follow-up work. Recheck unresolved items; a checklist does not replace inspection by a qualified professional.",
        ],
      },
    ],
  })),
];

const expandedGuides: Record<string, ContentBlock[]> = {
  "choosing-interior-paint-finish": [
    { heading: "Compare in the room", paragraphs: ["A sheen that looks subtle on a chip can read differently across a full wall. Put sample patches near a window, a lamp, and a high-contact area, then view them at the times you normally use the room."], bullets: ["Look across the surface at an angle; higher sheen makes uneven repairs easier to see.", "Check the product's cleaning instructions rather than assuming all paints with the same sheen behave alike.", "Use a consistent finish on connected walls unless a change is deliberate."] },
    { heading: "A practical choice", paragraphs: ["In a low-contact bedroom, hiding minor surface flaws may matter more than frequent wiping. In a hallway or child's room, cleaning may carry more weight. Trim and doors often benefit from a different finish than large walls."], bullets: ["Test color and sheen together.", "Record the exact product and finish for touch-ups.", "Prime repairs so sheen remains even across the wall."] },
  ],
  "how-to-measure-a-room-for-paint": [
    { heading: "Measure wall by wall", paragraphs: ["Write down each wall's width and height instead of relying on a rough room shape. Rooms with alcoves, sloped ceilings, or partial walls are easier to estimate as several rectangles."], bullets: ["Include short wall returns and recesses that will receive paint.", "Measure doors and windows separately if their size matters to the estimate.", "Calculate ceilings and trim separately; their products and coverage may differ."] },
    { heading: "Turn area into a shopping quantity", paragraphs: ["Multiply net paintable area by the number of coats, then divide by the chosen coating's stated coverage. Round up to the container sizes actually sold. A primer coat needs its own calculation."], bullets: ["Account for textured or porous surfaces.", "Allow a little material for touch-ups without treating a planning estimate as exact.", "Use the paint calculator to keep the math and assumptions visible."] },
  ],
  "primer-when-and-why": [
    { heading: "Common situations", paragraphs: ["Fresh joint compound, bare wood, and other porous repairs can absorb finish paint unevenly. Glossy or stained surfaces may need a primer formulated for adhesion or stain blocking. One primer does not solve every condition."], bullets: ["Identify the existing substrate and coating.", "Check compatibility between primer and finish coat.", "Allow the primer to dry or cure for the label's stated interval."] },
    { heading: "Avoid a patchy finish", paragraphs: ["Spot priming can be enough for small repairs, but large changes in porosity or color may call for priming the full surface. If a stain returns, investigate its source before applying more coats."], bullets: ["Clean grease and chalking first.", "Sand only when safe for the age and condition of the coating.", "Test a small area if adhesion is uncertain."] },
  ],
  "tile-layout-before-you-set": [
    { heading: "Use a reference line", paragraphs: ["A countertop or wall edge may look level while being visibly out of square. Mark a true reference with a level and compare the planned first and last cuts before setting anything."], bullets: ["Dry-lay at least one full row with spacers.", "Avoid tiny slivers at prominent edges by shifting the layout.", "Plan outlets, niches, corners, and exposed trim in advance."] },
    { heading: "Check the full assembly", paragraphs: ["The substrate, setting material, tile, grout, and movement joints must work together. A good pattern cannot compensate for a weak or uneven base."], bullets: ["Confirm the tile is intended for the location.", "Follow the setting material's trowel and coverage instructions.", "Use appropriate waterproofing details in wet locations."] },
  ],
  "tile-waste-allowance": [
    { heading: "What increases waste", paragraphs: ["Cuts around corners, plumbing, doors, and outlets consume pieces. Diagonal layouts and strongly patterned tiles can create more unusable offcuts than straight layouts."], bullets: ["Sketch the layout before choosing a percentage.", "Check how many pieces come in a carton.", "Ask whether a specific dye lot can be reordered later."] },
    { heading: "Use the estimate responsibly", paragraphs: ["The calculator rounds pieces up, but stores may sell only whole cartons. Compare the result with carton quantities and the pattern's cut plan before ordering."], bullets: ["Keep a few matching spare pieces when practical.", "Inspect deliveries for damage before work begins.", "Do not assume waste percentages transfer unchanged between rooms."] },
  ],
  "grout-and-caulk-where-each-belongs": [
    { heading: "Joints that move", paragraphs: ["A tile field has grout joints between pieces. Where the tile meets a countertop, tub, cabinet, or another plane, movement can stress rigid grout. A compatible flexible sealant is commonly specified for these transitions."], bullets: ["Leave the correct gap instead of filling it with setting material.", "Choose a sealant suited to the exposure and substrate.", "Follow the manufacturer's joint size and cure directions."] },
    { heading: "Keep water management separate", paragraphs: ["Grout and surface sealers are not substitutes for a complete waterproofing system. In showers and other wet assemblies, check the specified membrane and transition details before tiling."], bullets: ["Repair the cause of recurring cracks or leaks.", "Keep joints clean and dry before resealing.", "Use the system details required for the installation."] },
  ],
  "drywall-sheet-sizes-and-waste": [
    { heading: "Lay out seams first", paragraphs: ["A board count based only on square footage can underestimate awkward shapes or overestimate reusable offcuts. Sketch sheet placement across each wall and ceiling, looking at seam locations and how the sheets will be lifted into place."], bullets: ["Check framing spacing and required orientation.", "Plan openings and corners before cutting.", "Consider transport and safe handling of longer sheets."] },
    { heading: "Select the correct board", paragraphs: ["Thickness, moisture exposure, fire rating, and ceiling application affect board choice. In a rated assembly, every component and fastening detail matters."], bullets: ["Confirm local requirements and manufacturer instructions.", "Buy fasteners and tape appropriate to the assembly.", "Use the calculator as an area estimate, then reconcile it with the cut sketch."] },
  ],
  "patching-versus-replacing-drywall": [
    { heading: "Assess what is behind the finish", paragraphs: ["A cosmetic patch is appropriate only after the surrounding board is dry and stable. Repeated cracking can mean movement; softness and discoloration can mean moisture. These conditions deserve investigation before compound or paint."], bullets: ["Press gently around damage to find sound edges.", "Check accessible plumbing and exterior sources if a stain appears.", "Look for any required fire or sound rating."] },
    { heading: "Choose the repair scope", paragraphs: ["A supported patch may work for a localized hole. Wider damage can be easier to repair by replacing a larger rectangular section to framing. Finish quality also affects how far joint compound needs to be feathered."], bullets: ["Do not cut without locating wiring and pipes.", "Match board thickness to the existing wall.", "Prime finished compound before painting."] },
  ],
  "reading-a-contractor-estimate": [
    { heading: "Compare the same scope", paragraphs: ["A low number may omit preparation, disposal, permits, or a finish coat included in another bid. Put each written estimate side by side and mark differences before comparing totals."], bullets: ["Identify exact products or allowances for materials not yet chosen.", "Ask who handles permits, protection, cleanup, and inspection.", "Check the payment schedule and change-order process."] },
    { heading: "Resolve open items in writing", paragraphs: ["Ask clarifying questions before signing, especially when hidden conditions are likely. Confirm who will perform the work and what happens if the schedule or scope changes."], bullets: ["Verify the business's licensing and insurance status as applicable locally.", "Keep copies of the agreed scope and updates.", "Do not treat a verbal allowance as a fixed price."] },
  ],
  "budgeting-for-surprises": [
    { heading: "Separate known work from unknowns", paragraphs: ["Build the base budget from measured quantities, selected products, and written labor quotes. Keep the contingency visible as its own line so it does not hide an incomplete scope."], bullets: ["List assumptions about what is behind walls or under floors.", "Include delivery, disposal, permit, and tax lines where relevant.", "Record which products are final selections and which are allowances."] },
    { heading: "Manage changes as they occur", paragraphs: ["If hidden damage appears, pause long enough to understand the repair and its effect on schedule and cost. Update your plan before work continues."], bullets: ["Request a written change description and price.", "Preserve funds for work that protects the home, such as leak repair.", "Recalculate quantities when the scope grows."] },
  ],
  "vinyl-versus-porcelain-flooring": [
    { heading: "Compare the installation", paragraphs: ["Both surfaces rely on a suitable, prepared subfloor. Porcelain tile generally needs a rigid, correctly built substrate and grout joints. Vinyl products have different flatness, expansion, and underlayment instructions depending on the product."], bullets: ["Read the exact product's installation guide.", "Check transitions and finished floor height at doors.", "Ask how a damaged piece would be replaced later."] },
    { heading: "Match the room's use", paragraphs: ["In an entry, consider grit, water, cleaning, and slip behavior. In a kitchen, comfort underfoot and impact resistance may matter. Use samples in the actual light and compare maintenance instructions."], bullets: ["Do not rely on the surface layer alone for wet-area protection.", "Check manufacturer warranty conditions.", "Price the full installation system, not only the visible material."] },
  ],
  "measure-floor-area": [
    { heading: "Break the plan into shapes", paragraphs: ["Sketch the room and mark every alcove or bump-out. Calculate each rectangle separately, then add them. This makes it easier to check the numbers and explain them to a supplier or installer."], bullets: ["Use the same unit for every measurement.", "Measure to the edges that will actually receive material.", "Label any area excluded from the purchase quantity."] },
    { heading: "Convert area into an order", paragraphs: ["A carton may cover a fixed area while a tile is sold by piece. Pattern direction, plank lengths, and cut reuse affect how much extra material is sensible."], bullets: ["Confirm carton coverage and return policy.", "Check that all cartons have a matching lot when needed.", "Keep a small record of product name and lot for future repairs."] },
  ],
  "caulk-clean-joints": [
    { heading: "Prepare the gap", paragraphs: ["A clean joint begins with sound edges. Remove loose caulk, dirt, and dust; let the area dry. Very wide or deep gaps may need backer rod or a different repair instead of a thick bead."], bullets: ["Select a paintable product for a paint joint.", "Check the product's minimum and maximum joint size.", "Protect nearby finishes where cleanup would be difficult."] },
    { heading: "Apply and finish", paragraphs: ["Cut the nozzle for a bead that fits the gap. Move steadily, then tool once with the method recommended on the label. Let it cure before paint or water exposure."], bullets: ["Avoid excessive material that spreads onto both surfaces.", "Do not paint before the stated cure interval.", "Use a specified wet-area sealant around tubs and showers."] },
  ],
  "seasonal-home-inspection": [
    { heading: "Follow water first", paragraphs: ["Water leaves early clues: stains, musty odors, soft finishes, or soil that stays wet against the foundation. Inspect from safe, accessible locations and record changes over time."], bullets: ["Check visible supply and drain connections.", "Observe where downspouts discharge after rain.", "Look for peeling paint or failed sealant near openings."] },
    { heading: "Use a repeatable record", paragraphs: ["Take dated photos of anything that changes. A small record helps you distinguish an old mark from an active issue and makes a professional visit more productive."], bullets: ["Do not climb onto a roof for a routine check.", "Get qualified help for electrical, gas, structural, or persistent moisture concerns.", "Use seasonal checklists to keep the routine manageable."] },
  ],
  "ventilation-while-renovating": [
    { heading: "Control the source", paragraphs: ["Choose lower-emission products where suitable, isolate dusty work, and capture dust at the tool when practical. Ventilation works best as part of a plan that includes product selection and containment."], bullets: ["Read labels and safety data before opening products.", "Keep dust away from occupied rooms and HVAC returns.", "Allow prescribed drying or cure time before normal occupancy."] },
    { heading: "Know when extra precautions apply", paragraphs: ["Older homes may contain lead paint or asbestos-containing materials, and water damage can involve mold. The correct response depends on the material and disturbance planned; routine household fans are not a safe substitute for specialized controls."], bullets: ["Follow EPA lead-safe guidance for pre-1978 painted surfaces.", "Use appropriate respiratory protection for the task.", "Stop and consult a qualified professional when hazardous material is suspected."] },
  ],
};

const expandedComparisons: Record<string, ContentBlock[]> = {
  "paint-finishes-compared": [
    { heading: "Where each can work", bullets: ["Matte can make a large, imperfect wall read more quietly, subject to the selected product's cleaning performance.", "Eggshell or satin may suit shared rooms where some wipeability is useful.", "Semi-gloss can highlight trim, doors, and detail, but surface preparation becomes more visible."] },
    { heading: "Tradeoffs to check", paragraphs: ["Names and performance vary by manufacturer. Compare the exact product's scrub resistance, recommended use, and repaint instructions, then test a sample in your light."], bullets: ["Higher sheen tends to emphasize wall unevenness.", "Finish changes can make touch-ups visible.", "Specialty coatings may have different definitions and care requirements."] },
  ],
  "porcelain-vs-ceramic-tile": [
    { heading: "Installation considerations", paragraphs: ["Porcelain and other ceramic tiles both require a suitable substrate and compatible setting system. Dense porcelain can be harder to cut; the exact tile size and thickness influence tool choice."], bullets: ["Confirm floor or wall suitability on the selected product.", "Check slip behavior for entries and wet areas.", "Plan movement joints and transitions before ordering."] },
    { heading: "Care and selection", paragraphs: ["Surface finish, glaze, grout, and joint width affect cleaning more than the broad category name alone. Compare samples where they will be installed and follow the specific tile's care instructions."], bullets: ["Verify whether sealing is needed.", "Check lot, shade, and caliber information.", "Keep spare pieces for future repair when practical."] },
  ],
  "drywall-types-explained": [
    { heading: "Choose for the assembly", paragraphs: ["Ordinary, moisture-resistant, and specialty boards are not interchangeable merely because their faces look similar. A required fire or sound rating applies to the complete assembly, including board layers, framing, fasteners, and joint details."], bullets: ["Check local code and the approved assembly detail.", "Match the existing thickness for repairs.", "Use a waterproofing system, not drywall alone, where sustained water exposure exists."] },
    { heading: "Handling and finishing", paragraphs: ["Longer or thicker sheets can reduce seams but may be harder to move and lift safely. Plan delivery path, helpers, and the seam layout before buying."], bullets: ["Keep board dry before installation.", "Use the fastener schedule specified for the application.", "Prime finished joints before paint for consistent appearance."] },
  ],
};

for (const item of starterContent) {
  const extra = item.section === "guides" ? expandedGuides[item.slug] : item.section === "materials-tools" ? expandedComparisons[item.slug] : undefined;
  if (extra) item.blocks.push(...extra);
}

export function getStarter(section: SectionKey, slug: string) {
  return starterContent.find((item) => item.section === section && item.slug === slug);
}
