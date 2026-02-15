import db from '../config/db.js';
import Project from '../models/projectModel.js';
import TeamMember from '../models/teamModel.js';

async function setupDatabase() {
  try {
    console.log('Creating tables...');
    
    // Create tables
    await Project.createTable();
    await TeamMember.createTable();
    
    console.log('Tables created successfully!');
    
    // Check if data exists
    const projectsResult = await db.query('SELECT COUNT(*) FROM projects');
    const teamResult = await db.query('SELECT COUNT(*) FROM team_members');
    
    const projectCount = parseInt(projectsResult.rows[0].count);
    const teamCount = parseInt(teamResult.rows[0].count);
    
    // Seed projects if empty
    if (projectCount === 0) {
      console.log('Seeding sample projects...');
      
      const sampleProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'A modern, scalable e-commerce solution built with Next.js and PostgreSQL',
          image_url: '/placeholder.png',
          live_url: 'https://example-ecommerce.com',
          technologies: ['Next.js', 'React', 'PostgreSQL', 'Tailwind CSS'],
          featured: true,
          status: 'published',
          display_order: 1
        },
        {
          title: 'Real-time Chat Application',
          description: 'WebSocket-based chat application with real-time messaging and notifications',
          image_url: '/placeholder.png',
          live_url: 'https://example-chat.com',
          technologies: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
          featured: true,
          status: 'published',
          display_order: 2
        },
        {
          title: 'Analytics Dashboard',
          description: 'Beautiful data visualization dashboard for business analytics',
          image_url: '/placeholder.png',
          live_url: 'https://example-analytics.com',
          technologies: ['React', 'D3.js', 'Express', 'PostgreSQL'],
          featured: false,
          status: 'published',
          display_order: 3
        }
      ];
      
      for (const project of sampleProjects) {
        await Project.create(project);
      }
      
      console.log(`Seeded ${sampleProjects.length} sample projects!`);
    }
    
    // Seed team members if empty
    if (teamCount === 0) {
      console.log('Seeding sample team members...');
      
      const sampleTeam = [
        {
          name: 'Alex Johnson',
          role: 'CEO & Founder',
          bio: 'Visionary leader with 15+ years of experience in tech innovation',
          image_url: '/placeholder.png',
          social_links: {
            linkedin: 'https://linkedin.com/in/alexjohnson',
            twitter: 'https://twitter.com/alexjohnson',
            github: 'https://github.com/alexjohnson'
          },
          display_order: 1
        },
        {
          name: 'Sarah Williams',
          role: 'CTO',
          bio: 'Technical expert specializing in scalable architecture and cloud solutions',
          image_url: '/placeholder.png',
          social_links: {
            linkedin: 'https://linkedin.com/in/sarahwilliams',
            github: 'https://github.com/sarahwilliams'
          },
          display_order: 2
        },
        {
          name: 'Michael Chen',
          role: 'Lead Developer',
          bio: 'Full-stack developer passionate about creating elegant solutions',
          image_url: '/placeholder.png',
          social_links: {
            linkedin: 'https://linkedin.com/in/michaelchen',
            github: 'https://github.com/michaelchen',
            twitter: 'https://twitter.com/michaelchen'
          },
          display_order: 3
        },
        {
          name: 'Emily Rodriguez',
          role: 'UI/UX Designer',
          bio: 'Creative designer focused on user-centered design and modern aesthetics',
          image_url: '/placeholder.png',
          social_links: {
            linkedin: 'https://linkedin.com/in/emilyrodriguez',
            twitter: 'https://twitter.com/emilyrodriguez'
          },
          display_order: 4
        }
      ];
      
      for (const member of sampleTeam) {
        await TeamMember.create(member);
      }
      
      console.log(`Seeded ${sampleTeam.length} sample team members!`);
    }
    
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
