import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';
import { signupRateLimiter } from '@/lib/rateLimiter';
import { toast } from 'sonner';

export function SignupForm() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Vérifier le rate limiting
    const rateLimitKey = email || 'anonymous';
    if (signupRateLimiter.isBlocked(rateLimitKey)) {
      const timeLeft = signupRateLimiter.formatRemainingTime(rateLimitKey);
      setIsBlocked(true);
      setRemainingTime(timeLeft);
      toast.error('Trop de tentatives', {
        description: `Veuillez réessayer dans ${timeLeft}`,
      });
      return;
    }

    // Validation avec Zod
    const result = signupSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      // Extraire les erreurs de validation
      const fieldErrors: Partial<SignupFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
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
      await signUp({ email, password });
      // Réinitialiser le rate limiter en cas de succès
      signupRateLimiter.reset(rateLimitKey);
      // Redirection vers la page de connexion après inscription réussie
      navigate('/connexion');
    } catch (error) {
      // Enregistrer la tentative échouée
      signupRateLimiter.recordAttempt(rateLimitKey);
      
      // Vérifier si on est maintenant bloqué
      if (signupRateLimiter.isBlocked(rateLimitKey)) {
        const timeLeft = signupRateLimiter.formatRemainingTime(rateLimitKey);
        setIsBlocked(true);
        setRemainingTime(timeLeft);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
        <CardDescription className="text-center">
          Rejoignez LIMBOLIMBO et découvrez vos opportunités
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isBlocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Trop de tentatives</AlertTitle>
              <AlertDescription>
                Vous avez dépassé le nombre maximum de tentatives d'inscription.
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
            <p className="text-xs text-muted-foreground">
              Minimum 8 caractères avec majuscule, minuscule et chiffre
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || isBlocked}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : isBlocked ? (
              'Trop de tentatives'
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}