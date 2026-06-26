const terminal=document.getElementById("text");
const terminalBox = document.getElementById("terminal");

let actualrow=0;
let indice=0;

function write(){
    const texts=[
    "    import java.util.Scanner;",
    "    public static void main(String[] args) {",
    "        int[] armazem=new int[10];",
    "        Scanner input=new Scanner(System.in);",
    "        System.out.println('Digite os valores;');",
    "        for(int i=0; i<armazem.length; i++) {",
    "           System.out.print('numero '+i+1+' :');",
    "           armazem[i]=input.nextInt();",
    "        }",
    "        int soma=0;",
    "        for(int n:armazem){",
    "            soma+=n;",
    "        }",
    "        System.out.println('Soma = '+soma);",
    "    }",
    "}"];
    const currentText= texts[actualrow];
    if(indice<currentText.length){
          terminal.textContent +=currentText[indice];
          terminalBox.scrollTop = terminalBox.scrollHeight;
        indice++;
        setTimeout(function(){
            write();
        }, 100);
    }else{
        terminal.textContent+="\n";
        actualrow++;
        indice=0;
        if(actualrow<texts.length){
            setTimeout(function(){
                write()
            },300);
        }
    }
}
setTimeout(write(),12000);

