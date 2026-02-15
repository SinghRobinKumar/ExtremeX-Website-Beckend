import Theme from '../models/themeModel.js';

// Predefined theme templates
const themeTemplates = [
  {
    name: 'ExtremeX Default',
    is_template: true,
    is_active: true,
    colors: {
      primary: '#71DAF2',           // Neon Ice Blue
      accent: '#FF6B35',            // Deep Orange
      background: '#000000',        // Black
      backgroundLight: '#2E3045',   // Deep Midnight Blue
      textGradientStart: '#FF6B35', // Deep Orange
      textGradientEnd: '#71DAF2'    // Neon Ice Blue
    }
  },
  {
    name: 'Ocean Breeze',
    is_template: true,
    colors: {
      primary: '#00D9FF',           // Bright Cyan
      accent: '#0891B2',            // Teal
      background: '#0A1828',        // Deep Ocean Blue
      backgroundLight: '#1E3A5F',   // Navy
      textGradientStart: '#22D3EE', // Sky Blue
      textGradientEnd: '#06B6D4'    // Cyan
    }
  },
  {
    name: 'Sunset Vibes',
    is_template: true,
    colors: {
      primary: '#FF6B35',           // Coral Orange
      accent: '#A855F7',            // Purple
      background: '#1A0B2E',        // Deep Purple
      backgroundLight: '#2D1B4E',   // Dark Purple
      textGradientStart: '#F97316', // Orange
      textGradientEnd: '#EC4899'    // Pink
    }
  },
  {
    name: 'Forest Night',
    is_template: true,
    colors: {
      primary: '#10B981',           // Emerald
      accent: '#059669',            // Green
      background: '#0F1419',        // Almost Black
      backgroundLight: '#1A2F23',   // Dark Green
      textGradientStart: '#34D399', // Light Green
      textGradientEnd: '#059669'    // Green
    }
  }
];

async function seedThemes() {
  try {
    console.log('🎨 Starting theme seeding...');
    
    // Create themes table if it doesn't exist
    await Theme.createTable();
    console.log('✅ Themes table created/verified');
    
    // Check if themes already exist
    const existingThemes = await Theme.findAll();
    
    if (existingThemes.length > 0) {
      console.log(`⚠️  Found ${existingThemes.length} existing themes. Skipping seed.`);
      console.log('To reseed, delete all themes from the database first.');
      return;
    }
    
    // Insert theme templates
    for (const template of themeTemplates) {
      const theme = await Theme.create(template);
      
      // Set the first theme (ExtremeX Default) as active
      if (template.is_active) {
        await Theme.setActive(theme.id);
        console.log(`✅ Created and activated: ${theme.name}`);
      } else {
        console.log(`✅ Created template: ${theme.name}`);
      }
    }
    
    console.log('');
    console.log('🎉 Theme seeding completed successfully!');
    console.log(`📊 Total themes created: ${themeTemplates.length}`);
    console.log('🎨 Active theme: ExtremeX Default');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedThemes();
