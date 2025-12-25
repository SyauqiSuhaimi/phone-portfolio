"use client";

import contacts from "../../../data/contacts.json";

type ContactItem = {
  link: string;
  tooltip?: string;
};

const getLabel = (item: ContactItem) => {
  if (item.tooltip) {
    return item.tooltip;
  }

  if (item.link.startsWith("mailto:")) {
    return "Email";
  }

  try {
    const url = new URL(item.link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return item.link;
  }
};

const Contact = () => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-3">Contact</h2>
      <p className="text-os-text-muted mb-5">Get in touch!</p>
      <div className="flex flex-col gap-3">
        {(contacts as ContactItem[]).map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="text-sm font-semibold">{getLabel(item)}</div>
            <div className="text-xs text-os-text-muted break-all">
              {item.link}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
