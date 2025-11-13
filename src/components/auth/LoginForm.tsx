import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { loginRateLimiter } from '@/lib/rateLimiter';
import { toast } from 'sonner';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Vérifier le rate limiting
    const rateLimitKey = email || 'anonymous';
    if (loginRateLimiter.isBlocked(rateLimitKey)) {
      const timeLeft = loginRateLimiter.formatRemainingTime(rateLimitKey);
      setIsBlocked(true);
      setRemainingTime(timeLeft);
      toast.error('Trop de tentatives', {
        description: `Veuillez réessayer dans ${timeLeft}`,
      });
      return;
    }

    // Validation avec Zod
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      // Extraire les erreurs de validation
      const fieldErrors: Partial<LoginFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      // Afficher le premier message d'erreur
      const firstError = result.error.errors[0];
      toast.error('Validation échouée', {
        description: firstError.message,
      });
      return;
    }

    try {
      await signIn({ email, password });
      // Réinitialiser le rate limiter en cas de succès
      loginRateLimiter.reset(rateLimitKey);
      // Redirection vers la page d'accueil après connexion réussie
      navigate('/');
    } catch (error) {
      // Enregistrer la tentative échouée
      loginRateLimiter.recordAttempt(rateLimitKey);
      
      // Vérifier si on est maintenant bloqué
      if (loginRateLimiter.isBlocked(rateLimitKey)) {
        const timeLeft = loginRateLimiter.formatRemainingTime(rateLimitKey);
        setIsBlocked(true);
        setRemainingTime(timeLeft);
      } else {
        // Afficher le nombre de tentatives restantes
        const remaining = loginRateLimiter.getRemainingAttempts(rateLimitKey);
        if (remaining <= 2) {
          toast.warning('Attention', {
            description: `Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}`,
          });
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous à votre compte LIMBOLIMBO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isBlocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Trop de tentatives</AlertTitle>
              <AlertDescription>
                Vous avez dépassé le nombre maximum de tentatives de connexion.
                Veuillez réessayer dans {remainingTime}.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/mot-de-passe-oublie"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading || isBlocked}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : isBlocked ? (
              'Trop de tentatives'
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-primary hover:underline font-medium">
            Créer un compte
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}