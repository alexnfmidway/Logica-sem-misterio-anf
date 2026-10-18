using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace algoritmos
{
    public class VolumeCaixaDagua
    {
        public static void Executar()
        {
            Console.WriteLine("Digite o comprimento da caixa: ");
            double comprimento = double.Parse(Console.ReadLine());
            Console.WriteLine("Digite a largura da caixa: ");
            double largura = double.Parse(Console.ReadLine());
            Console.WriteLine("Digite a altura da caixa: ");
            double altura = double.Parse(Console.ReadLine());
            CalcularVolume(comprimento, largura, altura);
        }
        public static void CalcularVolume(double comprimento, double largura, double altura)
        {
            double volume = comprimento * largura * altura;
            Console.WriteLine($"O volume da caixa é: {volume}");
        }
    }
}