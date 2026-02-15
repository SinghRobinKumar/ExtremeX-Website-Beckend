import Theme from '../models/themeModel.js';

async function updateThemeColors() {
  try {
    console.log('🎨 Updating theme colors to orange accent...');
    
    // Get the active theme
    const activeTheme = await Theme.findActive();
    
    if (!activeTheme) {
      console.log('❌ No active theme found!');
      process.exit(1);
    }
    
    console.log(`✅ Found active theme: ${activeTheme.name} (ID: ${activeTheme.id})`);
    
    // Update with new colors
    const updatedColors = {
      primary: '#71DAF2',           // Neon Ice Blue
      accent: '#FF6B35',            // Deep Orange
      background: '#000000',        // Black
      backgroundLight: '#2E3045',   // Deep Midnight Blue
      textGradientStart: '#FF6B35', // Deep Orange
      textGradientEnd: '#71DAF2'    // Neon Ice Blue
    };
    
    const updated = await Theme.update(activeTheme.id, {
      name: activeTheme.name,
      colors: updatedColors
    });
    
    console.log('✅ Theme colors updated successfully!');
    console.log('🎨 New colors:', updatedColors);
    console.log('');
    console.log('🔄 Please refresh your browser to see the changes!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating theme:', error);
    process.exit(1);
  }
}

// Run the update function
updateThemeColors();
