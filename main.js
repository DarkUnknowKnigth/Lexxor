var len= {
    "letras" : "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz",
    "reservado":["true","default","main","false","void","static","class","if","while","do","for","unsigned","struct","public","const","break","else","case","continue"],
    "operadores" : "+-%*/",
    "tipoDato":["int","float","double","bool","bit","char","string","long","short"],
    "logicos" : "&<>|!=",
    "asignacion" : "=",
    "digitos" : "0123456789",
    "espacio":" ",
    "apuntador":"*",
    "negacion":"!",
    "comentario":"/*",
    "signo":"+-",
    "llaves":"\"{}()\'",
    "incremento":"+",
    "decremento":"-",
    "asignacionEspecial":"+-*/="};
// var len = JSON.parse(lenguaje);
var err=0;
var tabla_token=[];
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
        generar_reporte(tabla_token);
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
class TokenLexema{
    constructor(nombre,lenguaje,lexema){
        this.nombre=nombre;
        this.lenguaje=lenguaje;
        this.lexema=lexema;   
    }
};
function generar_reporte(array){  
    var tb = "\ntoken\t\tlenguaje\t\t\t\tlexema\n\n";

    var tobj="";
    array.forEach(element => {
        tb+=`\n${element.nombre}\t${element.lenguaje}\t${element.lexema}\n`;
        tobj+=JSON.stringify({
            "nombre":element.nombre,
            "lenguaje":element.lenguaje,
            "lexema":element.lexema});
    });
    var elem = document.getElementById('descargar');
    elem.download = "TablaTokens.txt";
    elem.href = "data:application/octet-stream,"+ encodeURIComponent(tb);   
   // console.log(tobj);    
}
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
    var token1 = new token("VARIABLE",len.letras+len.digitos);//
    var token2= new token("DIGIT",len.digitos);//
    var token3 =new token("OPERATOR",len.operadores);//
    var token4=new token("RESERVED_WORD",len.reservado);//
    var token5= new token("ASSIGNATION",len.asignacion);//
    var token6= new token("SPACE",len.espacio);//
    var token7= new token("SIGNED_INTEGER",len.digitos+len.signo);
    var token8=new token("POINTER",len.apuntador+len.letras+len.digitos);
    var token9=new token("NOT",len.negacion+len.letras+len.digitos);
    var token10=new token("LOGIC",len.logicos);
    var token11=new token("COMMENT",len.comentario);
    var token12=new token("KEY",len.llaves);
    var token13=new token("INCREMENT",len.incremento);
    var token14=new token("DECREMENT",len.decremento);
    var token15=new token("ESPECIAL_ASSIGNATION",len.asignacionEspecial);
    var token16=new token("DATA_TYPE",len.tipoDato);
    for(let i=0;i<lineas.length-1;i++)
    {
        document.getElementById("tbody").innerHTML+="<tr class='line-error'><td colspan='3'>Linea "+(i+1)+": "+lineas[i]+"</td></tr>";
        document.getElementById("tbody2").innerHTML+="<tr class='line'><td colspan='2'>Linea "+(i+1)+"</td></tr>";
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
                if(es(cad[j],len.letras))
                {
                    
                    len.reservado.forEach(element =>{
                        if(element==cad[j])
                        {
                            reservado(cad[j],j,element);//P reservadas
                            res=true;
                            
                        }
                        
                    });
                    len.tipoDato.forEach(element =>{
                        if(element==cad[j])
                        {
                            tipodato(cad[j],j,element);//tipo dato
                            res=true;
                            
                        }
                        
                    });
                    
                    if(!res)
                    {
                        noyet=true;
                        variable(cad[j],token1,j,i);
                    }
                }
                else
                {
                    if(es(cad[j],token2.lenguaje))
                    {
                        noyet=true;
                        num(cad[j],j,token2.nombre);//digitos
                    }
                    else{
                        if(es(cad[j],token1.lenguaje) && !res && !noyet)
                        {
                            variable(cad[j],token1,j,i);//variables
                        }
                        else{
                            if(es(cad[j],token3.lenguaje))
                            {
                                op(cad[j],j,token3.nombre);//operadores
                            }
                            else
                            {
                                if(es(cad[j],token5.lenguaje) && cad[j].length==1)
                                {
                                    asig(cad[j],j,token5.nombre);//asignacion
                                }
                                else{
                                    if(es(cad[j],token7.lenguaje))//numero con signo
                                    {
                                        let p=false
                                        if(cad[j].length>=2 && (cad[j][0]=="-" || cad[j][0]=="+"))
                                        {
                                            for (let i = 0; i < cad[j].length; i++) 
                                            {
                                                if(i==0)
                                                {
                                                    if(len.signo.indexOf(cad[j][i])>=0 )
                                                    {
                                                        p=true;
                                                    }
                                                    else
                                                    {
                                                        p=false;
                                                        err++;
                                                        //la cadena no empieza  con + o -
                                                        document.getElementById("tbody").innerHTML+="<tr><td>"+token7.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no empieza con + o -</td></tr>";
                                                        document.getElementById("err").innerText=err;
                                                    }
                                                }
                                                else
                                                {
                                                    if(len.digitos.indexOf(cad[j][i])>=0)
                                                    {
                                                        p=true;
                                                    }
                                                    else
                                                    {
                                                        p=false;
                                                        err++;
                                                        //la no es numero
                                                        document.getElementById("tbody").innerHTML+="<tr><td>"+token7.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un numero</td></tr>";
                                                        document.getElementById("err").innerText=err;                            
                                                    }
                                                }     
                                            }
                                            if(p)
                                            {
                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token7.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                tabla_token.push(new TokenLexema(token7.nombre,len.signos+len.digitos,cad[j]));
                                            }
                                        }
                                    }
                                    else{
                                        if(es(cad[j],token8.lenguaje))//puntero
                                        {
                                            let p=false;
                                            if(cad[j].length>=2 && cad[j][0]=="*")
                                            {
                                                for (let i = 0; i < cad[j].length; i++) 
                                                {
                                                    
                                                    if(i==0)
                                                    {
                                                        if(cad[j][i]=="*")
                                                        {
                                                            p=true;
                                                        }
                                                        else{
                                                            p=false;
                                                            err++;
                                                            //la no es puntero
                                                            document.getElementById("tbody").innerHTML+="<tr><td>"+token8.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                            document.getElementById("err").innerText=err;      
                                                        }
                                                    }   
                                                    else
                                                    {
                                                        if(i==1)
                                                        {
                                                            if(len.letras.indexOf(cad[j][i])>=0)
                                                            {
                                                                p=true;
                                                            }
                                                            else
                                                            {
                                                                p=false;
                                                                err++;
                                                                //la no es puntero
                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token8.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                document.getElementById("err").innerText=err;   
                                                            }
                                                        }
                                                        else
                                                        {
                                                            if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                            {
                                                                p=true;
                                                            }
                                                            else
                                                            {
                                                                p=false;
                                                                err++;
                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token8.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                document.getElementById("err").innerText=err;   
                                                            }
                                                        }
                                                    }
                                                }
                                                if(p)
                                                {
                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token8.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                    tabla_token.push(new TokenLexema(token8.nombre,token8.lenguaje,cad[j]));
                                                }
                                            }  
                                        }
                                        else
                                        {
                                            if(es(cad[j],token9.lenguaje))//negar
                                            {
                                                let p=false;
                                                if(cad[j][0]=="!" && cad[j].length>1)
                                                {
                                                    for(let i=1;i<cad[j].length;i++)
                                                    {
                                                        if(i==1)
                                                        {
                                                            if(len.letras.indexOf(cad[j][i])>=0)
                                                            {
                                                                p=true;
                                                            }
                                                            else
                                                            {
                                                                p=false;
                                                                err++;
                                                                //la no es puntero
                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token9.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es una negacion</td></tr>";
                                                                document.getElementById("err").innerText=err;   
                                                            }
                                                        }
                                                        else
                                                        {
                                                            if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                            {
                                                                p=true;
                                                            }
                                                            else
                                                            {
                                                                p=false;
                                                                er++;
                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token9.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                document.getElementById("err").innerText=err;   
                                                            }
                                                        }

                                                    }
                                                    if(p)
                                                    {
                                                        document.getElementById("tbody2").innerHTML+="<tr><td>"+token9.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                        tabla_token.push(new TokenLexema(token9.nombre,token9.lenguaje,cad[j]));
                                                    }
                                                }
                                            } 
                                            else
                                            {
                                                if(es(cad[j],token10.lenguaje))//logico
                                                {
                                                    if(len.logicos.indexOf(cad[j][0])>=0 && cad[j].length<=2 && cad[j].length>0)
                                                    {
                                                        switch(cad[j])
                                                        {
                                                            case '<':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '>':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '!':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '==':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '<=':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '>=':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '!=':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            case '&&':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));  
                                                            break;
                                                            case '||':
                                                                document.getElementById("tbody2").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                tabla_token.push(new TokenLexema(token10.nombre,token10.lenguaje,cad[j]));
                                                            break;
                                                            default:
                                                                err++;
                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token10.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j]+"<br>  posicion("+(1)+")</td><td>no es indicador logico</td></tr>";
                                                                document.getElementById("err").innerText=err;  
                                                            break;                                                          
                                                        }
                                                    }
                                                }
                                                else
                                                {
                                                    if(es(cad[j],token12.lenguaje))//llaves
                                                    {
                                                        if(len.llaves.indexOf(cad[j][0])>=0 && cad[j].length==1)
                                                        {
                                                            switch(cad[j])
                                                            {
                                                                case '"':
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                case "'":
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                case '}':
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                case '{':
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                case ')':
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                case '(':
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token12.nombre,token12.lenguaje,cad[j]));
                                                                break;
                                                                default:
                                                                    err++;
                                                                    document.getElementById("tbody").innerHTML+="<tr><td>"+token12.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j]+"<br>  posicion("+(1)+")</td><td>no una llave</td></tr>";
                                                                    document.getElementById("err").innerText=err;  
                                                                break;                                                          
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if(es(cad[j],token13.lenguaje+len.letras+len.digitos))//increment
                                                        {
                                                            if(cad[j][0]=="+" && cad[j][1]=="+" && cad[j].length>2)
                                                            {
                                                                let p=false;
                                                                for (let i = 2; i < cad[j].length; i++) 
                                                                {
                                                                    if(i==2)
                                                                    {
                                                                        if(len.letras.indexOf(cad[j][i])>=0)
                                                                        {
                                                                            p=true;
                                                                        }
                                                                        else
                                                                        {
                                                                            p=false;
                                                                            err++;
                                                                            document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es una negacion</td></tr>";
                                                                            document.getElementById("err").innerText=err;   
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                                        {
                                                                            p=true;
                                                                        }
                                                                        else
                                                                        {
                                                                            p=false;
                                                                            er++;
                                                                            document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                            document.getElementById("err").innerText=err;   
                                                                        }
                                                                    }                                             
                                                                }  
                                                                if(p)
                                                                {
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token13.nombre,token13.lenguaje+len.digitos+len.letras,cad[j]));
                                                                }
                                                            }
                                                            else
                                                            {
                                                                let p=false;
                                                                for (let i = 0; i < cad[j].length-2; i++) 
                                                                {
                                                                    if(i==0)
                                                                    {
                                                                        if(len.letras.indexOf(cad[j][i])>=0)
                                                                        {
                                                                            p=true;
                                                                        }
                                                                        else
                                                                        {
                                                                            p=false;
                                                                            err++;
                                                                            //la no es puntero
                                                                            document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es una negacion</td></tr>";
                                                                            document.getElementById("err").innerText=err;   
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                                        {
                                                                            p=true;
                                                                        }
                                                                        else
                                                                        {
                                                                            p=false;
                                                                            er++;
                                                                            document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                            document.getElementById("err").innerText=err;   
                                                                        }
                                                                    }                                             
                                                                }  
                                                                if(p && cad[j][cad[j].length-1]=="+" && cad[j][cad[j].length-2]=="+")
                                                                {
                                                                    document.getElementById("tbody2").innerHTML+="<tr><td>"+token14.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                    tabla_token.push(new TokenLexema(token14.nombre,token14.lenguaje+len.digitos+len.letras,cad[j]));
                                                                }
                                                            }     
                                                        }
                                                        else
                                                        {
                                                            if(es(cad[j],token14.lenguaje+len.letras+len.digitos))//decrement
                                                            {
                                                                if(cad[j][0]=="-" && cad[j][1]=="-" && cad[j].length>2)
                                                                {
                                                                    let p=false;
                                                                    for (let i = 2; i < cad[j].length; i++) 
                                                                    {
                                                                        if(i==2)
                                                                        {
                                                                            if(len.letras.indexOf(cad[j][i])>=0)
                                                                            {
                                                                                p=true;
                                                                            }
                                                                            else
                                                                            {
                                                                                p=false;
                                                                                err++;
                                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token14.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es una negacion</td></tr>";
                                                                                document.getElementById("err").innerText=err;   
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                                            {
                                                                                p=true;
                                                                            }
                                                                            else
                                                                            {
                                                                                p=false;
                                                                                er++;
                                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token14.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                                document.getElementById("err").innerText=err;   
                                                                            }
                                                                        }                                             
                                                                    }  
                                                                    if(p)
                                                                    {
                                                                        document.getElementById("tbody2").innerHTML+="<tr><td>"+token14.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                        tabla_token.push(new TokenLexema(token14.nombre,token14.lenguaje+len.digitos+len.letras,cad[j]));
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    let p=false;
                                                                    for (let i = 0; i < cad[j].length-2; i++) 
                                                                    {
                                                                        if(i==0)
                                                                        {
                                                                            if(len.letras.indexOf(cad[j][i])>=0)
                                                                            {
                                                                                p=true;
                                                                            }
                                                                            else
                                                                            {
                                                                                p=false;
                                                                                err++;
                                                                                //la no es puntero
                                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es una negacion</td></tr>";
                                                                                document.getElementById("err").innerText=err;   
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            if((len.letras+len.digitos).indexOf(cad[j][i])>=0)
                                                                            {
                                                                                p=true;
                                                                            }
                                                                            else
                                                                            {
                                                                                p=false;
                                                                                er++;
                                                                                document.getElementById("tbody").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+j+"<br><b>Cadena:</b> "+cad[j]+"<br>caracter: "+cad[j][i]+"<br>  posicion("+(i+1)+")</td><td>no es un puntero</td></tr>";
                                                                                document.getElementById("err").innerText=err;   
                                                                            }
                                                                        }                                             
                                                                    }  
                                                                    if(p && cad[j][cad[j].length-1]=="-" && cad[j][cad[j].length-2]=="-")
                                                                    {
                                                                        document.getElementById("tbody2").innerHTML+="<tr><td>"+token13.nombre+"</td><td><b>Palabra Numero: </b>"+j+" <b><br>Cadena:</b> "+cad[j];
                                                                        tabla_token.push(new TokenLexema(token13.nombre,token13.lenguaje+len.digitos+len.letras,cad[j]));
                                                                    }
                                                                }     
                                                            }
                                                            else
                                                            {
                                                                error(cad[j],{"nombre":"ERROR","lenguaje":" "},j);
                                                            }    
                                                        }    
                                                    }
                                                }
                                            } 
                                        }
                                    }
                                }
                            }
                        }
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
            document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td><b><b>Palabra Numero:</b></b> "+npalabra+"<br><b>Cadena:</b> "+cadena+"<br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td>Token no identificado :(</td></tr>";
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
    if(cadena.length==1)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td><b>Palabra Numero: </b>"+npalabra+" <b><br>Cadena:</b> "+cadena;
        tabla_token.push(new TokenLexema(token,len.operadores,cadena));
    }
}
function asig(cadena,npalabra,token)
{
    if(cadena.length==1)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td><b>Palabra Numero: </b>"+npalabra+" <b><br>Cadena:</b> "+cadena;
        tabla_token.push(new TokenLexema(token,len.asignacion,cadena));
    }
}
function reservado(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>RESERVADA->"+token+"</td><td><b>Palabra Numero: </b>"+npalabra+" <b><br>Cadena:</b> "+cadena;
    tabla_token.push(new TokenLexema(token,len.reservado,cadena));
}
function tipodato(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>DATA_TYPE->"+token+"</td><td><b>Palabra Numero: </b>"+npalabra+" <b><br>Cadena:</b> "+cadena;
    tabla_token.push(new TokenLexema(token,len.reservado,cadena));
}
function num(cadena,npalabra,token)
{
    document.getElementById("tbody2").innerHTML+="<tr><td>"+token+"</td><td><b>Palabra Numero: </b>"+npalabra+" <b><br>Cadena:</b> "+cadena;
    tabla_token.push(new TokenLexema(token,len.digitos,cadena));
}
function variable(cadena,token,npalabra,nlinea){
    var pass=true;
    npalabra+=1;
    for (let i = 0; i < cadena.length; i++) {
       
        if(i==0)
        {
            if(len.digitos.indexOf(cadena[i])==-1)
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
                    document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td><b>Palabra Numero: </b> "+npalabra+"<b><br>Cadena:</b> "+cadena+"<br>caracter: "+cadena[i]+"<br>posicion("+(i+1)+")</td><td> caracter no pertenece al lenguaje</td></tr>";
                }
            }
            else
            {
                err++;
                pass=false;
                //la cadena empieza con cero o no pertenece al lenguaje
                document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td><b>Palabra Numero: </b> "+npalabra+"<b><br>Cadena:</b> "+cadena+" <br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td> variable inicia con numero</td></tr>";
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
                document.getElementById("tbody").innerHTML+="<tr><td>"+token.nombre+"</td><td><b>Palabra Numero:</b> "+npalabra+"<b><br>Cadena:</b> "+cadena+"<br>caracter: "+cadena[i]+"<br>  posicion("+(i+1)+")</td><td> la variable no pertenece al lenguaje</td></tr>";
            } 
        }
    }
    if(pass)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token.nombre+"</td><td><b>Palabra:</b> "+npalabra+" <b><br>Cadena:</b> "+cadena;
        tabla_token.push(new TokenLexema(token.nombre,token.lenguaje,cadena));
    }
 }
 function espacio(caracter,token,npalabra)
 {
     npalabra+=1;
    if(token.lenguaje.indexOf(caracter)>=0)
    {
        document.getElementById("tbody2").innerHTML+="<tr><td>"+token.nombre+"</td><td><b>Palabra Numero:</b> "+npalabra+" <b><br>Cadena:</b> "+caracter;
        tabla_token.push(new TokenLexema(token.nombre,token.lenguaje,caracter));
    }
    else
    {
    }
 }
 