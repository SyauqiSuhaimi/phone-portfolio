import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack shopping experience built with Next.js and Stripe.',
      tags: ['React', 'Node.js', 'Stripe'],
      color: '#007AFF'
    },
    {
      id: 2,
      title: 'AI Dashboard',
      description: 'Analytics dashboard powered by machine learning models.',
      tags: ['Python', 'TensorFlow', 'React'],
      color: '#5856D6'
    },
    {
      id: 3,
      title: 'Social Media App',
      description: 'Real-time chat and feed application.',
      tags: ['Firebase', 'React Native'],
      color: '#FF2D55'
    }
  ];

  return (
    <div className="text-white pb-10">
      <h2 className="text-2xl font-bold mb-5">My Work</h2>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white/5 rounded-2xl p-4 flex gap-4 cursor-pointer active:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: project.color }} />
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">{project.title}</h3>
              <p className="text-sm text-os-text-muted mb-2 leading-relaxed">{project.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-full text-os-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
