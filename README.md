**Towntask: Hyperlocal MERN Marketplace**
Towntask is a specialized hyperlocal marketplace built on the MERN stack, designed to bridge the gap between local service seekers (Posters) and skilled providers (Workers) within the same geographic area. Unlike broad, global freelancing platforms, Towntask prioritizes proximity, ensuring that help is found right in your neighborhood.

**🚀 Project Overview**
The platform’s core logic is City-First: workers only see and bid on jobs within their verified city. However, it features an intelligent Adaptive Expansion system—if a specific skill isn’t available locally, the search radius automatically expands to neighboring cities, ensuring no task goes unfulfilled.

**Key Features**
📍 Hyperlocal Matching: Default job feeds filtered by the user's verified city.

📈 Adaptive Expansion: Automatic search radius increase to neighboring cities if local talent is unavailable.

🚨 One-Tap Emergency SOS: A high-visibility, categorized emergency system (Crime, Medical, Women Safety) with GPS logging.

💬 Live Messaging: Real-time Socket.io-powered chat between Posters and Accepters.

📂 Document Verification: Secure document upload and "fetching" from browser for user credibility.

📱 Mobile-First Design: Fully responsive UI modeled after industry-leading freelance dashboards.

**Core Development & Logic**
TypeScript: The backbone of the project, ensuring a bug-free, type-safe environment across the entire full-stack pipeline.

JavaScript (ES6+): Utilized for dynamic scripting and seamless integration of modern web APIs.

Motoko: Bringing decentralized logic into the fold, specifically for Internet Computer (ICP) integrations and blockchain-backed security.

*The MERN Powerhouse*
MongoDB: A flexible NoSQL database using Geospatial Indexing to handle lightning-fast "Worker-to-City" matching.

Express.js: A minimalist web framework for building robust, scalable RESTful APIs.

React.js: Crafting a responsive, component-based UI modeled after elite freelancing platforms.

Node.js: The powerhouse runtime for executing high-concurrency backend logic.

*Real-Time & Communications*
Socket.io: Enabling instant, live messaging between Job Posters and Workers without refreshing the page.

Webhooks: Managing automated triggers for emergency alerts and status updates.

*Security & Safety Layer*
JSON Web Tokens (JWT): Secure, stateless authentication for user sessions.

Bcrypt.js: Industry-standard password hashing to keep user data impenetrable.

Geolocator API: Precision tracking for the global SOS/Emergency feature.

*Styling & UI UX*
Tailwind CSS: For a modern, utility-first design that remains responsive on everything from a desktop to a smartphone.

React-Toastify: Providing sleek, real-time "Toast" notifications for every user action

**🛡️ Safety & Security**
Towntask is built with a Safety-First mindset. The Emergency feature is pinned globally as a Floating Action Button (FAB). When triggered, it logs the user's precise location and offers immediate dialer access to local helplines (Police: 100, Ambulance: 102).

**🤝 Contributing**
Contributions are welcome! If you have suggestions for the Adaptive Expansion algorithm or new SOS categories, please open an issue or submit a pull request.
