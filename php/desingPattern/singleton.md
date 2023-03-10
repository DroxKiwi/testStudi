Voici l'implémentation d'un Singleton qui permettrait d'écrire dans un fichier de log :
```php
<?php

class Logger
{
    // On stockera l'instance du Singleton dans la propriété instance */
    private static $instance;

    /**
     * Le constructeur et la méthode de clonage doivent être privés afin de ne pas pouvoir
     * instancier notre Singleton via un new Logger(); ni de cloner une instance existante
     */
    private function __construct() {}
    private function __clone() {}

    /**
     * La méthode statique qui nous permet de générer l'instance unique de notre
     * Singleton ou de la retourner si elle a déjà été créée
     */
    public static function getInstance(): self
    {
        // On vérifie que notre Singleton n'a pas déjà été instancié
        if (!isset(static::$instance)) {
            /**
             * S'il n'a pas encore été instancié, alors on crée la nouvelle 
             * instance et on la stocke dans la propriété statique $instance
             */
            static::$instance = new static;
        }

        /**
         * On retourne l'instance unique de notre Singleton
         */ 
        return static::$instance;
    }

    public function logToFile(string $data): void
    {
        // code métier de votre Singleton, ici on loggerait les données fournies
    }
}

$logger1 = Logger::getInstance();
$logger2 = Logger::getInstance();

if ($logger1 === $logger2) {
    echo "C'est bien le même objet instancié une seule fois";
}

?>
```

Les références statiques avec static sont résolues en utilisant la classe qui a été appelée.
```php
<?php
class A {
    public static function qui() {
        echo “classe A”;
    }
    public static function test() {
        self::qui();
    }
}

class B extends A {
    public static function qui() {
         echo “classe B”;
    }
}

B::test(); // retourne “classe A”

class C {
    public static function qui() {
        echo “classe C”;
    }
    public static function test() {
        static::qui(); // Ici, résolution à la volée
    }
}

class D extends C {
    public static function qui() {
         echo “classe D”;
    }
}
D::test(); // retourne “classe D”
?>
```


Voici une utilisation du design pattern qui retourne une instance unique de la classe PDO, 
permettant de communiquer avec une base de données :

```php
<?php

class PDOSingleton
{
    private static PDO $instance;

    private function __construct() {}
    private function __clone() {}

    public static function getInstance(): PDO
    {
        if (!isset(self::$instance)) {
            self::$instance = new PDO('mysql:host=localhost;dbname=dbname;charset=utf8', 'root', '');
        }

        return self::$instance;
    }
}

$pdo = PDOSingleton::getInstance();
?>
```


Partons d’une application qui gère des utilisateurs , ces utilisateurs ont chacun une adresse, 
cette adresse est une composante de plusieurs variables. Le développement sans patron de conception commencerait de la sorte.
```php
<?php
class Address
{
    private $number;
    private $street;
    private $zipcode;
    private $city;

    public function __construct($number, $street, $zipcode, $city)
    {
        $this->number = $number;
        $this->street = $street;
        $this->zipcode = $zipcode;
        $this->city = $city;
    }
}

class Person
{
private $address;

    public function __construct($number, $street, $zipcode, $city)
    {
        $this->address = new Address($number, $street, $zipcode, $city);
    }
}

$person = new Person(4, 'chemin du village', 11110, 'Narbonne city');

?>
```


Le problème est que la classe Person est étroitement liée à la classe Adress, 
la classe personne est même inutilisable sans la classe adresse. 
De plus, imaginons que l’on souhaite ajouter une variable à la classe Adress, 
par exemple $country, il faudra aussi modifier le constructeur de la classe Person et lui rajouter un paramètre. 
La solution pour éviter toutes ses manipulations et l’injection de dépendance.
```php
<?php
class Person
{
    private $address;

    public function __construct(Address $address)
    {
        $this->address = $address;
    }
}
?>
```

Les interfaces permettent de créer un modèle que les classes qui l'implémentent doivent respecter. 
Il faut voir l’interface comme un contrat d’utilisation. En implémentant une interface, 
une classe s’oblige à définir l’ensemble de ses méthodes.

```php
<?php 
interface IMonInterfaceStatic 
{   
        static function staticFonc1($name);   
        static function staticFonc2($firstName);  
} 
  
class MaClasse implements IMonInterface  
{    
        public function Fonc1($name);   
        {    
               echo $name;   
        } 
        public function fonc2($firstName)   
        {    
               echo $firstName;   
        }  
} 
?>
```

Toujours avec une connexion à une base de données, avec ce design, 
il est par exemple possible d'injecter une interface qui sera par la suite implémentée afin de créer différents types de connexions.

```php
<?php

interface ConnectionInterface
{
    public function getResult(string $query): array;
}

class Manager
{
    private ConnectionInterface $connection;

    public function __construct(ConnectionInterface $connection)
    {
        $this->connection = $connection;
    }

    public function query(string $query): array
    {
        return $this->connection->getResult($query);
    }
}
?>
```

Il ne reste plus qu'à créer une instance de connexion et la passer au constructeur du manager :

```php
<?php

class PDOConnection implements ConnectionInterface {
// code de la classe PDOConnection
}
 
class MySQLiConnection implements ConnectionInterface {
// code de la classe MySQLiConnection
}

// Une classe qui implémente ConnectionInterface et se base sur PDO
$PDO = new PDOConnection();
$pdoManager = new Manager($PDO);

// Une classe qui implémente ConnectionInterface et se base sur MySQLi
$MySQLi = new MySQLiConnection();
$mySqliManager = new Manager($MySQLi);

?>
```