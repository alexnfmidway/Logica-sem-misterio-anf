public class ParImparPositivoNegativo
{
    public static void Executar()
    {
        Console.WriteLine("Digite um número: ");
        int valor = int.Parse(Console.ReadLine());
        ClassificarNumero(valor);
    }

    public static void ClassificarNumero(int valor)
    {
        var paridade = valor % 2 == 0 ? "par" : "ímpar";
        var sinal = valor > 0 ? "positivo" : valor < 0 ? "negativo" : "zero";
        Console.WriteLine($"O número {valor} é {paridade} e {sinal}.");
    }
}