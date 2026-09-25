-- ============================================================================
-- 0008: inventarisatie bij aanmelding (keuze Ger 25-9-2026)
--
-- VOG en EHBO zijn NIET verplicht, maar we willen weten wie ze heeft. Ook of
-- iemand een rijbewijs heeft. Dit is wat de skileraar zelf opgeeft; de
-- kolommen vog_verified en ehbo_verified blijven voor onze eigen controle.
-- Herhaalbaar.
-- ============================================================================
alter table public.instructor_profiles
  add column if not exists has_drivers_license boolean,
  add column if not exists has_vog boolean,
  add column if not exists has_ehbo boolean;

select count(*) as profielen from public.instructor_profiles;
