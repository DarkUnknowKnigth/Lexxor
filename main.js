var len= {
    "letras" : "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz",
    "reservado":["int","true","default","false","void","static","class","char","bool","float","if","while","do","for","double","long","short","unsigned","struct","public","const","short","break","else","case","continue"],
    "signos" : "+-%*/",
    "logicos" : "&|!=",
    "asignacion" : "=",
    "numeros" : "0123456789",
    "espacio":" "};
// var len = JSON.parse(lenguaje);
var err=0;
window.onload=()=>
{
    vistas=document.getElementsByClassName("view");
    analizador=document.getElementById('a');
    errores=document.getElementById('e');
    document.getElementById('analizador').onclick=()=>{
        visible(vistas,analizador);
    };
    document.getElementById('errores').onclick=()=>{
        visible(vistas,errores);
    };
    document.getElementById('analiza').onclick=()=>{
        err=0;
        document.getElementById("tbody").innerHTML="";
        document.getElementById("tbody2").innerHTML="";
        analizar(document.getElementById('texto').value); 
        document.getElementById("errores").click();       
    };
    window.onkeypress=(e)=>{
        if(e.keyCode==10 && e.ctrlKey)
        {
            document.getElementById("analiza").click();  
        }
        if(e.keyCode==127 && e.ctrlKey)
        {
            document.getElementById("analizador").click();  
        }
        if(e.keyCode==13 && e.shiftKey)
        {   
            document.getElementById('texto').focus();
            e.preventDefault();
        }
    };
};
class token {
    constructor(nombre, lenguaje) {
        this.nombre = nombre;
        this.lenguaje = lenguaje;
    }
};

function visible(array,si)
{
    for (let i = 0; i < array.length; i++) {
        if(array[i].className.indexOf('visible')!=-1)
        {       
            array[i].classList.remove("visible");
        }      
        if(array[i].className.indexOf('novisible')!=-1)
        {       
            array[i].classList.remove("novisible");
        } 
        if(array[i]== si)
        {       
            array[i].className+=" visible";
        }   
        else
        {
            array[i].className+=" novisible";
        }
    } 
}
function analizar(cadena) 
{  
    if(cadena.indexOf(";")==-1)
    {
        err++;
        document.getElementById("err").innerText=err;
        document.getElementById("tbody").innerHTML+="<tr><td colspan='3'>Error de sintaxis <br> Las sentencias deben terminar con punto y coma</td></tr>";
    }
    else{

    }
    var lineas=cadena.split(";");//dividir en lineas
    var token1 = new token("VARIABLE",len.letras+len.numeros);//
    var token2= new token("NUMERO",len.numeros);//
    var token3 =new token("OPERADOR",len.signos);//
    var token4=new token("RESERVADA",len.reservado);//
    var token5= new token("ASIGNACION",len.asignacion);//
    var token6= new token("ESPACIO",len.espacio);//
    for(let i=0;i<lineas.length-1;i++)
    {
        document.getElementById("tbody").innerHTML+="<tr><td colspan='3'>Linea "+(i+1)+": "+lineas[i]+"</td></tr>";
        document.getElementById("tbody2").innerHTML+="<tr><td colspan='2'>Linea "+(i+1)+"</td></tr>";
        cad=lineas[i].split(" ");//dividir las lineas en palabras
        for(let j=0;j<cad.length;j++)
        {
            var res=false;
            var noyet=false;
            cad[j]=cad[j].replace("\n","");
            if(cad[j]=="")
            {
                espacio(" ",token6,j); //espacio
            }
            else
            {
                if(cad[j]=="")
                {
                }
                else
                {
                    if(es(cad[j],len.letras))
                    {
                        
                        len.reservado.forEach(element =>{
                            if(element==cad[j])
                            {
                                reservado(cad[j],j,element);//P reservadas
                                res=true;
                                
                            }
                            
                        });
                        if(!res)
                        {
                            noyet=true;
                            variable(cad[j],token1,j,i);
                        }
                    }
                    if(es(cad[j],token2.lenguaje))
                    {
                        num(cad[j],j,token2.nombre);//numeros
                    }
                    if(es(cad[j],token3.lenguaje))
                    {
                        op(cad[j],j,token3.nombre);//operadores
                    }
                    if(es(cad[j],token5.lenguaje))
                    {
                        op(cad[j],j,token5.nombre);//asignacion
                    }
                    if(es(cad[j],token1.lenguaje) && !res && !noyet)
                    {
                        variable(cad[j],token1,j,i);//variables
                    }
                    else
                    {
                        error(cad[j],{"nombre":"ERROR","lenguaje":len.letras+len.numeros},j);
                    }
                }    
            }   
        }
    }
}
function error(cadena,token,npalabra)
{
    npalabra+=1;
    for (let i = 0; i < cadena.length; i++) 
    {
        if(token.lenguaje.indexOf(cadena[i])>=0)
        {
            //la cadena pertenece al lenguaje
        }  
        else
        {
            err++;
            //la cadena empieza con cero o no pertenece al lenguaje
            document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero: "+npalabra+"<br>Cadena: "+cadena+"<br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td>Caracter no pertenece al lenguaje</td></tr>";
            document.getElementById("err").innerText=err;
        } 
    }
}
function es(cadena,lenguaje)
{
    pass=true;
    for (let i = 0; i < cadena.length; i++) {
        if(lenguaje.indexOf(cadena[i])==-1)
        {
            pass=false;
        }
        
    }
    return pass;
}
function op(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td>Palabra Numero:"+npalabra+" Cadena: "+cadena;

}
function reservado(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td>Palabra Numero:"+npalabra+" Cadena: "+cadena;
}
function num(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td>Palabra Numero:"+npalabra+" Cadena: "+cadena;
}
function variable(cadena,token,npalabra,nlinea){
    var pass=true;
    npalabra+=1;
    for (let i = 0; i < cadena.length; i++) {
       
        if(i==0)
        {
            if(len.numeros.indexOf(cadena[i])==-1)
            {
                //cadena no empieza con numero
                if(token.lenguaje.indexOf(cadena[i])>=0)
                {
                    //la cadena pertenece al lenguaje
                }
                else
                {
                    err++;
                    pass=false;
                    document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero: "+npalabra+"<br>Cadena: "+cadena+"<br>caracter: "+cadena[i]+"<br>posicion("+(i+1)+")</td><td> caracter no pertenece al lenguaje</td></tr>";
                }
            }
            else
            {
                err++;
                pass=false;
                //la cadena empieza con cero o no pertenece al lenguaje
                document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero: "+npalabra+"<br>Cadena: "+cadena+" <br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td> variable inicia con numero</td></tr>";
            }
        }
        else
        {
            if(token.lenguaje.indexOf(cadena[i])>=0)
            {
                //la cadena pertenece al lenguaje
            }  
            else
            {
                err++;
                pass=false;
                //la cadena empieza con cero o no pertenece al lenguaje
                document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero: "+npalabra+"<br>Cadena: "+cadena+"<br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td> la variable no pertenece al lenguaje</td></tr>";
            } 
        }
    }
    if(pass)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero:"+npalabra+" Cadena: "+cadena;
    }
 }
 function espacio(caracter,token,npalabra)
 {
     npalabra+=1;
    if(token.lenguaje.indexOf(caracter)>=0)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token.nombre+"</td><td>Palabra Numero:"+npalabra+" Cadena: "+caracter;
    }
    else
    {
        
    }
 }
 