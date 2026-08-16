const createIcon = (kind) => {
  return function ResolveAIIcon({ size = 18, strokeWidth = 1.8, ...props }) {
    const common = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      ...props,
    };

    switch (kind) {
      case "arrow":
        return (
          <svg {...common}>
            <path d="M5 12h13" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
            <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "bot":
        return (
          <svg {...common}>
            <rect x="5" y="7" width="14" height="12" rx="3" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M12 4v3M8.5 12h.01M15.5 12h.01M9 16h6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </svg>
        );
      case "check":
        return (
          <svg {...common}>
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "chevron":
        return (
          <svg {...common}>
            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "dot":
        return (
          <svg {...common}>
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={strokeWidth} />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        );
      case "database":
        return (
          <svg {...common}>
            <ellipse cx="12" cy="5.5" rx="7" ry="3" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M5 5.5v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7M5 12.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth={strokeWidth} />
          </svg>
        );
      case "file":
        return (
          <svg {...common}>
            <path d="M7 3.5h7l4 4V20.5H7z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </svg>
        );
      case "lock":
        return (
          <svg {...common}>
            <rect x="5.5" y="10" width="13" height="10" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </svg>
        );
      case "message":
        return (
          <svg {...common}>
            <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-4.5 4v-4.5A3.5 3.5 0 0 1 5 11.5z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          </svg>
        );
      case "network":
        return (
          <svg {...common}>
            <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <circle cx="12" cy="18" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="m8 7.5 2.5 8M16 7.5l-2.5 8M8.5 6h7" stroke="currentColor" strokeWidth={strokeWidth} />
          </svg>
        );
      case "server":
        return (
          <svg {...common}>
            <rect x="4" y="4.5" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <rect x="4" y="13.5" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M7.5 7.5h.01M7.5 16.5h.01M11 7.5h5M11 16.5h5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </svg>
        );
      case "shield":
        return (
          <svg {...common}>
            <path d="M12 3.5 19 6v5.5c0 4.2-2.6 7.5-7 9-4.4-1.5-7-4.8-7-9V6z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "workflow":
        return (
          <svg {...common}>
            <rect x="4" y="5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
            <rect x="14" y="14" width="6" height="5" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M10 7.5h4M14 7.5v6.5M14 14.5h-4M10 14.5V11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };
};

const ArrowRight = createIcon("arrow");
const Bot = createIcon("bot");
const CheckCircle2 = createIcon("check");
const ChevronRight = createIcon("chevron");
const CircleDot = createIcon("dot");
const Database = createIcon("database");
const FileSearch = createIcon("file");
const Github = createIcon("network");
const LockKeyhole = createIcon("lock");
const MessageSquare = createIcon("message");
const Network = createIcon("network");
const Server = createIcon("server");
const ShieldCheck = createIcon("shield");
const Workflow = createIcon("workflow");

import { Link } from "react-router-dom";

import "./Home.css";

const workflow = [
  "Create Project",
  "Add Technologies",
  "Add Services",
  "Add Members",
  "Create Support Request",
  "Incident Created",
  "Add Logs / Evidence",
  "Upload Attachments",
  "Track Activity",
  "Ask ResolveAI",
  "AI Investigation",
  "Troubleshooting Response",
];

const backendStack = [
  {
    title: "Spring Boot",
    description: "Application runtime and backend module integration.",
    icon: Server,
  },
  {
    title: "Spring MVC",
    description: "REST controllers that expose the application API.",
    icon: Network,
  },
  {
    title: "Spring Security + JWT",
    description: "Stateless authentication and role-based authorization.",
    icon: ShieldCheck,
  },
  {
    title: "JPA + Hibernate",
    description: "Relational domain mapping and persistence abstraction.",
    icon: Database,
  },
  {
    title: "MySQL",
    description: "Structured users, projects, memberships, services and incidents.",
    icon: Database,
  },
  {
    title: "MongoDB",
    description: "Flexible incident evidence, activities, attachments and AI messages.",
    icon: FileSearch,
  },
  {
    title: "Spring AI",
    description: "Builds the contextual investigation request through ChatClient.",
    icon: Bot,
  },
  {
    title: "Ollama + Qwen 2.5:7b",
    description: "Runs the configured local model during development.",
    icon: Bot,
  },
  {
    title: "Apache Tika",
    description: "Extracts text from supported uploaded evidence files.",
    icon: FileSearch,
  },
];

const apiGroups = [
  {
    title: "Authentication",
    endpoints: ["POST /api/auth/register", "POST /api/auth/login"],
  },
  {
    title: "Projects",
    endpoints: [
      "GET /api/projects",
      "POST /api/projects",
      "GET /api/projects/{projectId}",
      "POST /api/projects/{projectId}/members",
      "POST /api/projects/{projectId}/technologies",
      "POST /api/projects/{projectId}/services",
    ],
  },
  {
    title: "Support + Incidents",
    endpoints: [
      "POST /api/support",
      "GET /api/support/my",
      "PUT /api/support/{supportRequestId}/status",
      "PUT /api/support/{supportRequestId}/assign",
      "POST /api/support/{supportRequestId}/comments",
      "GET /api/support/{supportRequestId}/activities",
    ],
  },
  {
    title: "Incident Evidence",
    endpoints: [
      "GET /api/incidents/support/{supportRequestId}",
      "POST /api/incidents/logs",
      "POST /api/incidents/{supportRequestId}/attachments",
      "GET /api/incidents/{supportRequestId}/attachments",
    ],
  },
  {
    title: "AI Investigation",
    endpoints: [
      "POST /api/ai/conversations",
      "GET /api/ai/conversations/{conversationId}/messages",
      "POST /api/ai/conversations/{conversationId}/ask",
      "GET /api/ai/context/{supportRequestId}",
    ],
  },
  {
    title: "Administration",
    endpoints: [
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "GET /api/admin/support-requests",
      "GET /api/admin/incidents/{supportRequestId}/logs",
      "PUT /api/admin/incidents/{supportRequestId}/status",
    ],
  },
];

const investigationInputs = [
  "Project",
  "Technologies",
  "Services",
  "Incident",
  "Logs",
  "Attachments",
  "Activity",
  "Conversation history",
];

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <Link to="/" className="home-brand" aria-label="ResolveAI home">
          <span className="home-brand-mark">R</span>
          <span>ResolveAI</span>
        </Link>

        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#architecture">Architecture</a>
          <a href="#workflow">Workflow</a>
          <a href="#api">REST API</a>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="home-nav-cta">
            Try ResolveAI <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      <main>
        <section className="home-hero home-container">
          <div className="home-hero-copy">
            <div className="home-kicker">
              <CircleDot size={12} />
              Software incident investigation platform
            </div>

            <h1>
              Investigate incidents with the{" "}
              <span>full technical context.</span>
            </h1>

            <p className="home-hero-description">
              ResolveAI connects project configuration, services, technologies,
              incident details, logs, attachments, activity history and AI
              investigation into one structured workflow.
            </p>

            <div className="home-hero-actions">
              <Link to="/register" className="home-primary-button">
                Try ResolveAI <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="home-secondary-button">
                Sign in
              </Link>
              <a
                href="https://github.com/thesumeetsingh/resolveai"
                target="_blank"
                rel="noreferrer"
                className="home-secondary-button"
              >
                <Github size={15} />
                View GitHub
              </a>
            </div>

            <div className="home-hero-note">
              <CheckCircle2 size={14} />
              Local AI investigation through Spring AI, Ollama and Qwen 2.5:7b
            </div>
          </div>

          <div className="home-hero-architecture" aria-label="ResolveAI architecture">
            <div className="home-architecture-window">
              <div className="home-window-bar">
                <span />
                <span />
                <span />
                <small>incident-context</small>
              </div>

              <div className="home-architecture-stack">
                <div className="home-architecture-node">
                  <div>
                    <strong>Incident workspace</strong>
                    <span>Project + evidence + activity</span>
                  </div>
                  <MessageSquare size={17} />
                </div>

                <div className="home-flow-line">
                  <ChevronRight size={14} />
                </div>

                <div className="home-architecture-node home-node-highlight">
                  <div>
                    <strong>Spring AI</strong>
                    <span>Contextual investigation request</span>
                  </div>
                  <Bot size={17} />
                </div>

                <div className="home-flow-line">
                  <ChevronRight size={14} />
                </div>

                <div className="home-architecture-node">
                  <div>
                    <strong>Ollama</strong>
                    <span>Local Qwen 2.5:7b runtime</span>
                  </div>
                  <Server size={17} />
                </div>

                <div className="home-flow-line">
                  <ChevronRight size={14} />
                </div>

                <div className="home-architecture-node">
                  <div>
                    <strong>Investigation response</strong>
                    <span>Evidence · hypotheses · next checks</span>
                  </div>
                  <CheckCircle2 size={17} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">01</span>
              <h2>What is ResolveAI?</h2>
            </div>
            <p>
              ResolveAI is not a generic chatbot. It is an incident
              investigation system that builds application-specific context
              before asking the model to reason about a problem.
            </p>
          </div>

          <div className="home-two-column">
            <div className="home-explanation-card">
              <div className="home-card-icon">
                <Workflow size={18} />
              </div>
              <h3>Structured investigation</h3>
              <p>
                A developer creates a project, defines its technology stack,
                services and members, then creates a support request when a
                technical issue occurs. The resulting incident becomes the
                investigation workspace.
              </p>
            </div>

            <div className="home-explanation-card">
              <div className="home-card-icon">
                <FileSearch size={18} />
              </div>
              <h3>Evidence stays connected</h3>
              <p>
                Logs, console output, attachments, comments, activity, status
                and assignment information remain associated with the incident
                instead of being scattered across unrelated tools.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="home-section home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">02</span>
              <h2>Complete workflow</h2>
            </div>
            <p>
              The frontend is the workspace; the investigation value comes from
              the backend assembling the complete incident context.
            </p>
          </div>

          <div className="home-workflow">
            {workflow.map((step, index) => (
              <div className="home-workflow-step" key={step}>
                <span className="home-workflow-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{step}</strong>
                  {index < workflow.length - 1 && (
                    <span className="home-workflow-arrow">
                      <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="architecture" className="home-section home-section-dark home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">03</span>
              <h2>Backend architecture</h2>
            </div>
            <p>
              ResolveAI is intentionally backend-focused: REST APIs, security,
              persistence, incident context and local AI integration form the
              core engineering layer.
            </p>
          </div>

          <div className="home-stack-grid">
            {backendStack.map((item) => {
              const Icon = item.icon;

              return (
                <article className="home-stack-card" key={item.title}>
                  <div className="home-stack-icon">
                    <Icon size={17} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-section home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">04</span>
              <h2>Why two databases?</h2>
            </div>
            <p>
              The application uses polyglot persistence because structured
              domain records and flexible evidence documents have different
              storage characteristics.
            </p>
          </div>

          <div className="home-database-grid">
            <article className="home-database-card">
              <div className="home-database-title">
                <Database size={18} />
                <h3>MySQL</h3>
              </div>
              <p>Structured relational application and domain data.</p>
              <ul>
                <li>Users and roles</li>
                <li>Projects and memberships</li>
                <li>Technologies and services</li>
                <li>Support requests / incidents</li>
                <li>AI conversation metadata</li>
              </ul>
            </article>

            <article className="home-database-card">
              <div className="home-database-title">
                <Database size={18} />
                <h3>MongoDB</h3>
              </div>
              <p>Flexible operational and evidence-oriented documents.</p>
              <ul>
                <li>Incident logs</li>
                <li>Incident activities</li>
                <li>Incident attachment metadata</li>
                <li>AI messages</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="home-section home-section-dark home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">05</span>
              <h2>AI investigation architecture</h2>
            </div>
            <p>
              The model receives an incident context assembled by the backend,
              rather than receiving only the latest user question.
            </p>
          </div>

          <div className="home-ai-architecture">
            <div className="home-ai-inputs">
              {investigationInputs.map((item) => (
                <div className="home-ai-input" key={item}>
                  <CheckCircle2 size={13} />
                  {item}
                </div>
              ))}
            </div>

            <div className="home-ai-arrow">
              <ChevronRight size={20} />
            </div>

            <div className="home-ai-core">
              <div className="home-ai-core-icon">
                <Bot size={23} />
              </div>
              <strong>Incident Context</strong>
              <span>Complete investigation context</span>
            </div>

            <div className="home-ai-arrow">
              <ChevronRight size={20} />
            </div>

            <div className="home-ai-runtime">
              <div>
                <strong>Spring AI</strong>
                <span>ChatClient integration</span>
              </div>
              <div>
                <strong>Ollama</strong>
                <span>Local model runtime</span>
              </div>
              <div>
                <strong>Qwen 2.5:7b</strong>
                <span>Configured model</span>
              </div>
            </div>

            <div className="home-ai-arrow">
              <ChevronRight size={20} />
            </div>

            <div className="home-ai-response">
              <MessageSquare size={19} />
              <strong>AI investigation response</strong>
              <span>Evidence · hypotheses · troubleshooting</span>
            </div>
          </div>
        </section>

        <section id="api" className="home-section home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">06</span>
              <h2>REST API surface</h2>
            </div>
            <p>
              These examples are based on the current backend controllers in
              this project. They are grouped by the actual feature areas.
            </p>
          </div>

          <div className="home-api-grid">
            {apiGroups.map((group) => (
              <article className="home-api-card" key={group.title}>
                <div className="home-api-card-heading">
                  <Network size={16} />
                  <h3>{group.title}</h3>
                </div>

                <div className="home-api-list">
                  {group.endpoints.map((endpoint) => (
                    <code key={endpoint}>{endpoint}</code>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-section-dark home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">07</span>
              <h2>Incident investigation</h2>
            </div>
            <p>
              The incident is the central workspace where technical evidence
              accumulates before the AI is asked to investigate.
            </p>
          </div>

          <div className="home-investigation-board">
            <div className="home-investigation-column">
              <span>Incident information</span>
              <strong>Environment</strong>
              <strong>Affected service</strong>
              <strong>Affected version</strong>
              <strong>Error code</strong>
            </div>

            <div className="home-investigation-column">
              <span>Evidence</span>
              <strong>Console / application logs</strong>
              <strong>Attachments</strong>
              <strong>Extracted text</strong>
              <strong>Activity history</strong>
            </div>

            <div className="home-investigation-column home-investigation-ai">
              <span>Investigation</span>
              <div className="home-investigation-ai-title">
                <Bot size={17} />
                <strong>ResolveAI</strong>
              </div>
              <p>
                Analyze the evidence, distinguish facts from hypotheses, and
                identify the next useful checks.
              </p>
            </div>
          </div>
        </section>

        <section className="home-section home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-number">08</span>
              <h2>Security and access control</h2>
            </div>
            <p>
              Authentication and authorization are handled by the existing
              Spring Security and JWT implementation rather than by the public
              landing page.
            </p>
          </div>

          <div className="home-security-flow">
            <div>
              <LockKeyhole size={18} />
              <strong>Credentials</strong>
              <span>Login request</span>
            </div>
            <ChevronRight size={18} />
            <div>
              <ShieldCheck size={18} />
              <strong>JWT</strong>
              <span>Bearer authentication</span>
            </div>
            <ChevronRight size={18} />
            <div>
              <Server size={18} />
              <strong>Spring Security</strong>
              <span>Protected APIs</span>
            </div>
            <ChevronRight size={18} />
            <div>
              <CheckCircle2 size={18} />
              <strong>Authorized user</strong>
              <span>Controller / service access</span>
            </div>
          </div>
        </section>

        <section className="home-section home-cta-section home-container">
          <div className="home-cta">
            <div>
              <span className="home-section-number">09</span>
              <h2>Try the working incident workflow.</h2>
              <p>
                Create an account, configure a project, raise a support request,
                collect evidence and ask ResolveAI to investigate it.
              </p>
            </div>

            <div className="home-cta-actions">
              <Link to="/register" className="home-primary-button">
                Create an account <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="home-secondary-button">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-inner home-container">
          <div>
            <Link to="/" className="home-brand">
              <span className="home-brand-mark">R</span>
              <span>ResolveAI</span>
            </Link>
            <p>AI-assisted software incident investigation.</p>
          </div>

          <div className="home-footer-links">
            <a
              href="https://github.com/thesumeetsingh/resolveai"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={14} />
              GitHub
            </a>
            <a href="mailto:sumeetsingh9752818473@gmail.com">
              sumeetsingh9752818473@gmail.com
            </a>
          </div>

          <div className="home-footer-author">
            <span>Author</span>
            <strong>Sumeet Singh</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}