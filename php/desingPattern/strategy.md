Le patron de conception Strategy se rapproche beaucoup de l'injection de dépendance.

La différence principale est que, dans le cas de l'injection de dépendance, 
nous n'avons pas la possibilité de changer l'implémentation de cette interface durant l'exécution de notre script. 
À l'inverse, dans le cas de Strategy, nous allons pouvoir le faire.
```php
<?php

interface ConnectionInterface
{
    public function getResult(string $query);
}

class PDOConnection implements ConnectionInterface {
    public function getResult(string $query)
    {
        echo 'Results for query with PDOConnection <br/>';
    }
}

class MySQLiConnection implements ConnectionInterface {
    public function getResult(string $query)
    {
        echo 'Results for query with MySQLiConnection <br/>';
    }
}

class Manager
{
    private $connection;

    public function __construct(ConnectionInterface $connection)
    {
        $this->connection = $connection;
    }

    public function setConnection(ConnectionInterface $connection)
    {
        $this->connection = $connection;
    }

    public function query(string $query)
    {
        return $this->connection->getResult($query);
    }
}

$PDO = new PDOConnection();
$MySQLi = new MySQLiConnection();

// Nous initialisons notre manager avec une connexion PDO
$manager = new Manager($PDO);
$manager->query('foo bar');

// ...

// Il nous est possible de modifier la connexion pour désormais utiliser MySQLi
$manager->setConnection($MySQLi);
$manager->query('foo bar');
?>
```