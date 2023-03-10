Prenons l'exemple d'une classe permettant d'écrire dans un fichier : 
on ouvre le fichier et on stocke la ressource vers ce fichier dans une propriété, qui sera réutilisée par les autres méthodes.

```php
<?php

class File
{
    public $fileResource;

    public function __construct(string $filename)
    {
        $this->fileResource = fopen($filename, 'a');
    }

    public function write(string $content)
    {
        return fwrite($this->fileResource, $content);
    }

    public function close(): bool
    {
        return fclose($this->fileResource);
    }
}
?>
```

La visibilité publique permet à n'importe qui d'accéder aux propriétés et aux méthodes de notre classe. 
C'est la visibilité que nous utilisions jusqu'à présent.

La visibilité protégée permet d'interdire l'utilisation d'une méthode ou d'une propriété en dehors de notre classe ou de ses classes filles. 
C'est-à-dire que n'importe quel objet instancié à l'extérieur de notre classe ne pourra pas les utiliser. 
En d’autres termes, cela signifie que les éléments protégés ne seront accessibles que depuis la variable $this.

Enfin, la visibilité privée permet d'interdire l'utilisation d'une méthode ou d'une propriété strictement en dehors de notre classe. 
Même les classes filles n'auront pas accès à ces éléments.