import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://ad17mtsu1o.adulting.org/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICAgInJvbGUiOiAiYW5vbiIsCiAgICAiaXNzIjogInN1cGFiYXNlIiwKICAgICJpYXQiOiAxNjY2MDQwNDAwLAogICAgImV4cCI6IDE4MjM4MDY4MDAKfQ.DXJqhanZs6r8rJLp1eVheMZ_P96K84O4uN52lEtDBII');