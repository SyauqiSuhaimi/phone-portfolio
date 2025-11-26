import React from 'react';

const Skills = () => {
  const skills = [
    { name: 'JavaScript', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'CSS', icon: '🎨' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Git', icon: '📦' },
    { name: 'Docker', icon: '🐳' },
  ];

  return (
    <div className="text-white p-0">
      <h2 className="text-2xl font-bold mb-5">Technical Skills</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="bg-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/20 transition-colors"
          >
            <div className="text-4xl">{skill.icon}</div>
            <span className="text-sm font-medium text-center">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
