import db from '../config/db.js';

async function setupThemes() {
  try {
    console.log('🎨 Setting up themes table...');
    
    // Drop existing table
    await db.query('DROP TABLE IF EXISTS themes CASCADE');
    console.log('✅ Dropped existing themes table');
    
    // Create table
    await db.query(`
      CREATE TABLE themes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        is_template BOOLEAN DEFAULT FALSE,
        colors JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created themes table');
    
    // Create index
    await db.query(`
      CREATE INDEX idx_themes_active ON themes(is_active) WHERE is_active = TRUE
    `);
    console.log('✅ Created index');
    
    // Insert ExtremeX Default with orange accent
    await db.query(`
      INSERT INTO themes (name, is_template, is_active, colors) VALUES
      ($1, $2, $3, $4)
    `, [
      'ExtremeX Default',
      true,
      true,
      JSON.stringify({
        primary: '#71DAF2',
        accent: '#FF6B35',
        background: '#000000',
        backgroundLight: '#2E3045',
        textGradientStart: '#FF6B35',
        textGradientEnd: '#71DAF2'
      })
    ]);
    console.log('✅ Created ExtremeX Default theme with orange accent');
    
    // Insert other templates
    const templates = [
      {
        name: 'Ocean Breeze',
        colors: {
          primary: '#00D9FF',
          accent: '#0891B2',
          background: '#0A1828',
          backgroundLight: '#1E3A5F',
          textGradientStart: '#22D3EE',
          textGradientEnd: '#06B6D4'
        }
      },
      {
        name: 'Sunset Vibes',
        colors: {
          primary: '#FF6B35',
          accent: '#A855F7',
          background: '#1A0B2E',
          backgroundLight: '#2D1B4E',
          textGradientStart: '#F97316',
          textGradientEnd: '#EC4899'
        }
      },
      {
        name: 'Forest Night',
        colors: {
          primary: '#10B981',
          accent: '#059669',
          background: '#0F1419',
          backgroundLight: '#1A2F23',
          textGradientStart: '#34D399',
          textGradientEnd: '#059669'
        }
      }
    ];
    
    for (const template of templates) {
      await db.query(`
        INSERT INTO themes (name, is_template, colors) VALUES ($1, $2, $3)
      `, [template.name, true, JSON.stringify(template.colors)]);
      console.log(`✅ Created ${template.name} theme`);
    }
    
    // Verify
    const result = await db.query('SELECT id, name, is_active, colors FROM themes');
    console.log('\n📊 Themes in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.name} (ID: ${row.id}, Active: ${row.is_active})`);
      console.log(`    Accent: ${row.colors.accent}`);
    });
    
    console.log('\n🎉 Setup complete! Orange accent color is ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupThemes();
