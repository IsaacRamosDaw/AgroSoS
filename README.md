# AgroSoS — Documentación del Proyecto Integrado

---

## PORTADA

| | |
|---|---|
| **Autores** | Isaac Antonio Ramos y Hatem Mainia ElYoussfi|
| **Centro** | IES El Rincón |
| **Ciclo Formativo** | Grado Superior — Desarrollo de Aplicaciones Multiplataforma |
| **Curso** | 2.º DAM T |
| **Título** | AgroSoS: Sistema de Monitorización Agrícola con Sensores IoT |


---

## ÍNDICE

1. [Introducción y descripción](#1-introducción-y-descripción)
2. [Diagramas y Modelo de Datos (AED)](#2-diagramas-y-modelo-de-datos-aed)
3. [Requisitos de Usuario](#3-requisitos-de-usuario)
4. [Casos de Uso](#4-casos-de-uso)
5. [Especificaciones técnicas y arquitectura del sistema](#5-especificaciones-técnicas-y-arquitectura-del-sistema)
6. [Interfaces: Diseño inicial, Mockups y Usabilidad](#6-interfaces-diseño-inicial-mockups-y-usabilidad)
7. [Manuales](#7-manuales)
8. [Tests de prueba — Backend](#8-tests-de-prueba--backend)
9. [Tests de prueba — Frontend](#9-tests-de-prueba--frontend)
10. [Pila Tecnológica y Comparación de Tecnologías](#10-pila-tecnológica-y-comparación-de-tecnologías)
11. [Repositorios](#11-repositorios)
12. [Planificación](#12-planificación)
13. [Conclusiones, opiniones y reflexiones](#13-conclusiones-opiniones-y-reflexiones)
14. [Enlaces y referencias](#14-enlaces-y-referencias)
15. [Anexos](#15-anexos)

---

## 1. Introducción y descripción

### Origen de la necesidad

El sector agrícola se enfrenta a un reto creciente: la necesidad de optimizar el uso de recursos como el agua, los fertilizantes y la energía, al tiempo que se mantiene o aumenta la producción. Los agricultores y explotaciones agrícolas modernas cuentan con maquinaria avanzada —tractores, sistemas de riego automatizado, robots de plantación— pero carecen de herramientas unificadas que centralicen la información de todos esos dispositivos y la presenten de forma clara y accionable.

La idea de AgroSoS surge de esa brecha: existe tecnología de sensores (IoT) capaz de medir temperatura, humedad, pH del suelo, nivel de combustible y estado de la batería de los vehículos, pero no hay una plataforma accesible que integre todos esos datos y los exponga a los responsables de la explotación en tiempo real.

### Empresa destinataria

AgroSoS se desarrolla como proyecto académico orientado a pequeñas y medianas explotaciones agrícolas que ya disponen de dispositivos del tipo FarmBot (robot de siembra y riego de precisión) o tractores con sensores embarcados, y que necesitan una solución de supervisión remota sin grandes inversiones en infraestructura.

Aplicación Web (DAD / PGV / AED)

AgroSoS es una plataforma web full-stack de monitorización agrícola en tiempo real. Los dispositivos de campo (FarmBots y tractores) están representados en el sistema como entidades con sensores asociados; un generador de datos simula las lecturas de esos sensores a intervalos regulares, publicando valores como temperatura ambiente, humedad del aire, humedad del suelo o nivel de combustible.

Los usuarios se autentican en la plataforma, donde pueden gestionar sus dispositivos, visualizar el estado actual de cada sensor y consultar el historial de lecturas agrupado por minuto. Los administradores tienen acceso a un panel de control para gestionar el registro de usuarios y sus roles. La arquitectura separa completamente el backend (API REST en Spring Boot + MySQL) del frontend (aplicación React/Vite), lo que permite escalar ambas capas de forma independiente.

Aplicación Móvil Android (PGL)

Se ha desarrollado una aplicación Android nativa en Java que actúa como cliente de la misma API REST del backend Spring Boot. La aplicación permite a los usuarios registrarse e iniciar sesión y, según su rol (ADMIN o USER), acceder a diferentes funcionalidades: gestión completa de usuarios, dispositivos y plantas en el caso del administrador, y consulta de los dispositivos asignados y las lecturas de sus sensores en el caso del usuario estándar.

La aplicación cuenta con siete pantallas (actividades), todas adaptadas tanto a orientación vertical como horizontal. Las lecturas se agrupan por fecha y hora y se presentan con el nombre de cada sensor (Temperatura, Humedad, pH, etc.).

---

## 2. Diagramas y Modelo de Datos (AED)

### 2.1 Introducción

En esta sección se documenta el modelo de datos de AgroSoS en sus dos representaciones: el Diagrama Entidad-Relación (E/R), que describe el dominio del problema de forma abstracta, y el Modelo Relacional, que refleja la implementación concreta en MySQL mediante JPA/Hibernate.

El modelo de datos es compartido por ambas aplicaciones (web y móvil), ya que ambas consumen la misma API REST y acceden a la misma base de datos MySQL. Se identifican las entidades, sus atributos descriptivos y restricciones, las relaciones entre ellas con sus reglas de negocio, y se adjunta el SQL del esquema.

---

### 2.2 Diagrama Entidad-Relación (E/R)

#### Identificación de entidades y atributos

## Diagrama E/R

<img width="1700" height="623" alt="Diagrama" src="https://github.com/user-attachments/assets/65a388d6-059c-4ddb-b29e-9a6b9c2a0114" />

---
| Entidad | Atributos | FK |
|-------|---------------|-----|
| `users` | id (PK) · name · email · password · role · created_at · updated_at | — |
| `device` | id (PK)· name · user · type | user → users(id) |
| `sensor` | id (PK)· pin · label · device · mode · created_at · updated_at | device → device(id) |
| `plant` | id (PK)· name · x · y · z · device_id · created_at | device_id → device(id) |
| `readings` | id (PK)· value · mode · pin · x · y · z · device · plant · sensor · created_at | device → device(id) · plant → plant(id) [NULL] · sensor → sensor(id) |
| `access` | id (PK)· user_id · device_id | user_id → users(id) · device_id → device(id) |

#### Identificación de relaciones

| Relación | Entidades | Cardinalidad | Justifcación |
|----------|-----------|--------------|-------------------|
| **POSEE** | User → Device | 1:N | Un usuario puede ser propietario de varios dispositivos. Un dispositivo pertenece a un único usuario propietario. |
| **TIENE ACCESO A** | User ↔ Device (vía Access) | **M:N** | Un usuario puede tener acceso a múltiples dispositivos. Un dispositivo puede ser accesible por múltiples usuarios. La entidad `Acceso` actúa como tabla de unión de esta relación muchos a muchos. |
| **CONTIENE** | Dispositivo → Sensor | 1:N | Un dispositivo tiene varios sensores. Un sensor pertenece a un único dispositivo. Al eliminar un dispositivo se eliminan en cascada sus sensores. |
| **ALBERGA** | Device → Sensor | 1:N | Un dispositivo FarmBot puede registrar varias plantas. Al eliminar el dispositivo se eliminan sus plantas. |
| **GENERA** | Sensor → Lectura | 1:N | Cada lectura es producida por un sensor concreto. |
| **REGISTRA EN** | Reading → Plant | N:0..1 | Una lectura puede estar asociada opcionalmente a una planta (contexto FarmBot). |
| **EMITE** | Device → Reading | 1:N | Todas las lecturas están vinculadas al dispositivo que las originó. |


### 2.3 Modelo Relacional

#### Identificación de tablas y atributos

| Tabla | Columnas clave | FK |
|-------|---------------|-----|
| `users` | id · name · email · password · role · created_at · updated_at | — |
| `device` | id · name · user · type | user → users(id) |
| `sensor` | id · pin · label · device · mode · created_at · updated_at | device → device(id) |
| `plant` | id · name · x · y · z · device_id · created_at | device_id → device(id) |
| `readings` | id · value · mode · pin · x · y · z · device · plant · sensor · created_at | device → device(id) · plant → plant(id) [NULL] · sensor → sensor(id) |
| `access` | id · user_id · device_id | user_id → users(id) · device_id → device(id) |

> La relación **muchos a muchos** entre `users` y `device` se implementa mediante la tabla de unión `access`, que materializa la entidad del mismo nombre. Cada fila de `access` representa que un usuario concreto tiene permiso de acceso sobre un dispositivo concreto.

---

### 2.4 SQL del Modelo Relacional

> Spring Boot con `spring.jpa.hibernate.ddl-auto=update` genera estas tablas automáticamente. El SQL equivalente es:

```sql
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('USER','ADMIN') NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE device (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user INT NOT NULL,
    type ENUM('FarmBot','Tractor'),
    CONSTRAINT fk_device_user FOREIGN KEY (user) REFERENCES users(id)
);

CREATE TABLE sensor (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    pin        INT NOT NULL,
    label      VARCHAR(255) NOT NULL,
    device     INT NOT NULL,
    mode       INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_sensor_device FOREIGN KEY (device) REFERENCES device(id)
);

CREATE TABLE plant (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    x          INT NOT NULL,
    y          INT NOT NULL,
    z          INT NOT NULL,
    device_id  INT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_plant_device FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE readings (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    value      VARCHAR(255) NOT NULL,
    mode       INT NOT NULL,
    pin        INT NOT NULL,
    x          INT NOT NULL,
    y          INT NOT NULL,
    z          INT NOT NULL,
    device     INT NOT NULL,
    plant      INT,
    sensor     INT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_reading_device FOREIGN KEY (device)  REFERENCES device(id),
    CONSTRAINT fk_reading_plant  FOREIGN KEY (plant)   REFERENCES plant(id),
    CONSTRAINT fk_reading_sensor FOREIGN KEY (sensor)  REFERENCES sensor(id)
);

-- Tabla de unión M:N Usuario ↔ Dispositivo
CREATE TABLE access (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL,
    device_id INT NOT NULL,
    CONSTRAINT fk_access_user   FOREIGN KEY (user_id)   REFERENCES users(id),
    CONSTRAINT fk_access_device FOREIGN KEY (device_id) REFERENCES device(id)
);
```

---

## 3. Requisitos de Usuario

### 3.1 Requisitos generales del sistema

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RG-01 | El sistema permitirá el registro e inicio de sesión de usuarios. | Alta |
| RG-02 | Los usuarios podrán gestionar (crear, editar, eliminar) sus dispositivos. | Alta |
| RG-03 | El sistema mostrará los valores actuales de los sensores de cada dispositivo. | Alta |
| RG-04 | Los usuarios podrán consultar el historial de lecturas ordenado por fecha/hora. | Alta |
| RG-05 | Los usuarios FarmBot podrán gestionar plantas (posición X/Y/Z, nombre). | Media |
| RG-06 | El sistema dispondrá de un generador de lecturas simuladas activable/desactivable. | Media |
| RG-07 | Los administradores podrán gestionar usuarios (promover a ADMIN, revocar, eliminar). | Alta |
| RG-08 | El sistema permitirá la eliminación masiva de lecturas de un dispositivo. | Baja |
| RG-09 | El acceso a las secciones protegidas requerirá autenticación. | Alta |
| RG-10 | La sesión del usuario persistirá entre cierres de la aplicación. | Media |

---

### 3.2 Requisitos específicos — Aplicación Web (AED / DAD / PGV)

**AED — Acceso a Datos**
- Los datos se persistirán en una base de datos relacional MySQL gestionada por JPA/Hibernate.
- Las consultas personalizadas se implementarán mediante Spring Data JPA Repository.
- Las relaciones M:N se implementarán mediante entidad de unión explícita (`Access`).

**DAD — Desarrollo de Aplicaciones Distribuidas**
- La aplicación seguirá arquitectura cliente-servidor desacoplada: API REST (Spring Boot) + SPA (React).
- La comunicación entre capas será exclusivamente mediante HTTP/JSON.
- El servidor expondrá endpoints RESTful documentados y testeables via Postman.
- El frontend se desplegará de forma independiente (Vercel).

**PGV — Programación Gráfica Visual**
- La interfaz web seguirá principios de diseño visual coherentes (paleta, tipografía, espaciado).
- Se aplicarán principios de usabilidad y accesibilidad (contraste, tamaño de fuente, navegación clara).
- Los mockups se realizarán antes del desarrollo para validar el diseño.

---

### 3.3 Requisitos específicos — Aplicación Móvil Android (PGL)

**Funcionales**

| ID | Requisito funcional |
|----|---------------------|
| RF-01 | La pantalla de inicio muestra el nombre del usuario autenticado. |
| RF-02 | El botón "Gestionar usuarios" solo es visible para administradores. |
| RF-03 | La lista de usuarios permite editar nombre, correo y contraseña. |
| RF-04 | La lista de usuarios permite promover/revocar el rol mediante pulsación larga. |
| RF-05 | Los dispositivos se crean con nombre y tipo (FarmBot / Tractor). |
| RF-06 | Cada dispositivo muestra un botón "Lecturas" que abre la pantalla de sensores. |
| RF-07 | Las lecturas se agrupan por timestamp; cada grupo abre un popup con todos los valores. |
| RF-08 | El usuario puede iniciar/detener el sensor y tomar/limpiar lecturas. |

**No funcionales**

| ID | Requisito no funcional |
|----|------------------------|
| RNF-01 | La aplicación se comunica con la API mediante HTTP (HTTPS en producción). |
| RNF-02 | Las contraseñas no se almacenan en texto plano en el dispositivo. |
| RNF-03 | Los tiempos de respuesta de la API no superarán los 3 segundos en condiciones normales. |
| RNF-04 | La interfaz será intuitiva y accesible para personas sin formación técnica. |
| RNF-05 | La aplicación será compatible con Android API 24 (Android 7.0) en adelante. |
| RNF-06 | Todas las pantallas funcionarán correctamente en orientación vertical y horizontal. |

**Entorno de ejecución — App móvil (usuario final)**

| Requisito | Versión mínima |
|-----------|----------------|
| Android | 7.0 (API 24) — compatible hasta API 34 |
| RAM | 2 GB  |
| Almacenamiento  | 50 MB |


**Entorno de desarrollo — App móvil**

| Software | Versión |
|----------|---------|
| Android Studio | Hedgehog 2023.1.1+ |
| Java JDK | 17 (incluido en Android Studio) |
| Android SDK Platform | API 24 (mín) + API 34 (obj) |
| Android SDK Build-Tools | 34.0.0 |
| Gradle | 8.x (automático) |


---

## 4. Casos de Uso

### 4.1 Actores

| Actor | Descripción |
|-------|-------------|
| **Usuario registrado** | Persona autenticada con rol USER. Accede a sus dispositivos y sensores. |
| **Administrador** | Persona autenticada con rol ADMIN. Además gestiona usuarios y todos los dispositivos. |
| **Sistema generador** | Proceso interno que genera lecturas de sensores periódicamente. |

---

### 4.2 Casos de Uso — Aplicación Web

<img width="933" height="556" alt="image" src="https://github.com/user-attachments/assets/7d1272a6-fbbd-4dfa-b030-43dbd593344f" />


| CU | Nombre | Actor | Descripción |
|----|--------|-------|-------------|
| CU-W01 | Registrar usuario | Anónimo | Introduce nombre, email y contraseña. El sistema valida, hashea la contraseña y crea el usuario con rol USER. |
| CU-W02 | Iniciar sesión | Anónimo | Introduce email y contraseña. El sistema verifica credenciales y devuelve datos de sesión. |
| CU-W03 | Gestionar dispositivos | Usuario | CRUD completo sobre FarmBots y Tractores propios. |
| CU-W04 | Ver sensores en tiempo real | Usuario | Selecciona un dispositivo y visualiza el valor actual de cada sensor. |
| CU-W05 | Consultar historial | Usuario | Navega por las entradas del historial y consulta los valores de un instante concreto. |
| CU-W06 | Gestionar plantas (FarmBot) | Usuario | Crea, edita y elimina plantas con coordenadas X/Y. |
| CU-W07 | Activar/Desactivar generador | Usuario | Inicia o detiene la generación automática de lecturas. |
| CU-W08 | Limpiar lecturas | Usuario | Elimina todas las lecturas de un dispositivo (requiere confirmación modal). |
| CU-W09 | Gestionar usuarios | Admin | Visualiza todos los usuarios, promueve a ADMIN, revoca permisos, elimina usuarios. |
| CU-W10 | Modificar perfil | Usuario | Actualiza nombre, email y/o contraseña propios. |

---

### 4.3 Casos de Uso — Aplicación Móvil


**CU-M01: Iniciar sesión**
- **Actor:** ADMIN / USER
- **Flujo:** Introduce correo y contraseña → `POST /auth/login` → si correcto, guarda sesión en SharedPreferences → navega a MainActivity.
- **Alternativo:** Credenciales incorrectas → toast "Error al iniciar sesión".

**CU-M02: Registrarse**
- **Actor:** USER (nuevo)
- **Flujo:** Introduce nombre, correo y contraseña → `POST /auth/register` → guarda sesión → navega a MainActivity.

**CU-M03: Gestionar usuarios** *(solo ADMIN)*
- **Flujo:** Accede a "Gestionar usuarios" → lista de todos los usuarios → pulsación larga: editar, eliminar, promover/revocar rol.

**CU-M04: Gestionar dispositivos**
- **Flujo (ADMIN):** Ve todos los dispositivos; puede crear, editar y eliminar.
- **Flujo (USER):** Solo ve los dispositivos asignados a su cuenta.

**CU-M05: Gestionar plantas**
- **Flujo:** Lista de plantas → crear nueva (nombre + X, Y, Z) → editar/eliminar con pulsación larga.

**CU-M06: Consultar lecturas de sensores**
- **Flujo:** Pulsa "Lecturas" en un dispositivo → "Ver historial" → lista agrupada por fecha/hora → "Ver Lectura" → popup con todos los valores (Temperatura: 25, Humedad: 63, pH: 6.2...).

**CU-M07: Controlar sensores**
- **Flujo:** "Iniciar sensor" → lecturas automáticas · "Detener sensor" · "Tomar lectura" (puntual) · "Limpiar lecturas" (con confirmación).

**CU-M08: Cerrar sesión**
- **Flujo:** "Cerrar sesión" → borra SharedPreferences → redirige a LoginActivity (no se puede retroceder).

---

## 5. Especificaciones técnicas y arquitectura del sistema

### 5.1 Arquitectura — Aplicación Web 

```
┌─────────────────────────────────────────────┐
│           CLIENTE WEB (Navegador)           │
│   React 19 + Vite · CoreUI + Bootstrap 5    │
│            Desplegado en Vercel             │
└─────────────────┬───────────────────────────┘
                  │  HTTP/JSON (REST API)
                  │  CORS: localhost:5173
┌─────────────────▼───────────────────────────┐
│          SERVIDOR DE APLICACIÓN             │
│   Spring Boot 3.5.7 · Java 25 · Maven       │
│  Spring Data JPA · Spring Security · BCrypt │
│              Puerto 8080                    │
└─────────────────┬───────────────────────────┘
                  │  JPA / Hibernate
┌─────────────────▼───────────────────────────┐
│               BASE DE DATOS                 │
│           MySQL · Puerto 3306               │
│        6 tablas · DDL auto-gestionado       │
└─────────────────────────────────────────────┘
```

### 5.2 Arquitectura — Aplicación Móvil Android 

```
┌─────────────────────────────────────────────┐
│        CLIENTE MÓVIL (Android Java)         │
│  7 Actividades · Retrofit 2 · Gson · MVC    │
│          Android API 24–34                  │
└─────────────────┬───────────────────────────┘
                  │  HTTP/JSON (REST API)
                  │  BASE_URL: 10.0.2.2:8080
┌─────────────────▼───────────────────────────┐
│          SERVIDOR DE APLICACIÓN             │
│   Spring Boot 3.5.7 · Java 25 · Maven       │
│  Spring Data JPA · Spring Security · BCrypt │
│              Puerto 8080                    │
└─────────────────┬───────────────────────────┘
                  │  JPA / Hibernate
┌─────────────────▼───────────────────────────┐
│               BASE DE DATOS                 │
│           MySQL · Puerto 3306               │
│        (misma instancia que la web)         │
└─────────────────────────────────────────────┘
```

---

### 5.3 Endpoints REST del servidor (compartidos)

#### Autenticación (`/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registro de nuevo usuario |
| POST | `/auth/login` | Inicio de sesión |
| POST | `/auth/promote` | Promover usuario a ADMIN |
| POST | `/auth/revoke` | Revocar rol ADMIN |
| PUT | `/auth/update/{id}` | Actualizar perfil de usuario |

#### Usuarios, Dispositivos, Sensores, Lecturas, Plantas, Acceso (`/api`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/allUser` | Listar todos los usuarios |
| DELETE | `/api/user/{id}` | Eliminar usuario |
| GET | `/api/device/user/{userId}` | Dispositivos de un usuario |
| POST | `/api/device` | Crear dispositivo |
| PUT | `/api/device/{id}` | Actualizar dispositivo |
| DELETE | `/api/device/{id}` | Eliminar dispositivo (cascada) |
| POST | `/api/device/{id}/init-sensors` | Inicializar sensores por defecto |
| GET | `/api/sensor/device/{id}` | Sensores de un dispositivo |
| GET | `/api/reading/device/{deviceId}` | Lecturas de un dispositivo |
| GET | `/api/plant/device/{deviceId}` | Plantas de un dispositivo |
| POST | `/api/plant` | Crear planta |
| PUT | `/api/plant/{id}` | Actualizar planta |
| DELETE | `/api/plant/{id}` | Eliminar planta |
| GET | `/api/access/user/{userId}` | Registros de acceso de un usuario |
| POST | `/api/access` | Crear registro de acceso |

#### Generador (`/api/generator`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/generator/seed/{userId}` | Crear datos de demo |
| POST | `/api/generator/start` | Iniciar generación automática |
| POST | `/api/generator/stop` | Detener generación |
| GET | `/api/generator/status` | Consultar estado del generador |
| POST | `/api/generator/trigger/{deviceId}` | Forzar una lectura inmediata |
| DELETE | `/api/generator/clear/{deviceId}` | Eliminar todas las lecturas de un dispositivo |

---

### 5.4 Estructura de la aplicación Android (PGL)

La aplicación sigue el patrón **MVC adaptado a Android**:

- **Modelo:** clases Java en `models/` que mapean las entidades de la API.
- **Vista:** ficheros XML en `res/layout/` (vertical) y `res/layout-land/` (horizontal).
- **Controlador:** actividades en `activities/` y adaptadores en `adapters/`.
- **Capa de red:** `api/ApiClient.java` (instancia Retrofit singleton) + `api/ApiService.java`.
- **Sesión:** `utils/SessionManager.java` (envoltorio de SharedPreferences).

```
app/src/main/java/com/example/agrosospgl/
├── activities/
│   ├── LoginActivity.java
│   ├── RegisterActivity.java
│   ├── MainActivity.java
│   ├── UsersActivity.java
│   ├── PlantsActivity.java
│   ├── DevicesActivity.java
│   └── ReadingsActivity.java
├── adapters/
│   ├── UsersAdapter.java
│   ├── PlantsAdapter.java
│   ├── DevicesAdapter.java
│   └── ReadingsAdapter.java
├── api/
│   ├── ApiClient.java
│   └── ApiService.java
├── models/
│   ├── User.java · Device.java · Plant.java
│   ├── Sensor.java · Reading.java · AuthResponse.java
└── utils/
    └── SessionManager.java
```

### 5.5 Flujo de navegación — Android

```
LoginActivity ──► RegisterActivity
      │
      ▼ (sesión guardada)
MainActivity
 ├──► UsersActivity      (solo ADMIN)
 ├──► PlantsActivity
 └──► DevicesActivity
           └──► ReadingsActivity
```

---

## 6. Interfaces: Diseño inicial, Mockups y Usabilidad

### 6.1 Usabilidad y Accesibilidad — Aplicación Web

**Proceso previo al desarrollo:**
1. Se realizaron mockups antes de comenzar el desarrollo.
2. Se identificó el flujo principal : registro → login → ver dispositivos → sensores → gestionar plantas y lecturas.
3. Se preveía recibir datos reales, pero por motivos externos, no es posible, por lo que se tuvo en cuenta la posible necesidad de generar datos falsos.

**Aspectos aplicados:**

| Aspecto | Diseño y justificación |
|---------|----------------------|
| **Feedback inmediato** | Toda acción devuelve una notificación toast con color semántico (verde=éxito, rojo=error, azul=info). |
| **Confirmación de acciones destructivas** | Eliminar planta, dispositivo, usuario o limpiar lecturas requiere confirmación explícita mediante modal de diálogo. |
| **Estados de carga** | Spinner + mensaje mientras se esperan datos del servidor. |
| **Contraste y legibilidad** | Paleta Bootstrap 5/CoreUI 5. Texto oscuro sobre fondo claro (#f4f6f9). Ratio de contraste ≥ 4.5:1. |
| **Navegación clara** | Header siempre visible con logo, acceso al perfil y enlace Admin (solo para ADMIN). |
| **Formularios validados** | `noValidate` en todos los forms, mensajes inline bajo cada campo incorrecto. |
| **Desactivación contextual de botones** | Botones Editar/Eliminar deshabilitados si no hay elemento seleccionado. |

Notificaciones toast
<img width="353" height="53" alt="image" src="https://github.com/user-attachments/assets/8fd2133e-13f5-47a6-9517-caf84907ea5d" />

Diálogos de confirmación
<img width="459" height="229" alt="image" src="https://github.com/user-attachments/assets/e8b3c90c-d45c-401c-b806-c84dd6ea0c60" />


Formulario de login con error inline de contraseña incorrecta.
<img width="536" height="436" alt="image" src="https://github.com/user-attachments/assets/a97b4824-4452-4ee5-bd5f-15ef21ad9bc2" />


Botones "Editar" y "Eliminar" de plantas en estado deshabilitado (sin planta seleccionada).
<img width="538" height="258" alt="image" src="https://github.com/user-attachments/assets/6e96cc97-79c8-4189-88c3-f329183775e1" />


---

### 6.2 Usabilidad y Accesibilidad — Aplicación Móvil Android

**Proceso previo al desarrollo:**
1. Se identificaron dos perfiles: administrador técnico y operario de campo.
2. Una vez 

**Aspectos aplicados:**

| # | Aspecto | Aplicación en la app |
|---|---------|---------------------|
| 1 | **Visibilidad del estado del sistema** | El nombre del usuario aparece en MainActivity. Los toasts informan del resultado de cada operación. |
| 2 | **Correspondencia con el mundo real** | Textos en español con terminología agrícola ("Planta", "Sensor", "Lecturas"). |
| 3 | **Control y libertad del usuario** | Botones de navegación en todas las pantallas. Confirmación antes de limpiar lecturas. |
| 4 | **Consistencia y estándares** | Diálogos siempre con la misma estructura: campos → "Guardar"/"Cancelar". Tema Material estándar. |
| 5 | **Prevención de errores** | Campos numéricos con `inputType="number"`. Confirmación antes de borrar datos. |
| 6 | **Flexibilidad y eficiencia** | Pulsación larga abre menú contextual con acciones disponibles (editar, eliminar, promover). |
| 7 | **Diseño minimalista** | Solo se muestra la información relevante. El historial está oculto por defecto y se activa bajo demanda. |
| 8 | **Adaptación a la orientación** | Todas las pantallas tienen layout alternativo en `res/layout-land/` con diseño de dos columnas. |

Pantalla principal mostrando el nombre del usuario (aspecto 1: visibilidad del estado).
<img width="736" height="323" alt="image" src="https://github.com/user-attachments/assets/f2649d25-df56-48a9-827d-2a28794fb3bf" />


Diálogo de confirmación de borrado de lecturas (aspecto 3: control y libertad).
<img width="724" height="324" alt="image" src="https://github.com/user-attachments/assets/64f4df8a-61f7-458f-81fb-43ab42c61fc1" />


Menú contextual de pulsación larga sobre un usuario (aspecto 6: flexibilidad).
<img width="697" height="300" alt="image" src="https://github.com/user-attachments/assets/3920dda3-72e9-4bce-9bef-2a1573931c6e" />


Comparativa portrait / landscape de la misma pantalla (aspecto 8: orientación).

Landscape
<img width="738" height="334" alt="image" src="https://github.com/user-attachments/assets/7f460ea5-fa9b-4e70-a645-6bd5978294eb" />

Portrait
<img width="299" height="662" alt="image" src="https://github.com/user-attachments/assets/ff34dcbb-f3ac-481d-9a6c-75cd5085cb1d" />

Popup "Ver Lectura" con sensores etiquetados en español (aspecto 2: lenguaje natural).
<img width="737" height="306" alt="image" src="https://github.com/user-attachments/assets/12719147-563d-442a-bbbe-7c4a61f1e587" />


---

## 7. Manuales

### 7.1 Manual de instalación para el desarrollador

#### Requisitos comunes

| Herramienta | Versión mínima |
|-------------|---------------|
| Java JDK | 17 (backend) / 25 (backend web) |
| Maven | 3.9+ |
| MySQL | 8.0+ |
| Git | cualquiera |

#### Backend (compartido por web y móvil)

```bash
git clone https://github.com/[USUARIO]/AgroSoS.git
cd AgroSoS/agroSoSController

# Configurar application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/agrosos
# spring.datasource.username=agrosos_user
# spring.datasource.password=tu_password
# spring.jpa.hibernate.ddl-auto=update

mysql -u root -p -e "CREATE DATABASE agrosos;"
mvn spring-boot:run
# Servidor en http://localhost:8080
```

#### Crear primer administrador

```bash
curl -X POST http://localhost:8080/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@agrosos.com","password":"admin123"}'
```

#### Frontend Web

```bash
cd agroSoSFrontend
npm install
npm run dev
# Disponible en http://localhost:5173
```

#### Aplicación Android

```
1. Abrir Android Studio → "Open" → carpeta AgroSoSPGLFinal/
2. Esperar a que Gradle sincronice las dependencias.
3. En api/ApiClient.java verificar:
   BASE_URL = "http://10.0.2.2:8080/"   (emulador)
   BASE_URL = "http://<IP_HOST>:8080/"   (dispositivo físico)
4. Seleccionar emulador o dispositivo (API 24+).
5. Pulsar Run ▶.
```

<img width="1895" height="993" alt="image" src="https://github.com/user-attachments/assets/eb6bff08-6826-4053-ac65-839e2fb74e9c" />


---

### 7.2 Manual de instalación para técnicos (producción)

#### Backend

```bash
cd agroSoSController
mvn clean package -DskipTests
# Copiar target/agroSoSController-0.0.1-SNAPSHOT.jar al servidor

java -jar agroSoSController-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:mysql://localhost:3306/agrosos \
  --spring.datasource.username=USUARIO \
  --spring.datasource.password=PASSWORD
```

Configurar `systemd` (Linux) para que arranque automáticamente.

#### Frontend Web

```bash
cd agroSoSFrontend
npm run build
# Copiar dist/ al servidor web (Nginx/Apache) o ejecutar: vercel --prod
```

El fichero `vercel.json` ya contiene las reglas de reescritura para SPA.

#### Aplicación Android

```
1. Activar en el dispositivo: Ajustes → Seguridad → Instalar apps de fuentes desconocidas.
2. Copiar AgroSoS.apk al dispositivo (USB, email o servidor interno).
3. Abrir el .apk desde el gestor de archivos.
4. Seguir el instalador.
Nota: Si la URL del servidor cambia, el desarrollador debe recompilar el APK con la nueva BASE_URL.
```

---

### 7.3 Manual de usuario — Aplicación Web


<img width="1908" height="871" alt="image" src="https://github.com/user-attachments/assets/6c10cc82-4b92-43c7-a077-71070897caf0" />


**Registro e inicio de sesión**
1. Accede a la URL de la aplicación.
2. Pulsa "Iniciar Sesión" y "Crear Cuenta" si no se dispone de una.
3. Introduzca su nombre, email y contraseña.
4. Una vez registrado, accede con email y contraseña.

<img width="653" height="519" alt="image" src="https://github.com/user-attachments/assets/addc14fd-b756-43e1-bfc0-d3fb6c640552" />


**Gestión de dispositivos**
1. Desde la pantalla de inicio, accede a "FarmBot" o "Tractor".
2. Usa "+ Nuevo FarmBot / Tractor" para añadir un dispositivo.
3. Si es la primera vez, pulsa "Inicializar Datos Demo".

<img width="1817" height="437" alt="image" src="https://github.com/user-attachments/assets/ef4fb178-7d7e-4f74-aff0-0e6d5fbe54cd" />


**Visualización de sensores y historial**
1. El panel central muestra el valor actual de cada sensor.
2. Pulsa "Actualizar Sensores" para forzar una lectura inmediata.
3. En el panel de Historial, pulsa una entrada para ver los valores de ese instante.
4. Pulsa "Volver a Actual" para regresar a los valores en tiempo real.


<img width="1895" height="874" alt="image" src="https://github.com/user-attachments/assets/6d0aba9a-a0d7-4af3-8c04-f7b1029004a7" />


**Perfil de usuario**
1. Pulsa tu nombre en el header para acceder al perfil.
2. Puedes cambiar nombre, email o contraseña (déjala vacía si no quieres cambiarla).


<img width="1801" height="695" alt="image" src="https://github.com/user-attachments/assets/0f636c64-a68f-4fb4-87de-2c59ff23a978" />


---

### 7.4 Manual de usuario — Aplicación Móvil Android


<img width="731" height="324" alt="image" src="https://github.com/user-attachments/assets/8679450a-1f0c-474d-8f7c-6e8d319134d4" />


**Inicio de sesión y registro**
1. Abrir la aplicación AgroSoS.
2. Introducir correo y contraseña → pulsar **"Iniciar sesión"**.
3. Si no tienes cuenta, pulsa **"¿No tienes cuenta? Regístrate"**.

<img width="734" height="322" alt="image" src="https://github.com/user-attachments/assets/9e163bbc-1c2f-471e-b00e-d1ceb1dc5a77" />


**Consultar dispositivos y lecturas**
1. Desde la pantalla principal, pulsar **"Dispositivos"**.
2. Pulsar **"Lecturas"** en cualquier dispositivo.
3. Botones disponibles: **Iniciar sensor** / **Detener sensor** / **Tomar lectura** / **Limpiar lecturas** / **Ver historial**.
4. Pulsar **"Ver Lectura"** en un grupo del historial para ver todos los valores de sensores.


<img width="724" height="323" alt="image" src="https://github.com/user-attachments/assets/b4434467-dd51-48ff-9b81-78314bdb4b7d" />


**Gestión de usuarios** *(solo administradores)*
1. Desde la pantalla principal, pulsar **"Gestionar usuarios"**.
2. Mantener pulsado un usuario para **editar**, **eliminar**, **promover** o **revocar** su rol.


<img width="734" height="327" alt="image" src="https://github.com/user-attachments/assets/f4f3e6c4-6f79-4faa-9f9e-6e137ea5f41f" />


**Cerrar sesión**
- Pulsar **"Cerrar sesión"** en la pantalla principal → redirige al login.

---

### 7.5 Ayuda en la aplicación web

- **Notificaciones toast** en toda acción (éxito, error, información).
- **Mensajes de estado vacío** con botón de acción contextual ("No se encontraron FarmBots" → "+ Nuevo FarmBot").
- **Validación de formularios inline** con mensajes bajo cada campo.
- **Modales de confirmación** antes de cualquier eliminación.
- **Badge de estado del generador** (verde=Activo / gris=Inactivo).

### 7.6 Ayuda en la aplicación móvil

| Acción | Feedback |
|--------|----------|
| Login correcto | Navega a MainActivity |
| Login incorrecto | Toast "Error al iniciar sesión" |
| Planta creada | Toast "Planta creada" |
| Planta eliminada | Toast "Planta eliminada" |
| Lectura tomada | Toast "Lectura tomada" |
| Sensor iniciado | Toast "Sensor iniciado" |
| Error de conexión | Toast "Error de conexión" |

---

## 8. Tests de prueba — Backend

Los tests se realizan con **Postman**. 
La colección está en la ruta principal del proyecto: 'AgroSoS.postman_collection.json'.

### 8.1 Configuración

- Importar la colección en Postman (`File → Import`).
- El servidor Spring Boot debe estar corriendo en `http://localhost:8080`.
- Los parámetros de path (`:id`, `:userId`, etc.) tienen valor por defecto `1`; cambiarlos en la pestaña "Path Variables".

### 8.2 Casos de prueba

| ID | Grupo | Petición | Método | Resultado esperado |
|----|-------|----------|--------|--------------------|
| TB-01 | Auth | Login correcto | POST `/auth/login` | 200 + datos de sesión |
| TB-02 | Auth | Login con password errónea | POST `/auth/login` | 401 / error |
| TB-03 | Auth | Registro nuevo usuario | POST `/auth/register` | 200 + usuario con rol USER |
| TB-04 | Usuarios | Listar todos | GET `/api/allUser` | 200 + array |
| TB-05 | Usuarios | Actualizar | PUT `/api/user/:id` | 200 + usuario actualizado |
| TB-06 | Usuarios | Eliminar | DELETE `/api/user/:id` | 200 + mensaje |
| TB-07 | Dispositivos | Por usuario | GET `/api/device/user/:userId` | 200 + array |
| TB-08 | Dispositivos | Crear | POST `/api/device` | 200 + dispositivo creado |
| TB-09 | Dispositivos | Eliminar (cascada) | DELETE `/api/device/:id` | 200 + mensaje |
| TB-10 | Sensores | Por dispositivo | GET `/api/sensor/device/:id` | 200 + array |
| TB-11 | Lecturas | Por dispositivo | GET `/api/reading/device/:deviceId` | 200 + array |
| TB-12 | Plantas | Por dispositivo | GET `/api/plant/device/:deviceId` | 200 + array |
| TB-13 | Acceso | Por usuario | GET `/api/access/user/:userId` | 200 + array |
| TB-14 | Generador | Seed | POST `/api/generator/seed/:userId` | 200 + mensaje |
| TB-15 | Generador | Trigger | POST `/api/generator/trigger/:deviceId` | 200 + mensaje |
| TB-16 | Generador | Clear | DELETE `/api/generator/clear/:deviceId` | 200 + mensaje |
| TB-17 | Auth | Promover usuario | POST `/auth/promote` | 200 + éxito |

<img width="1569" height="1034" alt="image" src="https://github.com/user-attachments/assets/af4a8447-e30d-4248-87e2-2965de85bdf4" />

Petición POST `/auth/login` con body y respuesta 200 exitosa.
<img width="1563" height="946" alt="image" src="https://github.com/user-attachments/assets/9998ca57-4b6f-4377-9525-046ab56a5d85" />

Petición GET `/api/reading/device/:deviceId` mostrando el dispositivo.
<img width="1079" height="600" alt="image" src="https://github.com/user-attachments/assets/3db898ce-eff6-427e-ba5a-d1d7147b4e24" />


---

## 9. Tests de prueba — Frontend

### 9.1 Tests — Aplicación Web (Vitest)

```bash
cd agroSoSFrontend
npm run test:run      # Ejecución única
npm run test          # Modo watch
```

| Fichero | Tipo | Tests | Descripción |
|---------|------|------:|-------------|
| `Login.test.jsx` | Componente | 9 | Renderizado, validación, llamada a login, error del servidor, estado de carga |
| `AuthContext.test.jsx` | Contexto | ~6 | Sesión, persistencia en localStorage, logout |
| `validation.utils.test.js` | Unitario | 18 | `validateLoginForm`, `validateSignUpForm`, `validatePlantForm`, `validateModifyForm` |
| `sensor.utils.test.js` | Unitario | 14 | `buildCurrentSensors`, `buildHistory`: casos normales, vacíos, agrupación por minuto |

<img width="753" height="340" alt="image" src="https://github.com/user-attachments/assets/91b3b2d9-8b3a-41d1-b3cf-2d3ec0367bc6" />


---

### 9.2 Tests — Aplicación Móvil Android (manual)

| ID | Caso de prueba | Pasos | Resultado esperado |
|----|---------------|-------|--------------------|
| TM-01 | Login correcto | Credenciales válidas → "Iniciar sesión" | Navega a MainActivity con nombre del usuario |
| TM-02 | Login incorrecto | Credenciales erróneas | Toast "Error al iniciar sesión" |
| TM-03 | Registro nuevo usuario | Rellenar todos los campos → "Registrarse" | Navega a MainActivity como nuevo usuario |
| TM-04 | Visibilidad por rol USER | Login con cuenta USER | "Gestionar usuarios" NO aparece |
| TM-05 | Visibilidad por rol ADMIN | Login con cuenta ADMIN | "Gestionar usuarios" SÍ aparece |
| TM-06 | Crear planta | Plantas → "Nueva planta" → rellenar → confirmar | Lista actualizada con la nueva planta |
| TM-07 | Editar dispositivo | Dispositivos → pulsación larga → "Editar" → guardar | Lista refleja los cambios |
| TM-08 | Ver lecturas agrupadas | Dispositivos → "Lecturas" → "Tomar lectura" → "Ver historial" | Fila con fecha/hora y botón "Ver Lectura" |
| TM-09 | Popup de lectura completa | "Ver Lectura" en una fila | Popup con todos los sensores y sus valores |
| TM-10 | Rotación de pantalla | Girar el dispositivo en cualquier actividad | Layout landscape sin pérdida de datos |
| TM-11 | Persistencia de sesión | Cerrar app completamente → volver a abrir | Accede directo a MainActivity sin login |
| TM-12 | Cerrar sesión | "Cerrar sesión" desde MainActivity | Redirige a login; no se puede retroceder |

TM-05: pantalla principal como ADMIN con "Gestionar usuarios".
<img width="726" height="320" alt="image" src="https://github.com/user-attachments/assets/43e2d6b4-f7a7-4700-8a0e-7bbd8cef0e2d" />

TM-09: popup completo con varios sensores y sus lecturas.
<img width="737" height="328" alt="image" src="https://github.com/user-attachments/assets/7fb837c6-ede5-493b-a9c6-16bc412e13ae" />

---

## 10. Pila Tecnológica y Comparación de Tecnologías

### 10.1 Backend (compartido)

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Java | 25 | Lenguaje del servidor |
| Spring Boot | 3.5.7 | Framework API REST |
| Spring Data JPA + Hibernate | incluido | ORM y acceso a datos |
| Spring Security + BCrypt | incluido | Autenticación y hashing |
| MySQL | 8.0 | Base de datos relacional |
| Maven | 3.9+ | Gestión de dependencias |

### 10.2 Frontend Web (DAD / PGV)

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| React | 19.1 | Librería UI basada en componentes |
| Vite | 7.1 | Bundler y servidor de desarrollo |
| React Router DOM | 7.9 | Enrutamiento SPA |
| CoreUI + Bootstrap | 5.x | Componentes UI y rejilla |
| Chart.js | 4.5 | Gráficas |
| Vitest + Testing Library | 4.1 / 16.3 | Testing |
| Vercel | — | Despliegue |

### 10.3 Aplicación Móvil Android (PGL)

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Java | 17 | Lenguaje de la app |
| Android SDK | API 24–34 | Plataforma objetivo |
| Retrofit 2 | 2.9.0 | Cliente HTTP REST |
| Gson | 2.10 | Serialización JSON |
| RecyclerView | — | Listas eficientes |
| SharedPreferences | — | Persistencia de sesión |
| AlertDialog | — | Diálogos y formularios |
| Android Studio | Hedgehog 2023.1.1+ | IDE de desarrollo |

---

### 10.4 Comparación de tecnologías

#### Backend: Spring Boot vs Node.js + Express vs Django

| Criterio | Spring Boot ✓ | Node.js + Express | Django (Python) |
|----------|:-------------:|:-----------------:|:---------------:|
| Lenguaje | Java (tipado) | JavaScript | Python |
| ORM | JPA/Hibernate (maduro) | Sequelize / Prisma | Django ORM |
| Seguridad | Spring Security | Passport.js | Django Auth |
| Rendimiento | Alto (JVM) | Muy alto (event loop) | Medio |
| Ecosistema empresarial | Muy amplio | Amplio | Moderado |
| **Justificación** | Módulos DAD y AED basados en Java; estándar industrial para APIs REST en Java | | |

#### Frontend Web: React vs Vue.js vs Angular

| Criterio | React ✓ | Vue.js | Angular |
|----------|:-------:|:------:|:-------:|
| Paradigma | Biblioteca flexible | Framework progresivo | Framework completo |
| Curva de aprendizaje | Media | Baja | Alta |
| Ecosistema | Muy amplio | Amplio | Amplio |
| Demanda laboral | Muy alta | Alta | Alta |
| **Justificación** | Mayor demanda laboral; máxima flexibilidad para la SPA | | |

#### Cliente HTTP Android: Retrofit 2 vs Volley vs OkHttp

| Criterio | Retrofit 2 ✓ | Volley | OkHttp solo |
|----------|:------------:|:------:|:-----------:|
| Facilidad | Alta — interfaz declarativa | Media | Baja |
| Integración GSON | Automática | Manual | Manual |
| Mantenimiento | Activo (Square) | Google | Activo (Square) |
| **Justificación** | Menos código repetitivo; conversión JSON automática | | |

#### Lenguaje Android: Java vs Kotlin

| Criterio | Java ✓ | Kotlin |
|----------|:------:|:------:|
| Soporte oficial Android | Completo | Preferido por Google desde 2019 |
| Verbosidad | Mayor | Más conciso |
| Dominio del desarrollador | Mayor (ciclo formativo) | Requiere aprendizaje adicional |
| **Justificación** | El ciclo enseña Java; mayor dominio del desarrollador | |

#### Almacenamiento de sesión Android: SharedPreferences vs Room

| Criterio | SharedPreferences ✓ | Room |
|----------|:------------------:|:----:|
| Complejidad | Muy baja | Media |
| Tipo de datos | Clave-valor simple | Relacional con ORM |
| Caso de uso | Sesión (id, nombre, rol) | Datos complejos locales |
| **Justificación** | La sesión solo requiere guardar unos pocos campos simples | |

#### Base de datos: MySQL vs PostgreSQL vs MongoDB

| Criterio | MySQL ✓ | PostgreSQL | MongoDB |
|----------|:-------:|:----------:|:-------:|
| Tipo | Relacional | Relacional | NoSQL |
| JPA/Hibernate | Soporte completo | Soporte completo | No nativo |
| **Justificación** | Datos relacionales por naturaleza; integración directa con Spring Data JPA | | |

---

## 11. Repositorio

| Repositorio | URL |
|-------------|-----|
| **AgroSoS** | https://github.com/IsaacRamosDaw/AgroSoS|

<img width="1902" height="870" alt="image" src="https://github.com/user-attachments/assets/290ff97e-dfed-4277-b5b8-758850852530" />

**Ramas:** `main` (estable) · `dev` (desarrollo en curso)

---

## 12. Planificación

### 12.1 Metodología

El proyecto se ha desarrollado trabajando individualmente las partes repartidas y comunicando cambios hechos para su subsecuente pusheo y pulleo del repositorio.

**Gestor de tareas de Git**
<img width="1886" height="904" alt="image" src="https://github.com/user-attachments/assets/a0958f84-3eb1-4d79-b78f-3d66289d0b3d" />


### 12.2 Fases — Aplicación Web


| Fase | Tareas | Estado |
|------|--------|--------|
| 1. Análisis y diseño | Requisitos, modelado E/R, mockups | Completo |
| 2. Entorno | Spring Boot + MySQL + React + Vite | Completo |
| 3. Backend CRUD | Modelos JPA, repositorios, controladores REST | Completo |
| 4. Autenticación web | Registro, login, roles, Spring Security | Completo |
| 5. Vistas principales | Login, Registro, Home, FarmBot, Tractor, Admin, Perfil | Completo |
| 6. Generador de datos | Servicio periódico, endpoints de control | Completo |
| 7. Refinamiento UX | Modales de confirmación, validación inline, toasts | Completo |
| 8. Tests web | Vitest (utils, componentes, contextos), Postman | Completo |
| 9. Documentación | README, manuales | Completo |

### 12.3 Fases — Aplicación Móvil Android

| Fase | Tareas | Estado |
|------|--------|--------|
| 1. Análisis | Estudio de la API, modelos, wireframes | Completo |
| 2. Base | ApiClient, modelos, login/registro | Completo |
| 3. CRUD básico | Users, Plants, Devices con adaptadores y diálogos | Completo |
| 4. Roles y sesión | SessionManager, control por rol | Completo |
| 5. Lecturas | ReadingsActivity, agrupación por timestamp, popup | Completo |
| 6. Layouts landscape | `res/layout-land/` para todas las actividades | Completo |
| 7. Documentación | Diagramas, manuales, tests | Completo |

### 12.5 Dificultades encontradas y soluciones

| Dificultad | Solución adoptada |
|------------|------------------|
| Contextos React dispersos en varias carpetas | Centralizados en `src/context/`; archivos anteriores convertidos en re-exportadores para no romper imports. |
| `window.confirm` bloqueante en tests y UX web | Reemplazados por modales de estado custom con `useState`. |
| Labels de sensores en inglés (generadas en BD) | Actualizados los keyword matchers en backend y frontend para aceptar español sin romper compatibilidad. |
| Validación HTML5 nativa inconsistente entre navegadores | Implementada validación personalizada con `noValidate` y mensajes inline via `CFormFeedback`. |
| Campo `user` en `Device` es un `Long` y no un objeto anidado | Lectura directa del backend resolvió la ambigüedad en el cliente Android. |
| Rotación de pantalla sin pérdida de datos en Android | Layouts alternativos en `res/layout-land/` + gestión del estado en el ciclo de vida de la Activity. |

---

## 13. Conclusiones, opiniones y reflexiones

### Lo que hemos aprendido

- De primeras, crear un proyecto tan completo desde un comienzo nos pareció abrumador, nuestro conocimiento era limitado, y la idea de AgroSoS desde un comienzo era muy "abstracta", por qué volveríamos a hacer lo que ya trae el software de base del Farmbot?
- En cuanto más hablábamos sobre cómo podríamos diseñar la página, menos idea teníamos de lo que había que hacer. Pero por suerte el haber hecho el proyecto en "tandas" nos ayudó a construir algo funcional de primeras y luego intentar pulirlo de la mejor manera posible.
- Nos parece una lástima que finalmente no podamos tener datos reales que se recojan del huerto de verdad, ya que parte de la diversión iba a ser cómo manejar un flujo constante de datos de forma ordenada y legible.
- De todas formas, el haber podido trabajar en un proyecto tan completo y vivir el estrés de tener que llegar a un estándar, entregar en un plazo y trabajar juntos para evitar conflictos es una experiencia que tal vez no querríamos repetir, pero de la cual somos conscientes que es solo una pequeña muestra de lo que nos esperaría en nuestras vidas profesionales como desarrolladores.


---

## 14. Enlaces y referencias

| Recurso | URL |
|---------|-----|
| Spring Boot | https://docs.spring.io/spring-boot/docs/current/reference/html/ |
| Spring Data JPA | https://docs.spring.io/spring-data/jpa/docs/current/reference/html/ |
| React | https://react.dev/ |
| React Router DOM v7 | https://reactrouter.com/home |
| CoreUI para React | https://coreui.io/react/ |
| Vitest | https://vitest.dev/ |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro/ |
| Bootstrap 5 | https://getbootstrap.com/docs/5.3/ |
| Android Developers | https://developer.android.com |
| Retrofit 2 | https://square.github.io/retrofit/ |
| Gson | https://github.com/google/gson |
| RecyclerView | https://developer.android.com/guide/topics/ui/layout/recyclerview |
| Postman | https://learning.postman.com/docs/ |
| Vercel | https://vercel.com/docs |
| PlantText (PlantUML) | https://www.planttext.com |
| Draw.io | https://app.diagrams.net/ |

---

## 15. Anexos


### Anexo B — Dependencias Gradle (app/build.gradle — Android)

```groovy
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
}
```

---

### Anexo C — Dependencias npm (package.json — Frontend Web)

```json
"dependencies": {
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.4",
  "@coreui/react": "^5.9.1",
  "@coreui/coreui": "^5.4.3",
  "bootstrap": "^5.3.8",
  "chart.js": "^4.5.1"
},
"devDependencies": {
  "vite": "^7.1.7",
  "vitest": "^4.1.5",
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1"
}
```

---

*Documento del Proyecto Integrado · IES El Rincón · DAM 2.º Curso · 2024–2025*
