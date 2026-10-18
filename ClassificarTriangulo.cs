public class ClassificarTriangulo
{
    public static void Executar()
    {
        Console.Write("Lado A (cm): ");
        double ladoA = LerMedida();

        Console.Write("Lado B (cm): ");
        double ladoB = LerMedida();

        Console.Write("Lado C (cm): ");
        double ladoC = LerMedida();

        if (!PodeFormarTriangulo(ladoA, ladoB, ladoC))
        {
            Console.WriteLine("Essas medidas não formam um triângulo.");
            Console.WriteLine("Cada par de lados precisa somar mais que o terceiro.");
            return;
        }

        string tipo = Classificar(ladoA, ladoB, ladoC);
        Console.WriteLine($"As medidas formam um triângulo {tipo}.");
    }

    private static double LerMedida()
    {
        while (true)
        {
            if (double.TryParse(Console.ReadLine(), out double medida) && medida > 0)
            {
                return medida;
            }

            Console.Write("Informe um número positivo: ");
        }
    }

    private static bool PodeFormarTriangulo(double a, double b, double c)
    {
        return a + b > c && a + c > b && b + c > a;
    }

    private static string Classificar(double a, double b, double c)
    {
        if (a == b && b == c)
        {
            return "equilátero";
        }

        if (a == b || a == c || b == c)
        {
            return "isósceles";
        }

        return "escaleno";
    }
}
