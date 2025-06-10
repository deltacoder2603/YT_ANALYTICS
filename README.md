# YT_ANALYTICS

## Unveiling YouTube Performance: A Modern Analytics Dashboard

The **YT_ANALYTICS** is a sophisticated, real-time analytics platform designed to empower YouTube creators and marketers with actionable insights into channel performance. Built with a focus on intuitive visualizations and comprehensive data, this dashboard transforms raw YouTube data into an engaging and understandable narrative, helping you optimize your content strategy and accelerate growth.

## ✨ Features

*   **Channel Overview**: At-a-glance summary of key channel statistics, including total views, subscribers, and video count.
*   **Dynamic Performance Analytics**: Visualize video performance trends over time with interactive line charts, tracking views, likes, and comments for recent uploads.
*   **Smart Upload Patterns**: Discover optimal upload times and days of the week based on historical data with insightful bar and pie charts.
*   **Monthly Upload Trends**: Analyze long-term content publication consistency and growth patterns.
*   **Intuitive Search**: Easily analyze any YouTube channel by simply entering a URL, handle, or channel ID.
*   **Responsive Design**: A seamless experience across all devices, from desktop to mobile.
*   **Beautiful UI**: Crafted with modern aesthetics using Shadcn UI components for a polished and engaging user experience.

## 📊 Key Metrics

*   **Engagement Rate**: Calculated as `(Likes + Comments) / Views * 100`. This metric helps understand how actively viewers interact with the content relative to its viewership.

## 🚀 Technologies

*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **Vite**: A lightning-fast frontend tooling that provides a significantly faster development experience.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer experience.
*   **Shadcn UI**: A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **Recharts**: A composable charting library built on React components for powerful data visualization.
*   **React Query (TanStack Query)**: For efficient data fetching, caching, and synchronization.
*   **React Router DOM**: For declarative routing in React applications.
*   **Bun**: A fast all-in-one JavaScript runtime (used for package management and script execution).
*   **Lucide React**: A collection of beautiful and customizable open-source icons.

## 🛠️ Installation & Setup

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/crimson-tube-insights-dashboard.git
    cd crimson-tube-insights-dashboard
    ```
2.  **Install dependencies:**
    Using Bun (recommended):
    ```bash
    bun install
    ```
    Or using npm:
    ```bash
    npm install
    ```
3.  **Set up YouTube API Key:**
    *   Obtain a YouTube Data API v3 key from the Google Cloud Console.
    *   Open `src/services/youtube-api.ts` and replace `AIzaSyBXFooJ8EnMuOdPmLmzFQD7ebup_WMfykI` with your actual API key.
        ```typescript
        const API_KEY = "YOUR_YOUTUBE_API_KEY";
        ```
4.  **Run the development server:**
    Using Bun:
    ```bash
    bun dev
    ```
    Or using npm:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:8080` or `http://localhost:8081` if port 8080 is in use.

## 💡 Usage

1.  Navigate to the application in your browser.
2.  On the homepage, enter a YouTube channel URL, handle (e.g., `@YouTubeCreators`), or a direct channel ID into the input field.
3.  Click "Analyze Channel" to view the detailed analytics dashboard for that channel.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. Don't forget to give the project a star!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Crafted with ❤️ by Your Name/Team
