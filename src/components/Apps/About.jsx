import React from 'react';

const About = () => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-3">Hello, I'm [User Name]</h2>
      <p className="text-os-text-muted mb-5">I'm a creative developer building immersive web experiences.</p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Bio</h3>
        <p className="text-sm text-os-text-muted">Passionate about UI/UX, React, and building things that live on the web.</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">System Log (Career History)</h3>
        <div className="flex flex-col gap-3">
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs text-green-400">v3.0.0</span>
              <span className="text-xs text-os-text-muted">2022 - Present</span>
            </div>
            <p className="text-sm">Senior Developer @ Tech Corp. Optimized core rendering engine.</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs text-blue-400">v2.1.0</span>
              <span className="text-xs text-os-text-muted">2020 - 2022</span>
            </div>
            <p className="text-sm">Frontend Engineer @ Startup Inc. Launched mobile app.</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs text-purple-400">v1.0.0</span>
              <span className="text-xs text-os-text-muted">2018 - 2020</span>
            </div>
            <p className="text-sm">Junior Dev. Initial release.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
