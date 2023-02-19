# Symfony présentation et base du Framework

Tout d'abord, vous devez avoir installé PHP [last version] et Composer sur votre machine, et les avoir disponibles depuis votre ligne de commande.

Créer un nouveau projet Symfony : 

composer create-project symfony/skeleton:"6.2.*" my_project_directory
cd my_project_directory
composer require webapp

si erreur console avec commande symfony : 
```bash
export PATH="$HOME/.symfony[version]/bin:$PATH"
```
dans le fichier ~/.bashrc 

puis 
```bash
source ~/.bashrc
```

    bin

    Contient certains exécutables comme la console ou phpunit pour lancer les tests. Vous n’intervenez que très peu sur ce dossier.

    config

    Contient tous les fichiers de configuration de l’application. Cela peut être la configuration de Symfony lui-même ou bien 
    celle des packages installés par Composer. Vous serez amené à beaucoup travailler dans ce dossier pour donner des indications 
    sur le fonctionnement de votre application.

    migrations

    Ce dossier contient l’historique, étape par étape, de la construction de la base de données. À chaque nouvelle modification 
    de la structure de la base de données (ajout/suppression d’une table, ajout/suppression d’un champ, changement de type d’un champ, 
    par exemple) un fichier reflétant l’opération réalisée sera généré, permettant ainsi de suivre la construction de la base de 
    données et pour pouvoir la recréer automatiquement.

    Les outils de Symfony CLI liés à la base de données se servent de ce dossier pour travailler.

    public

    Ce dossier contient le premier fichier qui sera lu lors du lancement de l’application. Il contient également tout ce que le visiteur 
    du site sera autorisé à voir : fichiers HTML, CSS, js, les images, etc. Le visiteur du site n’a pas accès à ce qui se trouve en dehors 
    de ce dossier. Il est donc fondamental de ne rien mettre dans ce dossier qui serait confidentiel.

    src

    C’est le dossier principal de votre application. Tout le code de votre application se trouvera dans ce dossier. Vous y passerez donc la 
    plupart de votre temps.

    templates

    Ce dossier contient toutes les vues de l’application, c’est-à-dire vos fichiers HTML, mais avec quelques particularités. 
    Les fichiers templates utilisent le moteur de rendu TWIG pour travailler avec Symfony.

    tests

    Contient tous les fichiers permettant d’effectuer des tests unitaires, d’intégration ou d’application. 
    La structure de ce dossier doit obligatoirement reprendre la structure du dossier « /src » de votre application. 
    PHPUnit cherchera par défaut les fichiers de test dans ce dossier.

    translations

    Si votre application gère le multilingue, ce dossier contiendra les fichiers de traductions. 
    Chaque fichier pouvant correspondre à un domaine particulier et à une langue donnée.

    var

    Accessible en écriture par le serveur, ce dossier contient les fichiers temporaires, les fichiers de travail, le cache, etc. 
    Vous n’avez généralement pas besoin d’aller dans ce dossier.

    vendor

    Contient tous les dossiers système nécessaires au fonctionnement interne de Symfony. Ce dossier contient également les 
    dossiers des packages installés par Composer.



Créer un controller :
```bash
php bin/console make:controller name
```

Routing

{id} => $slug
```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class BlogController extends AbstractController
{
    /**
     * @Route("/posts/{id}")
     */
    public function post(int $id)
    {
	  // Grâce au paramètre $id, on récupère le post afin de l'afficher
    }
}
```

Il est possible de spécifier quelles sont les méthodes HTTP autorisées pour une route.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

class BlogController extends AbstractController
{
    /**
     * @Route("/posts/{id}", methods={"POST", "PATCH"})
     */
    public function savePost(int $id)
    {
	// On créera ou mettra à jour un message via cette action
    }

    /**
     * @Route("/posts/{id}", methods={"GET"})
     */
    public function post(int $id)
    {
	// On récupère le message via cette action
    }
}
```

Le router nous permet de préfixer les routes de toutes les actions d'un contrôleur. Imaginons par exemple qu'on souhaite ajouter /blog avant /posts et toute autre route dans ce contrôleur, plutôt que d'avoir à l'ajouter à chacune d'elles : on peut ajouter une annotation @Route au niveau de la classe.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/blog")
 */
class BlogController extends AbstractController
{
    /**
     * @Route("/posts/{id}", methods={"POST", "PATCH"})
     */
    public function savePost(int $id)
    {
	// On créera ou mettra à jour un message via cette action
    }

    /**
     * @Route("/posts/{id}", methods={"GET"})
     */
    public function post(int $id)
    {
	// On récupère le post via cette action
    }
}
```

Il est possible de rendre un paramètre optionnel, en lui donnant une valeur par défaut.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog")
 */
class BlogController extends AbstractController
{
    /**
     * @Route("/posts/{id}", methods={"POST", "PATCH"})
     */
    public function savePost(int $id = 1)
    {
	// Ici on donne à $id une valeur par défaut de 1
    }

    /**
     * @Route("/posts/{id?1}", methods={"GET"})
     */
    public function post(Post $post)
    {
	// Il est également possible d'assigner cette valeur par défaut directement dans le paramètre, en ajoutant ? suivi de la valeur
    }
}
```
Dès lors, l'URL /posts en GET correspondra bien à la seconde action et nous affichera le message ayant 1 pour ID.


Le routeur nous permet de valider les données des paramètres de nos URL. Par exemple, le paramètre{id} de notre route app_blog_post devrait nécessairement être un entier. Mais, en l'état, si un utilisateur écrivait /post/test, ce serait quand même cette route qui serait choisie, ce qui lancerait une erreur 404 puisque aucun message n'aurait test comme ID.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog")
 */
class BlogController extends AbstractController
{
    /**
     * @Route(
     *    "/posts/{id}",
     *    methods={"POST", "PATCH"},
     *    requirements={"id"="\d+"}
     * )
     */
    public function savePost(int $id = 1)
    {
	// On rajoute un champ « requirements » pour préciser, via une regex, que le slug « id » doit forcément être un entier positif
    }

    /**
     * @Route("/posts/{id<\d+>?1}", methods={"GET"})
     */
    public function post(Post $post)
    {
	// On peut également rajouter la validation directement dans le paramètre entre <>, attention à la lisibilité cela dit
    }
}
```

Lorsque ce paramètre est ajouté, il permet d'ajouter le header Content-Type à la réponse HTTP.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog")
 */
class BlogController extends AbstractController
{
    /**
     * @Route(
     *    "/posts/{id}",
     *    methods={"POST", "PATCH"},
     *    requirements={"id"="\d+"}
     * )
     */
    public function savePost(int $id = 1)
    {
	// On rajoute un champ « requirements » pour préciser, via une regex, que le paramètre « id » doit forcément être un entier positif
    }

   /**
   * @Route(
   * "{_locale}/posts/{id<\d+>?1}.{_format}",
   * methods={"GET"}),
   * requirements={"_format"="json|html"}
   * )
   */
    public function post(Post $post)
    {
	// On peut également rajouter la validation directement dans le paramètre entre <>, attention à la lisibilité cela dit
    }
}
```

Comme _format, il s’agit d’un paramètre spécial avec un comportement pré-défini. Si ce paramètre est ajouté, il permet de définir la langue dans laquelle la page sera servie. Attention toutefois, il faut avoir un fichier de traduction correspondant à la langue choisie. Il est donc important de rajouter un requirement pour ne proposer que les langues dont les traductions existent.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog", requirements={"_locale" : "fr|en"})
 */
class BlogController extends AbstractController
{
    /**
     * @Route(
     *    "/posts/{id}",
     *    methods={"POST", "PATCH"},
     *    requirements={"id"="\d+"}
     * )
     */
    public function savePost(int $id = 1)
    {
    }

    /**
    * @Route(
    * "{_locale}/posts/{id<\d+>?1}.{_format}",
    * methods={"GET"}),
    * requirements={"_format"="json|html"}
    * )
    */
    public function post(Post $post)
    {
	// On peut rajouter les requirements pour le paramètre _locale dans la configuration de la route, ou alors pour toutes les actions du contrôleur comme c'est le cas ici
    }
}
```

On peut donc directement inscrire le code métier en manipulant l’entité souhaitée.

Dans le code ci-dessous, cela se caractérise par l’annotation ParamConverter qui précise le type de l’entité (ici l’entité Post) à récupérer suivant la valeur du slug {id}, et à passer en paramètre de la méthode (ici la méthode post).A noter qu’il faut ajouter la dépendance vers l’entité en laquelle doit être converti notre paramètre, via la commande use.

```php
<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog")
 */
class BlogController extends AbstractController
{
    /**
     * @Route(
     *    "/posts/{id}",
     *    methods={"POST", "PATCH"},
     *    requirements={"id"="\d+"}
     * )
 */
    public function savePost(int $id = 1)
    {
    // Actions métiers à définir
    }
    
        /**
     * @Route("/posts/{id<\d+>?1}", methods={"GET"})
         * @ParamConverter("post", class="App\Entity\Post")
         */
        public function post(Post $post)
        {
        // On peut également rajouter la validation directement dans le paramètre entre <>, attention à la lisibilité cela dit
        }
}
```

Dans un template Twig

Afin de générer une URL directement depuis les vues dans Twig, on peut faire appel à la fonction path().


```html
<a href="{{ path('app_blog_post', {'_locale': 'fr', 'id': 1, '_format': 'html'}) }}">Voir le message</a>
```

Dans un contrôleur

Depuis un contrôleur qui étend la classe AbstractController, on a accès à la méthode generateUrl(), à laquelle il faut passer en paramètres le nom de la route et un tableau contenant les slugs et leurs valeurs.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Post;

/**
 * @Route("/blog", requirements={"_locale" : "fr|en"})
 */
class BlogController extends AbstractController
{
    /**
     * @Route(
     *    "/posts/{id}",
     *    methods={"POST", "PATCH"},
     *    requirements={"id"="\d+"}
     * )
     */
    public function savePost(int $id = 1)
    {
        $route = $this->generateUrl('app_blog_post', [
            '_locale' => 'fr', 
            'id' => 1,
            '_format' => 'html',
        ]);
	// Génère une URL pour la route app_blog_post

        // Lors de la génération d'une route avec _locale,
        // il est possible de ne pas préciser de valeur, Symfony prendra
        // alors la valeur actuelle de la requête. Comme on a également
        // rendu id facultatif, on pourrait donc générer la route de cette manière 

        $route = $this->generateUrl('app_blog_post', [
            '_format' => 'html',
        ]);
    }

    // ...
}
```


Dans un service

Afin de pouvoir générer des URL depuis un service, il faut lui injecter le service UrlGeneratorInterface, qui nous donne accès à la méthode generate(), dont on se sert de la même façon que la méthode generateUrl() dans un contrôleur.

Les services étant des objets accessibles depuis l’ensemble du code, la définition d’URL dans les services peut être intéressante notamment pour des URL vers lesquelles la redirection sera courante.

Le code est ainsi factorisé au niveau du service, et toutes les actions des différents contrôleurs devant rediriger vers cette URL pourront le faire par appel du service plutôt que de développer à nouveau le même code.

```php
<?php

namespace App\Service;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class Service
{
    private $router;

    public function __construct(UrlGeneratorInterface $router)
    {
        $this->router = $router;
    }

    public function getUrl()
    {
        $route = $this->generate('app_blog_post', [
            '_locale' => 'fr', 
            'id' => 1,
            '_format' => 'html',
        ]);
    }
}
```


Symfony Maker est un pack qui vous aide à créer des contrôleurs, des formulaires, des tests et bien plus encore.

Tout d’abord, assurez-vous que le bundle soit installé en consultant le fichier « composer.json ». Si ce n’est pas le cas, tapez la ligne de commande suivante :

```bash
composer require --dev symfony/maker-bundle
```

Maintenant créons un contrôleur avec la ligne de commande suivante :

```bash 
php bin/console make:controller NewController
```

Le but va être de créer un CRUD (Create, Read, Update, Delete), c’est-à-dire les fonctions de base qui permettent de créer, de récupérer, de mettre à jour ou de supprimer des objets.

Pour cela, utilisons la ligne de commande suivante qui va utiliser une Entité déjà créé qui se nomme Figure :

```bash
php bin/console make:crud Figure
```

Voici le code que Symfony nous a généré dans le nouveau contrôleur qui se nomme « FigureController » :

```php
<?php

namespace App\Controller;

use App\Entity\Figure;
use App\Form\FigureType;
use App\Repository\FigureRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/figure')]
class FigureController extends AbstractController
{
   #[Route('/', name: 'app_figure_index', methods: ['GET'])]
   public function index(FigureRepository $figureRepository): Response
   {
       return $this->render('figure/index.html.twig', [
           'figures' => $figureRepository->findAll(),
       ]);
   }

   #[Route('/new', name: 'app_figure_new', methods: ['GET', 'POST'])]
   public function new(Request $request, FigureRepository $figureRepository): Response
   {
       $figure = new Figure();
       $form = $this->createForm(FigureType::class, $figure);
       $form->handleRequest($request);

       if ($form->isSubmitted() && $form->isValid()) {
           $figureRepository->add($figure, true);

           return $this->redirectToRoute('app_figure_index', [], Response::HTTP_SEE_OTHER);
       }

       return $this->renderForm('figure/new.html.twig', [
           'figure' => $figure,
           'form' => $form,
       ]);
   }

   #[Route('/{id}', name: 'app_figure_show', methods: ['GET'])]
   public function show(Figure $figure): Response
   {
       return $this->render('figure/show.html.twig', [
           'figure' => $figure,
       ]);
   }

   #[Route('/{id}/edit', name: 'app_figure_edit', methods: ['GET', 'POST'])]
   public function edit(Request $request, Figure $figure, FigureRepository $figureRepository): Response
   {
       $form = $this->createForm(FigureType::class, $figure);
       $form->handleRequest($request);

       if ($form->isSubmitted() && $form->isValid()) {
           $figureRepository->add($figure, true);

           return $this->redirectToRoute('app_figure_index', [], Response::HTTP_SEE_OTHER);
       }

       return $this->renderForm('figure/edit.html.twig', [
           'figure' => $figure,
           'form' => $form,
       ]);
   }

   #[Route('/{id}', name: 'app_figure_delete', methods: ['POST'])]
   public function delete(Request $request, Figure $figure, FigureRepository $figureRepository): Response
   {
       if ($this->isCsrfTokenValid('delete'.$figure->getId(), $request->request->get('_token'))) {
           $figureRepository->remove($figure, true);
       }

       return $this->redirectToRoute('app_figure_index', [], Response::HTTP_SEE_OTHER);
   }
}
```

index(), dont le but est de retourner dans la vue aussi crée (figure/index.html.twig) toutes les figures de la base de données.

new(), qui utilise la méthode Post et donc permet de créer une nouvelle Figure à partir d’un formulaire. Formulaire qui a d’ailleurs été ajouté dans le dossier « Form » sous le nom de « FigureType ».

show(), dont le but est de retourner une figure en détail grâce à l’id passé en paramètre de l’url.

edit(), qui va permettre de modifier une figure précise grâce à l’id.

delete(), qui, comme son nom l’indique, va permettre au contrôleur de supprimer une figure.

# Installation de Twig

Si vous avez utilisé le mode d’installation d’application web de Symfony, il est fort probable que Twig soit déjà installé par défaut. Mais cela n’est pas une obligation car Twig est un moteur de templates utilisé par Symfony mais ne fait pas partie de Symfony. Cela signifie que vous pouvez installer Twig dans un projet PHP sans Symfony mais aussi dans des projets Open Source comme Drupal8, eZPublish, phpBB, Matamo, OroCRM ainsi que sur de nombreux frameworks tels que Lavarel, même si, par défaut, ils utilisent d’autres moteurs de templates.

Voici comment l’installer avec Composer, il suffit de taper cette ligne de commande dans le répertoire de votre projet :

```bash
composer require “twig/twig:^3.0”
```

Cela va télécharger et installer Twig et toutes les dépendances nécessaires dans votre projet. Vous devrez peut-être utiliser sudo si vous rencontrez des erreurs de permission. Par défaut un projet Symfony inclut l’autoloader de Composer, il ne sera pas nécessaire de require_once dans vos pages Twig.

Vous pouvez ensuite utiliser Twig dans votre code en suivant la documentation de Twig : Symfony Hub

Veuillez noter que la version 3.x de Twig demande une version de PHP 7.2.5 au minimum pour fonctionner.

## Utilisation et syntaxe de Twig

Twig peut générer du texte de n’importe quel format textuel (HTML, XML, CSV, Latex, etc.). Dans ce cours, nous partirons sur des exemples basés sur le HTML, qui représentent la plus grande utilisation de Twig.

Comme nous l’avons vu précédemment, la force d’un moteur de templates comme Twig se situe dans le fait de pouvoir insérer des variables, des expressions et des conditions PHP dans du HTML. Notez la syntaxe particulière qui est nativement supportée par Twig afin de nous apporter cette puissance :
```
    « {{ … }}  » : permet l’affichage d’une expression

    « {% … %} » : exécute une action

    « {# … #}  » : permet d’ajouter des commentaires
```

Les Variables

La puissance de Twig c’est de pouvoir afficher des éléments issus de PHP. Par exemple un objet, un tableau ou, bien souvent, des éléments issus de la base de données. C’est le contrôleur qui a pour mission d’associer ces éléments à la vue. Pour Twig ces éléments sont des variables (attention à ne pas confondre avec une variable en PHP).

Ces variables peuvent être un objet et ce même objet peut avoir des attributs. On peut par ailleurs y accéder en utilisant la syntaxe :
```
{{ objet.attribut }}
```

Dans l’exemple ci-dessous « image.name » fait référence au nom de l’objet image. Twig affichera donc son nom. Grâce à cette syntaxe, il est possible d’accéder à des méthodes, des propriétés d’un objet, ou même un élément de tableau.

La balise set

Vous pouvez aussi à tout moment créer une variable grâce à la balise « set » :

```
{%  set exemple = ‘coucou’ %}
```
Cela définira la variable exemple avec la chaîne de caractères « coucou ». Vous pouvez ensuite utiliser cette variable ailleurs dans votre modèle en la référençant avec {{ exemple }}.
```
{% set exempleTableauIteratif = [1,2] %}
```
Ce code définira la variable exempleTableauIteratif comme étant un tableau contenant les éléments 1 et 2. Il ne produira aucune sortie dans le modèle.
```
{% set exempleTaleauAssociatif = {‘lundi’ : ‘travail’} %}
```
Ce code définira la variable exempleTaleauAssociatif comme étant un tableau associatif (également appelé dictionnaire ou map) avec un seul élément. L’élément a une clé « lundi » et une valeur « travail ».

## Composer

Gérer les dépendances d'un projet PHP par Composer est une bonne pratique qui permet de simplifier leur gestion sur le long terme. Pour gérer les dépendances d'un projet, il faut donc savoir au préalable quelles dépendances existent et lesquelles correspondent aux spécifications du projet. Pour cela, il est possible d'utiliser Packagist, qui est l’endroit où sont répertoriées toutes les dépendances connues de Composer. On appelle cela un repository. Nous allons voir comment utiliser Packagist pour rechercher une dépendance adaptée à nos besoins, puis nous expliquerons quelle est la différence entre une bibliothèque et un bundle Symfony.

## composer.[json][lock]

Le fichier composer.json contient la liste des principales dépendances nécessaires au fonctionnement du projet et précise toutes les configurations nécessaires à leur installation et à leur utilisation, comme leur numéro de version ou leur répertoire d'installation, par exemple. L'élément principal constituant le fichier composer.json est sa propriété "required", qui liste toutes les dépendances nécessaires ainsi que leur numéro de version.

Le fichier composer.lock contient toutes les informations et configurations de chacune des dépendances actuellement installées dans le projet. C'est sur ce fichier que Composer se base pour installer ses dépendances, s'il est présent dans l'arborescence du projet. Il permet donc d'assurer une cohérence de version et de configuration entre différentes instances d'un même projet, que ce soit sur des postes de développement différents ou sur différents serveurs.

    composer update

La commande composer update a comparé les versions existantes des dépendances du projet à celles disponibles sur Packagist. Puisqu'une nouvelle version de certaines d'entre elles est présente, celles-ci ont été mises à jour et les versions correspondantes ont été actualisées dans le fichier composer.lock.

    composer remove easycorp/easyadmin-bundle

La commande composer remove easycorp/easyadmin-bundle va supprimer toutes les dépendances associées au package easycorp/easyadmin-bundle avant de le désinstaller.

## Symfony Flex

Afin de pouvoir être utilisée, la dépendance Symfony Flex requiert une arborescence des fichiers du projet spécifique. En effet, cela lui permettra de créer les fichiers de configuration des bundles aux bons endroits.

Lors de l'ajout d'un bundle via Composer, Symfony Flex va se baser sur un fichier de configuration présent à la racine du projet pour déterminer les actions automatiques à réaliser : le fichier symfony.lock.

    .
    |-- bin
    |-- config
    |   |-- routes
    |   |-- bootstrap.php
    |   |-- bundles.php
    |   |-- packages
    |   |-- routes.yaml
    |   `-- services.yaml
    |-- public
    |-- src
    |   |-- Controller
    |   `-- Kernel.php
    |-- var
    |-- composer.json
    |-- composer.lock
    `-- symfony.lock

Structure de fichier attendue par Symfony Flex 

# Les entités

Qu'est-ce qu'un ORM ?

Les ORM, pour "Object Relational Mapping", sont des outils qui permettent de représenter une base de données relationnelle de façon orientée objet.

Concrètement, bien que nous ayons toujours une base de données classique, comme avec MySQL, nous ne travaillerons plus directement en SQL. Nous utiliserons notre ORM pour interagir de façon orientée objet avec elle, via un type de classe spéciale, qu'on appelle une Entity, ou « entité » en français. Notre ORM s'occupera donc de générer lui-même les requêtes SQL correspondant à ce que nous lui demandons.

Il ne reste plus qu'à configurer notre connexion à la base de données dans le fichier .env à la racine de notre projet en remplaçant les valeurs entre {} :

    DATABASE_URL="mysql://{db_user:db_password}@127.0.0.1:3306/{db_name}"

Si la base de données n'a pas déjà été créée, Symfony peut le faire pour nous grâce à une commande.

    php bin/console doctrine:database:create

Si une erreur de socket remonte : 

Créer un nouveau user, ou modifier mdp et vérifier dans /etc/php/[ver]/apache2/php.ini

que les extensions correspondant à psql sont décochée (il y en a trois)


## symfony console make:entity

Qu'est-ce qu'une entité ?

Les classes représentant une table dans notre base de données relationnelle s'appellent donc des entités : dans notre code, on appellera cela une Entity. Les propriétés de ces classes permettront quant à elles de représenter les colonnes de la table en question. Enfin, un objet qui est instancié depuis cette classe sera donc un tuple (une ligne) de la table associée.

Dans notre code, une entité est une simple classe PHP qui ne contiendra la plupart du temps que des propriétés, ainsi que leurs accesseurs et mutateurs. Le rôle de cette classe sera donc de décrire la structure de notre table. À cela, il conviendra d'ajouter des annotations PHP. Ce sont elles qui permettront à Doctrine de faire le lien entre notre classe et la table à laquelle elle est associée.

## symfony console make:user

Création d'une class User avec implémentation du hash de password 

## Les annotations Doctrine de base
```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
* @ORM\Entity()
*/
class User
{
    /**
    * @ORM\Id()
    * @ORM\GeneratedValue()
    * @ORM\Column(type="integer")
    */
    private $id;

    /**
    * @ORM\Column(type="string", length=180, unique=true)
    */
    private $username;

    // ...
}
```

À la ligne 5, le namespace contenant toutes les différentes fonctionnalités de Mapping est importé sous l'alias ORM afin de réduire la verbosité de notre classe.

À la ligne 8, l'annotation @ORM\Entity() permet d'indiquer à Doctrine que cette classe est une entité.

À la ligne 13, l'annotation @ORM\Id() permet d'indiquer à Doctrine que cette propriété devra être la clé primaire de la table.

À la ligne 14, l'annotation @ORM\GeneratedValue() permet d'indiquer à Doctrine qu'une stratégie de génération automatique (AUTO_INCREMENT pour MySQL, par exemple) doit être utilisée sur cette propriété. Si aucune valeur n'est fournie, alors Doctrine utilisera la stratégie par défaut du moteur de base de données utilisé, mais il est possible de choisir sa stratégie. Parmi lesquelles nous pourrons retrouver, par exemple, SEQUENCE (comme dans PostgreSQL), UUID pour générer des identifiants universels uniques ou encore NONE pour indiquer à Doctrine que nous souhaitons affecter l'identifiant manuellement dans notre code.

Aux lignes 15 et 20, l'annotation @ORM\Column permet quant à elle d'indiquer à Doctrine que cette propriété est une colonne dans notre table. En effet, il est tout à fait possible d'avoir des propriétés qui ne seront pas présentes en base de données. Cela pourrait par exemple être le cas avec une propriété qui nous servirait à stocker un mot de passe en clair dans notre objet avant de le crypter. Il ne faudra naturellement pas mettre en base de données le mot de passe en clair.

    L'annotation @ORM\Entity() permet de préciser qu'une classe est une entité.

    L'annotation @ORM\Column() permet de préciser qu'une propriété est une colonne.

    L'annotation @ORM\Id() permet de préciser qu'une propriété est la clé primaire d'une table et l'annotation @ORM\GeneratedValue() d'en faire une colonne en AUTO_INCREMENT.

    Chacune des annotations possède un éventail d'options qui permettent de régler finement le comportement de nos entités par rapport à la base de données.


# Les associations entre entités

## L'association OneToOne

C'est l'association la plus basique, une relation 1 à 1. Reprenons notre entité User, imaginons maintenant que nos utilisateurs ont le droit à une photo de profil, et qu'une photo de profil ne peut appartenir qu'à un seul utilisateur, nous utiliserions alors une association OneToOne entre notre entité User et une nouvelle entité Image :

```php
<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class User
{
    // ...

    /**
     * @ORM\OneToOne(targetEntity="Image", mappedBy="user")
     */
    private $image;

    // ...

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): self
    {
        $this->image = $image;

        // set (or unset) the owning side of the relation if necessary
        $newUser = null === $image ? null : $this;
        if ($image->getUser() !== $newUser) {
            $image->setUser($newUser);
        }

        return $this;
    }
}
```

```php

<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class Image
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $filepath;

    /**
     * @ORM\OneToOne(targetEntity="User", inversedBy="image")
     */
    private $user;

    // ...

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}

```

L'option targetEntity permet de préciser quelle est l'entité à cibler pour l'association.

Les options mappedBy et inversedBy, quant à elles, servent à spécifier quelle entité "possède" la relation (quelle table possède la clé étrangère). La valeur dans l'entité User doit donc être "user" (puisqu'il y a une propriété $user dans l'entité Image) et, inversement, la valeur dans l'entité Image devra donc être "image".

mappedBy est une option requise pour le côté inverse d'une association, alors qu'inversedBy est optionnel et à positionner dans l'entité possédant l'association.

Cela veut dire que, dans le cas présent, c'est dans la table image que l'on trouvera une colonne user_id.

    La méthode setImage() dans l'entité User est particulière et s'occupe de mettre à jour les deux objets. Cette méthode a été générée automatiquement par une commande Symfony.


## Les associations OneToMany et ManyToOne

Ces associations sont l'inverse l'une de l'autre et s'utilisent de façon complémentaire et peuvent être représentées par 1 à n et n à 1. Continuons avec notre exemple et ajoutons la possibilité à nos utilisateurs de poster des messages.

Un utilisateur peut poster plusieurs messages. L'entité User devra donc avoir l'association OneToMany.
```php
<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class User
{
    // ...

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="user")
     */
    private $messages;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
    }

   // ...

    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages[] = $message;
            $message->setUser($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getUser() === $this) {
                $message->setUser(null);
            }
        }

        return $this;
    }
}
```
Plusieurs messages peuvent être postés par un utilisateur. L'entité Message devra donc avoir la relation ManyToOne.
```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class Message
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     */
    private $content;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messages")
     */
    private $user;

    // ...
}
```

## L'association ManyToMany

La dernière association, représentable par n à n, va permettre à plusieurs objets de la même entité d'appartenir à plusieurs objets d'une autre entité, liées par cette association. Reprenons notre entité User. Nous avons défini ses rôles comme étant une simple propriété qui contiendra un tableau de tous ses rôles, alors que nous pourrions tout à fait avoir une entité Role à part et une association ManyToMany entre elles :

```php
<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class Role
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role;

    /**
     * @ORM\Column(type="integer")
     */
    private $rank;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", inversedBy="roles")
     */
    private $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    // ...

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
        }

        return $this;
    }
}
```


```php
<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class User
{
    //...

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Role", mappedBy="users")
     */
    private $roles;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
        $this->roles = new ArrayCollection();
    }

    // ...

    /**
     * @return Collection|Role[]
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function addRole(Role $role): self
    {
        if (!$this->roles->contains($role)) {
            $this->roles[] = $role;
            $role->addUser($this);
        }

        return $this;
    }

    public function removeRole(Role $role): self
    {
        if ($this->roles->contains($role)) {
            $this->roles->removeElement($role);
            $role->removeUser($this);
        }

        return $this;
    }
}
```
La particularité de cette association est qu'elle va générer automatiquement une table intermédiaire entre les entités sur lesquelles elle est utilisée. Dans notre cas, une table role_user sera créée dans notre base de données, cependant cette table sera totalement inaccessible depuis le code puisque Doctrine s'occupe pour nous d'abstraire cette couche.


# Mettre à jour la base de données avec les migrations

Nous avons créé des entités, mais en l'état, les tables n'existent pas dans notre base de données. En effet, le but d'un ORM est de ne plus avoir à écrire de SQL, il n'est donc pas question d'aller créer notre structure nous-mêmes en SQL. C'est là qu'interviennent le composant Maker et la commande php bin/console make:migration.

Cette commande crée une migration qui portera le nom Version{YYYYMMDDHHMMSS}.php dans le dossier src/Migrations, qui n'est autre qu'un fichier SQL contenant les requêtes à effectuer pour mettre la base de données à jour. Sans que nous en ayons conscience, Doctrine a créé une table migration_versions dans la base de données, qui stocke l'intégralité des migrations qui ont été exécutées ainsi que la date à laquelle elles l'ont été.

Pour générer une migration, Doctrine va alors comparer la base de données avec l'état actuel des entités et générer le SQL nécessaire pour mettre la base de données à jour par rapport à ces dernières.

Pour exécuter les migrations, il faut lancer la commande :

    php bin/console doctrine:migrations:migrate

Par défaut, cette commande jouera toutes les migrations depuis la dernière qui a été exécutée.

## Création d’une entité User

Pour pleinement utiliser la puissance de Symfony et Doctrine, avant même de créer l’entité User, nous allons installer un pack de sécurité qui va, entre autres, configurer le fichier security.yaml. Ce dernier se trouvera dans le dossier packages, lui-même dans le dossier config à la racine du projet « config\packages\security.yaml ». Ce fichier va permettre à Doctrine de charger l’entité User et utiliser la bonne propriété qui servira d’identification, de connaître le hachage choisi pour le mot de passeport et retenir ce qui nous intéresse.

Puis, commençons à créer l’entité User. Tapez les lignes de commande suivantes dans le terminal situé dans votre projet :

    composer require symfony/security-bundle
    php bin/console make:user

« The name of the security user class (e.g. User) [User]: »

Le terminal vous demande maintenant de choisir un nom pour la classe sécurité user et vous propose par défaut User (vous pouvez donc changer ce nom qui est une convention qui correspond à la plupart des situations). Validez !

« Do you want to store user data in the database (via Doctrine)? (yes/no) [yes]: »

Puis, il vous demande si vous voulez stocker les données utilisateur dans la base de données par Doctrine. Validez !

« Enter a property name that will be the unique « display » name for the user (e.g. email, username, uuid) [email]: »

L’invite de commande propose maintenant d’ajouter une propriété qui sera unique, c’est-à-dire qui servira d’identifiant. L'email qui est proposé est excellent, alors validez !

« Will this app need to hash/check user passwords? Choose No if passwords are not needed or will be checked/hashed by some other system (e.g. a single sign-on server). »

Le terminal vous pose la question si vous allez utiliser un mot de passe qu’il faudra crypter (hasher). Validez !

Félicitations ! Vous venez de créer votre première entité qui est très complexe mais avec une incroyable facilité. Notez que l’entité User est situé au « src/Entité/User.php » mais que repository, dont nous reparlerons plus tard, a aussi été crée au « src/Repository/UserRepository.php » et que le fichier security.yaml a été mis en jour.

Maintenant, pour que l’entité corresponde à notre base de données, il va falloir construire une migration, c'est-à-dire créer une classe qui décrit les changements nécessaires et mettre à jour le schéma de la base de données. Puis, on doit mettre à jour la base de données à partir de ce nouveau schéma. Tapez les lignes de commandes suivantes :

    php bin/console make:migration
    php bin/console doctrine:migrations:migrate

Validez lorsque l’invite vous demande si vous êtes sûr de faire ces changements.

# Prérequis avant la création d’une entité

Vérifiez bien que Doctrine et MakerBundle sont installés dans votre fichier composer.json, sinon, installez-les et créez votre base de données avec les lignes de commandes suivantes :

    composer require symfony/orm-pack
    composer require --dev symfony/maker-bundle
    php bin/console doctrine:database:create

Pour pleinement utiliser la puissance de Symfony et Doctrine, avant même de créer l’entité User, nous allons installer un pack de sécurité qui va, entre autres, configurer le fichier security.yaml. Ce dernier se trouvera dans le dossier packages, lui-même dans le dossier config à la racine du projet « config\packages\security.yaml ». Ce fichier va permettre à Doctrine de charger l’entité User et utiliser la bonne propriété qui servira d’identification, de connaître le hachage choisi pour le mot de passeport et retenir ce qui nous intéresse.

Puis, commençons à créer l’entité User. Tapez les lignes de commande suivantes dans le terminal situé dans votre projet :

    composer require symfony/security-bundle
    php bin/console make:user

Maintenant, pour que l’entité corresponde à notre base de données, il va falloir construire une migration, c'est-à-dire créer une classe qui décrit les changements nécessaires et mettre à jour le schéma de la base de données. Puis, on doit mettre à jour la base de données à partir de ce nouveau schéma. Tapez les lignes de commandes suivantes :

    php bin/console make:migration
    php bin/console doctrine:migrations:migrate

## Qu’est-ce qu’un repository avec Doctrine ?

Un repository est une classe dont la responsabilité est de faire des requêtes vers la base de données. Ainsi, grâce à EntityManager, les entités pourront être manipulées et grâce à QueryBuilder, il sera possible de faire des requêtes personnalisées. Nous reviendrons sur ces deux classes dans la seconde partie de ce cours.

# Manipulation des entités

Pour continuer, il va falloir maintenant créer un contrôleur. En MVC (Modèle-Vue-Contrôleur) c’est le contrôleur, le moteur de l’application, qui doit être utilisé pour modifier les entités.

Nous pouvons créer un CRUD (Create, Read, Update, Delete) pour l’entité User simplement en tapant la commande suivante :

    php bin/console make:crud User

Un fichier form qui contient un formulaire pour créer un nouvel utilisateur et six fichiers twig dont un base.html.twig qui sert de gabarit. Il est aussi inséré grâce à extends à tous les autres fichiers twig. Chaque fichier twig correspond à une vue que peut appeler le contrôleur. Et enfin, le fichier contrôleur qui nous intéresse particulièrement que nous allons détailler. Voici ce que vous devriez avoir :

```php
<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/user')]
class UserController extends AbstractController
{
   #[Route('/', name: 'app_user_index', methods: ['GET'])]
   public function index(UserRepository $userRepository): Response
   {
       return $this->render('user/index.html.twig', [
           'users' => $userRepository->findAll(),
       ]);
   }

   #[Route('/new', name: 'app_user_new', methods: ['GET', 'POST'])]
   public function new(Request $request, UserRepository $userRepository): Response
   {
       $user = new User();
       $form = $this->createForm(UserType::class, $user);
       $form->handleRequest($request);

       if ($form->isSubmitted() && $form->isValid()) {
           $userRepository->save($user, true);

           return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
       }

       return $this->renderForm('user/new.html.twig', [
           'user' => $user,
           'form' => $form,
       ]);
   }

   #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
   public function show(User $user): Response
   {
       return $this->render('user/show.html.twig', [
           'user' => $user,
       ]);
   }

   #[Route('/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
   public function edit(Request $request, User $user, UserRepository $userRepository): Response
   {
       $form = $this->createForm(UserType::class, $user);
       $form->handleRequest($request);

       if ($form->isSubmitted() && $form->isValid()) {
           $userRepository->save($user, true);

           return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
       }

       return $this->renderForm('user/edit.html.twig', [
           'user' => $user,
           'form' => $form,
       ]);
   }

   #[Route('/{id}', name: 'app_user_delete', methods: ['POST'])]
   public function delete(Request $request, User $user, UserRepository $userRepository): Response
   {
       if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
           $userRepository->remove($user, true);
       }

       return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
   }
}
```

Un CRUD permet d’avoir les méthodes essentielles pour manipuler nos entités. Ici, nous avons cinq méthodes :

    index() : qui retourne la liste des utilisateurs joint à la Vue sur index.html.twig.

    new() : qui retourne le formulaire User joint à la Vue new.html.twig. Après la validation du formulaire, il ajoutera le nouvel objet User en base et redirigera vers la liste des users 1app_user_index.

    show() : qui retourne dans la Vue show.html.twig l’utilisateur demandé.

    edit() : qui retourne le formulaire pour modifier un utilisateur et le modifie après validation, puis le renvoie vers la liste des utilisateurs.

    delete() : qui, si le token est valide, supprime l'utilisateur demandé et renvoie vers la liste des utilisateurs.

# Rôle du repository dans la manipulation des entités

Vous avez peut-être noté que UserRepository est appelé dans presque toutes les méthodes de UserController. C’est parce que, comme nous avons commencé à l’expliquer au début de ce cours, le repository a pour rôle de manipuler les entités.

À chaque fois que le contrôleur en a besoin, UserRepository est injecté dans la méthode. Puis, la méthode du controller l’utilise en appelant les méthodes du repository dont il a besoin.

Par exemple :

    index() : retourne un tableau d’utilisateurs grâce à la méthode findAll() de UserRepository.

    new() : sauvegarde le nouvel utilisateur grâce à la méthode save() de UserRepository.

    edit() : sauvegarde les modifications apportées à l'utilisateur sélectionné à la méthode save() de UserRepository.

    delete() : supprime l’utilisateur sélectionné grâce à la méthode remove() de UserRepository.

Doctrine (l’ORM de Symfony) a besoin d’EntityManager pour récupérer un objet issu d’une entité et mettre à jour la base de données. Il est possible de manipuler EntityManager directement dans le contrôleur mais dans le cas présent, c’est UserRepository qui est appelé et qui, dans le fond, utilise EntityManager. C’est une bonne pratique car le contrôleur doit être le plus simplifié possible.

# QueryBuilder

QueryBuilder est une classe qu’utilise Doctrine de par un repository pour créer des requêtes en langage PHP vers la base de données sans passer par le SQL. L’avantage c’est qu’il n’y a pas besoin de connaître le SQL et surtout que Doctrine va convertir les requêtes aussi bien pour une base de données MySQL, PostgreSQL, SQlite, etc.

Dans UserRepository, il y avait ces lignes commentées :

```php
//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
```

Il s’agit de DQL (Doctrine Query language). Ces exemples sont presque prêts à l’emploi. Il suffit de remplacer quelques éléments par les valeurs voulues.

Il n’y a effectivement pas besoin de connaître le SQL, mais ce langage hybride s’en inspire largement et avoir quelques notions de SQL vous aidera à mieux comprendre.

Nous vous encourageons à aller sur la documentation officielle de ce langage pour effectuer les requêtes les plus adaptées à vos besoins :

# Requête SQL

Notez qu’il est tout de même possible de faire des requêtes SQL dans un repository. Le site officiel de Symfony nous donne l’exemple suivant :

```php
class ProductRepository extends ServiceEntityRepository
{
    public function findAllGreaterThanPrice(int $price): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT * FROM product p
            WHERE p.price > :price
            ORDER BY p.price ASC
            ';
        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery(['price' => $price]);

        // returns an array of arrays (i.e. a raw data set)
        return $resultSet->fetchAllAssociative();
    }
}
```

Libre à vous si vous êtes plus à l’aise avec le SQL de faire des requêtes spécifiques de cette façon.

Les différents types de propriétés proposés et gérés par Doctrine :

    Main types

        string

        text

        boolean

        integer(or smallint or bigint)

        float

    Relationships/Associations

        ManyToOne

        OneToMany

        ManyToMany

        OneToOne

    Array/Object Types

        array (or simple_array)

        json

        object

        binary

        blob

    Date/Time Types

        datetime (or datetime_immutable)

        datetimetz (or datetimetz_immutable)

        date (or date_immutable)

        time (or time_immutable)

        dateinterval

    Other Types

        ascii_string

        decimal

        guid


# Les formulaires en Symfony

Installation des composants nécessaires

Pour commencer à travailler sur les formulaires, nous avons besoin du composant Symfony form. Pour cela, il suffit de l'installer via Composer en exécutant la commande suivante dans le répertoire de l'application Symfony :

    composer req form

Vous pouvez ensuite entrer les commandes ci-dessous pour installer Twig, les annotations pour les routes et l'outil maker.

    composer req twig annotations
    composer req maker --dev

Le moteur de template Twig servira à l'affichage des formulaires, tandis que l'outil maker aidera à la construction de ceux-ci (facultatif, mais conseillé).

Exemple de création d'un formulaire de contact sous Symfony :

```php
$form = $this->createFormBuilder()
    ->add('name', TextType::class)
    ->add('message', TextareaType::class)
    ->getForm()
;
```

Types de champs

Symfony offre une gamme de champs (types) prêts à être utilisés.

Nous avons déjà eu l'occasion de voir dans l'exemple précédent l'utilisation du TextType et TextareaType. Voici quelques autres exemples :

    EmailType pour la validation des adresses e-mail

    NumberType pour des nombres

    PasswordType pour des mots de passe

Des types un peu plus complexes sont aussi disponibles, tels que :

    ChoiceType pour un champ à choix (checkbox, radio, select)

    DateType pour un champ date

    EntityType permet de sélectionner un élément sur une entité (par exemple, pour un site de vente de produits, il peut s'agir d'un sélecteur référençant tous les produits de l'application)

Pour typer un champ de formulaire Symfony, on utilise le FQCN (Fully Qualified Class Name) du type. Ainsi, pour utiliser le type TextType, on utilise TextType::class. Si nous avions voulu le spécifier en toutes lettres, nous aurions dû écrire Symfony\Component\Form\Extension\Core\Type\TextType.

## Création dans un controller

Pour créer nos formulaires dans un contrôleur, Symfony nous fournit un objet form builder qui nous permet d'ajouter des champs avec un nom, un type, ainsi que d'autres paramètres, puis de générer automatiquement le formulaire.

Voyons comment l'utiliser pour créer un formulaire de contact avec un nom et un message.

```php
$form = $this->createFormBuilder()
    ->add('name', TextType::class)
    ->add('message', TextareaType::class)
    ->getForm()
;
```

La méthode createFormBuilder() crée la base de notre formulaire.

Nous pouvons ensuite lui ajouter autant de champs que nécessaires via la méthode add() : dans notre exemple, seuls le nom et le type sont spécifiés.

Le formulaire est généré par la méthode getForm().

Le form builder comporte d'autres méthodes, telles que remove() ou has($name), permettant respectivement de supprimer ou de vérifier l'existence d'un champ.

Création dans une classe

Vous savez à présent créer un formulaire dans un contrôleur. Cependant, cette méthode comporte plusieurs inconvénients, notamment :

Si nous souhaitons réutiliser ce formulaire ailleurs, il est nécessaire de dupliquer le code.

Si nous avons un formulaire devant comporter 10 champs, 20 champs ou plus, notre contrôleur deviendra vite illisible et ne respectera plus la décomposition des responsabilités.

C'est pourquoi il est recommandé de créer le formulaire dans une classe à part. Pour cela, il est possible de générer automatiquement le fichier qui contiendra la classe de notre formulaire via le composant maker, en utilisant la commande make:form.

La commande nous demande :

- le nom du formulaire,

- s'il doit être lié à une entité (c'est-à-dire une classe possédant des propriétés, par exemple l'entité Contact, avec comme propriétés son nom et le message à transmettre).

Si nous indiquons une entité, les champs correspondant aux propriétés seront automatiquement générés avec le formulaire. Pour l'instant, nous pouvons laisser cette seconde entrée vide.

Validons pour que la commande crée un nouveau fichier dans le répertoire src/Form. Ce fichier contient la structure de base nécessaire à la création d'un formulaire :

```php
<?php

// src/Form/ContactType.php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('field_name')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
```

Nous pouvons voir que le nom de notre formulaire, Contact, a été automatiquement renommé ContactType. De façon générale, et pour correspondre aux bonnes pratiques, nos formulaires seront suffixés par Type.

Pour pouvoir l'utiliser dans un contrôleur, il ne reste plus qu'à appeler la méthode createForm() avec le type de notre formulaire passé en paramètre :

```php
$form = $this->createForm(ContactType::class);
```

Nous allons voir comment récupérer puis gérer les données envoyées, 
une fois que l'utilisateur a rempli et saisi un formulaire.

Prenons l'exemple d'un formulaire de contact possédant deux champs : un nom et un message. Ce formulaire est stocké dans la classe ContactType ci-dessous :

```php
<?php

// src/Form/ContactType.php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('message', TextareaType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
```

Voici le code à écrire dans notre contrôleur, dont nous allons expliquer le déroulement étape par étape :

```php
public function index(Request $request)
{
    $form = $this->createForm(ContactType::class);
    $form->handleRequest($request);
    
    if ($form->isSubmitted() && $form->isValid()) {
        $data = $form->getData();
        $name = $data['name'];
    }
}
```


Ce code traite deux cas de figure : si l'utilisateur vient juste d'arriver sur la page du formulaire ou s'il a rempli et soumis le formulaire.

- Dans les deux cas, le formulaire vide est créé avec la méthode createForm.

- Ensuite, la requête est passée à handleRequest, qui vérifie dans quel cas de figure nous sommes :

- - Si l'utilisateur vient d'arriver sur la page, elle construit le formulaire vide pour qu'il puisse être affiché,

- - S'il s'agit d'une requête POST, c'est-à-dire si l'utilisateur a validé le formulaire, alors notre objet $form est rempli avec les données entrées par l'utilisateur.

- Pour terminer, si le formulaire a bien été soumis (isSubmitted) et que les données entrées par l'utilisateur sont valides (isValid), nous pouvons utiliser la méthode getData pour récupérer un tableau contenant les données. La clé pour récupérer une valeur est le nom du champ correspondant, dans notre exemple name.

Vous êtes à présent capable de récupérer les données envoyées par l'utilisateur. Cependant, comment faire pour les sauvegarder efficacement ? Imaginons une clinique vétérinaire qui souhaite enregistrer le nom, le type et le poids pour chaque animal de leurs clients. L'idéal serait donc de créer une classe Pet dans laquelle nous retrouverions ces trois propriétés.

Il est possible de définir cette classe Pet (appelée entité) dans le dossier src/Entity. L'entité Pet contiendra 3 champs :

```php
<?php

// src/Entity/Pet.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PetRepository")
 */
class Pet
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(type="float")
     */
    private $weight;

    // ...
}
```

Nous avons défini la classe représentant un animal. Maintenant, il serait pratique, lorsqu'un utilisateur entre les informations sur son animal de compagnie dans notre formulaire, que ces données soient automatiquement enregistrées sous la forme d'un objet Pet.

C'est tout à fait possible : il suffit de lier notre formulaire à l'entité Pet. Lorsque nous créons notre formulaire en utilisant la commande make:form, la console nous demande le nom de notre formulaire, puis l'entité à laquelle le lier.

Créons notre nouveau formulaire PetType avec cette liaison :

Cela nous génère le fichier suivant implémentant notre formulaire :

```php
<?php

// src/Form/PetType.php
namespace App\Form;

use App\Entity\Pet;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PetType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('type')
            ->add('weight')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Pet::class,
        ]);
    }
}
```

Pour l'affichage depuis un controller à un fichier template twig il faut instancier le formulaire et le renvoyer à la fonction render() : 

```php
class FirstRouteController extends AbstractController
{
    #[Route('/firstroute', name: 'app_first_route')]
    public function index(Request $request): Response
    {
        $color = new Color();
        $form = $this->createForm(ColorType::class, $color);
        dump($form);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $uuid = $color->getHashtag();
        }
        return $this->render('first_route/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
```

Il peut être nécessaire d'implémenter la fonction __toString dans la class en question pour convertir la réponse sous forme d'une string et définir une valeur par défaut : 

```php
public function __toString(){
    return $this->hashtag = "none";
}
```

# Debug de l'application 

## Installer le composant Profiler

    composer req profiler --dev

De par la nature sensible des informations exposées par le Profiler de Symfony, il est fortement déconseillé d'activer le Profiler sur un environnement de production ou tout autre environnement accessible par le public. C'est pour cela que le package est installé avec l'option --dev.

- Dans la partie Response, nous ne trouverons pas le contenu de la réponse comme on pourrait s'y attendre, mais seulement les en-têtes de la réponse.

- Dans la partie Server Parameters, on retrouve le contenu de la superglobale $_SERVER que nous connaissons déjà, avec un focus sur les variables d'environnement Symfony.

- L'onglet Performance permet d'accéder à une représentation graphique de l'exécution des différents éléments constituant la réponse de l'application. Il permet de voir les événements déclenchés, les events listeners appelés, l'appel des contrôleurs, la génération des templates, les appels Doctrine, HTTP, etc. Chacune de ces informations est indiquée avec son temps d'exécution et son coût en mémoire.

- - En réduisant la valeur de Threshold à 0, on peut faire apparaître encore plus d'informations : en l’occurrence, les appels prenant moins de 1 ms de temps d'exécution. Ça peut être utile si nous voulons consulter l'intégralité des appels.

- Les autres onglets

Les autres onglets ne sont pas à négliger, bien au contraire. Ils vont nous indiquer des informations plus précises sur des périmètres plus restreints. Par défaut, nous avons par exemple :

- Exception qui donne le message et la stack trace d'une exception s'il y en a une,

- Logs qui contient les logs générés par l'affichage de la page,

- Events qui liste les événements et les events listeners déclenchés,

- Routing qui donne des informations sur la route utilisée et celles disponibles,

- Cache qui affiche les appels au cache,

- Twig qui liste les templates rendus,

- Configuration qui affiche des informations générales sur la configuration du serveur et de l'application.

## Dump()

Nous pouvons :

soit l'utiliser sur une ligne indépendante 

```php
dump($variable);

$variable->method();
```

soit l'utiliser directement en ligne 

```php
dump($variable)->method(); // La fonction dump() retourne le contenu de la variable
```

La fonction dd() s'utilise de la même manière que la fonction dump(), sauf qu'elle arrête immédiatement l'exécution du script après l'affichage du dump. Par conséquent, la barre de debug ne sera pas affichée dans la page. Il est donc déconseillé d'utiliser cette méthode, mais elle peut se révéler utile si nous voulons éviter que le reste de notre code ne soit exécuté.

Comme nous venons de le voir, le composant Profiler est fait pour être enrichi par d'autres bundles. Nous avons maintenant la possibilité de voir des informations sur notre application, mais qu'en est-il si nous souhaitons afficher le contenu de variables ou générer des logs ? Pour cela, nous allons installer le pack Debug, qui nous permettra d'avoir accès à toutes ces nouvelles fonctionnalités.

## Installer le pack Debug

Afin d'installer le pack Debug, nous allons comme d'habitude utiliser Composer :

    composer req debug --dev

Nous installons le pack en dépendance de développement, mais nous aimerions tout de même pouvoir avoir un log en production. Pour ce faire, nous allons ajouter explicitement le composant Logger :

    composer req logger

## Onglet Logs

Maintenant que le pack Debug a été installé, nous devrions voir apparaître dans le Profiler un onglet Logs, qui nous affiche les différentes informations loggées par Symfony, par exemple notre erreur 404.

## Fichiers de logs

De plus, Symfony log des informations dans de nouveaux fichiers présents dans le répertoire var/log/ à la racine de notre application. Ces fichiers s'appellent dev.log et prod.log, pour le mode de développement et de production respectivement. Si, pour une raison ou pour une autre, vous n'avez pas accès au Profiler Symfony, ces fichiers pourront nous donner de précieuses informations sur l'origine d'une erreur, notamment en mode de production.

## Commande server:dump

La commande php bin/console server:dump permet de démarrer un serveur qui va regrouper tous les dumps de notre application. Ainsi, si nous voulons avoir un point central afin de consulter les différentes valeurs, cette solution peut être plus pratique. De plus, le serveur permet de rediriger la sortie vers un fichier directement en HTML. Il suffit ensuite qu'une page contenant une fonction dump() soit appelée pour que le dump soit aussi affiché dans le retour de cette commande.

    php bin/console server:dump --format=html > public/dump.html

# Validator

Comme nous venons de le voir, il va falloir valider les données grâce à des annotations. Il va donc falloir installer les packages symfony/validator, ainsi que doctrine/annotations s'il n'est pas encore présent.

Pour tout installer en même temps, il suffit de lancer la commande :

    composer require symfony/validator

Puis de s'assurer que le composant est bien activé dans validator.yaml :

```yaml
# config/packages/validator.yaml
framework:
    validation:
        email_validation_mode: html5
```
La validation de données se fait directement dans les objets, en appliquant des Constraints via des annotations sur chacune des propriétés à valider.

Imaginons que nous avons un objet PHP représentant un message à poster, avec ces contraintes :

- Un titre qui ne doit pas être vide et avoir une taille minimale de 5 caractères,

- Un contenu qui ne doit pas être vide et avoir une taille maximale de 2000 caractères,

- Un nom d'utilisateur qui ne doit pas être vide.

## Traduction de ces contraintes

```php
<?php

namespace App\Message;

// Import avec un alias afin de réduire la verbosité de nos validations
use Symfony\Component\Validator\Constraints as Assert;

class Message
{
	/**
	 * @Assert\Length(min=5)
	 */
	private $title;

	/**
	 * @Assert\NotBlank
	 * @Assert\Length(max=2000)
	 */
	private $content;

	/**
	 * @Assert\NotBlank
	 */
	private $username;

	// Getters, setters...
}
```

# Quelques exemples de contraintes

## NotBlank

Nous avons déjà vu une utilisation basique de cette contrainte précédemment. Il est maintenant temps d'aller plus loin avec ses principales options :

- allowNull : cette option a une valeur par défaut égale à false. Si la valeur true est précisée, alors null sera considéré valide et ne déclenchera pas la contrainte.

- message : permet de spécifier un message à afficher en cas de violation de la contrainte autre que celui par défaut. Le paramètre {{ value }} permet d'afficher la valeur en question.

- normalizer : une fonction de rappel PHP qui sera appliquée à la valeur avant la contrainte, afin de procéder à une éventuelle mise en forme.

- payload : permet d'ajouter, au format JSON, des données arbitraires qui ne seront pas utilisées par le Validator. Le payload pourra alors être récupéré tel quel au niveau front-end, par exemple afin d'afficher différents niveaux d'erreur.

```php
<?php

namespace App\Message;

use Symfony\Component\Validator\Constraints as Assert;

class Message
{
    /**
     * @var string
     *
     * @Assert\NotBlank(
     *     normalizer="App\Message\Message::titleNormalizer",
     *     allowNull=false,
     *     message="The value {{ value }} is considered blank",
     *     payload={"severity"="ERROR"}
     * )
     */
    private $title;

    public function titleNormalizer(string $title)
    {
        // Grace à trim(), un titre qui vaudrait ' ' sera considéré comme en erreur
        return trim($title);
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }
}
```

## Length

La deuxième contrainte est Length, que nous avons déjà vue, et qui a elle aussi de nombreuses options, telles que :

- allowEmptyString : cette option a une valeur par défaut égale à false. Si la valeur true est précisée, alors une chaîne de caractères vide telle que '' sera considérée comme valide.

- max : la taille maximale autorisée pour la chaîne de caractères.

- maxMessage : le message à afficher si la chaîne de caractères est plus longue que la taille maximale autorisée. Le paramètre {{ value }} permet d'afficher la valeur en question et {{ limit }} la longueur maximale attendue.

- min : la taille minimale autorisée pour la chaîne de caractères.

- minMessage : le message à afficher si la chaîne de caractères est plus courte que la taille minimale autorisée. Le paramètre {{ value }} permet d'afficher la valeur en question et {{ limit }} la longueur minimale attendue.

## Email

Cette contrainte vérifie simplement qu'une valeur donnée est une adresse e-mail valide.

- message : permet de spécifier un message à afficher en cas de violation de la contrainte autre que celui par défaut. Le paramètre {{ value }} permet d'afficher la valeur en question.

- mode permet de choisir le type de validation à appliquer à la valeur :

- - loose : vérifie simplement la présence de "@" et d'un "." dans la seconde partie de la valeur. C'est la valeur par défaut.

- - strict : utilise la bibliothèque egualias/email-validator pour valider la valeur donnée. Il faudra donc installer la bibliothèque dans le projet pour utiliser ce mode.

- - html5 : utilise la même validation que pour les inputs HTML de type email.

```php
<?php

namespace App\Message;

use Symfony\Component\Validator\Constraints as Assert;

class Message
{
    /**
     * @var string
     *
     * @Assert\Email(
     *     message="This value should be a valid email adresse, {{ value }} given.",
     *     mode="loose"
     * )
     */
    private $userEmail;

    public function getUserEmail(): string
    {
        return $this->userEmail;
    }

    public function setUserEmail(string $userEmail): self
    {
        $this->userEmail = $userEmail;

        return $this;
    }
}
```

## Choice

Le but de cette contrainte est de vérifier qu'une valeur donnée est présente dans un tableau de valeurs valides fourni à la contrainte. Il existe plusieurs façons de fournir ce tableau de valeurs :

```php
<?php

namespace App\Message;

use Symfony\Component\Validator\Constraints as Assert;

class Message
{
    public const TYPES = ['petites annonces', 'blog', 'information'];

    /**
     * @var string
     *
     * Il est possible de fournir directement un tableau contenant les données
     * @Assert\Choice({"petites annonces", "blog", "information"})
     *
     * Ou alors de passer par une constante
     * @Assert\Choice(choices=Message::TYPES)
     *
     * Mais aussi une fonction de rappel
     * @Assert\Choice(callback="getTypes")     
     */
    private $type;

    /**
     * En passant par une fonction de rappel, il sera possible de réutiliser de la liste ailleurs plus facilement
     */
    public static function getTypes()
    {
        return ['petites annonces', 'blog', 'information'];
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
```

# Le service Validator

Valider des contraintes est encore plus simple que de les créer !

Il suffit d'injecter le service ValidatorInterface dans une action ou un service, et d'appeler sa méthode validate() en lui fournissant l'objet à valider afin de récupérer une liste d'erreurs.

```php
<?php

namespace App\Controller;

use App\Message\Message;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidationController extends AbstractController
{
    /**
     * @Route("/validation")
     */
    public function validation(ValidatorInterface $validator): Response
    {
        $message = (new Message())
            ->setType('blog')
            ->setContent('Le contenu de mon message')
            ->setTitle('Le titre de mon message')
            ->setUsername('JohnDoe')
            ->setEmail('john@example.com')
        ;

        $errors = $validator->validate($message);

        foreach ($errors as $error) {
            // Si un payload a été ajouté à une contrainte, voici comment y accéder
            $payload = $error->getConstraint()->payload;

            // Caster une erreur en string permet de retourner une chaîne de caractères contenant
            // le nom de la classe ainsi que la propriété en erreur, et le message d'erreur
            $stringError = ((string) $error);
        }

        // Il est également possible de fournir les erreurs directement à Twig afin de les afficher
        return $this->render('validation.html.twig', [
            'errors' => $errors,
        ]));
    }
}
```

Et, dans le template, si l'on souhaite afficher les erreurs dans validation.html.twig :

```twig
{% for error in errors %}
    <p>{{ error.message }}</p>
{% else %}
    <p>Aucune erreur !</p>
{% endfor %}
```

# Créer sa propre contrainte

Mettre en place une contrainte personnalisée se fait en deux temps, il est nécessaire de créer deux classes :

- Une première classe qui sera la Constraint et qui doit étendre la classe Constraint.

- Une seconde classe qui sera le Validator qui contiendra la logique de validation et qui doit étendre la classe ConstraintValidator.

Par convention, le nom de la classe Validator sera le nom de la classe contrainte concaténé par "Validator".

## Valider un numéro de téléphone

Écrivons une contrainte qui valide qu'une donnée est bien un numéro de téléphone français :

```php
<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class FrenchPhoneNumber extends Constraint
{
    /*
     * Any public properties become valid options for the annotation.
     * Then, use these in your validator class.
     */
    public $message = 'The value "{{ value }}" is not valid french phone number.';
}
```

```php
<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class FrenchPhoneNumberValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\FrenchPhoneNumber */
        
        // On laisse NotBlank, NotNull, etc...s'occuper de valider ce type d'erreur
        if (null === $value || '' === $value) {
            return;
        }

        if (!preg_match('/^0\d{9}$/', $value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $value)
                ->addViolation();
        }
    }
}
```

Pour appliquer notre contrainte, il faut importer le namespace entier sous un alias, puis spécifier la contrainte que nous voulons appliquer :

```php
<?php

namespace App\User;

use App\Validator\FrenchPhoneNumber;

class User
{
    /**
     * @var string
     *
     * @FrenchPhoneNumber
     */
    private $phoneNumber;

    public function getPhoneNumber(): string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }
}
```

# Ajouter une contrainte à un formulaire

Afin de rajouter une contrainte à la propriété d'une classe depuis un objet FormType , il faut ajouter une clé constraints dans le tableau d'options lors de la mise en place du champ concerné, et lui donner comme valeur une instance de contrainte.

Pour valider les différentes contraintes, il suffit alors d'appeler la méthode isValid() sur le formulaire et de le passer à la vue pour afficher les éventuelles erreurs avec le helper Twig form_row.

```php
<?php

namespace App\Form;

use App\Entity\Phone;
use App\Validator\FrenchPhoneNumber;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PhoneType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('phoneNumber', TelType::class, [
                'constraints' => [
                    new FrenchPhoneNumber(),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Phone::class,
        ]);
    }
}
```

```php
<?php

namespace App\Controller;

use App\Entity\Phone;
use App\Form\PhoneType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PhoneController extends AbstractController
{
    /**
     * @Route("/phone", name="phone")
     */
    public function index(Request $request): Response
    {
        $phone = new Phone();

        $form = $this->createForm(PhoneType::class, $phone);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            dd($phone);
        }

        return $this->render('phone/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
```

# La sécurité et gestion des utilisateurs

## Installation des outils

Symfony met à disposition un composant dédié pour la gestion des utilisateurs et la sécurité de l'application : security-bundle. Pour nous aider dans l'installation de ce système, nous aurons également besoin du composant Maker.

Maker étant normalement déjà installé, vous ne devriez pas avoir besoin d'effectuer la commande composer require maker --dev. Si vous n'avez pas le composant, utilisez les deux commandes ci-dessous:

    composer req security
    composer req maker --dev

## Alternatives

Le bundle symfony/security-bundle comporte tout le nécessaire pour la gestion de la sécurité de votre application. Cependant, savoir que des alternatives existent peut être utile, par exemple dans le cas où nous récupérons une application qui implémente l'une d'elles. Concernant la sécurité, l'alternative la plus populaire est FOSUserBundle.

Il est pertinent de se demander pourquoi préférer le bundle de sécurité de Symfony à tous les autres. La raison principale est que ce bundle a été développé depuis Symfony 3 et permet à présent une gestion de la sécurité simple, efficace et suffisamment complète pour être indépendante de composants supplémentaires.

## Mise en situation

Nous souhaitons élever une certaine sécurité sur notre application. Pour cela, nous allons voir comment Symfony aborde la gestion des utilisateurs à travers deux notions clés : l'authentification et l'autorisation.

## Authentification

L'authentification est le principe qui permet de gérer la connexion d'un utilisateur à notre application :

- Lorsque nous visitons un site applicatif pour la première fois, nous sommes considérés comme des visiteurs anonymes, ce qui signifie souvent un accès restreint aux fonctionnalités du site.

- Pour obtenir un accès plus large, il est nécessaire de s'inscrire, ce qui nous rend membre de l'application.

- Si nous revenons sur l'application par la suite, l'authentification (avec un nom d'utilisateur et un mot de passe, par exemple) servira à prouver qu'il s'agit bien de nous.

Symfony gère ce processus avec un système de pare-feu (firewalls) qui définit comment les utilisateurs s'authentifient. Ce pare-feu s'appuie sur des fournisseurs d'utilisateurs (providers) qui se chargent de récupérer les informations d'un utilisateur, lorsqu'il se connecte notamment.

## Autorisation

L'autorisation consiste à indiquer si un utilisateur a les droits nécessaires pour accéder à une ressource, comme la page de modération. Ces droits sont définis via les rôles. Chaque rôle a son lot d'autorisations et de restrictions, qui seront appliquées aux utilisateurs les portant.

Nous pouvons voir notre application comme une entreprise. Les visiteurs sont autorisés à l'accueil, cependant, il faut être employé (membre) pour accéder aux étages. C'est l'authentification. Mais, même une fois dans l'ascenseur, tous les employés n'ont pas les mêmes accès en fonction de leur rôle. C'est l'autorisation.

Nous pouvons donc considérer que l'autorisation est la seconde étape d'accès après l'authentification.

# Gérer l'authentification

## Mise en situation

La première étape à la mise en place d'un système de sécurité est l'authentification. Cette étape passe dans un premier temps par la création d'une entité Utilisateur puis d'un processus d'authentification, tous deux facilités par les outils que Symfony met à notre disposition.

## Créer ses utilisateurs

Afin de sauvegarder nos utilisateurs, commençons par créer une entité Doctrine qui les représentera dans notre base de données : User. Pour cela, le composant Maker nous propose la commande make:user.

Cette entité doit obligatoirement implémenter UserInterface et contenir un champ unique propre à chaque utilisateur et qui permettra de les différencier (par exemple, dans le cas où deux utilisateurs auraient les mêmes nom et prénom). Pour notre exemple, ce champ sera email.

User étant l'entité correspondant à nos utilisateurs, il est possible d'ajouter autant de champs que nous le désirons, afin de stocker différentes informations comme l'âge, l'adresse, etc.

Dans le répertoire App\Entity, nous retrouvons le fichier généré par la commande :

```php
<?php

// src/Entity/User.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
     public function getUserIdentifier(): string
      (
        return (string) $this->email;
      )

     /**
      ** @deprecated since Symfony 5.3, use getUserIdentifier instead
      */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
	   * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
```

## Connexion

Plusieurs méthodes existent pour gérer la connexion des utilisateurs, nous allons voir ici la plus simple.

Pour cela, aidons-nous une fois de plus du composant Maker avec la commande make:auth.

Cette commande permet de générer les fichiers nécessaires à un système d'authentification (qu'il est possible de personnaliser par la suite).

La commande a réalisé quatre actions :

- Tout d'abord, elle fournit un Guard Authenticator, la classe qui gère la partie connexion (récupération des données, de l'utilisateur, vérification de la correspondance, redirection, etc.).

- Un nouveau contrôleur est ensuite créé, implémentant l'aspect déconnexion ainsi que les routes assurant l'affichage du formulaire de connexion et la gestion des erreurs.

- Puis est généré le template Twig contenant le formulaire de connexion.

- Et enfin, le fichier security.yaml est mis à jour.

# Security.yaml

En détaillant le déroulement de la commande make:auth, nous avons évoqué la mise à jour d'un fichier essentiel à la gestion des utilisateurs : le fichier security.yaml. Vous pouvez le retrouver dans le dossier config/packages, et il permet de configurer notre système d'authentification.

```yaml
# config/packages/security.yaml
security:
      enable_authenticator_manager: true
      # 
https://symfony.com/doc/current/security.html#registering-the-user-hashing-passwords
        password_hashers:

Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'
   App\Entity\User:
       algorithm: auto

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
    firewalls:
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false
        main:
             lazy: true
             provider: app_user_provider
             custom_authenticator: App\Security\LoginFormAuthenticator
           	 		 logout:
                         path: app_logout
                        # where to redirect after logout
                        # target: app_any_route
```

# Gérer les autorisations

## Rôles

Si nous observons le code généré par la commande make:user, nous trouvons une méthode getRoles()qui renvoie le tableau contenant les rôles associés à l'utilisateur.

## Que représentent ces rôles ?

Nous pouvons les voir comme des cartes d'accès aux différentes pages de notre application. Ils sont nécessaires pour différencier les utilisateurs entre eux. Voyons dans un premier temps comment les définir.

Un rôle commence toujours par ROLE_ suivi par un nom en majuscules. Les rôles peuvent être attribués aux utilisateurs à l'inscription et modifiés par la suite.

Il est également possible de les hiérarchiser. Si nous prenons l'exemple d'un blog composé de trois rôles :

- Les visiteurs restreints à la page d'accueil,

- Les rédacteurs autorisés à créer et visualiser des articles,

- Les administrateurs ayant tous les droits.

Nous pouvons définir cette hiérarchie de la façon suivante dans le fichier security.yaml :

```yaml
# config/packages/security.yaml
security:
    role_hierarchy:
        ROLE_READER: ROLE_USER
        ROLE_AUTHOR: ROLE_READER
        ROLE_ADMIN: ROLE_AUTHOR
```

Cette façon d'écrire indique que le ROLE_ADMIN a les droits du ROLE_AUTHOR en plus des siens. Ainsi, si nous autorisons l'accès à une nouvelle page pour les rédacteurs, les administrateurs y auront automatiquement accès aussi.

## Autorisations

Nous avons défini nos rôles, comment les utiliser pour restreindre les droits ?

Plusieurs façons de faire existent encore, commençons par la méthode à privilégier si cela est possible. Admettons que notre application comporte trois pages : accueil, article et modération.

Revenons à notre fichier security.yaml. Pour définir les droits évoqués auparavant, le fichier autorise une section supplémentaire nommée access_control, que nous configurons de la sorte :

```yaml
# config/packages/security.yaml
security:
    access_control:
         - { path: ^/article, roles: ROLE_AUTHOR }
         - { path: ^/moderation, roles: ROLE_ADMIN }
```

a configuration est simple. Nous assignons un rôle requis à un ensemble de routes : toutes les routes commençant par /article nécessiteront au minimum le rôle de rédacteur pour pouvoir être consultées.

Cette méthode est à privilégier, car elle a l'avantage de regrouper l'ensemble des droits au même endroit.

La seconde possibilité est de gérer les droits directement dans le contrôleur. Pour cela, il suffit d'indiquer en annotation les rôles autorisés via la fonction IsGranted() :

```php
/**
 * @IsGranted("ROLE_ADMIN")
 */
public function moderation()
{
    // ...
}
```

Enfin, en cas de besoin vraiment spécifique, il est possible de définir manuellement les droits dans un contrôleur grâce à la méthode denyAccessUnlessGranted :

```php
public function moderation()
{
    $this->denyAccessUnlessGranted('ROLE_ADMIN');

    // ...
}
```

Ou de conditionner l'affichage d'un bloc dans un template Twig avec la fonction is_granted :

```twig
{% if is_granted('ROLE_ADMIN') %}
    Editer l'article
{% endif %}
```

# Gestion des utilisateurs

De nombreuses fonctionnalités permettent de personnaliser la gestion des utilisateurs. Nous allons ici en évoquer deux parmi les plus importantes et régulièrement utilisées.

La première concerne l'encodage des mots de passe.

L'algorithme encodant les mots de passe est défini dans le fichier security.yaml. Cependant, comment l'utiliser une fois dans le contrôleur ?

Grâce au service UserPasswordHasher mis à disposition par Symfony, qui propose une méthode hashPassword qui prend en paramètres un utilisateur (implémentant UserInterface) ainsi qu'un mot de passe, et retourne le mot de passe haché selon l'algorithme défini pour l'entité.

Enregistrer le mot de passe d'un utilisateur se codera de la façon suivante :

```php
Public function index(UserPasswordHasherInterface $passwordHasher)
{
	// …
	$user->setPassword($passwordHasher->hashPassword($user, $password));
	// …
}
```

Dans le Guard Authenticator, le service UserPasswordHasher est également chargé de vérifier le mot de passe lorsqu'un utilisateur se connecte :

```php
// src/Security/LoginFormAuthenticator.php
public function checkCredentials($credentials, UserInterface $user)
{
    return $this->passwordHasher->isPasswordValid($user,
 $credentials['password']);
}
```

La seconde fonctionnalité très utilisée est l'option « Se souvenir de moi » que l'on peut cocher sur les différents sites pour rester connecté.

En utilisant la commande make:auth pour générer notre système d'authentification, le travail est facilité.

En effet, les lignes permettant de garder l'utilisateur connecté sont déjà codées dans notre template de connexion, il suffit de les décommenter :

```twig
// templates/security/login.html.twig
<div class="checkbox mb-3">
    <label>
        <input type="checkbox" name="_remember_me"> Remember me
    </label>
</div>
```

Et d'ajouter le paramétrage suivant dans le fichier security.yaml :

```yaml
# config/packages/security.yaml
security:
    firewalls:
        main:
            remember_me:
                secret:   '%kernel.secret%'
                lifetime: 604800 # 1 week in seconds
                 path: /
```
Attention, le lifetime, c'est-à-dire le temps où l'utilisateur n'aura pas besoin de se reconnecter, est exprimé en secondes.

# Providers

Notre système d'authentification est basé sur une liste d'utilisateurs stockés dans une base de données. Mais comment procéder lorsque ce n'est pas le cas ou que nous avons besoin de traitements spécifiques ?

Cela dépend beaucoup de la configuration du provider dans notre fichier security.yaml :

```yaml
# config/packages/security.yaml
security:
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
```

Par exemple, le paramètre property définit sur quel attribut unique nous devons rechercher nos utilisateurs, ici le mail.

Nous pouvons remplacer la valeur email par username sans problème : comment faire en revanche si nous souhaitons qu'un utilisateur puisse utiliser les deux ?

Une solution consiste à supprimer le paramètre providers et configurer le fichier repository de l'utilisateur de la manière suivante :

```php
// src/Repository/UserRepository.php
namespace App\Repository;

// ...

class UserRepository extends EntityRepository implements UserLoaderInterface
{
    // ...

    public function loadUserByUsername($usernameOrEmail)
    {
        return $this->getEntityManager()->createQuery(
                'SELECT u
                FROM App\Entity\User u
                WHERE u.username = :query
                OR u.email = :query'
            )
            ->setParameter('query', $usernameOrEmail)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
```

Ainsi, Symfony recherchera l'utilisateur selon son email ou son username.

Implémenter l'interface UserLoaderInterface est facultatif, cependant cela permet d'être sûr d'implémenter la méthode loadByUsername grâce à laquelle le système d'authentification récupère l'utilisateur.

Il est également possible d'utiliser un autre provider fourni par Symfony, et même de créer le nôtre : en générant nos utilisateurs via la commande make:user, la console nous propose d'utiliser un provider personnalisé. En choisissant cette option, nous obtenons un squelette de provider à remplir avec nos spécificités (attention, une fois le provider créé, il doit être importé dans les paramètres du fichier security.yaml).

# Voter

Revenons maintenant aux autorisations. Nous définissons les droits des utilisateurs en nous basant sur leurs rôles. Mais il est possible d'affiner encore les droits (par exemple si nous souhaitons restreindre la modification des articles aux utilisateurs inscrits depuis plus d'un an).

Pour ce faire, nous avons la possibilité de créer des Voters. Un Voter permet de vérifier, pour un objet spécifique, si l'utilisateur a le droit d'effectuer telle ou telle action (lecture, modification, etc.).

Implémentons le Voter vérifiant l'ancienneté de l'utilisateur (n'oublions pas d'ajouter l'attribut $createdAt dans notre entité User si ce n'est pas déjà fait) :

```php 
<?php

// src/Security/PostVoter.php
namespace App\Security;

use App\Entity\Post;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PostVoter extends Voter
{
    const VIEW = 'view';
    const EDIT = 'edit';

    protected function supports($attribute, $subject)
    {
        // if the attribute isn't one we support, return false
        if (!in_array($attribute, [self::VIEW, self::EDIT])) {
            return false;
        }

        // only vote on Post objects inside this voter
        if (!$subject instanceof Post) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            // the user must be logged in; if not, deny access
            return false;
        }

        // we know $subject is a Post object, thanks to supports
        /** @var Post $post */
        $post = $subject;

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($post, $user);
            case self::EDIT:
                return $this->canEdit($post, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canView(Post $post, User $user)
    {
        // ...
    }

    private function canEdit(Post $post, User $user)
    {
        $dateOneYearsAgo = new \DateTime();
        $dateOneYearsAgo->sub(new \DateInterval('P1Y'));

        if ($user->getCreatedAt() < $dateOneYearsAgo) {
            return false;
        }

        return $user === $post->getAuthor();
    }
}
```

Pour créer un Voter, il est nécessaire :

- D'implémenter VoterInterface ou d'étendre Voter,

- De définir les constantes (EDIT, VIEW, etc.) qui représentent les actions que l'on veut autoriser ou refuser,

- De spécifier les conditions où ce Voter peut être interrogé (méthode supports qui prend en paramètres l'action et l'objet sur lequel elle porte. Dans notre exemple, il n'est pas pertinent d'interroger ce Voter pour une action DELETE ni pour un objet autre que Post),

- Et enfin d'écrire la logique (canEdit, canView) qui déterminera si l'utilisateur est autorisé à exécuter cette action.

Lorsqu'une autorisation est requise, Symfony interroge tous les Voters afin de prendre une décision.

# Déployer son site Symfony en production

Pour qu'une application Symfony puisse être déployée sur un serveur, il est nécessaire de vérifier que les prérequis de l'utilisation du framework sont bien respectés. Symfony fournit pour cela un outil.

Les indispensables

À ce jour, pour permettre la bonne exécution de Symfony sur un serveur, deux éléments doivent être présents :

- PHP, dans sa version 7.2.5 au minimum

- Composer doit être installé

Symfony CLI

Symfony dispose d'un binaire appelé Symfony CLI. Celui-ci peut s'avérer utile à différents moments du projet, puisqu'il permet à la fois de créer un nouveau projet, d'embarquer un serveur local, une intégration avec SymfonyCloud, mais permet également de vérifier que l'environnement sur lequel on souhaite effectuer une installation sera opérationnel pour exécuter l'application.

L'installation est différente selon les environnements.

Sous Linux :

    wget https://get.symfony.com/cli/installer -O - | bash

## Vérifier les prérequis

L'utilitaire Symfony offre la commande suivante :

    symfony check:requirements

## Déployer via FTP

L'une des façons les plus simples de transférer le code sur un serveur consiste à utiliser le protocole FTP, ou une méthode similaire. Les fichiers de l'application seront déposés dans un dossier du serveur web, qui est configuré pour servir le site.

FileZilla est l'un des outils couramment utilisés pour ce genre de tâches : il suffit d'être connecté sur le serveur et de transférer les données dessus.

Cette méthode a cependant plusieurs inconvénients, dont le fait de ne pas bénéficier de versioning de code, ou encore de devoir mettre à jour manuellement à chaque modification, etc.

## Déployer via Git

L'utilisation de Git ou SVN permet de simplifier le déploiement du code.

En plus de bénéficier du versioning du code pour les modifications, on dispose également de l'avantage de pouvoir récupérer rapidement et facilement le code. Une fois le dépôt Git paramétré sur le serveur, un simple git clone suffit pour récupérer le code.

De plus, ces outils permettent de mettre en place une stratégie de CI/CD (intégration continue, livraison continue) permettant que le code soit automatiquement actualisé sur le serveur à chaque mise à jour.

## Déployer via PAAS

Il est également possible de déployer une application en utilisant une plateforme en tant que service (PaaS). Ces plateformes sont des environnements d'exécution d'application. Ainsi, les développeurs n'ont pas à se soucier de la mise en place de certains aspects des serveurs, tels que le système d'exploitation.

Plusieurs de ces plateformes sont compatibles avec les applications Symfony, dont les plus connues sont Symfony Cloud, Heroku ou encore Platform.sh.

## Déployer via d'autres outils

Enfin, l'utilisation d'outils de scripts peut faciliter le déploiement des applications. Plusieurs choix sont possibles ici, dont EasyDeployBundle ou Deployer.

Ces outils offrent une installation et configuration de base afin de facilement les utiliser. Mais il est possible de définir une configuration spécifique, en indiquant de déployer sur un serveur spécifique ou d'utiliser ou non certains scripts.

# Quelles différences ?

Prenons l'exemple de la base de données. En développement, la base de données peut être une base locale, tandis qu'en production, elle peut être sur un serveur distant, ou avoir un autre nom.

Symfony offre un bundle nommé symfony/dotenv qui permet de regrouper les différents paramètres de configuration, dépendant de l'environnement, dans un fichier .env à la racine de l'application.

Ce bundle permet de définir les paramètres de la façon suivante, dans le fichier .env :

```sh
# config/packages/doctrine.yaml
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'
```

```sh
# In all environments, the following files are loaded if they exist,
# the latter taking precedence over the former:
#
#  * .env                contains default values for the environment variables needed by the app
#  * .env.local          uncommitted file with local overrides
#  * .env.$APP_ENV       committed environment-specific defaults
#  * .env.$APP_ENV.local uncommitted environment-specific overrides
#
# Real environment variables win over .env files.
```

Ce commentaire, ajouté par Symfony lors de la génération du fichier .env, nous explique que les variables d'environnement sont chargées dans l'ordre suivant :

- Le fichier .env permet de définir les variables d'environnement par défaut. Il ne contient pas de valeur sensible, puisqu'il est versionné.

- Le fichier .env.local peut définir des variables d'environnement plus sensibles, car il n'est pas versionné.

- Dans le cas d'une configuration par environnement, on peut utiliser .env.$APP_ENV, où $APP_ENV vaut en général dev ou prod. Un fichier .env.prod permettra donc de surcharger la configuration par défaut, définie dans .env ou même .env.local. Ce fichier ne contient pas de valeur sensible.

- De la même manière que pour le fichier .env.local, le fichier .env.$APP_ENV.local permet de définir les valeurs sensibles applicables seulement à un environnement, car ce fichier n'est pas versionné.

- Enfin, les vraies variables d'environnement (qu'elles soient définies au niveau du système ou du serveur HTTP) prennent toujours le pas sur les fichiers .env. C'est même le moyen privilégié pour déclarer les variables d'environnement en production.

Pour revenir sur les fichiers .env.local et .env.$APP_ENV.local, ils ont le même fonctionnement que le fichier .env, mais sont spécifiques à un environnement précis. Ainsi, il est possible de créer un fichier .env, comme le fichier vu ci-dessus, sur le poste de développement, et de créer le fichier .env.local suivant sur le serveur de production :

```sh
# .env.local
DATABASE_URL="mysql://symfony_user:5xXYLZYSLJBcS8sd@db.example.com:3306/symfony_prod"
```

# Installer les dépendances

L'ensemble des dépendances d'une application Symfony est stocké dans le dossier vendor. Celui-ci, comportant un nombre important de fichiers, n'est normalement pas versionné ni transféré d'un poste à un autre. Quand le code est transféré sur un nouveau poste, ou sur le serveur, il est donc nécessaire de les installer.

Pour cela, en étant à la racine du projet, il est nécessaire d'exécuter la ligne de commande suivante, qui fera l'installation de tous les composants automatiquement :

    composer install --no-dev --optimize-autoloader

L'option --no-dev indique qu'il n'est pas nécessaire d'installer les composants utiles pour le développement. Tandis que --optimize-autoloader permet d'optimiser les performances de l'application.

À savoir que ce processus d’installation de dépendances doit être aussi réalisé en local, lorsqu’on récupère un projet symfony existant par exemple (à la différence près pour les options --no-dev et --optimize-autoloader qui ne seront pas nécessaires).

Mode production

Lors du développement, l'application est en mode dev. Cela permet d'avoir accès à certaines ressources, telles que l'affichage détaillé des erreurs ou des requêtes effectuées. En mode production, l'accès à ces ressources est inutile, et même déconseillé pour la sécurité de l'application et ses performances globales.

Pour cela, il est donc nécessaire d'indiquer le mode de fonctionnement de l'application en production dans les variables d'environnement, de la façon suivante :

```sh
# .env.local
APP_ENV=prod
APP_DEBUG=0
```

Puis de réinitialiser le cache de l'application :

    php bin/console cache:clear

Il est aussi possible de définir ces variables directement dans l'appel de la commande :

    APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear

## Droits des fichiers

En mode production, deux éléments sont importants sur les droits de fichiers.

Tout d'abord, l'utilisation de la commande bin/console cache:warmup permet de générer les fichiers de cache sur le serveur. Elle est automatiquement exécutée en même temps que la commande php bin/console cache:clear, sauf si on lui passe l'option --no-warmup.

En environnement de dev, la console Symfony définit automatiquement les droits des fichiers générés pour qu'ils puissent être modifiés par tout le monde, tandis qu'en environnement de prod, la commande php bin/console cache:warmup génère l'intégralité des fichiers de cache nécessaires (à moins que vous n'utilisiez un système supplémentaire).

Quel que soit l'environnement de l'application, le dossier de logs doit exister et être accessible en écriture. Les lignes suivantes, si elles sont exécutées à la racine du projet, permettront de réaliser cela.

La première ligne créera si nécessaire le dossier de logs au bon endroit, et la seconde implémentera les droits nécessaires à ce dossier.

## Autres étapes

Nous allons maintenant aborder des étapes plus spécifiques. Celles-ci dépendent de l'utilisation ou non des composants associés. Par exemple, nous utilisons une base de données avec l'ORM Doctrine : il faudra mettre à jour la base de données. Dans notre cas, nous allons utiliser le système de migrations.

    php bin/console doctrine:migration:migrate

Il est intéressant de savoir que les différents éléments nécessaires au déploiement d'une application, ou à sa mise à jour, tels que l'installation des composants ou encore la mise à jour de la base de données, peuvent être automatisés.

La majorité des outils de déploiement permettent cela grâce à un ensemble de scripts.

# Le composant Mailer

## Mise en situation

Il est très simple d'envoyer un e-mail en utilisant un simple serveur SMTP. SMTP (pour Simple Mail Transfer Protocol) est un protocole qui permet de communiquer avec les serveurs de messagerie électronique afin d'envoyer des e-mails.

L'avantage avec PHP, c'est que la fonction mail() nous permet de faire tout ça sans savoir comment SMTP fonctionne. Mais, dès qu'il s'agit d'utiliser un service de messagerie tiers, la tâche devient tout de suite plus complexe. Heureusement pour nous, il existe de nombreuses librairies PHP permettant d'envoyer des e-mails, telles que PHP Mailer, Swift Mailer ou le plus récent composant Mailer de Symfony.

Même si ce n'est pas la solution que nous allons présenter, il est intéressant de savoir comment envoyer un e-mail en PHP.

```php
<?php

$message = "Bonjour,\r\nVotre compte a bien été créé.\r\nBonne journée.";

mail('john@example.com', 'Votre compte a bien été créé', $message);
```

Pour pouvoir utiliser la fonction mail() de PHP, il faudra avoir configuré le serveur afin de pouvoir utiliser un serveur SMTP. Dans le cas d'un hébergeur, il sera probablement déjà configuré.

## Installation du composant Mailer

Afin d'installer le composant, nous pouvons utiliser Composer comme d'habitude. La commande suivante permettra de l'ajouter aux dépendances du projet :

    composer require symfony/mailer

La commande crée un fichier de configuration dans config/packages/mailer.yaml définissant le DSN, ou Data Source Name, à utiliser.

Le DSN n'est pas utilisé en tant que tel, c'est seulement une représentation de la méthode d'envoi des e-mails. Cette valeur est définie au niveau des variables d'environnement, grâce au fichier .env par exemple, via la variable MAILER_DSN qui a été ajoutée par Composer.

## Configuration du DSN

Si nous possédons un serveur SMTP, il suffit de définir la variable MAILER_DSN de la forme smtp://user:pass@smtp.example.com:port, où :

- smtp est le protocole

- user est le nom de l'utilisateur (on peut l'enlever s'il n'y en a pas)

- pass est le mot de passe de l'utilisateur (on peut l'enlever s'il n'y en a pas)

- smtp.example.com est le nom de domaine du serveur SMTP (cela peut être une adresse IP aussi)

- port est le port utilisé par le serveur SMTP (par défaut, il s'agit du port 25)

Si notre serveur SMTP est accessible depuis le serveur où notre application est installée, nous pouvons par exemple utiliser le DSN smtp://localhost:25.

Si nous ne possédons pas de serveur SMTP et que nous ne souhaitons pas en installer, il est possible d'utiliser un service tiers, tel que Gmail, Mailgun ou SendGrid par exemple. Certains d'entre eux proposent d'utiliser SMTP ou une API qui leur est spécifique. Pour utiliser leur API, nous devons installer une librairie en fonction du service que nous avons décidé d'utiliser. Une liste de ces librairies est disponible dans la documentation de Symfony.


## Utiliser SendGrid

Dans notre cas, nous allons utiliser SendGrid. Pourquoi SendGrid ? Grâce aux partenariats GitHub/Studi, vous bénéficiez du Github Student Developer pack. Ce pack vous permet d'avoir accès à ce service et d'envoyer jusqu'à 15 000 e-mails par jour.

Après avoir créé un compte, un expéditeur (ou sender identity), et vérifié l'ensemble des adresses e-mail en cliquant sur les liens des e-mails envoyés par SendGrid, nous sommes prêts à générer une clé d'API pour configurer notre variable :

Installons d'abord la librairie pour SendGrid :

    composer require symfony/sendgrid-mailer

Ajoutons maintenant la configuration vers le SMTP à notre fichier .env :

    MAILER_DSN=sendgrid+smtp://<Clé API>@default

## Tester l'envoi d'e-mail

Afin de tester notre configuration, créons un contrôleur ou utilisons en un existant :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function index(MailerInterface $mailer)
    {
        $email = (new Email())
            ->from('from@example.com')
            ->to('to@example.com')
            ->subject('This e-mail is for testing purpose')
            ->text('This is the text version')
            ->html('<p>This is the HTML version</p>')
        ;

        $mailer->send($email);

        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }
}
```

Avant d'aller plus loin et par précaution, il est possible de configurer le composant Mailer pour l'environnement de développement afin qu'il n'envoie pas d'e-mail à tout le monde.

Cela peut se révéler très utile en développement, si nous voulons éviter d'envoyer un e-mail par erreur : dans le cas où notre application contiendrait des e-mails de vrais utilisateurs, par exemple.

Pour cela, nous pouvons créer le fichier config/packages/dev/mailer.yaml, contenant ceci :

```php
framework:
    mailer:
        envelope:
            recipients: ['dev@example.com'] # A remplacer par votre e-mail
```

## Définir l'expéditeur et les destinataires

Afin d'ajouter les informations concernant les expéditeurs, destinataires, copies carbones (cc), copies cachées (cci ou bcc) ou même surcharger l'information d'adresses de réponse (reply to), il est possible, à la construction de l'objet Symfony\Component\Mime\Email, d'appeler respectivement les méthodes suivantes :

```php
use Symfony\Component\Mime\Email;

// ...

$email = (new Email())
    ->from('from@example.com')
    ->to('to@example.com')
    ->cc('cc@example.com')
    ->bcc('bcc@example.com')
    ->replyTo('replyto@example.com')
;
```

## Ajouter un contenu simple

Dans le contenu d'un e-mail, on va trouver trois informations : son objet, son contenu en version texte et son contenu en version HTML. Ces trois éléments peuvent être ajoutés au moment de la construction de l'objet Symfony\Component\Mime\Email très simplement grâce aux méthodes correspondantes :

```php
$email = (new Email())
    ->subject('This e-mail is for testing purpose')
    ->text(fopen('text_version.txt', 'r')
    ->html(fopen('html_version.html', 'r')
;
```

## Ajouter des pièces jointes

De la même manière que pour les méthodes text() et html(), il est possible de passer une ressource pointant vers un fichier en paramètre de la méthode attach() afin d'attacher une pièce jointe :

```php
$email = (new Email())
    ->attach(fopen('attachment.txt', 'r'))
;
```

Cependant, une méthode plus simple existe et consiste à attacher directement le fichier à l'e-mail par son chemin d'accès grâce à la méthode attachFromPath(), en lui passant en paramètre le chemin absolu ou une URL y faisant référence :

```php
$email = (new Email())
    ->attachFromPath('/path/terms-of-use.pdf')
    ->attachFromPath('/path/terms-of-use.pdf', 'Conditions Générales d\'Utilisation')
    ->attachFromPath('/path/terms-of-use.pdf', 'Conditions Générales d\'Utilisation', 'application/pdf')
    ->attachFromPath('http://example.com/terms-of-use.pdf', 'Conditions Générales d\'Utilisation', 'application/pdf')
;
```

La méthode attend trois paramètres :

- Le chemin vers le fichier (celui-ci est obligatoire),

- Le nom du fichier (une description textuelle, telle que Conditions Générales d'Utilisation) permet de surcharger le nom original du fichier,

- Le type MIME du fichier (dont on peut trouver une liste ici) : s'il n'est pas précisé, celui-ci sera deviné.

## Ajouter des images

Afin d'ajouter des images dans le contenu d'un e-mail, il suffit d'ajouter ces images à la manière des pièces jointes, mais en utilisant les méthodes embed() et embedFromPath(). Nous aurons besoin de lui spécifier un nom en second paramètre afin de pouvoir y faire référence dans la version HTML du contenu de l'e-mail :

```php
$email = (new Email())
    ->embedFromPath('profile.png', 'profile')
    ->html('<img src="cid:profile">')
;
```

Si l'objectif est simplement d'ajouter une image à l'e-mail sans l'afficher dans son contenu, il faudra utiliser plutôt l'ajout de pièces jointes que l'ajout d'images. Dans le cas contraire, il faudra probablement privilégier l'utilisation d'un moteur de templates. En utilisant Twig par exemple, les images sont automatiquement incluses.

## Envoyer son e-mail

Maintenant que nous avons construit notre objet Symfony\Component\Mime\Email grâce à toutes ces méthodes, nous pouvons envoyer l'e-mail à son ou ses destinataires grâce au service Symfony\Component\Mailer\Mailer. Afin de l'utiliser, il est conseillé d'injecter l'interface qui lui est associée et d'appeler la méthode send(), à qui nous passons en paramètre l'objet Symfony\Component\Mime\e-mail.

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function index(MailerInterface $mailer)
    {
        $email = (new Email())
            // ...
        ;

        $mailer->send($email);

        // ...
    }
}
```

# Utiliser Twig pour le contenu

## Créer un template texte

Afin de créer un template Twig externe décrivant le contenu texte de notre e-mail, nous pouvons créer un fichier dans templates/newsletter.txt.Twig :

```php
Newsletter du mois - {{ newsletter_date|date('m Y') }}

{% for article in articles %}
- {{ article }}
{% endfor %}

Envoyé à {{ email.to[0].address }}
```

Une fois le template créé, nous pouvons instancier un nouvel objet Symfony\Bridge\Twig\Mime\TemplatedEmail. Cet objet nous permet de spécifier un template et un contexte à notre e-mail, en plus des méthodes que nous avons vues de la classe Symfony\Component\Mime\Email.

Les variables qui seront utilisées au sein de notre template seront passées au moyen de la propriété context.

```php
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

// ...

$email = (new TemplatedEmail())
    ->from('from@example.com')
    ->to('to@example.com')
    ->subject('Newsletter du mois - '.(new \DateTime())->format('m Y'))
    ->textTemplate('newsletter.txt.Twig')
    ->context([
        'newsletter_date' => new \DateTime(),
        'articles' => [
            'Lorem ipsum dolor sit amet',
            'Aliquam ac tortor porttitor',
            'Nunc blandit elit vel ligula auctor',
            'Nullam consequat arcu quis nisl rhoncus',
            'Aenean pharetra est sed velit interdum',
        ],
    ])
;
```

## Créer un template HTML

Pour créer un template HTML décrivant le contenu de notre e-mail, nous pouvons créer un fichier dans templates/newsletter.html.Twig :

```twig
<h1>Newsletter du mois - {{ newsletter_date|date('m Y') }}</h1>

<ul>
{% for article in articles %}
    <li><a href="#">{{ article }}</a></li>
{% endfor %}
</ul>

<p>Envoyé à {{ email.to[0].address }}</p>
```

Il suffit ensuite d'appeler la méthode htmlTemplate() de l'objet en lui passant le chemin vers le nom du template :

```php
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

// ...

$email = (new TemplatedEmail())
    ->from('from@example.com')
    ->to('to@example.com')
    ->subject('Newsletter du mois - '.(new \DateTime())->format('m Y'))
    ->htmlTemplate('newsletter.html.Twig')
    ->context([
        'newsletter_date' => new \DateTime(),
        'articles' => [
            'Lorem ipsum dolor sit amet',
            'Aliquam ac tortor porttitor',
            'Nunc blandit elit vel ligula auctor',
            'Nullam consequat arcu quis nisl rhoncus',
            'Aenean pharetra est sed velit interdum',
        ],
    ])
;
```

Ajouter des images

Enfin, l'ajout d'images dans un template HTML se fait en deux étapes :

Configurer un chemin vers les images dans Twig,

Ajouter l'image dans le contenu HTML grâce à la méthode image() de la classe Symfony\Bridge\Twig\Mime\WrappedTemplatedEmail.

Cette façon de faire évite de devoir ajouter explicitement les images en temps que ressources et de devoir utiliser la notation cid.

```yaml
# config/packages/Twig.yaml
Twig:
    paths:
        # "images" est un alias faisant référence au chemin défini
        '%kernel.project_dir%/assets/images': images
```

```twig
<img src="{{ email.image('@images/logo.png') }}" alt="Logo">

<h1>Newsletter du mois - {{ newsletter_date|date('m Y') }}</h1>
```

## Ajouter du CSS en ligne

Gmail, l'un des clients de messagerie les plus répandus, ne supporte pas la balise <\style>. L'impossibilité d'utiliser cette balise oblige à définir le style CSS de notre e-mail directement au niveau de nos balises. On appelle cela le CSS en ligne, ou inline CSS en anglais. Afin d'éviter d'ajouter manuellement chacune de ces propriétés style à nos balises, nous pouvons heureusement nous reposer sur des packages qui vont automatiser cette opération pour nous. Pour cela, ajoutons-les à nos dépendances :

    composer require twig/extra-bundle twig/cssinliner-extra

À partir de là, deux options s'offrent à nous :

Définir le style directement dans le template Twig :

```twig
{% apply inline_css %}
<style>
    h1 {
        color: darkred;
    }
</style>

<h1>Newsletter du mois - {{ newsletter_date|date('m Y') }}</h1>
{# ... #}
{% endapply %}
```

Définir le style dans un fichier CSS externe :

```twig
{% apply inline_css(source('@css/newsletter.css')) %}
<h1>Newsletter du mois - {{ newsletter_date|date('m Y') }}</h1>
{# ... #}
{% endapply %}
```

Il faudra bien sûr penser à déclarer le répertoire en tant que chemin dans Twig, comme pour ajouter une image dans un template :

```yaml
# config/packages/twig.yaml
twig:
    paths:
        # "css" est un alias faisant référence au chemin défini
        '%kernel.project_dir%/assets/css': css
```

## Utiliser la syntaxe Markdown

Dans le cas où nous ne serions pas forcément à l'aise avec HTML et CSS, nous pouvons utiliser la syntaxe Markdown pour construire notre e-mail. Pour cela, il faudra bien sûr s'appuyer sur quelques dépendances :

    composer require twig/extra-bundle twig/markdown-extra league/commonmark

Nous pouvons maintenant écrire notre e-mail en Markdown.

```twig
{% apply markdown_to_html %}
Newsletter du mois - {{ newsletter_date|date('m Y') }}
======================================================

{% for article in articles %}
* [{{ article }}](#)
{% endfor %}

Envoyé à {{ email.to[0].address }}
{% endapply %}
```

## Utiliser le langage de template Inky

À cause de la compatibilité de certains clients de messagerie, il n'est pas toujours simple de créer des designs complexes d'e-mails, en gérant l'alignement et le positionnement par exemple. C'est même une tâche à part entière qui n'a rien à voir avec le design de pages web. Afin de nous faciliter leur élaboration, Twig permet d'utiliser le langage de template Inky en ajoutant l'un de ses packages.

    composer require twig/extra-bundle twig/inky-extra

### Qu'est-ce qu'Inky ?

Inky est un langage de templates qui permet de convertir des tags HTML simples en structures de tableaux HTML complexes requis pour les e-mails.

En effet, oublions tout ce que nous pouvons connaître sur CSS pour gérer l'alignement et le positionnement des éléments dans un e-mail. Il faudra utiliser les tableaux HTML, comme il était d'usage de faire dans les années 2000. Pour nous faciliter cette tâche, Inky permet donc d'utiliser des balises HTML qui lui sont propres, afin de générer cette structure HTML en tableaux. C'est un tout nouveau langage à apprendre, donc. Par exemple, en Inky, nous écririons :

```html
<container>
  <row>
    <columns>Put content in me!</columns>
  </row>
</container>
```

Et Twig générera :

```twig
<table align="center" class="container">
  <tbody>
    <tr>
      <td>
        <table class="row">
          <tbody>
            <tr>
              <th class="small-12 large-12 columns first last">
                <table>
                  <tr>
                    <th>Put content in me!</th>
                    <th class="expander"></th>
                  </tr>
                </table>
              </th>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
```

Afin de pouvoir mettre en forme notre e-mail, il faut adapter le contenu de notre template pour utiliser le langage de templates d'Inky :

```twig
{% apply inky_to_html %}
<container>
    <row>
        <columns>
            <h1>Newsletter du mois - {{ newsletter_date|date('m Y') }}</h1>
            <ul>
            {% for article in articles %}
                <li><a href="#">{{ article }}</a></li>
            {% endfor %}
            </ul>
        </columns>
    </row>
    <spacer size="16"></spacer>
    <row>
        <columns>
            <p>Envoyé à {{ email.to[0].address }}</p>
        </columns>
    </row>
</container>
{% endapply %}
```

Le bloc {% apply inky_to_html %} indique que nous souhaitons mettre en forme le code contenu de Inky vers HTML. Une fois notre template modifié, Twig va donc convertir pour nous la syntaxe Inky en syntaxe HTML. Mais le style appliqué par défaut aux éléments HTML ne suffit pas. Par exemple, pour gérer le côté responsive de nos e-mails, Inky va pouvoir ajouter des classes aux éléments HTML générés.

Il est alors nécessaire d'ajouter du CSS à ces éléments pour qu'ils soient affichés de la manière attendue, notamment pour gérer le côté responsive de nos e-mails. Inky met à notre disposition une feuille de style qui remplit ce rôle pour nous. Il est possible de télécharger la feuille de style CSS de Foundation et de l'ajouter à notre e-mail, tel que nous l'avons fait dans la première partie avec le filtre inline_css :

```twig
{% apply inky_to_html|inline_css(source('@css/foundation-emails.css')) %}
    {# ... #}
{% endapply %}
```

# Le composant EventDispatcher

Prenons l'exemple d'une application web standard, où il est possible de créer un compte. On pourrait imaginer qu'au moment de la création du compte, par exemple juste après l'avoir inséré en base de données, une notification soit déclenchée indiquant qu'un compte a été créé. Un autre élément de notre application pourra écouter ce genre de notifications pour effectuer un envoi d'e-mail pour confirmer la création à l'utilisateur.

Ce principe s'inscrit parfaitement dans le cadre d'un gestionnaire d'événements. La notification sera l'événement pour lequel nous pourrons créer une ou plusieurs classes permettant d'écouter leur déclenchement, aussi appelées listeners. Symfony, par exemple, génère de nombreux événements au cours de son exécution sans que nous en soyons forcément conscients. Cela est possible grâce à un gestionnaire d’événements présent par défaut : le composant EventDispatcher.

### Le Profiler Symfony

Le Profiler Symfony offre beaucoup d'informations sur les événements dispatchés et les listeners déclenchés. L'onglet Performance, par exemple, permet d'afficher l'ensemble des listeners exécutés. Pour cela, il suffit de réduire la valeur Threshold à 0, et on obtient le graphique suivant :

L'onglet Events permet de voir sous une autre représentation les listeners exécutés pour chaque événement. Nous pouvons même afficher les listeners qui ne sont pas exécutés ou les événements qui n'en ont pas, respectivement dans les onglets Not Called Listeners et Orphaned Events.

## Créer un event listener

La création d'un event listener se fait en deux étapes :

- Premièrement, il faut créer une classe avec une méthode ayant un nom au format on<EventName>(). Le nom de cette méthode est construit en fonction de l'événement écouté. Dans le cas de kernel.request, la méthode s'appellera onKernelRequest(). Cette méthode pourra prendre en paramètre l'event dispatché, dans notre cas Symfony\Component\HttpKernel\Event\RequestEvent. Une liste de tous les événements dispatchés par Symfony est disponible.

```php
<?php // src/EventListener/CustomListener.php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;

class CustomListener
{
    public function onKernelRequest(RequestEvent $event)
    {
        dd($event);
    }
}
```

- Ensuite, il faut configurer Symfony pour déclarer la classe en tant qu'event listener dans le fichier config/services.yaml.

```yaml
parameters:

services:
    # ...

    App\EventListener\CustomListener:
        tags:
            - { name: kernel.event_listener, event: kernel.request }
```

Si nous actualisons maintenant n'importe quelle page de notre application, nous avons le résultat suivant, ce qui nous permet de visualiser le contenu de l'objet et de faire ce que bon nous semble, comme logger une information ou insérer une donnée en base de données.

Nous pouvons utiliser la commande bin/console debug:event-dispatcher kernel.request afin de voir que notre event listener est correctement attaché à l'événement kernel.request :

```sh
Registered Listeners for "kernel.request" Event
===============================================

------- --------------------------------------------------------------------------------------- ----------
Order   Callable                                                                                Priority 
------- --------------------------------------------------------------------------------------- ----------
#1      Symfony\Component\HttpKernel\EventListener\DebugHandlersListener::configure()           2048
#2      Symfony\Component\HttpKernel\EventListener\ValidateRequestListener::onKernelRequest()   256
#3      Symfony\Component\HttpKernel\EventListener\SessionListener::onKernelRequest()           128
#4      Symfony\Component\HttpKernel\EventListener\LocaleListener::setDefaultLocale()           100
#5      Symfony\Component\HttpKernel\EventListener\RouterListener::onKernelRequest()            32
#6      Symfony\Component\HttpKernel\EventListener\LocaleListener::onKernelRequest()            16
#7      App\EventListener\CustomListener::onKernelRequest()                                     0
------- --------------------------------------------------------------------------------------- ----------
```

Notre classe App\EventListener\CustomListener apparaît en position 7. Elle se situe après toutes les autres, car sa priorité est de 0. Définir une priorité sur des event listeners permet de gérer l'ordre de leur exécution, en partant de la valeur la plus élevée à la plus basse (elle peut être négative). Dans le cas des event listeners, cette priorité est définie dans le fichier config/services.yaml :

```yaml
parameters:

services:
    # ...

    App\EventListener\CustomListener:
        tags:
            - { name: kernel.event_listener, event: kernel.request, priority: 20 }
```

```sh
Registered Listeners for "kernel.request" Event
===============================================

------- --------------------------------------------------------------------------------------- ----------
Order   Callable                                                                                Priority 
------- --------------------------------------------------------------------------------------- ----------
#1      Symfony\Component\HttpKernel\EventListener\DebugHandlersListener::configure()           2048
#2      Symfony\Component\HttpKernel\EventListener\ValidateRequestListener::onKernelRequest()   256
#3      Symfony\Component\HttpKernel\EventListener\SessionListener::onKernelRequest()           128
#4      Symfony\Component\HttpKernel\EventListener\LocaleListener::setDefaultLocale()           100
#5      Symfony\Component\HttpKernel\EventListener\RouterListener::onKernelRequest()            32
#6      App\EventListener\CustomListener::onKernelRequest()                                     20
#7      Symfony\Component\HttpKernel\EventListener\LocaleListener::onKernelRequest()            16
------- --------------------------------------------------------------------------------------- ----------
```

Notre event listener sera maintenant exécuté en sixième position.

Il existe différentes manières d'écouter un événement, mais les event listeners sont plus faciles à manipuler entre les projets. En effet, il est possible d'utiliser un même event listener sur plusieurs projets, mais que celui-ci écoute des événements différents, car sa configuration est déportée dans le fichier config/services.yaml. Il suffira donc de changer la configuration sans toucher au code de l'event listener.

## Créer un event subscriber

Une autre manière d'écouter un événement existe : il s'agit des event subscribers. Celle-ci peut être plus simple à mettre en place, car elle ne nécessite pas de configurer Symfony par le biais du fichier config/services.yaml.

Afin de créer un event subscriber, contrairement à un event listener, nous pouvons nous appuyer sur le composant Maker pour nous faciliter la tâche, grâce à la commande php bin/console make:subscriber.

```sh
Choose a class name for your event subscriber (e.g. ExceptionSubscriber):
> CustomSubscriber

Suggested Events:
* console.command (Symfony\Component\Console\Event\ConsoleCommandEvent)
* console.error (Symfony\Component\Console\Event\ConsoleErrorEvent)
* console.terminate (Symfony\Component\Console\Event\ConsoleTerminateEvent)
* kernel.controller (Symfony\Component\HttpKernel\Event\ControllerEvent)
* kernel.controller_arguments (Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent)
* kernel.exception (Symfony\Component\HttpKernel\Event\ExceptionEvent)
* kernel.finish_request (Symfony\Component\HttpKernel\Event\FinishRequestEvent)
* kernel.request (Symfony\Component\HttpKernel\Event\RequestEvent)
* kernel.response (Symfony\Component\HttpKernel\Event\ResponseEvent)
* kernel.terminate (Symfony\Component\HttpKernel\Event\TerminateEvent)
* kernel.view (Symfony\Component\HttpKernel\Event\ViewEvent)

What event do you want to subscribe to?:
> kernel.request

created: src/EventSubscriber/CustomSubscriber.php

        
Success! 
        

Next: Open your new subscriber class and start customizing it.
Find the documentation at https://symfony.com/doc/current/event_dispatcher.html#creating-an-event-subscriber
```

La commande crée automatiquement la classe et la configure pour écouter l'événement que nous avons choisi. Remplaçons rapidement le nom de l'événement kernel.request par son FQCN, en utilisant la propriété statique ::class de la classe, ici \Symfony\Component\HttpKernel\Event\RequestEvent, et dumpons l'événement :

```php
<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class CustomSubscriber implements EventSubscriberInterface
{
    public function onKernelRequest(RequestEvent $event)
    {
        dd($event);
    }

    public static function getSubscribedEvents()
    {
        return [
            RequestEvent::class => 'onKernelRequest',
        ];
    }
}
```

La méthode getSubscribedEvents() liste les événements écoutés et les méthodes associées. Cela permet de définir plusieurs événements et plusieurs méthodes dans la même classe, dans le cas où nous souhaiterions exécuter le même code sur plusieurs événements.

Si vous avez toujours l'event listener de la partie précédente déclaré dans le fichier config/services.yaml, n'oubliez pas de commenter la configuration afin qu'il n’interfère pas avec l'exécution du subscriber.

Si nous tentons d'afficher la page, nous obtenons la même chose que précédemment. Mais si nous lançons la commande php bin/console debug:event-dispatcher kernel.request, nous obtenons le résultat suivant :

```sh
Registered Listeners for "kernel.request" Event
===============================================

------- --------------------------------------------------------------------------------------- ----------
Order   Callable                                                                                Priority 
------- --------------------------------------------------------------------------------------- ----------
#1      Symfony\Component\HttpKernel\EventListener\DebugHandlersListener::configure()           2048
#2      Symfony\Component\HttpKernel\EventListener\ValidateRequestListener::onKernelRequest()   256
#3      Symfony\Component\HttpKernel\EventListener\SessionListener::onKernelRequest()           128
#4      Symfony\Component\HttpKernel\EventListener\LocaleListener::setDefaultLocale()           100
#5      Symfony\Component\HttpKernel\EventListener\RouterListener::onKernelRequest()            32
#6      Symfony\Component\HttpKernel\EventListener\LocaleListener::onKernelRequest()            16
#7      App\EventSubscriber\CustomSubscriber::onKernelRequest()                                 0
------- --------------------------------------------------------------------------------------- ----------
```

Si nous souhaitons définir la priorité d'un event subscriber, nous pouvons le faire directement dans la méthode getSubscribedEvents() :

```php
<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CustomSubscriber implements EventSubscriberInterface
{
    public function onKernelRequest(RequestEvent $event)
    {
        dd($event);
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 20],
        ];
    }
}
```

## Méthode isMainRequest()

L'affichage d'une page engendre toujours l'exécution d'une requête principale, et parfois de sous-requêtes. Il se peut donc que vos listeners et subscribers soient exécutés plusieurs fois. Il est possible de vérifier directement à partir de l'événement récupéré, qu'il s'agisse de la requête principale ou non (cette méthode est disponible aussi bien avec un event listener qu'avec un event subscriber).

```php
<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CustomSubscriber implements EventSubscriberInterface
{
    public function onKernelRequest(RequestEvent $event)
    {
        if (!$event->isMainRequest()) {
            return;
        }

        // ...
    }
}
```

# Créer l'événement

Malheureusement, il n'existe pas de commande dans le composant Maker qui nous permette de créer un événement facilement. Mais étant donné qu'il s'agit d'une simple classe PHP, cela reste très simple à mettre en place. Dans notre cas de test, nous allons créer un événement UserCreatedEvent, que nous pourrons dispatcher au moment de l'inscription, par exemple. Afin de respecter les bonnes pratiques, cette classe sera stockée dans le répertoire src/Event/.

```php
<?php // src/Event/UserCreatedEvent.php

namespace App\Event;

use Symfony\Contracts\EventDispatcher\Event;

class UserCreatedEvent extends Event
{
    protected $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}
```

Notre événement contient l'adresse e-mail du compte créé. Étant donné qu'il s'agit d'une simple classe PHP, nous sommes libres de choisir ce qui sera stocké dans la classe. Il peut s'agir d'une seule valeur, par exemple un objet User, ou même de plusieurs valeurs. Dans ce cas, il y aura plusieurs attributs à notre classe. Seule obligation : n'oubliez pas d'étendre la classe Symfony\Contracts\EventDispatcher\Event.

## Dispatcher l'événement

Afin de dispatcher notre événement depuis un contrôleur ou un service, nous pouvons nous appuyer sur un service mis à disposition par le composant EventDispatcher, par le biais de l'utilisation de l'interface Symfony\Component\EventDispatcher\EventDispatcherInterface. Pour cela, nous allons simplement l'injecter à la méthode de contrôleur :

```php
<?php // src/Controller/DefaultController.php

namespace App\Controller;

use App\Event\UserCreatedEvent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function index(EventDispatcherInterface $dispatcher): Response
    {
        // ...

        $event = new UserCreatedEvent($user->getEmail());
        $dispatcher->dispatch($event);

        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }
}
```

Dans cet exemple, la variable $user contient un objet dont la méthode getEmail() permet de récupérer l'e-mail. Il peut s'agir d'une entité ou d'un objet quelconque. Dispatcher un événement se fait donc en deux étapes :

- On crée un objet Event, ici UserCreatedEvent plus exactement,

- Puis, on le dispatch grâce à la méthode dispatch() du service injecté.

## Créer l'event subscriber

Maintenant que nous avons dispatché notre événement personnalisé, nous pouvons créer un subscriber grâce à la commande du composant Maker, php bin/console make:subscriber TestSubscriber App\\Event\\UserCreatedEvent :

```php
<?php

namespace App\EventSubscriber;

use App\Event\UserCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserSubscriber implements EventSubscriberInterface
{
    public function onUserCreatedEvent(UserCreatedEvent $event)
    {
        dd($event->getEmail());
    }

    public static function getSubscribedEvents()
    {
        return [
            UserCreatedEvent::class => 'onUserCreatedEvent',
        ];
    }
}
```

Si nous tentons d'afficher la page qui dispatch l'événement, nous voyons donc l'e-mail s'afficher correctement. Nous pouvons alors choisir ce que nous voulons en faire, que ce soit logger l'information dans un fichier ou envoyer un e-mail pour notifier l'utilisateur.

# Fixtures

## Installation

In Symfony 4 or higher applications that use Symfony Flex, open a command console, enter your project directory and run the following command:

    composer require --dev orm-fixtures

## Writing Fixtures

Data fixtures are PHP classes where you create objects and persist them to the database.

Imagine that you want to add some Product objects to your database. No problem! Create a fixtures class and start adding products:

