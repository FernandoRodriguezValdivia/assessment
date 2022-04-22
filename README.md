## Información General
***
Backend de un servicio de almacenamiento y organización de favoritos, tales como:
música, ropa, cursos, etc.

### Crear usuario
* Para crear un usuario se usa un email y una contraseña que debe contener 1 mayúscula, 1 caracter especial, 1 número y una longitud de más 7 caracteres.
* Para crear el usuario se usa la ruta: /auth/create y el método post.

### Ingresar usuario
* Para ingresar un usuario se usa un email y su contraseña correspondiente.
* Para ingresar el usuario se usa la ruta: /auth/local/login y el método post.
* Al ingresar un usuario nos responde con su token correspondiente.

### Obtener la lista de favoritos de un usuario
* Para obtener la lista se debe enviar el token correspondiente al ingresar.
* Para obtener la lista se usa la ruta: /api/favs y el método get

### Crear una lista de favoritos de un usuario
* Para crear una lista se debe enviar el token correspondiente al ingresar.
* Para obtener la lista se usa la ruta: /api/favs y el método post
* Tambíen se debe enviar la lista como un json de la siguiente forma:

```json
{
    "name": "ropa",
    "favs": [
        {
            "name": "Casaca",
            "description": "Azul",
            "link": "https://www.example-casaca.com"
        },
        {
            "name": "Pantalón",
            "description": "Verde",
            "link": "https://www.example-pantalon.com"
        }
    ]
}
```

### Obtener una lista de favoritos de un usuario
* Para obtener una lista se debe enviar el token correspondiente al ingresar.
* Tambíen se debe enviar el id de la correspondiente lista en la ruta de la siguiente forma: /api/favs/:id y el método get

### Eliminar una lista de favoritos de un usuario
* Para eliminar una lista se debe enviar el token correspondiente al ingresar.
 Tambíen se debe enviar el id de la correspondiente lista en la ruta de la siguiente forma: /api/favs/:id y el método delete

 ### Envio del token
 * En todos los métodos que se requiere enviar el token este se envía usando la cabecera:
 ```json
 {
    "headers": {
            "Authorization": "Bearer ${token}"
 }
 
 ```

 ## Dependencias
***
* [express](https://www.npmjs.com/package/express) Versión 4.17.3
* [bcrypt](https://www.npmjs.com/package/bcrypt) Versión 5.0.1
* [cross-env](https://www.npmjs.com/package/cross-env) Versión 7.0.3
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) Versión 8.5.1
* [mongoose](https://www.npmjs.com/package/mongoose) Versión 6.3.1

## Instalación
***
Para instalar se debe clonar el repositorio, crear el archivo .env e instalar las dependencias con npm install e iniciar con npm start

```
$ git clone https://github.com/FernandoRodriguezValdivia/assessment.git
$ cd assessment
$ npm install
$ npm start
```