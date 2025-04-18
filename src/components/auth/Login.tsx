import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import {
  NeumorphicCard,
  NeumorphicButton,
  NeumorphicInput,
  NeumorphicContainer
} from "../../styles/components";

const LoginContainer = styled(NeumorphicContainer)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoginCard = styled(NeumorphicCard)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${props => props.theme.accent};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label<{ focused?: boolean }>`
  color: ${props => props.focused ? props.theme.accent : props.theme.text};
  font-weight: 500;
  transition: color 0.3s ease;
`;

const Input = styled(NeumorphicInput)`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 
      inset 3px 3px 6px ${props => props.theme.shadow},
      inset -3px -3px 6px ${props => props.theme.light},
      0 0 0 2px ${props => props.theme.accent};
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Alert = styled(motion.div)<{ type: 'error' | 'success' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  background: ${props => props.type === 'error' ? props.theme.error : props.theme.success};
  color: white;
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};
`;

const SubmitButton = styled(NeumorphicButton)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const RegisterLink = styled(Link)`
  color: ${props => props.theme.accent};
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

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
  const { signIn, user, isNewUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
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
      setTimeout(() => {
        // Redirect new users to onboarding, existing users to profile
        if (isNewUser()) {
          console.log("Redirecting new user to onboarding");
          navigate("/onboarding");
        } else {
          console.log("Redirecting existing user to profile");
          navigate("/profile");
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
    <LoginContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <LoginCard>
          <Title>Login to Kurusetra</Title>
          <Description>Enter your credentials to access your kingdom</Description>

          {error && (
            <Alert
              type="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={20} />
              <div>
                <strong>Error</strong>
                <p>{error}</p>
              </div>
            </Alert>
          )}

          {success && (
            <Alert
              type="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={20} />
              <div>
                <strong>Success</strong>
                <p>Login successful! Redirecting to your kingdom...</p>
              </div>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label focused={emailFocused}>Email</Label>
              <Input
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
              />
              {emailError && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={16} />
                  {emailError}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label focused={passwordFocused}>Password</Label>
              <Input
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
              />
              {passwordError && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={16} />
                  {passwordError}
                </ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </SubmitButton>

            <RegisterLink to="/register">
              Don't have an account? Register here
            </RegisterLink>
          </Form>
        </LoginCard>
      </motion.div>
    </LoginContainer>
  );
}
