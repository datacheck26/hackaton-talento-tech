// ============================================================
// Datacheck AI — Tipos: Empresa
// ============================================================

export type SectorEmpresa =
  | 'tecnologia'
  | 'salud'
  | 'financiero'
  | 'retail'
  | 'educacion'
  | 'manufactura'
  | 'servicios'
  | 'gobierno'
  | 'otro';

export type TamanoEmpresa = '1-10' | '11-50' | '51-200' | '201+';

export interface DatosEmpresa {
  nombre: string;
  nit: string;
  sector: SectorEmpresa;
  tamano: TamanoEmpresa;
  fechaRegistro: string; // ISO string
}

export const SECTORES: { value: SectorEmpresa; label: string }[] = [
  { value: 'tecnologia',   label: 'Tecnología y Software' },
  { value: 'salud',        label: 'Salud y Bienestar' },
  { value: 'financiero',   label: 'Financiero y Banca' },
  { value: 'retail',       label: 'Comercio y Retail' },
  { value: 'educacion',    label: 'Educación' },
  { value: 'manufactura',  label: 'Manufactura e Industria' },
  { value: 'servicios',    label: 'Servicios Profesionales' },
  { value: 'gobierno',     label: 'Gobierno y Sector Público' },
  { value: 'otro',         label: 'Otro' },
];

export const TAMANOS: { value: TamanoEmpresa; label: string; descripcion: string }[] = [
  { value: '1-10',   label: '1 – 10',   descripcion: 'Microempresa' },
  { value: '11-50',  label: '11 – 50',  descripcion: 'Pequeña empresa' },
  { value: '51-200', label: '51 – 200', descripcion: 'Mediana empresa' },
  { value: '201+',   label: '201+',     descripcion: 'Gran empresa' },
];
