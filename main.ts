// Office Artifacts: The One-Line Placard Contest
// A museum label for the office printer, filed as if it were a relic
// excavated from a lost civilisation. The curator's note is deadpan;
// the printer, apparently, is still warming up.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Everything the placard needs lives in one place so the label can be
// re-catalogued without touching the code that publishes it.
const placardSpec = {
  objectName: "office printer",
  catalogueEra: "2019–present",
  destinationDir: "/output",
  fileName: "entry.txt",
  maxChars: 180,
  // The placard itself, exactly as the curator wrote it.
  wording:
    "This printer has been 'warming up' since 2019. Please do not feed it your hopes.",
};

// The gate the house scorer applies: UTF-8 text, 1 to 180 characters,
// and more than blank space. We check the same thing before writing so
// a bad label never reaches the output file.
function validate(placard: string, ceiling: number): string {
  const trimmed = placard.trim();
  if (placard !== trimmed) throw new Error("placard has leading or trailing whitespace");
  if (trimmed.length === 0) {
    throw new Error("placard is empty");
  }
  if ([...placard].length > ceiling) {
    throw new Error(
      `placard is ${[...placard].length} characters, over the ${ceiling} limit`,
    );
  }
  if (placard.includes("\n")) {
    throw new Error("placard must be a single line");
  }
  return placard;
}

async function publishPlacard(): Promise<void> {
  const checked = validate(placardSpec.wording, placardSpec.maxChars);
  await mkdir(placardSpec.destinationDir, { recursive: true });
  const target = join(placardSpec.destinationDir, placardSpec.fileName);
  await writeFile(target, checked, "utf8");
  console.log(
    `Catalogued "${placardSpec.objectName}" (${placardSpec.catalogueEra}) — ` +
      `${[...checked].length} characters written to ${target}`,
  );
}

await publishPlacard();
