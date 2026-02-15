-- Drop and recreate themes table with correct schema
DROP TABLE IF EXISTS themes CASCADE;

CREATE TABLE themes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  colors JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster active theme lookup
CREATE INDEX idx_themes_active ON themes(is_active) WHERE is_active = TRUE;

-- Insert ExtremeX Default theme with orange accent
INSERT INTO themes (name, is_template, is_active, colors) VALUES
('ExtremeX Default', true, true, 
 '{"primary": "#71DAF2", "accent": "#FF6B35", "background": "#000000", "backgroundLight": "#2E3045", "textGradientStart": "#FF6B35", "textGradientEnd": "#71DAF2"}'::jsonb
);

-- Insert other theme templates
INSERT INTO themes (name, is_template, colors) VALUES
('Ocean Breeze', true,
 '{"primary": "#00D9FF", "accent": "#0891B2", "background": "#0A1828", "backgroundLight": "#1E3A5F", "textGradientStart": "#22D3EE", "textGradientEnd": "#06B6D4"}'::jsonb
),
('Sunset Vibes', true,
 '{"primary": "#FF6B35", "accent": "#A855F7", "background": "#1A0B2E", "backgroundLight": "#2D1B4E", "textGradientStart": "#F97316", "textGradientEnd": "#EC4899"}'::jsonb
),
('Forest Night', true,
 '{"primary": "#10B981", "accent": "#059669", "background": "#0F1419", "backgroundLight": "#1A2F23", "textGradientStart": "#34D399", "textGradientEnd": "#059669"}'::jsonb
);

-- Verify
SELECT id, name, is_active, colors FROM themes;
