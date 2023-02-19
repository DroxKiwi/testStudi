Modèle :

    Il contient les données et la logique applicative.

    Exemple : les données avec leur validation et les calculs qui peuvent être associés.

Vue :

    Elle correspond à l'interface graphique, donc la partie visible par l'utilisateur de l'application web.

    Exemple : le code HTML des pages et des formulaires.

Contrôleur :

    Il est en charge du traitement des actions de l'utilisateur. Il sert également à faire le lien entre le modèle et la vue.

    Exemple : le code appelé directement lorsqu'un utilisateur demande l'affichage d'une page web 
    et qui va devoir faire appel au modèle et à la vue pour retourner le résultat à afficher.


EXEMPLE : 

MODEL :
```php
<?php

class Photos
{
    private $pdo = null;

    public function __construct()
    {
        try {
            $this->pdo = new PDO('mysql:host=localhost;dbname=book;charset=utf8', 'root', 'root');
        } catch (PDOException $e) {
            exit('Erreur : '.$e->getMessage());
        }
    }

    public function listerPhotos()
    {
        if (!is_null($this->pdo)) {
            $stmt = $this->pdo->query('SELECT * FROM photo');
        }
        $photos = [];
        while ($photo = $stmt->fetchObject()) {
            $photos[] = $photo;
        }

        return $photos;
    }
}
?>
```
VUE : 
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Mon book</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<header>
    <h1>Mon book</h1>
</header>
<section>
    <nav>
        <ul>
            <li><a href="/">Accueil</a></li>
        </ul>
    </nav>
    <article>
        <?php foreach ($photos as $photo): ?>
            <img src="photos/<?= $photo->fichier ?>" width="250" />
            <h2><?= $photo->titre ?></h2>
        <?php endforeach; ?>
    </article>
</section>
<footer>
    <p>Mon book - Tous droits réservés</p>
</footer>
</body>
</html>
```
CONTROLLER :
```php
<?php
require_once('modeles/Photos.php');
$photos = new Photos();
$photos = $photos->listerPhotos();
require_once('vues/liste-photos.php');
?>
```

Ci-dessous le fichier vues/layout.php dans lequel la structure HTML a été ajoutée. 
Le titre et le contenu du corps de la page sont remplacés par des variables qui seront définies dans les templates correspondant aux pages.


LAYOUT : 

vues/layout.php
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title><?= $titre ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<header>
    <h1>Mon book</h1>
</header>
<section>
    <nav>
        <ul>
            <li><a href="/">Accueil</a></li>
        </ul>
    </nav>
    <?= $contenu ?>
</section>
<footer>
    <p>Mon book - Tous droits réservés</p>
</footer>
</body>
</html>
```
vues/liste-photos.php
```php
<?php
$titre = 'Mon book';
ob_start();
?>
    <article>
        <?php foreach ($photos as $photo): ?>
            <a href="photo.php?id=<?= $photo->id ?>">
                <img src="photos/<?= $photo->fichier ?>" width="250" />
            </a>
            <h2><?= $photo->titre ?></h2>
        <?php endforeach; ?>
    </article>
<?php
$contenu = ob_get_clean();
require_once('layout.php');
?>
```
La fonction ob_start() permet de temporiser la sortie en la plaçant dans une mémoire tampon. 
Puis la fonction ob_get_clean() retourne le contenu du tampon qui peut être récupéré dans une variable et l'efface. 
Ce processus permet de mettre le code HTML généré dans la variable contenue afin de l'afficher dans l'ordre souhaité, 
c'est-à-dire au milieu des balises <section> du layout.


vues/affiche-photo.php
```php
<?php
$titre = 'Une photo de mon book';
if (is_null($photo)):
    $contenu = "Cette photo n'existe pas.";
else:
    ob_start();
?>
        <article>
            <img src="photos/<?= $photo->fichier ?>" width="500" />
            <h2><?= $photo->titre ?></h2>
        </article>
<?php
    $contenu = ob_get_clean();
endif;
require_once('layout.php');
?>
```
Pour appliquer ce principe, nous allons créer une classe Controleur. 
Une méthode listerPhotos() va être chargée de répondre à la demande d'affichage de la page d'accueil et une méthode afficherPhoto() 
va permettre l'affichage d'une seule photo en grand format.


Finalement, cela revient en grande partie à déplacer le code des fichiers index.php et photo.php dans cette nouvelle classe.
```php
<?php

class Controleur
{
    public function listerPhotos()
    {
        $photos = new Photos();
        $photos = $photos->listerPhotos();
        require_once('vues/liste-photos.php');
    }

    public function afficherPhoto()
    {
        $photos = new Photos();
        if (isset($_GET['id']) && is_numeric($_GET['id'])) {
            $photo = $photos->afficherPhoto($_GET['id']);
        }
        require_once('vues/affiche-photo.php');
    }
}
?>
```
Le code source du contrôleur frontal index.php est alors largement simplifié en faisant appel à la classe Controleur.
```php
<?php
require_once('controleurs/Controleur.php');
require_once('modeles/Photos.php');
$controleur = new Controleur();
if (isset($_GET['page']) && 'photo' === $_GET['page']) {
    $controleur->afficherPhoto();
} else {
    $controleur->listerPhotos();
}
?>
```

Un trait est un morceau de code que l'on peut réutiliser dans plusieurs classes. 
Le fait d'utiliser le mot-clé use dans une classe pour utiliser un trait 
revient schématiquement à copier le code du trait dans l'endroit précis de la classe. 
Plus de détails sont précisés dans la documentation officielle de PHP.


modeles/Modele.php
```php
<?php

trait Modele
{
    private $pdo = null;

    public function __construct()
    {
        try {
            $this->pdo = new PDO('mysql:host=localhost;dbname=book;charset=utf8', 'root', 'root');
        } catch (PDOException $e) {
            exit('Erreur : '.$e->getMessage());
        }
    }
}
?>

modeles/Photo.php
```
```php
<?php

class Photo
{
    use Modele;

    private $id;

    private $fichier;

    private $titre;

    public function afficherPhoto($id)
    {
        if (!is_null($this->pdo)) {
            $stmt = $this->pdo->prepare('SELECT * FROM photo WHERE id = ?');
        }
        $photo = null;
        if ($stmt->execute([$id])) {
            $photo = $stmt->fetchObject('Photo');
            if(!is_object($photo)) {
                $photo = null;
            }
        }

        return $photo;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getFichier()
    {
        return $this->fichier;
    }

    public function getTitre()
    {
        return $this->titre;
    }
}
?>
```
modeles/Photos.php
```php
<?php

class Photos
{
    use Modele;

    public function listerPhotos()
    {
        if (!is_null($this->pdo)) {
            $stmt = $this->pdo->query('SELECT * FROM photo');
        }
        $photos = [];
        while ($photo = $stmt->fetchObject('Photo')) {
            $photos[] = $photo;
        }

        return $photos;
    }
}
?>
```
controleurs/Controleur.php
```php
<?php

class Controleur
{
    public function listerPhotos()
    {
        $photos = new Photos();
        $photos = $photos->listerPhotos();
        require_once('vues/liste-photos.php');
    }

    public function afficherPhoto()
    {
        $photo = new Photo();
        if (isset($_GET['id']) && is_numeric($_GET['id'])) {
            $photo = $photo->afficherPhoto($_GET['id']);
        }
        require_once('vues/affiche-photo.php');
    }
}
?>
```
index.php 
```php
<?php
require_once('controleurs/Controleur.php');
require_once('modeles/Modele.php');
require_once('modeles/Photo.php');
require_once('modeles/Photos.php');
$controleur = new Controleur();
if (isset($_GET['page']) && 'photo' === $_GET['page']) {
    $controleur->afficherPhoto();
} else {
    $controleur->listerPhotos();
}
?>
```