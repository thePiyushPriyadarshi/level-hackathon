# Social Media Performance Analysis

## Overview
Social Media Performance Analysis is a [Next.js](https://nextjs.org/) application designed to provide actionable insights by analyzing data fetched from Astra DB using the [LangFlow](https://www.langflow.org/) API.

## Features
- **Data Fetching**: Retrieves structured data from Astra DB.
- **Data Processing**: Utilizes the LangFlow API for efficient and robust data processing.
- **Insight Generation**: Generates actionable insights and visualizations using LangFlow.
- **User-Friendly Interface**: A clean and responsive interface built with Next.js.

## Live Application
- **Production Url**: https://level-hackathon-ten.vercel.app/
- **Platform**: [Vercel](https://vercel.com/)
- **Status**: Active


## Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/)
- **API**: [LangFlow](https://langflow.org/)
- **Database**: [Astra DB](https://www.datastax.com/astra)
- **Data Insights**: Flow

## Installation

### Prerequisites
- Node.js installed (v16+ recommended)
- Astra DB setup and credentials
- LangFlow API access

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/thePiyushPriyadarshi/level-hackathon.git
   ```
2. Navigate to the project directory:
   ```bash
   cd level-hackathon
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add the following environment variables:
   ```env
   FLOWID = <flow-id>
   LANGFLOWID = <langflow-api-key>
   TOKEN = <database-token>
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Upload or input your social media data.
3. View detailed performance insights and visualizations.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements
- [Next.js Documentation](https://nextjs.org/docs)
- [LangFlow API](https://langflow.org/)
- [Astra DB Documentation](https://www.datastax.com/astra)

---

Let me know if you'd like additional sections or customization!
