import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signIn, user, isNewUser, userProfile, supabase } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to dashboard");
      navigate("/");
    }
  }, [user, navigate]);

  const validateEmail = (email: string): boolean => {
    setEmailError(null);
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePassword = (password: string): boolean => {
    setPasswordError(null);
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await signIn(email, password);
      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      // Show success message briefly before redirecting
      setSuccess(true);
      console.log("Login successful, navigating to home");

      // Short delay for success animation
      setTimeout(async () => {
        try {
          // Check if user has completed setup by checking profile data
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("race, kingdom_name")
            .eq("user_id", data.user.id)
            .single();

          const hasCompletedKingdomSetup = !!(
            profileData?.race && profileData?.kingdom_name
          );

          if (hasCompletedKingdomSetup) {
            // If profile data indicates setup is complete, set localStorage flag
            localStorage.setItem("setupCompleted", "true");
            console.log(
              "Setup detected as complete from profile data, redirecting to dashboard",
            );
            navigate("/");
          } else if (isNewUser()) {
            console.log("Redirecting new user to kingdom setup");
            navigate("/setup-kingdom");
          } else {
            console.log("Redirecting existing user to dashboard");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking profile data:", error);
          // Default to dashboard if there's an error checking profile
          navigate("/");
        }
      }, 1000);
    } catch (err: any) {
      console.error("Login error caught:", err);
      if (err.message?.includes("Invalid login")) {
        setError(
          "Invalid email or password. Please check your credentials and try again.",
        );
      } else if (err.message?.includes("rate limit")) {
        setError("Too many login attempts. Please try again later.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Please confirm your email address before logging in.");
      } else {
        setError(err.message || "Failed to sign in. Please try again later.");
      }
      setSuccess(false);
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-background/95 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card
          className="w-full max-w-md shadow-neuro-flat hover:shadow-neuro-convex transition-all duration-300 overflow-hidden"
          data-testid="login-card"
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              Login to Kurusetra
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your kingdom
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  variant="destructive"
                  className="mb-4 border border-destructive/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="mb-4 border border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Login successful! Redirecting to your kingdom...
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={`${emailFocused ? "text-primary" : ""} transition-colors duration-200`}
                >
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => {
                      setEmailFocused(false);
                      validateEmail(email);
                    }}
                    className={`${emailError ? "border-red-300 focus:border-red-300" : emailFocused ? "border-primary" : ""} pr-10`}
                    required
                  />
                  {emailError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {emailError && (
                  <motion.p
                    className="text-xs text-red-500 mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className={`${passwordFocused ? "text-primary" : ""} transition-colors duration-200`}
                  >
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => {
                      setPasswordFocused(false);
                      validatePassword(password);
                    }}
                    className={`${passwordError ? "border-red-300 focus:border-red-300" : passwordFocused ? "border-primary" : ""} pr-10`}
                    required
                  />
                  {passwordError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {passwordError && (
                  <motion.p
                    className="text-xs text-red-500 mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {passwordError}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                disabled={loading || success}
                data-testid="login-button"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success!
                  </span>
                ) : (
                  <span>Sign in</span>
                )}

                {/* Button animation effect */}
                <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
