import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  addIncidentComment,
  assignIncident,
  updateIncidentStatus,
  getIncidentActivities,
} from "../services/supportService";

import {
  createAIConversation,
  createIncidentLog,
  getAIConversationMessages,
  getIncidentAttachments,
  getIncidentContext,
  getIncidentLogs,
  askAI,
  uploadIncidentAttachment,
} from "../services/incidentService";

import {
  searchEmployees,
} from "../services/projectService";

import "./IncidentDetails.css";

const STATUSES = [
  "OPEN",
  "TRIAGED",
  "IN_PROGRESS",
  "WAITING_FOR_INFORMATION",
  "RESOLVED",
  "CLOSED",
  "REOPENED",
];

const LOG_TYPES = [
  "ERROR",
  "WARN",
  "INFO",
  "DEBUG",
  "TRACE",
];

function renderInlineMarkdown(text, keyPrefix = "inline") {
  const tokens = String(text ?? "").split(
    /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_)/g
  );

  return tokens.map((token, index) => {
    if (!token) {
      return null;
    }

    const key = `${keyPrefix}-${index}`;

    if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      return (
        <strong key={key}>
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={key} className="ai-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }

    if (
      token.startsWith("*") &&
      token.endsWith("*")
    ) {
      return (
        <em key={key}>
          {token.slice(1, -1)}
        </em>
      );
    }

    if (
      token.startsWith("_") &&
      token.endsWith("_")
    ) {
      return (
        <em key={key}>
          {token.slice(1, -1)}
        </em>
      );
    }

    return <span key={key}>{token}</span>;
  });
}

function renderMarkdown(text) {
  const lines = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  const blocks = [];
  let index = 0;
  let blockKey = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const codeLines = [];
      index += 1;

      while (
        index < lines.length &&
        !lines[index].trim().startsWith("```")
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push(
        <div className="ai-markdown-code-block" key={`block-${blockKey++}`}>
          {language && (
            <span className="ai-code-language">
              {language}
            </span>
          )}
          <pre>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 6);
      const Heading = `h${level}`;

      blocks.push(
        <Heading
          className="ai-markdown-heading"
          key={`block-${blockKey++}`}
        >
          {renderInlineMarkdown(
            headingMatch[2],
            `heading-${blockKey}`
          )}
        </Heading>
      );
      index += 1;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];

      while (
        index < lines.length &&
        /^\s*[-*+]\s+/.test(lines[index])
      ) {
        const item = lines[index]
          .replace(/^\s*[-*+]\s+/, "")
          .trim();

        items.push(
          <li key={`item-${blockKey}-${items.length}`}>
            {renderInlineMarkdown(
              item,
              `bullet-${blockKey}-${items.length}`
            )}
          </li>
        );

        index += 1;
      }

      blocks.push(
        <ul
          className="ai-markdown-list"
          key={`block-${blockKey++}`}
        >
          {items}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];

      while (
        index < lines.length &&
        /^\s*\d+[.)]\s+/.test(lines[index])
      ) {
        const item = lines[index]
          .replace(/^\s*\d+[.)]\s+/, "")
          .trim();

        items.push(
          <li key={`item-${blockKey}-${items.length}`}>
            {renderInlineMarkdown(
              item,
              `number-${blockKey}-${items.length}`
            )}
          </li>
        );

        index += 1;
      }

      blocks.push(
        <ol
          className="ai-markdown-list"
          key={`block-${blockKey++}`}
        >
          {items}
        </ol>
      );
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index];

      if (
        !nextLine.trim() ||
        nextLine.trim().startsWith("```") ||
        /^(#{1,6})\s+/.test(nextLine) ||
        /^\s*[-*+]\s+/.test(nextLine) ||
        /^\s*\d+[.)]\s+/.test(nextLine)
      ) {
        break;
      }

      paragraphLines.push(nextLine.trim());
      index += 1;
    }

    blocks.push(
      <p
        className="ai-markdown-paragraph"
        key={`block-${blockKey++}`}
      >
        {paragraphLines.map((paragraphLine, lineIndex) => (
          <span key={`line-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {renderInlineMarkdown(
              paragraphLine,
              `paragraph-${blockKey}-${lineIndex}`
            )}
          </span>
        ))}
      </p>
    );
  }

  return blocks;
}

export default function IncidentDetails() {
  const { supportRequestId } =
    useParams();

  const { user } = useAuth();

  const isAdmin =
    user?.authorities?.some(
      (authority) =>
        authority.authority === "ROLE_ADMIN"
    ) ?? false;

  const [context, setContext] =
    useState(null);

  const [logs, setLogs] = useState([]);
  const [attachments, setAttachments] =
    useState([]);
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [statusMessage, setStatusMessage] =
    useState("");

  const [resolutionSummary, setResolutionSummary] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [logForm, setLogForm] = useState({
    source: "APPLICATION",
    logType: "ERROR",
    fileName: "",
    content: "",
    environment: "",
    serviceName: "",
  });

  const [logFile, setLogFile] =
    useState(null);

  const [includeLogFileAttachment, setIncludeLogFileAttachment] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [employeeSearch, setEmployeeSearch] =
    useState("");

  const [employees, setEmployees] =
    useState([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const aiMessagesEndRef = useRef(null);

  const [loadingAIHistory, setLoadingAIHistory] =
    useState(false);

  const [question, setQuestion] =
    useState("");

  const [asking, setAsking] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadIncident = async () => {
      try {
        setLoading(true);
        setConversation(null);
        setMessages([]);
        setLoadingAIHistory(false);
        setError("");

        const [
          contextData,
          logsData,
          attachmentsData,
          activitiesData,
        ] = await Promise.all([
          getIncidentContext(supportRequestId),
          getIncidentLogs(supportRequestId),
          getIncidentAttachments(supportRequestId, isAdmin),
          getIncidentActivities(supportRequestId, isAdmin),
        ]);

        if (cancelled) {
          return;
        }

        setContext(contextData);
        setLogs(logsData);
        setAttachments(attachmentsData);
        setActivities(activitiesData);
        setStatus(contextData.status);
        setResolutionSummary("");
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load incident:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load incident."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadIncident();

    return () => {
      cancelled = true;
    };
  }, [supportRequestId, isAdmin]);

  useEffect(() => {
    if (!supportRequestId || !context) {
      return;
    }

    const storedId = localStorage.getItem(
      `resolveai-conversation-${supportRequestId}`
    );

    if (!storedId) {
      return;
    }

    let cancelled = false;

    const restoreConversation = async () => {
      try {
        setLoadingAIHistory(true);

        const conversationId = Number(storedId);

        if (!Number.isFinite(conversationId)) {
          localStorage.removeItem(
            `resolveai-conversation-${supportRequestId}`
          );
          return;
        }

        const existingMessages =
          await getAIConversationMessages(
            conversationId
          );

        if (cancelled) {
          return;
        }

        setConversation({ conversationId });
        setMessages(existingMessages);
      } catch (err) {
        if (!cancelled) {
          console.warn(
            "Unable to restore AI conversation:",
            err
          );

          localStorage.removeItem(
            `resolveai-conversation-${supportRequestId}`
          );
          setConversation(null);
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAIHistory(false);
        }
      }
    };

    restoreConversation();

    return () => {
      cancelled = true;
    };
  }, [supportRequestId, context]);

  useEffect(() => {
    if (!aiMessagesEndRef.current) {
      return;
    }

    aiMessagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, asking]);

  const refreshEvidence = async () => {
    const [
      logsData,
      attachmentsData,
      activitiesData,
    ] = await Promise.all([
      getIncidentLogs(
        supportRequestId
      ),
      getIncidentAttachments(
        supportRequestId,
        isAdmin
      ),
      getIncidentActivities(
        supportRequestId,
        isAdmin
      ),
    ]);

    setLogs(logsData);
    setAttachments(attachmentsData);
    setActivities(activitiesData);

    const contextData =
      await getIncidentContext(
        supportRequestId
      );

    setContext(contextData);
    setStatus(contextData.status);
  };

  const handleStatusUpdate =
    async () => {
      try {
        setSaving(true);
        setError("");

        await updateIncidentStatus(
          supportRequestId,
          {
            status,
            message: statusMessage,
            resolutionSummary,
          },
          isAdmin
        );

        setStatusMessage("");
        setResolutionSummary("");

        await refreshEvidence();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to update incident status."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleSearchEmployees =
    async () => {
      try {
        const result =
          await searchEmployees(
            employeeSearch
          );

        setEmployees(result);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to search employees."
        );
      }
    };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await assignIncident(
        supportRequestId,
        {
          userId:
            selectedEmployee.userId,
        },
        isAdmin
      );

      setSelectedEmployee(null);
      setEmployees([]);

      await refreshEvidence();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to assign incident."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async (
    event
  ) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setSaving(true);

      await addIncidentComment(
        supportRequestId,
        {
          message: comment.trim(),
        }
      );

      setComment("");

      await refreshEvidence();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogFileSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase();

    const supportedTextFiles = [
      "log",
      "txt",
      "json",
      "csv",
      "xml",
      "md",
    ];

    if (!supportedTextFiles.includes(extension)) {
      setError(
        "Only text-based evidence files can be imported into a log. Use the Attachments section for other file types."
      );
      event.target.value = "";
      return;
    }

    try {
      setError("");

      const content = await file.text();

      setLogFile(file);

      setLogForm((current) => ({
        ...current,
        fileName: file.name,
        content,
      }));
    } catch (err) {
      console.error("Unable to read log file:", err);
      setError("Unable to read the selected evidence file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleLogSubmit =
    async (event) => {
      event.preventDefault();

      if (!logForm.content.trim()) {
        setError("Log content is required.");
        return;
      }

      const projectId =
        context?.ProjectId ??
        context?.projectId ??
        context?.project?.projectId;

      if (!projectId) {
        setError(
          "The incident context does not contain a project ID, so the log cannot be saved."
        );
        return;
      }

      try {
        setSaving(true);

        await createIncidentLog({
          supportRequestId:
            Number(supportRequestId),
          projectId: Number(projectId),
          source: logForm.source,
          logType: logForm.logType,
          fileName:
            logForm.fileName || null,
          content: logForm.content.trim(),
          environment:
            logForm.environment ||
            context.environment ||
            null,
          serviceName:
            logForm.serviceName ||
            context.affectedService ||
            null,
        });

        if (
          includeLogFileAttachment &&
          logFile
        ) {
          try {
            await uploadIncidentAttachment(
              supportRequestId,
              logFile
            );
          } catch {
            setError(
              "Log evidence was saved, but the file could not be saved as an attachment. You can upload it separately below."
            );
          }
        }

        setLogFile(null);
        setIncludeLogFileAttachment(false);

        setLogForm({
          source: "APPLICATION",
          logType: "ERROR",
          fileName: "",
          content: "",
          environment: "",
          serviceName: "",
        });

        await refreshEvidence();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to add incident log."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleFileUpload =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setUploading(true);
        setError("");

        await uploadIncidentAttachment(
          supportRequestId,
          file
        );

        await refreshEvidence();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to upload attachment."
        );
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };

  const ensureConversation =
    async () => {
      if (conversation) {
        return conversation;
      }

      const storedId =
        localStorage.getItem(
          `resolveai-conversation-${supportRequestId}`
        );

      if (storedId) {
        try {
          const conversationId = Number(storedId);

          if (!Number.isFinite(conversationId)) {
            throw new Error("Invalid stored AI conversation.");
          }

          const existingMessages =
            await getAIConversationMessages(
              conversationId
            );

          const existing = { conversationId };

          setConversation(existing);
          setMessages(existingMessages);

          return existing;
        } catch {
          localStorage.removeItem(
            `resolveai-conversation-${supportRequestId}`
          );
        }
      }

      const created =
        await createAIConversation(
          Number(supportRequestId),
          `Investigation - ${context.ticketNumber}`
        );

      localStorage.setItem(
        `resolveai-conversation-${supportRequestId}`,
        String(created.conversationId)
      );

      setConversation(created);
      setMessages([]);

      return created;
    };

  const sendAIQuestion = async (questionText) => {
    const currentQuestion = questionText.trim();

    if (!currentQuestion) {
      setError("Enter a question for ResolveAI first.");
      return;
    }

    try {
      setAsking(true);
      setError("");

      const activeConversation =
        await ensureConversation();

      setQuestion("");

      const temporaryUserMessage = {
        id: `user-${Date.now()}`,
        role: "USER",
        content: currentQuestion,
      };

      setMessages((current) => [
        ...current,
        temporaryUserMessage,
      ]);

      const response =
        await askAI(
          activeConversation.conversationId,
          currentQuestion
        );

      const responseContent =
        typeof response === "string"
          ? response
          : response?.content ??
            response?.message ??
            "ResolveAI returned an empty response.";

      // Show the answer immediately even if the history refresh is delayed.
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "ASSISTANT",
          content: responseContent,
        },
      ]);

      try {
        const updatedMessages =
          await getAIConversationMessages(
            activeConversation.conversationId
          );

        setMessages(updatedMessages);
      } catch (historyError) {
        console.warn(
          "AI responded, but conversation history could not be refreshed:",
          historyError
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Unable to get an AI response."
      );
    } finally {
      setAsking(false);
    }
  };

  const handleAskAI = async (event) => {
    event.preventDefault();
    await sendAIQuestion(question);
  };

  const handleQuickAIQuestion = async (prompt) => {
    if (asking) {
      return;
    }

    await sendAIQuestion(prompt);
  };

  if (loading) {
    return (
      <div className="incident-loading">
        <div className="project-details-spinner" />
        <span>Loading incident...</span>
      </div>
    );
  }

  if (error && !context) {
    return (
      <div className="project-details-error">
        <AlertCircle size={22} />

        <h2>
          Unable to load incident
        </h2>

        <p>{error}</p>

        <Link
          to="/support"
          className="back-project-button"
        >
          <ArrowLeft size={15} />
          Back to support
        </Link>
      </div>
    );
  }

  return (
    <div className="incident-page">

      <Link
        to="/support"
        className="project-back-link"
      >
        <ArrowLeft size={15} />
        Support requests
      </Link>

      <section className="incident-header">

        <div>
          <div className="incident-eyebrow">
            {context.ticketNumber}
          </div>

          <h1>
            {context.incidentTitle}
          </h1>

          <p>
            {context.projectCode} ·{" "}
            {context.projectName}
          </p>
        </div>

        <div className="incident-header-meta">
          <span
            className={`incident-badge incident-${String(
              context.severity
            ).toLowerCase()}`}
          >
            {context.severity}
          </span>

          <span className="incident-status-badge">
            {context.status}
          </span>
        </div>

      </section>

      {error && (
        <div className="incident-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <section className="incident-grid">

        <div className="incident-main">

          <section className="incident-panel">

            <div className="incident-panel-header">
              <div>
                <h2>Incident information</h2>
                <p>
                  Technical context stored for this incident.
                </p>
              </div>
            </div>

            <div className="incident-details-grid">

              <div>
                <span>Type</span>
                <strong>
                  {context.incidentType}
                </strong>
              </div>

              <div>
                <span>Environment</span>
                <strong>
                  {context.environment ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Affected service</span>
                <strong>
                  {context.affectedService ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Affected version</span>
                <strong>
                  {context.affectedVersion ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Error code</span>
                <strong>
                  {context.errorCode ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            <div className="incident-description-block">

              <span>Description</span>

              <p>
                {context.incidentDescription ||
                  "No description provided."}
              </p>

            </div>

            <div className="incident-behavior-grid">

              <div>
                <span>Expected behavior</span>
                <p>
                  {context.expectedBehavior ||
                    "Not provided."}
                </p>
              </div>

              <div>
                <span>Actual behavior</span>
                <p>
                  {context.actualBehavior ||
                    "Not provided."}
                </p>
              </div>

            </div>

          </section>

          <section className="incident-panel">

            <div className="incident-panel-header">
              <div>
                <h2>Logs</h2>
                <p>
                  Console and application evidence.
                </p>
              </div>

              <FileText size={17} />
            </div>

            <div className="evidence-help">
              <strong>What is a log evidence record?</strong>
              <span>
                A log record stores text that helps the investigation: its source,
                severity/level, optional file name, environment and service.
                It is different from an attachment, which stores the original file.
              </span>
            </div>

            <form
              className="incident-evidence-form"
              onSubmit={handleLogSubmit}
            >

              <div className="incident-form-row">

                <select
                  value={logForm.source}
                  onChange={(event) =>
                    setLogForm((current) => ({
                      ...current,
                      source: event.target.value,
                    }))
                  }
                >
                  <option value="APPLICATION">Application</option>
                  <option value="CONSOLE">Console</option>
                </select>

                <select
                  value={logForm.logType}
                  onChange={(event) =>
                    setLogForm((current) => ({
                      ...current,
                      logType: event.target.value,
                    }))
                  }
                >
                  {LOG_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  value={logForm.fileName}
                  onChange={(event) =>
                    setLogForm((current) => ({
                      ...current,
                      fileName: event.target.value,
                    }))
                  }
                  placeholder="File name (optional)"
                />

              </div>

              <div className="evidence-file-row">
                <label className="evidence-file-button">
                  <FileText size={14} />
                  Import text log
                  <input
                    type="file"
                    accept=".log,.txt,.json,.csv,.xml,.md,text/plain,application/json,text/csv,application/xml,text/markdown"
                    onChange={handleLogFileSelect}
                    hidden
                  />
                </label>

                <span>
                  {logFile
                    ? `${logFile.name} loaded into the log form`
                    : "Loads a text file into the content field"}
                </span>
              </div>

              {logFile && (
                <label className="evidence-attachment-option">
                  <input
                    type="checkbox"
                    checked={includeLogFileAttachment}
                    onChange={(event) =>
                      setIncludeLogFileAttachment(
                        event.target.checked
                      )
                    }
                  />
                  Also save this file in Attachments
                </label>
              )}

              <textarea
                value={logForm.content}
                onChange={(event) =>
                  setLogForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                placeholder="Paste console output or application log content here..."
                rows={7}
                required
              />

              <div className="incident-form-row">

                <input
                  value={logForm.environment}
                  onChange={(event) =>
                    setLogForm((current) => ({
                      ...current,
                      environment: event.target.value,
                    }))
                  }
                  placeholder={
                    context.environment || "Environment"
                  }
                />

                <input
                  value={logForm.serviceName}
                  onChange={(event) =>
                    setLogForm((current) => ({
                      ...current,
                      serviceName: event.target.value,
                    }))
                  }
                  placeholder={
                    context.affectedService || "Service name"
                  }
                />

                <button
                  className="incident-action-button"
                  type="submit"
                  disabled={saving}
                >
                  <Send size={14} />
                  {saving ? "Saving..." : "Save log evidence"}
                </button>

              </div>

            </form>
            {logs.length ? (
              <div className="evidence-list">

                {logs.map(
                  (log) => (
                    <div
                      className="evidence-item"
                      key={log.id}
                    >

                      <div className="evidence-item-header">

                        <strong>
                          {log.logType}
                        </strong>

                        <span>
                          {log.source}
                        </span>

                      </div>

                      <div className="evidence-meta">
                        {log.fileName ||
                          "No file name"}
                        {" · "}
                        {log.serviceName ||
                          "No service"}
                        {" · "}
                        {log.environment ||
                          "No environment"}
                      </div>

                      <pre>
                        {log.content}
                      </pre>

                      <button
                        type="button"
                        className="evidence-ai-button"
                        onClick={() => {
                          const logLabel =
                            log.fileName ||
                            `${log.source} ${log.logType} log`;

                          setQuestion(
                            `Analyze this specific log evidence (${logLabel}) and explain what it indicates, what is confirmed versus suspected, and what I should investigate next.\n\nLog content:\n${log.content || "No log content available."}`
                          );

                          document
                            .querySelector(".ai-question-form textarea")
                            ?.focus();
                        }}
                        disabled={asking}
                      >
                        <Sparkles size={12} />
                        Ask ResolveAI about this log
                      </button>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="incident-empty">
                No logs have been added yet.
              </div>
            )}

          </section>

          <section className="incident-panel">

            <div className="incident-panel-header">
              <div>
                <h2>Attachments</h2>
                <p>
                  Original files stored as incident evidence. These are separate from text log records.
                </p>
              </div>

              <label className="upload-button">
                <Upload size={14} />
                {uploading
                  ? "Uploading..."
                  : "Upload file"}

                <input
                  type="file"
                  onChange={
                    handleFileUpload
                  }
                  disabled={uploading}
                  hidden
                />
              </label>

            </div>

            {attachments.length ? (
              <div className="attachment-list">

                {attachments.map(
                  (attachment) => (
                    <div
                      className="attachment-item"
                      key={attachment.id}
                    >

                      <Paperclip size={15} />

                      <div>
                        <strong>
                          {attachment.fileName}
                        </strong>

                        <span>
                          {attachment.contentType}
                          {" · "}
                          {attachment.fileSize} bytes
                        </span>
                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="incident-empty">
                No attachments uploaded yet.
              </div>
            )}

          </section>

          <section className="incident-panel">

            <div className="incident-panel-header">
              <div>
                <h2>Activity</h2>
                <p>
                  Changes and comments recorded for this incident.
                </p>
              </div>

              <MessageSquare size={17} />
            </div>

            <form
              className="comment-form"
              onSubmit={handleComment}
            >

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                placeholder="Add a comment..."
                rows={3}
              />

              <button
                className="incident-action-button"
                type="submit"
                disabled={
                  saving ||
                  !comment.trim()
                }
              >
                <MessageSquare size={14} />
                Add comment
              </button>

            </form>

            {activities.length ? (
              <div className="activity-list">

                {activities.map(
                  (activity) => (
                    <div
                      className="activity-item"
                      key={activity.id}
                    >

                      <div className="activity-dot" />

                      <div>

                        <div className="activity-top">
                          <strong>
                            {activity.actorUsername}
                          </strong>

                          <span>
                            {activity.activityType}
                          </span>
                        </div>

                        <p>
                          {activity.message ||
                            "No message."}
                        </p>

                        <small>
                          {activity.createdAt}
                        </small>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="incident-empty">
                No activity recorded yet.
              </div>
            )}

          </section>

        </div>

        <aside className="incident-sidebar">

          <section className="incident-panel">

            <div className="incident-panel-header">
              <div>
                <h2>Incident control</h2>
                <p>
                  Status and assignment
                </p>
              </div>
            </div>

            <div className="incident-control">

              <label>Status</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                {STATUSES.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value.replaceAll(
                        "_",
                        " "
                      )}
                    </option>
                  )
                )}
              </select>

              <textarea
                value={statusMessage}
                onChange={(event) =>
                  setStatusMessage(
                    event.target.value
                  )
                }
                placeholder="Optional status message"
                rows={3}
              />

              {(status === "RESOLVED" ||
                status === "CLOSED") && (
                <textarea
                  value={
                    resolutionSummary
                  }
                  onChange={(event) =>
                    setResolutionSummary(
                      event.target.value
                    )
                  }
                  placeholder="Resolution summary"
                  rows={4}
                />
              )}

              <button
                className="incident-action-button"
                onClick={
                  handleStatusUpdate
                }
                disabled={saving}
              >
                <CheckCircle2 size={14} />
                Update status
              </button>

            </div>

            <div className="incident-assignment">

              <label>Assign to employee</label>

              <div className="incident-form-row">

                <input
                  value={employeeSearch}
                  onChange={(event) =>
                    setEmployeeSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search employee"
                />

                <button
                  type="button"
                  className="panel-small-button"
                  onClick={
                    handleSearchEmployees
                  }
                >
                  <Search size={13} />
                </button>

              </div>

              {employees.length > 0 && (
                <div className="incident-employee-results">

                  {employees.map(
                    (employee) => (
                      <button
                        key={employee.userId}
                        type="button"
                        className={`incident-employee ${
                          selectedEmployee?.userId ===
                          employee.userId
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedEmployee(
                            employee
                          )
                        }
                      >
                        <strong>
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </strong>

                        <span>
                          @{employee.username}
                        </span>
                      </button>
                    )
                  )}

                </div>
              )}

              {selectedEmployee && (
                <button
                  className="incident-action-button"
                  onClick={handleAssign}
                  disabled={saving}
                >
                  Assign to{" "}
                  {selectedEmployee.username}
                </button>
              )}

            </div>

          </section>

          <section className="incident-panel ai-investigation-panel">

            <div className="incident-panel-header">
              <div>
                <h2>AI investigation</h2>
                <p>
                  ResolveAI analyzes the complete incident context with local Ollama.
                </p>
              </div>

              <Bot size={17} />
            </div>

            <div className="ai-investigation-body">

              <div className="ai-context-card">
                <div className="ai-context-card-header">
                  <div>
                    <strong>Investigation context</strong>
                    <span>What ResolveAI can use for this incident</span>
                  </div>

                  <span className="ai-ready-badge">Ready</span>
                </div>

                <div className="ai-context-grid">
                  <div>
                    <strong>{context.projectName || "Project"}</strong>
                    <span>Project</span>
                  </div>
                  <div>
                    <strong>{logs.length}</strong>
                    <span>Log records</span>
                  </div>
                  <div>
                    <strong>{attachments.length}</strong>
                    <span>Attachments</span>
                  </div>
                  <div>
                    <strong>{activities.length}</strong>
                    <span>Activities</span>
                  </div>
                </div>

                <div className="ai-context-note">
                  Project details, technologies, services, incident information, logs, attachments, activity history and previous AI messages are sent to the AI service when you ask a question.
                </div>
              </div>

              <div className="ai-quick-actions">
                <div className="ai-quick-title">
                  <Sparkles size={13} />
                  Quick investigation
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAIQuestion(
                      "Analyze this incident and identify the most likely root causes. Separate confirmed facts from hypotheses and explain which evidence supports each hypothesis."
                    )
                  }
                  disabled={asking}
                >
                  Analyze root cause
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAIQuestion(
                      "Review the available incident logs, attachments, activities, project services and incident details. Summarize the strongest evidence and tell me what I should investigate next."
                    )
                  }
                  disabled={asking}
                >
                  Review evidence
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAIQuestion(
                      "Give me a practical troubleshooting plan for this incident. Prioritize the checks that are most likely to confirm or eliminate the suspected causes."
                    )
                  }
                  disabled={asking}
                >
                  Troubleshooting plan
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="ai-empty">
                  <Bot size={22} />

                  <strong>
                    Ready to investigate
                  </strong>

                  <span>
                    Ask a question or use one of the quick investigations above. The first question creates the AI conversation automatically.
                  </span>

                  <small className="ai-runtime-note">
                    Provider: local Ollama · qwen2.5:7b
                  </small>
                </div>
              ) : (
                <div className="ai-messages">

                  {messages.map(
                    (message, index) => (
                      <div
                        key={
                          message.id ??
                          `${message.role}-${index}`
                        }
                        className={`ai-message ai-message-${String(
                          message.role
                        ).toLowerCase()}`}
                      >

                        <div className="ai-message-header">
                          <span className="ai-message-role">
                            {message.role === "ASSISTANT"
                              ? "RESOLVEAI"
                              : "YOU"}
                          </span>
                        </div>

                        <div className="ai-message-content">
                          {renderMarkdown(message.content)}
                        </div>

                      </div>
                    )
                  )}

                  <div ref={aiMessagesEndRef} />

                </div>
              )}

              {conversation && !loadingAIHistory && (
                <div className="ai-conversation-status">
                  <span>
                    Conversation active · history saved
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem(
                        `resolveai-conversation-${supportRequestId}`
                      );
                      setConversation(null);
                      setMessages([]);
                    }}
                  >
                    Start new investigation
                  </button>
                </div>
              )}

              <form
                className="ai-question-form"
                onSubmit={handleAskAI}
              >

                <textarea
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value
                    )
                  }
                  placeholder="Ask ResolveAI about the likely cause, evidence, next checks, or fix..."
                  rows={4}
                  disabled={asking}
                />

                <div className="ai-question-footer">
                  <span>
                    {asking
                      ? "Ollama is investigating the incident..."
                      : "Your question is analyzed with the current incident context."}
                  </span>

                  <button
                    className="incident-action-button"
                    type="submit"
                    disabled={asking || !question.trim()}
                  >
                    <Bot size={14} />

                    {asking
                      ? "Investigating..."
                      : "Ask ResolveAI"}
                  </button>
                </div>

              </form>

            </div>

          </section>

        </aside>

      </section>

    </div>
  );
}