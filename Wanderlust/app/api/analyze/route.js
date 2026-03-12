import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";
import fs from "fs";

const execPromise = util.promisify(exec);

export async function POST(req) {
    try {
        const { sentence } = await req.json();

        if (!sentence) {
            return NextResponse.json(
                { error: "Sentence is required" },
                { status: 400 }
            );
        }

        // Determine paths
        // Go up from app/api/analyze/route.js -> app/api/analyze -> app/api -> app -> root
        // Actual: route.js is in app/api/analyze.
        // process.cwd() is usually the project root (Wanderlust/Wanderlust or Wanderlust)
        // We need to find "Sentiment_analysis/analyze_api.py" which is a sibling of "Wanderlust" folder or inside it?

        // User structure:
        // c:\Users\Rishith\OneDrive\Documents\Wanderlust\Sentiment_analysis
        // c:\Users\Rishith\OneDrive\Documents\Wanderlust\Wanderlust (Next.js app)

        // If process.cwd() is ...\Wanderlust\Wanderlust
        // Then script is at ../Sentiment_analysis/analyze_api.py

        const scriptPath = path.resolve(process.cwd(), "../Sentiment_analysis/analyze.py");

        // Check if script exists
        if (!fs.existsSync(scriptPath)) {
            console.error("Script not found at:", scriptPath);
            return NextResponse.json({ error: "Configuration Error: Script not found" }, { status: 500 });
        }

        // Determine Python executable (preference for venv)
        let pythonPath = "python"; // Default
        const venvPath = path.resolve(process.cwd(), "../Sentiment_analysis/.venv/Scripts/python.exe");

        if (fs.existsSync(venvPath)) {
            pythonPath = venvPath;
        }

        // Initialize command
        // Escape double quotes in sentence to avoid shell issues
        const safeSentence = sentence.replace(/"/g, '\\"');
        const command = `"${pythonPath}" "${scriptPath}" "${safeSentence}"`;

        console.log("Executing:", command);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && stderr.trim().length > 0) {
            // Llama cpp might still output to stderr even with redirection if it crashes
            console.warn("Python Stderr:", stderr);
        }

        console.log("Python Stdout:", stdout);

        try {
            const result = JSON.parse(stdout.trim());
            return NextResponse.json(result);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return NextResponse.json({
                error: "Model failed to produce valid JSON",
                raw: stdout
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Internal API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
