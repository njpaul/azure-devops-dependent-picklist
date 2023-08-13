export type FieldName = string;

export const FIELD_HINT_SOURCES = ['Area Path'] as const;
export type FieldHintSource = typeof FIELD_HINT_SOURCES[number];
export type FieldHint = {
  when: FieldHintSource,
  is: string,
};

export type FieldOptions = {
  hint?: FieldHint
} & Record<FieldName, string[] | FieldOptionsFlags>;
export type CascadeConfiguration = Record<FieldName, Record<FieldName, FieldOptions>>;
export type CascadeMap = Record<FieldName, ICascade>;

export enum FieldOptionsFlags {
  All = 'all',
}
export interface ICascade {
  alters: FieldName[];
  cascades: Record<FieldName, FieldOptions>;
}

export interface IManifest {
  version?: string;
  cascades?: CascadeConfiguration;
}
