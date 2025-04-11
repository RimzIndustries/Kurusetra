import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SupabaseConnectionTest() {
  const { checkSupabaseConnection } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setConnectionStatus(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>

      <div className="mb-4">
        <Button
          onClick={handleCheckConnection}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Check Supabase Connection"
          )}
        </Button>
      </div>

      {connectionStatus !== null && (
        <Alert className={connectionStatus ? "bg-green-50" : "bg-red-50"}>
          {connectionStatus ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle>
            {connectionStatus ? "Connection Successful" : "Connection Failed"}
          </AlertTitle>
          <AlertDescription>
            {connectionStatus
              ? "Successfully connected to Supabase database."
              : error ||
                "Failed to connect to Supabase database. Please check your credentials and network connection."}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>
          This test checks if your application can connect to the Supabase
          database.
        </p>
        <p className="mt-2">If the connection fails, please verify:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Your Supabase URL and API keys are correct</li>
          <li>Your network connection is stable</li>
          <li>The Supabase service is running</li>
        </ul>
      </div>
    </Card>
  );
}
