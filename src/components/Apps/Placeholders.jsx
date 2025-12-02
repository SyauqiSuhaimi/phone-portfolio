import React from 'react';

export const Gallery = () => (
  <div className="text-white">
    <h2 className="text-2xl font-bold mb-3">Gallery</h2>
    <p className="text-os-text-muted mb-5">Photos and memories.</p>
    <div className="grid grid-cols-2 gap-2.5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-square bg-white/10 rounded-xl" />
      ))}
    </div>
  </div>
);

export const Contact = () => (
  <div className="text-white">
    <h2 className="text-2xl font-bold mb-3">Contact Me</h2>
    <p className="text-os-text-muted mb-5">Get in touch!</p>
    <div className="flex flex-col gap-3">
      <div className="bg-white/5 p-3 rounded-lg">📧 email@example.com</div>
      <div className="bg-white/5 p-3 rounded-lg">🐦 @twitterhandle</div>
      <div className="bg-white/5 p-3 rounded-lg">💼 LinkedIn Profile</div>
    </div>
  </div>
);


