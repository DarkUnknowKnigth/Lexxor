#include <stdio.h>
#define TAM 6

int main()
{

    int lista[TAM]={12,10,5,6,1,3};	 //Declaracion e Inicializacion de un array
    int temp=0; 			 //Variable temporal
    int i,j;			 //variables corredoras del ciclo

    printf("La lista DESORDENADA es: \n");

    for (i=0;i<TAM;i++)
    printf("%3d",lista[i]);	//impresion de la lista con espacio de 3 lineas (%3d)

    for (i=1;i<TAM;i++)
    {
        for (j=0;j<TAM-1;j++)
        {
            if (lista[j] > lista[j+1])	 //condicion
            {
                temp = lista[j];	 //temp guarda momentaneamente el valor de lista[j]
                lista[j]=lista[j+1];  //Asigno al la posicion lista[j], lo que hay en lista[j+1]
                lista[j+1]=temp;	//obtendra un nuevo valor por parte de temp.
            }
        }

    }

    printf("\nLos valores ORDENADOS de lista son: \n");
    for(i=0;i<TAM;i++)
        printf("%3d",lista[i]);

    return 0;
}
