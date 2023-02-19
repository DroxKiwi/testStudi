GESTION D'ERREUR

En début de script
```php
<?php

ini_set('display_errors', 'off');
?>
```
Dans le fichier de configuration du serveur : php.ini.
```php
<?php
display_errors = Off;
ou
environnement=production;
?>
```

Grâce à cette configuration, 
les erreurs sont automatiquement affichées dans un environnement de développement et cachées en production pour l'utilisateur.

```php
<?php

function firstFunction($sales, $charges) {
    return secondFunction($sales, $charges);
}

function secondFunction($sales, $charges) {
    return getProfit($sales, $charges);
}

function getProfit($sales, $charges) {
    if ($sales < $charges) {
        throw new Exception('Attention le résultat est négatif');
    }

    return $sales - $charges;
}

echo '<pre>';

echo firstFunction(10, 15);

?>
```
Retourne une erreur, celle ci remonte l'arborescence des fonctions parents

Fatal error:  Uncaught Exception: Attention le résultat est négatif in index.php:13

Stack trace:
#0 index.php(8): getProfit(10, 15)
#1 index.php(4): secondFunction(10, 15)
#2 index.php(21): firstFunction(10, 15)
#3 {main}
  thrown in index.php on line 13


GESTION D'EXCEPTION 
```php
<?php
try {
  // Code à tester, où est déclenchée l'exception.
  } catch (Exception $e) {
  // Code à exécuter si l'exception est attrapée.
  }
?>
```