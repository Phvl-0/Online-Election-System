
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      toast({
        title: "Password is too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user || data.user.identities?.length === 0) {
        throw new Error("This email is already registered");
      }

      if (data.session) {
        toast({
          title: "Registration successful!",
          description: "Your account is ready.",
        });
        navigate("/elections", { replace: true });
        return;
      }

      toast({
        title: "Check your email",
        description: "Open the confirmation link, then sign in.",
      });
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      console.error('Registration error:', error);

      const message = error instanceof Error ? error.message : "Unable to create your account";
      const normalizedMessage = message.toLowerCase();
      let errorTitle = "Registration failed";
      let errorMessage = message;

      if (normalizedMessage.includes("already") || normalizedMessage.includes("exists")) {
        errorMessage = "This email is already registered";
      } else if (normalizedMessage.includes("password")) {
        errorTitle = "Password is too short";
        errorMessage = "Please enter a longer password with at least 6 characters.";
      } else if (normalizedMessage.includes("email") && normalizedMessage.includes("invalid")) {
        errorMessage = "Please enter a valid email address";
      } else if (normalizedMessage.includes("rate limit")) {
        errorMessage = "Too many attempts. Please wait a moment and try again";
      } else if (normalizedMessage.includes("fetch") || normalizedMessage.includes("network")) {
        errorMessage = "Unable to reach the registration service. Check your connection and try again";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Create an account</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email below to create your account
          </p>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
