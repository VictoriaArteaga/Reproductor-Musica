<h1 align="center">Virelm Player</h1>

<p align="center">
  Reproductor de musica web desarrollado con React, TypeScript y Vite.
  <br/>
  Proyecto de la materia <strong>Estructuras de Datos</strong> — Universidad Cooperativa de Colombia.
</p>

<p align="center">
  <a href="https://virelus-git-main-victoriaarteagas-projects.vercel.app">Ver en vivo</a>
</p>

---

## Descripcion

Virelm Player es un reproductor de musica que implementa una **lista doblemente enlazada** como estructura de datos principal para gestionar playlists. Permite crear multiples playlists, agregar, eliminar, mover y reproducir canciones de forma interactiva desde el navegador.

## Estructura de Datos

El proyecto utiliza una **lista doblemente enlazada** (`Playlist.ts`) donde cada nodo (`SongNode.ts`) contiene una cancion (`Song.ts`) y referencias al nodo anterior y siguiente.

### Operaciones implementadas

| Metodo | Descripcion |
|---|---|
| `appendSong(song)` | Agrega una cancion al **final** de la lista |
| `prepend(song)` | Agrega una cancion al **inicio** de la lista |
| `insert(song, position)` | Inserta una cancion en una **posicion especifica** (medio) |
| `remove(index)` | Elimina una cancion por su indice |
| `move(from, to)` | Mueve una cancion de una posicion a otra |
| `traverseToIndex(index)` | Recorre la lista hasta el indice indicado |
| `playFirst()` | Reproduce la primera cancion |
| `playNext()` | Avanza a la siguiente cancion (circular) |
| `playPrev()` | Retrocede a la cancion anterior (circular) |
| `playAt(index)` | Reproduce la cancion en un indice especifico |
| `toArray()` | Convierte la lista enlazada a un arreglo |

## Funcionalidades

### Gestion de Playlists
- **Crear multiples playlists** con nombre personalizado
- **Portada de playlist**: agregar imagen al crear o cambiarla despues
- **Eliminar playlists** (minimo una siempre activa)
- **Cambiar entre playlists** desde el sidebar o los chips
- **Reproducir playlist completa** con un solo boton

### Gestion de Canciones
- **Agregar canciones** con tres opciones de posicion:
  - Al inicio (`prepend`)
  - En el medio (`insert`)
  - Al final (`appendSong`)
- **Seleccionar playlist destino** al agregar una cancion
- **Eliminar canciones** de la lista
- **Mover canciones** de posicion (subir/bajar)
- **Cambiar nombre** de la cancion
- **Cambiar artista** de la cancion
- **Marcar como favorita** con el boton de corazon
- **Boton de play individual** en cada cancion (se oculta cuando esta sonando)

### Reproductor
- Reproduccion con controles de **play/pausa**, **siguiente** y **anterior**
- **Barra de progreso** interactiva (click para saltar a cualquier punto)
- **Control de volumen**
- Avance automatico a la siguiente cancion al terminar
- Imagen rotando durante la reproduccion

### Imagenes personalizadas
- Cada cancion muestra la **imagen de su genero** musical por defecto
- El usuario puede **cambiar la imagen** de cada cancion haciendo click en la miniatura
- La imagen personalizada se refleja en la lista, el sidebar y el reproductor

### Generos disponibles
- Pop
- Rock
- Electronica
- Folklore
- Hip-Hop / Rap
- Latino / Tropical
- Reggaeton

### Interfaz
- Tema fresco con paleta de teal, coral, dorado y ciruela
- Tipografia **Comfortaa** para el titulo, **Poppins** para el contenido
- Cada cancion se muestra en su propia **card individual**
- Card de "Reproduciendo Ahora" con fondo sutil de la imagen de la cancion
- Sidebar claro con imagen de la playlist o del genero de la cancion actual
- Multiples playlists visibles como chips interactivos

## Tecnologias

- **React 18** con hooks (`useState`, `useEffect`, `useRef`)
- **TypeScript** para tipado estatico
- **Vite** como bundler y servidor de desarrollo
- **CSS** puro con variables CSS personalizadas
- **Google Fonts** (Comfortaa, Poppins)

## Estructura del proyecto

```
src/
  models/
    Song.ts          # Clase Song (datos de la cancion)
    SongNode.ts      # Nodo de la lista doblemente enlazada
    Playlist.ts      # Lista doblemente enlazada con todas las operaciones
  hooks/
    usePlaylist.ts   # Hook que conecta el modelo con la UI (multiples playlists)
  components/
    SongForm.tsx     # Formulario para agregar canciones
    SongList.tsx     # Lista visual de canciones (cards)
    SongItem.tsx     # Componente individual de cancion
    LivePlayerCard.tsx # Card del reproductor "Reproduciendo Ahora"
    PlayerControls.tsx # Controles de reproduccion
  pages/
    Home.tsx         # Pagina principal
  assets/
    styles/
      global.css     # Estilos globales
```

## Como ejecutar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar build de produccion
npm run build
```

## Autora

***Maria Victoria Arteaga Revelo***
---

<p align="center"><em>Virelm Player</em></p>
