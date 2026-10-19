namespace algoritmos
{
    public class Program
    {
        private static readonly (string Nome, Action Executar)[] Exercicios =
        {
            ("Classificar triângulo", ClassificarTriangulo.Executar),
            ("Par/ímpar e positivo/negativo", ParImparPositivoNegativo.Executar),
            ("Calcular IMC", CalcularIMC.Executar),
            ("Volume da caixa d'água", VolumeCaixaDagua.Executar),
        };

        public static void Main(string[] args)
        {
            Console.WriteLine("Exercícios disponíveis:");
            for (int indice = 0; indice < Exercicios.Length; indice++)
            {
                Console.WriteLine($"{indice + 1}. {Exercicios[indice].Nome}");
            }

            Console.Write("Escolha um exercício: ");
            if (int.TryParse(Console.ReadLine(), out int escolha) && escolha >= 1 && escolha <= Exercicios.Length)
            {
                Console.WriteLine();
                Exercicios[escolha - 1].Executar();
            }
            else
            {
                Console.WriteLine($"Opção inválida. Digite um número de 1 a {Exercicios.Length}.");
            }
        }
    }
}
