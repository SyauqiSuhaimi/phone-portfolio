import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FieldType = "text" | "selection" | "file" | "datepicker";

type DemoField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

type DemoFileValue = {
  name: string;
  type: string;
  dataUrl: string;
};

const SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;

const makeField = (type: FieldType, index: number): DemoField => {
  const base = `${type}-${index}`;
  if (type === "text") {
    return { id: base, type, label: `Text Field ${index}`, required: true };
  }
  if (type === "selection") {
    return {
      id: base,
      type,
      label: `Selection ${index}`,
      required: true,
      options: ["Option 1", "Option 2"],
    };
  }
  if (type === "file") {
    return { id: base, type, label: `Attachment ${index}`, required: false };
  }
  return { id: base, type, label: `Date ${index}`, required: false };
};

export const FormBuilderFlowDemo = () => {
  const [stage, setStage] = useState<"builder" | "submission" | "answer">(
    "builder",
  );
  const [fields, setFields] = useState<DemoField[]>([
    { id: "f-1", label: "Applicant Name", type: "text", required: true },
    {
      id: "f-2",
      label: "Request Type",
      type: "selection",
      required: true,
      options: ["New", "Update", "Cancel"],
    },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fileAnswers, setFileAnswers] = useState<Record<string, DemoFileValue>>(
    {},
  );
  const [optionDrafts, setOptionDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required),
    [fields],
  );

  const addField = (type: FieldType) => {
    setFields((prev) => [...prev, makeField(type, prev.length + 1)]);
    setNotice("");
  };

  const toggleRequired = (id: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field,
      ),
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((field) => field.id !== id);
    });

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setFileAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setOptionDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setError("");
    setNotice("");
  };

  const addSelectionOption = (fieldId: string) => {
    const next = String(optionDrafts[fieldId] ?? "").trim();
    if (!next) return;

    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId || field.type !== "selection") return field;
        const existing = field.options ?? [];
        if (existing.includes(next)) return field;
        return { ...field, options: [...existing, next] };
      }),
    );

    setOptionDrafts((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const removeSelectionOption = (fieldId: string, option: string) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId || field.type !== "selection") return field;
        const nextOptions = (field.options ?? []).filter((o) => o !== option);
        return { ...field, options: nextOptions };
      }),
    );

    setAnswers((prev) => {
      if (prev[fieldId] === option) {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      }
      return prev;
    });
  };

  const handleImageChange = (fieldId: string, file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (!dataUrl) return;
      setFileAnswers((prev) => ({
        ...prev,
        [fieldId]: {
          name: file.name,
          type: file.type,
          dataUrl,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDraft = () => {
    setNotice("Draft saved (mirrors FormSubmission draft flow).");
    setError("");
  };

  const handleSubmit = () => {
    const missing = requiredFields.filter((field) => {
      if (field.type === "file") {
        return !fileAnswers[field.id]?.dataUrl;
      }
      return !String(answers[field.id] ?? "").trim();
    });

    if (missing.length > 0) {
      setError(
        `Missing required: ${missing.map((field) => field.label).join(", ")}`,
      );
      setNotice("");
      return;
    }

    setError("");
    setNotice("");
    setStage("answer");
  };

  const handleReset = () => {
    setStage("builder");
    setAnswers({});
    setFileAnswers({});
    setError("");
    setNotice("");
  };

  return (
    <div className="w-full h-full p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="h-10 px-3 flex items-center justify-between border-b border-black/10 dark:border-white/10 text-xs">
          <div className="font-semibold">DocFlowPortal Flow</div>
          <div className="opacity-70">
            FormBuilder -&gt; FormSubmission -&gt; FormAnswer
          </div>
        </div>

        <div className="h-[calc(100%-2.5rem)] p-3">
          <AnimatePresence mode="wait">
            {stage === "builder" && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={SPRING}
                className="h-full flex flex-col"
              >
                <p className="text-xs mb-2 text-zinc-600 dark:text-zinc-300">
                  FormBuilder: add fields and configure required rules.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => addField("text")}
                    className="text-[11px] px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  >
                    + Text
                  </button>
                  <button
                    type="button"
                    onClick={() => addField("selection")}
                    className="text-[11px] px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    + Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => addField("file")}
                    className="text-[11px] px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  >
                    + File
                  </button>
                  <button
                    type="button"
                    onClick={() => addField("datepicker")}
                    className="text-[11px] px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    + Date
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-medium">{field.label}</div>
                          <div className="opacity-70 uppercase">
                            {field.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleRequired(field.id)}
                            className={`px-2 py-1 rounded ${
                              field.required
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {field.required ? "Required" : "Optional"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            disabled={fields.length <= 1}
                            className="px-2 py-1 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {field.type === "selection" ? (
                        <div className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs">
                          <div className="font-medium mb-1">Options</div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {(field.options ?? []).map((opt) => (
                              <span
                                key={opt}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
                              >
                                {opt}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSelectionOption(field.id, opt)
                                  }
                                  className="text-[10px] opacity-70 hover:opacity-100"
                                >
                                  x
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1.5">
                            <input
                              value={optionDrafts[field.id] ?? ""}
                              onChange={(event) =>
                                setOptionDrafts((prev) => ({
                                  ...prev,
                                  [field.id]: event.target.value,
                                }))
                              }
                              placeholder="Add option"
                              className="flex-1 text-xs px-2 py-1.5 rounded border border-black/15 dark:border-white/15 bg-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addSelectionOption(field.id)}
                              className="text-xs px-2 py-1.5 rounded bg-black text-white dark:bg-white dark:text-black"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setStage("submission")}
                    className="w-full text-xs px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
                  >
                    Preview In FormSubmission
                  </button>
                </div>
              </motion.div>
            )}

            {stage === "submission" && (
              <motion.div
                key="submission"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={SPRING}
                className="h-full flex flex-col"
              >
                <p className="text-xs mb-2 text-zinc-600 dark:text-zinc-300">
                  FormSubmission: required validation + draft/save flow.
                </p>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-xs font-medium">
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>

                      {field.type === "selection" ? (
                        <select
                          value={answers[field.id] ?? ""}
                          onChange={(event) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [field.id]: event.target.value,
                            }))
                          }
                          className="w-full text-xs px-2 py-1.5 rounded border border-black/15 dark:border-white/15 bg-transparent"
                        >
                          <option value="">Select an option</option>
                          {(field.options ?? []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "file" ? (
                        <div className="space-y-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              handleImageChange(
                                field.id,
                                event.target.files?.[0],
                              )
                            }
                            className="w-full text-xs"
                          />
                          {fileAnswers[field.id] ? (
                            <div className="text-[11px] opacity-75">
                              Selected: {fileAnswers[field.id].name}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <input
                          value={answers[field.id] ?? ""}
                          onChange={(event) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [field.id]: event.target.value,
                            }))
                          }
                          placeholder={`Demo ${field.type} value`}
                          className="w-full text-xs px-2 py-1.5 rounded border border-black/15 dark:border-white/15 bg-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {error ? (
                  <div className="mt-2 text-[11px] px-2 py-1.5 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {error}
                  </div>
                ) : null}
                {notice ? (
                  <div className="mt-2 text-[11px] px-2 py-1.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {notice}
                  </div>
                ) : null}

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStage("builder")}
                    className="flex-1 text-xs px-3 py-2 rounded border border-black/20 dark:border-white/20"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex-1 text-xs px-3 py-2 rounded border border-black/20 dark:border-white/20"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 text-xs px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}

            {stage === "answer" && (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={SPRING}
                className="h-full flex flex-col"
              >
                <p className="text-xs mb-2 text-zinc-600 dark:text-zinc-300">
                  FormAnswer: read-only response view with document actions.
                </p>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2"
                    >
                      <div className="text-[11px] opacity-70">
                        {field.label}
                      </div>
                      {field.type === "file" ? (
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <div className="text-xs font-medium">
                            {fileAnswers[field.id]?.name || "(no image)"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs font-medium mt-0.5">
                          {answers[field.id]?.trim() || "(empty)"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full text-xs px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
                  >
                    Build Another Form
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
