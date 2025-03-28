# EnergyComunitiesPlatform

## Doubts:
Q: How many dataset variations can exist? (Is every dataset a diferent variation or some have the same atributes)
A: Each dataset if diferent but certain atributes represent the same context value so they can be used in the same alghoritm.

Q: What are the minimal files (datasets, program files and ect.) that the system needs to fully operate? 
A:

## System Interation:

1º Dataset 
2º Read Datasets 
3º Optimize Data
4º Calculate prices and results
5º Return Arrays with results

## Interface:

- System to read the data 
- System to store the data in a database
- System to store the program methods
- System to store the results in a database
- System to show the data
- System to manipulate the data or show charts and tables 
- Function to show data loading

# Setup


## Install Python
Download the installer at 'https://www.python.org/downloads/' and follow the instructions

## Install gorubi:

1º Download gurobi from 'https://www.gurobi.com/downloads/gurobi-software/' (my case: x64 windows ) 

2º Create an account and Get Academic license for 1 year at https://portal.gurobi.com/iam/licenses/list/

3º Download the gurobi.lic file and follow these instructions:
    #Abrir Windows PowerShell como administrador (botão direito do rato no wpsh)

    # Criar a pasta (caso não exista)
    mkdir C:\gurobi  

    # Mover a licença para a pasta correta (copiar o caminho do ficheiro gurobi.lic transferido)
    Move-Item "C:\Users\phenr\Downloads\gurobi.lic" "C:\gurobi\gurobi.lic"

    #Atualizar a variável de ambiente:
    setx GRB_LICENSE_FILE "C:\gurobi\gurobi.lic"

    #Fechar e reabrir o terminal e testar com:
    grbprobe

    #Deverá mostrar os dados da licença

## Install GLPK

1º Download the flie 'glpk-4.35.tar.gz' at 'https://ftp.gnu.org/gnu/glpk/'

2º Extract the Zip folder by: right clicking on the folder and then>> 7-Zip >> Extract Here as shown. Move the glpk-4.65 folder from your downloads folder to your C: drive.

3º Assuming you’re using 64-bit Windows, click on the C:\glpk-4.65 folder in Windows explorer, click on the w64 folder, and select and copy the file path, which should be C:\glpk-4.65\w64.

4º Search and open your Control Panel, select System and Security>>System>>Advanced system settings>>Environment Variables. Then click on ‘path’ in the top window, click the ‘Edit’ button, then ‘New’.

5º Paste the file path you copied above and save.

## Install Libraries 

Enter the project, open the terminal and run:

    pip install scipy

    pip install numpy

    pip install pandas
    
    pip install pyomo
    
    pip install matplotlib

    pip install pulp

    pip install envs

    pip install openpyxl

Finally run:

    py satcomm-scen4.py

Note: Every time you want to re run the program you have to delete the sampledata and results files and paste the ones in originData    

DONE.





