# Qu'est-ce que PDO ?

PDO est une interface orientée objet qui permet de communiquer avec une base de données de manière uniforme, quel que soit son moteur. Ainsi, les méthodes à appeler seront toujours les mêmes, ce qui facilite grandement le travail : seule la syntaxe des requêtes pourra changer d'un moteur à l'autre.

En interne, PDO fonctionne grâce à un système de drivers. Il existe un driver par moteur de base de données et, au moment de la connexion, PDO s'occupe de charger le driver correspondant. Cette opération est transparente pour le développeur, qui ne manipulera qu'un objet de type PDO dans tous les cas.

![alt](pdo.png)

# DataSourceName

Le DataSourceName (ou DSN) est une sorte d'adresse de notre base de données : c'est une chaîne de caractères contenant toutes les informations nécessaires pour se connecter, comme le login, le mot de passe, l'adresse IP du serveur, etc.

Un DSN est composé d'un préfixe et de plusieurs attributs possédant chacun une valeur, et qui sont séparés par des points-virgules. Le format final d'un DSN est donc : prefixe:clef1=valeur1;clef2=valeur2.

## Le préfixe

Le préfixe désigne le moteur de base de données qui sera utilisé, et donc le driver que l'objet PDO devra charger.

Chaque moteur est identifié par une chaîne de caractères qui lui est propre. Par exemple, pour utiliser PDO avec une base de données MySQL, le DSN devra être préfixé par mysql. En revanche, pour utiliser une base de données PostgreSQL, il faudra utiliser le préfixe pgsql. Tous les préfixes devront ensuite être suivis par deux points pour les séparer des attributs.

En cas de doute, la liste complète des drivers supportés par PDO, et leurs préfixes associés, est disponible dans la documentation PHP des drivers PDO.

## Les attributs

Les attributs représentent les informations de connexion et leur valeur. Ils sont représentés par un ensemble de mots-clefs associés à une valeur via le symbole égal (=) et séparés par des points-virgules.

Ces attributs sont le plus souvent l'hôte, qui aura pour valeur l'adresse IP du serveur hébergeant notre base de données, le nom de la base de données avec laquelle nous souhaitons interagir, le nom de l'utilisateur et le mot de passe de connexion.

Cette liste d'attributs de base est une liste indicative : les attributs à fournir pour pouvoir se connecter, ainsi que leurs noms, peuvent changer d'un moteur à un autre. Il est donc important de vérifier dans la documentation quels sont les attributs nécessaires à la connexion.

## Exemples de DSN

Pour se connecter à une base de données PostgreSQL, la documentation indique que le préfixe est pgsql et qu'il y a besoin des attributs host, port, dbname, user et password. Le DSN aura donc la forme : pgsql:host=localhost;port:5432;dbname=nomBDD;user=utilisateur;password=motDePasse.

On remarque l'utilisation de localhost à la place de l'adresse IP : cela signifie simplement que notre base de données est hébergée sur le même serveur que notre application.

Dans le cas d'une base de données DB2 IBM, la documentation indique un préfixe ibm et les attributs database, hostname, port, username et password, mais aussi la présence des champs protocol et driver, qui ont des valeurs fixes. Le DSN aura donc la forme :

ibm:DRIVER={IBM DB2 ODBC DRIVER};DATABASE=testdb;HOSTNAME=localhost;PORT=50000;PROTOCOL=TCPIP;UID=utilisateur;PWD=motDePasse.

Il existe des cas, comme pour les bases de données MySQL, où le nom d'utilisateur et le mot de passe ne font pas partie du DSN, mais doivent être spécifiés ailleurs. Il faut donc toujours vérifier dans la documentation pour savoir comment former un DSN pour un moteur donné.

# Créer un objet PDO

Pour se connecter à notre base, il faut créer une instance de la classe PDO en lui fournissant le DSN dans le constructeur. Par exemple, pour se connecter à une base de données PostgreSQL, il faut créer un objet PDO avec un DSN sous la forme :

```php
<?php

$pdo = new PDO('pgsql:host=localhost;port=5432;dbname=nomBDD;user=utilisateur;password=motDePasse';
```

Le constructeur accepte également 3 autres arguments facultatifs : les identifiants (login et mot de passe), qui ne doivent être renseignés que s'ils ne sont pas présents dans le DSN, et un tableau d'options, qui dépendent du moteur de base de données. Par exemple, pour se connecter à une base de données MySQL dont les identifiants de connexion ne sont pas dans le DSN, il faudra rajouter ces informations dans le constructeur :

```php
<?php

$pdo = new PDO('mysql:dbname=nomBDD;host=localhost', 'utilisateur', 'motDePasse');
```

## Gérer les erreurs

En cas de problème lors de la connexion, le constructeur va lancer une exception de type PDOException. Pour gérer ce cas d'erreur, il faut donc enfermer la création de chaque nouvelle instance dans un bloc try et catch l'exception.

```php
<?php

try {
    $pdo = new PDO('mysql:dbname=nomBDD;host=localhost', 'utilisateur', 'motDePasse');
} catch (PDOException $e) {
    // Gestion de l'exception
}
```

## Risque de sécurité

Si cette exception n'est pas attrapée, elle risque d'afficher un message d'erreur comportant les données de connexion à la base de données (comme le DSN ou le login/mot de passe fourni). Ces informations très sensibles et leur affichage représentent une très importante faille de sécurité. Il est donc recommandé de toujours catch les PDOException et de ne jamais les throw directement. Il est également recommandé de masquer l'affichage des messages d'erreur sur les serveurs de production pour éviter tout risque.

## Déconnexion et connexions persistantes

Une fois l'objet créé et la connexion effectuée, elle sera automatiquement fermée lorsque le destructeur de l'objet sera appelé : soit si l'objet est détruit manuellement, soit automatiquement à la fin du script.

```php
<?php

$pdo = new PDO('mysql:dbname=nomBDD;host=localhost', 'utilisateur', 'motDePasse');
$pdo = null; //Déconnexion

$pdo2 = new PDO('mysql:dbname=nomBDD;host=localhost', 'utilisateur', 'motDePasse');
// Fin du script : déconnexion automatique
```

Pour garder la connexion ouverte entre les différents scripts, il est possible de créer une connexion persistante. Ainsi, plutôt que de se fermer automatiquement, la connexion restera ouverte et, au prochain appel d'une connexion avec le même DSN, c'est la connexion précédemment ouverte qui sera utilisée au lieu d'en créer une nouvelle.

Cela se fait en utilisant l'option PDO::ATTR_PERSISTENT au moment de l'ouverture de la connexion.

```php
<?php

// Le tableau d'options est le 4ème paramètre du constructeur
$pdo = new PDO('mysql:dbname=nomBDD;host=localhost', 'utilisateur', 'motDePasse', [PDO::ATTR_PERSISTENT => true]);
```

Tous les moteurs de base de données ne sont pas compatibles avec cette option. De plus, d'autres moteurs peuvent n'autoriser qu'un certain nombre de connexions en parallèle, limite qui serait atteinte rapidement en utilisant des connexions persistantes, ce qui provoquerait des erreurs de connexion. Cette solution ne doit être envisagée que dans certains cas où la connexion à la base de données est très lente, et son utilisation doit être surveillée attentivement.

## Lancer une requête

Il existe plusieurs méthodes permettant d'exécuter des requêtes via PDO. Celle que nous allons utiliser pour le CREATE DATABASE est également la plus simple : la méthode exec().

Cette méthode permet de lancer une requête et retourne le nombre de lignes qui ont été affectées. Elle peut également retourner false si la requête a échoué. Ainsi, si on envoie une requête UPDATE, cette méthode retournera le nombre de lignes qui ont été modifiées.

Dans le cas d'une création de base de données, ce nombre n'a pas d'importance : nous devons simplement nous assurer qu'un booléen n'est pas reçu.

```php
<?php
try {
    // Exemple avec une base de données MySQL avec les identifiants par défaut
    $pdo = new PDO('mysql:host=localhost', 'root', '');
    if ($pdo->exec('CREATE DATABASE testBdd') !== false) {
        echo 'Base de données créée';
    } else {
        echo 'Une erreur est survenue';
    }
} catch (PDOException $e) {
    //Gestion de l'erreur de connexion
}
```

# Notre premier but va être d'afficher la liste de tous les utilisateurs dans notre application PHP.

![alt](recuperer-donnees-table.png)

Lancer une requête SELECT

La manière la plus simple de récupérer des données depuis une base de données grâce à PDO est d'utiliser la méthode query. Elle prend en paramètres une requête SQL et un mode de récupération et retourne le résultat de la requête sous un format qui dépend du mode choisi.

Pour le moment, nous allons utiliser le mode PDO::FETCH_ASSOC, qui signifie que chaque ligne de données sera sous forme de tableau associatif dont les clés ont le même nom que les colonnes récupérées dans le SELECT.

![alt](recuperer-donnees-tableaux.png)

Il suffit ensuite de boucler sur les résultats pour manipuler chaque ligne. Pour cela, il est possible d'utiliser la méthode query directement dans un foreach :

```php
<?php
// Initialisation de l'objet PDO, construction de la requête...
foreach ($pdo->query($sqlRequest, PDO::FETCH_ASSOC) as $row) {
    // Ici, la variable $row est un tableau associatif
}
```
Pour afficher la liste de tous nos utilisateurs, il suffit d'envoyer une requête de sélection sur la table User et de boucler sur le résultat. Par exemple, le code suivant permet d'afficher les noms et e-mails de chaque utilisateur :

```php
<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=php_app', 'root', '');
    foreach ($pdo->query('SELECT name, email FROM users', PDO::FETCH_ASSOC) as $user) {
        echo $user['name'].' '.$user['email'].'<br>';
    }
} catch (PDOException $e) {
    echo 'Impossible de récupérer la liste des utilisateurs';
}
```

Il est possible d'utiliser la méthode query() pour des requêtes qui ne sont pas des requêtes de sélection, mais dans ce cas, le résultat sera vide. Pour les autres requêtes, il est recommandé d'utiliser exec(), qui retourne le nombre de lignes affectées.

## Jointures et alias

Chaque clé du tableau associatif est basée sur le champ présent dans le SELECT et non pas sur le nom de la colonne de la table. Même si, dans de nombreux cas, ces deux valeurs sont similaires, cela signifie qu'il est possible de changer les colonnes du tableau grâce à l'utilisation d'alias dans le SELECT.

```php
<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=php_app', 'root', '');
    // On utilise un alias, grâce au mot-clé AS
    foreach ($pdo->query('SELECT name AS nom, email AS adresse FROM users', PDO::FETCH_ASSOC) as $user) {
        // Ici, on utilise le nom de l'alias et non celui de la colonne
        echo $user['nom'].' '.$user['adresse'].'<br>';
    }
} catch (PDOException $e) {
    echo 'Impossible de récupérer la liste des utilisateurs';
}
```

Or, dans un tableau associatif, il ne peut pas y avoir deux clés ayant le même nom. Cela signifie que, si dans la requête SELECT deux colonnes portent le même nom, alors l'une d'entre elles sera écrasée. Par exemple, admettons que nos utilisateurs puissent appartenir à un groupe et que chaque groupe possède son propre nom :

![alt](recuperer-donnees-jointure.png)

La jointure entre ces deux tables, issue de la requête SELECT * FROM users JOIN groups ON groups.id = users.groupId, devrait comporter 7 colonnes. Or, le tableau associatif généré par PDO n'en contiendra que 5 : les clés id et name sont écrasées.

![alt](recuperer-donnees-clef-ecrasees.png)

Pour éviter cette perte de données, il est possible de renommer les champs en double en utilisant des alias. Ainsi, on peut renommer les champs ayant un nom identique grâce à la requête :

```sql
SELECT 
    users.id AS userId, 
    users.name as userName, 
    users.password, 
    users.email, users.groupId, 
    groups.* 
FROM users 
JOIN groups ON groups.id = users.groupId
```

# Les limites de query

Améliorons un peu notre liste d'utilisateurs en ajoutant un champ de recherche sur notre application : un utilisateur pourra ainsi en rechercher un autre par son nom. Nous allons donc devoir améliorer notre requête SELECT pour lui ajouter une clause WHERE permettant de filtrer les résultats.

Pour cela, nous allons utiliser l'opérateur LIKE et injecter la valeur saisie par l'utilisateur, suivie d'un symbole %. Ainsi, en recherchant simplement « a », le résultat sera la liste de tous les utilisateurs dont le nom commence par la lettre « a ».

En utilisant la méthode query, cela donne le code suivant :

```php
<?php
$pdo->query('SELECT * FROM users WHERE name LIKE \''.$_GET['search'].'%\'', PDO::FETCH_ASSOC);
```

Cette requête fonctionne pour les recherches simples, mais si l'utilisateur recherche un terme comportant un apostrophe, elle ne sera plus valide et soulèvera une erreur. Pire, un utilisateur malintentionné pourrait utiliser cette faiblesse pour faire de l'injection SQL et manipuler notre base de données.

Nous allons donc devoir gérer nous-mêmes l'échappement des caractères. Le problème est que sa syntaxe dépend du SGBD : certains permettent de doubler l'apostrophe, mais d'autres acceptent également l'antislash, ce qui en fait un processus plus complexe à mettre en place, qu'il faudra répéter pour chaque requête.

Heureusement, PDO peut gérer ça, pour nous, grâce aux requêtes préparées.

$_GET est un tableau de données associatif et super globale qui va permettre de faire passer des informations de page en page grâce à l’url.

## Les injections SQL

Une injection SQL (« Structured Query Language », langage de requête structurée ) représente un type de cyberattaque. Le pirate effectuant cette attaque va modifier une requête SQL en cours en injectant un “morceau” de requête, pour manipuler une base de données et accéder à des informations importantes.

Il s’agit d’un des genres d’attaques les plus populaires et menaçants, car il peut être utilisé pour nuire à n'importe quelle application ou site Web qui dispose d’une base de données SQL.L'injection SQL est uniquement réalisable lorsqu’une requête est générée à partir de données fournies par un utilisateur.

Ces données sont directement exploitées pour construire toute une requête ou seulement une partie. Il peut s’agir d’un insert, un update, une jointure, de conditions de filtrages ou de regroupement.

Grâce à une utilisation adaptée de l'objet PDO pour préparer les requêtes MySQL en PHP, il est impossible pour une personne mal intentionnée de réaliser des injections SQL.

Ci-dessous se trouve une requête nous permettant de sélectionner et d’afficher toutes les données de la table user où le champs username prendra comme valeur le contenu de la variable $username et pass, celui de $password.

```php
$sql = “SELECT * FROM `users` WHERE `username`=’$username’ AND `pass`=$password”;
$requete = $db->query($sql);
$user = $requete->fetchAll();

	var_dump($user);
```

En remplissant la variable $username de la manière suivante, nous exploitons une faille.

```php
$username = “admin’;  --”;
$password = “”;
```

En effet, en procédant de cette façon, ‘--’ permettant de créer un commentaire en langage SQL, tout ce qui se trouve à la suite de celui-ci devient commenter. Nous avons donc accès aux informations concernant l’admin, dont son mot de passe.

```php
 $sql = “SELECT * FROM `users` WHERE `username`=’admin’; --’ AND `pass`=$password”;
```

## Requêtes préparées

Une requête préparée est une requête possédant des paramètres, dans laquelle nous allons injecter des valeurs. Ainsi, plutôt que de former la requête nous-mêmes en utilisant la concaténation de chaînes de caractères, nous allons placer des marqueurs que PDO remplacera par les valeurs au moment de son exécution.

Pour utiliser une requête préparée, il y a deux étapes à respecter : la première est de préparer la requête, c'est-à-dire déclarer une requête possédant des marqueurs ; il faut ensuite exécuter cette requête, en renseignant la valeur des marqueurs.

On peut voir une requête préparée un peu comme une « requête-fonction » : on doit d'abord la déclarer en indiquant les paramètres attendus en entrée, puis l'appeler en renseignant ses paramètres.

L'avantage d'utiliser des requêtes préparées est qu'au moment où PDO va injecter les valeurs dans nos marqueurs, il va échapper automatiquement tous les caractères qui ont besoin de l'être, en utilisant la méthode d'échappement correspondant au driver utilisé.

## Les marqueurs

Il existe deux types de marqueurs que l'on peut utiliser dans une préparation de requête : les marqueurs nommés et les marqueurs interrogatifs.

- Les marqueurs nommés permettent, d'attribuer un nom à chaque paramètre. Ils se déclarent dans la requête grâce à la syntaxe :nomMarqueur. SELECT * FROM users WHERE name LIKE :search

- Les marqueurs interrogatifs, quant à eux, vont se baser sur la position du paramètre plutôt qu'un nom. Ils se déclarent dans la requête grâce à un point d'interrogation. SELECT * FROM users WHERE name LIKE ?

!
Chaque marqueur représente une valeur à part entière. Dans notre condition, nous souhaitons rajouter un % à la fin de notre paramètre, mais ce caractère fera partie de la valeur de notre marqueur. Ainsi, il n'est pas possible d'écrire : SELECT * FROM users WHERE name LIKE :search%.

C'est la valeur du paramètre :search qui contiendra le symbole %.

Il n'est pas non plus possible d'utiliser les marqueurs pour remplacer des noms de colonne ou des opérateurs : seulement des valeurs.
!

## Préparer une requête

Pour préparer une requête, il faut utiliser la méthode prepare de notre objet PDO. Elle prend en paramètre la requête préparée et retourne un objet de type PDOStatement.

Cette méthode n'exécute pas la requête : elle ne fait que la garder en mémoire pour pouvoir la manipuler via le PDOStatement.

## PDOStatement

Un objet PDOStatement est la représentation d'une requête et permet de réaliser toutes les actions que l'on fait habituellement avec une requête : l'exécuter, récupérer le résultat, renseigner les valeurs des marqueurs, récupérer les erreurs, etc.

On peut voir la classe PDO comme une Factory qui va permettre d'instancier des PDOStatement, un par requête que l'on va vouloir exécuter.

Factory est un design pattern permettant de mieux structurer des classes. Le but étant d’obtenir une classe qui va se charger de créer plusieurs objets en utilisant une rédaction plus simple à base de méthodes statiques qui retourneront des instances.

## Renseigner les valeurs des marqueurs

L'objet PDOStatement va nous permettre de renseigner les valeurs de nos marqueurs. Pour cela, il met deux méthodes à notre disposition : bindValue et bindParam.

- Ces deux méthodes, très similaires, prennent deux paramètres obligatoires : le marqueur à remplacer et la valeur à lui attribuer. Le premier paramètre va différer selon le type de marqueur utilisé : pour les marqueurs nommés, il faut passer le nom du marqueur, tandis que pour des marqueurs interrogatifs, il faut passer leur position.

- La différence entre les deux méthodes est subtile, mais à son importance : bindValue va permettre de lier une valeur à un paramètre, tandis que bindParam va lier une variable par référence à un paramètre. Ainsi, avec bindParam, si le paramètre est modifié dans la requête SQL (par exemple, lors d'appels à des procédures stockées), alors la variable PHP sera également modifiée.

- Le troisième paramètre, facultatif mais recommandé, est le type de variable à choisir entre PDO::PARAM_NULL, PDO::PARAM_BOOL, PDO::PARAM_INT et PDO::PARAM_STR. Cela permet d'indiquer à PDO comment formater les valeurs (par exemple, les mettre entre apostrophes dans le cas d'une chaîne de caractères). Par défaut, PDO les considère comme des chaînes de caractères.

Dans les deux cas suivants, nous retrouvons des marqueurs nommés. L’un est utilisé par bindValue, l’autre par bindParam. En effet, dans le premier exemple ci-dessous, lors de l'exécution de la requête, la valeur de $username prise en compte sera ‘Jean’ car elle est rattachée au marqueur de la requête. 

```php
	<?php
  $username = 'Jean';
  $password = '1234';
  // Marqueurs nommés et bindValue:
		$statement = $pdo->prepare(“SELECT * FROM users WHERE `username`=:username AND 
  ` pass`=:pass”);
  $statement->bindValue(':username', $username, PDO::PARAM_STR);
  $statement->bindValue(':pass', $password, PDO::PARAM_STR);
  $username = 'Pierre';
  $statement->execute();
  $user = $requete->fetchAll();
```

Dans le cas contraire qui est le suivant, $username prendra comme valeur ‘Pierre’ lors de l’exécution de la requête car tant que celle-ci n’a pas aboutie, la valeur injectée pourra être modifiée.

```php
	<?php
	$username = 'Jean';
	$password = '1234';
	// Marqueurs nommés et bindParam:
	$statement = $pdo->prepare(“SELECT * FROM users WHERE `username`=:username AND `pass`=:pass”);
	$statement->bindParam(':username', $username, PDO::PARAM_STR);
	$statement->bindParam(':pass', $password, PDO::PARAM_STR);
	$username = 'Pierre';
	$statement->execute();
	$user = $requete->fetchAll();
```

Il s’agit du même fonctionnement avec les marqueurs interrogatifs et les seules données changeante seront :

```php
    // Marqueurs interrogatifs et bindParam:
    $statement = $pdo->prepare(“SELECT * FROM users WHERE `username`=? AND `pass`=?”);
    $statement->bindParam(1, $username, PDO::PARAM_STR);
    $statement->bindParam(2, $password, PDO::PARAM_STR);
```

Il est à noter que bindParam doit obligatoirement avoir une variable en paramètre, puisqu'elle la lie par référence.

!
Contrairement à ce à quoi on commence à être habitué en informatique, la position des marqueurs interrogatifs commence à 1 et non à 0.
!

Les cas d'utilisation de bindParam sont très spécifiques. Dans la majorité des cas, bindValue est amplement suffisant et est plus pratique à manipuler.

## Exécuter la requête

Une fois les paramètres renseignés, nous allons pouvoir exécuter notre requête préparée. Pour cela, il suffit d'utiliser la méthode execute de notre objet PDOStatement. Cette méthode retourne un booléen indiquant si la requête s'est bien déroulée ou non.

En cas d'erreur, la méthode errorInfo permet de récupérer des informations sur l'erreur. Elle retourne un tableau, dont le premier élément est le SQLSTATE (c'est-à-dire le code d'erreur SQL), le second élément est le code d'erreur du driver et le troisième est le message d'erreur.

```php
<?php
$pdo = new PDO('mysql:host=localhost;dbname=intro_pdo', 'root', '');
// Faute de frappe volontaire dans la requête pour tester l'erreur
$statement = $pdo->prepare('ELECT * FROM users WHERE name LIKE :name');
$statement->bindValue(':name', 'a%', PDO::PARAM_STR);
if ($statement->execute()) {
    // La requête s'est bien déroulée
} else {
    $errorInfo = $statement->errorInfo();
    echo 'SQLSTATE : '.$errorInfo[0].'<br>';
    echo 'Erreur du driver : '.$errorInfo[1].'<br>';
    echo 'Message : '.$errorInfo[2];
}
```