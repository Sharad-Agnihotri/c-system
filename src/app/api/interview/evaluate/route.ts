import { NextRequest, NextResponse } from "next/server";
import vm from "vm";

interface TestCase {
  input: any[];
  expected: any;
}

export async function POST(req: NextRequest) {
  try {
    const { code, functionName, testCases } = await req.json();

    if (!code || !functionName || !testCases?.length) {
      return NextResponse.json({ error: "Missing code, function name, or test cases" }, { status: 400 });
    }

    const results: {
      input: any[];
      expected: any;
      actual: any;
      passed: boolean;
      error?: string;
      time: number;
    }[] = [];

    for (const tc of testCases as TestCase[]) {
      const startTime = performance.now();
      try {
        // Build execution wrapper
        const wrappedCode = `
          ${code}
          
          // Call the function with test input
          const __result = ${functionName}(${tc.input.map((arg: any) => JSON.stringify(arg)).join(", ")});
          __result;
        `;

        // Create a sandboxed context with timeout
        const sandbox: Record<string, any> = {
          console: { log: () => {} }, // silence console
          Math,
          parseInt,
          parseFloat,
          isNaN,
          isFinite,
          String,
          Number,
          Boolean,
          Array,
          Object,
          Map,
          Set,
          JSON,
          Infinity,
          NaN,
          undefined,
        };

        const context = vm.createContext(sandbox);
        const script = new vm.Script(wrappedCode);
        const actual = script.runInContext(context, { timeout: 5000 });

        const elapsed = performance.now() - startTime;

        // Deep comparison
        const passed = deepEqual(actual, tc.expected);

        results.push({
          input: tc.input,
          expected: tc.expected,
          actual,
          passed,
          time: Math.round(elapsed * 100) / 100,
        });
      } catch (err: any) {
        const elapsed = performance.now() - startTime;
        let errorMsg = err.message || "Runtime error";

        if (err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
          errorMsg = "Time Limit Exceeded (5s)";
        }

        results.push({
          input: tc.input,
          expected: tc.expected,
          actual: null,
          passed: false,
          error: errorMsg,
          time: Math.round(elapsed * 100) / 100,
        });
      }
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);

    return NextResponse.json({
      results,
      summary: {
        passed: passedCount,
        total: results.length,
        allPassed: passedCount === results.length,
        totalTime: Math.round(totalTime * 100) / 100,
      },
    });
  } catch (error: any) {
    console.error("Code Evaluation Error:", error);
    return NextResponse.json({ error: error.message || "Execution failed" }, { status: 500 });
  }
}

// Deep equality check for arrays, objects, and primitives
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a == b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // Sort arrays for order-independent comparison (e.g. Two Sum could return [0,1] or [1,0])
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => deepEqual(val, sortedB[i]));
  }

  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}
