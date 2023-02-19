```php
<?php
preg_match($pattern, $subject, $matches=null, $flags=null, $offset=0):

?>
```

$pattern = chaîne à chercher,

$subject = chaîne dans laquelle chercher,

$matches = tableau dans lequel retourner les résultats (optionnel),

$flags = options pour le retour des résultats (optionnel),

offset = spécifie une position pour le début de la recherche (optionnel).

```php
<?php
$subject = '0123456789';
$search = '456';
$pattern = "/$search/";

if (preg_match($pattern, $subject)) {
  echo "$search est présent dans $subject";
} else {
  echo "$search n'est pas présent dans $subject";
}
?>
```
456 est présent dans 0123456789

```php
<?php 
$subject = '0123456789';
$search = '456';
$pattern = "/$search/";

$offset = 5;

if (preg_match($pattern, $subject, $matches, null, $offset)) {
    echo "$search est présent dans ".substr($subject, $offset);
} else {
    echo "$search n'est pas présent dans ".substr($subject, $offset);
}

?>
```
456 n'est pas présent dans 56789


```php
<?php 

$subject = 'chaîner enchaîner enchaînement';
$pattern = '/enchaîner|enchaînement/';

preg_match_all($pattern, $subject, $matches);

var_dump($matches);

?>
```
array(1) {
  [0]=>
  array(2) {
    [0]=>
    string(10) "enchaîner"
    [1]=>
    string(13) "enchaînement"
  }
}
```php
<?php 

$subject = 'chaîner enchaîner enchaînement';
$pattern = '/enchaîn(er|ement)/';

preg_match_all($pattern, $subject, $matches);

var_dump($matches);

?>
```
array(2) {
  [0]=>
  array(2) {
    [0]=>
    string(10) "enchaîner"
    [1]=>
    string(13) "enchaînement"
  }
  [1]=>
  array(2) {
    [0]=>
    string(2) "er"
    [1]=>
    string(5) "ement"
  }
}
```php
<?php 
$password = 'aaazerty zerty';
$pattern = '/a?zerty/';

preg_match_all($pattern, $password, $matches);

var_dump($matches);
?>
```
array(1) {
  [0]=>
  array(2) {
    [0]=>
    string(6) "azerty"
    [1]=>
    string(5) "zerty"
  }
}

```php
<?php 
$subject = 'john@doe.com';
$pattern = '/@+/';

if (preg_match($pattern, $subject)) {
  echo "$subject semble être une adresse email valide";
}
?>
```
john@doe.com semble être une adresse email valide

```php
<?php 
$password = 'aaazerty';
$pattern = '/a*zerty/';

preg_match($pattern, $password, $matches);

var_dump($matches);
?>
```
array(1) {
  [0]=>
  string(8) "aaazerty"
}

```php
<?php 
$password = 'zerty azerty aazerty aaazerty aaaazerty';
$pattern = '/a{2,4}zerty/';

preg_match_all($pattern, $password, $matches);

var_dump($matches);
?>
```
array(1) {
  [0]=>
  array(3) {
    [0]=>
    string(7) "aazerty"
    [1]=>
    string(8) "aaazerty"
    [2]=>
    string(9) "aaaazerty"
  }
}


---------------------------------- Complément 

? est équivalent à {0,1}

+ est équivalent à {1,}

* est équivalent à {0,}
```php
<?php 
$subject = 'azerty azazerty boerty erty';
$pattern = '/(az|bo){1,2}erty/';

preg_match_all($pattern, $subject, $matches);

var_dump($matches);
?>
```
array(2) {
  [0]=>
  array(3) {
    [0]=>
    string(6) "azerty"
    [1]=>
    string(8) "azazerty"
    [2]=>
    string(6) "boerty"
  }
  [1]=>
  array(3) {
    [0]=>
    string(2) "az"
    [1]=>
    string(2) "az"
    [2]=>
    string(2) "bo"
  }
}

```php
<?php
$password = '123456789 abcdefghijklmnopqrstuvwxyz';
$pattern = '/[789]|[lmnop]/';

preg_match_all($pattern, $password, $matches);

var_dump($matches);
?>
```
array(1) {
  [0]=>
  array(8) {
    [0]=>
    string(1) "7"
    [1]=>
    string(1) "8"
    [2]=>
    string(1) "9"
    [3]=>
    string(1) "l"
    [4]=>
    string(1) "m"
    [5]=>
    string(1) "n"
    [6]=>
    string(1) "o"
    [7]=>
    string(1) "p"
  }
}

```php
<?php 
$password = '123456789 abcdefghijklmnopqrstuvwxyz';
$pattern = '/[7-9]|[l-p]/';

preg_match_all($pattern, $password, $matches);

var_dump($matches);
?>
```
array(1) {
  [0]=>
  array(8) {
    [0]=>
    string(1) "7"
    [1]=>
    string(1) "8"
    [2]=>
    string(1) "9"
    [3]=>
    string(1) "l"
    [4]=>
    string(1) "m"
    [5]=>
    string(1) "n"
    [6]=>
    string(1) "o"
    [7]=>
    string(1) "p"
  }
}

```php
<?php 

$password = '123456789';
$pattern = '/[^7-9]/';

preg_match_all($pattern, $password, $matches);

var_dump($matches);

?>
```
array(1) {
  [0]=>
  array(6) {
    [0]=>
    string(1) "1"
    [1]=>
    string(1) "2"
    [2]=>
    string(1) "3"
    [3]=>
    string(1) "4"
    [4]=>
    string(1) "5"
    [5]=>
    string(1) "6"
  }
}

```php
<?php 
$string = 'recherche des caracteres autres qu\'alphanumerique !';
$pattern = '/\W/';

preg_match_all($pattern, $string, $matches);

var_dump($matches);

?>
```
array(1) {
  [0]=>
  array(7) {
    [0]=>
    string(1) " "
    [1]=>
    string(1) " "
    [2]=>
    string(1) " "
    [3]=>
    string(1) " "
    [4]=>
    string(1) "'"
    [5]=>
    string(1) " "
    [6]=>
    string(1) "!"
  }
}

```php
<?php 
$string = '456789 123456789';
$pattern = '/^123/';

preg_match($pattern, $string, $matches);

var_dump($matches);
?>
```
array(0) {
}

```php
<?php 
$string = '123456789 123456789';
$pattern = '/123$/';

preg_match($pattern, $string, $matches);

var_dump($matches);
?>

array(0) {
}
```