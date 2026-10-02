# Manual de instalación

## SISCON-Q

**Sistema de Cotización Inteligente para Construcción y Quinchos**

---

## ¿Qué es SISCON-Q?

SISCON-Q es una plataforma web que permite obtener **presupuestos de obras de construcción y de quinchos de forma rápida, clara y automática**, sin depender de cálculos hechos a mano.

Dicho de forma simple: en lugar de contactar a una empresa y esperar horas o incluso días a que alguien haga las cuentas, la persona entra al sistema, indica qué quiere construir y el sistema le calcula un costo estimado al instante. El sistema incluye además un **asistente de inteligencia artificial** que acompaña y orienta durante todo el proceso.

### ¿Qué problema resuelve?

Hoy, en Maldonado y en otras zonas de Uruguay, muchas empresas del rubro arman sus presupuestos de manera manual: con calculadora, planillas de Excel, anotaciones en papel y consultas constantes con los clientes. Esto fue identificado a través de conversaciones con empresas reales del sector, como Quinchos Sosa y Richard Sonderegger Construcción.

Esa forma de trabajar trae varias consecuencias:

- **Esperas largas**: obtener un precio puede tardar horas o días.
- **Errores**: al calcular a mano materiales, mano de obra y precios finales es fácil equivocarse.
- **Presupuestos poco uniformes**: dos trabajos parecidos pueden terminar con criterios de cálculo distintos.
- **Poca claridad para quien consulta**: no se ven precios inmediatos ni se pueden comparar fácilmente distintas opciones de materiales.
- **Consultas repetitivas**: las empresas deben responder una y otra vez las mismas preguntas sobre materiales, precios y diseños.

SISCON-Q nace para automatizar y ordenar este proceso.

### ¿Cómo funciona?

**Para quien necesita un presupuesto:**

1. Elige el tipo de obra que quiere realizar.
2. Ingresa las medidas.
3. Selecciona los materiales y define sus preferencias.
4. El sistema calcula en el momento el costo estimado de materiales y mano de obra.

**Asistente de inteligencia artificial:** orienta durante la cotización, responde dudas técnicas frecuentes, recomienda materiales según el presupuesto disponible y sugiere alternativas más económicas o más adecuadas para cada proyecto. Funciona de forma local, es decir, dentro de la propia computadora donde se instala el sistema.

**Para la empresa (administración):** desde un mismo lugar se pueden administrar los materiales, actualizar precios, definir costos de mano de obra, gestionar los tipos de obra, ver las cotizaciones generadas por los clientes y darles seguimiento, manteniendo toda la información organizada.

### ¿Qué se logra con el sistema?

- Presupuestos en tiempo real, con mucho menos tiempo de espera.
- Menos errores de cálculo.
- Presupuestos más estandarizados y consistentes.
- Información más clara e inmediata para decidir y comparar opciones.
- Menos consultas repetitivas gracias al asistente de IA.
- Toda la información de clientes, materiales y cotizaciones centralizada en una sola plataforma.

### Tipos de obra contemplados

A lo largo del desarrollo, el sistema fue ampliando su alcance. Además de la cotización de obras de construcción y de quinchos, se incorporó la presupuestación de reformas y de requinchos.

Estos tipos de obra guardan una estrecha relación entre sí; no obstante, cada estimación cuenta con su propio cálculo y responde de manera diferente al proceso de presupuestación, ya que cada tipo de obra posee características propias.

¿Qué se logra con el sistema?
Presupuestos en tiempo real, con mucho menos tiempo de espera.
Menos errores de cálculo.
Presupuestos más estandarizados y consistentes.
Información más clara e inmediata para decidir y comparar opciones.
Menos consultas repetitivas gracias al asistente de IA.
Toda la información de clientes, materiales y cotizaciones centralizada en una sola plataforma.

Esta guía explica, paso a paso, cómo instalar y poner en marcha el sistema.

---

## Herramientas utilizadas y para qué sirve cada una

| Herramienta | ¿Para qué sirve en SISCON-Q? |
|---|---|
| **SQL Server** | Base de datos donde se guarda toda la información (empresas, presupuestos, proyectos). |
| **SQL Server Management Studio (SSMS) 22** | Programa para administrar la base de datos e importar el backup. |
| **Node.js (v20 o superior) y npm** | Entorno que ejecuta el sistema y descarga sus dependencias. |
| **Express** | Servidor del *backend*: recibe las solicitudes de la aplicación y responde. |
| **TypeScript** | Lenguaje del backend; hace el código más ordenado y con menos errores. |
| **mssql** | Conecta el backend con SQL Server. |
| **multer** | Permite subir archivos al sistema. |
| **nodemailer** | Envía correos electrónicos desde el sistema. |
| **dotenv** | Guarda configuraciones privadas (claves, conexión) fuera del código. |
| **cors** | Permite que el frontend se comunique con el backend. |
| **ollama (paquete)** | Conecta el backend con el modelo de IA local. |
| **React + Vite** | Construyen la interfaz (*frontend*) que usa el cliente en el navegador. |
| **Ollama + modelo Gemma** | Motor de IA local que genera las recomendaciones. |
| **Git, GitHub y Visual Studio Code** | Para descargar (clonar) el proyecto y abrirlo para su ejecución. |

---

## Requisitos previos

Instalá lo siguiente antes de empezar:

1. [Git](https://git-scm.com/downloads)
2. [Visual Studio Code](https://code.visualstudio.com/)
3. [Node.js](https://nodejs.org/) versión **20 o superior** (incluye npm)
4. [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) y [SQL Server Management Studio 22](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)
5. [Ollama](https://ollama.com/download)

---

## 1. Clonar el repositorio en Visual Studio Code

1. Abrí **Visual Studio Code**.
2. Presioná `Ctrl + Shift + P` para abrir la paleta de comandos y escribí **Git: Clone**.
3. Pegá la URL del repositorio de GitHub:
   ```
   https://github.com/<usuario>/<repositorio>.git
   ```
4. Elegí la carpeta donde querés guardarlo y, cuando VS Code lo pregunte, hacé clic en **Open** (abrir).

Alternativamente, desde una terminal:

```bash
git clone https://github.com/<usuario>/<repositorio>.git
cd <repositorio>
```

---

## 2. Importar la base de datos en SQL Server

1. Abrí **SQL Server Management Studio 22** y conectate a tu servidor.
2. En el panel izquierdo, clic derecho sobre **Databases** → **Restore Database…** (Restaurar base de datos).
3. Elegí **Device** y hacé clic en `...` → **Add** → seleccioná el archivo de backup **`SISCONQ.bak`** incluido en el repositorio.
4. Presioná **OK** y esperá a que finalice la restauración.
5. Verificá que la base de datos aparezca en la lista de **Databases**.

### Credenciales de acceso a la base de datos

Restaurar el backup **no alcanza** para que el sistema se conecte: SQL Server exige un usuario y una contraseña. El sistema usa las siguientes credenciales:

| Dato | Valor |
|---|---|
| **Usuario** | `sisqon_user` |
| **Contraseña** | `SISQON2026!` |

Estos mismos datos deben ir en el archivo `.env` del backend (ver paso 3).

Si el usuario no existe en tu servidor, creálo desde SSMS (**New Query**) ejecutando:

```sql
CREATE LOGIN sisqon_user WITH PASSWORD = 'SISQON2026!';
USE SISCONQ;
CREATE USER sisqon_user FOR LOGIN sisqon_user;
ALTER ROLE db_owner ADD MEMBER sisqon_user;
```

Si al restaurar el backup el usuario ya existe dentro de la base de datos pero no puede ingresar, vinculalo con el login:

```sql
USE SISCONQ;
ALTER USER sisqon_user WITH LOGIN = sisqon_user;
```

> **Importante:** el servidor debe tener habilitada la autenticación mixta. En SSMS: clic derecho sobre el servidor → **Properties** → **Security** → **SQL Server and Windows Authentication mode**, y luego reiniciá el servicio de SQL Server.

---

## 3. Instalar y ejecutar el Backend

Desde la carpeta principal del repositorio, abrí una terminal en VS Code (`Ctrl + ñ`) y ejecutá:

```bash
cd backend
npm install
```

`npm install` descarga automáticamente todas las dependencias del backend (express, mssql, multer, nodemailer, ollama, cors, dotenv, TypeScript, etc.).

### Configuración (archivo `.env`)

Dentro de la carpeta `backend`, creá un archivo `.env` con los datos de tu conexión a SQL Server y de tu servicio de correo (usuario, contraseña, servidor y base de datos de tu equipo).

### Iniciar el backend

```bash
npm run dev
```

Dejá esta terminal abierta mientras uses el sistema.

---

## 4. Instalar y ejecutar el Frontend

Abrí **otra terminal** nueva y, desde la carpeta principal del repositorio, ejecutá:

```bash
cd frontend
npm install
npm run dev
```

La terminal mostrará una dirección local (por ejemplo `http://localhost:5173`). Abrila en tu navegador para ver el sistema.

El frontend utiliza **React** con **Vite**; su configuración (`vite.config.ts`) ya viene incluida en el proyecto:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

---

## 5. Instalar la IA local (Ollama + Gemma)

El sistema usa un modelo de IA que funciona **en tu propia computadora**.

1. Instalá **Ollama** desde [ollama.com/download](https://ollama.com/download).
2. Abrí una terminal y descargá el modelo Gemma:
   ```bash
   ollama pull gemma4:e2b
   ```
   > El modelo utilizado por el sistema es **`gemma4:e2b`** (aprox. 7.2 GB de descarga).
3. Verificá que Ollama esté funcionando:
   ```bash
   ollama list
   ```
4. Si el servicio no está activo, iniciálo en **otra terminal**:
   ```bash
   ollama serve
   ```

> **Nota:** los modelos de IA requieren memoria RAM y espacio en disco considerables. Cuanto mayor es el modelo, más recursos necesita.

---

## Resumen: terminales abiertas al usar el sistema

| Terminal | Carpeta | Comando |
|---|---|---|
| 1 | `backend` | `npm run dev` |
| 2 | `frontend` | `npm run dev` |
| 3 | (cualquiera) | `ollama serve` (si Ollama no está corriendo como servicio) |

Con las tres en funcionamiento y la base de datos importada, SISCON-Q queda listo para usar.

---

## Estructura del proyecto

```
/
├── backend/     → Servidor (Express + TypeScript)
├── frontend/    → Interfaz web (React + Vite)
└── SISCONQ.bak  → Backup de la base de datos
```

---

## Problemas frecuentes

- **El backend no conecta con la base de datos**: revisá los datos del archivo `.env` y que SQL Server esté en ejecución.
- **`npm install` falla**: confirmá que tenés Node.js 20 o superior (`node -v`).
- **La IA no responde**: verificá que Ollama esté activo y que el modelo esté descargado (`ollama list`).
