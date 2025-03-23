# My App

This guide provides instructions on how to install and run the app locally.

## Prerequisites

- Node.js (version 14 or later)
- A package manager (npm, yarn, or pnpm)
- A Supabase account and project

## Installation

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone <repository-url>
   ```

   Replace `<repository-url>` with the actual URL of your repository.

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```bash
   cd <project-directory>
   ```

   Replace `<project-directory>` with the name of your project directory.

3. **Install Dependencies**

   Choose one of the following commands based on your preferred package manager:

   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

4. **Configure Environment Variables**

   Rename the `.env.example` file to `.env.local` and update the following variables with your Supabase project details:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   You can find these values in your Supabase project's API settings.

## Running the App

1. **Start the Development Server**

   Run one of the following commands based on your package manager:

   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using pnpm
   pnpm dev
   ```

2. **Access the App**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Additional Information

- For more details on running Supabase locally, refer to the [Supabase Local Development Guide](https://supabase.com/docs/guides/getting-started/local-development).

- If you encounter any issues, please check the [Supabase GitHub issues page](https://github.com/supabase/supabase/issues).
