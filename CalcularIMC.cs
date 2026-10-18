public class CalcularIMC
{
    public static void Executar()
    {
        Console.WriteLine("Digite seu peso: ");
        double peso = double.Parse(Console.ReadLine());
        Console.WriteLine("Digite sua altura: ");
        double altura = double.Parse(Console.ReadLine());
        Calcular(peso, altura);
    }
    public static void Calcular(double peso, double altura)
    {
        double imc = peso / (altura * altura);
        Console.WriteLine($"Seu IMC é: {imc}");
    } 
}   