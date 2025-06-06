import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function CheckStatus() {
  const [status, setStatus] = useState({ loading: true, db: null, user: null });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setStatus({ loading: true, db: null, user: null });

    try {
      const response = await axios.get("/api/check-db-session", {
        withCredentials: true,
      });

      setStatus({
        loading: false,
        db: "connected",
        user: response.data.user || "Guest",
      });
    } catch (error) {
      setStatus({
        loading: false,
        db: error.response?.data?.message.includes("Database Disconnected")
          ? "disconnected"
          : "connected",
        user: error.response?.status === 401 ? null : "Guest",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-gray-800">
      <Card className="w-96 p-6 shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl">
        <CardContent className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-white">System Status</h2>

          {status.loading ? (
            <LoaderCircle className="animate-spin text-yellow-400 w-10 h-10" />
          ) : (
            <>
              {/* Database Status */}
              <div className="flex items-center space-x-2">
                {status.db === "connected" ? (
                  <CheckCircle className="text-green-400 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-400 w-6 h-6" />
                )}
                <span className="text-white">
                  {status.db === "connected"
                    ? "Database Connected"
                    : "Database Disconnected"}
                </span>
              </div>

              {/* User Status */}
              <div className="flex items-center space-x-2">
                {status.user ? (
                  <CheckCircle className="text-green-400 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-400 w-6 h-6" />
                )}
                <span className="text-white">
                  {status.user
                    ? `Logged in as ${status.user.email || "User"}`
                    : "Not Logged In"}
                </span>
              </div>
            </>
          )}

          {/* Refresh Button */}
          <Button onClick={fetchStatus} className="mt-4 w-full">
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
