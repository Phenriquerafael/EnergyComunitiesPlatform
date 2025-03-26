# EnergyComunitiesPlatform 

## Doubts:
Q: How many dataset variations can exist? (Is every dataset a diferent variation or some have the same atributes)
A: Each dataset if diferent but certain atributes represent the same context value so they can be used in the same alghoritm.

Q: What are the minimal files (datasets, program files and ect.) that the system needs to fully operate? 
A: Predefined dataSet (the question would be which atributes are fundamental to the optimization process (same dataSets may variate))

Q: Como funciona o carregamento da bateria quando chega ao limite de charge e discharge
A: Check the fluxogram

## Notes
- Create plots to compare a prosumer inside and outside an energy community
- Study how tax is applied in Spain (sampleData)

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
    #Open Windows PowerShell as an admin (mouse right click)

    # Create folder (in case it doesn't exist)
    mkdir C:\gurobi  

    # Move the license to the correct folder (copy the path of the gurobi.lic downloaded file)
    Move-Item "C:\Users\phenr\Downloads\gurobi.lic" "C:\gurobi\gurobi.lic"

    #Update the ambient variable:
    setx GRB_LICENSE_FILE "C:\gurobi\gurobi.lic"

    #Close the terminal, reopen and run:
    grbprobe

    #It should show the license data

## Install GLPK

**1º** - Download the file 'glpk-4.35.tar.gz' at 'https://ftp.gnu.org/gnu/glpk/'

**2º** - Extract the Zip folder by: right clicking on the folder and then>> 7-Zip >> Extract Here as shown. Move the glpk-4.65 folder from your downloads folder to your C: drive.

**3º** - Assuming you’re using 64-bit Windows, click on the C:\glpk-4.65 folder in Windows explorer, click on the w64 folder, and select and copy the file path, which should be C:\glpk-4.65\w64.

**4º** - Search and open your Control Panel, select System and Security>>System>>Advanced system settings>>Environment Variables. Then click on ‘path’ in the top window, click the ‘Edit’ button, then ‘New’.

**5º** - Paste the file path you copied above and save.

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

DONE.

## Solution Arquitecture

### Use Case Diagram

![Use Case Diagram](CodeDocs\UseCaseDiagram\UseCaseDiagram.svg)

### Fluxogram
Level 1 

![Fluxogram1](CodeDocs\Fluxogram\Fluxogram.png)

Level 2 

![2](CodeDocs\Fluxogram\FluxogramLevel2.png)

### Domain Model

DM

(to be completed)

DDD

(to be completed)

### Class Diagram

Level 1

![](CodeDocs\ClassDiagram\ClassDiagram.png)

Level 2

![](CodeDocs\ClassDiagram\ClassDiagram2.png)

### Components Diagram

Backend

![](CodeDocs\components\componentsModelBackEnd.svg)

Level 2

![](CodeDocs\components\componentsModelLevel2.svg)

Level 3

![](CodeDocs\components\componentsModelServer.svg)

### Layers Diagram

View

![](CodeDocs\Layers\LayersView.svg)

Layout 

![](CodeDocs\Layers\LayoutLayers.svg)
