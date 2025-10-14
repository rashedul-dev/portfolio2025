"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorReporterProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function ErrorReporter({ error, reset }: ErrorReporterProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Error Encountered</h1>
          <p className="text-gray-400 leading-relaxed">{error?.message || "Something went wrong. Please try again."}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {reset && (
            <Button
              onClick={reset}
              className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          )}

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-white text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Error Code */}
        {error?.digest && (
          <div className="pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">Error ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  );
}
