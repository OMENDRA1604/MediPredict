import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Search, Stethoscope, X, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useEffect } from "react";
import { getSymptoms } from "@/services/api";
import { SYMPTOM_LIST, formatSymptom } from "@/data/symptoms";
import { predictDisease } from "@/services/api";

interface PredictionResult {
  disease: string;
  confidence: number;
  description?: string;
  precautions?: string[];
  severity_score?: number;
  top_predictions?: { disease: string; confidence: number }[];
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => {
    getSymptoms()
      .then((res) => {
        console.log("SYMPTOMS FROM API:", res.data);
        setSymptoms(res.data.symptoms);
      })
      .catch((err) => {
        console.error("Error fetching symptoms:", err);
      });
  }, []);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return symptoms.slice(0, 30);
    return symptoms.filter((s) => s.toLowerCase().includes(q)).slice(0, 40);
  }, [query, symptoms]);

  const toggle = (s: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        next.delete(s);
      } else {
        next.add(s);
      } 
      return next;
    });
  };

  const predict = async () => {
    if (selected.size === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await predictDisease(Array.from(selected));
      console.log("API RESPONSE:", data);
      setResult(data);
    } catch (e) {
      console.error("API ERROR:", e);
      toast.error("Backend not reachable or error occurred ❌");
    } finally {
      setLoading(false);
    }
  };

  const severity = result?.severity_score ?? 0;
  const severityLabel =
    severity > 10 ? "High" : severity > 5 ? "Medium" : "Low";
  const severityColor =
    severity > 10 ? "bg-destructive" : severity > 5 ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--success))]";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-hero border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">MediPredict</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Symptom Analysis</p>
            </div>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Select your symptoms below and let our machine learning model predict possible
            conditions, with descriptions and recommended precautions.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-5 gap-6">
        {/* Left: symptom selection */}
        <Card className="lg:col-span-3 shadow-card border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              Select Your Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search symptoms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {selected.size > 0 && (
              <div className="rounded-lg bg-accent/40 p-3 border border-accent">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    Selected ({selected.size})
                  </span>
                  <button
                    onClick={() => setSelected(new Set())}
                    className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selected).map((s) => (
                    <Badge
                      key={s}
                      variant="default"
                      className="gradient-primary text-primary-foreground gap-1 pr-1 animate-fade-up"
                    >
                      {formatSymptom(s)}
                      <button
                        onClick={() => toggle(s)}
                        className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto pr-1">
              {filtered.map((s) => {
                const active = selected.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-smooth ${
                      active
                        ? "gradient-primary text-primary-foreground border-transparent shadow-elegant scale-105"
                        : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {formatSymptom(s)}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">No symptoms found.</p>
              )}
            </div>

            <Button
              onClick={predict}
              disabled={loading}
              size="lg"
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 text-base"
            >
              {loading ? (
                <span className="animate-pulse-soft">Analyzing symptoms...</span>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Predict Disease
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: results */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !loading && (
            <Card className="shadow-card border-dashed border-border/60 h-full">
              <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Awaiting analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Select symptoms and click predict to see possible conditions.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <Card className="shadow-elegant border-border/60 animate-fade-up overflow-hidden">
                <div className="gradient-primary h-1.5" />
                <CardHeader className="pb-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Predicted Condition
                  </p>
                  <CardTitle className="text-2xl">{result.disease}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-semibold text-primary">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full gradient-primary animate-fill-bar"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {result.severity_score !== undefined && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                      <span className="text-sm text-muted-foreground">Severity</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${severityColor}`} />
                        <span className="text-sm font-semibold">
                          {severityLabel} ({result.severity_score})
                        </span>
                      </div>
                    </div>
                  )}

                  {severity > 10 && (
                    <div className="flex gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-destructive">
                        High severity detected. Please consult a doctor immediately.
                      </p>
                    </div>
                  )}

                  {result.description && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">About</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  )}

                  {result.precautions && result.precautions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Recommended Precautions
                      </h4>
                      <ul className="space-y-1.5">
                        {result.precautions.filter(Boolean).map((p, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-primary font-semibold">{i + 1}.</span>
                            <span className="capitalize text-muted-foreground">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {result.top_predictions && result.top_predictions.length > 1 && (
                <Card className="shadow-card border-border/60 animate-fade-up">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Other Possibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.top_predictions.slice(1).map((p) => (
                      <div key={p.disease} className="flex items-center justify-between text-sm">
                        <span>{p.disease}</span>
                        <span className="text-muted-foreground">
                          {Math.round(p.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card className="border-border/60 bg-muted/40">
            <CardContent className="py-3 px-4 text-xs text-muted-foreground flex gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>
                This tool provides AI-based predictions for educational purposes only and is not
                a substitute for professional medical advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
