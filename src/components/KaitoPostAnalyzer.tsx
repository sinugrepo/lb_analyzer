import React, { useState } from "react";


const model = "qwen/qwen2.5-7b-instruct";
const endpoint = "https://api.novita.ai/v3/openai/chat/completions";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            title="Copy to clipboard"
            onClick={async e => {
                e.preventDefault();
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }}
            className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
            {copied ? (
                <span className="text-green-600 text-xs">Copied!</span>
            ) : (
                <svg
                    className="inline h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <rect
                        x={9}
                        y={9}
                        width={13}
                        height={13}
                        rx={2}
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                    />
                    <rect
                        x={3}
                        y={3}
                        width={13}
                        height={13}
                        rx={2}
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                    />
                </svg>
            )}
        </button>
    );
}

export const KaitoPostAnalyzer: React.FC = () => {
    const [tweet, setTweet] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setError("");
        setLoading(true);
        setResult(null);

        const prompt = `
You are an expert in evaluating Twitter (X) posts written in a casual "yapping" style, used to hype up a product, protocol, or movement — especially in Web3.

Analyze a single tweet and return:

1. **Engagement Potential (mention_score)**  
2. **Insightfulness (insightfulness_score)**  
3. **Originality (originality_score)**  

4. **Suggestions (suggestions_en and suggestions_id)**  
These are short tips to improve the tweet — such as rewording, reframing, or improving structure — but not full sentences.

5. **Additions (additions.en and additions.id)**  
These must be full, tweet-ready **sentences** the user can paste directly into their post. They should naturally extend the tweet. Do NOT write general ideas or instructions.

6. **After Tweet (after_tweet)**  
Return the full tweet after integrating the English additions into the original content.
Keep the original tweet structure and tone.
Do not remove or rewrite large parts. Only add and enhance.
This should allow the user to see exactly what was added to their original tweet.
Do not include any emojis or hashtags.

Respond ONLY in this JSON format:

\`\`\`json
{
  "mention_score": [0–10],
  "insightfulness_score": [0–10],
  "originality_score": [0–10],
  "suggestions_en": [
    "Short tip to improve in English"
  ],
  "suggestions_id": [
    "Saran pendek dalam bahasa Indonesia"
  ],
  "additions": {
    "en": [
      "Tweet-ready line in English"
    ],
    "id": [
      "Kalimat tambahan dalam bahasa Indonesia"
    ]
  },
  "after_tweet": "Original tweet with the English additions smoothly inserted — no emoji."
}
\`\`\`

Example tweet to analyze:

${tweet}
`;

        try {
            const apiKey = "sk_2TtKemiGVsL1nfKzZok-uDjz9OBs1hTWu6H97pxwwqU";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    stream: false
                })
            });

            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) throw new Error("No content in LLM response.");
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1] : content;
            setResult(JSON.parse(jsonString));
        } catch (err: any) {
            setError("Gagal menganalisis post. Pastikan format input sudah benar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-800 transition-colors">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    Kaito Post Analyzer
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Analyze your X (Twitter) post Web3-style. Get feedback, score, and suggestions to improve engagement!
                </p>
                <textarea
                    className="w-full h-32 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-4"
                    placeholder="Paste your X post here..."
                    value={tweet}
                    onChange={e => setTweet(e.target.value)}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={loading || tweet.trim() === ""}
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                    {loading ? "Analyzing..." : "Analyze Post"}
                </button>
                {error && <div className="mt-4 text-red-500">{error}</div>}
            </div>
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            )}
            {result && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 mt-6 transition-colors">
                    {/* BEFORE - original tweet */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                        Original Tweet
                        <CopyButton text={tweet} />
                    </h3>
                    <div className="whitespace-pre-line bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-200 mb-6">
                        {tweet}
                    </div>

                    {/* AFTER - tweet with additions */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                        Revised Tweet
                        <CopyButton text={result.after_tweet} />
                    </h3>
                    <div className="whitespace-pre-line bg-gray-50 dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-200 mb-6">
                        {result.after_tweet}
                    </div>

                    {/* Score */}
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Score</h4>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="rounded-lg bg-blue-50 dark:bg-gray-800 p-4 flex-1 min-w-[120px]">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Engagement</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.mention_score}/10</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 dark:bg-gray-800 p-4 flex-1 min-w-[120px]">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Insightfulness</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.insightfulness_score}/10</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 dark:bg-gray-800 p-4 flex-1 min-w-[120px]">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Originality</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.originality_score}/10</div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">Suggestions</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-900">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-200 tracking-wider">EN</span>
                                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded px-2 py-0.5 text-xs ml-1">Suggestions</span>
                            </div>
                            <ul className="space-y-2">
                                {result.suggestions_en?.map((s: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 group">
                                        <span className="mt-1 text-blue-400 dark:text-blue-200">
                                            <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M11 3a1 1 0 1 0-2 0v5a1 1 0 0 0 .293.707l3.5 3.5a1 1 0 0 0 1.414-1.414L11 8.586V3Z" fill="currentColor" /></svg>
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase text-purple-700 dark:text-purple-200 tracking-wider">ID</span>
                                <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded px-2 py-0.5 text-xs ml-1">Saran</span>
                            </div>
                            <ul className="space-y-2">
                                {result.suggestions_id?.map((s: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 group">
                                        <span className="mt-1 text-purple-400 dark:text-purple-200">
                                            <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M11 3a1 1 0 1 0-2 0v5a1 1 0 0 0 .293.707l3.5 3.5a1 1 0 0 0 1.414-1.414L11 8.586V3Z" fill="currentColor" /></svg>
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Additions */}
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Additions</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* EN */}
                        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 shadow-sm border border-green-100 dark:border-green-900">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase text-green-700 dark:text-green-200 tracking-wider">EN</span>
                                <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded px-2 py-0.5 text-xs ml-1">For your tweet</span>
                            </div>
                            <ul className="space-y-2">
                                {result.additions?.en?.map((s: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2 group rounded hover:bg-green-100/70 dark:hover:bg-green-900/60 px-2 py-1 cursor-pointer transition"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(s);
                                        }}
                                        title="Copy this addition"
                                    >
                                        <span className="mt-1 text-green-400 dark:text-green-200">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M9 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9Zm0 2h5v8H9V4Z" fill="currentColor" /></svg>
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* ID */}
                        <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 shadow-sm border border-yellow-100 dark:border-yellow-900">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase text-yellow-700 dark:text-yellow-200 tracking-wider">ID</span>
                                <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded px-2 py-0.5 text-xs ml-1">Untuk postinganmu</span>
                            </div>
                            <ul className="space-y-2">
                                {result.additions?.id?.map((s: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2 group rounded hover:bg-yellow-100/70 dark:hover:bg-yellow-900/60 px-2 py-1 cursor-pointer transition"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(s);
                                        }}
                                        title="Copy this addition"
                                    >
                                        <span className="mt-1 text-yellow-500 dark:text-yellow-200">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M9 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9Zm0 2h5v8H9V4Z" fill="currentColor" /></svg>
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
