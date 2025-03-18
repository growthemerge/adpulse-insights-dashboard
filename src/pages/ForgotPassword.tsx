
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gradient">Reset Password</h1>
          <p className="text-center text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-md text-center">
              <p className="mb-2">Password reset email sent!</p>
              <p className="text-sm text-muted-foreground">
                Check your inbox for instructions to reset your password
              </p>
            </div>
            <Link to="/login">
              <Button 
                className="w-full bg-brand-green text-brand-darkBlue hover:bg-brand-green/90"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-green text-brand-darkBlue hover:bg-brand-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-brand-green hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
