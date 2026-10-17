// Translations the site may quote. CLAUDE.md "Translation licensing".
// Public domain, may be served in full: KJV, ASV, YLT, DBY (Darby), WEB.
// NASB and NKJV are licensed: short, labelled quotation inside teaching only.
export const publicDomainVersions = ["KJV", "ASV", "YLT", "DBY", "WEB"] as const;
export const quotationOnlyVersions = ["NASB", "NKJV"] as const;
export const scriptureVersions = [...publicDomainVersions, ...quotationOnlyVersions] as const;
export type ScriptureVersion = (typeof scriptureVersions)[number];
