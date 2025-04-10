
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './admin/LoginForm';
import RegisterForm from './admin/RegisterForm';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { useToast } from '@/hooks/use-toast'; // Import toast

const Login = () => {
  const { signIn, session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast(); // Use the toast hook

  // Se o usuário já estiver logado, redireciona para home
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      // Não precisa navegar aqui, o useEffect vai lidar com isso
      // quando a sessão for atualizada
    } catch (error) {
      // Erro é tratado na função signIn
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: { email: string; password: string; confirmPassword: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      
      setActiveTab("login");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar a conta.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Área do Cliente</CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onSubmit={handleSignIn}
                isSubmitting={isSubmitting}
              />
              
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                >
                  Voltar para a página inicial
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                onSubmit={handleRegister}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
